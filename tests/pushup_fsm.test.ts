import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { PushUpRepCounter, PushUpKeypoints } from "../packages/cv/src/pushup_fsm.js";

function makePushUpKeypoints(
  elbowAngleDeg: number,
  options?: { coreSag?: boolean; elbowFlare?: boolean }
): PushUpKeypoints {
  const rad = ((180 - elbowAngleDeg) * Math.PI) / 180;
  const armLength = 0.2;

  const hipY = options?.coreSag ? 0.45 : 0.3; // Sagged vs straight
  const flareDx = options?.elbowFlare ? 0.3 : 0.0;

  return {
    leftShoulder: { x: 0.3, y: 0.3, z: 0 },
    rightShoulder: { x: 0.7, y: 0.3, z: 0 },
    leftElbow: { x: 0.3 - flareDx, y: 0.5, z: 0 },
    rightElbow: { x: 0.7 + flareDx, y: 0.5, z: 0 },
    leftWrist: {
      x: 0.3,
      y: 0.5 + armLength * Math.cos(rad),
      z: armLength * Math.sin(rad)
    },
    rightWrist: {
      x: 0.7,
      y: 0.5 + armLength * Math.cos(rad),
      z: armLength * Math.sin(rad)
    },
    leftHip: { x: 0.3, y: hipY, z: 0.4 },
    rightHip: { x: 0.7, y: hipY, z: 0.4 },
    leftAnkle: { x: 0.3, y: 0.3, z: 0.8 },
    rightAnkle: { x: 0.7, y: 0.3, z: 0.8 }
  };
}

describe("PushUpRepCounter Biomechanical FSM", () => {
  let counter: PushUpRepCounter;

  beforeEach(() => {
    counter = new PushUpRepCounter();
  });

  it("initializes in top plank position with zero reps", () => {
    assert.equal(counter.getRepCount(), 0);
    assert.equal(counter.getState(), "standing");
  });

  it("counts a valid, full chest-depth push-up repetition", () => {
    let t = 1000;
    // 1. Top plank (170 deg elbow)
    counter.processFrame(makePushUpKeypoints(170), t);
    assert.equal(counter.getState(), "standing");

    // 2. Descending (135 deg)
    t += 300;
    const desc = counter.processFrame(makePushUpKeypoints(135), t);
    assert.equal(desc.state, "descending");

    // 3. Chest to floor depth (85 deg)
    t += 500;
    const inflect = counter.processFrame(makePushUpKeypoints(85), t);
    assert.equal(inflect.state, "inflection");

    // 4. Pressing upward (120 deg)
    t += 400;
    const asc = counter.processFrame(makePushUpKeypoints(120), t);
    assert.equal(asc.state, "ascending");

    // 5. Lockout top plank (165 deg)
    t += 300;
    const repEnd = counter.processFrame(makePushUpKeypoints(165), t);
    assert.equal(repEnd.state, "standing");
    assert.equal(counter.getRepCount(), 1);
    assert.ok(repEnd.completedRep);
    assert.equal(repEnd.completedRep.isValidDepth, true);
  });

  it("flags shallow push-up depth when chest does not descend below 90 degrees", () => {
    let t = 1000;
    counter.processFrame(makePushUpKeypoints(170), t);

    t += 300;
    counter.processFrame(makePushUpKeypoints(135), t);

    // Stop early at 115 degrees
    t += 300;
    counter.processFrame(makePushUpKeypoints(115), t);

    // Reverse up early
    t += 300;
    const shallow = counter.processFrame(makePushUpKeypoints(130), t);
    assert.ok(shallow.newIssue);
    assert.equal(shallow.newIssue?.issue, "shallow_depth");
    assert.match(shallow.newIssue?.cue || "", /90 degrees/i);
  });

  it("detects pelvic core sagging during push-up descent", () => {
    let t = 1000;
    counter.processFrame(makePushUpKeypoints(170), t);

    t += 300;
    counter.processFrame(makePushUpKeypoints(135), t);

    // Incur core sag
    t += 300;
    const sag = counter.processFrame(makePushUpKeypoints(95, { coreSag: true }), t);
    assert.ok(sag.newIssue);
    assert.equal(sag.newIssue?.issue, "pelvic_sag");
    assert.match(sag.newIssue?.cue || "", /hips aligned/i);
  });
});
