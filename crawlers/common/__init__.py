"""
AI Frontier Watch - Common Utilities
"""

from .config import get_config, Config
from .models import Article, SourceType, ImpactLevel, Complexity, Category
from .deduplication import URLHashDeduplicator, create_deduplicator
from .classifier import (
    ArticleClassifier,
    ClassificationResult,
    classify_article,
    Category,
)
from .translation import (
    DeepLTranslator,
    TranslationResult,
    translate_text,
    translate_to_chinese,
    translate_to_english,
)
from .retry_queue import (
    TranslationRetryQueue,
    TranslationTask,
    TaskStatus,
    create_retry_queue,
)

__all__ = [
    # Config
    "get_config",
    "Config",
    # Models
    "Article",
    "SourceType",
    "ImpactLevel",
    "Complexity",
    "Category",
    # Deduplication
    "URLHashDeduplicator",
    "create_deduplicator",
    # Classifier
    "ArticleClassifier",
    "ClassificationResult",
    "classify_article",
    # Translation
    "DeepLTranslator",
    "TranslationResult",
    "translate_text",
    "translate_to_chinese",
    "translate_to_english",
    # Retry Queue
    "TranslationRetryQueue",
    "TranslationTask",
    "TaskStatus",
    "create_retry_queue",
]
