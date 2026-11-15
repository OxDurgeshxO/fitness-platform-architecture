export interface Point3D {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

/**
 * Calculates angle ABC in degrees where B is the joint vertex.
 */
export function calculateJointAngle(a: Point3D, b: Point3D, c: Point3D): number {
  const abX = a.x - b.x;
  const abY = a.y - b.y;
  const abZ = (a.z ?? 0) - (b.z ?? 0);

  const cbX = c.x - b.x;
  const cbY = c.y - b.y;
  const cbZ = (c.z ?? 0) - (b.z ?? 0);

  const dotProduct = abX * cbX + abY * cbY + abZ * cbZ;
  const magAB = Math.sqrt(abX * abX + abY * abY + abZ * abZ);
  const magCB = Math.sqrt(cbX * cbX + cbY * cbY + cbZ * cbZ);

  if (magAB === 0 || magCB === 0) return 180;

  let cosTheta = dotProduct / (magAB * magCB);
  // Clamp between -1 and 1 to prevent NaN from floating point inaccuracies
  cosTheta = Math.max(-1, Math.min(1, cosTheta));

  const radians = Math.acos(cosTheta);
  return Number(((radians * 180) / Math.PI).toFixed(1));
}

/**
 * Calculates trunk tilt relative to vertical (0 degrees = standing upright).
 */
export function calculateTrunkTilt(shoulder: Point3D, hip: Point3D): number {
  const dx = shoulder.x - hip.x;
  const dy = shoulder.y - hip.y;
  const angleRad = Math.atan2(Math.abs(dx), Math.abs(dy));
  return Number(((angleRad * 180) / Math.PI).toFixed(1));
}

/**
 * Calculates Knee Valgus Index (ratio of knee distance to ankle distance).
 * Ratio < 0.82 indicates inward knee cave (valgus collapse).
 */
export function calculateKneeValgusIndex(
  leftKnee: Point3D,
  rightKnee: Point3D,
  leftAnkle: Point3D,
  rightAnkle: Point3D
): number {
  const kneeDist = Math.abs(leftKnee.x - rightKnee.x);
  const ankleDist = Math.abs(leftAnkle.x - rightAnkle.x);
  if (ankleDist === 0) return 1.0;
  return Number((kneeDist / ankleDist).toFixed(2));
}
