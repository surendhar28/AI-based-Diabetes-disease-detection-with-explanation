import numpy as np

from models.schemas import DiseaseProbability, GeneralPredictionRequest, GeneralPredictionResponse
from services.model_registry import registry
from utils.config import settings


class GeneralMedicineAgent:
    model_filename = "general_medicine_model.pkl"

    def predict(self, payload: GeneralPredictionRequest) -> GeneralPredictionResponse:
        pipeline = registry.load(self.model_filename)
        probabilities = pipeline.predict_proba([payload.symptoms])[0]
        classes = pipeline.classes_
        top_indexes = np.argsort(probabilities)[::-1][:3]
        predictions = [
            DiseaseProbability(disease=str(classes[index]), probability=round(float(probabilities[index]), 4))
            for index in top_indexes
        ]

        trigger_reasons: list[str] = []
        labs = payload.labs
        if labs and labs.glucose is not None and labs.glucose >= settings.diabetes_glucose_trigger:
            trigger_reasons.append(f"Glucose {labs.glucose:g} mg/dL exceeds trigger threshold")

        diabetes_probability = next((item.probability for item in predictions if item.disease.lower() == "diabetes mellitus"), 0.0)
        if diabetes_probability >= settings.diabetes_probability_trigger:
            trigger_reasons.append(f"General model diabetes probability {diabetes_probability:.0%} exceeds trigger threshold")

        return GeneralPredictionResponse(
            predictions=predictions,
            diabetes_triggered=bool(trigger_reasons),
            trigger_reasons=trigger_reasons,
        )
