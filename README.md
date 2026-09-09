# 🏋️‍♂️ Fitness Platform Architecture & Autonomous Agent OS

[![Antigravity Compatible](https://img.shields.io/badge/Antigravity-Compatible-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://github.com/OxDurgeshxO/fitness-platform-architecture)
[![Cursor Rules Ready](https://img.shields.io/badge/Cursor-Rules%20Ready-000000?style=for-the-badge&logo=cursor&logoColor=white)](https://github.com/OxDurgeshxO/fitness-platform-architecture)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **Enterprise AI-Powered Fitness Ecosystem Architecture & Custom Agent Skill Harness**  
> Designed for **Google Antigravity IDE** and **Cursor IDE** to orchestrate frontier AI models (Claude Sonnet 5, Gemini 3+ Flash/Pro, GPT-4o) across 500k–2M+ lines of production code.

---

## 🚀 Instant IDE Setup & Usage

### 1. Google Antigravity IDE
This repository is pre-configured with **Antigravity Workspace Skills and Rules**:
* **Workspace Directives:** Automatically detected via `AGENTS.md` and `GEMINI.md`.
* **Workspace Skill:** Available in `.agents/skills/fitness-platform-architect/`.
* **Always-On Rules:** Located in `.agents/rules/` (`fitness-architect.md`, `coding-standards.md`).

To activate manually in Antigravity chat:
```markdown
Activate the fitness-platform-architect skill and design the real-time rep counter.
```

### 2. Cursor IDE
This repository is pre-configured with **Cursor Composer & Agent Rules**:
* **Global Configuration:** `.cursorrules` in repository root.
* **Granular Rules:** `.cursor/rules/`:
  * `fitness-architect.mdc` — Master architecture & quality gates (always applied).
  * `frontend.mdc` — Next.js 14, Tailwind, Zustand, Framer Motion (applied to frontend files).
  * `backend.mdc` — FastAPI, async SQLAlchemy 2.0, Celery (applied to backend files).
  * `ai-vision.mdc` — MediaPipe, YOLOv8, Whisper, LLM agents (applied to AI/CV modules).

---

## 📁 Repository Structure

```text
fitness-platform-architecture/
├── .agents/                               # 🤖 Google Antigravity Customizations
│   ├── rules/
│   │   ├── coding-standards.md            # Anti-pattern blacklist & typing standards
│   │   └── fitness-architect.md           # Architecture rules & quality gates
│   └── skills/
│       └── fitness-platform-architect/
│           ├── SKILL.md                   # Main progressive skill prompt
│           └── references/                # Modular sub-domain documentation
│               ├── ai-vision.md           # CV, MediaPipe, Whisper, LLMs
│               ├── architecture.md        # Clean Architecture, DDD, CQRS
│               ├── backend.md             # FastAPI, Celery, Redis
│               ├── database.md            # PostgreSQL, pgvector, Redis
│               ├── devops.md              # Docker, K8s, AWS, CI/CD
│               ├── frontend.md            # Next.js 14, React, Tailwind
│               ├── security.md            # OWASP, JWT, RBAC, HIPAA/GDPR
│               ├── task-template.md       # 14-section output contract
│               ├── testing.md             # Vitest, Pytest, Playwright
│               └── ui-ux.md               # Motion curves, WCAG 2.1 AA
│
├── .cursor/                               # ⚡ Cursor IDE Granular Rules (.mdc)
│   └── rules/
│       ├── ai-vision.mdc
│       ├── backend.mdc
│       ├── fitness-architect.mdc
│       └── frontend.mdc
│
├── .cursorrules                           # Global Cursor Composer rules
├── AGENTS.md                              # Antigravity project-level instructions
├── GEMINI.md                              # Antigravity legacy instruction compatibility
├── 00_MASTER_SYSTEM_PROMPT.md             # Original master system prompt
├── 01_PROJECT_CONTEXT.md                  # Vision, target users, constraints
├── 02_ARCHITECTURE_RULES.md               # Design patterns & system diagram
├── 03_CODING_STANDARDS.md                 # Coding rules and anti-patterns
├── 04_AI_GUIDELINES.md                    # Computer Vision & LLM specifications
├── 05_FRONTEND_GUIDELINES.md              # Next.js frontend requirements
├── 06_BACKEND_GUIDELINES.md               # FastAPI service layer requirements
├── 07_DATABASE_GUIDELINES.md              # Database schemas & migrations
├── 08_DEVOPS_GUIDELINES.md                # Cloud & container standards
├── 09_SECURITY_GUIDELINES.md              # Security & compliance rules
├── 10_TESTING_GUIDELINES.md               # Multi-layer testing strategy
├── 11_UI_UX_GUIDELINES.md                 # Design system & accessibility
├── 12_DEVELOPMENT_WORKFLOW.md             # Branching & approval gates
├── 13_TASK_TEMPLATE.md                    # Standard output template
└── README.md
```

---

## 🛡️ Mandatory Pre-Response Quality Gate

Every AI output generated under this harness must pass this verification:
- [ ] Zero placeholder or stub code (`// TODO`, `pass`, dummy returns).
- [ ] Strict types (TypeScript strict mode, Python Pydantic v2 schemas).
- [ ] Security standards applied (no hardcoded secrets, RBAC authorization checked).
- [ ] Structured JSON logging and observability hooks wired.
- [ ] Automated tests provided.

---

## 📋 The 14-Section Feature Output Contract

When prompted to build any feature, the agent automatically formats its response into:
1. **Requirements Analysis**
2. **Architecture Decisions & Trade-offs**
3. **Folder Structure**
4. **Database Schema & Migrations**
5. **OpenAPI YAML Contract**
6. **Production FastAPI Backend Code**
7. **Production Next.js Frontend Code**
8. **AI/ML Pipeline & Fallbacks**
9. **Security & Threat Model**
10. **Performance Optimizations**
11. **Testing Strategy (Unit + Integration)**
12. **Deployment Notes & Migrations**
13. **Documentation Updates**
14. **Future Enhancements & Tech Debt**

---

## 🗺️ Development Roadmap

```text
Phase 1: Foundation        ──► Auth • Users • DB • API Gateway • CI/CD
Phase 2: Core Fitness      ──► Workout Planner • Exercise Library • Analytics
Phase 3: AI Vision         ──► Pose Detection • Rep Counter • Form Correction
Phase 4: Nutrition         ──► AI Nutritionist • Meal Generator • Calorie Tracking
Phase 5: Intelligence      ──► AI Chat Coach • Voice Assistant • Recommendations
Phase 6: Platform          ──► Admin • Payments • Subscriptions • Notifications
Phase 7: Growth            ──► Gamification • Achievements • Leaderboards
Phase 8: Ecosystem         ──► Wearables • IoT • Offline Mode • Data Export
```

---

## 📄 License

MIT © [Durgesh Dutt Sinha](https://github.com/OxDurgeshxO)
