# Computer Vision Privacy Architecture & Zero-Retention Policy

## Executive Privacy Statement
The AI Biomechanical Fitness Platform is architected from the silicon up to guarantee **absolute visual privacy**. The platform operates under an immutable guarantee:
**Raw camera frames NEVER leave the athlete's local device volatile memory. No video or still image is ever persisted to local disk, transmitted across the network, or ingested by any cloud server.**

---

## 1. Edge-Only Processing Guarantee

```mermaid
flowchart LR
    A["Camera Hardware Sensor"] -->|Raw RGB Pixels| B["Client Device GPU / RAM (Volatile)"]
    B -->|Wasm / WebGL Inference| C["MediaPipe BlazePose Keypoints"]
    B -.->|IMMEDIATELY OVERWRITTEN / DESTROYED| X["[ZERO PERSISTENCE]"]
    C -->|33 (x, y, z) Normalized Floats| D["Local 3D Angle Calculations"]
    D -->|Aggregated Metrics & Event Tokens| E["Network Payload (WebSocket / API)"]
```

1. **In-Memory Frame Destruction**: Each camera frame ingested via `navigator.mediaDevices.getUserMedia` exists solely in ephemeral GPU texture / WebAssembly buffer memory for the single tick required to infer landmark coordinates ($\approx 15\text{ ms}$). Once the forward pass completes, the frame buffer is immediately overwritten by the subsequent frame.
2. **Zero Disk Caching**: The web application never registers ServiceWorker video caches, IndexDB image blobs, or temporary video files.
3. **Network Quarantine**: Network inspection logs confirm that HTTP and WebSocket payloads transmit ONLY structured numeric arrays (joint coordinates, angles, rep integers) and event strings. Zero binary image payloads (`image/jpeg`, `image/png`, `video/mp4`) are ever emitted.

---

## 2. Telemetry Anonymization & Data Minimization
- **Coordinate Normalization**: Transmitted landmark arrays are normalized relative to hip-center and torso length, stripping biometric scale identifiers that could correlate to specific individuals.
- **Opt-In Session Streaming**: Users maintain full granular control to toggle real-time WebSocket session telemetry on or off without affecting local audio coaching cues.
- **Biometric Identification Ban**: The platform contains no facial recognition, iris scanning, gait fingerprinting, or biometric identity verification models.
