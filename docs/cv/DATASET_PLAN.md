# Biomechanical Dataset Strategy & Validation Corpus

## Overview
High kinematic reliability across diverse environments requires a disciplined dataset curation, synthetic augmentation, and manual annotation strategy.

---

## 1. Multi-Angle Kinematic Recording Matrix
The validation benchmark corpus contains video recordings structured across three spatial capture angles:
1. **Sagittal Plane ($90^\circ$ Perpendicular Lateral)**:
   - Primary metric: Pure knee flexion angle, hip crease depth, trunk inclination, bar path linearity.
2. **Frontal Plane ($0^\circ$ Direct Face-On / Back-On)**:
   - Primary metric: Medial-lateral knee valgus collapse, foot flare symmetry, pelvic lateral tilt.
3. **Oblique / Semi-Sagittal ($45^\circ$ Perspective)**:
   - Evaluates single-camera 3D coordinate estimation robustness under non-ideal consumer placement.

---

## 2. Demographic & Environmental Stratification
To ensure zero algorithmic bias across anthropometry and home gym layouts:
- **Body Typology**:
  - Ectomorph / Long-femur lifters ($n = 20$).
  - Mesomorph / Balanced ratios ($n = 25$).
  - Endomorph / Short-femur powerlifters ($n = 20$).
  - Height distribution: $152\text{ cm}$ to $203\text{ cm}$.
- **Attire Variability**:
  - Fitted athletic shorts & sports bras (optimal keypoint visibility).
  - Baggy sweatpants & oversized hoodies (evaluates occlusion resilience).
- **Illumination Spectra**:
  - High ambient natural daylight ($>1,000\text{ lux}$).
  - Dim residential lighting ($100 - 250\text{ lux}$).
  - High backlighting (athlete positioned directly in front of window).

---

## 3. Ground Truth Annotation Standards
1. **3D Optical Motion Capture (Vicon / Qualisys)**: 12-camera retro-reflective marker clusters attached to bony landmarks (anterior superior iliac spine, lateral femoral epicondyle, lateral malleolus). Provides millimeter-level millimeter ground truth.
2. **Double-Blind CSCS Coach Labeling**: Two certified strength coaches independently annotate rep start, minimum depth inflection frame, lockout frame, and discrete form faults (valgus, butt wink).
3. **Inter-Annotator Agreement**: Cohen's kappa $\kappa \ge 0.94$ required before inclusion in golden validation benchmark.
