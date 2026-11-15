import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { SquatRepCounter, SquatKeypoints } from "../packages/cv/src/squat_fsm.js";

function createSquatKeypoints(
  kneeAngleDeg: number,
  options?: { valgusRatio?: number; trunkTiltDeg?: number }
): SquatKeypoints {
  const rad = ((180 - kneeAngleDeg) * Math.PI) / 180;
  const legLength = 0.3;
  const torsoLength = 0.2;

  const trunkDeg = options?.trunkTiltDeg ?? 10;
  const trunkRad = (trunkDeg * Math.PI) / 180;
  const shoulderDx = torsoLength * Math.sin(trunkRad);
  const shoulderDy = torsoLength * Math.cos(trunkRad);

  const valgus = options?.valgusRatio ?? 1.0;
  const ankleHalfWidth = 0.2;
  const kneeHalfWidth = ankleHalfWidth * valgus;

  const leftKneeX = 0.5 - kneeHalfWidth;
  const rightKneeX = 0.5 + kneeHalfWidth;
  const kneeY = 0.5;

  const hipY = 0.2;
  const leftHipX = leftKneeX;
  const rightHipX = rightKneeX;

  const ankleY = kneeY + legLength * Math.cos(rad);
  const ankleZ = legLength * Math.sin(rad);

  const leftAnkleX = 0.5 - ankleHalfWidth;
  const rightAnkleX = 0.5 + ankleHalfWidth;

  return {
    leftShoulder: { x: leftHipX + shoulderDx, y: hipY - shoulderDy, z: 0 },
    rightShoulder: { x: rightHipX + shoulderDx, y: hipY - shoulderDy, z: 0 },
    leftHip: { x: leftHipX, y: hipY, z: 0 },
    rightHip: { x: rightHipX, y: hipY, z: 0 },
    leftKnee: { x: leftKneeX, y: kneeY, z: 0 },
    rightKnee: { x: rightKneeX, y: kneeY, z: 0 },
    leftAnkle: { x: leftAnkleX, y: ankleY, z: ankleZ },
    rightAnkle: { x: rightAnkleX, y: ankleY, z: ankleZ }
  };
}

describe("SquatRepCounter Biomechanical FSM", () => {
  let counter: SquatRepCounter;

  beforeEach(() => {
    counter = new SquatRepCounter();
  });

  it("initializes in standing state with zero reps", () => {
    assert.equal(counter.getRepCount(), 0);
    assert.equal(counter.getState(), "standing");
  });

  it("successfully counts a complete, deep squat repetition", () => {
    let t = 1000;
    // 1. Standing posture (165 deg)
    counter.processFrame(createSquatKeypoints(165), t);
    assert.equal(counter.getState(), "standing");

    // 2. Begin descent (140 deg)
    t += 300;
    const descResult = counter.processFrame(createSquatKeypoints(140), t);
    assert.equal(descResult.state, "descending");

    // 3. Reach below parallel depth (88 deg)
    t += 600;
    const inflectResult = counter.processFrame(createSquatKeypoints(88), t);
    assert.equal(inflectResult.state, "inflection");

    // 4. Drive upward ascending (120 deg)
    t += 500;
    const ascResult = counter.processFrame(createSquatKeypoints(120), t);
    assert.equal(ascResult.state, "ascending");

    // 5. Lockout standing (160 deg)
    t += 400;
    const finalResult = counter.processFrame(createSquatKeypoints(160), t);
    assert.equal(finalResult.state, "standing");
    assert.equal(counter.getRepCount(), 1);
    assert.ok(finalResult.completedRep);
    assert.equal(finalResult.completedRep.isValidDepth, true);
    assert.equal(finalResult.completedRep.repNumber, 1);
  });

  it("detects and flags shallow squat depth without crediting valid depth", () => {
    let t = 1000;
    // 1. Standing (165 deg)
    counter.processFrame(createSquatKeypoints(165), t);

    // 2. Descending (140 deg)
    t += 300;
    counter.processFrame(createSquatKeypoints(140), t);

    // 3. Turn around early at shallow depth (115 deg - fails 95 deg threshold)
    t += 400;
    counter.processFrame(createSquatKeypoints(115), t);

    // 4. Reverse up early (130 deg -> triggers shallow depth issue)
    t += 300;
    const shallowResult = counter.processFrame(createSquatKeypoints(130), t);
    assert.ok(shallowResult.newIssue);
    assert.equal(shallowResult.newIssue?.issue, "shallow_depth");

    // 5. Stand up
    t += 400;
    const repEnd = counter.processFrame(createSquatKeypoints(160), t);
    assert.equal(counter.getRepCount(), 1);
    assert.ok(repEnd.completedRep);
    assert.equal(repEnd.completedRep.isValidDepth, false);
    assert.ok(repEnd.completedRep.formScore < 100);
  });

  it("detects dynamic knee valgus collapse during descent", () => {
    let t = 1000;
    counter.processFrame(createSquatKeypoints(165), t);

    t += 300;
    counter.processFrame(createSquatKeypoints(140), t);

    // Knee valgus index 0.65 (< 0.82 threshold)
    t += 300;
    const valgusResult = counter.processFrame(createSquatKeypoints(100, { valgusRatio: 0.65 }), t);
    assert.ok(valgusResult.newIssue);
    assert.equal(valgusResult.newIssue?.issue, "knee_valgus");
    assert.match(valgusResult.newIssue?.cue || "", /knees outward/i);
  });

  it("detects excessive forward trunk lean", () => {
    let t = 1000;
    counter.processFrame(createSquatKeypoints(165), t);

    t += 300;
    counter.processFrame(createSquatKeypoints(140), t);

    // Trunk tilt 55 degrees (> 45 threshold)
    t += 300;
    const leanResult = counter.processFrame(createSquatKeypoints(100, { trunkTiltDeg: 55 }), t);
    assert.ok(leanResult.newIssue);
    assert.equal(leanResult.newIssue?.issue, "excessive_forward_lean");
    assert.match(leanResult.newIssue?.cue || "", /chest up/i);
  });
});
