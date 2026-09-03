from fastapi import APIRouter, Depends, HTTPException, Query

from agents.diabetes_agent.agent import DiabetesCDSSAgent
from agents.diabetes_agent.alternative import AlternativeMedicineEngine
from agents.diabetes_agent.diet import DietRecommendationEngine
from agents.diabetes_agent.medication import MedicationRecommendationEngine
from agents.general_agent.agent import GeneralMedicineAgent
from models.schemas import (
    AuthResponse,
    DiabetesPredictionRequest,
    DiabetesPredictionResponse,
    FoodPreference,
    GeneralPredictionRequest,
    GeneralPredictionResponse,
    LoginRequest,
    UserCreate,
    CaseCreate,
)
from services.audit import record_event
from services.auth import CurrentUser, get_current_user, login_user, register_user


router = APIRouter()
general_agent = GeneralMedicineAgent()
diabetes_agent = DiabetesCDSSAgent()


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/auth/register", response_model=AuthResponse)
def register(payload: UserCreate) -> AuthResponse:
    return AuthResponse(access_token=register_user(payload))


@router.post("/auth/login", response_model=AuthResponse)
def login(payload: LoginRequest) -> AuthResponse:
    return AuthResponse(access_token=login_user(payload))


@router.post("/predict/general", response_model=GeneralPredictionResponse)
def predict_general(
    payload: GeneralPredictionRequest,
    user: CurrentUser | None = Depends(get_current_user),
) -> GeneralPredictionResponse:
    try:
        response = general_agent.predict(payload)
        record_event(
            "general_prediction",
            {"request": payload.model_dump(), "response": response.model_dump()},
            user.email if user else None,
        )
        return response
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail="Model artifacts are missing. Run backend/models/train_models.py") from exc


@router.post("/predict/diabetes", response_model=DiabetesPredictionResponse)
def predict_diabetes(
    payload: DiabetesPredictionRequest,
    user: CurrentUser | None = Depends(get_current_user),
) -> DiabetesPredictionResponse:
    try:
        response = diabetes_agent.assess(payload)
        record_event(
            "diabetes_prediction",
            {"request": payload.model_dump(), "response": response.model_dump()},
            user.email if user else None,
        )
        return response
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail="Model artifacts are missing. Run backend/models/train_models.py") from exc


@router.get("/recommend/medication")
def recommend_medication(diagnosis: str = Query(...), severity: str = Query("moderate")):
    return MedicationRecommendationEngine().recommend(diagnosis, severity)


@router.get("/recommend/diet")
def recommend_diet(
    bmi: float = Query(..., ge=0),
    glucose: float = Query(..., ge=0),
    food_preference: FoodPreference = Query("veg"),
):
    return DietRecommendationEngine().recommend(bmi, glucose, food_preference)


@router.get("/recommend/alternative")
def recommend_alternative(diagnosis: str = Query("Type 2 Diabetes"), severity: str = Query("moderate")):
    herbs, lifestyle_changes, physical_activities = AlternativeMedicineEngine().recommend(diagnosis, severity)
    return {"herbs": herbs, "lifestyle_changes": lifestyle_changes, "physical_activities": physical_activities}


import json

@router.get("/auth/me")
def get_me(user: CurrentUser = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    from services.database import get_connection
    with get_connection() as conn:
        row = conn.execute("SELECT email, full_name, role FROM users WHERE email = ?", (user.email,)).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "email": row["email"],
        "full_name": row["full_name"],
        "role": row["role"]
    }


