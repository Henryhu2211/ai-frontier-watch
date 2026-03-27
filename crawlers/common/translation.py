"""
AI Frontier Watch - DeepL Translation Integration

Provides translation functionality using DeepL API with:
- Support for EN <-> ZH translation
- Retry logic with exponential backoff
- Error handling and logging
"""

import logging
import time
from typing import Optional, Tuple, List
from dataclasses import dataclass
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from .config import get_config

logger = logging.getLogger(__name__)


@dataclass
class TranslationResult:
    """Result of a translation operation."""

    success: bool
    translated_text: Optional[str] = None
    error: Optional[str] = None
    detected_source_lang: Optional[str] = None
    retry_count: int = 0


class DeepLTranslator:
    """
    DeepL API integration for article translation.

    Supports:
    - English to Chinese (EN -> ZH)
    - Chinese to English (ZH -> EN)
    """

    def __init__(self, api_key: Optional[str] = None, api_url: Optional[str] = None):
        """
        Initialize the DeepL translator.

        Args:
            api_key: DeepL API key (optional, loaded from config if not provided)
            api_url: DeepL API URL (optional, auto-selected based on key type)
        """
        config = get_config()
        self.api_key = api_key or config.deepl_api_key
        self.api_url = api_url or config.deepl_api_url

        # Check if using free or pro API
        if ":fx" in self.api_key:
            self.api_url = "https://api-free.deepl.com/v2/translate"
        else:
            self.api_url = "https://api.deepl.com/v2/translate"

        # Setup session with retry logic
        self.session = requests.Session()
        # Configure retry strategy
        retry_strategy = Retry(
            total=3,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        self.session.mount("http://", adapter)
        self.session.mount("https://", adapter)

        logger.info(f"DeepL Translator initialized with URL: {self.api_url}")

    def translate(
        self, text: str, target_lang: str = "ZH", source_lang: Optional[str] = None
    ) -> TranslationResult:
        """
        Translate text using DeepL API.

        Args:
            text: Text to translate
            target_lang: Target language code ("ZH" or "EN")
            source_lang: Source language code (auto-detected if None)

        Returns:
            TranslationResult with translated text or error
        """
        if not text or not text.strip():
            return TranslationResult(success=True, translated_text="", error=None)

        headers = {
            "Authorization": f"DeepL-Auth-Key {self.api_key}",
            "Content-Type": "application/x-www-form-urlencoded",
        }

        data = {
            "text": text,
            "target_lang": target_lang,
        }

        if source_lang:
            data["source_lang"] = source_lang

        try:
            response = self.session.post(
                self.api_url, headers=headers, data=data, timeout=30
            )

            if response.status_code == 200:
                result = response.json()
                return TranslationResult(
                    success=True,
                    translated_text=result["translations"][0]["text"],
                    detected_source_lang=result["translations"][0].get(
                        "detected_source_language"
                    ),
                    retry_count=0,
                )
            elif response.status_code == 403:
                return TranslationResult(success=False, error="Invalid API key")
            elif response.status_code == 456:
                return TranslationResult(success=False, error="Quota exceeded")
            else:
                return TranslationResult(
                    success=False,
                    error=f"API error: {response.status_code} - {response.text}",
                )

        except requests.exceptions.Timeout:
            return TranslationResult(success=False, error="Request timeout")
        except requests.exceptions.RequestException as e:
            return TranslationResult(success=False, error=f"Request failed: {str(e)}")

    def translate_with_retry(
        self,
        text: str,
        target_lang: str = "ZH",
        source_lang: Optional[str] = None,
        max_retries: int = 3,
        backoff_schedule: Optional[List[int]] = None,
    ) -> TranslationResult:
        """
        Translate text with automatic retry on failure.

        Args:
            text: Text to translate
            target_lang: Target language code
            source_lang: Source language code
            max_retries: Maximum number of retry attempts
            backoff_schedule: List of backoff delays in seconds

        Returns:
            TranslationResult with translated text or error
        """
        if backoff_schedule is None:
            backoff_schedule = [1, 5, 30]  # Default: 1s, 5s, 30s

        last_result = TranslationResult(success=False, error="Unknown error")

        for attempt in range(max_retries):
            result = self.translate(text, target_lang, source_lang)

            if result.success:
                result.retry_count = attempt
                return result

            last_result = result

            # Don't retry on permanent errors
            if result.error and "Invalid API key" in result.error:
                break

            # Wait before retry (except on last attempt)
            if attempt < max_retries - 1:
                delay = backoff_schedule[min(attempt, len(backoff_schedule) - 1)]
                logger.warning(
                    f"Translation failed (attempt {attempt + 1}/{max_retries}): "
                    f"{result.error}. Retrying in {delay}s..."
                )
                time.sleep(delay)

        last_result.retry_count = max_retries
        return last_result

    def translate_to_chinese(
        self, text: str, source_lang: Optional[str] = "EN"
    ) -> TranslationResult:
        """Convenience method for EN -> ZH translation."""
        return self.translate_with_retry(
            text, target_lang="ZH", source_lang=source_lang
        )

    def translate_to_english(
        self, text: str, source_lang: Optional[str] = "ZH"
    ) -> TranslationResult:
        """Convenience method for ZH -> EN translation."""
        return self.translate_with_retry(
            text, target_lang="EN", source_lang=source_lang
        )

    def batch_translate(
        self, texts: List[str], target_lang: str = "ZH"
    ) -> List[TranslationResult]:
        """
        Translate multiple texts.

        Args:
            texts: List of texts to translate
            target_lang: Target language code

        Returns:
            List of TranslationResults
        """
        results = []
        for text in texts:
            result = self.translate_with_retry(text, target_lang)
            results.append(result)

            # Small delay to avoid rate limiting
            time.sleep(0.1)

        return results

    def check_quota(self) -> Tuple[bool, Optional[str]]:
        """
        Check API usage quota.

        Returns:
            Tuple of (is_available, usage_info)
        """
        try:
            url = (
                "https://api-free.deepl.com/v2/usage"
                if ":fx" in self.api_key
                else "https://api.deepl.com/v2/usage"
            )
            response = self.session.get(
                url,
                headers={"Authorization": f"DeepL-Auth-Key {self.api_key}"},
                timeout=10,
            )

            if response.status_code == 200:
                usage = response.json()
                return (
                    True,
                    f"Characters used: {usage.get('character_count', 0)}/{usage.get('character_limit', 0)}",
                )
            return False, "Failed to check quota"
        except Exception as e:
            return False, str(e)


# Convenience function
def translate_text(
    text: str, target_lang: str = "ZH", source_lang: Optional[str] = None
) -> TranslationResult:
    """
    Translate text using DeepL.

    Args:
        text: Text to translate
        target_lang: Target language code ("ZH" or "EN")
        source_lang: Source language code (auto-detected if None)

    Returns:
        TranslationResult with translated text or error
    """
    translator = DeepLTranslator()
    return translator.translate_with_retry(text, target_lang, source_lang)


def translate_to_chinese(text: str) -> TranslationResult:
    """Translate English text to Chinese."""
    return translate_text(text, target_lang="ZH", source_lang="EN")


def translate_to_english(text: str) -> TranslationResult:
    """Translate Chinese text to English."""
    return translate_text(text, target_lang="EN", source_lang="ZH")
