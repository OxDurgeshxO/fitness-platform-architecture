import {
  RepetitionState,
  FormIssue,
  RepetitionRecord,
  JointAngles
} from "@fitness/types";
import { Point3D, calculateJointAngle, calculateTrunkTilt } from "./angles.js";

export interface PushUpKeypoints {
  leftShoulder: Point3D;
  leftElbow: Point3D;
  leftWrist: Point3D;
  rightShoulder: Point3D;
  rightElbow: Point3D;
  rightWrist: Point3D;
  leftHip: Point3D;
  rightHip: Point3D;
  leftAnkle: Point3D;
  rightAnkle: Point3D;
}

export class PushUpRepCounter {
  private state: RepetitionState = "standing"; // "standing" represents top plank
  private repCount = 0;
  private currentMinElbowAngle = 180;
  private repStartTime = 0;
  private currentRepIssues: FormIssue[] = [];
  private completedReps: RepetitionRecord[] = [];

  // Configurable thresholds
  public plankLockoutThreshold = 155; // degrees (top extension)
  public inflectionThreshold = 95; // degrees (chest depth)
  public pelvicSagThreshold = 155; // degrees (core straightness)
  public maxElbowFlare = 75; // degrees (abduction angle)

  public processFrame(
    keypoints: PushUpKeypoints,
    timestampMs: number
  ): {
    state: RepetitionState;
    repCount: number;
    angles: JointAngles;
    newIssue?: FormIssue;
    completedRep?: RepetitionRecord;
  } {
    // 1. Calculate kinematics
    const leftElbowAngle = calculateJointAngle(keypoints.leftShoulder, keypoints.leftElbow, keypoints.leftWrist);
    const rightElbowAngle = calculateJointAngle(keypoints.rightShoulder, keypoints.rightElbow, keypoints.rightWrist);
    const elbowAngle = Number(((leftElbowAngle + rightElbowAngle) / 2).toFixed(1));

    // Core plank angle: Shoulder -> Hip -> Ankle
    const coreAngle = calculateJointAngle(keypoints.leftShoulder, keypoints.leftHip, keypoints.leftAnkle);
    const flareAngle = calculateTrunkTilt(keypoints.leftElbow, keypoints.leftShoulder);

    const angles: JointAngles = {
      kneeAngle: 180, // Legs extended in plank
      hipAngle: coreAngle,
      ankleAngle: 90,
      trunkTilt: flareAngle,
      kneeValgusIndex: 1.0
    };

    let newIssue: FormIssue | undefined;
    let completedRep: RepetitionRecord | undefined;

    if (elbowAngle < this.currentMinElbowAngle) {
      this.currentMinElbowAngle = elbowAngle;
    }

    // Form fault detection during eccentric / bottom phase
    if (this.state === "descending" || this.state === "inflection") {
      // Pelvic core sag check
      if (coreAngle < this.pelvicSagThreshold) {
        if (!this.currentRepIssues.some((i) => i.issue === "pelvic_sag")) {
          const issue: FormIssue = {
            issue: "pelvic_sag",
            severity: "high",
            timestampMs,
            jointAngle: coreAngle,
            cue: "Engage your core, keep hips aligned in a straight plank!"
          };
          newIssue = issue;
          this.currentRepIssues.push(issue);
        }
      }

      // Elbow flare check
      if (flareAngle > this.maxElbowFlare) {
        if (!this.currentRepIssues.some((i) => i.issue === "elbow_flare")) {
          const issue: FormIssue = {
            issue: "elbow_flare",
            severity: "medium",
            timestampMs,
            jointAngle: flareAngle,
            cue: "Tuck elbows in to 45 degrees to protect shoulders!"
          };
          newIssue = issue;
          this.currentRepIssues.push(issue);
        }
      }
    }

    // 2. State Machine Transitions
    switch (this.state) {
      case "standing": // Top plank position
        if (elbowAngle < this.plankLockoutThreshold - 10) {
          this.state = "descending";
          this.repStartTime = timestampMs;
          this.currentMinElbowAngle = elbowAngle;
          this.currentRepIssues = [];
        }
        break;

      case "descending":
        if (elbowAngle <= this.inflectionThreshold) {
          this.state = "inflection";
        } else if (elbowAngle > this.currentMinElbowAngle + 12) {
          // Reversing upward before chest depth reached
          this.state = "ascending";
          if (!this.currentRepIssues.some((i) => i.issue === "shallow_depth")) {
            const issue: FormIssue = {
              issue: "shallow_depth",
              severity: "medium",
              timestampMs,
              jointAngle: this.currentMinElbowAngle,
              cue: "Lower your chest until elbows hit 90 degrees!"
            };
            newIssue = issue;
            this.currentRepIssues.push(issue);
          }
        }
        break;

      case "inflection":
        if (elbowAngle > this.inflectionThreshold + 10) {
          this.state = "ascending";
        }
        break;

      case "ascending":
        if (elbowAngle >= this.plankLockoutThreshold) {
          this.state = "standing";
          this.repCount++;
          const isValidDepth = this.currentMinElbowAngle <= this.inflectionThreshold + 5;
          const formScore = Math.max(20, 100 - this.currentRepIssues.length * 20);

          completedRep = {
            repNumber: this.repCount,
            exercise: "pushup",
            durationMs: Math.max(500, timestampMs - this.repStartTime),
            minKneeAngle: this.currentMinElbowAngle,
            isValidDepth,
            formScore,
            issues: [...this.currentRepIssues]
          };

          this.completedReps.push(completedRep);
          this.currentMinElbowAngle = 180;
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
    this.currentMinElbowAngle = 180;
    this.currentRepIssues = [];
    this.completedReps = [];
  }
}
