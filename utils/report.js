// report.js

function questionnaire(data) {
  return {
      "neurologicalDisease": data.neurologicalDisease || false,  // Dot notation
      "amputation": data['amputation'] || false,  // Bracket notation
      "ulcer": data.ulcer ?? false,  // Nullish coalescing (ES2020)
      "smoking": 'smoking' in data ? data.smoking : false  // Safe check
  };
}
function calculateScores(data, side) {
  function scoreSkin() {
    if (![1, 2, 3, 4].some(i => data['skin' + i]?.[side])) return 0;
    if (data['skin4']?.[side]) return 3;
    if (data['skin3']?.[side]) return 2;
    if (data['skin2']?.[side]) return 1;
    if (data['skin1']?.[side]) return 0;
    return 0;
  }

  function scoreNails() {
    if (![1, 2, 3].some(i => data['nails' + i]?.[side])) return 0;
    if (data['nails3']?.[side]) return 2;
    if (data['nails2']?.[side]) return 1;
    if (data['nails1']?.[side]) return 0;
    return 0;
  }

  function scoreDeformity() {
    if (![1, 2, 3, 4].some(i => data['deformity' + i]?.[side])) return 0;
    if (data['deformity4']?.[side]) return 4;
    if (data['deformity3']?.[side]) return 3;
    if (data['deformity2']?.[side]) return 2;
    if (data['deformity1']?.[side]) return 0;
    return 0;
  }

  function scoreFootwear() {
    if (![1, 2, 3].some(i => data['footwear' + i]?.[side])) return 0;
    if (data['footwear3']?.[side]) return 2;
    if (data['footwear2']?.[side]) return 1;
    if (data['footwear1']?.[side]) return 0;
    return 0;
  }

  function scoreTemperatureCold() {
    if (data['tempCold2']?.[side]) {
      return 1; // Foot is cold
    } else {
      return 0; // Foot is normal temperature
    }
  }
  
  function scoreTemperatureHot() {
    if (data['tempHot2']?.[side]) {
      return 1; // Foot is hot
    } else {
      return 0; // Foot is normal temperature
    }
  }

  function scoreRangeOfMotion() {
    for (let i = 4; i > 0; i--) {
      if (data['motion' + i]?.[side]) return i-1;
    }
    return 0;
  }

  function scoreMonofilament() {
    // For monofilament, we use the same value for both sides since it's now a single checkbox
    if (data['monofilament3']?.value) return 4; // 0-6 sites (high risk)
    if (data['monofilament2']?.value) return 2; // 7-9 sites (moderate risk)
    if (data['monofilament1']?.value) return 0; // All 10 sites (normal)
    return 0; // Default if none selected
  }

  function scoreSensationQuestions() {
    return [1, 2, 3, 4].some(i => data['sensation' + i]?.[side]) ? 2 : 0;
  }

  function scorePedalPulses() {
    return data['pedal']?.[side] ? 0 : 1;
  }

  function scoreRubor() {
    return data['rubor']?.[side] ? 1 : 0;
  }

  function scoreErythema() {
    return data['erythema']?.[side] ? 1 : 0;
  }

  function scoreIpswich() {
    // For Ipswich, we use the same value for both sides since it's now a single checkbox
    if (data['ipswich']?.value) return 4; // 3 or fewer toes
    if (data['ipswich1']?.value || data['ipswich2']?.value) return 2; // 4-5 toes
    if (data['ipswich3']?.value) return 0; // All 6 toes
    return 0; // Default if none selected
  }

  return {
    "Skin": scoreSkin(),
    "Nails": scoreNails(),
    "Deformity": scoreDeformity(),
    "Footwear": scoreFootwear(),
    "Temperature Cold": scoreTemperatureCold(),
    "Temperature Hot": scoreTemperatureHot(),
    "Range of Motion": scoreRangeOfMotion(),
    "Sensation (Monofilament)": scoreMonofilament(),
    "Sensation (Questions)": scoreSensationQuestions(),
    "Pedal Pulses": scorePedalPulses(),
    "Dependent Rubor": scoreRubor(),
    "Erythema": scoreErythema(),
    "Ipswich": scoreIpswich(),
  };
}

