"""
AI Frontier Watch - Article Classifier

Basic classifier for categorizing articles into 5 categories:
- LLMs: Large Language Models
- Vision: Computer Vision & Image Generation
- Safety: AI Safety & Alignment
- Research: Research Breakthroughs & Papers
- Industry: Industry & Business News
"""

import re
import logging
from typing import List, Dict, Optional
from dataclasses import dataclass
from enum import Enum

logger = logging.getLogger(__name__)


class Category(Enum):
    """Article categories."""

    LLMS = "llms"
    VISION = "vision"
    SAFETY = "safety"
    RESEARCH = "research"
    INDUSTRY = "industry"


# Classification rules with keywords and weights
CLASSIFICATION_RULES: Dict[str, Dict] = {
    "llms": {
        "keywords": [
            "large language model",
            "llm",
            "gpt",
            "chatgpt",
            "claude",
            "gemini",
            "transformer",
            "instruction tuning",
            "rlhf",
            "prompt engineering",
            "text generation",
            "language model",
            "token",
            "attention mechanism",
            "multimodal",
            "foundation model",
            "emergent capability",
            "涌现能力",
            "scaling law",
            "context window",
            "fine-tuning",
            "pre-training",
        ],
        "exclude": ["safety", "alignment", "ethics", "bias"],
    },
    "vision": {
        "keywords": [
            "computer vision",
            "image recognition",
            "object detection",
            "semantic segmentation",
            "yolo",
            "stable diffusion",
            "dall-e",
            "image generation",
            "diffusion model",
            "gan",
            "vision transformer",
            "vit",
            "image classification",
            "ocr",
            "video generation",
            "visual",
            "image-to-image",
            "text-to-image",
            "图像生成",
            "视觉",
        ],
        "exclude": ["safety"],
    },
    "safety": {
        "keywords": [
            "ai safety",
            "alignment",
            "constitutional ai",
            "responsible ai",
            "ai ethics",
            "bias",
            "fairness",
            "interpretability",
            "robustness",
            "adversarial",
            "trustworthy ai",
            "xai",
            "explainability",
            "value alignment",
            "ai risk",
            "existential risk",
            "control",
            "对齐",
            "安全",
            "伦理",
            "偏见",
            "可解释",
        ],
        "exclude": [],
    },
    "research": {
        "keywords": [
            "arxiv",
            "paper",
            "research",
            "benchmark",
            "dataset",
            "neural network",
            "architecture",
            "training",
            "fine-tuning",
            "pre-training",
            "emergent",
            "state-of-the-art",
            "sota",
            "breakthrough",
            "novel",
            "proposed method",
            "实验",
            "论文",
        ],
        "exclude": ["industry", "funding", "startup"],
    },
    "industry": {
        "keywords": [
            "funding",
            "investment",
            "startup",
            "acquisition",
            "merger",
            "ipo",
            "partnership",
            "launch",
            "product release",
            "enterprise",
            "deployment",
            "revenue",
            "valuation",
            "series a",
            "series b",
            "收购",
            "投资",
            "融资",
            "发布",
            "合作",
        ],
        "exclude": ["research", "arxiv", "paper"],
    },
}

# Source type classification
SOURCE_TYPE_PATTERNS: Dict[str, List[str]] = {
    "research": ["arxiv.org", "paperswithcode", "openreview", "arxiv.org/abs"],
    "blog": ["blog", "medium.com", "substack", "dev.to"],
    "news": ["reuters", "bloomberg", "venturebeat", "techcrunch", "theverge", "wired"],
    "social": ["twitter.com", "x.com", "reddit.com", "linkedin"],
}


@dataclass
class ClassificationResult:
    """Result of article classification."""

    categories: List[str]  # e.g., ["llms", "research"]
    confidence: float  # 0.0 to 1.0
    source_type: str  # "research", "news", "blog", "social"
    impact_level: str  # "breaking", "significant", "interesting"
    complexity: str  # "beginner", "technical", "expert"
    contains_code: bool


