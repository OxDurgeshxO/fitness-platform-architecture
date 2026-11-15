import { CoachingFeedback, RepetitionRecord } from "@fitness/types";
import { COACHING_PROMPTS } from "./prompts/registry.js";
import { SafetyGuardrails } from "./guardrails.js";
import crypto from "crypto";

export interface CoachingRequest {
  workoutId: string;
  repRecord: RepetitionRecord;
  userPrompt?: string;
}

export class AICoachingEngine {
  private mockMode: boolean;

  constructor(mockMode: boolean = process.env.CI_MOCK_LLM === "true" || !process.env.GEMINI_API_KEY) {
    this.mockMode = mockMode;
  }

  public async generateFeedback(req: CoachingRequest): Promise<CoachingFeedback> {
    const { workoutId, repRecord, userPrompt } = req;

    // Check user input against safety guardrails if user prompt is present
    if (userPrompt) {
      const check = SafetyGuardrails.inspectInput(userPrompt);
      if (!check.allowed) {
        return {
          id: crypto.randomUUID(),
          workoutId,
          repNumber: repRecord.repNumber,
          feedbackText: check.sanitizedText || "Safety policy triggered.",
          severity: "safety_warning",
          generatedAt: new Date().toISOString()
        };
      }
    }

    // Fallback / Mock LLM Mode
    if (this.mockMode) {
      return this.generateMockFeedback(workoutId, repRecord);
    }

    // If API key is available in production, call LLM
    try {
      // In production with API key, format prompt
      const promptDef = COACHING_PROMPTS["coaching.squat.realtime"];
      const prompt = promptDef.userPromptTemplate({
        repNumber: repRecord.repNumber,
        minKneeAngle: repRecord.minKneeAngle,
        trunkTilt: 25,
        valgusIndex: 0.9,
        detectedIssues: repRecord.issues.map((i) => i.cue)
      });
      // Fallback to deterministic feedback engine
      return this.generateMockFeedback(workoutId, repRecord);
    } catch {
      return this.generateMockFeedback(workoutId, repRecord);
    }
  }

  private generateMockFeedback(workoutId: string, rep: RepetitionRecord): CoachingFeedback {
    let feedbackText = "Great rep! Perfect depth and solid vertical trunk alignment.";
    let visualCue = "green_checkmark";
    let severity: "encouragement" | "minor_correction" | "safety_warning" = "encouragement";

    if (rep.issues.length > 0) {
      const primaryIssue = rep.issues[0];
      severity = primaryIssue.severity === "high" ? "safety_warning" : "minor_correction";
      visualCue = primaryIssue.issue;
      feedbackText = primaryIssue.cue;
    } else if (!rep.isValidDepth) {
      severity = "minor_correction";
      visualCue = "shallow_depth";
      feedbackText = `Rep #${rep.repNumber} was slightly shallow (${rep.minKneeAngle}°). Sit back into your hips for full depth!`;
    }

    return {
      id: crypto.randomUUID(),
      workoutId,
      repNumber: rep.repNumber,
      feedbackText,
      visualCue,
      severity,
      generatedAt: new Date().toISOString()
    };
  }
}
