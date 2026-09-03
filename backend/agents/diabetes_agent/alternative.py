import json
from pathlib import Path

from models.schemas import AlternativeRecommendation
from utils.config import settings


class AlternativeMedicineEngine:
    def __init__(self, knowledge_path: Path = settings.data_dir / "alternative_medicine_kb.json") -> None:
        self.knowledge_path = knowledge_path

    def recommend_physical_activities(self, diagnosis: str = "Type 2 Diabetes", severity: str = "moderate") -> list[dict[str, str | float]]:
        """
        Returns physical activities tailored specifically to the patient's diabetes diagnosis.
        """
        diag_lower = diagnosis.lower()
        if "type 2" in diag_lower or severity == "severe":
            return [
                {
                    "name": "Brisk Zone-2 Aerobic Walking",
                    "duration": "30 mins / day (150 mins / week)",
                    "frequency": "5 days / week",
                    "intensity": "Moderate (Zone 2)",
                    "clinical_mechanism": "Stimulates GLUT4 glucose transporter translocation in skeletal muscle independent of insulin, lowering postprandial blood glucose for up to 48 hours.",
                    "evidence_score": 0.95
                },
                {
                    "name": "Post-Meal Glucose-Sponge Walks",
                    "duration": "10-15 mins immediately post-meal",
                    "frequency": "After Lunch & Dinner",
                    "intensity": "Light-to-Moderate",
                    "clinical_mechanism": "Attenuates postprandial glycemic spikes by utilizing circulating blood glucose directly into active quadriceps and calf muscles.",
                    "evidence_score": 0.92
                },
                {
                    "name": "Progressive Resistance Training",
                    "duration": "30-45 mins per session",
                    "frequency": "2-3 non-consecutive days / week",
                    "intensity": "Moderate-to-High",
                    "clinical_mechanism": "Increases skeletal muscle mass (the body's largest glucose sink) to enhance baseline insulin sensitivity and storage capacity.",
                    "evidence_score": 0.88
                },
                {
                    "name": "Yogic Pranayama & Surya Namaskar",
                    "duration": "20 mins / day",
                    "frequency": "Daily (Morning)",
                    "intensity": "Low-to-Moderate",
                    "clinical_mechanism": "Reduces salivary cortisol and sympathetic tone, suppressing stress-induced hepatic gluconeogenesis.",
                    "evidence_score": 0.82
                }
            ]
        elif "type 1" in diag_lower:
            return [
                {
                    "name": "Continuous Moderate Aerobic Exercise",
                    "duration": "30 mins / day (150 mins / week)",
                    "frequency": "5 days / week",
                    "intensity": "Moderate",
                    "clinical_mechanism": "Supports cardiovascular endurance; requires pre-exercise blood glucose check (>100 mg/dL) to prevent acute hypoglycemia.",
                    "evidence_score": 0.90
                },
                {
                    "name": "Mixed Aerobic & Resistance Bursts",
                    "duration": "20-30 mins per session",
                    "frequency": "3 days / week",
                    "intensity": "Moderate",
                    "clinical_mechanism": "Combining short resistance sprints with aerobic walking helps stabilize glucose fluctuations during exercise.",
                    "evidence_score": 0.86
                },
                {
                    "name": "Post-Workout Hypoglycemia Protocol",
                    "duration": "Continuous Monitoring",
                    "frequency": "Post Exercise",
                    "intensity": "Safety Measure",
                    "clinical_mechanism": "Replenishes glycogen stores safely; carry 15g fast-acting carbohydrates (glucose tablets/fruit juice) during activity.",
                    "evidence_score": 0.94
                }
            ]
        elif "prediabetes" in diag_lower:
            return [
                {
                    "name": "Brisk Interval Walking / Cycling (DPP Protocol)",
                    "duration": "30-45 mins / day (175 mins / week)",
                    "frequency": "5-6 days / week",
                    "intensity": "Moderate-to-Vigorous",
                    "clinical_mechanism": "Diabetes Prevention Program (DPP) trial proved 150+ mins/week + 5-7% weight reduction reduces progression to T2D by 58%.",
                    "evidence_score": 0.96
                },
                {
                    "name": "10,000 Step Daily Target & Break Sedentary Bouts",
                    "duration": "Throughout the day",
                    "frequency": "Daily",
                    "intensity": "Light-to-Moderate",
                    "clinical_mechanism": "Breaking up prolonged sitting with 2-minute movement breaks every 30 minutes improves insulin response and lipid profiles.",
                    "evidence_score": 0.89
                },
                {
                    "name": "Full-Body Bodyweight Circuit Training",
                    "duration": "25 mins / session",
                    "frequency": "3 days / week",
                    "intensity": "Moderate",
                    "clinical_mechanism": "Improves peripheral tissue glucose uptake and metabolic flexibilty.",
                    "evidence_score": 0.85
                }
            ]
        else:
            return [
                {
                    "name": "General Cardiovascular & Aerobic Routine",
                    "duration": "30 mins / day (150 mins / week)",
                    "frequency": "5 days / week",
                    "intensity": "Moderate",
                    "clinical_mechanism": "Maintains optimal insulin sensitivity, endothelial function, and systemic vascular compliance.",
                    "evidence_score": 0.90
                },
                {
                    "name": "Core & Balance Mobility Yoga",
                    "duration": "20 mins / day",
                    "frequency": "Daily",
                    "intensity": "Light",
                    "clinical_mechanism": "Promotes parasympathetic recovery and reduces metabolic inflammation.",
                    "evidence_score": 0.80
                }
            ]

    def recommend(self, diagnosis: str = "Type 2 Diabetes", severity: str = "moderate", limit: int = 3) -> tuple[list[AlternativeRecommendation], list[dict[str, str | float]], list[dict[str, str | float]]]:
        data = json.loads(self.knowledge_path.read_text(encoding="utf-8"))
        herbs = sorted(data["herbs"], key=lambda item: item["evidence_score"], reverse=True)[:limit]
        activities = self.recommend_physical_activities(diagnosis, severity)
        return [AlternativeRecommendation(**item) for item in herbs], data["lifestyle_changes"], activities
