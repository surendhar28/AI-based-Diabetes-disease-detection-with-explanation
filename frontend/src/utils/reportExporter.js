/**
 * Clinical Report Exporter Utility
 * Allows doctors and patients to download specialized diagnostic & recommendation reports.
 */

export function generateReportText(caseResult, currentUser) {
  if (!caseResult) return '';

  const input = caseResult.input || {};
  const general = caseResult.general || {};
  const diabetes = caseResult.diabetes || {};
  const dateStr = new Date().toLocaleString();
  const role = currentUser?.role === 'doctor' ? 'Doctor' : 'Patient';

  let text = `================================================================================
           CLINICAL DECISION SUPPORT SYSTEM (CDSS)
                SPECIALIZED MEDICAL REPORT
================================================================================
Generated Date : ${dateStr}
Requested By   : ${currentUser?.full_name || 'User'} (${role})
Patient Email  : ${input.patient_email || caseResult.patient_email || 'N/A'}
================================================================================\n\n`;

  // 1. Clinical Diagnosis & Risk Summary
  text += `--------------------------------------------------------------------------------
1. DIAGNOSTIC SUMMARY & RISK ASSESSMENT
--------------------------------------------------------------------------------\n`;

  if (currentUser?.role === 'doctor') {
    text += `Primary Diagnosis     : ${diabetes.diagnosis || general.primary_diagnosis || 'Under Evaluation'}\n`;
    text += `Severity Level        : ${(diabetes.severity || 'N/A').toUpperCase()}\n`;
    if (diabetes.risk_probability !== undefined) {
      text += `ML XGBoost Risk Score : ${Math.round(diabetes.risk_probability * 100)}%\n`;
    }
  } else {
    text += `Care Plan Status      : PERSONALIZED RECOMMENDATIONS READY\n`;
    text += `Specialist Status     : ${general.diabetes_triggered ? 'Diabetes Specialist Care Activated' : 'Standard Health Guidelines'}\n`;
  }
  text += `Symptom Brief         : ${input.symptoms || 'N/A'}\n\n`;

  // 2. Patient Vitals & Lab Measurements
  text += `--------------------------------------------------------------------------------
2. PATIENT VITALS & LABORATORY MEASUREMENTS
--------------------------------------------------------------------------------\n`;
  text += `Age                   : ${input.age || 'N/A'}\n`;
  text += `Gender                : ${input.gender || 'N/A'}\n`;
  text += `Fasting Blood Glucose : ${input.glucose ? input.glucose + ' mg/dL' : 'N/A'}\n`;
  text += `HbA1c Level           : ${input.hba1c_level ? input.hba1c_level + ' %' : 'N/A'}\n`;
  text += `Blood Pressure        : ${input.blood_pressure ? input.blood_pressure + ' mmHg' : 'N/A'}\n`;
  text += `Body Mass Index (BMI) : ${input.bmi ? input.bmi + ' kg/m²' : 'N/A'}\n`;
  text += `Smoking History       : ${input.smoking_history || 'N/A'}\n`;
  text += `Hypertension          : ${input.hypertension ? 'Yes' : 'No'}\n`;
  text += `Heart Disease         : ${input.heart_disease ? 'Yes' : 'No'}\n\n`;

  // 3. Medication & Indian Brand Lookup Recommendations
  if (diabetes.medications) {
    text += `--------------------------------------------------------------------------------
3. RECOMMENDED MEDICATIONS & COMMERCIAL BRAND LOOKUP
--------------------------------------------------------------------------------\n`;
    text += `First-Line Therapy    : ${diabetes.medications.first_line_therapy || 'N/A'}\n`;
    text += `Clinical Reason       : ${diabetes.medications.reasoning || 'N/A'}\n\n`;

    if (diabetes.medications.commercial_brands && diabetes.medications.commercial_brands.length > 0) {
      text += `Commercial Brands Database Matches (200,000+ Brands Database):\n`;
      diabetes.medications.commercial_brands.forEach((brand, idx) => {
        text += `  ${idx + 1}. Brand: ${brand.name} | Mfg: ${brand.manufacturer || 'N/A'}\n`;
        text += `     Composition  : ${brand.active_composition}\n`;
        text += `     Packaging    : ${brand.packaging || 'N/A'} | Price: ₹${brand.price_inr || 'N/A'}\n`;
      });
      text += `\n`;
    }

    if (diabetes.medications.dosage_warnings) {
      text += `Dosage Warnings & Precautions:\n`;
      diabetes.medications.dosage_warnings.forEach((warn) => {
        text += `  - ${warn}\n`;
      });
      text += `\n`;
    }
  }

  // 4. Dietary & Lifestyle Management Plan
  if (diabetes.diet) {
    text += `--------------------------------------------------------------------------------
4. PERSONALIZED GLYCEMIC DIET & MEAL PLAN
--------------------------------------------------------------------------------\n`;
    text += `Diet Strategy         : ${diabetes.diet.strategy || 'Low Glycemic Index Plan'}\n`;
    text += `Daily Calorie Target  : ${diabetes.diet.daily_calorie_target || 'N/A'}\n\n`;

    if (diabetes.diet.meal_plan) {
      text += `Structured Daily Meal Schedule:\n`;
      Object.entries(diabetes.diet.meal_plan).forEach(([meal, items]) => {
        text += `  * ${meal.toUpperCase()}:\n`;
        if (Array.isArray(items)) {
          items.forEach(i => text += `    - ${i}\n`);
        } else {
          text += `    - ${items}\n`;
        }
      });
      text += `\n`;
    }
  }

  // 5. GenAI Explanation & Evidence-Based Guidelines
  if (diabetes.explanation) {
    text += `--------------------------------------------------------------------------------
5. AI CLINICAL EXPLANATION & EVIDENCE-BASED GUIDELINES
--------------------------------------------------------------------------------\n`;
    text += `AI Provider Tier      : ${diabetes.explanation.ai_provider || 'Tier 1 Gemini 2.5 AI / Groq LLaMA-3.3'}\n\n`;
    text += `Clinical Summary:\n${diabetes.explanation.clinical_summary || diabetes.explanation.summary || 'N/A'}\n\n`;

    if (diabetes.explanation.evidence_base && diabetes.explanation.evidence_base.length > 0) {
      text += `Verified Guideline Citations:\n`;
      diabetes.explanation.evidence_base.forEach(cite => {
        text += `  [✓] ${cite}\n`;
      });
      text += `\n`;
    }
  }

  text += `================================================================================
Notice: This report is generated by an Autonomous Multi-Agent Clinical Decision Support System.
Always consult a licensed medical professional before altering prescription regimens.
================================================================================`;

  return text;
}

export function downloadReportAsFile(caseResult, currentUser) {
  const text = generateReportText(caseResult, currentUser);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const filename = `Clinical_Specialist_Report_${Date.now()}.txt`;
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function triggerPrintReport() {
  window.print();
}
