# End-to-End Technical Explanation & Architecture

This document provides a rigorous, end-to-end technical overview of the Agentic AI Healthcare Platform. It covers the system architecture, machine learning pipelines, clinical decision support rules, database optimizations, role-based access control, and startup/testing procedures.

---

## 1. System & Integration Architecture

The application implements a decoupled client-server architecture with a stateless API layer and server-side state cache, backed by an optimized relational SQLite database.

```mermaid
graph TD
    classDef client fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff;
    classDef api fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff;
    classDef agent fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff;
    classDef db fill:#8b5cf6,stroke:#6d28d9,stroke-width:2px,color:#fff;
    classDef ext fill:#ec4899,stroke:#be185d,stroke-width:2px,color:#fff;

    subgraph Client ["Client Layer (React + Vite)"]
        UI[SPA Dashboard UI]:::client
        AxiosClient[Axios API Client]:::client
    end

    subgraph API ["API & Routing Layer (FastAPI + Uvicorn)"]
        Router[APIRouter & Endpoints]:::api
        AuthCheck[Dependency: get_current_user]:::api
        Sessions[Server-Side Session Cache: _sessions]:::api
    end

    subgraph Agentic ["Agentic CDSS Layer"]
        GenAgent[General Medicine Agent]:::agent
        DiabAgent[Diabetes Specialist CDSS Agent]:::agent
        
        subgraph CDSS ["Specialist Sub-Engines"]
            DiagEng[Diagnosis Engine]:::agent
            MedEng[Medication Recommendation Engine]:::agent
            DietEng[Diet Recommendation Engine]:::agent
            AltEng[Alternative Medicine Engine]:::agent
            ExpEng[LLM Explanation Engine]:::agent
        end
    end

    subgraph DB_Layer ["Database Layer (SQLite)"]
        SQLiteDB[(SQLite DB & WAL Mode)]:::db
        UsersTbl[(users table)]:::db
        CasesTbl[(patient_cases table)]:::db
        EventsTbl[(prediction_events table)]:::db
        MedTbl[(medicines table)]:::db
    end

    subgraph External ["External Services"]
        Groq[Groq Llama-3.3 Cloud Service]:::ext
    end

    UI --> AxiosClient
    AxiosClient -->|HTTP REST + Bearer Token| Router
    Router --> AuthCheck
    AuthCheck --> Sessions
    AuthCheck -->|Lookup Role| UsersTbl
    
    Router --> GenAgent
    GenAgent -->|Trigger Condition Met| DiabAgent
    
    DiabAgent --> DiagEng
    DiabAgent --> MedEng
    DiabAgent --> DietEng
    DiabAgent --> AltEng
    DiabAgent --> ExpEng
    
    ExpEng -->|HTTPS API Requests / timeout=5s| Groq
    
    Router -->|Write Case / Audit Log| SQLiteDB
    DiagEng -->|Load PKL Pipelines| Registry[Model Registry]
    MedEng -->|Fetch AZ Brand Database| MedTbl
    
    SQLiteDB -.-> UsersTbl
    SQLiteDB -.-> CasesTbl
    SQLiteDB -.-> EventsTbl
    SQLiteDB -.-> MedTbl
```

### Components Details

*   **Client Layer**: Built as a Single Page Application (SPA) using React and Vite, running by default on `http://localhost:5173`. It initiates asynchronous REST API requests over HTTP using `axios`. It contains dedicated dashboard panels for Doctors (intake form, full reports) and Patients (care recommendations view).
*   **API & Routing Layer**: Powered by FastAPI and executed using the Uvicorn ASGI server. It manages cross-origin resource sharing (CORS), applies Pydantic request-body structural validation, and evaluates role-based auth permissions using FastAPI's dependency injection (`Depends(get_current_user)`).
*   **Session Management**: Authentication tokens are generated using `secrets.token_urlsafe(32)` on login and mapped in a transient server-side dictionary memory cache (`_sessions`). This structure avoids JWT storage while remaining highly secure against token modification attacks.
*   **Database Engine**: Uses SQLite operating with **Write-Ahead Logging (WAL)** enabled (`PRAGMA journal_mode=WAL`). WAL allows multiple concurrent readers to query database records while a writer modifies tables, avoiding database locks on multi-threaded environments. Foreign key constraints are enforced (`PRAGMA foreign_keys=ON`).
*   **External LLM Integration**: The LLM Explanation Engine connects to the Groq API utilizing an asynchronous-compatible HTTP Client (`httpx.Client`) pointing to `llama-3.3-70b-versatile`. It uses a strict `5.0` second execution timeout to prevent network failures or long API waits from blocking client threads, falling back automatically to local rules-based templates.

