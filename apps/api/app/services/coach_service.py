import re
from typing import List, Tuple
from app.schemas.coach import CoachQueryRequest, CoachQueryResponse


PROMPT_REGISTRY = {
    "v1.0.0": {
        "system": "You are the AI Gym Master Coach, an elite biomechanist, CSCS-certified strength trainer, and sports nutritionist. Provide actionable, science-based, concise coaching instructions.",
    }
}


class CoachService:
    @staticmethod
    def classify_intent(message: str) -> Tuple[str, float]:
        text = message.lower()
        if any(w in text for w in ["form", "pain", "hurt", "knee", "back", "depth", "elbow", "caving"]):
            return "form_correction", 0.96
        elif any(w in text for w in ["squat", "pushup", "bench", "deadlift", "curl", "lunge", "exercise", "workout"]):
            return "exercise_guidance", 0.94
        elif any(w in text for w in ["calorie", "protein", "diet", "macro", "food", "eat", "meal", "carb", "fat", "nutrition"]):
            return "nutrition_advice", 0.95
        elif any(w in text for w in ["sore", "rest", "sleep", "recovery", "doms", "massage", "stretch"]):
            return "recovery", 0.92
        return "exercise_guidance", 0.85

    @classmethod
    def generate_coaching_response(cls, req: CoachQueryRequest) -> CoachQueryResponse:
        intent, confidence = cls.classify_intent(req.message)
        text = req.message.lower()

        cues: List[str] = []
        suggested: List[str] = []
        disclaimer = None

        if intent == "form_correction":
            if "knee" in text or "squat" in text:
                reply = "Knee discomfort during squats is most frequently caused by knees caving inward (valgus collapse) or excessive forward knee travel without adequate hip hinge. Drive your knees outward along the line of your toes, distribute weight across your mid-foot, and brace your core firmly."
                cues = ["Drive knees outward tracking over second toe", "Push hips back first before bending knees", "Keep heels pinned to ground"]
                suggested = ["squat", "lunge"]
            elif "back" in text:
                reply = "Lower back strain typically indicates lumbar rounding under load or inadequate intra-abdominal pressure. Maintain a neutral spine, pull your ribcage down, and inhale deeply into your belly before each rep."
                cues = ["Brace abdominals as if taking a punch", "Maintain neutral neck aligned with spine", "Stop before lumbar flexion occurs"]
                suggested = ["plank"]
            else:
                reply = "Focus on joint alignment and controlled eccentric movement. Decelerate for 2 to 3 seconds on the way down, ensure joints track naturally, and avoid using momentum to rebound."
                cues = ["Control 3-second descent", "Check symmetry between left and right sides"]
            disclaimer = "If sharp or acute pain persists, stop the movement immediately and consult a sports physical therapist."

        elif intent == "nutrition_advice":
            if "protein" in text:
                reply = "For optimal muscle protein synthesis (MPS) during strength training, aim for 2.0 to 2.4 grams of protein per kilogram of bodyweight daily. Distribute this across 4 to 5 meals containing at least 30g of protein and 3g of leucine per feeding."
                cues = ["Consume 30-40g protein every 3-4 hours", "Prioritize complete protein sources: eggs, chicken breast, whey, tofu"]
            elif "fat loss" in text or "cut" in text:
                reply = "Target a moderate caloric deficit of 500 kcal below your TDEE. Maintain high protein intake (2.4 g/kg) and keep resistance training intensity high to preserve lean muscle tissue while losing fat."
                cues = ["500 kcal deficit below maintenance", "Prioritize high-volume fibrous vegetables for satiety"]
            else:
                reply = "Balance your macronutrients around your training window. Consume complex carbohydrates 2 hours pre-workout for glycogen availability, and pair fast-digesting protein with carbs post-workout to kickstart recovery."
                cues = ["Pre-workout carbs for glycogen", "Post-workout protein + carbs for recovery", "Minimum 35ml water per kg bodyweight daily"]

        elif intent == "recovery":
            reply = "Muscular adaptation occurs during rest, not during training. Prioritize 7 to 9 hours of uninterrupted sleep, adequate hydration (3-4L daily), and active recovery sessions like zone-2 walking or mobility flows."
            cues = ["Aim for 7-9 hours sleep in a dark, cool room", "Perform 20 mins light mobility or walking on rest days", "Rehydrate with electrolytes post-workout"]
            suggested = ["plank"]

        else:
            reply = "To maximize strength and hypertrophy, focus on progressive overload with clean biomechanics. Ensure full range of motion on every rep, tracking joint angles and cadence."
            cues = ["Strive for full range of motion", "Track reps and weights each session", "Rest 2-3 minutes between compound working sets"]
            suggested = ["squat", "pushup", "bicep_curl"]

        return CoachQueryResponse(
            reply=reply,
            intent=intent,
            confidence_score=confidence,
            actionable_cues=cues,
            safety_disclaimer=disclaimer,
            suggested_exercises=suggested,
            prompt_version=req.prompt_version,
        )
