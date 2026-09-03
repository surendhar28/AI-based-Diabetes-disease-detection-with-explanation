from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


Gender = Literal["female", "male", "other"]
FoodPreference = Literal["veg", "non-veg"]
DiagnosisType = Literal["Type 1 Diabetes", "Type 2 Diabetes", "Prediabetes", "Low Diabetes Risk"]


class LabInputs(BaseModel):
    glucose: float | None = Field(default=None, ge=0)
    hba1c_level: float | None = Field(default=None, ge=0)
    hypertension: int | None = Field(default=0, ge=0, le=1)
    heart_disease: int | None = Field(default=0, ge=0, le=1)
    smoking_history: str | None = "no info"
    blood_pressure: float | None = Field(default=None, ge=0)
    skin_thickness: float | None = Field(default=None, ge=0)
    insulin: float | None = Field(default=None, ge=0)
    bmi: float | None = Field(default=None, ge=0)
    diabetes_pedigree_function: float | None = Field(default=0.45, ge=0)
    pregnancies: int | None = Field(default=0, ge=0)


class GeneralPredictionRequest(BaseModel):
    symptoms: str = Field(min_length=3, examples=["fatigue, increased thirst, frequent urination"])
    age: int = Field(ge=0, le=120)
    gender: Gender
    labs: LabInputs | None = None
    food_preference: FoodPreference = "veg"


class DiseaseProbability(BaseModel):
    disease: str
    probability: float


class GeneralPredictionResponse(BaseModel):
    predictions: list[DiseaseProbability]
    diabetes_triggered: bool
    trigger_reasons: list[str]


class DiabetesPredictionRequest(BaseModel):
    pregnancies: int = Field(default=0, ge=0)
    glucose: float = Field(ge=0)
    hba1c_level: float | None = Field(default=None, ge=0)
    hypertension: int = Field(default=0, ge=0, le=1)
    heart_disease: int = Field(default=0, ge=0, le=1)
    smoking_history: str = "no info"
    blood_pressure: float = Field(ge=0)
    skin_thickness: float = Field(ge=0)
    insulin: float = Field(ge=0)
    bmi: float = Field(ge=0)
    diabetes_pedigree_function: float = Field(default=0.45, ge=0)
    age: int = Field(ge=0, le=120)
    gender: Gender = "other"
    food_preference: FoodPreference = "veg"


class IndianBrandRecommendation(BaseModel):
    name: str
    manufacturer: str
    price: float
    pack_size: str
    composition: str


class AlternativeRecommendation(BaseModel):
    name: str
    benefit: str
    evidence_score: float
    source: str
    research_summary: str
    confidence_score: float


class MedicationRecommendation(BaseModel):
    medication: str
    dosage: str
    warnings: list[str]
    monitoring: list[str]
    brands: list[IndianBrandRecommendation] = []
    alternatives: list[AlternativeRecommendation] = []


class DietPlan(BaseModel):
    calories: int
    macro_breakdown: dict[str, str]
    meals: list[dict[str, str]]
    foods_to_avoid: list[str]


class VerifiedProof(BaseModel):
    source: str
    fact: str
    relevance_score: float
    clinical_notes: str | None = None


class GenAIExplanation(BaseModel):
    summary: str
    detailed_analysis: str
    verifies_proof: list[VerifiedProof]


class DiabetesPredictionResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    diagnosis: DiagnosisType
    risk_probability: float
    severity: str
    model_used: str
    model_metrics: dict[str, object] | None = None
    medication: list[MedicationRecommendation]
    diet: DietPlan
    alternative_medicine: list[AlternativeRecommendation]
    lifestyle_changes: list[dict[str, str | float]]
    genai_explanation: GenAIExplanation | None = None


class UserCreate(BaseModel):
    email: str
    password: str = Field(min_length=8)
    full_name: str
    role: Literal["doctor", "patient"] = "patient"


class LoginRequest(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class CaseCreate(BaseModel):
    patient_name: str | None = None
    patient_email: str
    symptoms: str
    labs: dict
    general_prediction: dict | None = None
    diabetes_prediction: dict | None = None
