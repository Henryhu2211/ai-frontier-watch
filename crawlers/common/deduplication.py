"""
AI Frontier Watch - URL Hash Deduplication Logic

This module handles deduplication of articles using URL hash comparison.
It maintains a set of known URL hashes and provides methods to check
if an article is new or already exists.
"""

import hashlib
import logging
from typing import Set, Optional, List
from pathlib import Path
import json

logger = logging.getLogger(__name__)


class URLHashDeduplicator:
    """
    Deduplication using URL hash (SHA256 truncated to 16 chars).

    This is a simple but effective approach for exact URL matching.
    For fuzzy matching (similar articles), additional similarity
    comparison would be needed.
    """

    def __init__(self, storage_path: Optional[Path] = None):
        """
        Initialize the deduplicator.

        Args:
            storage_path: Path to store seen URL hashes (for persistence)
        """
        self._seen_hashes: Set[str] = set()
        self._storage_path = (
            storage_path or Path.home() / ".ai_frontier_watch" / "seen_urls.json"
        )
        self._load()

    def _load(self) -> None:
        """Load previously seen hashes from storage."""
        try:
            if self._storage_path.exists():
                with open(self._storage_path, "r") as f:
                    data = json.load(f)
                    self._seen_hashes = set(data.get("hashes", []))
                logger.info(f"Loaded {len(self._seen_hashes)} seen URL hashes")
        except Exception as e:
            logger.warning(f"Failed to load seen URLs: {e}")

    def _save(self) -> None:
        """Persist seen hashes to storage."""
        try:
            self._storage_path.parent.mkdir(parents=True, exist_ok=True)
            with open(self._storage_path, "w") as f:
                json.dump({"hashes": list(self._seen_hashes)}, f)
        except Exception as e:
            logger.warning(f"Failed to save seen URLs: {e}")

    @staticmethod
    def compute_hash(url: str) -> str:
        """
        Compute SHA256 hash of URL, truncated to 16 characters.

        Args:
            url: The URL to hash

        Returns:
            Truncated SHA256 hash string
        """
        return hashlib.sha256(url.encode("utf-8")).hexdigest()[:16]

    def is_duplicate(self, url: str) -> bool:
        """
        Check if a URL has been seen before.

        Args:
            url: The URL to check

        Returns:
            True if URL has been seen (is duplicate), False otherwise
        """
        url_hash = self.compute_hash(url)
        return url_hash in self._seen_hashes

    def mark_seen(self, url: str) -> None:
        """
        Mark a URL as seen.

        Args:
            url: The URL to mark as seen
        """
        url_hash = self.compute_hash(url)
        self._seen_hashes.add(url_hash)

    def mark_seen_batch(self, urls: List[str]) -> int:
        """
        Mark multiple URLs as seen and return count of new URLs.

        Args:
            urls: List of URLs to mark as seen

        Returns:
            Number of URLs that were newly added (not duplicates)
        """
        new_count = 0
        for url in urls:
            if not self.is_duplicate(url):
                self.mark_seen(url)
                new_count += 1

        if new_count > 0:
            self._save()

        return new_count

    def filter_duplicates(self, urls: List[str]) -> List[str]:
        """
        Filter out duplicate URLs from a list.

        Args:
            urls: List of URLs to filter

        Returns:
            List of URLs that are not duplicates (new)
        """
        return [url for url in urls if not self.is_duplicate(url)]

    def clear(self) -> None:
        """Clear all seen hashes (use with caution)."""
        self._seen_hashes.clear()
        self._save()
        logger.info("Cleared all seen URL hashes")

    @property
    def count(self) -> int:
        """Return the number of seen URLs."""
        return len(self._seen_hashes)


def create_deduplicator(persistence_path: Optional[str] = None) -> URLHashDeduplicator:
    """
    Factory function to create a deduplicator.

    Args:
        persistence_path: Optional path for persistence

    Returns:
        Configured URLHashDeduplicator instance
    """
    path = Path(persistence_path) if persistence_path else None
    return URLHashDeduplicator(path)
