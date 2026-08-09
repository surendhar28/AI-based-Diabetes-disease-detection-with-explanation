# 🩺 AI-Based Diabetes Disease Detection with Clinical Explanation & CDSS

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5.3.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![XGBoost](https://img.shields.io/badge/XGBoost-2.0.3-FF6600?style=for-the-badge&logo=xgboost&logoColor=white)](https://xgboost.readthedocs.io)
[![Scikit--Learn](https://img.shields.io/badge/scikit_learn-1.5.0-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![SQLite](https://img.shields.io/badge/SQLite-WAL_Mode-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org)
[![Groq LLaMA-3.3](https://img.shields.io/badge/LLM-Groq_Llama_3.3_70B-F55036?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

An intelligent, full-stack **Clinical Decision Support System (CDSS)** and **Agentic Healthcare Platform** designed for early diabetes detection, symptom-based general medical diagnosis, personalized dietary planning, commercial medication lookup, and evidence-grounded clinical explanations.

> ⚠️ **Clinical Safety Disclaimer:** This platform is designed as an educational prototype and clinical decision support tool for healthcare professionals and researchers. It does not replace certified clinical judgment, medical diagnosis, or prescription from a licensed healthcare provider.

---

## 📸 User Interface & Application Showcase

The application provides specialized, role-tailored dashboards for **Doctors** (full clinical diagnostics, ML risk probability, feature analysis, GenAI explanation, alternative medicine) and **Patients** (secure, privacy-masked health summaries, medication schedules, and dietary guidance).

| 🩺 Doctor Clinical Decision Support Dashboard | 🥗 Patient Health & Care Management Portal |
| :---: | :---: |
| ![Doctor Dashboard UI](docs/images/doctor_dashboard_ui.png) | ![Patient Care Portal UI](docs/images/patient_care_ui.png) |
| *Intake form, XGBoost risk gauge, symptom matches, Indian brand medicines & GenAI clinical reasoning* | *Masked diagnosis, daily glycemic logs, diet planner, and dosage schedules* |

---

## 🌟 Key Features

- **Multi-Agent CDSS Architecture:** Dual-tier autonomous diagnostic pipeline featuring a **General Medicine Classifier** and an automated **Specialist Diabetes CDSS Agent**.
- **Automated Gating & Triggers:** Dynamically escalates cases to the specialist agent when blood glucose is $\ge 126\text{ mg/dL}$ or symptom probability is $\ge 60\%$.
- **High-Accuracy ML Pipelines:** Extreme Gradient Boosting (`XGBoost`) model achieving **97.1% accuracy** and **0.9732 ROC-AUC** on clinical diabetes datasets, backed by Random Forest and Logistic Regression classifiers.
- **Explainable GenAI Integration:** Integrated with **Groq LLaMA-3.3 70B** to generate patient-specific summaries and verified clinical guidelines (ADA, CDC, WHO) with a sub-5s timeout and local rule fallback.
- **Commercial Medicine & Diet Knowledge Base:** Integrated database of 200,000+ Indian pharmaceutical brands, composition lookup, generic alternatives, dosage warnings, and glycemic-index meal plans.
- **Role-Based Access Control (RBAC) & Data Masking:** Strict separation of Doctor and Patient privileges with PBKDF2-HMAC-SHA256 hashing and dynamic privacy filters to protect patients from raw diagnostic distress.
- **High-Performance SQLite with WAL Mode:** Concurrent reads and writes using Write-Ahead Logging (`PRAGMA journal_mode=WAL`) and indexed lookups.

---

## 🏗️ System & Integration Architecture

The platform follows a decoupled, stateless REST API architecture powered by **FastAPI** on the backend and **React + Vite** on the frontend.

```mermaid
graph TD
    classDef client fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff;
    classDef api fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff;
    classDef agent fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff;
    classDef db fill:#8b5cf6,stroke:#6d28d9,stroke-width:2px,color:#fff;
    classDef ext fill:#ec4899,stroke:#be185d,stroke-width:2px,color:#fff;

    subgraph Client ["Frontend Layer (React 18 + Vite)"]
        UI[Single Page Application UI]:::client
        AxiosClient[Axios REST Client + Auth Interceptor]:::client
    end

    subgraph API ["API & Routing Layer (FastAPI)"]
        Router[API Router & Endpoints]:::api
        AuthCheck[RBAC Dependency: get_current_user]:::api
        Sessions[Server-Side Memory Session Cache]:::api
    end

    subgraph Agentic ["Agentic CDSS Layer"]
        GenAgent[General Medicine Symptom Agent]:::agent
        DiabAgent[Diabetes Specialist CDSS Agent]:::agent
        
        subgraph CDSS ["Specialist Sub-Engines"]
            DiagEng[Diagnosis & Severity Engine]:::agent
            MedEng[Medication Recommendation Engine]:::agent
            DietEng[Dietary Planning Engine]:::agent
            AltEng[Evidence Alternative Medicine Engine]:::agent
            ExpEng[LLM Explanation Engine]:::agent
        end
    end

    subgraph DB_Layer ["Database Layer (SQLite in WAL Mode)"]
        SQLiteDB[(SQLite Database)]:::db
        UsersTbl[(users table)]:::db
        CasesTbl[(patient_cases table)]:::db
        EventsTbl[(prediction_events audit)]:::db
        MedTbl[(medicines brand database)]:::db
    end

    subgraph External ["External AI Services"]
        Groq[Groq Cloud: LLaMA-3.3-70B-Versatile]:::ext
    end

    UI --> AxiosClient
    AxiosClient -->|HTTP REST + Bearer Token| Router
    Router --> AuthCheck
    AuthCheck --> Sessions
    AuthCheck -->|Verify Identity & Role| UsersTbl
    
    Router --> GenAgent
    GenAgent -->|Trigger Condition Met: Glucose >= 126 or Prob >= 60%| DiabAgent
    
    DiabAgent --> DiagEng
    DiabAgent --> MedEng
    DiabAgent --> DietEng
    DiabAgent --> AltEng
    DiabAgent --> ExpEng
    
    ExpEng -->|HTTPS API Request / 5s Timeout| Groq
    
    Router -->|Persist Case & Audit Trail| SQLiteDB
    DiagEng -->|Load Pre-trained Pipelines| Registry[Model Registry Service]
    MedEng -->|Search Indian Brand Database| MedTbl
    
    SQLiteDB -.-> UsersTbl
    SQLiteDB -.-> CasesTbl
    SQLiteDB -.-> EventsTbl
    SQLiteDB -.-> MedTbl
```

---

## 🤖 Machine Learning & Data Pipeline

```mermaid
flowchart TD
    classDef process fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px;
    classDef step fill:#dbeafe,stroke:#3b82f6,stroke-width:2px;
    classDef storage fill:#e0f2fe,stroke:#0284c7,stroke-width:2px;

    subgraph DataPrep ["1. Data Ingestion & Cleansing"]
        RawData[KaggleHub 100k Dataset / Pima Fallback]:::storage
        DropDup[Deduplication & Hygiene]:::step
        Impute[Clinical Median Imputation]:::step
        Clip[IQR Outlier Truncation Bounds]:::step
    end

    subgraph PrepPipe ["2. Column Transformation"]
        ColTrans[ColumnTransformer Pipeline]:::step
        NumScale[StandardScaler: Vitals & Lab Measurements]:::step
        CatEnc[OneHotEncoder: Gender & Smoking History]:::step
    end

    subgraph TrainSplit ["3. Training & Cross-Validation"]
        Split[Stratified 75/25 Train-Test Split]:::step
        XGB[XGBoost Classifier Training]:::step
        RF[Random Forest Parallel Training]:::step
        Eval[Model Evaluation & ROC Analysis]:::step
    end

    subgraph Persistence ["4. Model Serialization"]
        MetricsFile[diabetes_metrics.json]:::storage
        XGBFile[diabetes_xgb_pipeline.pkl]:::storage
        RFFile[diabetes_random_forest_pipeline.pkl]:::storage
    end

    subgraph Inference ["5. Real-Time Inference"]
        Req[Clinical Patient Input Payload]:::step
        Predict[pipeline.predict_proba]:::step
        Severity[Rule Matrix & Severity Stratification]:::step
    end

    RawData --> DropDup --> Impute --> Clip
    Clip --> ColTrans
    ColTrans --> NumScale & CatEnc
    NumScale & CatEnc --> Split
    Split --> XGB & RF
    XGB --> Eval
    Eval --> MetricsFile & XGBFile & RFFile
    
    XGBFile -.-> Predict
    Req --> Predict --> Severity
```

### Model Performance Metrics

| Metric | Score / Value | Description |
| :--- | :---: | :--- |
| **Accuracy** | **97.10%** | Overall correct classification rate across test sets |
| **ROC-AUC** | **0.9732** | Area under the Receiver Operating Characteristic curve |
| **Precision** | **100.0%** | Zero false positive diagnoses on primary test set |
| **Recall (Sensitivity)** | **67.12%** | True positive detection rate under high specificity thresholds |
| **F1-Score** | **0.8033** | Harmonic mean of precision and recall |

### Model Evaluation Visualizations

| Confusion Matrix | ROC Curve | Feature Importance |
| :---: | :---: | :---: |
| ![Confusion Matrix](docs/images/confusion_matrix.png) | ![ROC Curve](docs/images/roc_curve.png) | ![Feature Importance](docs/images/feature_importance.png) |
| *True Negatives: 21,864 \| True Positives: 1,419* | *AUC = 0.9732 showcasing strong discrimination* | *Blood glucose, HbA1c, and BMI rank highest* |

---

## 🚦 Clinical Gating & Decision Rules

The CDSS agent dynamically evaluates patient vitals and symptoms to classify conditions into precise clinical categories:

```mermaid
graph TD
    classDef init fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px;
    classDef decision fill:#fef3c7,stroke:#d97706,stroke-width:2px;
    classDef outcome fill:#dcfce7,stroke:#15803d,stroke-width:2px;

    Start([Patient Vital & Symptom Intake]):::init
    GenClassifier[General Symptom Classifier]:::init
    
    CheckGlucose{Glucose >= 126 mg/dL?}:::decision
    CheckProb{Diabetes Symptom Match >= 60%?}:::decision
    
    Start --> GenClassifier
    GenClassifier --> CheckGlucose
    CheckGlucose -->|No| CheckProb
    
    CheckGlucose -->|Yes: Trigger CDSS| RunCDSS[Execute Diabetes Specialist Agent]:::init
    CheckProb -->|Yes: Trigger CDSS| RunCDSS
    CheckProb -->|No: Standard Flow| SaveGeneral[Save Case with General Diagnosis]:::outcome
    
    RunCDSS --> EvaluateRisk[XGBoost Predicts Risk Probability]:::init
    
    CheckLowRisk{Risk < 35% AND Glucose < 100 mg/dL?}:::decision
    CheckPre{Glucose 100-125 mg/dL OR Risk 35%-60%?}:::decision
    CheckType1{Age < 30 AND BMI < 25 AND Insulin <= 20?}:::decision
    
    EvaluateRisk --> CheckLowRisk
    
    CheckLowRisk -->|Yes| LowRiskOut[Low Diabetes Risk / severity: low]:::outcome
    CheckLowRisk -->|No| CheckPre
    
    CheckPre -->|Yes| PrediabetesOut[Prediabetes / severity: moderate]:::outcome
    CheckPre -->|No| CheckType1
    
    CheckType1 -->|Yes| Type1Out[Type 1 Diabetes / severity: high]:::outcome
    CheckType1 -->|No| Type2Check{Glucose >= 250 mg/dL OR Risk >= 85%?}:::decision
    
    Type2Check -->|Yes| Type2Severe[Type 2 Diabetes / severity: severe]:::outcome
    Type2Check -->|No| Type2High[Type 2 Diabetes / severity: high]:::outcome
```

---

## 🔐 Authentication, RBAC & Patient Data Masking

The platform enforces strict Role-Based Access Control:

```mermaid
sequenceDiagram
    autonumber
    actor Doc as Doctor
    actor Pat as Patient
    participant FE as React Frontend
    participant API as FastAPI Backend
    participant Auth as Auth & Session Service
    participant DB as SQLite DB

    %% Doctor Workflow
    Note over Doc, API: Doctor Workflow (Full Diagnostic Visibility)
    Doc->>FE: Enters patient vitals, symptoms & email
    FE->>API: POST /predict/general + POST /predict/diabetes (Bearer Token)
    API->>Auth: get_current_user (Verify Token)
    Auth->>DB: Query User Role
    DB-->>Auth: Role: doctor
    Auth-->>API: Doctor Context
    API-->>FE: Return Full Diagnostic Results + Risk Probability + Brand Drugs + LLM Proofs
    Doc->>FE: Click "Save Case"
    FE->>API: POST /cases
    API->>DB: INSERT INTO patient_cases & prediction_events

    %% Patient Workflow
    Note over Pat, API: Patient Workflow (Privacy & Anxiety Protection Masking)
    Pat->>FE: Login & navigate to "My Recommendations"
    FE->>API: GET /cases
    API->>Auth: get_current_user (Verify Token)
    Auth->>DB: Query User Role
    DB-->>Auth: Role: patient
    Auth-->>API: Patient Context
    API->>DB: SELECT * FROM patient_cases WHERE patient_email = user_email
    DB-->>API: Raw case records
    Note over API: Apply Privacy Masking:<br/>1. general_prediction = null<br/>2. diabetes_prediction.diagnosis = masked<br/>3. diabetes_prediction.risk_probability = masked<br/>4. diabetes_prediction.alternative_medicine = masked<br/>5. Retain only 'medication' and 'diet' guidance
    API-->>FE: Return masked health summary
    FE-->>Pat: Display friendly care plan & meal schedule
```

---

## 🗄️ Database Entity-Relationship Model

```mermaid
erDiagram
    USERS {
        int id PK "Primary Key"
        string email UK "Unique Email Address"
        string full_name "User Full Name"
        string password_hash "PBKDF2-HMAC-SHA256 (120,000 iter)"
        string role "doctor | patient"
        string created_at "ISO-8601 Timestamp"
    }
    PATIENT_CASES {
        int id PK "Primary Key"
        string patient_email FK "References USERS.email"
        string doctor_email "Email of attending doctor"
        string symptoms "Intake symptom narrative"
        string labs "JSON: Glucose, HbA1c, BP, BMI, etc."
        string general_prediction "JSON: Multi-disease probabilities"
        string diabetes_prediction "JSON: CDSS risk, severity, meds, diet"
        string created_at "ISO-8601 Timestamp"
    }
    PREDICTION_EVENTS {
        int id PK "Primary Key"
        string user_email "Audited Actor Email"
        string event_type "prediction | login | export"
        string payload "Audit Snapshot Data"
        string created_at "ISO-8601 Timestamp"
    }
    MEDICINES {
        int id PK "Primary Key"
        string name "Indian Commercial Brand Name"
        real price "Price in INR (₹)"
        int is_discontinued "Active status flag"
        string manufacturer_name "Pharma Manufacturer"
        string type "Tablet, Capsule, Injection"
        string pack_size_label "Packaging details"
        string short_composition1 "Primary active composition (Indexed)"
        string short_composition2 "Secondary active composition (Indexed)"
    }
    USERS ||--o{ PATIENT_CASES : "has history of"
```

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/auth/register` | Public | Register a new user (`doctor` or `patient`) |
| `POST` | `/auth/login` | Public | Authenticate user credentials and receive bearer token |
| `GET` | `/auth/me` | Authenticated | Retrieve profile details of current user |
| `POST` | `/predict/general` | Doctor | Symptom text classifier for multi-disease probabilities |
| `POST` | `/predict/diabetes` | Doctor | Full specialist CDSS prediction, recommendations & LLM explanation |
| `GET` | `/recommend/medication` | Authenticated | Fetch medication guidelines and commercial brand lookup |
| `GET` | `/recommend/diet` | Authenticated | Retrieve low-glycemic dietary plans and meal recommendations |
| `GET` | `/recommend/alternative` | Doctor | Evidence-rated herbal/complementary therapies |
| `POST` | `/cases` | Doctor | Save clinical case record and patient diagnosis |
| `GET` | `/cases` | Authenticated | Retrieve patient case history (auto-masked for patients) |

Interactive OpenAPI documentation is available at `http://localhost:8000/docs`.

---

## 💻 Installation & Quickstart (Windows PowerShell)

### Prerequisites
- **Python 3.11+** installed
- **Node.js 18+** & **npm** installed
- **Git** installed

> 💡 **PowerShell Execution Policy Tip:** If script execution is disabled on your machine, run the bypass command in your active PowerShell window:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
> ```

---

### 1. Clone the Repository
```powershell
git clone https://github.com/surendhar28/AI-based-Diabetes-disease-detection-with-explanation.git
cd AI-based-Diabetes-disease-detection-with-explanation
```

---

### 2. Backend Setup & Run

1. Navigate to the `backend` directory:
   ```powershell
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```
3. Install backend dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
4. *(Optional)* Configure your Groq API key in `.env`:
   ```powershell
   cp .env.example .env
   # Edit .env and set: GROQ_API_KEY=your_groq_api_key_here
   ```
5. *(Optional)* Train or regenerate the ML model artifacts:
   ```powershell
   python models/train_models.py
   python models/generate_graphs.py
   ```
6. Start the FastAPI backend server:
   ```powershell
   .\.venv\Scripts\python.exe main.py
   ```
   *The backend will be running at `http://localhost:8000` (API docs at `http://localhost:8000/docs`).*

---

### 3. Frontend Setup & Run

1. Open a new PowerShell terminal and navigate to the `frontend` folder:
   ```powershell
   cd frontend
   ```
2. Install npm packages:
   ```powershell
   npm.cmd install
   ```
3. Start the Vite React development server:
   ```powershell
   npm.cmd run dev
   ```
   *Access the web application at `http://localhost:5173`.*

---

## 📁 Project Directory Structure

```text
├── .env.example                          # Environment variable configuration template
├── .gitignore                            # Git exclusion rules
├── EXPLANATION.md                        # In-depth technical architecture document
├── EXPLANATION.docx                      # Technical report in Word format
├── README.md                             # Project documentation (this file)
├── convert_md_to_docx.py                 # Markdown to DOCX compilation utility
├── docs/
│   └── images/                           # Generated ROC, confusion matrix & UI mockups
│       ├── confusion_matrix.png
│       ├── doctor_dashboard_ui.png
│       ├── feature_importance.png
│       ├── patient_care_ui.png
│       └── roc_curve.png
├── backend/
│   ├── main.py                           # FastAPI application entrypoint & lifespan
│   ├── requirements.txt                  # Python package dependencies
│   ├── agents/
│   │   ├── general_agent/                # TF-IDF Symptom-based multi-disease classifier
│   │   │   └── agent.py
│   │   └── diabetes_agent/               # Specialist CDSS Agent & engines
│   │       ├── agent.py                  # Agent orchestrator
│   │       ├── diagnosis.py              # Clinical severity & risk rules
│   │       ├── medication.py             # Pharma recommendations & brand lookup
│   │       ├── diet.py                   # Glycemic meal planner
│   │       ├── alternative.py            # Evidence-scored herbal remedies
│   │       └── explanation.py            # Groq LLaMA-3.3 LLM clinical reasoning
│   ├── api/
│   │   └── routes.py                     # REST endpoints & Pydantic request handlers
│   ├── data/                             # Knowledge bases, datasets & SQLite storage
│   │   ├── A_Z_medicines_dataset_of_India.csv
│   │   ├── alternative_medicine_kb.json
│   │   ├── diet_kb.json
│   │   ├── general_symptom_disease.csv
│   │   ├── kaggle_diabetes_prediction_dataset.csv
│   │   ├── medication_kb.json
│   │   └── pima_diabetes.csv
│   ├── models/
│   │   ├── diabetes_metrics.json         # Evaluated metrics snapshot
│   │   ├── diabetes_xgb_pipeline.pkl     # Serialized XGBoost model
│   │   ├── diabetes_random_forest_pipeline.pkl
│   │   ├── general_medicine_model.pkl    # Serialized symptom classifier
│   │   ├── generate_graphs.py            # ROC & Confusion matrix generator
│   │   ├── schemas.py                    # Pydantic data contracts
│   │   └── train_models.py               # Automated ML training script
│   ├── services/
│   │   ├── audit.py                      # Immutable audit event logger
│   │   ├── auth.py                       # PBKDF2 hashing & session token management
│   │   ├── database.py                   # SQLite schema definitions, WAL & indexing
│   │   └── model_registry.py             # Lazy artifact loading & pipeline registry
│   ├── tests/
│   │   ├── test_agents.py                # Agent & CDSS unit tests
│   │   └── test_role_auth.py             # RBAC & patient data masking verification
│   └── utils/
│       └── config.py                     # Application configuration & thresholds
└── frontend/
    ├── index.html                        # HTML5 document root
    ├── package.json                      # NPM dependencies & scripts
    ├── vite.config.js                    # Vite bundler configuration
    └── src/
        ├── App.jsx                       # Client router & session state
        ├── main.jsx                      # React 18 DOM mount
        ├── styles.css                    # Design system styling & responsive layout
        ├── components/
        │   ├── AppShell.jsx              # Navigation shell, header & logout
        │   └── MetricCard.jsx            # Clinical metric display component
        ├── pages/
        │   ├── Dashboard.jsx             # Doctor & Patient routing dashboard
        │   ├── DiabetesReport.jsx        # Detailed diagnostic & explanation report
        │   ├── Login.jsx                 # User authentication & registration page
        │   ├── PatientInputForm.jsx      # Doctor clinical vitals intake form
        │   ├── PatientRecords.jsx        # Patient health & meal plan history
        │   └── ResultsPage.jsx           # Immediate diagnostic summary page
        └── services/
            └── api.js                    # Axios client & token authorization interceptors
```

---

## 🧪 Testing & Validation

Execute the automated backend test suite to verify role authentication, data masking, and CDSS agent logic:
```powershell
cd backend
.\.venv\Scripts\python.exe -m pytest tests/
```

---

## 📄 License

This project is open-source and distributed under the **MIT License**. See the `LICENSE` file for more details.

---

<p align="center">
  <b>Agentic AI Healthcare Platform</b> • Clinical Decision Support System • 2026
</p>