---

## 2. Machine Learning Training & Inference Pipelines

The platform maintains two ML models: a general medicine text classification model and a specialist diabetes risk assessment model.

```mermaid
flowchart TD
    classDef process fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px;
    classDef step fill:#dbeafe,stroke:#3b82f6,stroke-width:2px;
    classDef storage fill:#e0f2fe,stroke:#0284c7,stroke-width:2px;

    subgraph DataPrep ["Data Preparation (Clean & Transform)"]
        DataSource[Kaggle Dataset / Pima Fallback]:::storage
        DropDup[Drop Duplicates]:::step
        Impute[Median Imputation for Nulls]:::step
        Clip[Outlier Clipping via IQR Bounds]:::step
    end

    subgraph PrepPipe ["Pre-processing Pipelines"]
        ColTrans[ColumnTransformer]:::step
        NumScale[StandardScaler for Vitals/Labs]:::step
        CatEnc[OneHotEncoder for Categoricals]:::step
    end

    subgraph TrainSplit ["Model Development"]
        Split[Train-Test Split: 75/25 Stratified]:::step
        XGB[XGBClassifier Training]:::step
        RF[RandomForest Parallel Training]:::step
        Eval[Evaluate Metrics: Accuracy, AUC, F1]:::step
    end

    subgraph Persistence ["Model Serialized Artifacts"]
        MetricsFile[diabetes_metrics.json]:::storage
        XGBFile[diabetes_xgb_pipeline.pkl]:::storage
        RFFile[diabetes_random_forest_pipeline.pkl]:::storage
    end

    subgraph Inference ["Real-time Inference (FastAPI)"]
        Payload[Incoming Request Payload]:::step
        Registry[Model Registry Service]:::step
        Predict[Pipeline predict_proba]:::step
        Classify[Classification Rule Matrix]:::step
    end

    DataSource --> DropDup --> Impute --> Clip
    Clip --> ColTrans
    ColTrans --> NumScale
    ColTrans --> CatEnc
    
    NumScale --> Split
    CatEnc --> Split
    
    Split --> XGB & RF
    XGB --> Eval
    RF --> XGBFile
    Eval --> MetricsFile & XGBFile & RFFile
    
    XGBFile -.-> Registry
    Registry --> Predict
    Payload --> Predict
    Predict --> Classify
```

### 2.1 General Medicine Classifier
*   **Purpose**: Processes patient symptom descriptions to predict top-3 clinical candidate diagnoses.
*   **Data Source**: `general_symptom_disease.csv` mapping text symptoms to target conditions.
*   **Algorithm**: Logistic Regression Classifier.
*   **Text Preprocessing**: `TfidfVectorizer` mapping word tokens to TF-IDF weights:
    *   `ngram_range=(1, 2)` to capture dual-word contexts (e.g., "muscle aches").
    *   `min_df=1` to retain sparse or rare symptoms.
*   **Hyperparameters**: `C=20` (inversion of regularization strength to prevent underfitting), `class_weight="balanced"` (adjusts weights inversely proportional to class frequencies to handle imbalanced symptom classifications), and `max_iter=1200`.

### 2.2 Diabetes Risk Specialist Model
*   **Primary Data Source**: Kaggle Dataset (`iammustafatz/diabetes-prediction-dataset`).
    *   *Features*: `gender`, `age`, `hypertension`, `heart_disease`, `smoking_history`, `bmi`, `HbA1c_level`, `blood_glucose_level`.
*   **Fallback Data Source**: Pima Indian Diabetes Dataset (`pima_diabetes.csv`).
    *   *Features*: `Pregnancies`, `Glucose`, `BloodPressure`, `SkinThickness`, `Insulin`, `BMI`, `DiabetesPedigreeFunction`, `Age`.
*   **Pre-processing Pipeline**:
    1.  **Imputation**: Replaces clinical invalid placeholder zeroes (e.g., zero values in Blood Pressure or BMI) with feature medians.
    2.  **Outlier Mitigation**: Features are clipped within Interquartile Range (IQR) boundaries:
        $$\text{Lower Bound} = Q1 - 1.5 \times IQR$$
        $$\text{Upper Bound} = Q3 + 1.5 \times IQR$$
    3.  **Standardization**: Numeric features scaled to zero mean and unit variance via `StandardScaler`.
    4.  **One-Hot Encoding**: Encodes categorical variables (`gender`, `smoking_history`) via `OneHotEncoder(handle_unknown="ignore")`.
    5.  **Assembly**: Columns are encapsulated into a cohesive `ColumnTransformer` execution unit.
