function calculateScores(data) {
  function sumScores(fields) {
    return fields.reduce(
      (sum, field) =>
        sum + (data[field]?.left ? 1 : 0) + (data[field]?.right ? 1 : 0),
      0
    );
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
    Ipswich: data.amputation ? parseInt(data.amputationCount) || 0 : 0,
  };
}

function determineRiskCategory(scores) {
  let riskCategory, criteria, clinicalIndicator, screeningFrequency;

  if (Object.values(scores).every((v) => v >= 2)) {
    riskCategory = "Healthy Foot - Need Self Care";
    criteria = "Healthy foot, but needs self-care";
    clinicalIndicator = "Monitor for skin ulcers";
    screeningFrequency = "Every 12 months";
  } else if (
    scores["Pedal Pulses"] >= 3 &&
    scores["Dependent Rubor"] >= 3 &&
    scores.Erythema >= 3 &&
    scores["Sensation (Monofilament)"] >= 3 &&
    scores["Sensation (Questions)"] >= 3 &&
    scores.Deformity >= 3
  ) {
    riskCategory = "Low Risk - Category 1";
    criteria = "Moderate scores in arterial flow and sensation loss detected";
    clinicalIndicator = "Retest every 6 months";
    screeningFrequency = "Every 6 months";
  } else if (
    scores.Skin >= 6 &&
    scores["Temperature Hot"] >= 6 &&
    scores.Erythema >= 6
  ) {
    riskCategory = "Low Risk - Category 0";
    criteria = "Infected ulcer detected";
    clinicalIndicator = "Needs retest every 3 days";
    screeningFrequency = "Every 3 days";
  } else if (
    scores.Nails >= 6 &&
    scores["Temperature Hot"] >= 6 &&
    scores.Erythema >= 6
  ) {
    riskCategory = "Low Risk - Category 0";
    criteria = "Infected nails detected";
    clinicalIndicator = "Monitor for infection progression";
    screeningFrequency = "Every 12 months";
  } else if (
    scores["Temperature Cold"] >= 6 &&
    scores["Pedal Pulses"] >= 6 &&
    scores["Dependent Rubor"] >= 6
  ) {
    riskCategory = "Low Risk - Category 1";
    criteria = "Peripheral arterial disease detected";
    clinicalIndicator = "Monitor and consult physician";
    screeningFrequency = "Every 6 months";
  } else if (
    scores["Sensation (Monofilament)"] >= 6 &&
    scores["Sensation (Questions)"] >= 6
  ) {
    riskCategory = "Low Risk - Category 1";
    criteria = "Loss of sensation detected";
    clinicalIndicator = "Indicative of neuropathy";
    screeningFrequency = "Every 6 months";
  } else if (
    scores.Deformity >= 6 &&
    (scores["Sensation (Monofilament)"] >= 6 ||
      scores["Sensation (Questions)"] >= 6 ||
      scores["Pedal Pulses"] >= 6)
  ) {
    riskCategory = "Moderate Risk - Category 2";
    criteria = "Charcot changes detected";
    clinicalIndicator =
      "Inflammation of bones and tissues, requires monitoring";
    screeningFrequency = "Every 3 months";
  } else if (scores["Sensation (Monofilament)"] >= 6 && scores.Ipswich >= 6) {
    riskCategory = "High Risk - Category 3";
    criteria = "Neuropathy + foot ulcer history detected";
    clinicalIndicator = "High amputation risk, immediate attention required";
    screeningFrequency = "Every 1 month";
  } else if (scores["Pedal Pulses"] >= 6 && scores.Ipswich >= 6) {
    riskCategory = "High Risk - Category 3";
    criteria = "PAD + foot ulcer history detected";
    clinicalIndicator = "Urgent vascular assessment needed";
    screeningFrequency = "Every 1 month";
  } else {
    riskCategory = "Low Risk";
    criteria = "No significant issues";
    clinicalIndicator = "Minimal risk detected";
    screeningFrequency = "Every 12 months";
  }

  return { riskCategory, criteria, clinicalIndicator, screeningFrequency };
}

function interpretScores(scores) {
  let interpretation = [];
  if (scores.Skin >= 2 && scores.Nails >= 2 && scores.Footwear >= 2) {
    interpretation.push(
      "Self-care deficit detected. Foot hygiene and monitoring recommended."
    );
  }
  if (
    scores["Pedal Pulses"] >= 5 &&
    scores["Dependent Rubor"] >= 5 &&
    scores.Erythema >= 5 &&
    scores["Sensation (Monofilament)"] >= 3 &&
    scores["Sensation (Questions)"] >= 3 &&
    scores.Deformity >= 3
  ) {
    interpretation.push(
      "Slight arterial dysfunction and sensation loss detected. Retest in 6 months."
    );
  }
  if (
    scores.Skin >= 6 &&
    scores["Temperature Hot"] >= 6 &&
    scores.Erythema >= 6
  ) {
    interpretation.push(
      "Infected ulcer detected. Requires retest every 3 days."
    );
  }
  if (
    scores.Nails >= 6 &&
    scores["Temperature Hot"] >= 6 &&
    scores.Erythema >= 6
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
  if (
    scores.Deformity >= 6 &&
    (scores["Sensation (Monofilament)"] >= 6 ||
      scores["Sensation (Questions)"] >= 6 ||
      scores["Pedal Pulses"] >= 6)
  ) {
    interpretation.push(
      "Charcot changes detected. Requires orthopedic assessment."
    );
  }
  return interpretation;
}

function makeReport(data) {
  const scores = calculateScores(data);
  const interpretation = interpretScores(scores);
  const { riskCategory, criteria, clinicalIndicator, screeningFrequency } =
    determineRiskCategory(scores);

  return {
    scores,
    interpretation,
    riskCategory,
    criteria,
    clinicalIndicator,
    screeningFrequency,
  };
}

export { makeReport };
