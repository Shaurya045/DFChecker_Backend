// report.js
function calculateScores(data, side) {
  function scoreSkin() {
    if (![1, 2, 3, 4].some(i => data['skin' + i]?.[side])) return 0;
    if (data['skin4']?.[side]) return 3;
    if (data['skin3']?.[side]) return 2;
    if (data['skin1']?.[side] || data['skin2']?.[side]) return 1;
    return 0;
  }

  function scoreNails() {
    if (![1, 2, 3].some(i => data['nails' + i]?.[side])) return 0;
    if (data['nails2']?.[side] || data['nails3']?.[side]) return 2;
    if (data['nails1']?.[side]) return 1;
    return 0;
  }

  function scoreDeformity() {
    if (![1, 2, 3, 4].some(i => data['deformity' + i]?.[side])) return 0;
    if (data['deformity4']?.[side]) return 4;
    if (data['deformity3']?.[side]) return 3;
    if (data['deformity2']?.[side]) return 2;
    return 0;
  }

  function scoreFootwear() {
    if (![1, 2, 3].some(i => data['footwear' + i]?.[side])) return 0;
    if (data['footwear2']?.[side]) return 2;
    if (data['footwear1']?.[side]) return 1;
    return 0;
  }

  function scoreTemperatureCold() {
    return data['tempCold1']?.[side] || data['tempCold2']?.[side] ? 1 : 0;
  }

  function scoreTemperatureHot() {
    return data['tempHot1']?.[side] || data['tempHot2']?.[side] ? 1 : 0;
  }

  function scoreRangeOfMotion() {
    for (let i = 3; i > 0; i--) {
      if (data['motion' + i]?.[side]) return i;
    }
    return 0;
  }

  function scoreMonofilament() {
    for (let i = 1; i <= 3; i++) {
      if (data['monofilament' + i]?.[side]) return (i - 1) * 2;
    }
    return 0;
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
    if (data['ipswich']?.[side]) return 4;
    if (data['ipswich1']?.[side] || data['ipswich2']?.[side]) return 2;
    if (data['ipswich3']?.[side]) return 0;
    return 0;
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

// Function to determine risk category based on criteria
function determineRiskCategory(scores) {
  let riskCategory, criteria, clinicalIndicator, screeningFrequency;

  if (
    scores["Skin"] >= 3 &&
    scores["Erythema"] >= 1 &&
    scores["Temperature Hot"] >= 1
  ) {
    riskCategory = "Urgent Risk";
    criteria = "Active ulcer/infection/active Charcot detected";
    clinicalIndicator = "Urgent care required, immediate intervention needed";
    screeningFrequency = "Urgent care required";
  } else if (
    scores["Sensation (Monofilament)"] >= 4 ||
    scores["Ipswich"] == 4
  ) {
    riskCategory = "High Risk - Category 3";
    criteria = "Neuropathy + ulcer history detected";
    clinicalIndicator = "High amputation risk";
    screeningFrequency = "Screen every 1-3 months";
  } else if (scores["Pedal Pulses"] >= 1 && scores["Ipswich"] <= 2) {
    riskCategory = "High Risk - Category 3";
    criteria = "PAD + ulcer history detected";
    clinicalIndicator = "Urgent vascular assessment needed";
    screeningFrequency = "Screen every 1-3 months";
  } else if (
    scores["Deformity"] >= 2 &&
    (scores["Sensation (Monofilament)"] >= 2 ||
      scores["Sensation (Questions)"] >= 2 ||
      scores["Pedal Pulses"] >= 1)
  ) {
    riskCategory = "Moderate Risk - Category 2";
    criteria = "Charcot changes or moderate risk factors present";
    clinicalIndicator = "Requires close monitoring";
    screeningFrequency = "Screen every 3-6 months";
  } else if (
    scores["Sensation (Monofilament)"] >= 2 ||
    scores["Sensation (Questions)"] >= 2
  ) {
    riskCategory = "Moderate Risk - Category 2";
    criteria = "Loss of sensation detected";
    clinicalIndicator = "Indicative of neuropathy";
    screeningFrequency = "Screen every 3-6 months";
  } else if (
    scores["Temperature Cold"] >= 2 &&
    scores["Pedal Pulses"] >= 1 &&
    scores["Dependent Rubor"] >= 1
  ) {
    riskCategory = "Moderate Risk - Category 2";
    criteria = "Peripheral arterial disease detected";
    clinicalIndicator = "Monitor and consult physician";
    screeningFrequency = "Screen every 3-6 months";
  } else if (
    scores["Pedal Pulses"] >= 1 &&
    scores["Sensation (Monofilament)"] >= 2 &&
    scores["Sensation (Questions)"] >= 2
  ) {
    riskCategory = "Low Risk - Category 1";
    criteria = "Mild arterial flow dysfunction & sensation loss";
    clinicalIndicator = "Retest every 6 months";
    screeningFrequency = "Screen every 6-12 months";
  } else if (scores["Nails"] >= 2 || scores["Skin"] >= 2) {
    riskCategory = "Low Risk - Category 1";
    criteria = "Mild infection risk detected";
    clinicalIndicator = "Monitor for progression";
    screeningFrequency = "Screen every 6-12 months";
  } else if (
    scores["Skin"] >= 2 &&
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

// Function to interpret scores
function interpretScores(scores) {
  let interpretation = [];

  // Urgent Risk: Active ulcer, infection, or Charcot foot
  if (
    scores["Skin"] >= 3 &&
    scores["Erythema"] >= 1 &&
    scores["Temperature Hot"] >= 1
  ) {
    interpretation.push(
      "Urgent condition detected: Possible active ulcer, infection, or Charcot foot. Immediate intervention required."
    );
  }

  // High Risk - Category 3: Neuropathy and ulcer history
  if (scores["Sensation (Monofilament)"] >= 4 && scores["Ipswich"] == 4) {
    interpretation.push(
      "High risk: Neuropathy with ulcer history. High amputation risk. Requires urgent specialist review."
    );
  }

  // High Risk - Category 3: Peripheral Arterial Disease (PAD) and ulcer history
  if (scores["Pedal Pulses"] >= 1 && scores["Ipswich"] <= 2) {
    interpretation.push(
      "High risk: Peripheral arterial disease with ulcer history detected. Urgent vascular assessment required."
    );
  }

  // Moderate Risk - Category 2: Charcot changes or multiple risk factors
  if (
    scores["Deformity"] >= 2 &&
    (scores["Sensation (Monofilament)"] >= 2 ||
      scores["Sensation (Questions)"] >= 2 ||
      scores["Pedal Pulses"] >= 1)
  ) {
    interpretation.push(
      "Moderate risk: Deformity detected with neuropathy or vascular concerns. Close monitoring required."
    );
  }

  // Moderate Risk - Category 2: Loss of sensation (Neuropathy)
  if (
    scores["Sensation (Monofilament)"] >= 2 ||
    scores["Sensation (Questions)"] >= 2
  ) {
    interpretation.push(
      "Moderate risk: Loss of sensation detected, indicating neuropathy. Routine podiatric assessment advised."
    );
  }

  // Moderate Risk - Category 2: Peripheral Arterial Disease (PAD)
  if (
    scores["Temperature Cold"] >= 2 &&
    scores["Pedal Pulses"] >= 1 &&
    scores["Dependent Rubor"] >= 1
  ) {
    interpretation.push(
      "Moderate risk: Signs of peripheral arterial disease. Regular monitoring and physician consultation recommended."
    );
  }

  // Low Risk - Category 1: Mild arterial flow dysfunction & sensation loss
  if (
    scores["Pedal Pulses"] >= 1 &&
    scores["Sensation (Monofilament)"] >= 2 &&
    scores["Sensation (Questions)"] >= 2
  ) {
    interpretation.push(
      "Low risk: Mild arterial flow dysfunction and early signs of neuropathy. Retest in 6 months."
    );
  }

  // Low Risk - Category 1: Mild infection risk (skin or nails)
  if (scores["Nails"] >= 2 || scores["Skin"] >= 2) {
    interpretation.push(
      "Low risk: Possible mild infection or fungal issues. Monitor for progression."
    );
  }

  // Healthy Foot - Need Self Care
  if (scores["Skin"] >= 2 && scores["Nails"] >= 2 && scores["Footwear"] >= 2) {
    interpretation.push(
      "Healthy foot, but self-care is needed. Maintain hygiene and monitor for changes."
    );
  }

  // Very Low Risk - Category 0: Normal foot
  if (interpretation.length === 0) {
    interpretation.push(
      "Minimal risk detected. No significant neuropathy or vascular issues."
    );
  }

  return interpretation;
}

// Function to generate the final report
function makeReport(data) {
  // Extract basic questions from the data
  const basicQuestions = {
    neurologicalDisease: data.neurologicalDisease,
    amputation: data.amputation,
    amputationCount: data.amputationCount,
    smoking: data.smoking,
    ulcer: data.ulcer,
  };

  // Calculate scores for left and right feet
  const leftScores = calculateScores(data, "left");
  const rightScores = calculateScores(data, "right");

  // Determine risk categories for left and right feet
  const leftRisk = determineRiskCategory(leftScores);
  const rightRisk = determineRiskCategory(rightScores);

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

// Export the makeReport function
export { makeReport };