"""
AI Frontier Watch - Unit Tests for Translation Retry Queue
"""

import pytest
import tempfile
import os
from pathlib import Path
from datetime import datetime, timedelta

from ..common.retry_queue import TranslationRetryQueue, TranslationTask, TaskStatus


class TestTranslationTask:
    """Test suite for TranslationTask."""

    def test_task_creation(self):
        """Test creating a basic translation task."""
        task = TranslationTask(
            task_id="test_123_title",
            article_url="https://example.com/article/123",
            article_hash="abc123",
            field="title",
            original_text="Hello World",
        )

        assert task.task_id == "test_123_title"
        assert task.original_text == "Hello World"
        assert task.attempts == 0
        assert task.status == TaskStatus.PENDING
        assert task.should_retry() is True

    def test_should_retry_false_when_max_attempts_reached(self):
        """Test should_retry returns False when max attempts reached."""
        task = TranslationTask(
            task_id="test_123_title",
            article_url="https://example.com/article/123",
            article_hash="abc123",
            field="title",
            original_text="Hello",
            attempts=3,
            max_attempts=3,
        )

        assert task.should_retry() is False

    def test_schedule_retry(self):
        """Test scheduling a retry with backoff."""
        task = TranslationTask(
            task_id="test_123_title",
            article_url="https://example.com/article/123",
            article_hash="abc123",
            field="title",
            original_text="Hello",
            attempts=0,
            max_attempts=3,
        )

        task.schedule_retry()

        assert task.attempts == 1
        assert task.status == TaskStatus.WILL_RETRY
        assert task.next_retry_at is not None
        assert task.next_retry_at > datetime.utcnow()

    def test_get_backoff_seconds(self):
        """Test backoff delay calculation."""
        task = TranslationTask(
            task_id="test_123_title",
            article_url="https://example.com/article/123",
            article_hash="abc123",
            field="title",
            original_text="Hello",
        )

        # First retry: 1 second
        assert task.get_backoff_seconds() == 1

        task.attempts = 1
        # Second retry: 5 seconds
        assert task.get_backoff_seconds() == 5

        task.attempts = 2
        # Third retry: 30 seconds
        assert task.get_backoff_seconds() == 30

        task.attempts = 3
        # Max out at last value
        assert task.get_backoff_seconds() == 30

    def test_mark_completed(self):
        """Test marking task as completed."""
        task = TranslationTask(
            task_id="test_123_title",
            article_url="https://example.com/article/123",
            article_hash="abc123",
            field="title",
            original_text="Hello",
        )

        task.mark_completed("你好世界")

        assert task.status == TaskStatus.COMPLETED
        assert task.translated_text == "你好世界"
        assert task.completed_at is not None
        assert task.next_retry_at is None

    def test_mark_failed_permanently(self):
        """Test marking task as permanently failed."""
        task = TranslationTask(
            task_id="test_123_title",
            article_url="https://example.com/article/123",
            article_hash="abc123",
            field="title",
            original_text="Hello",
            attempts=3,
            max_attempts=3,
        )

        task.mark_failed("API quota exceeded")

        assert task.status == TaskStatus.FAILED
        assert task.last_error == "API quota exceeded"

    def test_mark_failed_with_retries_remaining(self):
        """Test marking task as failed but still retryable."""
        task = TranslationTask(
            task_id="test_123_title",
            article_url="https://example.com/article/123",
            article_hash="abc123",
            field="title",
            original_text="Hello",
            attempts=1,
            max_attempts=3,
        )

        task.mark_failed("Temporary error")

        # Status should still be PENDING for retry
        assert task.status == TaskStatus.FAILED
        assert task.last_error == "Temporary error"

    def test_to_dict(self):
        """Test serialization to dictionary."""
        task = TranslationTask(
            task_id="test_123_title",
            article_url="https://example.com/article/123",
            article_hash="abc123",
            field="title",
            original_text="Hello",
        )

        data = task.to_dict()

        assert data["task_id"] == "test_123_title"
        assert data["status"] == "pending"
        assert data["original_text"] == "Hello"

    def test_from_dict(self):
        """Test deserialization from dictionary."""
        data = {
            "task_id": "test_123_title",
            "article_url": "https://example.com/article/123",
            "article_hash": "abc123",
            "field": "title",
            "original_text": "Hello",
            "target_lang": "ZH",
            "priority": 0,
            "attempts": 0,
            "max_attempts": 3,
            "status": "pending",
            "next_retry_at": None,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
            "completed_at": None,
            "translated_text": None,
            "last_error": None,
        }

        task = TranslationTask.from_dict(data)

        assert task.task_id == "test_123_title"
        assert task.original_text == "Hello"
        assert task.status == TaskStatus.PENDING


