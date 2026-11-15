# Computer Vision Evaluation Protocol & Benchmark Gates

## 1. Benchmarking Protocol
Every pull request or update to the computer vision pipeline (`packages/cv` or `packages/pose-engine`) must execute the automated kinematic evaluation protocol against the Golden Validation Corpus.

---

## 2. Quantitative Verification Targets

| Verification Gate | Test Methodology | MVP Pass Threshold | Release Target |
| :--- | :--- | :--- | :--- |
| **Rep Counting Precision** | Number of detected reps vs manual ground truth count | $\ge 98.0\%$ | $\ge 99.5\%$ |
| **False Positive Reps** | Spurious reps counted while athlete is racking weight or resting | **$0$ reps** (Zero tolerance) | **$0$ reps** |
| **Mean Absolute Angular Error (MAE)** | Comparison with optical motion capture markers | $\le 3.5^\circ$ | $\le 2.0^\circ$ |
| **Knee Valgus F1-Score** | Harmonic mean of precision and recall on intentional valgus | $\ge 0.92$ | $\ge 0.96$ |
| **Execution Latency** | Benchmark per-frame processing time on standard laptop CPU | $\le 28.0\text{ ms}$ | $\le 16.0\text{ ms}$ |
| **Hysteresis Anti-Challenger**| Synthetic noisy jitter injected ($+/- 4^\circ$) around $100^\circ$ boundary | Zero state fluttering | Zero state fluttering |

---

## 3. Automated Regression Harness (`tests/cv_benchmark.test.ts`)
The benchmark harness processes synthetic and pre-recorded landmark frames through `SquatFSM`:
1. **Clean Rep Sequence**: Feeds a smooth 20-rep sequence ($170^\circ \to 85^\circ \to 170^\circ$). Asserts that `fsm.getReps()` equals exactly $20$.
2. **Shallow Rep Sequence**: Feeds a 10-rep sequence where depth stops at $110^\circ$. Asserts that `fsm.getReps()` equals $0$ and that 10 `SHALLOW_DEPTH` issues are logged.
3. **Valgus Inward Defect**: Injects $R_{valgus} = 0.72$ at the ascent transition. Asserts that `KNEE_VALGUS` is detected and auditory cue is triggered within 1 frame.
4. **Latency Measurement**: Executes 1,000 continuous frames and computes the 99th percentile processing time.
