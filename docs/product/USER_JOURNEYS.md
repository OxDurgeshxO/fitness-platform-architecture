# End-to-End User Journeys

## Overview
This document specifies the step-by-step user experience across four primary flows: Camera Onboarding & Calibration, Live Squat Tracking Session, Real-Time In-Flight Coaching, and Post-Workout Review.

---

## Journey 1: Setup, Permissions & Camera Calibration
```mermaid
flowchart TD
    A[Launch Web App] --> B[Request Camera Permission]
    B -->|Granted| C[Initialize MediaPipe WebAssembly Pipeline]
    B -->|Denied| D[Fallback to Kinematic Simulation Mode]
    C --> E[Camera Calibration Viewport]
    E --> F{Full Skeleton In Frame?}
    F -->|No: Ankle/Head Clipped| G[Show Boundary Alert: 'Step back 2 steps']
    F -->|Yes: 33 Landmarks Visible| H[Calibrate Resting Stance & Baseline Angles]
    H --> I[Green Ready HUD: 'Start Workout']
```

### Detailed Steps:
1. **Permission Handshake**: User opens application; app requests camera access with explicit privacy pledge ("All computer vision executes entirely on your device. Zero frames uploaded").
2. **Viewport Bounding Check**: System checks visibility confidence of 6 critical keypoints: nose, left/right hip, left/right knee, left/right ankle.
3. **Distance & Angle Guidance**: If ankles are truncated, audio cue announces: *"Step back slightly so feet and hips are fully visible."*
4. **Resting Baseline Capture**: Athlete stands in upright anatomical position for 1.5 seconds. Standing knee angle (~170°-180°) and trunk tilt baseline are locked into session state.

---

## Journey 2: Live Squat Workout Session & Kinematic State Transitions
```mermaid
sequenceDiagram
    autonumber
    actor Athlete
    participant Camera as Device Camera
    participant CV as Edge CV (MediaPipe + Angles)
    participant FSM as Biomechanical State Machine
    participant Audio as Speech Synthesis (TTS)
    participant Srv as Realtime Telemetry WebSocket

    Athlete->>Camera: Begins descent (eccentric phase)
    Camera->>CV: 30 FPS Video Frames
    CV->>CV: Extract 33 3D Landmarks & Calculate Angles
    CV->>FSM: FrameEvent(kneeAngle=140°, trunkAngle=25°)
    FSM->>FSM: State transition: STANDING -> DESCENDING
    
    Athlete->>Camera: Continues descent to bottom
    CV->>FSM: FrameEvent(kneeAngle=88°, valgusRatio=0.92)
    FSM->>FSM: State transition: DESCENDING -> BOTTOM (Valid Depth <95°)
    FSM->>Audio: Trigger Haptic / Subtle Tone: "Depth Reached"
    
    Athlete->>Camera: Ascent phase (concentric)
    CV->>FSM: FrameEvent(kneeAngle=168°, trunkAngle=18°)
    FSM->>FSM: State transition: BOTTOM -> ASCENDING -> STANDING
    FSM->>FSM: Increment Rep Count (Rep #1 Verified)
    FSM->>Audio: Voice Announcement: "One! Perfect depth."
    FSM->>Srv: Dispatch Event: `rep.completed`
```

---

## Journey 3: Real-Time Form Error Correction
```mermaid
flowchart LR
    A[Frame Captured] --> B[Calculate Valgus Ratio & Trunk Tilt]
    B --> C{Valgus Ratio < 0.85?}
    C -->|Yes: Knee Cave Detected| D[Throttle Audio: Ensure >2.5s since last cue]
    D --> E[Trigger Real-Time Audio: 'Push knees outward!']
    E --> F[Record FormIssue to Session Buffer]
    C -->|No: Knee Aligned| G{Lumbar Flexion > 25°?}
    G -->|Yes: Back Rounding| H[Trigger Audio: 'Chest up, brace core!']
    G -->|No| I[Continue Tracking]
```

---

## Journey 4: Post-Workout Biomechanical Review & Progress
1. **End Session Trigger**: Athlete presses "Complete Workout" or steps out of frame for >30 seconds.
2. **Session Aggregation**:
   - Total clean reps vs flagged reps.
   - Mean depth angle (e.g. 88.4°).
   - Valgus occurrence rate (e.g. 2 out of 15 reps).
   - Estimated caloric expenditure and anabolic strain index.
3. **AI Coach Debrief**: Generative coach ingests discrete session metrics and outputs structured feedback:
   - *Strengths*: "Exceptional depth consistency across sets 1 through 3."
   - *Biomechanical Focus*: "Reps 11-13 exhibited slight inward knee collapse on the concentric ascent."
   - *Actionable Cues*: "Incorporate banded goblet squats to reinforce gluteus medius recruitment."
