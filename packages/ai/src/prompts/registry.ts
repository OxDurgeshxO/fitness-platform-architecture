export interface PromptDefinition {
  id: string;
  version: string;
  systemPrompt: string;
  userPromptTemplate: (vars: Record<string, any>) => string;
}

export const COACHING_PROMPTS: Record<string, PromptDefinition> = {
  "coaching.squat.realtime": {
    id: "coaching.squat.realtime",
    version: "1.2.0",
    systemPrompt: `You are an elite biomechanical strength and conditioning coach.
Analyze the user's squat telemetry and provide immediate, concise, and actionable cues.
SAFETY MANDATE: You are a fitness coach, NOT a medical doctor. If sharp pain or numbness is reported, immediately urge the user to halt the exercise and consult a medical doctor.
Keep feedback under 2 sentences. Prioritize movement safety before loading or speed.`,
    userPromptTemplate: (vars) => `
Repetition Number: ${vars.repNumber}
Min Knee Angle: ${vars.minKneeAngle}° (Target: <= 95° for full parallel depth)
Trunk Tilt: ${vars.trunkTilt}° (Limit: <= 45°)
Knee Valgus Index: ${vars.valgusIndex} (Limit: >= 0.82)
Detected Issues: ${vars.detectedIssues.length > 0 ? vars.detectedIssues.join(", ") : "None (Clean Form)"}

Generate a concise coaching cue for this rep.`
  },

  "coaching.session.summary": {
    id: "coaching.session.summary",
    version: "1.0.0",
    systemPrompt: `You are an expert fitness mentor analyzing completed workout data.
Summarize overall volume, depth consistency, form improvements, and 2 actionable takeaways for the next training session.`,
    userPromptTemplate: (vars) => `
Total Reps Completed: ${vars.totalReps}
Valid Depth Reps: ${vars.validReps}
Average Form Score: ${vars.averageFormScore}/100
Primary Form Issues Encountered: ${vars.commonIssues.join(", ")}

Generate an empowering post-workout summary.`
  }
};
