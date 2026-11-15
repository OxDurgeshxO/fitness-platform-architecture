import {
  WorkoutSession,
  RepetitionRecord,
  CoachingFeedback,
  FormIssue
} from "@fitness/types";
import { SquatRepCounter, SquatKeypoints } from "@fitness/cv";
import { AICoachingEngine } from "@fitness/ai";
import crypto from "crypto";

export class WorkoutSessionManager {
  private session: WorkoutSession;
  private repCounter: SquatRepCounter;
  private coach: AICoachingEngine;
  private feedbacks: CoachingFeedback[] = [];

  constructor(userId: string, exercise: "squat" = "squat") {
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
    this.repCounter = new SquatRepCounter();
    this.coach = new AICoachingEngine();
  }

  public async processPoseFrame(
    keypoints: SquatKeypoints,
    timestampMs: number
  ): Promise<{
    repCount: number;
    newIssue?: FormIssue;
    completedRep?: RepetitionRecord;
    feedback?: CoachingFeedback;
  }> {
    const result = this.repCounter.processFrame(keypoints, timestampMs);

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
