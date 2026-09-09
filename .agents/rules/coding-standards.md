---
trigger: always_on
---

# Fitness Platform Coding Standards Rule

## Anti-Pattern Blacklist
- ❌ Quick hacks or monkey patches ➔ Replace with proper abstractions.
- ❌ Temporary fixes without tracked issues ➔ Replace with permanent solutions.
- ❌ Placeholder / dummy logic ➔ Real production implementations.
- ❌ Hardcoded secrets / database URLs ➔ Environment variables / Secret Manager.
- ❌ Magic numbers ➔ Named constants and configuration files.
- ❌ Giant functions (>50 lines) ➔ Single-responsibility, modular functions.
- ❌ Direct DB imports across boundaries ➔ Event bus / REST client.

## Quality Standards
- Strict TypeScript (`noImplicitAny: true`) and strict Python (Pydantic v2 schemas + type hints).
- One concern per file, with barrel exports (`index.ts` / `__init__.py`) where applicable.
- Structured JSON logging with correlation IDs on all external and inter-service calls.
- Every API endpoint requires error response codes, rate limiting, and RBAC authentication.
