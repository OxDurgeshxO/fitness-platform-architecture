import {
  RepetitionState,
  FormIssue,
  RepetitionRecord,
  JointAngles
} from "@fitness/types";
import { Point3D, calculateJointAngle, calculateTrunkTilt } from "./angles.js";

export interface RDLKeypoints {
  leftShoulder: Point3D;
  rightShoulder: Point3D;
  leftHip: Point3D;
  rightHip: Point3D;
  leftKnee: Point3D;
  rightKnee: Point3D;
  leftAnkle: Point3D;
  rightAnkle: Point3D;
}

export class RDLRepCounter {
  private state: RepetitionState = "standing";
  private repCount = 0;
  private currentMinHipAngle = 180;
  private repStartTime = 0;
  private currentRepIssues: FormIssue[] = [];
  private completedReps: RepetitionRecord[] = [];

  // Configurable thresholds
  public standingHipThreshold = 160; // degrees (standing extension)
  public inflectionHipThreshold = 95; // degrees (maximum hamstring hinge stretch)
  public minKneeAngle = 135; // degrees (below this is squatting, not hinging)
  public maxTrunkTilt = 70; // degrees (past this risks lumbar rounding)

  public processFrame(
    keypoints: RDLKeypoints,
    timestampMs: number
  ): {
    state: RepetitionState;
    repCount: number;
    angles: JointAngles;
    newIssue?: FormIssue;
    completedRep?: RepetitionRecord;
  } {
    // 1. Calculate kinematics
    const leftHipAngle = calculateJointAngle(keypoints.leftShoulder, keypoints.leftHip, keypoints.leftKnee);
    const rightHipAngle = calculateJointAngle(keypoints.rightShoulder, keypoints.rightHip, keypoints.rightKnee);
    const hipAngle = Number(((leftHipAngle + rightHipAngle) / 2).toFixed(1));

    const leftKneeAngle = calculateJointAngle(keypoints.leftHip, keypoints.leftKnee, keypoints.leftAnkle);
    const rightKneeAngle = calculateJointAngle(keypoints.rightHip, keypoints.rightKnee, keypoints.rightAnkle);
    const kneeAngle = Number(((leftKneeAngle + rightKneeAngle) / 2).toFixed(1));

    const trunkTilt = calculateTrunkTilt(keypoints.leftShoulder, keypoints.leftHip);

    const angles: JointAngles = {
      kneeAngle,
      hipAngle,
      ankleAngle: 90,
      trunkTilt,
      kneeValgusIndex: 1.0
    };

    let newIssue: FormIssue | undefined;
    let completedRep: RepetitionRecord | undefined;

    if (hipAngle < this.currentMinHipAngle) {
      this.currentMinHipAngle = hipAngle;
    }

    // Form fault detection during hinge descent
    if (this.state === "descending" || this.state === "inflection") {
      // Squatting instead of hinging
      if (kneeAngle < this.minKneeAngle) {
        if (!this.currentRepIssues.some((i) => i.issue === "squatting_the_hinge")) {
          const issue: FormIssue = {
            issue: "squatting_the_hinge",
            severity: "high",
            timestampMs,
            jointAngle: kneeAngle,
            cue: "Push your hips back, keep shins vertical, don't squat the hinge!"
          };
          newIssue = issue;
          this.currentRepIssues.push(issue);
        }
      }

      // Excessive trunk tilt / lumbar rounding
      if (trunkTilt > this.maxTrunkTilt) {
        if (!this.currentRepIssues.some((i) => i.issue === "lumbar_rounding")) {
          const issue: FormIssue = {
            issue: "lumbar_rounding",
            severity: "high",
            timestampMs,
            jointAngle: trunkTilt,
            cue: "Maintain a neutral spine and brace your lats!"
          };
          newIssue = issue;
          this.currentRepIssues.push(issue);
        }
      }
    }

    // 2. State Machine Transitions
    switch (this.state) {
      case "standing":
        if (hipAngle < this.standingHipThreshold - 10) {
          this.state = "descending";
          this.repStartTime = timestampMs;
          this.currentMinHipAngle = hipAngle;
          this.currentRepIssues = [];
        }
        break;

      case "descending":
        if (hipAngle <= this.inflectionHipThreshold) {
          this.state = "inflection";
        } else if (hipAngle > this.currentMinHipAngle + 12) {
          // Reversing early before full hamstring stretch
          this.state = "ascending";
          if (!this.currentRepIssues.some((i) => i.issue === "shallow_depth")) {
            const issue: FormIssue = {
              issue: "shallow_depth",
              severity: "medium",
              timestampMs,
              jointAngle: this.currentMinHipAngle,
              cue: "Hinge hips deeper until you feel tension in your hamstrings!"
            };
            newIssue = issue;
            this.currentRepIssues.push(issue);
          }
        }
        break;

      case "inflection":
        if (hipAngle > this.inflectionHipThreshold + 10) {
          this.state = "ascending";
        }
        break;

      case "ascending":
        if (hipAngle >= this.standingHipThreshold) {
          this.state = "standing";
          this.repCount++;
          const isValidDepth = this.currentMinHipAngle <= this.inflectionHipThreshold + 5;
          const formScore = Math.max(20, 100 - this.currentRepIssues.length * 20);

          completedRep = {
            repNumber: this.repCount,
            exercise: "romanian_deadlift",
            durationMs: Math.max(500, timestampMs - this.repStartTime),
            minKneeAngle: this.currentMinHipAngle,
            isValidDepth,
            formScore,
            issues: [...this.currentRepIssues]
          };

          this.completedReps.push(completedRep);
          this.currentMinHipAngle = 180;
        }
        break;
    }

    return {
      state: this.state,
      repCount: this.repCount,
      angles,
      newIssue,
      completedRep
    };
  }

  public getRepCount(): number {
    return this.repCount;
  }

  public getState(): RepetitionState {
    return this.state;
  }

  public getCompletedReps(): RepetitionRecord[] {
    return [...this.completedReps];
  }

  public reset(): void {
    this.state = "standing";
    this.repCount = 0;
    this.currentMinHipAngle = 180;
    this.currentRepIssues = [];
    this.completedReps = [];
  }
}
