"""
AI Frontier Watch - Article Data Models
"""

from dataclasses import dataclass, asdict
from datetime import datetime
from typing import List, Optional, Dict, Any
from enum import Enum
import hashlib
from dataclasses import field as dc_field


class SourceType(str, Enum):
    RESEARCH = "research"
    NEWS = "news"
    BLOG = "blog"
    SOCIAL = "social"


class ImpactLevel(str, Enum):
    BREAKING = "breaking"
    SIGNIFICANT = "significant"
    INTERESTING = "interesting"


class Complexity(str, Enum):
    BEGINNER = "beginner"
    TECHNICAL = "technical"
    EXPERT = "expert"


class Category(str, Enum):
    LLMS = "llms"
    VISION = "vision"
    SAFETY = "safety"
    RESEARCH = "research"
    INDUSTRY = "industry"


@dataclass
class Article:
    """Represents a collected article from any source."""

    # Core fields
    url: str
    title: str
    source: str  # e.g., "arxiv", "venturebeat", "techcrunch", "theverge"
    source_type: SourceType = SourceType.NEWS
    published_at: datetime = dc_field(default_factory=datetime.utcnow)
    fetched_at: datetime = dc_field(default_factory=datetime.utcnow)

    # Content
    content: str = ""
    summary: str = ""
    authors: List[str] = dc_field(default_factory=list)

    # Translation
    title_zh: Optional[str] = None
    summary_zh: Optional[str] = None
    content_zh: Optional[str] = None
    translation_status: str = "pending"
    translation_attempts: int = 0

    # Classification
    categories: List[str] = dc_field(default_factory=list)
    impact_level: ImpactLevel = ImpactLevel.INTERESTING
    complexity: Complexity = Complexity.TECHNICAL
    contains_code: bool = False

    # Metadata
    tags: List[str] = dc_field(default_factory=list)
    language: str = "en"

    # arXiv specific
    arxiv_id: Optional[str] = None
    arxiv_pdf_url: Optional[str] = None

    # Deduplication
    url_hash: str = ""

    # Database
    id: Optional[int] = None

    def __post_init__(self):
        """Compute derived fields after initialization."""
        if not self.url_hash:
            self.url_hash = self._compute_url_hash()

    def _compute_url_hash(self) -> str:
        """Compute SHA256 hash of URL for deduplication."""
        return hashlib.sha256(self.url.encode("utf-8")).hexdigest()[:16]

    @property
    def primary_category(self) -> Optional[str]:
        """Get the primary (first) category."""
        return self.categories[0] if self.categories else None

    @property
    def is_translated(self) -> bool:
        """Check if article has Chinese translation."""
        return self.translation_status == "completed"

    @property
    def display_title(self) -> str:
        """Get title in requested language."""
        return self.title_zh if self.title_zh else self.title

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for database storage."""
        data = asdict(self)
        # Convert enums to values
        data["source_type"] = (
            self.source_type.value
            if isinstance(self.source_type, Enum)
            else self.source_type
        )
        data["impact_level"] = (
            self.impact_level.value
            if isinstance(self.impact_level, Enum)
            else self.impact_level
        )
        data["complexity"] = (
            self.complexity.value
            if isinstance(self.complexity, Enum)
            else self.complexity
        )
        # Convert datetime to ISO format
        if isinstance(self.published_at, datetime):
            data["published_at"] = self.published_at.isoformat()
        if isinstance(self.fetched_at, datetime):
            data["fetched_at"] = self.fetched_at.isoformat()
        return data

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Article":
        """Create Article from dictionary."""
        # Convert string enums back to Enum objects
        if "source_type" in data and isinstance(data["source_type"], str):
            data["source_type"] = SourceType(data["source_type"])
        if "impact_level" in data and isinstance(data["impact_level"], str):
            data["impact_level"] = ImpactLevel(data["impact_level"])
        if "complexity" in data and isinstance(data["complexity"], str):
            data["complexity"] = Complexity(data["complexity"])
        # Parse datetime strings
        if "published_at" in data and isinstance(data["published_at"], str):
            data["published_at"] = datetime.fromisoformat(data["published_at"])
        if "fetched_at" in data and isinstance(data["fetched_at"], str):
            data["fetched_at"] = datetime.fromisoformat(data["fetched_at"])
        return cls(**data)