function determineRiskCategory(scores,Answers) {
  let riskCategory, criteria, clinicalIndicator, screeningFrequency;

  if (
    scores["Skin"] >= 3 &&
    scores["Erythema"] >= 1 &&
    scores["Temperature Hot"] >= 1
  ) {
    riskCategory = "Urgent Risk";
    criteria = "Active ulcer/infection/active Charcot detected";
    clinicalIndicator = "Urgent care required, immediate intervention needed";
    screeningFrequency = "Every 3 Days";
  } else if (
    scores["Sensation (Monofilament)"] >= 4 ||
    scores["Ipswich"] == 4 && scores['Sensation (Questions)'] >= 2 &&
    Answers["ulcer"] == true
  ) {
    riskCategory = "High Risk - Category 3";
    criteria = "Previous hx of ulceration";
    clinicalIndicator = "LOPS(neuropathy) + history of foot ulcer";
    screeningFrequency = "Screen every 1 months";
  } else if (scores["Sensation (Monofilament)"] >= 4 ||
    scores["Ipswich"] == 4 && scores['Sensation (Questions)'] >= 2 &&
    Answers["amputation"] == true) {
    riskCategory = "High Risk - Category 3";
    criteria = "previous hx of amputation";
    clinicalIndicator = "LOPS(neuropathy) + history of lower limb amputation";
    screeningFrequency = "Screen every 1 months";
  }else if (scores["Sensation (Monofilament)"] >= 4 ||
    scores["Ipswich"] == 4 && scores['Sensation (Questions)'] >= 2 &&
    (Answers["amputation"] == true && Answers["ulcer"] == true)) {
    riskCategory = "High Risk - Category 3";
    criteria = "Previous hx of ulceration and previous hx of amputation";
    clinicalIndicator = "LOPS(neuropathy) + history of lower limb amputation+ history of foot ulcer";
    screeningFrequency = "Screen every 1 months";
  }else if (scores['Temperature Cold'] >= 1 && 
      scores['Pedal Pulses'] >= 1 &&
      scores['Dependent Rubor'] >= 1 &&
      Answers["ulcer"] == true) {
      riskCategory = "High Risk - Category 3";
      criteria = "Previous hx of ulceration ";
      clinicalIndicator = "Peripheral arterial disease + History of foot ulcer ";
      screeningFrequency = "Screen every 1 months";
  }else if (scores['Temperature Cold'] >= 1 && 
      scores['Pedal Pulses'] >= 1 &&
      scores['Dependent Rubor'] >= 1 &&
      Answers["amputation"] == true) {
      riskCategory = "High Risk - Category 3";
      criteria = "previous hx of amputation";
      clinicalIndicator = "Peripheral arterial disease + History of lower limb amputation";
      screeningFrequency = "Screen every 1 months";
  }else if (scores['Temperature Cold'] >= 1 && 
      scores['Pedal Pulses'] >= 1 &&
      scores['Dependent Rubor'] >= 1 &&
      (Answers["amputation"] == true && Answers["ulcer"] == true)) {
      riskCategory = "High Risk - Category 3";
      criteria = "Previous hx of ulceration and previous hx of amputation";
      clinicalIndicator = "Peripheral arterial disease + History of foot ulcer + History of lower limb amputation";
      screeningFrequency = "Screen every 1 months";
  }else if (
    scores['Deformity'] >= 4 && 
    (scores['Sensation (Monofilament)'] >= 4 || scores['Ipswich'] >= 4) &&
    scores['Sensation (Questions)'] >= 2) {
    riskCategory = "Moderate Risk - Category 2";
    criteria = "Boney changes parameter ( Charcot changes) + loss of sensation";
    clinicalIndicator = "LOPS+foot deformity";
    screeningFrequency = "Screen every 3 months";
  } else if (
    scores['Deformity'] >= 4 &&
    (scores['Sensation (Monofilament)'] >= 4 || scores['Ipswich'] >= 4) && scores['Temperature Cold'] >= 4 && scores['Pedal Pulses'] >= 1 && scores['Dependent Rubor'] >= 1) {
    riskCategory = "Moderate Risk - Category 2";
    criteria = "Boney changes parameter (Charcot changes) + peripheral arterial disease parameters.";
    clinicalIndicator = "LOPS+foot deformity, or PAD + foot deformity";
    screeningFrequency = "Screen every 3 months";
  } else if (
    (scores['Sensation (Monofilament)'] >= 4 || scores['Ipswich'] >= 4) &&
      scores['Sensation (Questions)'] >= 2 && 
      (scores['Temperature Cold'] >= 1 && scores['Pedal Pulses'] >= 1 && scores['Dependent Rubor'] >= 1)) {
    riskCategory = "Moderate Risk - Category 2";
    criteria = "Loss of sensation (neuropathy) +peripheral arterial disease";
    clinicalIndicator = "LOPS + PAD";
    screeningFrequency = "Screen every 3 months";
  }else if (scores["Footwear"] >= 2 && scores["Range of Motion"] >= 3) {
    // Moderate score in parameters 4 and 7 -> indicative of callus formation
    riskCategory = "Low Risk - Category 0";
    criteria = "Normal – no neuropathy";
    clinicalIndicator = "indicative of callus formation";
    screeningFrequency = "Screen every 6 months";
} else if (scores["Skin"] >= 3 && scores["Erythema"] >= 1 && scores["Temperature Hot"] >= 1) {
    // High score in 1,6,12 -> indicative of infected ulcer
    riskCategory = "Low Risk - Category 0";
    criteria = "Normal – no neuropathy";
    clinicalIndicator = "Need retest every 3 days to check the ulcer";
    screeningFrequency = "Screen every 6 months";
} else if (scores["Nails"]>= 2 && scores["Erythema"] >= 1 && scores["Temperature Hot"] >= 1) {
    // High score in 2,6,12 -> indicative of infected nails
    riskCategory = "Low Risk - Category 0";
    criteria = "Normal – no neuropathy";
    clinicalIndicator = "Need retest every 3 days to check the nails";
    screeningFrequency = "Screen every 6 months";
} else if (scores['Temperature Cold'] >= 1 && scores['Pedal Pulses'] >= 1 && scores['Dependent Rubor'] >= 1) {
    // High score in 5,10,11 -> indicative of peripheral arterial disease
    riskCategory = "Low Risk - Category 1";
    criteria = "Loss of protective sensation";
    clinicalIndicator = "Peripheral arterial disease";
    screeningFrequency = "Screen every 6 months";
} else if ((scores['Sensation (Monofilament)'] >= 4 || scores['Ipswich'] >= 4) && scores['Sensation (Questions)'] >= 2) {
    // High score in parameters 8 and 9 -> indicative of loss of sensation-neuropathy
    riskCategory = "Low Risk - Category 1";
    criteria = "Loss of protective sensation";
    clinicalIndicator = "Loss of sensation-neuropathy";
    screeningFrequency = "Screen every 6 months";
}else if (
    scores["Skin"] >= 3 &&
    scores["Nails"] >= 2 &&
    scores["Footwear"] >= 2
  ) {
    riskCategory = "Healthy Foot - Need Self Care";
    criteria = "Healthy foot, but self-care needed";
    clinicalIndicator = "Monitor for ulcers";
    screeningFrequency = "Every 12 months";
  } else {
    riskCategory = "Very Low Risk - Category 0";
    criteria = "Normal No Neuropathy";
    clinicalIndicator = "Minimal risk detected";
    screeningFrequency = "Screen Every 12 months";
  }

  return { riskCategory, criteria, clinicalIndicator, screeningFrequency };
}