class ArticleClassifier:
    """
    Classifies articles into predefined categories based on content analysis.
    """

    def __init__(self, rules: Optional[Dict[str, Dict]] = None):
        """
        Initialize the classifier.

        Args:
            rules: Custom classification rules (optional)
        """
        self.rules = rules if rules is not None else CLASSIFICATION_RULES
        self._compile_patterns()

    def _compile_patterns(self) -> None:
        """Pre-compile regex patterns for performance."""
        self._keyword_patterns: Dict[str, re.Pattern] = {}
        for category, config in self.rules.items():
            patterns = [re.escape(kw) for kw in config["keywords"]]
            if patterns:
                combined = "|".join(patterns)
                self._keyword_patterns[category] = re.compile(combined, re.IGNORECASE)

    def _count_matches(self, text: str, category: str) -> int:
        """Count keyword matches for a category in text."""
        pattern = self._keyword_patterns.get(category)
        if not pattern:
            return 0
        matches = pattern.findall(text)
        return len(matches)

    def _check_exclusions(self, text: str, category: str) -> bool:
        """Check if text contains exclusion keywords for a category."""
        config = self.rules.get(category, {})
        exclusions = config.get("exclude", [])
        text_lower = text.lower()
        for exc in exclusions:
            if exc.lower() in text_lower:
                return True
        return False

    def classify_source_type(self, url: str, title: str, source: str) -> str:
        """
        Classify the source type based on URL and content.

        Args:
            url: Article URL
            title: Article title
            source: Source name

        Returns:
            Source type: "research", "news", "blog", or "social"
        """
        text = f"{url} {title} {source}".lower()

        for source_type, patterns in SOURCE_TYPE_PATTERNS.items():
            for pattern in patterns:
                if pattern.lower() in text:
                    return source_type

        # Default based on source
        if "arxiv" in source.lower():
            return "research"
        elif source.lower() in ["venturebeat", "techcrunch", "theverge", "wired"]:
            return "news"
        return "news"  # Default

    def classify_impact(self, title: str, content: str) -> str:
        """
        Determine impact level based on title and content.

        Args:
            title: Article title
            text: Article content

        Returns:
            Impact level: "breaking", "significant", or "interesting"
        """
        text = f"{title} {content}".lower()

        # Breaking keywords
        breaking = [
            "breaking",
            "just in",
            "exclusive",
            "announced",
            "launches",
            "releases",
            "unveils",
            "reveals",
            "revealed",
        ]
        if any(kw in text for kw in breaking):
            return "breaking"

        # Significant keywords
        significant = [
            "major",
            "significant",
            "breakthrough",
            "milestone",
            "first",
            "new",
            "announces",
            "partnership",
        ]
        if any(kw in text for kw in significant):
            return "significant"

        return "interesting"

    def classify_complexity(self, title: str, content: str) -> str:
        """
        Estimate content complexity based on language analysis.

        Args:
            title: Article title
            content: Article content

        Returns:
            Complexity level: "beginner", "technical", or "expert"
        """
        text = f"{title} {content}".lower()

        # Expert indicators
        expert_keywords = [
            "theoretical",
            "proof",
            "theorem",
            "mathematical",
            "convergence",
            "optimality",
            "bounds",
            "formal",
        ]
        if any(kw in text for kw in expert_keywords):
            return "expert"

        # Technical indicators
        technical_keywords = [
            "algorithm",
            "model",
            "training",
            "architecture",
            "performance",
            "benchmark",
            "accuracy",
            "论文",
            "模型",
        ]
        if any(kw in text for kw in technical_keywords):
            return "technical"

        # Check for code presence
        if "```" in content or "code" in text or "github" in text:
            return "technical"

        return "beginner"

    def check_contains_code(self, content: str) -> bool:
        """
        Check if content contains code snippets.

        Args:
            content: Article content

        Returns:
            True if code is present
        """
        code_indicators = [
            r"```[\s\S]+?```",  # Markdown code blocks
            r"`[^`]+`",  # Inline code
            r"def\s+\w+",  # Python function
            r"class\s+\w+",  # Class definition
            r"import\s+\w+",  # Import statement
            r"function\s+\w+",  # JavaScript function
        ]

        for pattern in code_indicators:
            if re.search(pattern, content):
                return True
        return False

    def classify(
        self, title: str, content: str, url: str = "", source: str = ""
    ) -> ClassificationResult:
        """
        Classify an article into categories.

        Args:
            title: Article title
            content: Article content/abstract
            url: Article URL (optional)
            source: Source name (optional)

        Returns:
            ClassificationResult with categories and metadata
        """
        text = f"{title} {content}".lower()

        # Score each category
        scores: Dict[str, float] = {}
        for category in self.rules:
            if self._check_exclusions(text, category):
                scores[category] = 0
            else:
                match_count = self._count_matches(text, category)
                scores[category] = match_count

        # Get top categories (score > 0)
        max_score = max(scores.values()) if scores.values() else 1
        threshold = 0.3 * max_score  # At least 30% of max score

        selected_categories = [
            cat for cat, score in scores.items() if score >= threshold and score > 0
        ]

        # If no category matches, default to "research"
        if not selected_categories:
            selected_categories = ["research"]

        # Calculate confidence
        total_score = sum(scores.values())
        confidence = (
            (total_score / (max_score * len(self.rules))) if total_score > 0 else 0.5
        )
        confidence = min(1.0, confidence)

        return ClassificationResult(
            categories=selected_categories,
            confidence=confidence,
            source_type=self.classify_source_type(url, title, source),
            impact_level=self.classify_impact(title, content),
            complexity=self.classify_complexity(title, content),
            contains_code=self.check_contains_code(content),
        )


# Convenience function
def classify_article(
    title: str, content: str, url: str = "", source: str = ""
) -> ClassificationResult:
    """
    Classify an article into categories.

    Args:
        title: Article title
        content: Article content/abstract
        url: Article URL (optional)
        source: Source name (optional)

    Returns:
        ClassificationResult with categories and metadata
    """
    classifier = ArticleClassifier()
    return classifier.classify(title, content, url, source)
