import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { RDLRepCounter, RDLKeypoints } from "../packages/cv/src/rdl_fsm.js";

function makeRDLKeypoints(
  hipHingeDeg: number,
  options?: { squattingKnee?: boolean; lumbarRounding?: boolean }
): RDLKeypoints {
  const rad = ((180 - hipHingeDeg) * Math.PI) / 180;
  const torsoLength = 0.25;

  const kneeAngleDeg = options?.squattingKnee ? 115 : 160; // 115 deg is squatting
  const kneeRad = ((180 - kneeAngleDeg) * Math.PI) / 180;
  const shinLength = 0.3;

  const shoulderTiltOffset = options?.lumbarRounding ? 0.35 : 0.05;

  return {
    leftShoulder: {
      x: 0.35 + shoulderTiltOffset,
      y: 0.4 - torsoLength * Math.cos(rad),
      z: torsoLength * Math.sin(rad)
    },
    rightShoulder: {
      x: 0.65 + shoulderTiltOffset,
      y: 0.4 - torsoLength * Math.cos(rad),
      z: torsoLength * Math.sin(rad)
    },
    leftHip: { x: 0.35, y: 0.4, z: 0 },
    rightHip: { x: 0.65, y: 0.4, z: 0 },
    leftKnee: { x: 0.35, y: 0.65, z: 0 },
    rightKnee: { x: 0.65, y: 0.65, z: 0 },
    leftAnkle: {
      x: 0.35,
      y: 0.65 + shinLength * Math.cos(kneeRad),
      z: shinLength * Math.sin(kneeRad)
    },
    rightAnkle: {
      x: 0.65,
      y: 0.65 + shinLength * Math.cos(kneeRad),
      z: shinLength * Math.sin(kneeRad)
    }
  };
}

describe("RDLRepCounter Biomechanical FSM", () => {
  let counter: RDLRepCounter;

  beforeEach(() => {
    counter = new RDLRepCounter();
  });

  it("initializes in standing lockout with zero reps", () => {
    assert.equal(counter.getRepCount(), 0);
    assert.equal(counter.getState(), "standing");
  });

  it("counts a valid Romanian Deadlift rep with full hamstring stretch", () => {
    let t = 1000;
    // 1. Standing lockout (175 deg hip)
    counter.processFrame(makeRDLKeypoints(175), t);
    assert.equal(counter.getState(), "standing");

    // 2. Hinging back (140 deg)
    t += 300;
    const desc = counter.processFrame(makeRDLKeypoints(140), t);
    assert.equal(desc.state, "descending");

    // 3. Hamstring stretch inflection (88 deg)
    t += 500;
    const inflect = counter.processFrame(makeRDLKeypoints(88), t);
    assert.equal(inflect.state, "inflection");

    // 4. Glute drive ascending (130 deg)
    t += 400;
    const asc = counter.processFrame(makeRDLKeypoints(130), t);
    assert.equal(asc.state, "ascending");

    // 5. Standing lockout (170 deg)
    t += 300;
    const repEnd = counter.processFrame(makeRDLKeypoints(170), t);
    assert.equal(repEnd.state, "standing");
    assert.equal(counter.getRepCount(), 1);
    assert.ok(repEnd.completedRep);
    assert.equal(repEnd.completedRep.isValidDepth, true);
  });

  it("flags squatting-the-hinge when lifter excessively bends knees", () => {
    let t = 1000;
    counter.processFrame(makeRDLKeypoints(175), t);

    t += 300;
    counter.processFrame(makeRDLKeypoints(140), t);

    // Bend knees to 115 deg (fails 135 deg soft knee threshold)
    t += 300;
    const squatFault = counter.processFrame(makeRDLKeypoints(95, { squattingKnee: true }), t);
    assert.ok(squatFault.newIssue);
    assert.equal(squatFault.newIssue?.issue, "squatting_the_hinge");
    assert.match(squatFault.newIssue?.cue || "", /don't squat the hinge/i);
  });
});
