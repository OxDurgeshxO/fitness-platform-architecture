# API Contracts & HTTP / WebSocket Specifications

## Overview
All REST endpoints adhere to OpenAPI 3.1 standards, return JSON envelopes, enforce strict HTTP status semantics, and format timestamps in ISO-8601 UTC. Real-time telemetry communicates over WebSocket protocol on port `:8080`.

---

## 1. Standard Error Envelope
All error responses (4xx and 5xx) emit a standardized envelope:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Field 'weight_kg' must be greater than 30.0",
    "details": [
      {
        "field": "weight_kg",
        "issue": "value_too_small"
      }
    ],
    "request_id": "req_8df823ab-4e32",
    "timestamp": "2026-11-16T03:15:00.000Z"
  }
}
```

---

## 2. Core REST Endpoints (`apps/api`)

### `POST /api/v1/workouts/quick-log`
- **Purpose**: Persist a completed exercise set to the athlete's performance ledger.
- **Request Body**:
```json
{
  "exercise_type": "squat",
  "reps": 15,
  "form_accuracy": 0.92,
  "duration_seconds": 60,
  "athlete_weight_kg": 75.0
}
```
- **Response `201 Created`**:
```json
{
  "id": "log_a8f9b2c",
  "exercise_type": "squat",
  "reps": 15,
  "form_accuracy": 0.92,
  "duration_seconds": 60,
  "estimated_calories_burned": 6.3,
  "intensity_rating": "High",
  "anabolic_strain_index": 36.2,
  "feedback": "Optimal biomechanical cadence maintained.",
  "recorded_at": "2026-11-16T03:15:00.000Z"
}
```

---

### `POST /api/v1/coach/query`
- **Purpose**: Query the generative coaching engine for form guidance or workout review.
- **Request Body**:
```json
{
  "message": "How do I fix knee pain during squats?",
  "athlete_context": {
    "recent_exercise": "squat",
    "valgus_issue_count": 3
  },
  "prompt_version": "v1.0.0"
}
```
- **Response `200 OK`**:
```json
{
  "reply": "Biomechanical analysis suggests inward knee collapse (valgus) may be placing excess shear on your patellar tendon. Focus on pushing knees out tracking your second toe.",
  "intent": "form_correction",
  "confidence_score": 0.94,
  "actionable_cues": [
    "Drive knees outward tracking toes",
    "Engage gluteus medius prior to descent",
    "Consider widening stance by 1-2 inches"
  ],
  "safety_disclaimer": "Non-medical movement advice. Stop immediately if experiencing sharp joint pain.",
  "suggested_exercises": ["goblet_squat", "banded_clamshells"],
  "prompt_version": "v1.0.0"
}
```

---

### `GET /api/v1/exercises`
- **Purpose**: Returns the active movement catalog with joint landmark tracking configurations.
- **Response `200 OK`**: Array of `ExerciseProfile` objects.

---

## 3. WebSocket Realtime Protocol (`apps/realtime-service` :8080)

### Connection Handshake
- **URL**: `ws://localhost:8080/stream?session_id=<uuid>`
- **Client -> Server Frame Dispatch**:
```json
{
  "type": "pose_frame",
  "session_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "landmarks": [
    { "x": 0.51, "y": 0.62, "z": -0.14, "visibility": 0.98 }
  ],
  "timestamp": 1794775855120
}
```
- **Server -> Client Rep Event**:
```json
{
  "type": "rep_event",
  "session_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "reps": 5,
  "form_accuracy": 0.94,
  "stage": "standing",
  "feedback": "Rep 5 complete. Excellent depth."
}
```
