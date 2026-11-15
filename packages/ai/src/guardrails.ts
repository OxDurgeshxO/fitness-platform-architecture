export interface GuardrailCheckResult {
  allowed: boolean;
  sanitizedText?: string;
  triggeredPolicy?: string;
  medicalDisclaimerNeeded?: boolean;
}

const ACUTE_PAIN_KEYWORDS = [
  "sharp pain",
  "popped my knee",
  "tearing sensation",
  "dizzy",
  "numbness",
  "severe lower back pain",
  "herniated disc",
  "can't walk"
];

const PROMPT_INJECTION_PATTERNS = [
  /ignore (all )?previous instructions/i,
  /reveal (your )?system prompt/i,
  /you are now a doctor/i,
  /bypass safety/i
];

export class SafetyGuardrails {
  public static inspectInput(userText: string): GuardrailCheckResult {
    // 1. Acute pain circuit breaker
    const lower = userText.toLowerCase();
    for (const kw of ACUTE_PAIN_KEYWORDS) {
      if (lower.includes(kw)) {
        return {
          allowed: false,
          triggeredPolicy: "ACUTE_PAIN_DETECTED",
          medicalDisclaimerNeeded: true,
          sanitizedText:
            "⚠️ STOP WORKOUT IMMEDIATELY: You mentioned sharp pain or severe discomfort. Antigravity AI is not a medical provider. Please discontinue this exercise immediately and consult a qualified physician or physical therapist."
        };
      }
    }

    // 2. Prompt injection defense
    for (const pattern of PROMPT_INJECTION_PATTERNS) {
      if (pattern.test(userText)) {
        return {
          allowed: false,
          triggeredPolicy: "PROMPT_INJECTION_DEFENSE",
          sanitizedText: "Focus on proper squat mechanics and joint alignment."
        };
      }
    }

    return { allowed: true };
  }

  public static appendMedicalDisclaimer(text: string): string {
    return `${text}\n\n[Medical Disclaimer: Antigravity AI provides general movement guidance, not medical diagnosis or injury treatment.]`;
  }
}
