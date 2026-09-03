import json
from pathlib import Path

from models.schemas import DietPlan
from utils.config import settings


class DietRecommendationEngine:
    def __init__(self, knowledge_path: Path = settings.data_dir / "diet_kb.json") -> None:
        self.knowledge_path = knowledge_path

    def recommend(self, bmi: float, glucose: float, food_preference: str, diagnosis: str = "Type 2 Diabetes") -> DietPlan:
        data = json.loads(self.knowledge_path.read_text(encoding="utf-8"))
        target = "weight_loss" if bmi >= 27 else "maintenance"
        intensity = "strict" if glucose >= 180 else "balanced"
        
        pref = food_preference if food_preference in data else "veg"
        plan_dict = data[pref][target][intensity].copy()

        diag_lower = diagnosis.lower()
        if "type 1" in diag_lower:
            plan_dict["strategy"] = "Carbohydrate Counting & Insulin-to-Carb Ratio Glycemic Protocol"
            plan_dict["macro_breakdown"] = {"carbohydrate": "45%", "protein": "25%", "fat": "30%"}
        elif "prediabetes" in diag_lower:
            plan_dict["strategy"] = "Insulin Sensitivity Enhancement & Weight Reduction Glycemic Plan"
            plan_dict["macro_breakdown"] = {"carbohydrate": "35%", "protein": "35%", "fat": "30%"}
        elif "low" in diag_lower:
            plan_dict["strategy"] = "Balanced Whole-Food Glycemic & Cardiometabolic Wellness Plan"
            plan_dict["macro_breakdown"] = {"carbohydrate": "50%", "protein": "20%", "fat": "30%"}
        else:
            plan_dict["strategy"] = "Low Glycemic Index (GI < 55) & Calorie-Restricted Carbohydrate-Controlled Protocol"

        return DietPlan(**plan_dict)
