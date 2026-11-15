# C4 Architecture: Container Diagram

## Container Diagram
The Container diagram illustrates the high-level services, frontends, data stores, and communication protocols composing the AI Biomechanical Platform.

```mermaid
flowchart TD
    subgraph Client Tier["Client Device (Edge / Browser)"]
        WebApp["Web Application (PWA)<br/>[Next.js 14, React, Tailwind, Lucide]<br/>Renders UI, HUD, and audio synthesis"]
        EdgeCV["Edge CV & Kinematics Engine<br/>[Wasm / WebGL, MediaPipe BlazePose, @fitness/cv]<br/>Runs 30-60 FPS local joint tracking & FSM"]
    end

    subgraph Backend Services["Backend Services Tier"]
        RealtimeSvc["Realtime Telemetry Service<br/>[Node.js, ws, TypeScript :8080]<br/>Handles WebSocket streaming, rep broadcast & metrics"]
        CoreAPI["Core REST API<br/>[Node.js / FastAPI :8000]<br/>User management, workout ledger, AI coach router"]
    end

    subgraph Data Stores["Data & Observability Tier"]
        PostgresDB[("PostgreSQL Database :5432<br/>[Drizzle ORM]<br/>Users, workouts, reps, issues, achievements")]
        RedisCache[("Redis Cache :6379<br/>[ioredis]<br/>Session states, ephemeral rate limits, leaderboard")]
        Prometheus["Prometheus Observability :9121<br/>[prom-client]<br/>Telemetry metrics, rep latency, error rates"]
    end

    subgraph External LLM["AI Infrastructure"]
        LLM["Foundation LLM API<br/>[Gemini / Claude / OpenAI]<br/>Structured coaching responses"]
    end

    WebApp -->|Local frame buffer (volatile)| EdgeCV
    EdgeCV -->|Local angle state & events| WebApp
    WebApp -->|WebSocket :8080 (Telemetry frames & events)| RealtimeSvc
    WebApp -->|HTTPS :8000 (REST requests)| CoreAPI
    RealtimeSvc -->|Pub/Sub & state buffer| RedisCache
    CoreAPI -->|Reads / Writes relational data| PostgresDB
    CoreAPI -->|Cache lookups & leaderboards| RedisCache
    CoreAPI -->|Structured prompt requests| LLM
    RealtimeSvc -->|Scrapes :9121/metrics| Prometheus
    CoreAPI -->|Scrapes :8000/metrics| Prometheus
```

---

## 1. Container Responsibilities

### A. Web Application (`apps/web`)
- **Technologies**: Next.js 14 (App Router), React, Tailwind CSS, Lucide Icons, Web Speech API.
- **Responsibilities**: Interactive UI, camera calibration overlay, live rep counter, real-time voice synthesis, session performance history, and coaching chat drawer.

### B. Edge CV & Kinematics Engine (`packages/cv` & `packages/pose-engine`)
- **Technologies**: MediaPipe BlazePose WebAssembly/WebGL, 1€ Filter, TypeScript.
- **Responsibilities**: 33-landmark coordinate extraction, 3D trigonometric dot-product angles, frontal knee valgus ratio calculation, and SquatFSM state evaluation.

### C. Realtime Telemetry Service (`apps/realtime-service`)
- **Technologies**: Node.js, `ws`, TypeScript.
- **Port**: `:8080` (WebSocket) and `:9121` (Prometheus metrics).
- **Responsibilities**: Ingests real-time coordinate frames, broadcasts live rep events to connected coach/telemetry dashboards, records telemetry throughput metrics.

### D. Core REST API (`apps/api`)
- **Technologies**: Node.js / FastAPI, Pydantic / Zod.
- **Port**: `:8000`.
- **Responsibilities**: Authenticates users, records finalized workout sets, exposes exercise catalog, routes prompts to foundation LLMs with structured schema guarantees.

### E. PostgreSQL Database (`packages/db`)
- **Technologies**: PostgreSQL 16, Drizzle ORM.
- **Responsibilities**: Persistent normalized storage for user profiles, workouts, reps, form error occurrences, and gamification achievements.