*   **Classifier Algorithm**: Extreme Gradient Boosting Classifier (`XGBClassifier`) with hyperparameters:
    *   `n_estimators=80` (number of boosting rounds).
    *   `max_depth=2` (maximum tree depth to limit high variance overfitting).
    *   `learning_rate=0.04` (shrinkage step size to prevent gradient descent overshoot).
    *   `subsample=0.8` (fraction of samples random-selected for tree building).
    *   `colsample_bytree=0.8` (subsample ratio of features selected per tree).
    *   `objective="binary:logistic"` (binary logistic regression loss function).
*   **Model Serialization**: Saved via `joblib` inside `diabetes_xgb_pipeline.pkl`. Model metrics (Accuracy, F1, Recall, Precision, ROC-AUC score, and Confusion Matrix) are written to `diabetes_metrics.json`.

### 2.3 Evaluation Results & Graphs

#### Confusion Matrix Plot
![Confusion Matrix Plot](docs/images/confusion_matrix.png)

#### Receiver Operating Characteristic (ROC) Curve
![ROC Curve Plot](docs/images/roc_curve.png)

#### Feature Importance Breakdown
![Feature Importance Plot](docs/images/feature_importance.png)

### 2.4 User Interface Presentations

#### Doctor Workspace & Clinical Intake
![Doctor Workspace View](docs/images/doctor_dashboard_ui.png)

#### Patient Care Portal
![Patient Care View](docs/images/patient_care_ui.png)

---


## 3. Clinical Decision Support System (CDSS) Trigger & Diagnosis Flow

The agent utilizes a trigger-based activation gate to determine if a comprehensive diabetes risk assessment is required, subsequently routing through clinical classification logic.

```mermaid
graph TD
    classDef init fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px;
    classDef decision fill:#fef3c7,stroke:#d97706,stroke-width:2px;
    classDef outcome fill:#dcfce7,stroke:#15803d,stroke-width:2px;

    Start([Patient Vital & Symptom Intake]):::init
    GenClassifier[Run General Symptom Classifier]:::init
    
    CheckGlucose{Is Glucose >= 126 mg/dL?}:::decision
    CheckProb{Is General Prediction Diabetes Prob >= 60%?}:::decision
    
    Start --> GenClassifier
    GenClassifier --> CheckGlucose
    CheckGlucose -->|No| CheckProb
    
    CheckGlucose -->|Yes: Trigger Agent| RunCDSS[Execute Diabetes Specialist CDSS Agent]:::init
    CheckProb -->|Yes: Trigger Agent| RunCDSS
    CheckProb -->|No: Do Not Trigger| SaveGeneral[Save Case with General Diagnosis Only]:::outcome
    
    RunCDSS --> EvaluateRisk[XGBoost Predicts Diabetes Risk Probability]:::init
    
    CheckLowRisk{Is Risk < 35% AND Glucose < 100?}:::decision
    CheckPre{Is Glucose 100-125 OR Risk 35%-60%?}:::decision
    CheckType1{Is Age < 30 AND BMI < 25 AND Insulin <= 20?}:::decision
    
    EvaluateRisk --> CheckLowRisk
    
    CheckLowRisk -->|Yes| LowRiskOut[Low Diabetes Risk / severity: low]:::outcome
    CheckLowRisk -->|No| CheckPre
    
    CheckPre -->|Yes| PrediabetesOut[Prediabetes / severity: moderate]:::outcome
    CheckPre -->|No| CheckType1
    
    CheckType1 -->|Yes| Type1Out[Type 1 Diabetes / severity: high]:::outcome
    CheckType1 -->|No| Type2Check{Is Glucose >= 250 OR Risk >= 85%?}:::decision
    
    Type2Check -->|Yes| Type2Severe[Type 2 Diabetes / severity: severe]:::outcome
    Type2Check -->|No| Type2High[Type 2 Diabetes / severity: high]:::outcome
```

### 3.1 Gated Trigger Conditions
The system screens for diabetes triggers during the intake form check. The specialist agent is activated if **either** of these thresholds are crossed:
1.  **Direct Glycemic Trigger**: `labs.glucose >= 126` mg/dL (configured via `settings.diabetes_glucose_trigger`).
2.  **Symptom-Probability Trigger**: The General Medicine Classifier returns a prediction probability of `"Diabetes Mellitus" >= 0.60` (configured via `settings.diabetes_probability_trigger`).

