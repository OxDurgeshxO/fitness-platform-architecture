# Exercise Library & Movement Specifications

## Overview
Defines the biomechanical joint tracking, thresholds, and state definitions across the platform's supported movements.

---

## 1. Supported Movement: Squat (MVP Core)
- **Exercise ID**: `squat`
- **Category**: Compound Lower Body (Strength / Hypertrophy)
- **Primary Joint**: Knee Flexion / Extension (Landmarks 23-25-27 / 24-26-28)
- **Secondary Joints**: Hip Flexion (11-23-25), Ankle Dorsiflexion (25-27-31), Trunk Tilt.
- **Biomechanical Stages**:
  1. `STANDING`: Upright lockout ($>160^\circ$).
  2. `DESCENDING`: Eccentric lowering ($<150^\circ$ and negative angular velocity).
  3. `BOTTOM`: Turning point / maximum depth achieved ($<100^\circ$).
  4. `ASCENDING`: Concentric drive ($>105^\circ$ and positive angular velocity).
  5. `COMPLETED_REP`: Return to standing extension ($>160^\circ$).
- **Key Form Errors Tracked**:
  - `KNEE_VALGUS`: Inward collapse of knees toward midline ($R_{valgus} < 0.82$).
  - `SHALLOW_DEPTH`: Reversal before reaching valid parallel ($>100^\circ$).
  - `FORWARD_TRUNK_LEAN`: Chest pitching excessively forward ($>45^\circ$).
  - `ASYMMETRIC_DRIVE`: Disparity between left and right knee extension rate ($>12\%$).

---

## 2. Planned Movement: Standard Push-Up (v1.1)
- **Exercise ID**: `pushup`
- **Category**: Compound Upper Body (Push)
- **Primary Joint**: Elbow Flexion / Extension (Landmarks 11-13-15 / 12-14-16)
- **Secondary Joints**: Shoulder Angle, Pelvic Core Alignment (Shoulder-Hip-Ankle line).
- **Thresholds**:
  - Full extension (Top plank): $>160^\circ$.
  - Chest depth (Bottom): $\le 90^\circ$ elbow flexion.
- **Key Form Errors Tracked**:
  - `PELVIC_SAG`: Hip dropping below shoulder-ankle vector (Lumbar hyperextension).
  - `ELBOW_FLARE`: Upper arms perpendicular to torso ($>75^\circ$ shoulder abduction).

---

## 3. Planned Movement: Romanian Deadlift (v1.1)
- **Exercise ID**: `romanian_deadlift`
- **Category**: Posterior Chain (Hinge)
- **Primary Joint**: Hip Angle (Landmarks 11-23-25)
- **Key Constraint**: Knee flexion must remain soft but static ($150^\circ - 165^\circ$) while hip hinges back.
- **Key Form Errors Tracked**:
  - `LUMBAR_ROUNDING`: Spinal flexion under tension.
  - `SQUATTING_THE_HINGE`: Excessive knee bend ($<130^\circ$).
