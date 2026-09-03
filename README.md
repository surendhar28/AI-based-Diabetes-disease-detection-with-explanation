# 🩺 AI-Based Diabetes Disease Detection with Clinical Explanation & Multi-Agent CDSS

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-7.3.5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![3D WebGL](https://img.shields.io/badge/3D_Experience-WebGL_Canvas-990000?style=for-the-badge&logo=webgl&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
[![Gemini 2.5 AI](https://img.shields.io/badge/Tier_1_AI-Google_Gemini_2.5-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![Groq LLaMA-3.3](https://img.shields.io/badge/Tier_2_AI-Groq_Llama_3.3_70B-F55036?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com)
[![XGBoost](https://img.shields.io/badge/XGBoost-2.0.3-FF6600?style=for-the-badge&logo=xgboost&logoColor=white)](https://xgboost.readthedocs.io)
[![SQLite](https://img.shields.io/badge/SQLite-WAL_Mode-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

An intelligent, full-stack **Clinical Decision Support System (CDSS)** and **Autonomous Multi-Agent Healthcare Platform** designed for early diabetes detection, organ-specific specialist diagnostic previews, personalized dietary planning, commercial medication lookup, and dual-tier AI clinical explanations.

> ⚠️ **Clinical Safety Disclaimer:** This platform is designed as an educational prototype and clinical decision support tool for healthcare professionals and researchers. It does not replace certified clinical judgment, medical diagnosis, or prescription from a licensed healthcare provider.

---

## 🌟 Key Platform Features

- 🤖 **4 Specialist Autonomous Healthcare AI Agents**:
  - 🩸 **Diabetes Specialist Agent (Operational ML Engine):** 97.1% accuracy XGBoost prediction, fasting glucose & HbA1c trigger rules, Indian pharma brand lookup, glycemic diet plans, and Multi-Tier AI reasoning.
  - 🫀 **Cardiology (Heart) Agent (Interactive UI Workspace):** 10-Year Framingham / ASCVD MACE cardiovascular risk scoring, Troponin-I & ECG biomarker screening, statin & BP dosage guidance, and DASH diet protocol.
  - 🫘 **Nephrology (Kidney) Agent (Interactive UI Workspace):** CKD-EPI 2021 eGFR calculation engine, Stages 1 to 5 CKD severity staging, Serum Creatinine & UACR ratio monitoring, and renal protective ACEi guidance.
  - 🫁 **Pulmonology (Lung) Agent (Interactive UI Workspace):** GOLD COPD 1-4 spirometry staging, FEV1/FVC ratio airway obstruction gauge, SpO2 hypoxia alert, and inhaled bronchodilator therapy advisor.
- 🌌 **Pre-Sign In 3D Interactive Landing Page**:
  - WebGL 3D Particle & Agent Network Canvas (`Hero3DCanvas.jsx`).
  - Holographic 3D Orbit Core with floating metrics (`Hologram3DCore.jsx`).
  - Mouse-Tilt 3D Perspective Agent Cards (`TiltCard3D.jsx`).
  - Integrated Light & Dark Theme toggle (`mode === 'light'` vs `mode === 'dark'`).
- 🧠 **Dual-Tier AI Explanation Provider**:
  - **Tier 1 (Primary AI Provider):** Google Gemini 2.5 AI (`gemini-2.5-flash` / `gemini-3.6-flash`).
  - **Tier 2 (Secondary AI Provider):** Groq Cloud LLaMA-3.3 70B (`llama-3.3-70b-versatile`).
  - **Tier 3 (Emergency Fallback):** Local Rule-Based Clinical Guideline Engine (ADA, CDC, WHO standards).
- 💊 **Commercial Medicine & Diet Knowledge Base**: Integrated database of **200,000+ Indian pharmaceutical brands**, active composition lookup, generic alternatives, dosage warnings, and glycemic-index meal plans.
- 🔐 **Role-Based Access Control (RBAC) & Patient Data Masking**: Strict separation of Doctor and Patient privileges with PBKDF2-HMAC-SHA256 hashing and dynamic privacy filters to protect patients from raw diagnostic distress.
- ⚡ **High-Performance SQLite in WAL Mode**: Concurrent reads and writes using Write-Ahead Logging (`PRAGMA journal_mode=WAL`) and indexed lookups.

---

## 📸 User Interface & Multi-Agent Showcase

The application provides specialized, role-tailored dashboards for **Doctors** (full clinical diagnostics, ML risk probability, 4 specialized agent workspaces, GenAI explanation, alternative medicine) and **Patients** (secure, privacy-masked health summaries, medication schedules, and dietary guidance).

| 🩸 Diabetes Specialist Workspace | 🫀 Cardiology Specialist Agent |
| :---: | :---: |
| Intake form, XGBoost risk gauge, symptom matches, Indian brand medicines & GenAI clinical reasoning | 10-Year ASCVD risk score, Troponin-I screening & DASH diet guidance |

| 🫘 Nephrology Specialist Agent | 🫁 Pulmonology Specialist Agent |
| :---: | :---: |
| CKD-EPI 2021 eGFR calculator, Stages 1-5 CKD staging & renal drug warnings | GOLD COPD spirometry staging, FEV1/FVC ratio gauge & SpO2 hypoxia alert |

---

## 🏗️ System & Integration Architecture

The platform follows a decoupled, stateless REST API architecture powered by **FastAPI** on the backend and **React + Vite + WebGL 3D** on the frontend.

```mermaid
graph TD
    classDef client fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff;
    classDef api fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff;
    classDef agent fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff;
    classDef db fill:#8b5cf6,stroke:#6d28d9,stroke-width:2px,color:#fff;
    classDef ext fill:#ec4899,stroke:#be185d,stroke-width:2px,color:#fff;

    subgraph Client ["Frontend Layer (React 18 + Vite + WebGL 3D)"]
        Landing3D[3D WebGL Interactive Landing Page]:::client
        UI[Multi-Agent Router SPA UI]:::client
        AxiosClient[Axios REST Client + Auth Interceptor]:::client
    end

    subgraph API ["API & Routing Layer (FastAPI)"]
        Router[API Router & Endpoints]:::api
        AuthCheck[RBAC Dependency: get_current_user]:::api
        Sessions[Server-Side Memory Session Cache]:::api
    end

    subgraph Agentic ["Autonomous Multi-Agent CDSS Layer"]
        GenAgent[General Medicine Symptom Agent]:::agent
        DiabAgent[Diabetes Specialist CDSS Agent]:::agent
        HeartAgent[Cardiology Specialist Agent]:::agent
        KidneyAgent[Nephrology Specialist Agent]:::agent
        LungAgent[Pulmonology Specialist Agent]:::agent
        
        subgraph CDSS ["Specialist Sub-Engines"]
            DiagEng[Diagnosis & Severity Engine]:::agent
            MedEng[Medication Recommendation Engine]:::agent
            DietEng[Dietary Planning Engine]:::agent
            AltEng[Evidence Alternative Medicine Engine]:::agent
            ExpEng[Multi-Tier AI Explanation Engine]:::agent
        end
    end

    subgraph DB_Layer ["Database Layer (SQLite in WAL Mode)"]
        SQLiteDB[(SQLite Database)]:::db
        UsersTbl[(users table)]:::db
        CasesTbl[(patient_cases table)]:::db
        EventsTbl[(prediction_events audit)]:::db
        MedTbl[(200k+ Indian medicines brand DB)]:::db
    end

    subgraph External ["Multi-Tier AI Services"]
        Gemini[Tier 1: Google Gemini 2.5 API]:::ext
        Groq[Tier 2: Groq Cloud LLaMA-3.3 70B]:::ext
        LocalRules[Tier 3: Local ADA/CDC/WHO Rule Engine]:::ext
    end

    Landing3D --> UI
    UI --> AxiosClient
    AxiosClient -->|HTTP REST + Bearer Token| Router
    Router --> AuthCheck
    AuthCheck --> Sessions
    AuthCheck -->|Verify Identity & Role| UsersTbl
    
    Router --> GenAgent
    GenAgent -->|Trigger Condition: Glucose >= 126 or Prob >= 60%| DiabAgent
    Router --> HeartAgent
    Router --> KidneyAgent
    Router --> LungAgent
    
    DiabAgent --> DiagEng
    DiabAgent --> MedEng
    DiabAgent --> DietEng
    DiabAgent --> AltEng
    DiabAgent --> ExpEng
    
    ExpEng -->|Primary Call| Gemini
    Gemini -.->|Fallback on Timeout/Quota| Groq
    Groq -.->|Fallback on Error| LocalRules
    
    Router -->|Persist Case & Audit Trail| SQLiteDB
    DiagEng -->|Load Pre-trained Pipelines| Registry[Model Registry Service]
    MedEng -->|Search Indian Brand Database| MedTbl
```

---

## 🚦 Clinical Decision & Multi-Agent Gating Flow

The CDSS dynamically evaluates patient vitals and symptoms to route cases across specialized organ agents and determine clinical risk severity:

```mermaid
graph TD
    classDef init fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px;
    classDef decision fill:#fef3c7,stroke:#d97706,stroke-width:2px;
    classDef outcome fill:#dcfce7,stroke:#15803d,stroke-width:2px;

    Start([Patient Vital & Symptom Intake]):::init
    GenClassifier[General Symptom Classifier]:::init
    
    CheckGlucose{Glucose >= 126 mg/dL OR Prob >= 60%?}:::decision
    CheckHeart{BP > 140 OR Troponin > 0.04?}:::decision
    CheckKidney{eGFR < 60 OR Creatinine > 1.2?}:::decision
    CheckLung{SpO2 < 92% OR FEV1/FVC < 0.70?}:::decision

    Start --> GenClassifier
    GenClassifier --> CheckGlucose
    
    CheckGlucose -->|Yes: Trigger Diabetes Agent| RunDiabetesCDSS[Execute Diabetes Specialist Agent]:::init
    CheckGlucose -->|No: Standard Flow| SaveGeneral[Save Case with General Diagnosis]:::outcome
    
    Start --> CheckHeart
    CheckHeart -->|Yes| RunHeart[Execute Cardiology Agent ASCVD Risk]:::init
    
    Start --> CheckKidney
    CheckKidney -->|Yes| RunKidney[Execute Nephrology Agent CKD Staging]:::init
    
    Start --> CheckLung
    CheckLung -->|Yes| RunLung[Execute Pulmonology Agent GOLD Staging]:::init
    
    RunDiabetesCDSS --> EvaluateRisk[XGBoost Predicts Risk Probability]:::init
    
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

## 🤖 Machine Learning Pipeline & Performance

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

---

## 🔐 Authentication, RBAC & Patient Data Masking

```mermaid
sequenceDiagram
    autonumber
    actor Doc as Doctor
    actor Pat as Patient
    participant FE as React 3D Frontend
    participant API as FastAPI Backend
    participant Auth as Auth & Session Service
    participant DB as SQLite DB

    %% Doctor Workflow
    Note over Doc, API: Doctor Workflow (Full Diagnostic & Agent Visibility)
    Doc->>FE: Enters patient vitals, symptoms & selects agent workspace
    FE->>API: POST /predict/general + POST /predict/diabetes (Bearer Token)
    API->>Auth: get_current_user (Verify Token)
    Auth->>DB: Query User Role
    DB-->>Auth: Role: doctor
    Auth-->>API: Doctor Context
    API-->>FE: Return Full Diagnostic Results + XGBoost Risk % + Brand Drugs + Gemini LLM Reasoning
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
    Note over API: Apply Privacy Masking:<br/>1. general_prediction = null<br/>2. diabetes_prediction.diagnosis = masked<br/>3. diabetes_prediction.risk_probability = masked<br/>4. Retain only 'medication' and 'diet' guidance
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
        string password_hash "PBKDF2-HMAC-SHA256 (120k iter)"
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

> 💡 **PowerShell Tip:** If script execution policy is restricted, use `npm.cmd` or run:
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
2. Create virtual environment and install dependencies:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```
3. Configure environment variables in `.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GROQ_API_KEY=your_groq_api_key_here
   ```
4. Start the FastAPI backend server:
   ```powershell
   .\.venv\Scripts\uvicorn.exe main:app --host 127.0.0.1 --port 8000
   ```
   *Backend will run at `http://127.0.0.1:8000` (API docs at `http://127.0.0.1:8000/docs`).*

---

### 3. Frontend Setup & Run

1. Open a new terminal and navigate to `frontend`:
   ```powershell
   cd frontend
   ```
2. Install npm packages:
   ```powershell
   npm.cmd install
   ```
3. Start the Vite React 3D development server:
   ```powershell
   npm.cmd run dev
   ```
   *Access the application at `http://localhost:5173`.*

---

## 📁 Project Directory Structure

```text
├── .env.example                          # Template for GEMINI_API_KEY and GROQ_API_KEY
├── .gitignore                            # Git exclusion rules
├── EXPLANATION.md                        # Technical architecture document
├── README.md                             # Project documentation
├── backend/
│   ├── main.py                           # FastAPI application entrypoint & lifespan
│   ├── requirements.txt                  # Python package dependencies
│   ├── agents/
│   │   ├── general_agent/                # Symptom multi-disease classifier
│   │   └── diabetes_agent/               # Specialist CDSS Agent & sub-engines
│   │       ├── agent.py                  # Agent orchestrator
│   │       ├── diagnosis.py              # Clinical severity & risk rules
│   │       ├── medication.py             # Pharma recommendations & brand lookup
│   │       ├── diet.py                   # Glycemic meal planner
│   │       ├── alternative.py            # Herbal remedy evidence scoring
│   │       └── explanation.py            # Tier 1 (Gemini) + Tier 2 (Groq) AI engine
│   ├── api/
│   │   └── routes.py                     # REST API handlers
│   ├── data/                             # Datasets & 200k+ Indian medicine brands
│   ├── models/                           # ML serialized artifacts & train scripts
│   ├── services/                         # Auth, SQLite WAL database & audit logging
│   └── tests/                            # Pytest automated test suite
└── frontend/
    ├── package.json                      # NPM dependencies & scripts
    ├── vite.config.js                    # Vite configuration
    └── src/
        ├── App.jsx                       # Master router & theme state manager
        ├── styles.css                    # Design tokens & 3D CSS keyframe animations
        ├── components/
        │   ├── AppShell.jsx              # Navigation shell & agent switcher
        │   ├── Hero3DCanvas.jsx          # Interactive 3D WebGL particle background
        │   ├── Hologram3DCore.jsx        # 3D rotating multi-agent hologram core
        │   └── TiltCard3D.jsx            # Mouse-tilt 3D perspective card wrapper
        └── pages/
            ├── LandingPage.jsx           # 3D interactive public landing page & theme toggle
            ├── Dashboard.jsx             # 4 Specialist Agent Hub & pipeline routing
            ├── HeartAgent.jsx            # Cardiology Specialist CDSS workspace
            ├── KidneyAgent.jsx           # Nephrology Specialist CDSS workspace
            ├── LungAgent.jsx             # Pulmonology Specialist CDSS workspace
            ├── PatientInputForm.jsx      # Doctor clinical vitals intake form
            ├── DiabetesReport.jsx        # Detailed diagnostic & explanation report
            ├── PatientRecords.jsx        # Patient health history & meal schedule
            └── ResultsPage.jsx           # Diagnostic result summary page
```

---

## 🧪 Testing & Validation

Run the backend test suite to verify agent logic, dual-tier AI fallback, and RBAC data masking:
```powershell
cd backend
.\.venv\Scripts\python.exe -m pytest tests/
```

---

## 📄 License

This project is open-source and distributed under the **MIT License**. See the `LICENSE` file for details.

---

<p align="center">
  <b>Agentic Multi-Agent AI Healthcare Platform</b> • Clinical Decision Support System • 2026
</p>
