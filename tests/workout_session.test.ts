import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { WorkoutSessionManager } from "../packages/core/src/workout_session.js";
import { SquatKeypoints } from "../packages/cv/src/squat_fsm.js";

function makeKeypoints(kneeAngleDeg: number, valgus: number = 1.0): SquatKeypoints {
  const rad = ((180 - kneeAngleDeg) * Math.PI) / 180;
  const legLength = 0.3;
  const torsoLength = 0.2;

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
    leftShoulder: { x: leftHipX, y: hipY - torsoLength, z: 0 },
    rightShoulder: { x: rightHipX, y: hipY - torsoLength, z: 0 },
    leftHip: { x: leftHipX, y: hipY, z: 0 },
    rightHip: { x: rightHipX, y: hipY, z: 0 },
    leftKnee: { x: leftKneeX, y: kneeY, z: 0 },
    rightKnee: { x: rightKneeX, y: kneeY, z: 0 },
    leftAnkle: { x: leftAnkleX, y: ankleY, z: ankleZ },
    rightAnkle: { x: rightAnkleX, y: ankleY, z: ankleZ }
  };
}

describe("WorkoutSessionManager Integration Vertical Slice", () => {
  it("orchestrates live frames, rep counting, and coaching feedback", async () => {
    const manager = new WorkoutSessionManager("user_athlete_01", "squat");
    let initialSession = manager.getSession();
    assert.equal(initialSession.status, "in_progress");
    assert.equal(initialSession.totalReps, 0);

    // Rep 1: Clean squat
    let t = 1000;
    await manager.processPoseFrame(makeKeypoints(165), t);

    t += 300;
    await manager.processPoseFrame(makeKeypoints(140), t);

    t += 500;
    await manager.processPoseFrame(makeKeypoints(88), t);

    t += 500;
    await manager.processPoseFrame(makeKeypoints(120), t);

    t += 400;
    const finalFrame = await manager.processPoseFrame(makeKeypoints(162), t);

    assert.equal(finalFrame.repCount, 1);
    assert.ok(finalFrame.completedRep);
    assert.equal(finalFrame.completedRep.isValidDepth, true);
    assert.ok(finalFrame.feedback);
    assert.equal(finalFrame.feedback.severity, "encouragement");

    // Complete session
    const completedSession = manager.completeSession();
    assert.equal(completedSession.status, "completed");
    assert.equal(completedSession.totalReps, 1);
    assert.equal(completedSession.validReps, 1);
    assert.equal(completedSession.averageFormScore, 100);
    assert.ok(completedSession.completedAt);

    const feedbacks = manager.getFeedbacks();
    assert.ok(feedbacks.length >= 1);
  });
});
