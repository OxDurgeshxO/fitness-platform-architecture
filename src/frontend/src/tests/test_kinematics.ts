/**
 * test_kinematics.ts - Direct test for client-side kinematics angle computation,
 * 3D vector math, knee valgus detection, and lumbar shear moment models.
 */

import {
  calculateAngle,
  calculateAngle3D,
  calculateKneeValgus,
  calculateLumbarShear,
  calculateAngularVelocity,
} from "../lib/kinematics.ts";

function testKinematics() {
  console.log("=== TESTING CLIENT-SIDE POSE KINEMATICS & BIOMECHANICS ===");

  // 1. Planar 2D Right angle
  const hip2d = { x: 0, y: 1 };
  const knee2d = { x: 0, y: 0 };
  const ankle2d = { x: 1, y: 0 };
  const angle2d = calculateAngle(hip2d, knee2d, ankle2d);
  console.log(`2D Right Angle Test: ${angle2d} deg (expected 90)`);
  if (angle2d !== 90) throw new Error(`Expected 90, got ${angle2d}`);

  // 2. 3D Euclidean Vector Angle Test
  const a3d = { x: 0, y: 1, z: 0 };
  const b3d = { x: 0, y: 0, z: 0 };
  const c3d = { x: 0, y: 0, z: 1 };
  const angle3d = calculateAngle3D(a3d, b3d, c3d);
  console.log(`3D Orthogonal Vector Test: ${angle3d} deg (expected 90)`);
  if (angle3d !== 90) throw new Error(`Expected 90, got ${angle3d}`);

  // 3. Knee Valgus Inward Collapse Detection
  const normalHip = { x: 0.5, y: 0.3, z: 0 };
  const normalKnee = { x: 0.5, y: 0.6, z: 0 };
  const normalAnkle = { x: 0.5, y: 0.9, z: 0 };
  const normalValgus = calculateKneeValgus(normalHip, normalKnee, normalAnkle);
  console.log(`Normal Knee Alignment: Valgus=${normalValgus.valgusAngleDeg} deg, Collapse=${normalValgus.isValgusCollapse}`);
  if (normalValgus.isValgusCollapse) throw new Error("Normal knee incorrectly flagged as collapse");

  const collapsedKnee = { x: 0.62, y: 0.6, z: 0 }; // Knee caves 12% laterally
  const collapseValgus = calculateKneeValgus(normalHip, collapsedKnee, normalAnkle);
  console.log(`Valgus Collapse Test: Valgus=${collapseValgus.valgusAngleDeg} deg, Collapse=${collapseValgus.isValgusCollapse}`);
  if (!collapseValgus.isValgusCollapse) throw new Error("Valgus collapse was not detected");

  // 4. Lumbar Shear Moment Proxy
  const uprightShoulder = { x: 0.5, y: 0.2 };
  const uprightHip = { x: 0.5, y: 0.5 };
  const neutralLumbar = calculateLumbarShear(uprightShoulder, uprightHip);
  console.log(`Upright Torso Lean: ${neutralLumbar.torsoAngleDeg} deg, Excessive=${neutralLumbar.isExcessiveForwardLean}`);
  if (neutralLumbar.isExcessiveForwardLean) throw new Error("Upright posture flagged as excessive lean");

  const collapsedShoulder = { x: 0.85, y: 0.4 }; // Heavy forward pitch
  const excessiveLumbar = calculateLumbarShear(collapsedShoulder, uprightHip);
  console.log(`Collapsed Torso Lean: ${excessiveLumbar.torsoAngleDeg} deg, Excessive=${excessiveLumbar.isExcessiveForwardLean}`);
  if (!excessiveLumbar.isExcessiveForwardLean) throw new Error("Chest drop was not detected");

  // 5. Angular Velocity
  const velocity = calculateAngularVelocity(180, 90, 500); // 90 deg change in 500ms
  console.log(`Angular Velocity: ${velocity} deg/sec (expected -180)`);
  if (velocity !== -180) throw new Error(`Expected -180, got ${velocity}`);

  console.log("=== CLIENT KINEMATICS & BIOMECHANICS TESTS PASSED (100% OK) ===");
}

testKinematics();