### 3.2 Clinical Decision Support Classification Rules
Once triggered, the Specialist CDSS agent calculates classification categories and severity levels:
*   **Low Diabetes Risk**: Risk probability $< 0.35$ AND glucose $< 100$ mg/dL.
*   **Prediabetes**: Glucose is between $100$ mg/dL and $125$ mg/dL, OR Risk probability is between $0.35$ and $0.60$.
*   **Type 1 Diabetes**: Patient's age $< 30$ AND BMI $< 25$ AND Insulin reading $\le 20$ uU/mL.
*   **Type 2 Diabetes**: Classified if the patient does not fit the above and demonstrates elevated glucose and risk scores.
*   **Severity Gating**:
    *   `severe`: Calculated if glucose $\ge 250$ mg/dL OR Risk probability $\ge 0.85$.
    *   `high`: Default for Type 1 and Type 2 classifications.
    *   `moderate`: Default for Prediabetes classification.
    *   `low`: Default for Low Diabetes Risk classification.

---

## 4. Authentication & RBAC Lifecycle Sequence

Role-Based Access Control (RBAC) enforces distinct read/write paths for Doctors and Patients. The backend filters prediction details dynamically based on user identity.

```mermaid
sequenceDiagram
    autonumber
    actor Doc as Doctor (User)
    actor Pat as Patient (User)
    participant FE as React Frontend
    participant Route as FastAPI Routes
    participant Auth as Auth Service
    participant Agent as CDSS Agent
    participant DB as SQLite DB

    %% Doctor Intake Sequence
    Note over Doc, FE: Doctor intake & Case Creation Flow
    Doc->>FE: Fill symptoms & lab inputs, enter patient email
    FE->>Route: POST /predict/general (symptoms, labs) with Token Header
    Route->>Auth: get_current_user (Verify Token)
    Auth->>DB: Query User Role
    DB-->>Auth: Role: doctor
    Auth-->>Route: UserContext (doctor)
    Route->>Agent: GeneralMedicineAgent.predict()
    Agent-->>Route: GeneralPredictionResponse (symptoms list, diabetes_triggered)
    Note over Route: If triggered: Client requests specialist prediction
    FE->>Route: POST /predict/diabetes (vitals, glucose) with Token Header
    Route->>Agent: DiabetesCDSSAgent.assess()
    Agent->>DB: Query Brand Medicines matching generic recommendations
    DB-->>Agent: Returns Indian brand names, prices, composition
    Agent-->>Route: DiabetesPredictionResponse (full risk, severity, recommendations, GenAI explanation)
    Route-->>FE: Return JSON payloads
    FE-->>Doc: Display diagnosis charts, severity warnings, alternative medicine, GenAI proofs
    
    Doc->>FE: Click Save Case
    FE->>Route: POST /cases (patient_email, symptoms, labs, predictions JSON)
    Route->>DB: INSERT INTO patient_cases
    DB-->>Route: Success
    Route-->>FE: HTTP 200 OK
    FE-->>Doc: Report Saved Confirmation

    %% Patient Access Sequence
    Note over Pat, FE: Patient Case Access & Masking Flow
    Pat->>FE: Login & navigate to "My Recommendations"
    FE->>Route: GET /cases with Token Header
    Route->>Auth: get_current_user (Verify Token)
    Auth->>DB: Query User Role
    DB-->>Auth: Role: patient
    Auth-->>Route: UserContext (patient)
    Route->>DB: SELECT * FROM patient_cases WHERE patient_email = user_email
    DB-->>Route: Returns raw cases rows (full JSON arrays)
    
    Note over Route: Apply Data Masking Rules:<br/>1. general_prediction = null<br/>2. diabetes_prediction.diagnosis = removed<br/>3. diabetes_prediction.risk_probability = removed<br/>4. diabetes_prediction.alternative_medicine = removed<br/>5. Only keep 'medication' and 'diet' recommendations
    
    Route-->>FE: Return masked cases list
    FE-->>Pat: Render Patient Dashboard (Vitals history, medication cards, meals schedule)
```

### Data Masking & Security Logic
*   **Doctor Privileges**: Full access to all database fields. Doctors view diagnostic charts, probability curves, raw classifier predictions, alternative herbal remedies, and LLM clinical proofs.
*   **Patient Protections**: Patients are barred from viewing clinical raw assessments to prevent self-diagnosing panic.
    *   `general_prediction` is set to `null` on response serialization.
    *   Within the `diabetes_prediction` JSON block, the backend removes keys: `diagnosis`, `risk_probability`, `severity`, `model_used`, `model_metrics`, and `alternative_medicine`.
    *   Only `medication` details (prescribed drug, dosage, warnings) and `diet` plans are returned.

---

## 5. Database Schema Design & Optimization

SQLite serves as the relational datastore. The schemas are modeled below:

