import json
from pathlib import Path

from models.schemas import DietPlan
from utils.config import settings


class DietRecommendationEngine:
    def __init__(self, knowledge_path: Path = settings.data_dir / "diet_kb.json") -> None:
        self.knowledge_path = knowledge_path

    def recommend(self, bmi: float, glucose: float, food_preference: str) -> DietPlan:
        data = json.loads(self.knowledge_path.read_text(encoding="utf-8"))
        target = "weight_loss" if bmi >= 27 else "maintenance"
        intensity = "strict" if glucose >= 180 else "balanced"
        plan = data[food_preference][target][intensity]
        return DietPlan(**plan)
