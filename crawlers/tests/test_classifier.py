"""
AI Frontier Watch - Unit Tests for Article Classifier
"""

import pytest

from ..common.classifier import (
    ArticleClassifier,
    ClassificationResult,
    classify_article,
    Category,
)


class TestArticleClassifier:
    """Test suite for ArticleClassifier."""

    def setup_method(self):
        """Set up test fixtures."""
        self.classifier = ArticleClassifier()

    def test_classify_llm_article(self):
        """Test classification of LLM-related article."""
        title = "GPT-5: A New Era of Large Language Models"
        content = "OpenAI announces GPT-5, their latest large language model with improved reasoning capabilities."

        result = self.classifier.classify(title, content, source="test")

        assert "llms" in result.categories
        assert result.source_type == "news"  # Default
        assert result.complexity in ["beginner", "technical", "expert"]

    def test_classify_vision_article(self):
        """Test classification of computer vision article."""
        title = "Stable Diffusion 3.0: Better Image Generation"
        content = "Stability AI releases Stable Diffusion 3.0 with improved diffusion models for text-to-image generation."

        result = self.classifier.classify(title, content, source="test")

        assert "vision" in result.categories

    def test_classify_safety_article(self):
        """Test classification of AI safety article."""
        title = "New Research on AI Alignment"
        content = "Researchers propose new methods for AI alignment and safety to prevent unintended behavior."

        result = self.classifier.classify(title, content, source="test")

        assert "safety" in result.categories

    def test_classify_research_article(self):
        """Test classification of research paper."""
        title = "Attention Is All You Need - New Benchmark Results"
        content = "This paper presents state-of-the-art results on multiple benchmarks using transformer architecture."

        result = self.classifier.classify(title, content, source="arxiv")

        assert "research" in result.categories
        assert result.source_type == "research"

    def test_classify_industry_article(self):
        """Test classification of industry news."""
        title = "Anthropic Raises $500M in Series C Funding"
        content = "AI startup Anthropic announces $500 million investment from Google and other investors."

        result = self.classifier.classify(title, content, source="test")

        assert "industry" in result.categories

    def test_classify_mixed_content(self):
        """Test classification of article with multiple topics."""
        title = "New AI Model Combines Language and Vision"
        content = "A new multimodal large language model achieves breakthrough in both text and image understanding."

        result = self.classifier.classify(title, content, source="test")

        # Should match both LLMs and Vision
        assert len(result.categories) >= 1
        assert "llms" in result.categories or "vision" in result.categories

    def test_default_category_for_unrelated(self):
        """Test that unrelated articles get default category."""
        title = "Weather Forecast for Tomorrow"
        content = "It will be sunny with a chance of rain."

        result = self.classifier.classify(title, content, source="test")

        # Should default to "research"
        assert "research" in result.categories

    def test_confidence_calculation(self):
        """Test that confidence is calculated correctly."""
        # Strong match
        strong_title = "GPT-4 Large Language Model RLHF Fine-tuning"
        strong_content = "Large language model with transformer architecture, trained using RLHF and instruction tuning."

        result = self.classifier.classify(strong_title, strong_content, source="test")
        assert result.confidence > 0.5

    def test_contains_code_detection(self):
        """Test detection of code in content."""
        content_with_code = """
        Here is how to use the model:
        ```python
        model = TransformerModel()
        output = model.predict(input)
        ```
        """

        result = self.classifier.check_contains_code(content_with_code)
        assert result is True

    def test_no_code_detection(self):
        """Test that plain text doesn't trigger code detection."""
        content_without_code = """
        This is a regular article about artificial intelligence 
        and machine learning applications in industry.
        """

        result = self.classifier.check_contains_code(content_without_code)
        assert result is False

    def test_source_type_research(self):
        """Test source type detection for research sources."""
        result = self.classifier.classify_source_type(
            url="https://arxiv.org/abs/2301.12345", title="Test Paper", source="arxiv"
        )
        assert result == "research"

    def test_source_type_news(self):
        """Test source type detection for news sources."""
        result = self.classifier.classify_source_type(
            url="https://venturebeat.com/ai/test",
            title="Test Article",
            source="venturebeat",
        )
        assert result == "news"

    def test_impact_breaking(self):
        """Test impact level 'breaking' detection."""
        result = self.classifier.classify_impact(
            title="BREAKING: OpenAI Announces GPT-5",
            content="Just in: Major announcement",
        )
        assert result == "breaking"

    def test_impact_significant(self):
        """Test impact level 'significant' detection."""
        result = self.classifier.classify_impact(
            title="Major Breakthrough in AI Research",
            content="Significant progress in neural networks",
        )
        assert result == "significant"

    def test_impact_interesting(self):
        """Test impact level 'interesting' for regular articles."""
        result = self.classifier.classify_impact(
            title="Weekly AI News Roundup", content="Various updates in AI"
        )
        assert result == "interesting"

    def test_complexity_expert(self):
        """Test complexity 'expert' detection."""
        result = self.classifier.classify_complexity(
            title="Mathematical Proof of Model Convergence",
            content="We prove the theoretical convergence bounds for this algorithm.",
        )
        assert result == "expert"

    def test_complexity_technical(self):
        """Test complexity 'technical' detection."""
        result = self.classifier.classify_complexity(
            title="New Neural Network Architecture",
            content="This model architecture improves benchmark performance significantly.",
        )
        assert result == "technical"

    def test_complexity_beginner(self):
        """Test complexity 'beginner' for accessible content."""
        result = self.classifier.classify_complexity(
            title="Introduction to AI",
            content="AI is changing the world. Here's what you need to know.",
        )
        assert result == "beginner"