### 5.1 Entity Relationship Diagram (ERD)
```mermaid
erDiagram
    USERS {
        int id PK
        string email UK "Unique email identifier"
        string full_name "Full name of the user"
        string password_hash "PBKDF2-HMAC-SHA256 hash"
        string role "doctor | patient"
        string created_at "ISO UTC Timestamp"
    }
    PATIENT_CASES {
        int id PK
        string patient_email FK "References USERS.email"
        string doctor_email "Email of doctor executing intake"
        string symptoms "Raw intake symptoms narrative"
        string labs "JSON payload of vital lab inputs"
        string general_prediction "JSON payload of general diagnosis predictions"
        string diabetes_prediction "JSON payload of diabetes specialist findings"
        string created_at "ISO UTC Timestamp"
    }
    PREDICTION_EVENTS {
        int id PK
        string user_email "Audited user email"
        string event_type "Audit category"
        string payload "JSON dump of the event context"
        string created_at "ISO UTC Timestamp"
    }
    MEDICINES {
        int id PK
        string name "Brand name"
        real price "Unit price in ₹"
        int is_discontinued "Discontinuation binary flag"
        string manufacturer_name
        string type "Medicine formulation type"
        string pack_size_label
        string short_composition1
        string short_composition2
    }
    USERS ||--o{ PATIENT_CASES : "has history of"
```

### 5.2 Hashing & Security Policies
User password protection implements a high-iteration hash routine to block offline brute-force attacks:
*   **Algorithm**: PBKDF2-HMAC-SHA256.
*   **Salt Source**: Cryptographically secure pseudo-random bytes generated using `secrets.token_hex(16)`.
*   **Complexity**: $120,000$ iterations.
*   **Format**: `salt$hash` stored in the database.

### 5.3 Database Index Optimization
Three key database indices are implemented to ensure O(log N) lookup times during scaling:
1.  `idx_patient_cases_email` on `patient_cases(patient_email)`:
    *   *Purpose*: Speeds up dashboard retrieval times when querying patient medical histories.
    *   *Benefit*: Avoids full table scans (O(N)) during patient queries, translating into sub-millisecond retrieval speeds as patient histories expand.
2.  `idx_medicines_comp1` on `medicines(short_composition1)`:
    *   *Purpose*: Indexes the main chemical ingredient (composition) of commercial medicines.
    *   *Benefit*: Accelerates search lookups when matching generic recommended medicines (e.g., Metformin) against commercial brand names.
3.  `idx_medicines_comp2` on `medicines(short_composition2)`:
    *   *Purpose*: Indexes co-formulated active ingredients.
    *   *Benefit*: Accelerates query performance when searching for combination therapy brands (e.g., Metformin + Sitagliptin).

---

## 6. Troubleshooting & Developer Notes

### Issue A: WatchFiles Reload Storm
*   **Symptom**: Uvicorn endlessly reloaded during startup.
*   **Root Cause**: In Windows environments with OneDrive cloud-sync enabled, OneDrive continually updates folder access attributes within `.venv` upon package imports. Uvicorn's default file watcher flags these metadata adjustments as file changes, initiating infinite reloads.
*   **Solution**: `backend/main.py` dynamically checks for the presence of `.venv` and adds its absolute path directly to Uvicorn's `reload_excludes` list.

### Issue B: PowerShell Script Execution Policies
*   **Symptom**: Virtualenv scripts like `Activate.ps1` fail to execute.
*   **Solution**: Execute python commands directly from the environment using `.\.venv\Scripts\python.exe main.py` rather than activating the shell script, bypassing system policies.

### Issue C: Duplicate Database Initialization & Deprecation Warnings
*   **Symptom**: Duplicate database operations and deprecated calls during startup.
*   **Solution**: Bound database initialization routines to FastAPI's lifespan `asynccontextmanager` in `backend/main.py`, guaranteeing execution exactly once during worker thread launch.

---

## 7. Startup & Verification Guide

### 7.1 Running the Applications

1.  **Launch Backend Services**:
    ```powershell
    cd backend
    .\.venv\Scripts\python.exe main.py
    ```
2.  **Launch Frontend Services**:
    ```powershell
    cd frontend
    npm.cmd run dev
    ```
    Access the application dashboard at `http://localhost:5173`.

### 7.2 Verifying via Automated Test Suites
Run the pytest test suite in the backend folder to verify registration, logins, roles, and patient data masking:
```powershell
.\.venv\Scripts\python.exe -m pytest tests/
```
All tests should pass, confirming that RBAC is functioning correctly and data masking is successfully applied to patient roles.
