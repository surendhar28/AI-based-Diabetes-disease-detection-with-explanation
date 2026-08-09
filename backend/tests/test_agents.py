from agents.diabetes_agent.agent import DiabetesCDSSAgent
from agents.general_agent.agent import GeneralMedicineAgent
from models.schemas import DiabetesPredictionRequest, GeneralPredictionRequest, LabInputs


def test_general_agent_triggers_diabetes_for_high_glucose():
    response = GeneralMedicineAgent().predict(
        GeneralPredictionRequest(
            symptoms="fatigue excessive thirst frequent urination",
            age=52,
            gender="male",
            labs=LabInputs(glucose=190, bmi=31),
        )
    )
    assert response.diabetes_triggered is True
    assert len(response.predictions) == 3


def test_diabetes_agent_returns_complete_report():
    response = DiabetesCDSSAgent().assess(
        DiabetesPredictionRequest(
            pregnancies=2,
            glucose=184,
            blood_pressure=82,
            skin_thickness=32,
            insulin=160,
            bmi=33.4,
            diabetes_pedigree_function=0.62,
            age=49,
            gender="female",
            food_preference="veg",
        )
    )
    assert response.risk_probability >= 0
    assert response.medication
    # Verify that Indian brand recommendations are returned
    metformin_recommendation = next(
        (m for m in response.medication if "metformin" in m.medication.lower()), None
    )
    if metformin_recommendation:
        assert len(metformin_recommendation.brands) > 0
        brand = metformin_recommendation.brands[0]
        assert brand.name
        assert brand.price >= 0.0
        assert brand.manufacturer
        assert brand.pack_size
        assert "Metformin" in brand.composition
    assert response.diet.meals
    assert response.alternative_medicine
