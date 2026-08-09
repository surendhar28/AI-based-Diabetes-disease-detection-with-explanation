import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, f1_score, precision_score, recall_score, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

try:
    from xgboost import XGBClassifier
except ImportError:  # pragma: no cover
    XGBClassifier = None


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
MODEL_DIR = ROOT / "models"
FEATURES = [
    "Pregnancies",
    "Glucose",
    "BloodPressure",
    "SkinThickness",
    "Insulin",
    "BMI",
    "DiabetesPedigreeFunction",
    "Age",
]
ZERO_AS_MISSING = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]
KAGGLE_DATASET = "iammustafatz/diabetes-prediction-dataset"
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
KAGGLE_NUMERIC = ["age", "hypertension", "heart_disease", "bmi", "HbA1c_level", "blood_glucose_level"]
KAGGLE_CATEGORICAL = ["gender", "smoking_history"]


def clean_pima(df: pd.DataFrame) -> pd.DataFrame:
    cleaned = df.copy()
    for column in ZERO_AS_MISSING:
        cleaned[column] = cleaned[column].replace(0, np.nan)
        cleaned[column] = cleaned[column].fillna(cleaned[column].median())
    for column in FEATURES:
        q1, q3 = cleaned[column].quantile([0.25, 0.75])
        iqr = q3 - q1
        cleaned[column] = cleaned[column].clip(q1 - 1.5 * iqr, q3 + 1.5 * iqr)
    return cleaned


def download_kaggle_diabetes_dataset() -> tuple[pd.DataFrame, str]:
    import kagglehub

    dataset_path = Path(kagglehub.dataset_download(KAGGLE_DATASET))
    csv_files = sorted(dataset_path.glob("*.csv"))
    if not csv_files:
        raise FileNotFoundError(f"No CSV files found in Kaggle dataset path: {dataset_path}")
    csv_path = csv_files[0]
    df = pd.read_csv(csv_path)
    local_copy = DATA_DIR / "kaggle_diabetes_prediction_dataset.csv"
    df.to_csv(local_copy, index=False)
    return df, str(csv_path)


def clean_kaggle_diabetes(df: pd.DataFrame) -> pd.DataFrame:
    required = set(KAGGLE_FEATURES + ["diabetes"])
    missing = required.difference(df.columns)
    if missing:
        raise ValueError(f"Kaggle diabetes dataset missing required columns: {sorted(missing)}")

    cleaned = df[KAGGLE_FEATURES + ["diabetes"]].copy()
    cleaned["gender"] = cleaned["gender"].fillna("other").astype(str).str.lower().str.strip()
    cleaned["smoking_history"] = cleaned["smoking_history"].fillna("no info").astype(str).str.lower().str.strip()
    cleaned["hypertension"] = cleaned["hypertension"].astype(int)
    cleaned["heart_disease"] = cleaned["heart_disease"].astype(int)
    cleaned["diabetes"] = cleaned["diabetes"].astype(int)
    for column in ["age", "bmi", "HbA1c_level", "blood_glucose_level"]:
        cleaned[column] = pd.to_numeric(cleaned[column], errors="coerce")
        cleaned[column] = cleaned[column].fillna(cleaned[column].median())
        q1, q3 = cleaned[column].quantile([0.25, 0.75])
        iqr = q3 - q1
        cleaned[column] = cleaned[column].clip(q1 - 1.5 * iqr, q3 + 1.5 * iqr)
    return cleaned.drop_duplicates()


def load_diabetes_training_data() -> tuple[pd.DataFrame, list[str], str, str]:
    try:
        raw_df, source = download_kaggle_diabetes_dataset()
        df = clean_kaggle_diabetes(raw_df)
        return df, KAGGLE_FEATURES, "diabetes", f"KaggleHub:{KAGGLE_DATASET}:{source}"
    except Exception as exc:
        print(f"KaggleHub download unavailable; falling back to local Pima sample: {exc}")
        df = clean_pima(pd.read_csv(DATA_DIR / "pima_diabetes.csv"))
        return df, FEATURES, "Outcome", "local:pima_diabetes.csv"


def build_preprocessor(features: list[str]) -> ColumnTransformer | StandardScaler:
    if set(KAGGLE_FEATURES).issubset(features):
        return ColumnTransformer(
            [
                ("numeric", StandardScaler(), KAGGLE_NUMERIC),
                ("categorical", OneHotEncoder(handle_unknown="ignore", sparse_output=False), KAGGLE_CATEGORICAL),
            ]
        )
    return StandardScaler()


def train_diabetes() -> None:
    df, features, target, dataset_source = load_diabetes_training_data()
    x_train, x_test, y_train, y_test = train_test_split(
        df[features],
        df[target],
        test_size=0.25,
        random_state=161,
        stratify=df[target],
    )
    rf = Pipeline(
        [
            ("preprocess", build_preprocessor(features)),
            ("model", RandomForestClassifier(n_estimators=240, max_depth=7, random_state=42, class_weight="balanced")),
        ]
    )
    rf.fit(x_train, y_train)

    if XGBClassifier is not None:
        primary = XGBClassifier(
            n_estimators=80,
            max_depth=2,
            learning_rate=0.04,
            subsample=0.8,
            colsample_bytree=0.8,
            objective="binary:logistic",
            eval_metric="logloss",
            random_state=42,
        )
        model_name = "XGBoost"
    else:
        primary = RandomForestClassifier(n_estimators=300, max_depth=8, random_state=42, class_weight="balanced")
        model_name = "RandomForest fallback"
    wrapped = Pipeline([("preprocess", build_preprocessor(features)), ("model", primary)])
    wrapped.fit(x_train, y_train)
    y_pred = wrapped.predict(x_test)
    y_score = wrapped.predict_proba(x_test)[:, 1]
    metrics = {
        "model": model_name,
        "accuracy": round(float(accuracy_score(y_test, y_pred)), 4),
        "precision": round(float(precision_score(y_test, y_pred)), 4),
        "recall": round(float(recall_score(y_test, y_pred)), 4),
        "f1_score": round(float(f1_score(y_test, y_pred)), 4),
        "roc_auc": round(float(roc_auc_score(y_test, y_score)), 4),
        "confusion_matrix": confusion_matrix(y_test, y_pred).tolist(),
        "dataset_source": dataset_source,
        "feature_schema": features,
    }
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump({"model": wrapped, "model_name": model_name, "features": features, "metrics": metrics}, MODEL_DIR / "diabetes_xgb_pipeline.pkl")
    joblib.dump({"model": rf, "model_name": "RandomForest", "features": features}, MODEL_DIR / "diabetes_random_forest_pipeline.pkl")
    (MODEL_DIR / "diabetes_metrics.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")


def train_general() -> None:
    df = pd.read_csv(DATA_DIR / "general_symptom_disease.csv")
    pipeline = Pipeline(
        [
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), min_df=1)),
            ("model", LogisticRegression(max_iter=1200, class_weight="balanced", C=20)),
        ]
    )
    pipeline.fit(df["symptoms"], df["disease"])
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipeline, MODEL_DIR / "general_medicine_model.pkl")


if __name__ == "__main__":
    train_general()
    train_diabetes()
    print("Saved model artifacts to", MODEL_DIR)
