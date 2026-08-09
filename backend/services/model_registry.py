from pathlib import Path
from typing import Any

import joblib

from utils.config import settings


class ModelRegistry:
    def __init__(self, model_dir: Path = settings.model_dir) -> None:
        self.model_dir = model_dir
        self._cache: dict[str, Any] = {}

    def load(self, filename: str) -> Any:
        if filename not in self._cache:
            path = self.model_dir / filename
            if not path.exists():
                raise FileNotFoundError(f"Missing model artifact: {path}")
            self._cache[filename] = joblib.load(path)
        return self._cache[filename]


registry = ModelRegistry()
