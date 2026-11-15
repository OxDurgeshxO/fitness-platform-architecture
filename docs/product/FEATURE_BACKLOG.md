# Product Feature Backlog & MoSCoW Prioritization

## Prioritization Methodology
Items are prioritized using the MoSCoW framework (Must have, Should have, Could have, Won't have) and scored using the ICE framework (Impact, Confidence, Ease: 1-10 scale).

---

## 1. Must Have (P0 - MVP Release)
| ID | Feature | Description | ICE Score | Status |
| :--- | :--- | :--- | :--- | :--- |
| **P0-01** | **Squat Kinematic State Machine** | Multi-phase state machine tracking standing, descent, inflection, ascent, and rep completion with threshold hysteresis. | $9 \times 9 \times 8 = 648$ | **Complete** |
| **P0-02** | **3D Joint Vector Math** | Vector calculations for knee flexion, hip angle, trunk angle, and frontal knee valgus ratio. | $9 \times 9 \times 9 = 729$ | **Complete** |
| **P0-03** | **Real-Time Audio Coaching** | Instant spoken cues for knee cave, shallow depth, and lumbar flexion. | $9 \times 8 \times 8 = 576$ | **Complete** |
| **P0-04** | **Privacy Architecture** | Zero-frame-transmission design; edge inference with ephemeral coordinate vectors only. | $10 \times 10 \times 8 = 800$ | **Complete** |
| **P0-05** | **Post-Session Performance Ledger** | Persistent database storage for reps, form accuracy, strain index, and caloric estimates. | $8 \times 9 \times 9 = 648$ | **Complete** |

---

## 2. Should Have (P1 - Post-MVP v1.1)
| ID | Feature | Description | ICE Score | Target |
| :--- | :--- | :--- | :--- | :--- |
| **P1-01** | **Push-Up Kinematic Engine** | Track shoulder-elbow-wrist angle ($90^\circ$ elbow depth) and core pelvic sagging. | $8 \times 8 \times 8 = 512$ | Sprint 3 |
| **P1-02** | **Romanian Deadlift (RDL)** | Hip hinge kinematics, hamstring stretch inflection, and neutral lumbar spine maintenance. | $8 \times 7 \times 7 = 392$ | Sprint 4 |
| **P1-03** | **Barbell Path Tracking** | Virtual bar tracking estimating vertical trajectory deviation and forward bar drift. | $7 \times 7 \times 6 = 294$ | Sprint 5 |
| **P1-04** | **WebRTC Live Tele-Coaching** | Peer-to-peer data channel allowing a human coach to view skeletal wireframe in real-time. | $8 \times 6 \times 5 = 240$ | Sprint 6 |

---

## 3. Could Have (P2 - Expansion v1.2)
| ID | Feature | Description | ICE Score | Target |
| :--- | :--- | :--- | :--- | :--- |
| **P2-01** | **Apple Health & Google Fit BLE** | Sync active workout calories, heart rate zones, and HRV recovery status. | $7 \times 8 \times 6 = 336$ | Q3 2027 |
| **P2-02** | **Multi-Athlete Gym Mode** | Tracking multiple lifters on separate squat racks within a single wide-angle lens. | $6 \times 5 \times 4 = 120$ | Q4 2027 |
| **P2-03** | **Voice-Activated Set Control** | Hands-free commands: *"Hey Coach, start set 2"*, *"Pause session"*. | $6 \times 7 \times 7 = 294$ | Q3 2027 |
| **P2-04** | **3D Biomechanical Avatar** | Three.js interactive 3D model replay showing joint stress heatmaps. | $7 \times 6 \times 5 = 210$ | Q4 2027 |

---

## 4. Won't Have (P3 - Explicit Exclusions)
- **Proprietary Hardware Mirrors or Smart Cables**: Software and web first.
- **Unregulated Medical Diagnoses**: The platform will never provide orthopedic injury diagnoses.
