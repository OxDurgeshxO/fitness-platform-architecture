# System Privacy-by-Design Architecture

## 1. Core Architectural Pillars
The AI Biomechanical Platform implements privacy-by-design at every system layer:

1. **Edge-First Computation**: Computer vision inference (MediaPipe BlazePose) runs strictly inside the client's browser (WebAssembly / WebGL). Raw video frames are processed in volatile memory and instantly overwritten.
2. **Data Minimization (GDPR Art 5)**: The platform only transmits discrete numeric vectors (e.g. `knee_angle: 92.4`) and event tokens (`rep.completed`). Zero facial images or ambient background audio are captured.
3. **End-to-End Encryption**: All transport is secured via TLS 1.3 / WSS with strict forward secrecy.
4. **Zero Third-Party Ad Trackers**: The codebase contains zero marketing trackers, tracking pixels, or third-party behavioral analytics scripts.
5. **HIPAA & GDPR Portability**: Self-hostable database architecture allows physical therapy clinics to deploy in air-gapped or dedicated private VPCs compliant with HIPAA Security Rule specifications.

---

## 2. Compliance Checklist

| Standard / Regulation | Platform Mechanism | Status |
| :--- | :--- | :--- |
| **GDPR Art 9 (Special Category Biometrics)** | No biometric facial recognition or identity extraction; edge-only pose coordinates. | **Compliant** |
| **GDPR Art 20 (Data Portability)** | Single-click full JSON export endpoint (`/api/v1/ecosystem/export`). | **Compliant** |
| **GDPR Art 17 (Right to Erasure)** | Cascade deletion purging all relational rows and Redis cache keys. | **Compliant** |
| **COPPA / Minor Safety** | Minimum age requirement ($\ge 14$ years); zero commercial data monetization. | **Compliant** |
| **HIPAA Security Rule (Self-Hosted)** | AES-256 data at rest in PostgreSQL; TLS 1.3 in transit; audit logging. | **Compliant** |
