"""
AI Frontier Watch - Unit Tests for Deduplication Logic
"""

import pytest
import tempfile
import os
from pathlib import Path

from ..common.deduplication import URLHashDeduplicator, create_deduplicator


class TestURLHashDeduplicator:
    """Test suite for URLHashDeduplicator."""

    def setup_method(self):
        """Set up test fixtures."""
        self.temp_dir = tempfile.mkdtemp()
        self.storage_path = Path(self.temp_dir) / "test_hashes.json"
        self.deduplicator = URLHashDeduplicator(self.storage_path)

    def teardown_method(self):
        """Clean up test fixtures."""
        if self.storage_path.exists():
            self.storage_path.unlink()
        if Path(self.temp_dir).exists():
            os.rmdir(self.temp_dir)

    def test_compute_hash_consistency(self):
        """Test that hash computation is consistent for the same URL."""
        url = "https://example.com/article/test"
        hash1 = URLHashDeduplicator.compute_hash(url)
        hash2 = URLHashDeduplicator.compute_hash(url)
        assert hash1 == hash2
        assert len(hash1) == 16  # Should be truncated to 16 chars

    def test_compute_hash_different_urls(self):
        """Test that different URLs produce different hashes."""
        url1 = "https://example.com/article/test1"
        url2 = "https://example.com/article/test2"
        hash1 = URLHashDeduplicator.compute_hash(url1)
        hash2 = URLHashDeduplicator.compute_hash(url2)
        assert hash1 != hash2

    def test_is_duplicate_false_for_new_url(self):
        """Test that new URLs are not marked as duplicates."""
        url = "https://example.com/article/new"
        assert self.deduplicator.is_duplicate(url) is False

    def test_is_duplicate_true_after_marking(self):
        """Test that marked URLs are detected as duplicates."""
        url = "https://example.com/article/test"
        self.deduplicator.mark_seen(url)
        assert self.deduplicator.is_duplicate(url) is True

    def test_is_duplicate_persists_across_instances(self):
        """Test that duplicate detection persists across instances."""
        url = "https://example.com/article/persist"
        self.deduplicator.mark_seen(url)

        # Create new instance with same storage
        new_deduplicator = URLHashDeduplicator(self.storage_path)
        assert new_deduplicator.is_duplicate(url) is True

    def test_mark_seen_batch(self):
        """Test batch marking of URLs."""
        urls = [
            "https://example.com/article/1",
            "https://example.com/article/2",
            "https://example.com/article/3",
        ]
        new_count = self.deduplicator.mark_seen_batch(urls)
        assert new_count == 3
        assert self.deduplicator.count == 3

    def test_mark_seen_batch_returns_correct_count(self):
        """Test that batch marking returns correct count of new URLs."""
        urls = [
            "https://example.com/article/1",
            "https://example.com/article/2",
        ]
        self.deduplicator.mark_seen(urls[0])

        new_count = self.deduplicator.mark_seen_batch(urls)
        assert new_count == 1  # Only 1 is new

    def test_filter_duplicates(self):
        """Test filtering of duplicate URLs."""
        self.deduplicator.mark_seen("https://example.com/article/1")

        urls = [
            "https://example.com/article/1",  # duplicate
            "https://example.com/article/2",  # new
            "https://example.com/article/3",  # new
        ]

        filtered = self.deduplicator.filter_duplicates(urls)
        assert len(filtered) == 2
        assert "https://example.com/article/1" not in filtered
        assert "https://example.com/article/2" in filtered
        assert "https://example.com/article/3" in filtered

    def test_clear(self):
        """Test clearing all seen hashes."""
        urls = [
            "https://example.com/article/1",
            "https://example.com/article/2",
        ]
        self.deduplicator.mark_seen_batch(urls)
        assert self.deduplicator.count == 2

        self.deduplicator.clear()
        assert self.deduplicator.count == 0

        # Verify persistence
        new_deduplicator = URLHashDeduplicator(self.storage_path)
        assert new_deduplicator.count == 0

    def test_count_property(self):
        """Test count property."""
        assert self.deduplicator.count == 0

        self.deduplicator.mark_seen("https://example.com/article/1")
        assert self.deduplicator.count == 1

        self.deduplicator.mark_seen("https://example.com/article/2")
        assert self.deduplicator.count == 2

    def test_url_with_special_characters(self):
        """Test URLs with special characters."""
        url = "https://example.com/article/test?id=123&ref=abc#section"
        hash1 = URLHashDeduplicator.compute_hash(url)

        self.deduplicator.mark_seen(url)
        assert self.deduplicator.is_duplicate(url) is True

    def test_url_with_chinese_characters(self):
        """Test URLs with Chinese characters."""
        url = "https://example.com/文章/测试"
        hash1 = URLHashDeduplicator.compute_hash(url)

        self.deduplicator.mark_seen(url)
        assert self.deduplicator.is_duplicate(url) is True

    def test_empty_url(self):
        """Test handling of empty URL."""
        url = ""
        hash1 = URLHashDeduplicator.compute_hash(url)
        assert len(hash1) == 16

        self.deduplicator.mark_seen(url)
        assert self.deduplicator.is_duplicate(url) is True


class TestCreateDeduplicator:
    """Test suite for create_deduplicator factory function."""

    def test_create_with_path(self):
        """Test creating deduplicator with custom path."""
        with tempfile.TemporaryDirectory() as temp_dir:
            path = os.path.join(temp_dir, "custom_hashes.json")
            dedup = create_deduplicator(path)
            assert isinstance(dedup, URLHashDeduplicator)

    def test_create_without_path(self):
        """Test creating deduplicator without path."""
        dedup = create_deduplicator()
        assert isinstance(dedup, URLHashDeduplicator)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
