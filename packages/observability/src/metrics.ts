export class FitnessMetricsRegistry {
  private poseFramesProcessed = 0;
  private repsCompleted = 0;
  private formIssuesDetected = 0;
  private coachingFeedbackEmitted = 0;

  public incrementPoseFrames() { this.poseFramesProcessed++; }
  public incrementReps() { this.repsCompleted++; }
  public incrementFormIssues() { this.formIssuesDetected++; }
  public incrementCoachingFeedback() { this.coachingFeedbackEmitted++; }

  public getSnapshot(): string {
    return [
      "# HELP fitness_pose_frames_total Total video pose frames ingested",
      "# TYPE fitness_pose_frames_total counter",
      `fitness_pose_frames_total ${this.poseFramesProcessed}`,
      "",
      "# HELP fitness_reps_completed_total Total repetitions counted by exercise state machine",
      "# TYPE fitness_reps_completed_total counter",
      `fitness_reps_completed_total ${this.repsCompleted}`,
      "",
      "# HELP fitness_form_issues_total Total biomechanical form errors identified",
      "# TYPE fitness_form_issues_total counter",
      `fitness_form_issues_total ${this.formIssuesDetected}`,
      "",
      "# HELP fitness_coaching_feedback_total Total coaching cues generated",
      "# TYPE fitness_coaching_feedback_total counter",
      `fitness_coaching_feedback_total ${this.coachingFeedbackEmitted}`,
      ""
    ].join("\n");
  }
}

export const fitnessMetrics = new FitnessMetricsRegistry();
