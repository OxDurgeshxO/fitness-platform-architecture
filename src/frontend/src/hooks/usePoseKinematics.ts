/**
 * usePoseKinematics.ts - Real-time client-side exercise repetition & joint angle tracking hook.
 * Implements 3D vector kinematics, biomechanical torque analysis, knee valgus detection,
 * and velocity curve hysteresis.
 */

import { useState, useCallback, useRef } from "react";
import {
  calculateAngle3D,
  calculateKneeValgus,
  calculateLumbarShear,
  calculateAngularVelocity,
  Point3D,
  ValgusMetrics,
  LumbarMetrics,
} from "../lib/kinematics.ts";

export type ExerciseType = "squat" | "pushup" | "bicep_curl";

export interface KinematicTelemetry {
  exercise: ExerciseType;
  reps: number;
  stage: "up" | "down";
  currentAngle: number;
  angularVelocityDegSec: number;
  formScore: number;
  feedback: string;
  valgusMetrics?: ValgusMetrics;
  lumbarMetrics?: LumbarMetrics;
}

const EXERCISE_THRESHOLDS = {
  squat: {
    upAngle: 160,
    downAngle: 95,
    downFeedback: "Great depth! Drive up through heels.",
    upFeedback: "Lockout achieved.",
  },
  pushup: {
    upAngle: 155,
    downAngle: 85,
    downFeedback: "Chest to deck achieved!",
    upFeedback: "Full lockout.",
  },
  bicep_curl: {
    upAngle: 45,
    downAngle: 150,
    inverted: true,
    downFeedback: "Peak bicep contraction!",
    upFeedback: "Full extension at bottom.",
  },
};

export function usePoseKinematics(initialExercise: ExerciseType = "squat") {
  const [exercise, setExercise] = useState<ExerciseType>(initialExercise);
  const [telemetry, setTelemetry] = useState<KinematicTelemetry>({
    exercise: initialExercise,
    reps: 0,
    stage: "up",
    currentAngle: 180,
    angularVelocityDegSec: 0,
    formScore: 100,
    feedback: "Ready. Assume starting posture.",
  });

  const repsRef = useRef(0);
  const stageRef = useRef<"up" | "down">("up");
  const prevAngleRef = useRef(180);
  const prevTimestampRef = useRef<number | null>(null);

  const processFrame = useCallback(
    (landmarks: Record<string, Point3D>) => {
      let angle = 180;
      const config = EXERCISE_THRESHOLDS[exercise];
      const now = performance.now();
      const deltaMs = prevTimestampRef.current ? now - prevTimestampRef.current : 33;
      prevTimestampRef.current = now;

      let valgus: ValgusMetrics | undefined;
      let lumbar: LumbarMetrics | undefined;
      let formDeductions = 0;

      if (exercise === "squat") {
        if (landmarks.hip && landmarks.knee && landmarks.ankle) {
          angle = calculateAngle3D(landmarks.hip, landmarks.knee, landmarks.ankle);
          valgus = calculateKneeValgus(landmarks.hip, landmarks.knee, landmarks.ankle);
          if (valgus.isValgusCollapse) {
            formDeductions += valgus.riskLevel === "high" ? 20 : 10;
          }
        }
        if (landmarks.shoulder && landmarks.hip) {
          lumbar = calculateLumbarShear(landmarks.shoulder, landmarks.hip);
          if (lumbar.isExcessiveForwardLean) {
            formDeductions += 15;
          }
        }
      } else if (
        (exercise === "pushup" || exercise === "bicep_curl") &&
        landmarks.shoulder &&
        landmarks.elbow &&
        landmarks.wrist
      ) {
        angle = calculateAngle3D(landmarks.shoulder, landmarks.elbow, landmarks.wrist);
      }

      const velocity = calculateAngularVelocity(prevAngleRef.current, angle, deltaMs);
      prevAngleRef.current = angle;

      let newFeedback = telemetry.feedback;
      let newStage = stageRef.current;

      // Biomechanical feedback priority
      if (valgus && valgus.isValgusCollapse) {
        newFeedback = valgus.feedback;
      } else if (lumbar && lumbar.isExcessiveForwardLean) {
        newFeedback = lumbar.feedback;
      }

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
          if (!valgus?.isValgusCollapse && !lumbar?.isExcessiveForwardLean) {
            newFeedback = config.downFeedback;
          }
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
      const formScore = Math.max(0, 100 - formDeductions);

      setTelemetry({
        exercise,
        reps: repsRef.current,
        stage: newStage,
        currentAngle: angle,
        angularVelocityDegSec: Math.round(velocity),
        formScore,
        feedback: newFeedback,
        valgusMetrics: valgus,
        lumbarMetrics: lumbar,
      });
    },
    [exercise, telemetry.feedback]
  );

  const resetReps = useCallback(() => {
    repsRef.current = 0;
    stageRef.current = "up";
    prevAngleRef.current = 180;
    prevTimestampRef.current = null;
    setTelemetry((prev) => ({ ...prev, reps: 0, stage: "up", formScore: 100 }));
  }, []);

  return {
    exercise,
    setExercise,
    telemetry,
    processFrame,
    resetReps,
  };
}