function interpretScores(scores) {
  let interpretation = [];

  if (scores["Skin"] >= 3 && scores["Erythema"] >= 1 && scores['Temperature Hot'] >= 1) {
      interpretation.push("Infected ulcer, no complications. See physician for dressing and antibiotics.");
  }

  if (scores['Temperature Cold'] >= 1 && scores['Pedal Pulses'] >= 1 && scores['Dependent Rubor'] >= 1) {
      interpretation.push("Reduced blood supply to feet and toes. Consult primary care physician immediately.");
  }

  if ((scores['Sensation (Monofilament)'] >= 4 || scores["Ipswich"] >= 4) && scores['Sensation (Questions)'] >= 2) {
      interpretation.push("Severe neurological disease. Immediately consult physician for referral to diabetic foot surgery or peripheral neurology department.");
  }

  if (scores["Deformity"] >= 4 && (scores['Sensation (Monofilament)'] >= 4 || scores["Ipswich"] >= 4) && scores['Sensation (Questions)'] >= 2) {
      interpretation.push("Severe neurological disease and deformity. Immediately consult physician for referral to diabetic foot surgery or peripheral neurology department.");
  }

  if ((scores['Sensation (Monofilament)'] >= 4 || scores["Ipswich"] >= 4) && scores['Sensation (Questions)'] >= 2 && (scores['Temperature Cold'] >= 1 && scores['Pedal Pulses'] >= 1 && scores['Dependent Rubor'] >= 1)) {
      interpretation.push("Severe neurological disease and reduced blood supply. Immediately consult physician for referral to diabetic foot surgery or peripheral neurology department.");
  }

  if (scores["Deformity"] >= 4 && (scores['Sensation (Monofilament)'] >= 4 || scores["Ipswich"] >= 4) && scores['Temperature Cold'] >= 4 && scores['Pedal Pulses'] >= 1 && scores['Dependent Rubor'] >= 1) {
      interpretation.push("Severe neurological disease, deformity, and reduced blood supply. Immediately consult physician for referral to diabetic foot surgery or peripheral neurology department.");
  }

  if (scores["Nails"] >= 2 && scores["Erythema"] >= 1 && scores['Temperature Hot'] >= 1) {
      interpretation.push("Local infection and tissue damage. Consult physician immediately.");
  }

  if (scores["Footwear"] >= 2 && scores['Range of Motion'] >= 3) {
      interpretation.push("Watch for signs of infected callous. Consult physician if necessary.");
  }

  if (scores["Skin"]>= 3 && scores["Nails"] >= 2 && scores["Footwear"] >= 2) {
      interpretation.push("Education and proper foot care recommended.");
  }

  return interpretation;
}
function makeReport(data) {
  // Extract basic questions from the data
  const basicQuestions = {
    neurologicalDisease: data.neurologicalDisease,
    amputation: data.amputation,
    amputationCount: data.amputationCount,
    smoking: data.smoking,
    ulcer: data.ulcer,
  };
  //questionnaire answers
  const questionnaireAnswers = questionnaire(data);
  // Calculate scores for left and right feet
  // Note: Monofilament and Ipswich scores will be the same for both feet
  const leftScores = calculateScores(data, "left");
  // console.log(leftScores);
  const rightScores = calculateScores(data, "right");
  // console.log(rightScores);

  // Determine risk categories for left and right feet
  const leftRisk = determineRiskCategory(leftScores,questionnaireAnswers);
  const rightRisk = determineRiskCategory(rightScores,questionnaireAnswers);

  // Generate interpretations for left and right feet
  const leftInterpretation = interpretScores(leftScores);
  const rightInterpretation = interpretScores(rightScores);

  // Create the report object
  const report = {
    basic_questions: basicQuestions,
    left_foot: {
      scores: leftScores,
      risk_category: leftRisk.riskCategory,
      criteria: leftRisk.criteria,
      clinical_indicator: leftRisk.clinicalIndicator,
      screening_frequency: leftRisk.screeningFrequency,
      interpretation: leftInterpretation,
    },
    right_foot: {
      scores: rightScores,
      risk_category: rightRisk.riskCategory,
      criteria: rightRisk.criteria,
      clinical_indicator: rightRisk.clinicalIndicator,
      screening_frequency: rightRisk.screeningFrequency,
      interpretation: rightInterpretation,
    },
  };

  return report;
}

export { makeReport };