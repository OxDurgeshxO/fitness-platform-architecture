import {
  RepetitionState,
  FormIssue,
  RepetitionRecord,
  JointAngles
} from "@fitness/types";
import { Point3D, calculateJointAngle, calculateTrunkTilt, calculateKneeValgusIndex } from "./angles.js";

export interface SquatKeypoints {
  leftHip: Point3D;
  leftKnee: Point3D;
  leftAnkle: Point3D;
  rightHip: Point3D;
  rightKnee: Point3D;
  rightAnkle: Point3D;
  leftShoulder: Point3D;
  rightShoulder: Point3D;
}

export class SquatRepCounter {
  private state: RepetitionState = "standing";
  private repCount = 0;
  private currentMinKneeAngle = 180;
  private repStartTime = 0;
  private currentRepIssues: FormIssue[] = [];
  private completedReps: RepetitionRecord[] = [];

  // Configurable thresholds
  public standingThreshold = 155; // degrees
  public inflectionThreshold = 95; // degrees (parallel squat depth)
  public maxTrunkLean = 45; // degrees
  public valgusThreshold = 0.82; // ratio

  public processFrame(
    keypoints: SquatKeypoints,
    timestampMs: number
  ): {
    state: RepetitionState;
    repCount: number;
    angles: JointAngles;
    newIssue?: FormIssue;
    completedRep?: RepetitionRecord;
  } {
    // 1. Calculate kinematics
    const leftKneeAngle = calculateJointAngle(keypoints.leftHip, keypoints.leftKnee, keypoints.leftAnkle);
    const rightKneeAngle = calculateJointAngle(keypoints.rightHip, keypoints.rightKnee, keypoints.rightAnkle);
    const kneeAngle = Number(((leftKneeAngle + rightKneeAngle) / 2).toFixed(1));

    const leftHipAngle = calculateJointAngle(keypoints.leftShoulder, keypoints.leftHip, keypoints.leftKnee);
    const trunkTilt = calculateTrunkTilt(keypoints.leftShoulder, keypoints.leftHip);
    const valgusIndex = calculateKneeValgusIndex(
      keypoints.leftKnee,
      keypoints.rightKnee,
      keypoints.leftAnkle,
      keypoints.rightAnkle
    );

    const angles: JointAngles = {
      kneeAngle,
      hipAngle: leftHipAngle,
      ankleAngle: 75,
      trunkTilt,
      kneeValgusIndex: valgusIndex
    };

    let newIssue: FormIssue | undefined;
    let completedRep: RepetitionRecord | undefined;

    // Track minimum knee angle achieved during the descent
    if (kneeAngle < this.currentMinKneeAngle) {
      this.currentMinKneeAngle = kneeAngle;
    }

    // Check for knee valgus during descent/inflection
    if (this.state === "descending" || this.state === "inflection") {
      if (valgusIndex < this.valgusThreshold) {
        if (!this.currentRepIssues.some((i) => i.issue === "knee_valgus")) {
          newIssue = {
            issue: "knee_valgus",
            severity: "medium",
            timestampMs,
            jointAngle: valgusIndex,
            cue: "Push your knees outward in line with your toes!"
          };
          this.currentRepIssues.push(newIssue);
        }
      }

      // Check for excessive forward lean
      if (trunkTilt > this.maxTrunkLean) {
        if (!this.currentRepIssues.some((i) => i.issue === "excessive_forward_lean")) {
          newIssue = {
            issue: "excessive_forward_lean",
            severity: "high",
            timestampMs,
            jointAngle: trunkTilt,
            cue: "Keep your chest up and core braced!"
          };
          this.currentRepIssues.push(newIssue);
        }
      }
    }

    // 2. State Machine Transitions
    switch (this.state) {
      case "standing":
        if (kneeAngle < this.standingThreshold - 10) {
          this.state = "descending";
          this.repStartTime = timestampMs;
          this.currentMinKneeAngle = kneeAngle;
          this.currentRepIssues = [];
        }
        break;

      case "descending":
        if (kneeAngle <= this.inflectionThreshold) {
          this.state = "inflection";
        } else if (kneeAngle > this.currentMinKneeAngle + 12) {
          // Athlete started ascending before reaching target depth (Shallow squat)
          this.state = "ascending";
          if (!this.currentRepIssues.some((i) => i.issue === "shallow_depth")) {
            newIssue = {
              issue: "shallow_depth",
              severity: "medium",
              timestampMs,
              jointAngle: this.currentMinKneeAngle,
              cue: "Squat lower until thighs are parallel to the floor!"
            };
            this.currentRepIssues.push(newIssue);
          }
        }
        break;

      case "inflection":
        if (kneeAngle > this.inflectionThreshold + 10) {
          this.state = "ascending";
        }
        break;

      case "ascending":
        if (kneeAngle >= this.standingThreshold) {
          this.state = "standing";
          this.repCount++;
          const isValidDepth = this.currentMinKneeAngle <= this.inflectionThreshold + 5;
          const formScore = Math.max(20, 100 - this.currentRepIssues.length * 20);

          completedRep = {
            repNumber: this.repCount,
            exercise: "squat",
            durationMs: Math.max(500, timestampMs - this.repStartTime),
            minKneeAngle: this.currentMinKneeAngle,
            isValidDepth,
            formScore,
            issues: [...this.currentRepIssues]
          };

          this.completedReps.push(completedRep);
          this.currentMinKneeAngle = 180;
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

  public getCompletedReps(): RepetitionRecord[] {
    return [...this.completedReps];
  }

  public reset(): void {
    this.state = "standing";
    this.repCount = 0;
    this.currentMinKneeAngle = 180;
    this.currentRepIssues = [];
    this.completedReps = [];
  }
}
