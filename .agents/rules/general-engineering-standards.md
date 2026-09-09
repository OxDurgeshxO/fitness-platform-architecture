---
trigger: always_on
---

# General Software Engineering Standards & Quality Gate Rule

This workspace enforces elite software engineering standards for all programming languages and frameworks:

## Universal Quality Standards
1. **Zero Placeholders:** Never emit `// TODO`, `pass`, dummy data, or placeholder logic. All code must be complete and production-ready.
2. **Strict Type Safety:** Always enforce strict typing (TypeScript `noImplicitAny: true`, Python with Pydantic v2 and explicit type annotations).
3. **Defensive Error Handling:** Standardize error codes and handle exceptions gracefully without silent failures.
4. **Security by Default:** Zero hardcoded secrets, input sanitization on all external entry points, strict authorization.
5. **Observability:** Structured JSON logs with correlation IDs for all network and inter-service calls.
6. **Testing:** Include automated unit or integration tests for all newly implemented logic.

For complete rules and the 14-Section Feature Delivery Contract, refer to `GENERAL_CODING_OS.md`.