class TestTranslationRetryQueue:
    """Test suite for TranslationRetryQueue."""

    def setup_method(self):
        """Set up test fixtures."""
        self.temp_dir = tempfile.mkdtemp()
        self.storage_path = Path(self.temp_dir) / "test_queue.json"
        self.queue = TranslationRetryQueue(self.storage_path)

    def teardown_method(self):
        """Clean up test fixtures."""
        if self.storage_path.exists():
            self.storage_path.unlink()
        if Path(self.temp_dir).exists():
            os.rmdir(self.temp_dir)

    def test_add_task(self):
        """Test adding a task to the queue."""
        task_id = self.queue.add_task(
            article_url="https://example.com/article/123",
            article_hash="abc123",
            field="title",
            original_text="Hello World",
        )

        assert task_id == "abc123_title"
        assert self.queue.get_task(task_id) is not None

    def test_add_duplicate_task_updates(self):
        """Test that adding duplicate task updates existing one."""
        self.queue.add_task(
            article_url="https://example.com/article/123",
            article_hash="abc123",
            field="title",
            original_text="Hello",
        )

        self.queue.add_task(
            article_url="https://example.com/article/123",
            article_hash="abc123",
            field="title",
            original_text="Updated Hello",
        )

        task = self.queue.get_task("abc123_title")
        assert task.original_text == "Updated Hello"
        assert task.attempts == 0  # Reset attempts

    def test_get_pending_tasks(self):
        """Test getting pending tasks."""
        self.queue.add_task(
            article_url="https://example.com/1",
            article_hash="hash1",
            field="title",
            original_text="Hello 1",
        )
        self.queue.add_task(
            article_url="https://example.com/2",
            article_hash="hash2",
            field="summary",
            original_text="Hello 2",
        )

        pending = self.queue.get_pending_tasks()
        assert len(pending) == 2

    def test_complete_task(self):
        """Test completing a task."""
        self.queue.add_task(
            article_url="https://example.com/1",
            article_hash="hash1",
            field="title",
            original_text="Hello",
        )

        result = self.queue.complete_task("hash1_title", "你好")
        assert result is True

        task = self.queue.get_task("hash1_title")
        assert task.status == TaskStatus.COMPLETED
        assert task.translated_text == "你好"

    def test_fail_task_with_retry(self):
        """Test failing a task schedules retry."""
        self.queue.add_task(
            article_url="https://example.com/1",
            article_hash="hash1",
            field="title",
            original_text="Hello",
        )

        will_retry = self.queue.fail_task("hash1_title", "Temporary error")
        assert will_retry is True

        task = self.queue.get_task("hash1_title")
        assert task.status == TaskStatus.WILL_RETRY
        assert task.attempts == 1
        assert task.next_retry_at is not None

    def test_fail_task_permanent(self):
        """Test failing a task permanently."""
        task = TranslationTask(
            task_id="hash1_title",
            article_url="https://example.com/1",
            article_hash="hash1",
            field="title",
            original_text="Hello",
            attempts=3,
            max_attempts=3,
        )
        self.queue._tasks["hash1_title"] = task

        will_retry = self.queue.fail_task("hash1_title", "Quota exceeded")
        assert will_retry is False

        task = self.queue.get_task("hash1_title")
        assert task.status == TaskStatus.FAILED

    def test_remove_task(self):
        """Test removing a task."""
        self.queue.add_task(
            article_url="https://example.com/1",
            article_hash="hash1",
            field="title",
            original_text="Hello",
        )

        result = self.queue.remove_task("hash1_title")
        assert result is True
        assert self.queue.get_task("hash1_title") is None

    def test_get_stats(self):
        """Test getting queue statistics."""
        self.queue.add_task(
            article_url="https://example.com/1",
            article_hash="hash1",
            field="title",
            original_text="Hello 1",
        )
        self.queue.add_task(
            article_url="https://example.com/2",
            article_hash="hash2",
            field="title",
            original_text="Hello 2",
        )
        self.queue.complete_task("hash1_title", "你好")

        stats = self.queue.get_stats()

        assert stats["total"] == 2
        assert stats["pending"] == 1
        assert stats["completed"] == 1

    def test_reset_failed_tasks(self):
        """Test resetting failed tasks for daily retry."""
        # Create some failed tasks
        task1 = TranslationTask(
            task_id="hash1_title",
            article_url="https://example.com/1",
            article_hash="hash1",
            field="title",
            original_text="Hello 1",
            status=TaskStatus.FAILED,
            attempts=3,
        )
        task2 = TranslationTask(
            task_id="hash2_title",
            article_url="https://example.com/2",
            article_hash="hash2",
            field="title",
            original_text="Hello 2",
            status=TaskStatus.FAILED,
            attempts=3,
        )
        self.queue._tasks["hash1_title"] = task1
        self.queue._tasks["hash2_title"] = task2

        count = self.queue.reset_failed_tasks()
        assert count == 2

        task1 = self.queue.get_task("hash1_title")
        assert task1.status == TaskStatus.PENDING
        assert task1.attempts == 0

    def test_clear_completed(self):
        """Test clearing old completed tasks."""
        self.queue.add_task(
            article_url="https://example.com/1",
            article_hash="hash1",
            field="title",
            original_text="Hello 1",
        )
        self.queue.complete_task("hash1_title", "你好")

        # Mark as completed 10 days ago
        self.queue._tasks["hash1_title"].completed_at = datetime.utcnow() - timedelta(
            days=10
        )

        count = self.queue.clear_completed(days_old=7)
        assert count == 1
        assert self.queue.get_task("hash1_title") is None

    def test_persistence(self):
        """Test that queue persists across instances."""
        self.queue.add_task(
            article_url="https://example.com/1",
            article_hash="hash1",
            field="title",
            original_text="Hello",
        )

        # Create new instance
        new_queue = TranslationRetryQueue(self.storage_path)
        assert new_queue.get_task("hash1_title") is not None


class TestTaskStatus:
    """Test suite for TaskStatus enum."""

    def test_task_status_values(self):
        """Test TaskStatus enum values."""
        assert TaskStatus.PENDING.value == "pending"
        assert TaskStatus.IN_PROGRESS.value == "in_progress"
        assert TaskStatus.COMPLETED.value == "completed"
        assert TaskStatus.FAILED.value == "failed"
        assert TaskStatus.WILL_RETRY.value == "will_retry"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
