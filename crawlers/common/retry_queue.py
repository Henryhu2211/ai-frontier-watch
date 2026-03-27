"""
AI Frontier Watch - Translation Retry Queue

Manages a queue of failed translation tasks with:
- Exponential backoff scheduling
- Persistent storage (JSON file or Redis)
- Daily retry mechanism
- Priority queue support
"""

import json
import logging
from pathlib import Path
from typing import List, Optional, Dict, Any
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta
from enum import Enum
from threading import Lock

logger = logging.getLogger(__name__)


class TaskStatus(Enum):
    """Status of a translation task."""

    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    WILL_RETRY = "will_retry"


@dataclass
class TranslationTask:
    """Represents a translation task in the retry queue."""

    task_id: str  # Unique identifier (url_hash + field)
    article_url: str
    article_hash: str  # URL hash for deduplication
    field: str  # "title", "summary", "content"
    original_text: str
    target_lang: str = "ZH"

    # Scheduling
    priority: int = 0
    attempts: int = 0
    max_attempts: int = 3
    status: TaskStatus = TaskStatus.PENDING
    next_retry_at: Optional[datetime] = None

    # Timestamps
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    # Results
    translated_text: Optional[str] = None
    last_error: Optional[str] = None

    # Backoff schedule in seconds
    BACKOFF_SCHEDULE: Optional[List[int]] = None

    def __post_init__(self):
        """Initialize default values."""
        if self.created_at is None:
            self.created_at = datetime.utcnow()
        if self.updated_at is None:
            self.updated_at = datetime.utcnow()
        if self.BACKOFF_SCHEDULE is None:
            self.BACKOFF_SCHEDULE = [1, 5, 30]

    def should_retry(self) -> bool:
        """Check if task should be retried."""
        schedule = self.BACKOFF_SCHEDULE or [1, 5, 30]
        return self.attempts < self.max_attempts and self.status in [
            TaskStatus.PENDING,
            TaskStatus.WILL_RETRY,
        ]

    def get_backoff_seconds(self) -> int:
        """Get backoff delay based on current attempt count."""
        schedule = self.BACKOFF_SCHEDULE or [1, 5, 30]
        if self.attempts < len(schedule):
            return schedule[self.attempts]
        return schedule[-1]

    def schedule_retry(self) -> None:
        """Schedule the next retry with backoff."""
        self.attempts += 1
        self.status = TaskStatus.WILL_RETRY
        self.next_retry_at = datetime.utcnow() + timedelta(
            seconds=self.get_backoff_seconds()
        )
        self.updated_at = datetime.utcnow()

    def mark_completed(self, translated_text: str) -> None:
        """Mark task as completed with translated text."""
        self.status = TaskStatus.COMPLETED
        self.translated_text = translated_text
        self.completed_at = datetime.utcnow()
        self.next_retry_at = None
        self.updated_at = datetime.utcnow()

    def mark_failed(self, error: str) -> None:
        """Mark task as permanently failed."""
        self.last_error = error
        if self.attempts >= self.max_attempts:
            self.status = TaskStatus.FAILED
        self.updated_at = datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for serialization."""
        data = asdict(self)
        data["status"] = self.status.value
        # Convert datetime objects to ISO strings
        for key in ["created_at", "updated_at", "completed_at", "next_retry_at"]:
            if isinstance(data.get(key), datetime):
                data[key] = data[key].isoformat()
        # Remove class variable from serialization
        data.pop("BACKOFF_SCHEDULE", None)
        return data

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "TranslationTask":
        """Create task from dictionary."""
        if "status" in data and isinstance(data["status"], str):
            data["status"] = TaskStatus(data["status"])
        for key in ["created_at", "updated_at", "completed_at", "next_retry_at"]:
            if isinstance(data.get(key), str):
                data[key] = datetime.fromisoformat(data[key])
        return cls(**data)


class TranslationRetryQueue:
    """
    Manages translation retry tasks with exponential backoff.

    Features:
    - Persistent storage (JSON file)
    - Thread-safe operations
    - Priority queue support
    - Daily retry mechanism
    """

    def __init__(self, storage_path: Optional[Path] = None):
        """
        Initialize the retry queue.

        Args:
            storage_path: Path for persistent storage (optional)
        """
        self._lock = Lock()
        self._tasks: Dict[str, TranslationTask] = {}
        self._storage_path = storage_path or (
            Path.home() / ".ai_frontier_watch" / "translation_queue.json"
        )
        self._load()

    def _load(self) -> None:
        """Load tasks from persistent storage."""
        try:
            if self._storage_path.exists():
                with open(self._storage_path, "r") as f:
                    data = json.load(f)
                    tasks_data = data.get("tasks", {})
                    self._tasks = {
                        task_id: TranslationTask.from_dict(task_data)
                        for task_id, task_data in tasks_data.items()
                    }
                logger.info(f"Loaded {len(self._tasks)} tasks from storage")
        except Exception as e:
            logger.warning(f"Failed to load translation queue: {e}")

    def _save(self) -> None:
        """Persist tasks to storage."""
        try:
            self._storage_path.parent.mkdir(parents=True, exist_ok=True)
            data = {
                "tasks": {
                    task_id: task.to_dict() for task_id, task in self._tasks.items()
                },
                "last_updated": datetime.utcnow().isoformat(),
            }
            with open(self._storage_path, "w") as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            logger.error(f"Failed to save translation queue: {e}")

    @staticmethod
    def generate_task_id(article_hash: str, field: str) -> str:
        """Generate unique task ID."""
        return f"{article_hash}_{field}"

    def add_task(
        self,
        article_url: str,
        article_hash: str,
        field: str,
        original_text: str,
        target_lang: str = "ZH",
        priority: int = 0,
    ) -> str:
        """
        Add a translation task to the queue.

        Args:
            article_url: URL of the article
            article_hash: URL hash for the article
            field: Field to translate ("title", "summary", "content")
            original_text: Text to translate
            target_lang: Target language code
            priority: Priority level (higher = more urgent)

        Returns:
            Task ID
        """
        task_id = self.generate_task_id(article_hash, field)

        with self._lock:
            if task_id in self._tasks:
                # Update existing task
                task = self._tasks[task_id]
                task.original_text = original_text
                task.attempts = 0
                task.status = TaskStatus.PENDING
                task.priority = priority
            else:
                # Create new task
                task = TranslationTask(
                    task_id=task_id,
                    article_url=article_url,
                    article_hash=article_hash,
                    field=field,
                    original_text=original_text,
                    target_lang=target_lang,
                    priority=priority,
                )
                self._tasks[task_id] = task

            self._save()

        logger.info(f"Added translation task: {task_id}")
        return task_id

    def get_task(self, task_id: str) -> Optional[TranslationTask]:
        """Get a specific task by ID."""
        with self._lock:
            return self._tasks.get(task_id)

    def get_pending_tasks(self, limit: int = 100) -> List[TranslationTask]:
        """
        Get tasks that are ready for retry.

        Args:
            limit: Maximum number of tasks to return

        Returns:
            List of tasks ready for processing
        """
        now = datetime.utcnow()

        with self._lock:
            ready_tasks = [
                task
                for task in self._tasks.values()
                if task.status in [TaskStatus.PENDING, TaskStatus.WILL_RETRY]
                and (task.next_retry_at is None or task.next_retry_at <= now)
            ]

            # Sort by priority and next_retry_at
            ready_tasks.sort(key=lambda t: (-t.priority, t.next_retry_at or now))

            return ready_tasks[:limit]

    def get_tasks_for_daily_retry(self) -> List[TranslationTask]:
        """
        Get all failed tasks for daily retry batch.

        Returns:
            List of tasks that should be retried
        """
        with self._lock:
            failed_tasks = [
                task
                for task in self._tasks.values()
                if task.status == TaskStatus.FAILED
                and task.attempts < task.max_attempts
            ]

            # Prioritize by age and attempts
            failed_tasks.sort(key=lambda t: (t.attempts, t.created_at))

            return failed_tasks

    def complete_task(self, task_id: str, translated_text: str) -> bool:
        """
        Mark a task as completed.

        Args:
            task_id: Task ID
            translated_text: The translated text

        Returns:
            True if successful, False if task not found
        """
        with self._lock:
            if task_id not in self._tasks:
                return False

            task = self._tasks[task_id]
            task.mark_completed(translated_text)
            self._save()

        logger.info(f"Completed translation task: {task_id}")
        return True

    def fail_task(self, task_id: str, error: str) -> bool:
        """
        Mark a task as failed and schedule retry if appropriate.

        Args:
            task_id: Task ID
            error: Error message

        Returns:
            True if will retry, False if permanently failed
        """
        with self._lock:
            if task_id not in self._tasks:
                return False

            task = self._tasks[task_id]
            task.last_error = error

            if task.should_retry():
                task.schedule_retry()
                self._save()
                logger.info(
                    f"Scheduled retry for task {task_id} "
                    f"(attempt {task.attempts}/{task.max_attempts})"
                )
                return True
            else:
                task.mark_failed(error)
                self._save()
                logger.warning(f"Task {task_id} permanently failed: {error}")
                return False

    def remove_task(self, task_id: str) -> bool:
        """Remove a task from the queue."""
        with self._lock:
            if task_id in self._tasks:
                del self._tasks[task_id]
                self._save()
                return True
        return False

    def reset_failed_tasks(self) -> int:
        """
        Reset all failed tasks for daily retry.

        Returns:
            Number of tasks reset
        """
        count = 0
        now = datetime.utcnow()

        with self._lock:
            for task in self._tasks.values():
                if task.status == TaskStatus.FAILED:
                    task.status = TaskStatus.PENDING
                    task.next_retry_at = now
                    task.attempts = 0
                    count += 1

            if count > 0:
                self._save()

        logger.info(f"Reset {count} failed tasks for daily retry")
        return count

    def get_stats(self) -> Dict[str, Any]:
        """Get queue statistics."""
        with self._lock:
            stats = {
                "total": len(self._tasks),
                "pending": sum(
                    1 for t in self._tasks.values() if t.status == TaskStatus.PENDING
                ),
                "in_progress": sum(
                    1
                    for t in self._tasks.values()
                    if t.status == TaskStatus.IN_PROGRESS
                ),
                "completed": sum(
                    1 for t in self._tasks.values() if t.status == TaskStatus.COMPLETED
                ),
                "failed": sum(
                    1 for t in self._tasks.values() if t.status == TaskStatus.FAILED
                ),
                "will_retry": sum(
                    1 for t in self._tasks.values() if t.status == TaskStatus.WILL_RETRY
                ),
            }
            return stats

    def clear_completed(self, days_old: int = 7) -> int:
        """
        Clear completed tasks older than specified days.

        Args:
            days_old: Remove tasks completed more than this many days ago

        Returns:
            Number of tasks removed
        """
        cutoff = datetime.utcnow() - timedelta(days=days_old)
        count = 0

        with self._lock:
            to_remove = [
                task_id
                for task_id, task in self._tasks.items()
                if task.status == TaskStatus.COMPLETED
                and task.completed_at
                and task.completed_at < cutoff
            ]

            for task_id in to_remove:
                del self._tasks[task_id]
                count += 1

            if count > 0:
                self._save()

        logger.info(f"Cleared {count} old completed tasks")
        return count


def create_retry_queue(storage_path: Optional[str] = None) -> TranslationRetryQueue:
    """
    Create a translation retry queue.

    Args:
        storage_path: Optional path for persistent storage

    Returns:
        TranslationRetryQueue instance
    """
    path = Path(storage_path) if storage_path else None
    return TranslationRetryQueue(path)
