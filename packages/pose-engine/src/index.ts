export * from "./angles.js";
export * from "./rep_counter.js";

export interface ValgusResult {
  valgusAngleDeg: number;
  isValgusCollapse: boolean;
  riskLevel: "low" | "medium" | "high";
  feedback: string;
}

export function calculateKneeValgus(
  hip: { x: number; y: number },
  knee: { x: number; y: number },
  ankle: { x: number; y: number },
  thresholdDeg = 10
): ValgusResult {
  const idealKneeX = (hip.x + ankle.x) / 2;
  const lateralDeviation = Math.abs(knee.x - idealKneeX);
  const segmentLength = Math.abs(hip.y - ankle.y);

  if (segmentLength === 0) {
    return { valgusAngleDeg: 0, isValgusCollapse: false, riskLevel: "low", feedback: "Normal knee alignment." };
  }

  const valgusAngleDeg = Math.round((Math.atan(lateralDeviation / segmentLength) * 180) / Math.PI);
  const isValgusCollapse = valgusAngleDeg >= thresholdDeg;

  let riskLevel: "low" | "medium" | "high" = "low";
  let feedback = "Knees tracking well over toes.";

  if (valgusAngleDeg >= 15) {
    riskLevel = "high";
    feedback = "Critical knee valgus! Push knees outward.";
  } else if (valgusAngleDeg >= thresholdDeg) {
    riskLevel = "medium";
    feedback = "Minor knee caving inward.";
  }

  return { valgusAngleDeg, isValgusCollapse, riskLevel, feedback };
}

export function calculateLumbarShear(
  shoulder: { x: number; y: number },
  hip: { x: number; y: number }
): { torsoAngleDeg: number; isExcessiveForwardLean: boolean; feedback: string } {
  const dx = Math.abs(shoulder.x - hip.x);
  const dy = Math.abs(shoulder.y - hip.y);

  if (dy === 0) {
    return { torsoAngleDeg: 90, isExcessiveForwardLean: true, feedback: "Chest collapsed." };
  }

  const torsoAngleDeg = Math.round((Math.atan(dx / dy) * 180) / Math.PI);
  const isExcessiveForwardLean = torsoAngleDeg > 45;

  return {
    torsoAngleDeg,
    isExcessiveForwardLean,
    feedback: isExcessiveForwardLean ? "Chest dropping too low." : "Spine neutral.",
  };
}
