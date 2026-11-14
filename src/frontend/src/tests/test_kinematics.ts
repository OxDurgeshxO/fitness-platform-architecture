/**
 * test_kinematics.ts - Direct test for client-side kinematics angle computation and state transitions.
 */

import { calculateAngle } from "../lib/kinematics.ts";

function testKinematics() {
  console.log("=== TESTING CLIENT-SIDE POSE KINEMATICS ===");

  // 1. Right angle
  const hip = { x: 0, y: 1 };
  const knee = { x: 0, y: 0 };
  const ankle = { x: 1, y: 0 };
  const angle = calculateAngle(hip, knee, ankle);
  console.log(`Right Angle Test: ${angle} deg (expected 90)`);
  if (angle !== 90) throw new Error(`Expected 90, got ${angle}`);

  // 2. Straight line
  const s1 = { x: -1, y: 0 };
  const s2 = { x: 0, y: 0 };
  const s3 = { x: 1, y: 0 };
  const straight = calculateAngle(s1, s2, s3);
  console.log(`Straight Line Test: ${straight} deg (expected 180)`);
  if (straight !== 180) throw new Error(`Expected 180, got ${straight}`);

  console.log("=== CLIENT KINEMATICS TESTS PASSED (100% OK) ===");
}

testKinematics();
