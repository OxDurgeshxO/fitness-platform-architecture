import {
  WorkoutSession,
  RepetitionRecord,
  CoachingFeedback,
  FormIssue,
  ExerciseType
} from "@fitness/types";
import {
  SquatRepCounter,
  SquatKeypoints,
  PushUpRepCounter,
  PushUpKeypoints,
  RDLRepCounter,
  RDLKeypoints,
  Point3D
} from "@fitness/cv";
import { AICoachingEngine } from "@fitness/ai";
import crypto from "crypto";

export interface MovementKeypoints extends SquatKeypoints {
  leftElbow?: Point3D;
  leftWrist?: Point3D;
  rightElbow?: Point3D;
  rightWrist?: Point3D;
}

export class WorkoutSessionManager {
  private session: WorkoutSession;
  private repCounter: SquatRepCounter | PushUpRepCounter | RDLRepCounter;
  private coach: AICoachingEngine;
  private feedbacks: CoachingFeedback[] = [];

  constructor(userId: string, exercise: ExerciseType = "squat") {
    this.session = {
      id: crypto.randomUUID(),
      userId,
      exercise,
      status: "in_progress",
      startedAt: new Date().toISOString(),
      totalReps: 0,
      validReps: 0,
      averageFormScore: 100,
      reps: []
    };

    if (exercise === "pushup") {
      this.repCounter = new PushUpRepCounter();
    } else if (exercise === "romanian_deadlift") {
      this.repCounter = new RDLRepCounter();
    } else {
      this.repCounter = new SquatRepCounter();
    }

    this.coach = new AICoachingEngine();
  }

  public async processPoseFrame(
    keypoints: MovementKeypoints,
    timestampMs: number
  ): Promise<{
    repCount: number;
    newIssue?: FormIssue;
    completedRep?: RepetitionRecord;
    feedback?: CoachingFeedback;
  }> {
    let result: {
      repCount: number;
      newIssue?: FormIssue;
      completedRep?: RepetitionRecord;
    };

    if (this.repCounter instanceof PushUpRepCounter) {
      const pushupKp: PushUpKeypoints = {
        leftShoulder: keypoints.leftShoulder,
        leftElbow: keypoints.leftElbow || { x: 0.45, y: 0.25 },
        leftWrist: keypoints.leftWrist || { x: 0.45, y: 0.35 },
        rightShoulder: keypoints.rightShoulder,
        rightElbow: keypoints.rightElbow || { x: 0.55, y: 0.25 },
        rightWrist: keypoints.rightWrist || { x: 0.55, y: 0.35 },
        leftHip: keypoints.leftHip,
        rightHip: keypoints.rightHip,
        leftAnkle: keypoints.leftAnkle,
        rightAnkle: keypoints.rightAnkle
      };
      result = this.repCounter.processFrame(pushupKp, timestampMs);
    } else if (this.repCounter instanceof RDLRepCounter) {
      const rdlKp: RDLKeypoints = {
        leftShoulder: keypoints.leftShoulder,
        rightShoulder: keypoints.rightShoulder,
        leftHip: keypoints.leftHip,
        rightHip: keypoints.rightHip,
        leftKnee: keypoints.leftKnee,
        rightKnee: keypoints.rightKnee,
        leftAnkle: keypoints.leftAnkle,
        rightAnkle: keypoints.rightAnkle
      };
      result = this.repCounter.processFrame(rdlKp, timestampMs);
    } else {
      result = this.repCounter.processFrame(keypoints, timestampMs);
    }

    let feedback: CoachingFeedback | undefined;

    if (result.completedRep) {
      this.session.totalReps++;
      if (result.completedRep.isValidDepth) {
        this.session.validReps++;
      }
      this.session.reps.push(result.completedRep);

      const totalScore = this.session.reps.reduce((acc, r) => acc + r.formScore, 0);
      this.session.averageFormScore = Number((totalScore / this.session.reps.length).toFixed(1));

      // Generate AI coaching feedback for the completed rep
      feedback = await this.coach.generateFeedback({
        workoutId: this.session.id,
        repRecord: result.completedRep
      });
      this.feedbacks.push(feedback);
    } else if (result.newIssue) {
      // Immediate corrective feedback for acute form issues
      feedback = {
        id: crypto.randomUUID(),
        workoutId: this.session.id,
        repNumber: this.session.totalReps + 1,
        feedbackText: result.newIssue.cue,
        visualCue: result.newIssue.issue,
        severity: result.newIssue.severity === "high" ? "safety_warning" : "minor_correction",
        generatedAt: new Date().toISOString()
      };
      this.feedbacks.push(feedback);
    }

    return {
      repCount: result.repCount,
      newIssue: result.newIssue,
      completedRep: result.completedRep,
      feedback
    };
  }

  public completeSession(): WorkoutSession {
    this.session.status = "completed";
    this.session.completedAt = new Date().toISOString();
    return { ...this.session };
  }

  public getSession(): WorkoutSession {
    return { ...this.session };
  }

  public getFeedbacks(): CoachingFeedback[] {
    return [...this.feedbacks];
  }
}