class TestClassifyArticleFunction:
    """Test suite for convenience classify_article function."""

    def test_classify_article_returns_result(self):
        """Test that convenience function returns ClassificationResult."""
        result = classify_article(title="Test Article", content="Test content about AI")
        assert isinstance(result, ClassificationResult)
        assert len(result.categories) > 0

    def test_classify_article_with_all_params(self):
        """Test convenience function with all parameters."""
        result = classify_article(
            title="GPT-4 Release",
            content="OpenAI releases GPT-4",
            url="https://openai.com/gpt4",
            source="openai",
        )
        assert isinstance(result, ClassificationResult)
        assert "llms" in result.categories


class TestClassificationResult:
    """Test suite for ClassificationResult dataclass."""

    def test_result_creation(self):
        """Test creating ClassificationResult."""
        result = ClassificationResult(
            categories=["llms", "vision"],
            confidence=0.85,
            source_type="news",
            impact_level="significant",
            complexity="technical",
            contains_code=False,
        )

        assert result.categories == ["llms", "vision"]
        assert result.confidence == 0.85
        assert result.source_type == "news"

    def test_result_immutability(self):
        """Test that categories list can be modified."""
        result = ClassificationResult(
            categories=["llms"],
            confidence=0.5,
            source_type="news",
            impact_level="interesting",
            complexity="technical",
            contains_code=False,
        )

        result.categories.append("vision")
        assert "vision" in result.categories


class TestChineseKeywords:
    """Test suite for Chinese keyword classification."""

    def setup_method(self):
        """Set up test fixtures."""
        self.classifier = ArticleClassifier()

    def test_llm_chinese_keywords(self):
        """Test LLMs classification with Chinese keywords."""
        title = "大语言模型的新突破"
        content = "这篇论文介绍了一种新的大语言模型，使用了预训练和微调技术。"

        result = self.classifier.classify(title, content, source="test")
        assert "llms" in result.categories

    def test_safety_chinese_keywords(self):
        """Test safety classification with Chinese keywords."""
        title = "AI安全研究新进展"
        content = "研究人员提出了新的AI对齐和安全方法。"

        result = self.classifier.classify(title, content, source="test")
        assert "safety" in result.categories

    def test_industry_chinese_keywords(self):
        """Test industry classification with Chinese keywords."""
        title = "AI公司获得新一轮融资"
        content = "某AI初创公司宣布完成B轮融资。"

        result = self.classifier.classify(title, content, source="test")
        assert "industry" in result.categories


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
