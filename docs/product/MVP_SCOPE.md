# MVP Scope & Delivery Boundaries

## 1. Executive Definition of MVP
The Minimum Viable Product (MVP) delivers **one flawless, vertically integrated exercise slice: the Barbell / Bodyweight Squat**. The MVP proves the end-to-end viability of sub-150ms edge computer vision, deterministic biomechanical state machine rep counting, real-time audio coaching cues, and AI-driven post-workout physiological analysis without requiring specialized hardware or cloud video streaming.

---

## 2. In-Scope Capabilities (MVP Release)

### A. Edge Computer Vision & Kinematics
- **Single Exercise**: Standard Squat (bodyweight, goblet, or barbell back squat).
- **Client-Side Landmark Inference**: MediaPipe BlazePose / MoveNet executing in WebAssembly / WebGL on client device.
- **Angle Calculation Engine**:
  - Bilateral knee flexion angle (Hip-Knee-Ankle 3D coordinate vector).
  - Hip flexion angle (Shoulder-Hip-Knee).
  - Trunk forward lean (Shoulder-Hip relative to vertical axis).
  - Frontal-plane knee valgus collapse ratio ($d_{knee} / d_{ankle}$).
- **Signal Conditioning**: Exponential moving average and $1€$ filter to eliminate high-frequency video jitter.

### B. Biomechanical State Machine
- **States**: `STANDING`, `DESCENDING`, `BOTTOM`, `ASCENDING`, `COMPLETED_REP`, `FAULT`.
- **Rep Validation**: Strict angular depth gate (minimum knee flexion $< 100^\circ$ for parallel, $< 85^\circ$ for deep).
- **Form Error Detection**:
  - `KNEE_VALGUS`: Inward knee collapse during ascent or bottom hold.
  - `FORWARD_TRUNK_LEAN`: Excessive forward spinal tilt ($> 45^\circ$).
  - `INCOMPLETE_DEPTH`: Reversing direction before reaching $< 100^\circ$.
  - `INCOMPLETE_LOCKOUT`: Failing to return to $> 165^\circ$ standing lockout.

### C. Real-Time Coaching & Speech Synthesis
- **Instant Auditory Cues**: Web Speech API TTS / low-latency audio synthesized cues throttled to max 1 alert per 2.5 seconds.
- **Visual Telemetry Overlay**: HTML5 Canvas rendering skeletal joints with color coding (Green: good alignment, Amber: warning, Red: form breakdown).

### D. Data Persistence & Architecture
- **PostgreSQL / Drizzle Schema**: Normalized relational storage for `users`, `workouts`, `workout_reps`, `form_issues`, and `coaching_feedbacks`.
- **WebSocket Streaming**: Real-time telemetry transport (`apps/realtime-service`) on port 8080.
- **Deterministic AI Coach**: Structured coaching engine with versioned prompt templates and local mock fallback.

---

## 3. Explicit Out-of-Scope (Non-Goals for MVP)
| Capability | Reason for Exclusion in MVP | Target Milestone |
| :--- | :--- | :--- |
| **Complex Multi-Joint Olympic Lifts** | Snatch, Clean & Jerk require high-speed multi-angle tracking (>120 FPS). | Phase 3 (v2.0) |
| **Cloud Video Storage & Streaming** | Violates core privacy pledge; increases operational bandwidth costs. | Explicitly Never |
| **Automated Stripe Subscription Billing** | Premature monetization before core kinematic retention is verified. | Phase 2 (v1.2) |
| **Multi-Athlete Simultaneous Tracking** | Requires multi-person bounding box association overhead. | Phase 3 (v2.2) |
| **Native iOS/Android App Store Builds** | PWA / Mobile Web with WebRTC delivers instant cross-platform coverage. | Phase 2 (v1.1) |
| **Custom Hardware Sensor Integration** | Proprietary BLE goniometers / IMUs contradict commodity-hardware vision. | Phase 3 (v2.5) |

---

## 4. MVP Acceptance Criteria
1. **Rep Counting Accuracy**: On a standardized 20-rep test set of clean squats, the system must register exactly 20 reps (zero false positives, zero missed reps).
2. **Valgus Error Detection**: 100% of intentional inward knee collapses ($> 15\%$ medial displacement) trigger an auditory correction within 250ms.
3. **Zero Frame Leakage**: Automated network inspection confirms 0 bytes of video or canvas image data are transmitted across HTTP or WebSocket endpoints.
4. **End-to-End Latency**: Frame capture to UI HUD angle display $< 35\text{ ms}$; Frame to speech synthesis cue $< 150\text{ ms}$.
5. **Cold Start Build**: `pnpm build` and `pnpm test` pass cleanly with zero compiler warnings or type failures across monorepo packages.
