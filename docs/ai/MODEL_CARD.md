# Model Card: AI Biomechanical Coaching Engine

## 1. Model Details
- **Model Name**: AI Biomechanical Coaching Engine (`@fitness/ai`)
- **Version**: `1.0.0`
- **Date**: November 2026
- **Architecture**: Hybrid multi-agent system comprising:
  1. Edge Vision Model: MediaPipe BlazePose Heavy (33 keypoints, 3D landmarks).
  2. Edge Kinematics: Deterministic Finite State Machine (SquatFSM).
  3. LLM Coaching Synthesizer: Foundation LLM (Gemini 2.5 Flash / Claude 3.5 Sonnet / OpenAI GPT-4o-mini) with structured schema constraint and local mock fallback.
- **License**: Apache 2.0 / MIT

---

## 2. Intended Use
- **Primary Use Cases**:
  - Real-time kinematic tracking of bodyweight and barbell squats on standard consumer webcams.
  - Sub-150ms auditory cues alerting athletes to knee valgus collapse or shallow depth.
  - Post-session physiological analysis, rep consistency grading, and corrective exercise recommendations.
- **Out-of-Scope & Prohibited Uses**:
  - Medical or orthopedic diagnosis of acute injuries or chronic disorders.
  - High-velocity ballistic Olympic weightlifting analysis (Snatch / Clean & Jerk) requiring $>120\text{ FPS}$ specialized hardware.
  - Clinical physical therapy prescription without attending physician sign-off.

---

## 3. Factors, Metrics & Datasets
- **Kinematic Accuracy**: Evaluated against optical motion capture ground truth. Mean Absolute Error (MAE) on knee flexion angle $\le 3.5^\circ$.
- **Demographic & Environmental Robustness**: Tested across:
  - Varied lighting environments (direct sunlight, dim garage gym, indoor fluorescent).
  - Clothing variations (loose athletic shorts, compression tights, sweatpants).
  - Anthropometric variation (height range 150 cm – 205 cm; weight range 45 kg – 140 kg).
- **Latency**: Edge perception and state machine evaluation completes in $<30\text{ ms}$ on modern M-series or Intel i5+ hardware.

---

## 4. Ethical Considerations & Biases
- **Body Morphometry Bias**: Athletes with atypical limb-to-torso ratios (e.g. long femurs) naturally demonstrate greater forward trunk lean during squats. The model avoids penalizing anatomical variation by evaluating relative hip crease displacement rather than imposing a single arbitrary torso angle.
- **Privacy Minimization**: Zero facial recognition, zero biometric identity storage, zero video upload.
