"""
AI Frontier Watch - arXiv Crawler

Crawls research papers from arXiv API (cs.AI, cs.LG categories).
Extracts paper metadata including:
- arXiv ID
- Title
- Authors
- Abstract
- PDF link
- Categories
"""

import logging
import feedparser
from datetime import datetime
from typing import List, Optional, Dict, Any
from dataclasses import dataclass
import re
import requests

from ..common.config import get_config
from ..common.models import Article, SourceType, ImpactLevel, Complexity
from ..common.deduplication import URLHashDeduplicator
from ..common.classifier import ArticleClassifier

logger = logging.getLogger(__name__)


@dataclass
class ArxivCrawlerConfig:
    """Configuration for arXiv crawler."""

    api_url: str = "http://export.arxiv.org/api/query"
    categories: List[str] = None
    max_results: int = 50
    sort_by: str = "submittedDate"
    sort_order: str = "descending"

    def __post_init__(self):
        if self.categories is None:
            self.categories = ["cs.AI", "cs.LG"]


class ArxivCrawler:
    """
    Crawler for arXiv API.

    Fetches papers from cs.AI and cs.LG categories and returns Article objects.
    """

    def __init__(self, config: Optional[ArxivCrawlerConfig] = None):
        """
        Initialize arXiv crawler.

        Args:
            config: Optional custom configuration
        """
        self.config = config or ArxivCrawlerConfig()
        self.config.api_url = get_config().arxiv_api_url
        self.config.categories = get_config().arxiv_categories
        self.config.max_results = get_config().arxiv_max_results

        self.session = requests.Session()
        self.session.headers.update({"User-Agent": get_config().user_agent})

        self.deduplicator = URLHashDeduplicator()
        self.classifier = ArticleClassifier()

        logger.info(
            f"ArXiv Crawler initialized for categories: {self.config.categories}"
        )

    def _build_query(self) -> str:
        """Build the arXiv API query string."""
        # Build category query
        category_query = "+OR+".join([f"cat:{cat}" for cat in self.config.categories])
        return f"?search_query={category_query}&sortBy={self.config.sort_by}&sortOrder={self.config.sort_order}&max_results={self.config.max_results}"

    def _parse_arxiv_id(self, entry_id: str) -> str:
        """Extract arXiv ID from entry ID URL."""
        # Entry ID format: http://arxiv.org/abs/2301.12345v1
        match = re.search(r"(\d+\.\d+)", entry_id)
        if match:
            return match.group(1)
        return entry_id.split("/")[-1]

    def _parse_authors(self, entry: Dict) -> List[str]:
        """Parse authors from arXiv entry."""
        authors = []
        if "authors" in entry:
            for author in entry.get("authors", []):
                if hasattr(author, "name"):
                    authors.append(author.name)
                elif isinstance(author, dict):
                    authors.append(author.get("name", ""))
        elif "author" in entry:
            # Some feeds use 'author' as single author
            author = entry["author"]
            if isinstance(author, dict):
                authors.append(author.get("name", ""))
            else:
                authors.append(str(author))
        return [a.strip() for a in authors if a.strip()]

    def _parse_categories(self, entry: Dict) -> List[str]:
        """Parse arXiv categories from entry."""
        categories = []
        if "tags" in entry:
            for tag in entry.get("tags", []):
                if hasattr(tag, "term"):
                    categories.append(tag.term)
                elif isinstance(tag, dict):
                    categories.append(tag.get("term", ""))
        return [c for c in categories if c]

    def _extract_pdf_link(self, entry: Dict) -> Optional[str]:
        """Extract PDF link from arXiv entry."""
        links = entry.get("links", [])
        for link in links:
            if hasattr(link, "href"):
                if "pdf" in link.href:
                    return link.href
            elif isinstance(link, dict):
                if "pdf" in link.get("href", ""):
                    return link.get("href")

        # Fallback: construct from arXiv ID
        if "id" in entry:
            arxiv_id = self._parse_arxiv_id(entry["id"])
            return f"https://arxiv.org/pdf/{arxiv_id}.pdf"

        return None

    def crawl(self, categories: Optional[List[str]] = None) -> List[Article]:
        """
        Crawl arXiv for papers in specified categories.

        Args:
            categories: Override categories (optional)

        Returns:
            List of Article objects
        """
        if categories:
            original_categories = self.config.categories
            self.config.categories = categories

        query = self._build_query()
        url = f"{self.config.api_url}{query}"

        logger.info(f"Crawling arXiv: {url}")

        try:
            response = self.session.get(url, timeout=60)
            response.raise_for_status()

            # Parse XML feed
            feed = feedparser.parse(response.content)

            articles = []
            for entry in feed.entries:
                try:
                    article = self._parse_entry(entry)
                    if article and not self.deduplicator.is_duplicate(article.url):
                        self.deduplicator.mark_seen(article.url)
                        articles.append(article)
                except Exception as e:
                    logger.warning(f"Failed to parse entry: {e}")
                    continue

            logger.info(f"Crawled {len(articles)} new articles from arXiv")

            # Restore categories if overridden
            if categories:
                self.config.categories = original_categories

            return articles

        except requests.RequestException as e:
            logger.error(f"Failed to crawl arXiv: {e}")
            return []

    def _parse_entry(self, entry: Dict) -> Optional[Article]:
        """Parse a single arXiv entry into an Article."""
        try:
            url = entry.get("id", "")
            arxiv_id = self._parse_arxiv_id(url)

            # Get title
            title = entry.get("title", "").replace("\n", " ").strip()

            # Get summary/abstract
            summary = entry.get("summary", "").replace("\n", " ").strip()

            # Get published date
            published_str = entry.get("published", "")
            try:
                published_at = datetime.fromisoformat(
                    published_str.replace("Z", "+00:00")
                )
            except (ValueError, AttributeError):
                published_at = datetime.utcnow()

            # Get authors
            authors = self._parse_authors(entry)

            # Get PDF link
            pdf_url = self._extract_pdf_link(entry)

            # Classify article
            classification = self.classifier.classify(
                title=title, content=summary, url=url, source="arxiv"
            )

            # Determine arXiv categories
            arxiv_categories = self._parse_categories(entry)

            article = Article(
                url=url,
                title=title,
                source="arxiv",
                source_type=SourceType.RESEARCH,
                published_at=published_at,
                content=summary,
                summary=summary[:500] + "..." if len(summary) > 500 else summary,
                authors=authors,
                categories=classification.categories,
                impact_level=ImpactLevel(classification.impact_level),
                complexity=Complexity(classification.complexity),
                contains_code=classification.contains_code,
                language="en",
                arxiv_id=arxiv_id,
                arxiv_pdf_url=pdf_url,
                tags=arxiv_categories,
            )

            return article

        except Exception as e:
            logger.warning(f"Failed to parse arXiv entry: {e}")
            return None

    def crawl_single_category(self, category: str) -> List[Article]:
        """Crawl papers from a single arXiv category."""
        return self.crawl(categories=[category])

    def crawl_recent_days(self, days: int = 7) -> List[Article]:
        """Crawl papers from the last N days (not fully implemented for API)."""
        # arXiv API doesn't support date filtering in the same way
        # This would need additional processing after fetching
        return self.crawl()


def crawl_arxiv() -> List[Article]:
    """
    Convenience function to crawl arXiv.

    Returns:
        List of Article objects from arXiv
    """
    crawler = ArxivCrawler()
    return crawler.crawl()


if __name__ == "__main__":
    # Test the crawler
    logging.basicConfig(level=logging.INFO)

    crawler = ArxivCrawler()
    articles = crawler.crawl()

    for article in articles[:3]:
        print(f"\nTitle: {article.title}")
        print(f"arXiv ID: {article.arxiv_id}")
        print(f"Authors: {', '.join(article.authors[:3])}")
        print(f"Categories: {article.categories}")
        print(f"PDF: {article.arxiv_pdf_url}")
