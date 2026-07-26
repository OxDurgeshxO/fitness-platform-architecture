# AI Gym & Fitness Assistant

> **Production-grade AI-powered Gym & Fitness ecosystem** — Pose Detection, Exercise Recognition, Diet Planning, AI Coach, Wearables, IoT, Computer Vision, LLM Agent Orchestration.

---

## Operating System Prompt Structure

This repository uses a **hierarchical prompt system** for Claude Sonnet 5 to ensure long-term consistency across 500k–2M+ lines of code.

| File | Purpose |
|---|---|
| `00_MASTER_SYSTEM_PROMPT.md` | Role definition, quality gate, prompt index |
| `01_PROJECT_CONTEXT.md` | Vision, objectives, user segments |
| `02_ARCHITECTURE_RULES.md` | System design, tech stack, patterns |
| `03_CODING_STANDARDS.md` | Quality rules, anti-patterns, naming |
| `04_AI_GUIDELINES.md` | AI/ML modules, CV, inference, LLM agents |
| `05_FRONTEND_GUIDELINES.md` | Next.js, React, Tailwind, performance |
| `06_BACKEND_GUIDELINES.md` | FastAPI, services, API standards |
| `07_DATABASE_GUIDELINES.md` | Schema, migrations, query optimization |
| `08_DEVOPS_GUIDELINES.md` | Docker, Kubernetes, CI/CD, Terraform |
| `09_SECURITY_GUIDELINES.md` | Auth, RBAC, OWASP, HIPAA-awareness |
| `10_TESTING_GUIDELINES.md` | Unit, integration, E2E, load, model eval |
| `11_UI_UX_GUIDELINES.md` | Design system, motion, accessibility |
| `12_DEVELOPMENT_WORKFLOW.md` | Incremental dev, branch strategy, phases |
| `13_TASK_TEMPLATE.md` | Mandatory output format per feature |

---

## Tech Stack

**Frontend:** Next.js 14 · React · TypeScript · Tailwind CSS · React Query · Zustand · Framer Motion

**Backend:** FastAPI · Python 3.11 · SQLAlchemy 2.0 · Pydantic v2 · Celery · Redis

**AI/ML:** MediaPipe · PyTorch · OpenCV · Transformers · OpenAI · Whisper · YOLO

**Databases:** PostgreSQL · MongoDB · Redis · pgvector / Qdrant

**DevOps:** Docker · Kubernetes · AWS (EKS, RDS, S3, Secrets Manager) · Terraform · GitHub Actions

**Monitoring:** Prometheus · Grafana · ELK Stack

---

## Development Phases

```
Phase 1: Foundation          → Auth · Users · DB · API Gateway · CI/CD
Phase 2: Core Fitness        → Workout Planner · Exercise Library · Analytics
Phase 3: AI Vision           → Pose Detection · Rep Counter · Form Correction
Phase 4: Nutrition           → AI Nutritionist · Meal Generator · Calorie Tracking
Phase 5: Intelligence        → AI Chat Coach · Voice Assistant · Recommendations
Phase 6: Platform            → Admin · Payments · Subscriptions · Notifications
Phase 7: Growth              → Gamification · Achievements · Leaderboards
Phase 8: Ecosystem           → Wearables · IoT · Offline · Export
```

---

## How to Use This Prompt System with Claude Sonnet 5

1. **Start every new session** by pasting `00_MASTER_SYSTEM_PROMPT.md` as the system prompt.
2. **Load context files** relevant to the current task (e.g. `05_FRONTEND_GUIDELINES.md` + `06_BACKEND_GUIDELINES.md` for a full-stack feature).
3. **Use `13_TASK_TEMPLATE.md`** to specify what feature you want implemented.
4. **Review the quality gate** checklist before accepting any output.
5. **Approve incrementally** — never let Claude proceed to the next feature without review.

---

## License

MIT