@router.post("/cases")
def create_case(payload: CaseCreate, user: CurrentUser = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    patient_email = payload.patient_email.lower()
    if user.role == "patient" and user.email != patient_email:
        raise HTTPException(status_code=403, detail="Patients can only create cases for themselves")
    
    from services.database import get_connection, utc_now
    with get_connection() as conn:
        conn.execute(
            """
            INSERT INTO patient_cases (patient_name, patient_email, doctor_email, symptoms, labs, general_prediction, diabetes_prediction, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                payload.patient_name,
                patient_email,
                user.email if user.role == "doctor" else None,
                payload.symptoms,
                json.dumps(payload.labs),
                json.dumps(payload.general_prediction) if payload.general_prediction else None,
                json.dumps(payload.diabetes_prediction) if payload.diabetes_prediction else None,
                utc_now()
            )
        )
    return {"status": "success"}


@router.get("/cases")
def list_cases(patient_email: str | None = None, user: CurrentUser = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    from services.database import get_connection
    with get_connection() as conn:
        if user.role == "doctor":
            if patient_email:
                rows = conn.execute(
                    "SELECT * FROM patient_cases WHERE patient_email = ? ORDER BY created_at DESC",
                    (patient_email.lower(),)
                ).fetchall()
            else:
                rows = conn.execute("SELECT * FROM patient_cases ORDER BY created_at DESC").fetchall()
        else:
            # Patients can only see their own cases
            rows = conn.execute(
                "SELECT * FROM patient_cases WHERE patient_email = ? ORDER BY created_at DESC",
                (user.email,)
            ).fetchall()
            
    cases = []
    for r in rows:
        case_data = {
            "id": r["id"],
            "patient_name": r["patient_name"] if "patient_name" in r.keys() else None,
            "patient_email": r["patient_email"],
            "doctor_email": r["doctor_email"],
            "symptoms": r["symptoms"],
            "labs": json.loads(r["labs"]),
            "created_at": r["created_at"]
        }
        
        gen_pred = json.loads(r["general_prediction"]) if r["general_prediction"] else None
        diab_pred = json.loads(r["diabetes_prediction"]) if r["diabetes_prediction"] else None
        
        if user.role == "patient":
            case_data["general_prediction"] = None
            if diab_pred:
                case_data["diabetes_prediction"] = {
                    "medication": diab_pred.get("medication", []),
                    "diet": diab_pred.get("diet", {})
                }
            else:
                case_data["diabetes_prediction"] = None
        else:
            case_data["general_prediction"] = gen_pred
            case_data["diabetes_prediction"] = diab_pred
            
        cases.append(case_data)
        
    return cases


@router.get("/cases/{case_id}")
def get_case(case_id: int, user: CurrentUser = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    from services.database import get_connection
    with get_connection() as conn:
        r = conn.execute("SELECT * FROM patient_cases WHERE id = ?", (case_id,)).fetchone()
    
    if not r:
        raise HTTPException(status_code=404, detail="Case not found")
        
    if user.role == "patient" and r["patient_email"] != user.email:
        raise HTTPException(status_code=403, detail="Access denied")
        
    case_data = {
        "id": r["id"],
        "patient_name": r["patient_name"] if "patient_name" in r.keys() else None,
        "patient_email": r["patient_email"],
        "doctor_email": r["doctor_email"],
        "symptoms": r["symptoms"],
        "labs": json.loads(r["labs"]),
        "created_at": r["created_at"]
    }
    
    gen_pred = json.loads(r["general_prediction"]) if r["general_prediction"] else None
    diab_pred = json.loads(r["diabetes_prediction"]) if r["diabetes_prediction"] else None
    
    if user.role == "patient":
        case_data["general_prediction"] = None
        if diab_pred:
            case_data["diabetes_prediction"] = {
                "medication": diab_pred.get("medication", []),
                "diet": diab_pred.get("diet", {})
            }
        else:
            case_data["diabetes_prediction"] = None
    else:
        case_data["general_prediction"] = gen_pred
        case_data["diabetes_prediction"] = diab_pred
        
    return case_data


@router.get("/patients")
def list_patients(user: CurrentUser = Depends(get_current_user)):
    if not user or user.role != "doctor":
        raise HTTPException(status_code=403, detail="Only doctors can view the patient list")
        
    from services.database import get_connection
    with get_connection() as conn:
        rows = conn.execute("SELECT DISTINCT email, full_name FROM users WHERE role = 'patient'").fetchall()
        case_rows = conn.execute("SELECT DISTINCT patient_email FROM patient_cases").fetchall()
        
    registered = {r["email"]: r["full_name"] for r in rows}
    all_emails = set(registered.keys()) | {r["patient_email"] for r in case_rows}
    
    patients_list = []
    for email in all_emails:
        patients_list.append({
            "email": email,
            "full_name": registered.get(email, "Unregistered Patient")
        })
    return patients_list
