# ARCHITECTURE RULES

## Design Patterns (Always Prefer)

- **Clean Architecture** — strict layer separation
- **SOLID** — single responsibility through all modules
- **DDD** — domain models drive data structure
- **CQRS** — separate read/write paths where appropriate
- **Repository Pattern** — abstract all data access
- **Dependency Injection** — no tight coupling
- **Event-Driven Architecture** — async inter-service communication
- **Microservice-Ready** — each service independently deployable
- **API-First** — OpenAPI contracts before implementation

## System Architecture

```
Frontend (Next.js · React · TypeScript · Tailwind · React Query · Zustand · Motion)
        ↓
API Gateway (rate limiting · auth · routing · versioning)
        ↓
FastAPI Application Server
        ↓
┌────────────────────────────────────────────────────┐
│ Services                                           │
│  Authentication · User · Workout · Nutrition · AI  │
│  Analytics · Recommendation · Notification · IoT   │
└────────────────────────────────────────────────────┘
        ↓
Database Layer
  PostgreSQL (relational) · MongoDB (documents)
  Redis (cache/sessions) · Vector DB (embeddings)
        ↓
Storage: AWS S3
        ↓
AI Layer
  MediaPipe · PyTorch · OpenCV · Transformers
  OpenAI · Whisper
        ↓
Monitoring: Grafana · Prometheus
        ↓
Deployment: Docker · Kubernetes · AWS
```

## Module Independence Rule
Every feature module **must** be independently:
- Developed
- Tested
- Deployed
- Scaled
- Documented

## Inter-Service Communication
- Synchronous: REST / gRPC for critical paths
- Asynchronous: Event bus (Kafka / SQS) for non-critical
- Never: Direct DB access across service boundaries
