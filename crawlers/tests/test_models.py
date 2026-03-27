"""
AI Frontier Watch - Unit Tests for Article Models
"""

import pytest
from datetime import datetime

from ..common.models import Article, SourceType, ImpactLevel, Complexity, Category


class TestArticle:
    """Test suite for Article model."""

    def test_article_creation(self):
        """Test creating a basic article."""
        article = Article(
            url="https://example.com/article/123", title="Test Article", source="test"
        )

        assert article.url == "https://example.com/article/123"
        assert article.title == "Test Article"
        assert article.source == "test"
        assert article.url_hash == "abc123def4567890"[:16]  # 16 chars

    def test_url_hash_computation(self):
        """Test that URL hash is computed correctly."""
        article = Article(url="https://example.com/test", title="Test", source="test")

        import hashlib

        expected = hashlib.sha256("https://example.com/test".encode()).hexdigest()[:16]
        assert article.url_hash == expected

    def test_primary_category(self):
        """Test primary category property."""
        article = Article(
            url="https://example.com/1",
            title="Test",
            source="test",
            categories=["llms", "research"],
        )

        assert article.primary_category == "llms"

    def test_primary_category_empty(self):
        """Test primary category when no categories."""
        article = Article(url="https://example.com/1", title="Test", source="test")

        assert article.primary_category is None

    def test_is_translated(self):
        """Test is_translated property."""
        article = Article(
            url="https://example.com/1",
            title="Test",
            source="test",
            translation_status="completed",
        )

        assert article.is_translated is True

    def test_display_title_with_translation(self):
        """Test display_title returns translated title."""
        article = Article(
            url="https://example.com/1", title="Test", title_zh="测试", source="test"
        )

        assert article.display_title == "测试"

    def test_display_title_without_translation(self):
        """Test display_title returns original title."""
        article = Article(url="https://example.com/1", title="Test", source="test")

        assert article.display_title == "Test"

    def test_to_dict(self):
        """Test serialization to dictionary."""
        article = Article(
            url="https://example.com/1",
            title="Test",
            source="test",
            source_type=SourceType.NEWS,
            categories=["llms"],
            impact_level=ImpactLevel.SIGNIFICANT,
        )

        data = article.to_dict()

        assert data["url"] == "https://example.com/1"
        assert data["title"] == "Test"
        assert data["source_type"] == "news"
        assert data["categories"] == ["llms"]
        assert data["impact_level"] == "significant"

    def test_from_dict(self):
        """Test deserialization from dictionary."""
        data = {
            "url": "https://example.com/1",
            "title": "Test",
            "source": "test",
            "source_type": "news",
            "categories": ["llms"],
            "impact_level": "significant",
            "complexity": "technical",
            "published_at": "2024-01-01T00:00:00",
            "fetched_at": "2024-01-01T00:00:00",
        }

        article = Article.from_dict(data)

        assert article.url == "https://example.com/1"
        assert article.source_type == SourceType.NEWS
        assert article.categories == ["llms"]

    def test_default_values(self):
        """Test default values for optional fields."""
        article = Article(url="https://example.com/1", title="Test", source="test")

        assert article.source_type == SourceType.NEWS
        assert article.categories == []
        assert article.translation_status == "pending"
        assert article.language == "en"
        assert article.published_at is not None
        assert article.fetched_at is not None


class TestSourceType:
    """Test suite for SourceType enum."""

    def test_source_type_values(self):
        """Test SourceType enum values."""
        assert SourceType.RESEARCH.value == "research"
        assert SourceType.NEWS.value == "news"
        assert SourceType.BLOG.value == "blog"
        assert SourceType.SOCIAL.value == "social"

    def test_source_type_inheritance(self):
        """Test SourceType string inheritance."""
        assert isinstance(SourceType.RESEARCH, str)
        assert SourceType.RESEARCH == "research"


class TestImpactLevel:
    """Test suite for ImpactLevel enum."""

    def test_impact_level_values(self):
        """Test ImpactLevel enum values."""
        assert ImpactLevel.BREAKING.value == "breaking"
        assert ImpactLevel.SIGNIFICANT.value == "significant"
        assert ImpactLevel.INTERESTING.value == "interesting"


class TestComplexity:
    """Test suite for Complexity enum."""

    def test_complexity_values(self):
        """Test Complexity enum values."""
        assert Complexity.BEGINNER.value == "beginner"
        assert Complexity.TECHNICAL.value == "technical"
        assert Complexity.EXPERT.value == "expert"


class TestCategory:
    """Test suite for Category enum."""

    def test_category_values(self):
        """Test Category enum values."""
        assert Category.LLMS.value == "llms"
        assert Category.VISION.value == "vision"
        assert Category.SAFETY.value == "safety"
        assert Category.RESEARCH.value == "research"
        assert Category.INDUSTRY.value == "industry"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
