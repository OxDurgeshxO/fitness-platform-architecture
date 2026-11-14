/**
 * usePoseKinematics.ts - Real-time client-side exercise repetition & joint angle tracking hook.
 * Implements planar vector dot product kinematics and state machine hysteresis.
 */

import { useState, useCallback, useRef } from "react";
import { calculateAngle } from "../lib/kinematics.ts";

export type ExerciseType = "squat" | "pushup" | "bicep_curl";

export interface LandmarkPoint {
  x: float;
  y: float;
  score?: number;
}

export interface KinematicTelemetry {
  exercise: ExerciseType;
  reps: number;
  stage: "up" | "down";
  currentAngle: number;
  formScore: number;
  feedback: string;
}

const EXERCISE_THRESHOLDS = {
  squat: {
    upAngle: 160,
    downAngle: 95,
    downFeedback: "Great depth! Drive up.",
    upFeedback: "Lockout achieved.",
  },
  pushup: {
    upAngle: 155,
    downAngle: 85,
    downFeedback: "Chest down!",
    upFeedback: "Full arm lockout.",
  },
  bicep_curl: {
    upAngle: 45,
    downAngle: 150,
    inverted: true,
    downFeedback: "Full contraction!",
    upFeedback: "Full extension.",
  },
};



export function usePoseKinematics(initialExercise: ExerciseType = "squat") {
  const [exercise, setExercise] = useState<ExerciseType>(initialExercise);
  const [telemetry, setTelemetry] = useState<KinematicTelemetry>({
    exercise: initialExercise,
    reps: 0,
    stage: "up",
    currentAngle: 180,
    formScore: 100,
    feedback: "Ready. Assume starting position.",
  });

  const repsRef = useRef(0);
  const stageRef = useRef<"up" | "down">("up");

  const processFrame = useCallback(
    (landmarks: Record<string, { x: number; y: number }>) => {
      let angle = 180;
      const config = EXERCISE_THRESHOLDS[exercise];

      if (exercise === "squat" && landmarks.hip && landmarks.knee && landmarks.ankle) {
        angle = calculateAngle(landmarks.hip, landmarks.knee, landmarks.ankle);
      } else if (
        (exercise === "pushup" || exercise === "bicep_curl") &&
        landmarks.shoulder &&
        landmarks.elbow &&
        landmarks.wrist
      ) {
        angle = calculateAngle(landmarks.shoulder, landmarks.elbow, landmarks.wrist);
      }

      let newFeedback = telemetry.feedback;
      let newStage = stageRef.current;

      if (!("inverted" in config && config.inverted)) {
        // Standard exercise (squat/pushup)
        if (angle > config.upAngle) {
          if (stageRef.current === "down") {
            repsRef.current += 1;
            newFeedback = config.upFeedback;
          }
          newStage = "up";
        } else if (angle < config.downAngle) {
          newStage = "down";
          newFeedback = config.downFeedback;
        }
      } else {
        // Inverted exercise (curl)
        if (angle > config.downAngle) {
          newStage = "down";
          newFeedback = config.upFeedback;
        } else if (angle < config.upAngle) {
          if (stageRef.current === "down") {
            repsRef.current += 1;
            newFeedback = config.downFeedback;
          }
          newStage = "up";
        }
      }

      stageRef.current = newStage;
      setTelemetry({
        exercise,
        reps: repsRef.current,
        stage: newStage,
        currentAngle: angle,
        formScore: 95,
        feedback: newFeedback,
      });
    },
    [exercise, telemetry.feedback]
  );

  const resetReps = useCallback(() => {
    repsRef.current = 0;
    stageRef.current = "up";
    setTelemetry((prev) => ({ ...prev, reps: 0, stage: "up" }));
  }, []);

  return {
    exercise,
    setExercise,
    telemetry,
    processFrame,
    resetReps,
  };
}
