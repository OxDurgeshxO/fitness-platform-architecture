# BACKEND GUIDELINES

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | FastAPI (Python 3.11+) |
| Language | Python with strict type hints |
| ORM | SQLAlchemy 2.0 (async) |
| Validation | Pydantic v2 |
| Task Queue | Celery + Redis |
| Caching | Redis |
| Search | Elasticsearch (optional) |

## Every API Endpoint Must Include

- **Validation** — Pydantic models for request/response
- **Authentication** — JWT verification middleware
- **Authorization** — RBAC permission check
- **OpenAPI Documentation** — auto-generated + enriched with examples
- **Error Handling** — structured error responses with error codes
- **Rate Limiting** — per-user and per-IP via Redis
- **Pagination** — cursor-based for large datasets
- **Filtering & Sorting** — query param driven
- **Structured Logging** — correlation ID, user ID, duration
- **Metrics** — Prometheus counters/histograms per endpoint
- **Versioning** — `/api/v1/`, `/api/v2/` prefixed routes

## Service Layer Rules

- Services must **never** import from other services directly
- Cross-service calls go through the event bus or API Gateway
- Each service owns its own DB schema
- Business logic lives in the service layer — not in routers or models

## Folder Structure

```
backend/
  api/
    v1/
      routes/       # FastAPI routers
      dependencies/ # Shared dependencies (auth, db)
  services/         # Business logic per domain
  repositories/     # Data access layer
  models/           # SQLAlchemy models
  schemas/          # Pydantic schemas
  core/             # Config, security, middleware
  workers/          # Celery tasks
  tests/
```
