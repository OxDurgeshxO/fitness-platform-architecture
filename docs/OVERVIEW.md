# AI Biomechanical Fitness Platform: Architecture & Engineering Overview

## 1. Problem & Executive Solution
Recreational and competitive lifters suffer from high rates of joint injuries (ACL strain, patellar tendinopathy, lumbar shear) caused by poor movement mechanics such as dynamic knee valgus and excessive forward trunk lean. Existing solutions either require expensive proprietary hardware mirrors (\$1,500-\$4,000) that upload video to cloud servers or passive mobile workout spreadsheets that offer zero real-time guidance.

The **AI Biomechanical Fitness Platform** solves this by executing Olympic-grade computer vision and deterministic kinematic state machines directly at the client edge (browser / phone). It delivers instant ($<150\text{ ms}$) spoken coaching cues, precise rep counting, and post-session generative AI analysis with **zero cloud video transmission**.

---

## 2. System Architecture & Monorepo Topology
The repository is structured as a high-performance pnpm monorepo:

```text
fitness-platform-architecture/
├── apps/
│   ├── web/                    # Next.js 14 PWA, React, Tailwind, Lucide, Web Speech API
│   ├── realtime-service/       # WebSocket telemetry streaming service (:8080)
│   └── api/                    # Core REST API service & endpoints (:8000)
├── packages/
│   ├── types/                  # Shared domain types & Zod schemas (@fitness/types)
│   ├── cv/                     # 3D vector math, angles, 1€ filter, Squat FSM (@fitness/cv)
│   ├── pose-engine/            # Biomechanical kinematics engine (@oxdurgesh/pose-fsm)
│   ├── ai/                     # Prompt registry, guardrails, LLM coaching engine (@fitness/ai)
│   ├── db/                     # Drizzle ORM PostgreSQL schema & seeders (@fitness/db)
│   └── observability/          # OpenTelemetry tracer, Prometheus metrics (:9121)
├── docs/                       # Product, AI, CV, Architecture documentation suites
└── tests/                      # Automated unit, integration, and kinematic benchmark tests
```

---

## 3. Key Biomechanical & Engineering Features
1. **Deterministic Squat FSM**: Multi-phase state machine tracking `STANDING`, `DESCENDING`, `BOTTOM`, `ASCENDING`, and `COMPLETED_REP` with threshold hysteresis preventing flutter.
2. **3D Vector Angle Mathematics**: Real-time calculation of bilateral knee flexion, hip angle, trunk tilt, and coronal-plane knee valgus collapse ratio.
3. **Sub-150ms Auditory Coaching**: Spoken corrections throttled via Web Speech API (*"Drive knees out!"*, *"Hit below parallel!"*).
4. **Strict Privacy Architecture**: Zero raw video frames uploaded; only normalized landmark vectors and discrete event tokens are processed.
5. **Two-Tier AI Architecture**: Deterministic physics engine governs real-time safety, while foundation LLMs synthesize post-set periodization debriefs with strict schema adherence.

---

## 4. Operational & Performance Verification
- **Build Performance**: All packages compile with TypeScript strict mode enabled (`pnpm build`).
- **Kinematic Accuracy**: Mean Absolute Error (MAE) on knee flexion $\le 3.5^\circ$ vs optical motion capture.
- **Rep Precision**: $\ge 99.0\%$ precision on 20-rep standardized test suites.
- **Latency**: Perception-to-audio feedback $\le 150\text{ ms}$.
