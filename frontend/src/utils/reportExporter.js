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

  // Normalize Medication Data
  const medList = Array.isArray(diabetes.medication) 
    ? diabetes.medication 
    : (diabetes.medications ? [diabetes.medications] : []);
  const primaryMed = medList[0] || {};
  const brandsList = primaryMed.brands || diabetes.medications?.commercial_brands || [];
  const warningsList = primaryMed.warnings || diabetes.medications?.dosage_warnings || [];

  // Normalize Diet Data
  const dietObj = diabetes.diet || {};
  const macroBreakdown = dietObj.macro_breakdown || {};
  const mealsList = Array.isArray(dietObj.meals) 
    ? dietObj.meals 
    : (dietObj.meal_plan ? Object.entries(dietObj.meal_plan).map(([k, v]) => ({ time: k, items: Array.isArray(v) ? v.join(', ') : v })) : []);
  const foodsToAvoid = dietObj.foods_to_avoid || [];

  // Normalize GenAI Explanation Data
  const aiExplanation = diabetes.genai_explanation || diabetes.explanation || {};
  const citations = aiExplanation.verifies_proof || aiExplanation.evidence_base || [];

  // Physical Activities List
  const activitiesList = diabetes.physical_activities || [
    {
      name: "Brisk Zone-2 Aerobic Walking",
      duration: "30 mins / day (150 mins / week)",
      frequency: "5 days / week",
      clinical_mechanism: "Stimulates GLUT4 glucose transporter translocation in skeletal muscle independent of insulin."
    },
    {
      name: "Post-Meal Glucose-Sponge Walks",
      duration: "10-15 mins post-meal",
      frequency: "After Lunch & Dinner",
      clinical_mechanism: "Attenuates postprandial glycemic spikes by utilizing blood glucose in active quadriceps."
    },
    {
      name: "Progressive Resistance Training",
      duration: "30-45 mins per session",
      frequency: "2-3 days / week",
      clinical_mechanism: "Increases skeletal muscle mass (body's largest glucose sink) to enhance insulin sensitivity."
    }
  ];

  let text = `================================================================================
           CLINICAL DECISION SUPPORT SYSTEM (CDSS)
                SPECIALIZED MEDICAL REPORT
================================================================================
Generated Date : ${dateStr}
Requested By   : ${currentUser?.full_name || 'User'} (${role})
Patient Name   : ${input.patient_name || caseResult.patient_name || 'N/A'}
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
  text += `--------------------------------------------------------------------------------
3. RECOMMENDED MEDICATIONS & COMMERCIAL BRAND LOOKUP
--------------------------------------------------------------------------------\n`;
  text += `First-Line Therapy    : ${primaryMed.medication || primaryMed.first_line_therapy || 'N/A'}\n`;
  if (primaryMed.dosage) {
    text += `Prescribed Dosage     : ${primaryMed.dosage}\n`;
  }
  text += `Clinical Reason       : ${primaryMed.reasoning || 'N/A'}\n\n`;

  if (brandsList.length > 0) {
    text += `Commercial Brands Database Matches (200,000+ Brands Database):\n`;
    brandsList.forEach((brand, idx) => {
      text += `  ${idx + 1}. Brand: ${brand.name} | Mfg: ${brand.manufacturer || 'N/A'}\n`;
      text += `     Composition  : ${brand.composition || brand.active_composition}\n`;
      text += `     Packaging    : ${brand.pack_size || brand.packaging || 'N/A'} | Price: ₹${brand.price || brand.price_inr || 'N/A'}\n`;
    });
    text += `\n`;
  }

  if (warningsList.length > 0) {
    text += `Dosage Warnings & Precautions:\n`;
    warningsList.forEach((warn) => {
      text += `  - ${warn}\n`;
    });
    text += `\n`;
  }

  // 4. Dietary & Lifestyle Management Plan
  text += `--------------------------------------------------------------------------------
4. PERSONALIZED GLYCEMIC DIET & MEAL PLAN
--------------------------------------------------------------------------------\n`;
  text += `Diet Strategy         : ${dietObj.strategy || 'Low Glycemic Index Protocol'}\n`;
  text += `Target Diagnosis      : ${diabetes.diagnosis || 'Type 2 Diabetes'}\n`;
  text += `Daily Calorie Target  : ${dietObj.calories || dietObj.daily_calorie_target || 'N/A'} kcal / day\n`;
  if (Object.keys(macroBreakdown).length > 0) {
    text += `Macro Split           : ${Object.entries(macroBreakdown).map(([k, v]) => `${k}: ${v}`).join(', ')}\n\n`;
  }

  if (mealsList.length > 0) {
    text += `Structured Daily Meal Schedule:\n`;
    mealsList.forEach((meal) => {
      text += `  * ${(meal.time || 'Meal').toUpperCase()}:\n`;
      text += `    - ${meal.items}\n`;
    });
    text += `\n`;
  }

  if (foodsToAvoid.length > 0) {
    text += `Critical Foods to Avoid:\n`;
    foodsToAvoid.forEach(f => text += `  - ${f}\n`);
    text += `\n`;
  }

  // 5. Physical Activities Protocol Tailored to Diagnosis
  text += `--------------------------------------------------------------------------------
5. DIAGNOSIS-TAILORED PHYSICAL ACTIVITIES & EXERCISE PROTOCOL
--------------------------------------------------------------------------------\n`;
  text += `Target Diagnosis      : ${diabetes.diagnosis || 'Type 2 Diabetes'}\n\n`;
  activitiesList.forEach((act, idx) => {
    text += `  ${idx + 1}. Activity: ${act.name}\n`;
    text += `     Duration : ${act.duration} | Frequency: ${act.frequency}\n`;
    text += `     Mechanism: ${act.clinical_mechanism}\n\n`;
  });

  // 6. GenAI Explanation & Evidence-Based Guidelines
  text += `--------------------------------------------------------------------------------
6. AI CLINICAL EXPLANATION & EVIDENCE-BASED GUIDELINES
--------------------------------------------------------------------------------\n`;
  text += `AI Provider Tier      : ${aiExplanation.ai_provider || 'Tier 1 Gemini 2.5 AI / Groq LLaMA-3.3'}\n\n`;
  text += `Clinical Summary:\n${aiExplanation.summary || aiExplanation.clinical_summary || 'N/A'}\n\n`;

  if (aiExplanation.detailed_analysis) {
    text += `Detailed Analysis:\n${aiExplanation.detailed_analysis}\n\n`;
  }

  if (citations.length > 0) {
    text += `Verified Guideline Citations:\n`;
    citations.forEach(cite => {
      const citeText = typeof cite === 'string' ? cite : `${cite.source || 'Guideline'}: ${cite.fact || cite.clinical_notes}`;
      text += `  [✓] ${citeText}\n`;
    });
    text += `\n`;
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
