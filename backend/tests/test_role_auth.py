import pytest
from fastapi.testclient import TestClient
from main import app
from services.database import get_connection, init_db

# Initialize database before tests
@pytest.fixture(autouse=True)
def setup_db():
    init_db()
    # Clean up test accounts
    with get_connection() as conn:
        conn.execute("DELETE FROM users WHERE email IN ('test_doc@test.com', 'test_pat@test.com')")
        conn.execute("DELETE FROM patient_cases WHERE patient_email = 'test_pat@test.com'")


def test_auth_registration_and_login():
    client = TestClient(app)

    # 1. Register a doctor
    res = client.post(
        "/auth/register",
        json={"email": "test_doc@test.com", "password": "password123", "full_name": "Test Doctor", "role": "doctor"}
    )
    assert res.status_code == 200
    token = res.json()["access_token"]
    assert token

    # 2. Get profile details of the doctor
    res = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    profile = res.json()
    assert profile["email"] == "test_doc@test.com"
    assert profile["role"] == "doctor"

    # 3. Register a patient
    res = client.post(
        "/auth/register",
        json={"email": "test_pat@test.com", "password": "password123", "full_name": "Test Patient", "role": "patient"}
    )
    assert res.status_code == 200
    pat_token = res.json()["access_token"]

    # 4. Get profile of the patient
    res = client.get("/auth/me", headers={"Authorization": f"Bearer {pat_token}"})
    assert res.status_code == 200
    pat_profile = res.json()
    assert pat_profile["email"] == "test_pat@test.com"
    assert pat_profile["role"] == "patient"


def test_case_creation_and_role_filtering():
    client = TestClient(app)

    # Register doctor and patient
    doc_token = client.post(
        "/auth/register",
        json={"email": "test_doc@test.com", "password": "password123", "full_name": "Test Doctor", "role": "doctor"}
    ).json()["access_token"]

    pat_token = client.post(
        "/auth/register",
        json={"email": "test_pat@test.com", "password": "password123", "full_name": "Test Patient", "role": "patient"}
    ).json()["access_token"]

    # 1. Create a case (as doctor)
    case_payload = {
        "patient_email": "test_pat@test.com",
        "symptoms": "fatigue, thirst",
        "labs": {"glucose": 150, "bmi": 28},
        "general_prediction": {
            "predictions": [{"disease": "Diabetes Mellitus", "probability": 0.85}],
            "diabetes_triggered": True,
            "trigger_reasons": ["High glucose"]
        },
        "diabetes_prediction": {
            "diagnosis": "Type 2 Diabetes",
            "risk_probability": 0.85,
            "severity": "Moderate",
            "model_used": "XGBoost",
            "medication": [{"medication": "Metformin", "dosage": "500mg daily", "warnings": [], "monitoring": []}],
            "diet": {"calories": 1800, "macro_breakdown": {"Carbs": "45%"}, "meals": [], "foods_to_avoid": []},
            "alternative_medicine": [{"name": "Cinnamon", "benefit": "blood sugar guidance", "evidence_score": 0.75, "source": "test", "research_summary": "test", "confidence_score": 0.75}],
            "lifestyle_changes": []
        }
    }

    res = client.post("/cases", json=case_payload, headers={"Authorization": f"Bearer {doc_token}"})
    assert res.status_code == 200

    # 2. Get cases list as Doctor (should return full data)
    res = client.get("/cases", headers={"Authorization": f"Bearer {doc_token}"})
    assert res.status_code == 200
    doc_cases = res.json()
    assert len(doc_cases) >= 1
    target_case = next(c for c in doc_cases if c["patient_email"] == "test_pat@test.com")
    assert target_case["general_prediction"] is not None
    assert target_case["diabetes_prediction"]["diagnosis"] == "Type 2 Diabetes"

    # 3. Get cases list as Patient (should mask data)
    res = client.get("/cases", headers={"Authorization": f"Bearer {pat_token}"})
    assert res.status_code == 200
    pat_cases = res.json()
    assert len(pat_cases) == 1
    pat_case = pat_cases[0]
    # Check masking: general_prediction is null, diabetes_prediction only has medication and diet
    assert pat_case["general_prediction"] is None
    assert "diagnosis" not in pat_case["diabetes_prediction"]
    assert "risk_probability" not in pat_case["diabetes_prediction"]
    assert "alternative_medicine" not in pat_case["diabetes_prediction"]
    assert pat_case["diabetes_prediction"]["medication"][0]["medication"] == "Metformin"
    assert pat_case["diabetes_prediction"]["diet"]["calories"] == 1800


def test_patient_cannot_view_others_cases():
    client = TestClient(app)

    doc_token = client.post(
        "/auth/register",
        json={"email": "test_doc@test.com", "password": "password123", "full_name": "Test Doctor", "role": "doctor"}
    ).json()["access_token"]

    pat_token = client.post(
        "/auth/register",
        json={"email": "test_pat@test.com", "password": "password123", "full_name": "Test Patient", "role": "patient"}
    ).json()["access_token"]

    # Doctor creates case for a different patient
    case_payload = {
        "patient_email": "someone_else@test.com",
        "symptoms": "headache",
        "labs": {},
        "general_prediction": {},
        "diabetes_prediction": None
    }
    client.post("/cases", json=case_payload, headers={"Authorization": f"Bearer {doc_token}"})

    # Patient retrieves their cases list (should be empty, since the case belongs to someone else)
    res = client.get("/cases", headers={"Authorization": f"Bearer {pat_token}"})
    assert res.status_code == 200
    assert len(res.json()) == 0
