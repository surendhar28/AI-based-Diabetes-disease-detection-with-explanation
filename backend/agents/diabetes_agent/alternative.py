import json
from pathlib import Path

from models.schemas import AlternativeRecommendation
from utils.config import settings


class AlternativeMedicineEngine:
    def __init__(self, knowledge_path: Path = settings.data_dir / "alternative_medicine_kb.json") -> None:
        self.knowledge_path = knowledge_path

    def recommend(self, limit: int = 3) -> tuple[list[AlternativeRecommendation], list[dict[str, str | float]]]:
        data = json.loads(self.knowledge_path.read_text(encoding="utf-8"))
        herbs = sorted(data["herbs"], key=lambda item: item["evidence_score"], reverse=True)[:limit]
        return [AlternativeRecommendation(**item) for item in herbs], data["lifestyle_changes"]
