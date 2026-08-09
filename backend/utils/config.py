from functools import lru_cache
import os
import tempfile
from pathlib import Path

from pydantic import BaseModel, ConfigDict


ROOT_DIR = Path(__file__).resolve().parents[1]


class Settings(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    data_dir: Path = ROOT_DIR / "data"
    model_dir: Path = ROOT_DIR / "models"
    sqlite_path: Path = Path(
        os.getenv("HEALTHCARE_SQLITE_PATH", Path(tempfile.gettempdir()) / "agentic_healthcare.sqlite3")
    )
    allowed_origins: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
        "http://localhost:4174",
        "http://127.0.0.1:4174",
    ]
    diabetes_glucose_trigger: float = 126.0
    diabetes_probability_trigger: float = 0.60


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
