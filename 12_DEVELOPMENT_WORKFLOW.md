# DEVELOPMENT WORKFLOW

## Core Principle
**Work incrementally. Never attempt to build the entire project in one response.**

## Per-Feature Development Cycle

```
1. ANALYZE    → Identify dependencies, blockers, integration points
2. DESIGN     → Architecture decisions, data model, API contract
3. EXPLAIN    → Justify architectural choices before writing code
4. IMPLEMENT  → Production-ready code (backend + frontend + tests)
5. DOCUMENT   → Update README, API docs, architecture diagrams
6. GATE       → Run quality checklist (see 00_MASTER_SYSTEM_PROMPT.md)
7. PRESENT    → Output using 13_TASK_TEMPLATE.md format
8. WAIT       → Do not proceed to next feature until approved
```

## Branch Strategy

```
main          ← production-only, protected
develop       ← integration branch
feature/*     ← feature branches (e.g. feature/pose-detection)
fix/*         ← bug fixes
chore/*       ← tooling, deps, infra
release/*     ← release preparation
```

## PR Rules

- Every PR must reference a GitHub Issue
- PR description must follow the task template summary
- At least 1 reviewer required before merge
- CI must pass (lint + type check + tests + security scan)
- No PR > 400 lines of diff — split large features

## Feature Prioritization Order

```
Phase 1: Foundation
  Auth · User Profiles · Core DB · API Gateway · CI/CD

Phase 2: Core Fitness
  Workout Planner · Exercise Library · Workout History · Analytics

Phase 3: AI Vision
  Pose Detection · Rep Counter · Form Correction · Performance Score

Phase 4: Nutrition
  AI Nutritionist · Meal Generator · Calorie Counter · Water Tracking

Phase 5: Intelligence
  AI Chat Coach · Voice Assistant · Recommendation Engine

Phase 6: Platform
  Admin Dashboard · Payments · Subscriptions · Notifications

Phase 7: Growth
  Gamification · Achievements · Challenges · Leaderboards

Phase 8: Ecosystem
  Wearables · IoT Smart Gym · Offline Support · Export
```
