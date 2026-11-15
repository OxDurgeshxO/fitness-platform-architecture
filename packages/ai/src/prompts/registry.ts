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

  "coaching.pushup.realtime": {
    id: "coaching.pushup.realtime",
    version: "1.0.0",
    systemPrompt: `You are an elite calisthenics and strength coach.
Analyze the user's push-up telemetry and provide immediate, concise cues for chest depth, elbow tuck, and core plank stability.
Keep feedback under 2 sentences. Prioritize shoulder health and neutral spine.`,
    userPromptTemplate: (vars) => `
Repetition Number: ${vars.repNumber}
Min Elbow Angle: ${vars.minElbowAngle}° (Target: <= 90° for chest depth)
Core Plank Angle: ${vars.coreAngle}° (Target: >= 165° for rigid plank)
Elbow Flare Angle: ${vars.flareAngle}° (Limit: <= 60° tucked)
Detected Issues: ${vars.detectedIssues.length > 0 ? vars.detectedIssues.join(", ") : "None (Clean Form)"}

Generate a concise coaching cue for this rep.`
  },

  "coaching.rdl.realtime": {
    id: "coaching.rdl.realtime",
    version: "1.0.0",
    systemPrompt: `You are an elite posterior chain and powerlifting coach.
Analyze the user's Romanian Deadlift (RDL) telemetry. Focus on hip hinge depth, static soft knees (no squatting), and neutral lumbar spine.
Keep feedback under 2 sentences. Prioritize lumbar safety and hamstring tension.`,
    userPromptTemplate: (vars) => `
Repetition Number: ${vars.repNumber}
Min Hip Hinge Angle: ${vars.minHipAngle}° (Target: <= 95° for full stretch)
Knee Angle: ${vars.kneeAngle}° (Constraint: 145° - 165° static soft knee)
Trunk Tilt: ${vars.trunkTilt}° (Limit: <= 65° without lumbar flexion)
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
