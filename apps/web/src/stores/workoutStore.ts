import { create } from "zustand";

export interface PoseState {
  exercise: string;
  reps: number;
  accuracy: number;
  angle: number;
  stage: string;
  feedback: string;
  isStreaming: boolean;
  setExercise: (exercise: string) => void;
  incrementReps: () => void;
  updateTelemetry: (telemetry: Partial<PoseState>) => void;
  toggleStreaming: () => void;
  reset: () => void;
}

export const useWorkoutStore = create<PoseState>((set) => ({
  exercise: "squat",
  reps: 0,
  accuracy: 100,
  angle: 180,
  stage: "up",
  feedback: "Ready for reps. Frame full body in view.",
  isStreaming: false,
  setExercise: (exercise) => set({ exercise }),
  incrementReps: () => set((state) => ({ reps: state.reps + 1 })),
  updateTelemetry: (telemetry) => set((state) => ({ ...state, ...telemetry })),
  toggleStreaming: () => set((state) => ({ isStreaming: !state.isStreaming })),
  reset: () => set({ reps: 0, accuracy: 100, stage: "up", feedback: "Ready for reps." }),
}));
