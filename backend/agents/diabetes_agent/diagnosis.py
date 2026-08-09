import pandas as pd

from models.schemas import DiabetesPredictionRequest
from services.model_registry import registry


PIMA_FEATURES = [
    "Pregnancies",
    "Glucose",
    "BloodPressure",
    "SkinThickness",
    "Insulin",
    "BMI",
    "DiabetesPedigreeFunction",
    "Age",
]
KAGGLE_FEATURES = [
    "gender",
    "age",
    "hypertension",
    "heart_disease",
    "smoking_history",
    "bmi",
    "HbA1c_level",
    "blood_glucose_level",
]


class DiabetesDiagnosisEngine:
    model_filename = "diabetes_xgb_pipeline.pkl"

    def predict_risk(self, payload: DiabetesPredictionRequest) -> tuple[float, str]:
        model_bundle = registry.load(self.model_filename)
        features = model_bundle.get("features", PIMA_FEATURES)
        row = self._build_feature_row(payload, features)
        risk = float(model_bundle["model"].predict_proba(row)[0][1])
        return round(risk, 4), model_bundle.get("model_name", "XGBoost")

    def metrics(self) -> dict[str, object] | None:
        model_bundle = registry.load(self.model_filename)
        return model_bundle.get("metrics")

    def _build_feature_row(self, payload: DiabetesPredictionRequest, features: list[str]) -> pd.DataFrame:
        if set(KAGGLE_FEATURES).issubset(features):
            estimated_hba1c = payload.hba1c_level
            if estimated_hba1c is None:
                estimated_hba1c = 5.6 if payload.glucose < 126 else 7.0 if payload.glucose < 200 else 8.2
            row = {
                "gender": payload.gender.lower(),
                "age": payload.age,
                "hypertension": payload.hypertension,
                "heart_disease": payload.heart_disease,
                "smoking_history": payload.smoking_history.lower().strip(),
                "bmi": payload.bmi,
                "HbA1c_level": estimated_hba1c,
                "blood_glucose_level": payload.glucose,
            }
            return pd.DataFrame([row], columns=features)

        row = {
            "Pregnancies": payload.pregnancies,
            "Glucose": payload.glucose,
            "BloodPressure": payload.blood_pressure,
            "SkinThickness": payload.skin_thickness,
            "Insulin": payload.insulin,
            "BMI": payload.bmi,
            "DiabetesPedigreeFunction": payload.diabetes_pedigree_function,
            "Age": payload.age,
        }
        return pd.DataFrame([row], columns=features)

    def classify(self, payload: DiabetesPredictionRequest, risk_probability: float) -> tuple[str, str]:
        if risk_probability < 0.35 and payload.glucose < 100:
            return "Low Diabetes Risk", "low"
        if 100 <= payload.glucose < 126 or 0.35 <= risk_probability < 0.60:
            return "Prediabetes", "moderate"
        if payload.age < 30 and payload.bmi < 25 and payload.insulin <= 20:
            return "Type 1 Diabetes", "high"
        severity = "severe" if payload.glucose >= 250 or risk_probability >= 0.85 else "high"
        return "Type 2 Diabetes", severity
