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
  let riskCategory = null,
    criteria = null,
    clinicalIndicator = null;

  if (
    scores.Skin >= 6 ||
    scores.Nails >= 6 ||
    scores.Deformity >= 6 ||
    scores.Footwear >= 6 ||
    scores["Temperature Hot"] >= 6 ||
    scores.Ipswich >= 6
  ) {
    riskCategory = "High Risk";
    criteria = "High scores in one or more categories";
    clinicalIndicator = "High risk of foot complications";
  } else if (
    scores["Sensation (Monofilament)"] === 0 &&
    scores["Sensation (Questions)"] === 0
  ) {
    riskCategory = "Very Low Risk (Category 0)";
    criteria = "Normal – no neuropathy";
    clinicalIndicator =
      "No loss of protective sensation (LOPS) and no peripheral arterial disease (PAD)";
  } else if (
    scores["Sensation (Monofilament)"] >= 4 ||
    scores["Sensation (Questions)"] >= 2
  ) {
    if (scores.Deformity === 0) {
      riskCategory = "Low Risk (Category 1)";
      criteria = "Loss of protective sensation (LOPS) or PAD";
      clinicalIndicator = "LOPS or PAD detected";
    } else if (scores.Deformity >= 2) {
      riskCategory = "Moderate Risk (Category 2)";
      criteria =
        "LOPS + PAD, or LOPS + foot deformity, or PAD + foot deformity";
      clinicalIndicator =
        "Presence of LOPS and PAD, or foot deformity increasing risk";
    }
  } else if (scores["Pedal Pulses"] === 1 || scores["Dependent Rubor"] === 1) {
    riskCategory = "Moderate Risk (Category 2)";
    criteria = "Peripheral arterial disease (PAD)";
    clinicalIndicator =
      "LOPS + PAD, or LOPS + foot deformity, or PAD + foot deformity";
  } else if (scores.Skin >= 2 || scores.Nails >= 2 || scores.Erythema >= 1) {
    riskCategory = "High Risk (Category 3)";
    criteria = "Previous history of ulceration or amputation";
    clinicalIndicator =
      "LOPS or PAD plus history of a foot ulcer, lower extremity amputation, or end-stage renal disease";
  } else if (scores.Deformity >= 4) {
    riskCategory = "Urgent Risk";
    criteria = "Active ulcer, infection, or Charcot";
    clinicalIndicator =
      "Immediate intervention required due to presence of ulcer or active Charcot";
  }
  return { riskCategory, criteria, clinicalIndicator };
}

function interpretScores(scores) {
  let interpretation = [];
  if (scores.Skin >= 2)
    interpretation.push("Skin score suggests heavy callus formation.");
  if (scores.Nails >= 2)
    interpretation.push(
      "Nail score suggests possible infected or damaged nails."
    );
  if (scores.Deformity >= 4)
    interpretation.push("Deformity score suggests amputation.");
  if (scores.Footwear >= 2)
    interpretation.push("Footwear is causing trauma and should be replaced.");
  if (scores["Temperature Cold"] === 1)
    interpretation.push("Cold foot indicates possible arterial disease.");
  if (scores["Temperature Hot"] === 1)
    interpretation.push("Hot foot suggests infection or Charcot changes.");
  if (scores["Range of Motion"] >= 2)
    interpretation.push("Limited or no range of motion in the hallux.");
  if (scores["Sensation (Monofilament)"] >= 4)
    interpretation.push("Loss of sensation detected.");
  if (scores["Sensation (Questions)"] >= 2)
    interpretation.push("Numbness, tingling, or burning in the feet detected.");
  if (scores["Pedal Pulses"] === 1)
    interpretation.push("Absent pedal pulse indicates arterial disease.");
  if (scores["Dependent Rubor"] === 1)
    interpretation.push(
      "Dependent rubor suggests peripheral arterial disease."
    );
  if (scores.Erythema === 1)
    interpretation.push("Erythema suggests infection or Charcot changes.");
  if (scores.Ipswich >= 2)
    interpretation.push(
      "Ipswich Touch Test indicates loss of protective sensation, increasing ulcer risk."
    );
  if (scores["Pedal Pulses"] === 1 && scores["Dependent Rubor"] === 1)
    interpretation.push(
      "Immediate referral to a vascular surgeon is recommended due to signs of arterial disease."
    );
  if (
    scores["Sensation (Monofilament)"] >= 4 ||
    scores["Sensation (Questions)"] >= 2
  )
    interpretation.push(
      "Loss of protective sensation (LOPS) detected, increasing risk of ulcers and amputation."
    );
  return interpretation;
}

function makeReport(data) {
  const scores = calculateScores(data);
  const interpretation = interpretScores(scores);
  const { riskCategory, criteria, clinicalIndicator } =
    determineRiskCategory(scores);
  return {
    scores,
    interpretation,
    riskCategory,
    criteria,
    clinicalIndicator,
  };
}

export { makeReport };
