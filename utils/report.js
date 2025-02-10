function calculateScores(data, side) {
  function sumScores(fields) {
    return fields.reduce((sum, field) => {
      // Check if the field exists and has a value for the specified side
      if (data[field] && data[field][side] === true) {
        return sum + 1; // Add 1 for each true value
      }
      return sum;
    }, 0);
  }

  return {
    Skin: sumScores(["skin1", "skin2", "skin3", "skin4"]),
    Nails: sumScores(["nails1", "nails2", "nails3"]),
    Deformity: sumScores(["deformity1", "deformity2", "deformity3"]),
    Footwear: sumScores(["footwear1", "footwear2", "footwear3"]),
    "Temperature Cold": sumScores(["tempCold1", "tempCold2"]),
    "Temperature Hot": sumScores(["tempHot1", "tempHot2"]),
    "Range of Motion": sumScores(["motion1", "motion2", "motion3", "motion4"]),
    "Sensation (Monofilament)": sumScores([
      "monofilament1",
      "monofilament2",
      "monofilament3",
    ]),
    "Sensation (Questions)": sumScores([
      "sensation1",
      "sensation2",
      "sensation3",
      "sensation4",
    ]),
    "Pedal Pulses": sumScores(["pedal"]),
    "Dependent Rubor": sumScores(["rubor"]),
    Erythema: sumScores(["erythema"]),
    Ipswich: sumScores(["ipswich"]),
  };
}

// Function to determine risk category based on criteria
function determineRiskCategory(scores) {
  let riskCategory, criteria, clinicalIndicator, screeningFrequency;

  if (
    scores["Skin"] >= 8 &&
    scores["Erythema"] >= 8 &&
    scores["Temperature Hot"] >= 8
  ) {
    riskCategory = "Urgent Risk";
    criteria = "Active ulcer/infection/active Charcot detected";
    clinicalIndicator = "Urgent care required, immediate intervention needed";
    screeningFrequency = "Urgent care required";
  } else if (
    scores["Sensation (Monofilament)"] >= 5 &&
    scores["Ipswich"] >= 5
  ) {
    riskCategory = "High Risk - Category 3";
    criteria = "Neuropathy + ulcer history detected";
    clinicalIndicator = "High amputation risk";
    screeningFrequency = "Screen every 1-3 months";
  } else if (scores["Pedal Pulses"] >= 5 && scores["Ipswich"] >= 5) {
    riskCategory = "High Risk - Category 3";
    criteria = "PAD + ulcer history detected";
    clinicalIndicator = "Urgent vascular assessment needed";
    screeningFrequency = "Screen every 1-3 months";
  } else if (
    scores["Deformity"] >= 4 &&
    (scores["Sensation (Monofilament)"] >= 4 ||
      scores["Sensation (Questions)"] >= 4 ||
      scores["Pedal Pulses"] >= 4)
  ) {
    riskCategory = "Moderate Risk - Category 2";
    criteria = "Charcot changes or moderate risk factors present";
    clinicalIndicator = "Requires close monitoring";
    screeningFrequency = "Screen every 3-6 months";
  } else if (
    scores["Sensation (Monofilament)"] >= 4 ||
    scores["Sensation (Questions)"] >= 4
  ) {
    riskCategory = "Moderate Risk - Category 2";
    criteria = "Loss of sensation detected";
    clinicalIndicator = "Indicative of neuropathy";
    screeningFrequency = "Screen every 3-6 months";
  } else if (
    scores["Temperature Cold"] >= 5 &&
    scores["Pedal Pulses"] >= 4 &&
    scores["Dependent Rubor"] >= 4
  ) {
    riskCategory = "Moderate Risk - Category 2";
    criteria = "Peripheral arterial disease detected";
    clinicalIndicator = "Monitor and consult physician";
    screeningFrequency = "Screen every 3-6 months";
  } else if (
    scores["Pedal Pulses"] >= 3 &&
    scores["Sensation (Monofilament)"] >= 3 &&
    scores["Sensation (Questions)"] >= 3
  ) {
    riskCategory = "Low Risk - Category 1";
    criteria = "Mild arterial flow dysfunction & sensation loss";
    clinicalIndicator = "Retest every 6 months";
    screeningFrequency = "Screen every 6-12 months";
  } else if (scores["Nails"] >= 5 || scores["Skin"] >= 5) {
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

  if (scores["Skin"] >= 2 && scores["Nails"] >= 2 && scores["Footwear"] >= 2) {
    interpretation.push(
      "Self-care deficit detected. Foot hygiene and monitoring recommended."
    );
  }
  if (
    scores["Pedal Pulses"] >= 5 &&
    scores["Dependent Rubor"] >= 5 &&
    scores["Erythema"] >= 5
  ) {
    interpretation.push(
      "Slight arterial dysfunction and sensation loss detected. Retest in 6 months."
    );
  }
  if (
    scores["Skin"] >= 6 &&
    scores["Temperature Hot"] >= 6 &&
    scores["Erythema"] >= 6
  ) {
    interpretation.push(
      "Infected ulcer detected. Requires retest every 3 days."
    );
  }
  if (
    scores["Nails"] >= 6 &&
    scores["Temperature Hot"] >= 6 &&
    scores["Erythema"] >= 6
  ) {
    interpretation.push(
      "Infected nails detected. Watch for redness and tissue damage."
    );
  }
  if (
    scores["Temperature Cold"] >= 6 &&
    scores["Pedal Pulses"] >= 6 &&
    scores["Dependent Rubor"] >= 6
  ) {
    interpretation.push(
      "Peripheral arterial disease detected. Consult physician immediately."
    );
  }
  if (
    scores["Sensation (Monofilament)"] >= 6 &&
    scores["Sensation (Questions)"] >= 6
  ) {
    interpretation.push(
      "Loss of sensation detected. Referral to neurology needed."
    );
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
    basic_questions: basicQuestions, // Add basic questions to the report
    left_foot: {
      scores: leftScores,
      risk_category: leftRisk.riskCategory,
      criteria: leftRisk.criteria,
      clinical_indicator: leftRisk.clinicalIndicator,
      screening_frequency: leftRisk.screeningFrequency,
      interpretation: leftInterpretation, // Add interpretation for left foot
    },
    right_foot: {
      scores: rightScores,
      risk_category: rightRisk.riskCategory,
      criteria: rightRisk.criteria,
      clinical_indicator: rightRisk.clinicalIndicator,
      screening_frequency: rightRisk.screeningFrequency,
      interpretation: rightInterpretation, // Add interpretation for right foot
    },
  };

  return report;
}

export { makeReport };
