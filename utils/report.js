const calculateScores = (data) => {
  return {
    Skin: (data.skin1?.left ? 1 : 0) + (data.skin3?.left ? 1 : 0),
    Nails: (data.nails1?.left ? 1 : 0) + (data.nails3?.right ? 1 : 0),
    Deformity: data.amputation ? parseInt(data.amputationCount) || 0 : 0,
    Footwear: data.footwear2?.left ? 1 : 0,
    "Temperature Cold": data.tempCold1?.right ? 1 : 0,
    "Temperature Hot": data.tempHot1?.right ? 1 : 0,
    "Range of Motion": data.motion2?.left ? 1 : 0,
    "Sensation (Monofilament)": data.neurologicalDisease ? 4 : 0,
    "Sensation (Questions)": data.ulcer ? 2 : 0,
    "Pedal Pulses": data.pedal?.left ? 1 : 0,
    "Dependent Rubor": data.rubor?.right ? 1 : 0,
    Erythema: data.erythema?.right ? 1 : 0,
  };
};

const determineRiskCategory = (scores) => {
  let riskCategory = null;
  let criteria = null;
  let clinicalIndicator = null;

  if (
    scores["Sensation (Monofilament)"] === 0 &&
    scores["Sensation (Questions)"] === 0
  ) {
    riskCategory = "Very Low Risk (Category 0)";
    criteria = "Normal – no neuropathy";
    clinicalIndicator = "No loss of protective sensation (LOPS) and no PAD";
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
      "LOPS or PAD plus history of ulcer, amputation, or end-stage renal disease";
  } else if (scores.Deformity >= 4) {
    riskCategory = "Urgent Risk";
    criteria = "Active ulcer, infection, or Charcot";
    clinicalIndicator =
      "Immediate intervention required due to ulcer or active Charcot";
  }

  return { riskCategory, criteria, clinicalIndicator };
};

const interpretScores = (scores) => {
  let interpretation = [];

  if (scores.Skin >= 2) interpretation.push("Heavy callus formation detected.");
  if (scores.Nails >= 2)
    interpretation.push("Possible infected or damaged nails detected.");
  if (scores.Deformity >= 4)
    interpretation.push("Deformity score suggests amputation.");
  if (scores.Footwear >= 2)
    interpretation.push("Footwear causing trauma; replacement advised.");
  if (scores["Temperature Cold"] === 1)
    interpretation.push("Cold foot suggests arterial disease.");
  if (scores["Temperature Hot"] === 1)
    interpretation.push("Hot foot suggests infection or Charcot changes.");
  if (scores["Range of Motion"] >= 2)
    interpretation.push("Limited range of motion in the hallux.");
  if (scores["Sensation (Monofilament)"] >= 4)
    interpretation.push("Loss of sensation detected.");
  if (scores["Sensation (Questions)"] >= 2)
    interpretation.push("Numbness, tingling, or burning detected.");
  if (scores["Pedal Pulses"] === 1)
    interpretation.push("Absent pedal pulse indicates arterial disease.");
  if (scores["Dependent Rubor"] === 1)
    interpretation.push("Peripheral arterial disease suspected.");
  if (scores.Erythema === 1)
    interpretation.push("Erythema suggests infection or Charcot changes.");

  if (scores["Pedal Pulses"] === 1 && scores["Dependent Rubor"] === 1) {
    interpretation.push("Immediate vascular surgeon referral recommended.");
  }
  if (
    scores["Sensation (Monofilament)"] >= 4 ||
    scores["Sensation (Questions)"] >= 2
  ) {
    interpretation.push(
      "LOPS detected, increasing risk of ulcers and amputation."
    );
  }

  return interpretation;
};

const makeReport = (data) => {
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
};

export { makeReport };
