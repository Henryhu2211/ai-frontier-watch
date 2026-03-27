"""
AI Frontier Watch - Configuration Loader
"""

import os
import yaml
from pathlib import Path
from typing import Any, Dict, Optional


class Config:
    """Configuration singleton for crawler settings."""

    _instance: Optional["Config"] = None
    _config: Dict[str, Any] = {}

    def __new__(cls) -> "Config":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._load_config()
        return cls._instance

    def _load_config(self) -> None:
        """Load configuration from YAML file and environment variables."""
        config_path = Path(__file__).parent.parent.parent / "config" / "crawlers.yaml"

        if not config_path.exists():
            raise FileNotFoundError(f"Configuration file not found: {config_path}")

        with open(config_path, "r") as f:
            self._config = yaml.safe_load(f)

        # Override with environment variables
        self._apply_env_overrides()

    def _apply_env_overrides(self) -> None:
        """Apply environment variable overrides."""
        env_mappings = {
            "DEEPL_API_KEY": ("deepl", "api_key"),
            "DEEPL_API_URL": ("deepl", "api_url"),
            "SUPABASE_URL": ("supabase", "url"),
            "SUPABASE_ANON_KEY": ("supabase", "anon_key"),
            "SUPABASE_SERVICE_KEY": ("supabase", "service_key"),
            "REDIS_URL": ("redis", "url"),
            "REDIS_TOKEN": ("redis", "token"),
            "LOG_LEVEL": ("logging", "level"),
        }

        for env_var, (section, key) in env_mappings.items():
            value = os.environ.get(env_var)
            if value:
                if section not in self._config:
                    self._config[section] = {}
                self._config[section][key] = value

    def get(self, *keys: str, default: Any = None) -> Any:
        """Get a nested configuration value."""
        value = self._config
        for key in keys:
            if isinstance(value, dict):
                value = value.get(key)
            else:
                return default
            if value is None:
                return default
        return value

    @property
    def deepl_api_key(self) -> str:
        return self.get("deepl", "api_key", default="")

    @property
    def deepl_api_url(self) -> str:
        return self.get(
            "deepl", "api_url", default="https://api-free.deepl.com/v2/translate"
        )

    @property
    def supabase_url(self) -> str:
        return self.get("supabase", "url", default="")

    @property
    def supabase_service_key(self) -> str:
        return self.get("supabase", "service_key", default="")

    @property
    def redis_url(self) -> str:
        return self.get("redis", "url", default="")

    @property
    def redis_token(self) -> str:
        return self.get("redis", "token", default="")

    @property
    def arxiv_api_url(self) -> str:
        return self.get("arxiv", "api_url", default="http://export.arxiv.org/api/query")

    @property
    def arxiv_categories(self) -> list:
        return self.get("arxiv", "categories", default=["cs.AI", "cs.LG"])

    @property
    def arxiv_max_results(self) -> int:
        return self.get("arxiv", "max_results", default=50)

    @property
    def sources(self) -> Dict[str, Any]:
        return self._config.get("sources", {})

    @property
    def classification_rules(self) -> Dict[str, Any]:
        return self._config.get("classification", {})

    @property
    def translation_retry(self) -> Dict[str, Any]:
        return self._config.get(
            "translation_retry", {"max_attempts": 3, "backoff_seconds": [1, 5, 30]}
        )

    @property
    def user_agent(self) -> str:
        return self._config.get("crawler", {}).get(
            "user_agent", "AI-Frontier-Watch/1.0 (Research Bot)"
        )

    @property
    def request_timeout(self) -> int:
        return self._config.get("crawler", {}).get("request_timeout_seconds", 30)


def get_config() -> Config:
    """Get the configuration instance."""
    return Config()
