from agents.diabetes_agent.alternative import AlternativeMedicineEngine
from agents.diabetes_agent.diagnosis import DiabetesDiagnosisEngine
from agents.diabetes_agent.diet import DietRecommendationEngine
from agents.diabetes_agent.explanation import DiabetesExplanationEngine
from agents.diabetes_agent.medication import MedicationRecommendationEngine
from models.schemas import DiabetesPredictionRequest, DiabetesPredictionResponse


class DiabetesCDSSAgent:
    def __init__(self) -> None:
        self.diagnosis_engine = DiabetesDiagnosisEngine()
        self.medication_engine = MedicationRecommendationEngine()
        self.diet_engine = DietRecommendationEngine()
        self.alternative_engine = AlternativeMedicineEngine()
        self.explanation_engine = DiabetesExplanationEngine()

    def assess(self, payload: DiabetesPredictionRequest) -> DiabetesPredictionResponse:
        risk_probability, model_used = self.diagnosis_engine.predict_risk(payload)
        diagnosis, severity = self.diagnosis_engine.classify(payload, risk_probability)
        alternatives, lifestyle_changes, physical_activities = self.alternative_engine.recommend(diagnosis, severity)
        genai_explanation = self.explanation_engine.explain(payload, diagnosis, risk_probability, severity)
        return DiabetesPredictionResponse(
            diagnosis=diagnosis,
            risk_probability=risk_probability,
            severity=severity,
            model_used=model_used,
            model_metrics=self.diagnosis_engine.metrics(),
            medication=self.medication_engine.recommend(diagnosis, severity),
            diet=self.diet_engine.recommend(payload.bmi, payload.glucose, payload.food_preference),
            alternative_medicine=alternatives,
            lifestyle_changes=lifestyle_changes,
            physical_activities=physical_activities,
            genai_explanation=genai_explanation,
        )
