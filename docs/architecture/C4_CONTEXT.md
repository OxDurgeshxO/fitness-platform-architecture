# C4 Architecture: System Context

## System Context Diagram
The System Context diagram illustrates the AI Biomechanical Fitness Platform, its human actors, and external system integrations.

```mermaid
flowchart TD
    subgraph Athletes and Coaches
        Athlete["Athlete / Lifter<br/>[Person]<br/>Performs squats with camera supervision"]
        Coach["Remote Strength Coach<br/>[Person]<br/>Reviews kinematic form logs & progress"]
    end

    subgraph Platform["AI Biomechanical Platform (System Boundary)"]
        FitnessPlatform["AI Biomechanical Platform<br/>[Software System]<br/>Edge CV pose estimation, rep counting,<br/>real-time audio cues & LLM debriefs"]
    end

    subgraph External Systems
        LLMProvider["Generative AI Provider<br/>[External System]<br/>Gemini 2.5 Flash / Claude 3.5 Sonnet API"]
        WearableBLE["Wearable Devices (BLE)<br/>[External Device]<br/>Polar H10 / Apple Watch heart rate"]
        ObjectStore["Cloudflare R2 / S3<br/>[External System]<br/>Static assets, PWA manifests, export archives"]
    end

    Athlete -->|Captures camera video locally, receives audio cues & reviews stats| FitnessPlatform
    Coach -->|Audits athlete session telemetry & form breakdown events| FitnessPlatform
    FitnessPlatform -->|Requests structured debriefs with strict JSON schema| LLMProvider
    Athlete -->|Streams heart rate & HRV metrics over Web Bluetooth| FitnessPlatform
    FitnessPlatform -->|Stores and retrieves immutable web assets| ObjectStore
```

---

## 1. Primary Actors
- **Athlete / Lifter**: Primary user executing training movements in front of a web camera or smartphone. Receives real-time spoken cues, visual HUD angles, and post-session coaching summaries.
- **Remote Strength Coach (CSCS)**: Secondary user reviewing high-resolution kinematic timelines, form breakdown alerts, and longitudinal performance trends for clients.

---

## 2. External System Integrations
- **Generative AI Provider**: Cloud LLM API queried asynchronously for natural language debrief synthesis, nutrition planning, and periodization logic.
- **Bluetooth Low Energy (BLE) Wearables**: Local Web Bluetooth connection with chest-strap heart rate monitors (Polar H10) and smartwatches for Zone 1-5 aerobic tracking.
- **Static Object Storage (S3 / R2)**: Hosts compiled client bundles, PWA service worker manifests, and exportable data archives.
