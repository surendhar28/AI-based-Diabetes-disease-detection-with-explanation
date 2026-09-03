import json
import os
import httpx

from models.schemas import GenAIExplanation, VerifiedProof


class DiabetesExplanationEngine:
    def __init__(self) -> None:
        self.gemini_key = os.getenv("GEMINI_API_KEY", "")
        self.gemini_endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={self.gemini_key}" if self.gemini_key else ""
        
        self.groq_key = os.getenv("GROQ_API_KEY", "")
        self.groq_endpoint = "https://api.groq.com/openai/v1/chat/completions"
        self.groq_model = "llama-3.3-70b-versatile"

    def explain(
        self,
        payload: object,
        diagnosis: str,
        risk_probability: float,
        severity: str,
    ) -> GenAIExplanation:
        system_prompt = (
            "You are an expert Clinical Decision Support System (CDSS) AI specialized in endocrinology and diabetes care. "
            "Your task is to analyze patient metrics and a machine learning model's prediction risk, "
            "explain the diagnosis clearly, and list verified medical guidelines/proofs (e.g. ADA, CDC, WHO) justifying the diagnosis. "
            "You must return the response ONLY as a JSON object matching the following structure:\n"
            "{\n"
            "  \"summary\": \"A short 1-2 sentence explanation of the predicted sugar level and risk.\",\n"
            "  \"detailed_analysis\": \"A comprehensive paragraph explaining how metrics like glucose, HbA1c, age, BMI, and insulin contribute to this diagnosis.\",\n"
            "  \"verifies_proof\": [\n"
            "    {\n"
            "      \"source\": \"Specific reference (e.g., 'ADA Guidelines 2024 - Section 2')\",\n"
            "      \"fact\": \"The specific diagnostic guideline or fact (e.g., 'Fasting glucose >= 126 mg/dL indicates diabetes')\",\n"
            "      \"relevance_score\": 0.95,\n"
            "      \"clinical_notes\": \"Brief clinical notes connecting this guideline fact to the patient's metrics\"\n"
            "    }\n"
            "  ]\n"
            "}"
        )

        user_content = (
            f"Patient Profile:\n"
            f"- Age: {payload.age}\n"
            f"- Gender: {payload.gender}\n"
            f"- Pregnancies: {payload.pregnancies}\n"
            f"- Blood Glucose: {payload.glucose} mg/dL\n"
            f"- HbA1c Level: {payload.hba1c_level if payload.hba1c_level else 'Not provided'}\n"
            f"- Blood Pressure: {payload.blood_pressure} mmHg\n"
            f"- Skin Thickness: {payload.skin_thickness} mm\n"
            f"- Insulin: {payload.insulin} uU/mL\n"
            f"- BMI: {payload.bmi}\n"
            f"- Diabetes Pedigree Function: {payload.diabetes_pedigree_function}\n\n"
            f"Model Prediction:\n"
            f"- Diagnostic Classification: {diagnosis}\n"
            f"- Assessed Risk Probability: {risk_probability:.2%}\n"
            f"- Alert Severity Level: {severity}\n"
        )

        # ----------------------------------------------------
        # TIER 1: Gemini API (Primary Provider)
        # ----------------------------------------------------
        if self.gemini_key:
            try:
                gemini_payload = {
                    "contents": [
                        {
                            "parts": [
                                {"text": system_prompt + "\n\n" + user_content}
                            ]
                        }
                    ],
                    "generationConfig": {
                        "responseMimeType": "application/json",
                        "temperature": 0.1
                    }
                }
                print("[AI Engine] Triggering Tier 1 AI: Google Gemini API (gemini-2.5-flash)...")
                with httpx.Client(timeout=12.0) as client:
                    response = client.post(self.gemini_endpoint, json=gemini_payload)
                    if response.status_code == 200:
                        data = response.json()
                        raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
                        result = json.loads(raw_text)
                        
                        proofs = []
                        for proof in result.get("verifies_proof", []):
                            proofs.append(VerifiedProof(
                                source=proof.get("source", "Medical Guideline"),
                                fact=proof.get("fact", ""),
                                relevance_score=float(proof.get("relevance_score", 0.5)),
                                clinical_notes=proof.get("clinical_notes")
                            ))
                        print("[AI Engine] Tier 1 Gemini explanation successfully generated!")
                        return GenAIExplanation(
                            summary=result.get("summary", ""),
                            detailed_analysis=result.get("detailed_analysis", ""),
                            verifies_proof=proofs
                        )
                    else:
                        print(f"[AI Engine] Tier 1 Gemini error (status code {response.status_code}): {response.text}")
            except Exception as exc:
                print(f"[AI Engine] Exception calling Tier 1 Gemini API: {exc}")

        # ----------------------------------------------------
        # TIER 2: Groq API (Secondary Fallback Provider)
        # ----------------------------------------------------
        if self.groq_key:
            try:
                headers = {
                    "Authorization": f"Bearer {self.groq_key}",
                    "Content-Type": "application/json"
                }

                request_body = {
                    "model": self.groq_model,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_content}
                    ],
                    "response_format": {"type": "json_object"},
                    "temperature": 0.1
                }
                print("[AI Engine] Triggering Tier 2 AI: Groq Cloud LLaMA-3.3...")
                with httpx.Client(timeout=8.0) as client:
                    response = client.post(self.groq_endpoint, headers=headers, json=request_body)
                    if response.status_code == 200:
                        data = response.json()
                        content = data["choices"][0]["message"]["content"]
                        result = json.loads(content)
                        
                        proofs = []
                        for proof in result.get("verifies_proof", []):
                            proofs.append(VerifiedProof(
                                source=proof.get("source", "Medical Guideline"),
                                fact=proof.get("fact", ""),
                                relevance_score=float(proof.get("relevance_score", 0.5)),
                                clinical_notes=proof.get("clinical_notes")
                            ))
                        print("[AI Engine] Tier 2 Groq explanation successfully generated!")
                        return GenAIExplanation(
                            summary=result.get("summary", ""),
                            detailed_analysis=result.get("detailed_analysis", ""),
                            verifies_proof=proofs
                        )
                    else:
                        print(f"[AI Engine] Tier 2 Groq API error (status code {response.status_code}): {response.text}")
            except Exception as exc:
                print(f"[AI Engine] Exception calling Tier 2 Groq API: {exc}")

        # ----------------------------------------------------
        # TIER 3: Local Rule Engine (Emergency Fallback)
        # ----------------------------------------------------
        print("[AI Engine] Tier 1 & Tier 2 unavailable. Triggering Tier 3 Local Rule Engine...")
        return self._local_fallback(payload, diagnosis, risk_probability, severity)

    def _local_fallback(
        self,
        payload: object,
        diagnosis: str,
        risk_probability: float,
        severity: str,
    ) -> GenAIExplanation:
        glucose = payload.glucose
        hba1c = payload.hba1c_level if payload.hba1c_level is not None else (
            5.6 if glucose < 126 else 7.0 if glucose < 200 else 8.2
        )
        
        proofs = []
        
        # Build Summary
        summary = (
            f"Predicted classification: {diagnosis} ({severity} alert level) with a model-assessed "
            f"diabetes risk probability of {risk_probability:.1%}."
        )
        
        # Build Detailed Analysis
        analysis_parts = [
            f"The patient, a {payload.age}-year-old {payload.gender}, presents with a blood glucose level of {glucose} mg/dL. ",
            f"The machine learning risk model predicts a {risk_probability:.0%} probability of diabetes based on clinical "
            f"indicators including BMI ({payload.bmi}), blood pressure ({payload.blood_pressure} mmHg), "
            f"and insulin level ({payload.insulin} µU/mL)."
        ]
        
        if diagnosis == "Type 2 Diabetes":
            analysis_parts.append(
                " The clinical readings satisfy diagnostic thresholds for diabetes, necessitating primary "
                "medical care, lifestyle intervention, and glucose monitoring."
            )
            proofs.append(VerifiedProof(
                source="American Diabetes Association (ADA) Guidelines 2024",
                fact="Fasting plasma glucose >= 126 mg/dL (7.0 mmol/L) or random plasma glucose >= 200 mg/dL (11.1 mmol/L) with symptoms indicates diabetes.",
                relevance_score=0.98 if glucose >= 126 else 0.85,
                clinical_notes=f"Patient's glucose reading of {glucose} mg/dL is a key indicator for this diagnosis."
            ))
            proofs.append(VerifiedProof(
                source="ADA Standards of Medical Care in Diabetes 2024",
                fact="HbA1c level >= 6.5% (48 mmol/mol) is a standard diagnostic criterion for diabetes mellitus.",
                relevance_score=0.95 if hba1c >= 6.5 else 0.75,
                clinical_notes=f"The patient's estimated/actual HbA1c is {hba1c}%."
            ))
        elif diagnosis == "Prediabetes":
            analysis_parts.append(
                " The readings fall into the prediabetic range. While not diagnostic of full diabetes, "
                "they indicate significant insulin resistance and elevated risk, suggesting immediate "
                "lifestyle modifications to halt progression."
            )
            proofs.append(VerifiedProof(
                source="ADA Guidelines 2024 - Prediabetes Classification",
                fact="Fasting plasma glucose between 100 mg/dL and 125 mg/dL (5.6 to 6.9 mmol/L) indicates impaired fasting glucose (Prediabetes).",
                relevance_score=0.98 if 100 <= glucose < 126 else 0.70,
                clinical_notes=f"Fasting glucose of {glucose} mg/dL lies directly in the impaired range."
            ))
            proofs.append(VerifiedProof(
                source="CDC National Diabetes Prevention Program",
                fact="HbA1c levels between 5.7% and 6.4% indicate prediabetes, highlighting a window of opportunity for preventive lifestyle intervention.",
                relevance_score=0.95 if 5.7 <= hba1c <= 6.4 else 0.80,
                clinical_notes=f"Estimated HbA1c of {hba1c}% indicates high risk of progression to Type 2 diabetes."
            ))
        else:
            analysis_parts.append(
                " The clinical measurements and the model predict a low risk of active diabetes complications. "
                "Preventive care and routine screening are recommended to maintain metabolic health."
            )
            proofs.append(VerifiedProof(
                source="ADA Guidelines - Routine Screening",
                fact="Fasting plasma glucose < 100 mg/dL (5.6 mmol/L) is considered normal glycemic regulation.",
                relevance_score=0.95 if glucose < 100 else 0.60,
                clinical_notes=f"Fasting glucose of {glucose} mg/dL is within the normal reference range."
            ))
            
        if payload.bmi >= 25.0:
            proofs.append(VerifiedProof(
                source="World Health Organization (WHO) Obesity Guidelines",
                fact="A BMI of 25.0 kg/m² or higher is classified as overweight, which is a key physical risk factor for insulin resistance and Type 2 diabetes.",
                relevance_score=0.90 if payload.bmi >= 25 else 0.50,
                clinical_notes=f"Patient's BMI of {payload.bmi} is classified as elevated, increasing cellular resistance to insulin."
            ))
            
        return GenAIExplanation(
            summary=summary,
            detailed_analysis="".join(analysis_parts),
            verifies_proof=proofs
        )
