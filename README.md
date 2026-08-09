# Agentic AI Healthcare Platform

Production-oriented full-stack General Medicine platform with a trigger-based Diabetes Clinical Decision Support System (CDSS) agent. It combines a general symptom classifier, an XGBoost diabetes risk model, rule-based medication guidance, JSON diet knowledge bases, and evidence-scored alternative medicine recommendations.

> Clinical safety: this project is decision support for education/prototyping. It is not a substitute for licensed medical diagnosis or prescribing.

## Architecture

```text
backend/
  api/                  FastAPI routes
  agents/
    general_agent/      Symptom-based disease prediction agent
    diabetes_agent/     Diagnosis, medication, diet, alternative medicine engines
  models/               Training pipeline and persisted .pkl artifacts
  services/             SQLite, auth, audit logging, model registry
  data/                 CSV datasets and JSON knowledge bases
  utils/                Settings
frontend/
  src/components/       Reusable UI components
  src/pages/            Dashboard, form, results, detailed report
  src/services/         API client
```

## Troubleshooting & Quick Start (Windows PowerShell)

> [!IMPORTANT]
> **PowerShell Execution Policy Warning:** If you get a security error saying scripts are disabled on your system (affecting virtualenv activation or `npm`), run the bypass command below in your active terminal:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
> ```

---

## Backend Setup

*(Note: Steps 1 to 4 are only required for the first-time setup. If your `.venv` is already created, packages installed, and models trained, skip directly to Step 5.)*

1. Open a PowerShell terminal and navigate to the backend folder:
   ```powershell
   cd backend
   ```
2. Create and activate the virtual environment (one-time setup):
   ```powershell
   python -m venv .venv
   # If script execution is disabled, run the bypass command above, OR run the activation script:
   .\.venv\Scripts\Activate.ps1
   ```
3. Install dependencies (one-time setup):
   ```powershell
   pip install -r requirements.txt
   ```
4. Train the models (one-time setup - pre-trained models already exist in the repo):
   ```powershell
   python models/train_models.py
   ```
5. Run the FastAPI development server:
   ```powershell
   # Direct execution (bypasses activation policy, ignores .venv, SQLite, and cache reloads):
   .\.venv\Scripts\python.exe main.py
   ```
   > [!NOTE]
   > **Startup Delay Notice:** Since this project loads heavy machine learning libraries (numpy, pandas, scipy, scikit-learn, xgboost) from a OneDrive/Windows-sync environment, the initial startup will print a loading message and take about **45–60 seconds** to complete. Please wait until you see the Uvicorn listening confirmation.

API docs: `http://localhost:8000/docs`

SQLite defaults to your OS temp directory to avoid OneDrive/cloud-sync locking issues. To pin it to a project or deployment path:
```powershell
$env:HEALTHCARE_SQLITE_PATH="C:\path\to\agentic_healthcare.sqlite3"
```

---

## Frontend Setup

*(Note: Step 2 is only required for the first-time setup. If packages are already installed, skip directly to Step 3.)*

1. Open a second PowerShell terminal and navigate to the frontend folder:
   ```powershell
   cd frontend
   ```
2. Install npm dependencies (one-time setup):
   ```powershell
   # If npm.ps1 fails due to execution policy, use npm.cmd:
   npm.cmd install
   ```
3. Run the React development server:
   ```powershell
   # If npm.ps1 fails due to execution policy, use npm.cmd:
   npm.cmd run dev
   ```

App: `http://localhost:5173`


## API

- `POST /auth/register`
- `POST /auth/login`
- `POST /predict/general`
- `POST /predict/diabetes`
- `GET /recommend/medication`
- `GET /recommend/diet`
- `GET /recommend/alternative`

## ML Pipeline

`backend/models/train_models.py`:

1. Downloads `iammustafatz/diabetes-prediction-dataset` with KaggleHub
2. Saves a local copy to `backend/data/kaggle_diabetes_prediction_dataset.csv`
3. Cleans categorical and numeric features
4. Scales numeric features and one-hot encodes categorical features
5. Trains Random Forest and primary XGBoost model
6. Saves `.pkl` artifacts with `joblib`
7. Exports evaluation metrics and confusion matrix JSON

If KaggleHub is unavailable, the trainer falls back to the compact local Pima CSV so the project remains runnable offline:

1. Loads `backend/data/pima_diabetes.csv`
2. Replaces clinical zero placeholders with medians
3. Clips outliers with IQR bounds
4. Scales features with `StandardScaler`
5. Trains the same model family

## Notes

- The primary diabetes artifact is trained from the KaggleHub diabetes prediction dataset requested for prediction. The included Pima CSV is a compact fallback/reference dataset.
- Medication and alternative medicine engines intentionally include warnings and monitoring prompts.
- SQLite stores users and prediction audit events.
