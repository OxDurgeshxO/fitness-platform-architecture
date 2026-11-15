# Event Schema & Domain Contracts

## 1. Event Architecture Overview
The platform uses asynchronous domain events conformant to the **CloudEvents v1.0.2** specification. Events are dispatched over the internal pub/sub message bus (Redis) and streamed to connected clients via WebSockets (`apps/realtime-service`).

---

## 2. Core Domain Event Definitions

### Event 1: `pose.frame.captured`
- **Source**: `urn:fitness:client:camera`
- **Type**: `pose.frame.captured`
- **Frequency**: 30-60 Hz (Local edge only)
- **Schema Payload**:
```json
{
  "specversion": "1.0",
  "type": "pose.frame.captured",
  "source": "urn:fitness:client:camera",
  "id": "evt_frame_98124",
  "time": "2026-11-16T03:15:00.120Z",
  "datacontenttype": "application/json",
  "data": {
    "frame_index": 4821,
    "timestamp_ms": 1794775855120,
    "landmarks_count": 33,
    "confidence_mean": 0.942,
    "angles": {
      "left_knee": 94.2,
      "right_knee": 95.1,
      "trunk_tilt": 28.4,
      "valgus_ratio": 0.89
    }
  }
}
```

---

### Event 2: `rep.completed`
- **Source**: `urn:fitness:fsm:squat`
- **Type**: `rep.completed`
- **Frequency**: Discrete (Once per finished rep)
- **Schema Payload**:
```json
{
  "specversion": "1.0",
  "type": "rep.completed",
  "source": "urn:fitness:fsm:squat",
  "id": "evt_rep_004",
  "time": "2026-11-16T03:15:04.450Z",
  "data": {
    "workout_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "rep_number": 4,
    "exercise": "squat",
    "min_knee_angle": 88.5,
    "max_knee_angle": 168.0,
    "duration_ms": 2340,
    "is_valid": true,
    "form_issues_count": 0
  }
}
```

---

### Event 3: `form.issue.detected`
- **Source**: `urn:fitness:fsm:squat`
- **Type**: `form.issue.detected`
- **Frequency**: On defect occurrence
- **Schema Payload**:
```json
{
  "specversion": "1.0",
  "type": "form.issue.detected",
  "source": "urn:fitness:fsm:squat",
  "id": "evt_issue_012",
  "time": "2026-11-16T03:15:06.110Z",
  "data": {
    "workout_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "rep_number": 5,
    "issue_code": "KNEE_VALGUS",
    "severity": "moderate",
    "valgus_ratio": 0.76,
    "feedback_cue": "Drive knees outward over pinky toes!",
    "timestamp_ms": 1794775861110
  }
}
```

---

### Event 4: `coach.feedback.generated`
- **Source**: `urn:fitness:ai:coach`
- **Type**: `coach.feedback.generated`
- **Frequency**: Post-set or post-workout
- **Schema Payload**:
```json
{
  "specversion": "1.0",
  "type": "coach.feedback.generated",
  "source": "urn:fitness:ai:coach",
  "id": "evt_coach_001",
  "time": "2026-11-16T03:16:30.000Z",
  "data": {
    "workout_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "intent": "workout_summary",
    "summary": "Strong volume with 14 out of 15 reps hitting below-parallel depth.",
    "actionable_cues": [
      "Drive knees outward during concentric ascent",
      "Slightly widen stance by 2 inches"
    ],
    "confidence_score": 0.94,
    "prompt_version": "v1.0.0"
  }
}
```
