import { z } from "zod";

// --- User Schemas ---
export const UserRoleSchema = z.enum(["athlete", "coach", "admin"]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  role: UserRoleSchema.default("athlete"),
  fitnessLevel: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});
export type User = z.infer<typeof UserSchema>;

// --- Exercise Schemas ---
export const ExerciseTypeSchema = z.enum(["squat", "pushup"]);
export type ExerciseType = z.infer<typeof ExerciseTypeSchema>;

export const ExerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: ExerciseTypeSchema,
  primaryMuscleGroups: z.array(z.string()),
  targetDepthAngle: z.number().describe("Knee angle threshold for full depth in degrees (e.g. <= 90)"),
  description: z.string()
});
export type Exercise = z.infer<typeof ExerciseSchema>;

// --- Computer Vision & Pose Landmark Schemas ---
export const LandmarkSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  z: z.number().optional(),
  visibility: z.number().min(0).max(1).optional()
});
export type Landmark = z.infer<typeof LandmarkSchema>;

export const JointAnglesSchema = z.object({
  hipAngle: z.number().describe("Hip joint angle in degrees"),
  kneeAngle: z.number().describe("Knee joint angle in degrees"),
  ankleAngle: z.number().describe("Ankle joint angle in degrees"),
  trunkTilt: z.number().describe("Trunk tilt relative to vertical in degrees"),
  kneeValgusIndex: z.number().optional().describe("Ratio of knee distance to ankle distance (<0.85 = valgus collapse)")
});
export type JointAngles = z.infer<typeof JointAnglesSchema>;

export const FormIssueTypeSchema = z.enum([
  "knee_valgus",
  "shallow_depth",
  "excessive_forward_lean",
  "asymmetric_weight_shift",
  "incomplete_lockout",
  "tempo_too_fast"
]);
export type FormIssueType = z.infer<typeof FormIssueTypeSchema>;

export const FormIssueSchema = z.object({
  issue: FormIssueTypeSchema,
  severity: z.enum(["low", "medium", "high"]),
  timestampMs: numberOrDate(),
  jointAngle: z.number().optional(),
  cue: z.string().describe("Corrective actionable instruction for athlete")
});
export type FormIssue = z.infer<typeof FormIssueSchema>;

function numberOrDate() {
  return z.number();
}

export const PoseFrameSchema = z.object({
  frameIndex: z.number().int().nonnegative(),
  timestamp: z.number(),
  landmarks: z.record(z.string(), LandmarkSchema),
  angles: JointAnglesSchema.optional(),
  detectedIssues: z.array(FormIssueSchema).default([])
});
export type PoseFrame = z.infer<typeof PoseFrameSchema>;

// --- Repetition Schemas ---
export const RepetitionStateSchema = z.enum(["standing", "descending", "inflection", "ascending", "completed", "failed"]);
export type RepetitionState = z.infer<typeof RepetitionStateSchema>;

export const RepetitionRecordSchema = z.object({
  repNumber: z.number().int().positive(),
  exercise: ExerciseTypeSchema,
  durationMs: z.number().positive(),
  minKneeAngle: z.number(),
  isValidDepth: z.boolean(),
  formScore: z.number().min(0).max(100),
  issues: z.array(FormIssueSchema)
});
export type RepetitionRecord = z.infer<typeof RepetitionRecordSchema>;

// --- Feedback & AI Coaching Schemas ---
export const CoachingFeedbackSchema = z.object({
  id: z.string().uuid(),
  workoutId: z.string().uuid(),
  repNumber: z.number().int().optional(),
  feedbackText: z.string(),
  visualCue: z.string().optional(),
  severity: z.enum(["encouragement", "minor_correction", "safety_warning"]),
  generatedAt: z.string().datetime(),
  audioCueUrl: z.string().optional()
});
export type CoachingFeedback = z.infer<typeof CoachingFeedbackSchema>;

// --- Workout Session & Plan Schemas ---
export const WorkoutStatusSchema = z.enum(["in_progress", "completed", "aborted"]);
export type WorkoutStatus = z.infer<typeof WorkoutStatusSchema>;

export const WorkoutSessionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  exercise: ExerciseTypeSchema,
  status: WorkoutStatusSchema.default("in_progress"),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  totalReps: z.number().int().nonnegative().default(0),
  validReps: z.number().int().nonnegative().default(0),
  averageFormScore: z.number().min(0).max(100).default(100),
  reps: z.array(RepetitionRecordSchema).default([])
});
export type WorkoutSession = z.infer<typeof WorkoutSessionSchema>;

export const PlanSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  targetExercise: ExerciseTypeSchema,
  targetSets: z.number().int().positive(),
  targetRepsPerSet: z.number().int().positive(),
  coachingTone: z.enum(["encouraging", "strict", "technical"]).default("encouraging"),
  createdDate: z.string()
});
export type Plan = z.infer<typeof PlanSchema>;

// --- Domain Event Schemas (Core Event Flow) ---
export const DomainEventTypeSchema = z.enum([
  "pose.frame.captured",
  "exercise.detected",
  "rep.completed",
  "form.issue.detected",
  "coach.feedback.generated",
  "workout.session.completed"
]);
export type DomainEventType = z.infer<typeof DomainEventTypeSchema>;

export const DomainEventEnvelopeSchema = z.object({
  id: z.string().uuid(),
  eventType: DomainEventTypeSchema,
  timestamp: z.string().datetime(),
  sessionId: z.string().uuid(),
  userId: z.string().uuid(),
  payload: z.record(z.string(), z.unknown())
});
export type DomainEventEnvelope = z.infer<typeof DomainEventEnvelopeSchema>;
