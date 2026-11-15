# Product Roadmap: 2026 – 2027

## Roadmap Overview
A phased execution plan taking the AI Biomechanical Platform from a single-exercise MVP to an enterprise-grade multi-movement athletic intelligence operating system.

```mermaid
flowchart LR
    M1["Q4 2026: Phase 1<br/>MVP Squat Slice"] --> M2["Q1 2027: Phase 2<br/>Upper Body & WebRTC"]
    M2 --> M3["Q2 2027: Phase 3<br/>Ecosystem & Wearables"]
    M3 --> M4["Q3 2027: Phase 4<br/>Enterprise & Clinical"]
```

---

## Phase 1: MVP Vertical Slice (Q4 2026) — CURRENT
- **Focus**: Squat biomechanics, single-camera edge tracking, real-time audio coaching, and zero-leakage privacy verification.
- **Deliverables**:
  - Full Squat FSM (`STANDING`, `DESCENDING`, `BOTTOM`, `ASCENDING`, `COMPLETED_REP`).
  - 3D joint angle engine (bilateral knee flexion, hip angle, trunk angle, valgus index).
  - Low-latency voice cues via Web Speech API.
  - Relational persistence in PostgreSQL via Drizzle ORM.
  - Real-time WebSocket streaming service (`apps/realtime-service`).
  - Automated CI test harness and 46+ passing unit tests.

---

## Phase 2: Core Movement Expansion & WebRTC (Q1 2027)
- **Focus**: Expanding exercise catalog to standard foundational compound lifts and enabling peer-to-peer remote coaching.
- **Deliverables**:
  - **Push-Up FSM**: Elbow angle tracking, chest depth ($<90^\circ$), and core sagging detection.
  - **Romanian Deadlift (RDL) FSM**: Hip hinge trajectory, hamstring stretch inflection, and neutral spine safety bounds.
  - **WebRTC Coach Telepresence**: Real-time skeletal coordinate streaming allowing human CSCS coaches to supervise remote athletes with $<50\text{ ms}$ glass-to-glass latency.
  - **Progressive Web App (PWA)**: Offline landmark caching and local storage synchronization for zero-connectivity gym basements.

---

## Phase 3: Wearable Fusion & Advanced Kinematics (Q2 2027)
- **Focus**: Multi-modal sensor fusion combining vision with biometric telemetry.
- **Deliverables**:
  - **Bluetooth Low Energy (BLE) Heart Rate**: Real-time integration with Polar H10 and Apple Watch (Zone 1-5 aerobic tracking).
  - **Barbell Velocity Based Training (VBT)**: Mean concentric velocity (m/s) calculation to detect neurological fatigue and predict 1RM in real-time.
  - **Multi-Camera Synchronized Capture**: Connecting two smartphone cameras (sagittal + frontal) via local WebRTC for 3D multi-planar volumetric reconstruction.

---

## Phase 4: Enterprise, Clinical & Team Athletic OS (Q3 2027)
- **Focus**: Sports medicine, physical therapy clinics, and university athletic departments.
- **Deliverables**:
  - **HIPAA-Compliant Electronic Health Record (EHR) Export**: Direct HL7 / FHIR export for post-operative orthopedic recovery tracking.
  - **Team Dashboard**: Multi-athlete roster view for collegiate strength and conditioning directors.
  - **Federated Edge Learning**: Anonymized on-device model fine-tuning to improve landmark accuracy on diverse clothing styles and body types without centralizing user images.
