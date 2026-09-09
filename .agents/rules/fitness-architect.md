---
trigger: always_on
---

# Fitness Platform Architecture & Quality Gate Rule

This workspace enforces strict enterprise architectural standards for the AI Gym & Fitness Ecosystem:

## Mandatory Architecture Rules
1. **Clean Architecture & SOLID:** Strict boundary separation across Domain, Service, API, and Data layers.
2. **No Monolithic Leaks:** Services must never import or query each other's databases directly. Cross-service interactions must use the API gateway, gRPC, or async event brokers (Redis / Kafka).
3. **API-First Design:** All endpoints require typed Pydantic models (request/response) and OpenAPI compliance before coding.
4. **Computer Vision Constraints:** Pose tracking must support state-machine rep counting, temporal smoothing, joint angle validation, and fallbacks.
5. **No Stub/Placeholder Code:** Emitting `TODO`, dummy data, or placeholder logic is strictly forbidden. All code must be complete, typed, and testable.
