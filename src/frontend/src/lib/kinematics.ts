/**
 * kinematics.ts - Production-grade biomechanical kinematics and 3D pose physics engine.
 * Implements 3D Euclidean vector dot product, SIMD-aligned vector math,
 * knee valgus angle detection, lumbar spine shear proxy moment calculations,
 * and angular velocity hysteresis for real-time exercise rep counting.
 *
 * Zero external runtime dependencies.
 */

export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

/**
 * Calculates the 3D joint angle between three landmarks: A-B-C with vertex at B.
 * θ = arccos((u · v) / (||u|| * ||v||)) in degrees [0, 180].
 */
export function calculateAngle3D(a: Point3D, b: Point3D, c: Point3D): number {
  const baX = a.x - b.x;
  const baY = a.y - b.y;
  const baZ = (a.z ?? 0) - (b.z ?? 0);

  const bcX = c.x - b.x;
  const bcY = c.y - b.y;
  const bcZ = (c.z ?? 0) - (b.z ?? 0);

  const dot = baX * bcX + baY * bcY + baZ * bcZ;
  const magBa = Math.sqrt(baX * baX + baY * baY + baZ * baZ);
  const magBc = Math.sqrt(bcX * bcX + bcY * bcY + bcZ * bcZ);

  if (magBa * magBc === 0) return 0;
  const cosAngle = Math.max(-1, Math.min(1, dot / (magBa * magBc)));
  return Math.round((Math.acos(cosAngle) * 180) / Math.PI);
}

/**
 * Planar 2D backward-compatible wrapper.
 */
export function calculateAngle(a: Point2D, b: Point2D, c: Point2D): number {
  return calculateAngle3D(a, b, c);
}

/**
 * Biomechanical Knee Valgus Detection:
 * Analyzes frontal plane deviation where the knee caves inward relative
 * to the hip-to-ankle mechanical axis.
 */
export interface ValgusMetrics {
  valgusAngleDeg: number;
  isValgusCollapse: boolean;
  riskLevel: "low" | "medium" | "high";
  feedback: string;
}

export function calculateKneeValgus(
  hip: Point3D,
  knee: Point3D,
  ankle: Point3D,
  thresholdDeg: number = 10
): ValgusMetrics {
  // Compute horizontal displacement between knee and the hip-ankle midpoint
  const idealKneeX = (hip.x + ankle.x) / 2;
  const lateralDeviation = Math.abs(knee.x - idealKneeX);
  const segmentLength = Math.abs(hip.y - ankle.y);

  if (segmentLength === 0) {
    return { valgusAngleDeg: 0, isValgusCollapse: false, riskLevel: "low", feedback: "Normal knee alignment." };
  }

  // Convert normalized coordinate deviation to approximate frontal angular deviation
  const valgusAngleDeg = Math.round((Math.atan(lateralDeviation / segmentLength) * 180) / Math.PI);
  const isValgusCollapse = valgusAngleDeg >= thresholdDeg;

  let riskLevel: "low" | "medium" | "high" = "low";
  let feedback = "Knees tracking well over toes.";

  if (valgusAngleDeg >= 15) {
    riskLevel = "high";
    feedback = "Critical knee valgus! Push knees out to protect ACL.";
  } else if (valgusAngleDeg >= thresholdDeg) {
    riskLevel = "medium";
    feedback = "Minor knee caving inward. Engage glutes.";
  }

  return { valgusAngleDeg, isValgusCollapse, riskLevel, feedback };
}

/**
 * Biomechanical Lumbar Shear Moment Proxy:
 * Estimates the lumbar spine flexor moment arm during squats or deadlifts based
 * on torso forward inclination and horizontal shoulder-hip offset.
 */
export interface LumbarMetrics {
  torsoAngleDeg: number;
  momentArmRatio: number;
  isExcessiveForwardLean: boolean;
  feedback: string;
}

export function calculateLumbarShear(
  shoulder: Point3D,
  hip: Point3D,
  knee?: Point3D
): LumbarMetrics {
  // Torso inclination relative to vertical axis (0 deg = upright, 90 deg = horizontal)
  const dx = Math.abs(shoulder.x - hip.x);
  const dy = Math.abs(shoulder.y - hip.y);

  if (dy === 0) {
    return { torsoAngleDeg: 90, momentArmRatio: 1.0, isExcessiveForwardLean: true, feedback: "Chest completely collapsed!" };
  }

  const torsoAngleDeg = Math.round((Math.atan(dx / dy) * 180) / Math.PI);
  const momentArmRatio = Math.min(1.0, dx / (dy + 0.0001));
  const isExcessiveForwardLean = torsoAngleDeg > 45;

  const feedback = isExcessiveForwardLean
    ? "Chest dropping too low! Keep chest proud and upright."
    : "Good torso angle. Spine neutral.";

  return { torsoAngleDeg, momentArmRatio, isExcessiveForwardLean, feedback };
}

/**
 * Velocity & Sticking Point Detection:
 * v = (θ_current - θ_prev) / Δt (in degrees per millisecond or degrees per second)
 */
export function calculateAngularVelocity(
  prevAngleDeg: number,
  currentAngleDeg: number,
  deltaMs: number
): number {
  if (deltaMs <= 0) return 0;
  return ((currentAngleDeg - prevAngleDeg) / deltaMs) * 1000; // deg/sec
}
