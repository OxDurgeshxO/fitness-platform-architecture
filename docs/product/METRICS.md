# Telemetry, Accuracy & Engineering Metrics

## 1. Biomechanical & Computer Vision Metrics
| Metric Name | Mathematical Definition | Target Threshold | Monitoring Mechanism |
| :--- | :--- | :--- | :--- |
| **Rep Counting Precision** | $\frac{TP}{TP + FP}$ | $\ge 99.0\%$ | Automated test harness on labeled video corpus. |
| **Rep Counting Recall** | $\frac{TP}{TP + FN}$ | $\ge 98.5\%$ | Daily regression tests across diverse body types. |
| **Mean Absolute Error (MAE) - Knee Flexion** | $\frac{1}{N} \sum_{i=1}^N \|\theta_{est} - \theta_{mocap}\|$ | $\le 3.5^\circ$ | Optical motion capture benchmark suite. |
| **Knee Valgus Sensitivity** | True positive detection of $>15\%$ medial displacement | $\ge 96.0\%$ | Synthetic skeletal perturbation suite. |
| **Tracking Confidence Score** | Mean visibility score of tracked joint keypoints | $\ge 0.75$ | In-flight telemetry logger. |

---

## 2. Latency Budget & Systems Performance
| Stage | Description | Budget | Hard Ceiling |
| :--- | :--- | :--- | :--- |
| **Camera Acquisition** | WebRTC / MediaDevices video frame arrival | $16.6\text{ ms}$ (60 FPS) / $33.3\text{ ms}$ (30 FPS) | $35\text{ ms}$ |
| **Landmark Inference** | MediaPipe BlazePose WebAssembly/GPU pass | $18.0\text{ ms}$ | $30.0\text{ ms}$ |
| **1€ Smoothing Filter** | Dual-pass low-pass coordinate stabilization | $0.8\text{ ms}$ | $2.0\text{ ms}$ |
| **3D Vector Angle Engine** | Trigonometric dot product and valgus calculations | $0.5\text{ ms}$ | $1.5\text{ ms}$ |
| **State Machine Evaluation**| SquatFSM transition check & issue detection | $0.4\text{ ms}$ | $1.0\text{ ms}$ |
| **Local Canvas HUD Render**| Drawing skeleton, angle arcs, and text | $4.0\text{ ms}$ | $8.0\text{ ms}$ |
| **Speech Audio Trigger** | Web Speech API audio start latency | $80.0\text{ ms}$ | $150.0\text{ ms}$ |
| **Total Frame-to-Speech** | **End-to-End Perception to Reaction** | **$\le 120\text{ ms}$** | **$\le 180\text{ ms}$** |

---

## 3. Product & Engagement KPIs
- **Daily Active Athletes (DAA)**: Athletes completing at least one monitored set per 24 hours.
- **Set Completion Quality (SCQ)**: Percentage of sets completed with average form accuracy $\ge 85\%$.
- **Form Error Remedy Rate (FERR)**: Percentage of athletes who correct valgus or depth within 2 reps following an auditory cue.
- **30-Day Retention Curve**: Benchmark target $\ge 45\%$ active at Day 30.

---

## 4. Operational & Reliability SLA
- **WebSocket Streaming Availability**: $99.95\%$ uptime for `apps/realtime-service`.
- **Postgres API p99 Latency**: $\le 65\text{ ms}$ for session summary logging and ledger retrieval.
- **Zero Video Frame Ingestion**: $0\text{ bytes}$ of raw pixel video recorded on any non-client server.
