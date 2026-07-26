# DATABASE GUIDELINES

## Databases & Use Cases

| Database | Use Case |
|---|---|
| PostgreSQL | Relational data — users, workouts, nutrition, payments |
| MongoDB | Flexible documents — exercise logs, sensor data, chat history |
| Redis | Sessions, caching, rate limiting, pub/sub |
| Vector DB (pgvector / Qdrant) | Embeddings for semantic search & recommendations |

## Schema Rules

- **Always normalize** relational data — no denormalization without documented justification
- **Optimize indexes** — every foreign key indexed; composite indexes for common query patterns
- **Create migrations** — Alembic for PostgreSQL; never alter schema manually in production
- **Create ER diagrams** — one per service domain, kept in `docs/er/`
- **Use transactions** — for any multi-step write operations
- **Never duplicate data** — single source of truth per entity
- **UUID primary keys** — for all user-facing entities
- **Soft deletes** — `deleted_at` timestamp instead of hard deletes for auditable entities

## Query Rules

- Use **async SQLAlchemy** for all DB access in FastAPI
- **Never** run N+1 queries — use `joinedload` / `selectinload`
- Limit unbounded queries — always paginate
- Write **raw SQL** only for complex analytics; comment thoroughly
- Query performance targets: < 50ms p95 for OLTP queries

## Migration Workflow

```bash
# Generate migration
alembic revision --autogenerate -m "describe change"

# Review generated migration before applying
alembic upgrade head

# Rollback
alembic downgrade -1
```
