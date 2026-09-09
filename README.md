# 🏋️‍♂️ Fitness Platform: Full-Stack AI Ecosystem & Autonomous Agent OS

[![Antigravity Compatible](https://img.shields.io/badge/Antigravity-Compatible-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://github.com/OxDurgeshxO/fitness-platform-architecture)
[![Cursor Rules Ready](https://img.shields.io/badge/Cursor-Rules%20Ready-000000?style=for-the-badge&logo=cursor&logoColor=white)](https://github.com/OxDurgeshxO/fitness-platform-architecture)
[![React 19](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **Production-Grade Full-Stack AI Gym & Fitness Application** paired with an **Autonomous AI Agent Operating System** for **Google Antigravity IDE** and **Cursor IDE**.

---

## 🌟 Key Highlights

This repository is a **unified powerhouse** containing both:
1. **The Live Working Application Code:** A full-featured, 9-module React 19 + Three.js + Vite fitness application.
2. **The Autonomous Agent Harness:** Native Google Antigravity skills, Cursor rules, and a single-file universal master engineering prompt (`GENERAL_CODING_OS.md`) for general software development.

---

## 📱 Application Modules (Full-Stack Codebase)

Located in [`src/frontend/src/pages/`](./src/frontend/src/pages/):

| Module | Route | Description | Tech Highlights |
|---|---|---|---|
| **Form Analyzer** | `/analyzer` | Real-time workout pose & rep analysis | Recharts, telemetry cards, performance gauges |
| **AI Personal Trainer** | `/trainer` | Interactive workout generation & coaching | Framer Motion, workout schedule timelines |
| **AI Dietician** | `/dietician` | Meal planning, macros, calorie tracker | Macro distribution charts, meal plan generators |
| **Analytics Dashboard** | `/` | Central health telemetry hub | Radix UI, activity streaks, weekly efficiency |
| **Recommendation Engine** | `/recommender` | Personalized fitness & diet suggestions | Scoring algorithms, targeted exercise cards |
| **Smart Gym & IoT** | `/iot` | Telemetry interface for gym hardware & wearables | Device sync status, real-time sensor streams |
| **Coach Directory** | `/coaches` | Certified trainer profiles & consultation booking | Filterable directory, modal booking flow |
| **Gym Buddy** | `/buddy` | Community workout partners & social motivation | Buddy matching cards, chat interface |
| **Habit Tracker** | `/habits` | Daily fitness habits and consistency tracking | Streak counters, interactive habit check-ins |

---

## ⚡ Quick Start (Running Locally)

### Prerequisites
* **Node.js:** `>= 18.0.0`
* **pnpm:** `>= 8.0.0` (`npm install -g pnpm`)

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Start Development Server
```bash
# Start frontend dev server
cd src/frontend
pnpm run dev
```
Open **`http://localhost:5173`** in your browser.

### 3. Type Check & Production Build
```bash
# Verify TypeScript (0 errors)
pnpm --filter @caffeine/template-frontend run typecheck

# Compile production bundle
pnpm --filter @caffeine/template-frontend run build
```

---

## 🤖 Autonomous AI Agent OS & Skills

This repository doubles as an advanced agentic development environment:

### 1. Single Drop-in Master Prompt: [`GENERAL_CODING_OS.md`](./GENERAL_CODING_OS.md)
A universal, domain-agnostic software engineering operating system. Copy-paste this single document into **Claude Sonnet, ChatGPT, Gemini Pro, or Cursor** for any coding task across any stack. It enforces:
* **Role Orchestration:** Principal Architect, Backend Lead, Frontend Lead, SRE, Security, QA.
* **Universal Quality Gate:** Zero placeholder code, strict typing, observability, defensive errors.
* **14-Section Feature Delivery Contract:** RFC-level delivery structure for every feature.

### 2. Google Antigravity IDE Skills
* **`general-coding-os`:** [`.agents/skills/general-coding-os/`](./.agents/skills/general-coding-os/) — General software engineering across any stack.
* **`fitness-platform-architect`:** [`.agents/skills/fitness-platform-architect/`](./.agents/skills/fitness-platform-architect/) — Domain-specific fitness and CV architecture with 12 modular references.
* **Workspace Directives:** Auto-loaded via [`AGENTS.md`](./AGENTS.md) and [`GEMINI.md`](./GEMINI.md).
* **Always-On Rules:** [`.agents/rules/`](./.agents/rules/).

### 3. Cursor IDE Rules
* **Global Configuration:** [`.cursorrules`](./.cursorrules) in root.
* **Granular Rule Sets:** [`.cursor/rules/`](./.cursor/rules/) (`general-coding-os.mdc`, `frontend.mdc`, `backend.mdc`, `ai-vision.mdc`).

---

## 📁 Repository Structure

```text
fitness-platform-architecture/
├── .agents/                               # 🤖 Google Antigravity Skills & Rules
│   ├── rules/                             # Always-on workspace rules
│   │   ├── coding-standards.md
│   │   ├── fitness-architect.md
│   │   └── general-engineering-standards.md
│   └── skills/
│       ├── general-coding-os/             # Universal software engineering skill
│       │   └── SKILL.md
│       └── fitness-platform-architect/    # Domain-specific fitness architecture skill
│           ├── SKILL.md
│           └── references/                # 12 sub-domain reference manuals
│
├── .cursor/                               # ⚡ Cursor IDE Rules (.mdc)
│   └── rules/
│       ├── ai-vision.mdc
│       ├── backend.mdc
│       ├── fitness-architect.mdc
│       ├── frontend.mdc
│       └── general-coding-os.mdc
│
├── .cursorrules                           # Global Cursor Composer rules
├── GENERAL_CODING_OS.md                   # 🌐 Single-File Universal Prompt OS
├── AGENTS.md / GEMINI.md                  # Project-level agent directives
│
├── src/
│   ├── frontend/                          # 🚀 React 19 + Three.js + Vite Application
│   │   ├── src/
│   │   │   ├── pages/                     # 9 Complete Application Pages
│   │   │   │   ├── AnalyzerPage.tsx       # Pose & Form Analyzer
│   │   │   │   ├── TrainerPage.tsx        # AI Personal Trainer
│   │   │   │   ├── DieticianPage.tsx      # AI Nutritionist
│   │   │   │   ├── DashboardPage.tsx      # Central Analytics Dashboard
│   │   │   │   ├── RecommenderPage.tsx    # Recommendation Engine
│   │   │   │   ├── IoTPage.tsx            # Smart Gym & Wearables
│   │   │   │   ├── CoachesPage.tsx        # Coach Directory
│   │   │   │   ├── BuddyPage.tsx          # Gym Buddy Community
│   │   │   │   └── HabitsPage.tsx         # Daily Habit Tracker
│   │   │   ├── components/                # GlassCard, NeonBadge, UI components
│   │   │   ├── hooks/                     # Custom telemetry & state hooks
│   │   │   └── App.tsx                    # TanStack router configuration
│   │   ├── package.json                   # Frontend dependencies
│   │   └── vite.config.js                 # Vite bundler config
│   │
│   └── backend/                           # 📦 Backend Canister & API schemas
│       ├── lib/                           # Domain libraries
│       └── main.mo                        # Backend actor
│
├── package.json                           # Root monorepo workspace
├── pnpm-workspace.yaml                    # Pre-configured workspace with build fixes
└── README.md
```

---

## 🛡️ Pre-Response Quality Gate

Every feature implemented under this harness must pass:
- [ ] Zero placeholder or stub code (`// TODO`, `pass`, dummy data).
- [ ] Strict types across all layers (TypeScript strict mode, Pydantic v2 schemas).
- [ ] Security standards applied (no hardcoded secrets, RBAC authorization checked).
- [ ] Structured JSON logging and observability hooks wired.
- [ ] Automated tests provided.

---

## 📄 License

MIT © [Durgesh Dutt Sinha](https://github.com/OxDurgeshxO)
