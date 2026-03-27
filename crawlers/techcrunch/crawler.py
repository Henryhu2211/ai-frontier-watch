"""
AI Frontier Watch - TechCrunch AI Crawler

Crawls AI news from TechCrunch using RSS feed and HTML parsing.
"""

import logging
from datetime import datetime
from typing import List, Optional
import requests
from bs4 import BeautifulSoup
import feedparser

from ..common.config import get_config
from ..common.models import Article, SourceType, ImpactLevel, Complexity
from ..common.deduplication import URLHashDeduplicator
from ..common.classifier import ArticleClassifier

logger = logging.getLogger(__name__)


class TechCrunchCrawler:
    """
    Crawler for TechCrunch AI section.

    Uses RSS feed for efficient polling and HTML parsing for full content.
    """

    RSS_URL = "https://techcrunch.com/feed/"
    BASE_URL = "https://techcrunch.com"
    CATEGORY = "artificial-intelligence"

    def __init__(self):
        """Initialize TechCrunch crawler."""
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": get_config().user_agent})

        self.deduplicator = URLHashDeduplicator()
        self.classifier = ArticleClassifier()

        logger.info("TechCrunch AI Crawler initialized")

    def crawl(self, limit: int = 50) -> List[Article]:
        """
        Crawl TechCrunch AI section.

        Args:
            limit: Maximum number of articles to fetch

        Returns:
            List of Article objects
        """
        logger.info(f"Crawling TechCrunch AI (limit: {limit})")

        try:
            # Fetch RSS feed
            response = self.session.get(self.RSS_URL, timeout=30)
            response.raise_for_status()

            feed = feedparser.parse(response.content)

            articles = []
            for entry in feed.entries[:limit]:
                # Filter for AI-related articles
                title = entry.get("title", "").lower()
                summary = ""
                if hasattr(entry, "summary"):
                    summary = entry.summary.lower()
                elif hasattr(entry, "description"):
                    summary = entry.description.lower()

                # Simple filter for AI-related content
                ai_keywords = [
                    "ai",
                    "artificial intelligence",
                    "machine learning",
                    "llm",
                    "gpt",
                    "chatgpt",
                    "openai",
                    "google",
                    "microsoft",
                    "anthropic",
                    "stable diffusion",
                    "neural",
                ]

                if any(kw in title or kw in summary for kw in ai_keywords):
                    try:
                        article = self._parse_entry(entry)
                        if article and not self.deduplicator.is_duplicate(article.url):
                            self.deduplicator.mark_seen(article.url)
                            articles.append(article)
                    except Exception as e:
                        logger.warning(f"Failed to parse entry: {e}")
                        continue

            logger.info(f"Crawled {len(articles)} new articles from TechCrunch")
            return articles

        except requests.RequestException as e:
            logger.error(f"Failed to crawl TechCrunch: {e}")
            return []

    def _parse_entry(self, entry) -> Optional[Article]:
        """Parse a single RSS entry into an Article."""
        try:
            url = entry.get("link", "")
            title = entry.get("title", "").replace("\n", " ").strip()

            # Get summary
            summary = ""
            if hasattr(entry, "summary"):
                summary = entry.summary
            elif hasattr(entry, "description"):
                summary = entry.description
            summary = self._clean_html(summary)[:1000]

            # Get published date
            published_str = entry.get("published", "")
            try:
                published_at = datetime.fromisoformat(
                    published_str.replace("Z", "+00:00")
                )
            except (ValueError, AttributeError):
                published_at = datetime.utcnow()

            # Get authors
            authors = []
            if hasattr(entry, "authors"):
                for author in entry.authors:
                    if hasattr(author, "name"):
                        authors.append(author.name)
            elif hasattr(entry, "author"):
                authors = [entry.author]

            # Fetch full article for better classification
            content = self._fetch_full_content(url) or summary

            # Classify article
            classification = self.classifier.classify(
                title=title, content=content or summary, url=url, source="techcrunch"
            )

            article = Article(
                url=url,
                title=title,
                source="techcrunch",
                source_type=SourceType.NEWS,
                published_at=published_at,
                content=content or summary,
                summary=summary[:500] + "..." if len(summary) > 500 else summary,
                authors=authors,
                categories=classification.categories,
                impact_level=ImpactLevel(classification.impact_level),
                complexity=Complexity(classification.complexity),
                contains_code=classification.contains_code,
                language="en",
            )

            return article

        except Exception as e:
            logger.warning(f"Failed to parse TechCrunch entry: {e}")
            return None

    def _clean_html(self, html: str) -> str:
        """Remove HTML tags from text."""
        soup = BeautifulSoup(html, "html.parser")
        return soup.get_text(separator=" ", strip=True)

    def _fetch_full_content(self, url: str) -> Optional[str]:
        """Fetch full article content from URL."""
        try:
            response = self.session.get(url, timeout=15)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, "html.parser")

                # Try to find article content
                article_body = (
                    soup.find("article")
                    or soup.find("div", class_="article-content")
                    or soup.find("div", class_="post-content")
                )
                if article_body:
                    # Remove script and style elements
                    for tag in article_body.find_all(["script", "style", "aside"]):
                        tag.decompose()
                    return article_body.get_text(separator=" ", strip=True)[:5000]

        except Exception as e:
            logger.debug(f"Failed to fetch full content from {url}: {e}")

        return None


def crawl_techcrunch() -> List[Article]:
    """
    Convenience function to crawl TechCrunch.

    Returns:
        List of Article objects from TechCrunch
    """
    crawler = TechCrunchCrawler()
    return crawler.crawl()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)

    crawler = TechCrunchCrawler()
    articles = crawler.crawl(limit=10)

    for article in articles[:3]:
        print(f"\nTitle: {article.title}")
        print(f"URL: {article.url}")
        print(f"Categories: {article.categories}")
        print(f"Summary: {article.summary[:200]}...")
