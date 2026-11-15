import math
from typing import List, Tuple

from app.schemas.workout import PoseAnalysisRequest, PoseAnalysisResponse, PoseLandmark


class PoseAnalysisService:
    """Real-time biomechanical analysis, bilateral symmetry, and rep counting service."""

    @staticmethod
    def calculate_angle(
        a: Tuple[float, float],
        b: Tuple[float, float],
        c: Tuple[float, float],
    ) -> float:
        """Calculate angle ABC in degrees (vertex at B)."""
        radians = math.atan2(c[1] - b[1], c[0] - b[0]) - math.atan2(a[1] - b[1], a[0] - b[0])
        angle = abs(radians * 180.0 / math.pi)
        if angle > 180.0:
            angle = 360.0 - angle
        return round(angle, 2)

    def analyze_squat(
        self, landmarks: List[PoseLandmark], current_reps: int
    ) -> PoseAnalysisResponse:
        """
        Bilateral squat analysis:
        Left: Hip(23), Knee(25), Ankle(27)
        Right: Hip(24), Knee(26), Ankle(28)
        """
        if len(landmarks) < 29:
            return PoseAnalysisResponse(
                exercise_type="squat",
                reps_counted=current_reps,
                rep_completed=False,
                current_angle=180.0,
                form_accuracy=0.0,
                feedback="Insufficient landmarks detected. Adjust camera frame.",
                stage="unknown",
                symmetry_score=1.0,
                bilateral_balance="balanced",
                active_joint="knee",
            )

        left_hip = (landmarks[23].x, landmarks[23].y)
        left_knee = (landmarks[25].x, landmarks[25].y)
        left_ankle = (landmarks[27].x, landmarks[27].y)
        left_angle = self.calculate_angle(left_hip, left_knee, left_ankle)

        right_hip = (landmarks[24].x, landmarks[24].y)
        right_knee = (landmarks[26].x, landmarks[26].y)
        right_ankle = (landmarks[28].x, landmarks[28].y)
        right_angle = self.calculate_angle(right_hip, right_knee, right_ankle)

        avg_angle = round((left_angle + right_angle) / 2.0, 2)
        diff = abs(left_angle - right_angle)
        symmetry = round(max(0.0, 1.0 - (diff / 90.0)), 2)

        if diff > 15.0:
            balance = "left_shifted" if left_angle < right_angle else "right_shifted"
            symmetry_cue = " Distribute weight evenly across both feet."
        else:
            balance = "balanced"
            symmetry_cue = ""

        if avg_angle > 155.0:
            stage = "up"
            feedback = "Good standing posture. Lower hips below knee crease." + symmetry_cue
            form_accuracy = symmetry
            rep_completed = False
            reps_counted = current_reps
        elif avg_angle < 92.0:
            stage = "down"
            feedback = "Optimal depth achieved! Drive up through heels." + symmetry_cue
            form_accuracy = round(symmetry * 0.98, 2)
            rep_completed = True
            reps_counted = current_reps + 1
        else:
            stage = "transition"
            feedback = "Maintain upright chest and neutral spine." + symmetry_cue
            form_accuracy = round(symmetry * 0.92, 2)
            rep_completed = False
            reps_counted = current_reps

        return PoseAnalysisResponse(
            exercise_type="squat",
            reps_counted=reps_counted,
            rep_completed=rep_completed,
            current_angle=avg_angle,
            form_accuracy=form_accuracy,
            feedback=feedback,
            stage=stage,
            symmetry_score=symmetry,
            bilateral_balance=balance,
            active_joint="knee",
        )

    def analyze_pushup(
        self, landmarks: List[PoseLandmark], current_reps: int
    ) -> PoseAnalysisResponse:
        """
        Bilateral pushup analysis:
        Left: Shoulder(11), Elbow(13), Wrist(15)
        Right: Shoulder(12), Elbow(14), Wrist(16)
        """
        if len(landmarks) < 17:
            return PoseAnalysisResponse(
                exercise_type="pushup",
                reps_counted=current_reps,
                rep_completed=False,
                current_angle=180.0,
                form_accuracy=0.0,
                feedback="Frame upper body clearly.",
                stage="unknown",
                symmetry_score=1.0,
                bilateral_balance="balanced",
                active_joint="elbow",
            )

        left_angle = self.calculate_angle(
            (landmarks[11].x, landmarks[11].y),
            (landmarks[13].x, landmarks[13].y),
            (landmarks[15].x, landmarks[15].y),
        )
        right_angle = self.calculate_angle(
            (landmarks[12].x, landmarks[12].y),
            (landmarks[14].x, landmarks[14].y),
            (landmarks[16].x, landmarks[16].y),
        )
        avg_angle = round((left_angle + right_angle) / 2.0, 2)
        diff = abs(left_angle - right_angle)
        symmetry = round(max(0.0, 1.0 - (diff / 90.0)), 2)

        if avg_angle > 155.0:
            stage = "up"
            feedback = "High plank locked. Lower chest toward deck."
            rep_completed = False
            reps_counted = current_reps
        elif avg_angle < 90.0:
            stage = "down"
            feedback = "Full chest depth! Press firmly through palms."
            rep_completed = True
            reps_counted = current_reps + 1
        else:
            stage = "transition"
            feedback = "Keep elbows at 45 degrees, avoid flaring."
            rep_completed = False
            reps_counted = current_reps

        return PoseAnalysisResponse(
            exercise_type="pushup",
            reps_counted=reps_counted,
            rep_completed=rep_completed,
            current_angle=avg_angle,
            form_accuracy=symmetry,
            feedback=feedback,
            stage=stage,
            symmetry_score=symmetry,
            bilateral_balance="balanced" if diff <= 15 else "asymmetric",
            active_joint="elbow",
        )

    def process_frame(self, request: PoseAnalysisRequest) -> PoseAnalysisResponse:
        exercise = request.exercise_type.lower()
        if exercise == "squat":
            return self.analyze_squat(request.landmarks, request.current_reps)
        elif exercise == "pushup":
            return self.analyze_pushup(request.landmarks, request.current_reps)

        # Fallback
        return PoseAnalysisResponse(
            exercise_type=exercise,
            reps_counted=request.current_reps,
            rep_completed=False,
            current_angle=0.0,
            form_accuracy=1.0,
            feedback=f"Kinematic tracking active for {exercise}.",
            stage="tracking",
            symmetry_score=1.0,
            bilateral_balance="balanced",
            active_joint="generic",
        )
