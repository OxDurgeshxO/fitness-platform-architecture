import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  calculateJointAngle,
  calculateTrunkTilt,
  calculateKneeValgusIndex
} from "../packages/cv/src/angles.js";

describe("Biomechanical Angle Calculations", () => {
  it("calculates exact 90-degree right angle", () => {
    // A=(0, 1), B=(0, 0), C=(1, 0)
    const angle = calculateJointAngle(
      { x: 0, y: 1, z: 0 },
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 }
    );
    assert.equal(angle, 90.0);
  });

  it("calculates straight 180-degree angle for full standing lockout", () => {
    // A=(0, 1), B=(0, 0), C=(0, -1)
    const angle = calculateJointAngle(
      { x: 0, y: 1, z: 0 },
      { x: 0, y: 0, z: 0 },
      { x: 0, y: -1, z: 0 }
    );
    assert.equal(angle, 180.0);
  });

  it("calculates acute 45-degree angle correctly", () => {
    const angle = calculateJointAngle(
      { x: 1, y: 1, z: 0 },
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 }
    );
    assert.equal(angle, 45.0);
  });

  it("calculates trunk tilt relative to vertical gravity vector", () => {
    // Upright: shoulder directly above hip
    const uprightTilt = calculateTrunkTilt(
      { x: 0.5, y: 0.2 },
      { x: 0.5, y: 0.6 }
    );
    assert.equal(uprightTilt, 0.0);

    // 45-degree forward torso lean (dx = 0.4, dy = 0.4)
    const leaningTilt = calculateTrunkTilt(
      { x: 0.9, y: 0.2 },
      { x: 0.5, y: 0.6 }
    );
    assert.equal(leaningTilt, 45.0);
  });

  it("computes knee valgus ratio and detects medial collapse", () => {
    // Normal alignment: knee distance equals ankle distance (ratio 1.0)
    const normalRatio = calculateKneeValgusIndex(
      { x: 0.4, y: 0.5 },
      { x: 0.6, y: 0.5 },
      { x: 0.4, y: 0.8 },
      { x: 0.6, y: 0.8 }
    );
    assert.equal(normalRatio, 1.0);

    // Valgus collapse: knees cave inward (kneeDist = 0.12, ankleDist = 0.20 -> ratio 0.60)
    const valgusRatio = calculateKneeValgusIndex(
      { x: 0.44, y: 0.5 },
      { x: 0.56, y: 0.5 },
      { x: 0.40, y: 0.8 },
      { x: 0.60, y: 0.8 }
    );
    assert.equal(valgusRatio, 0.60);
    assert.ok(valgusRatio < 0.82, "Valgus ratio correctly falls below threshold of 0.82");
  });
});
