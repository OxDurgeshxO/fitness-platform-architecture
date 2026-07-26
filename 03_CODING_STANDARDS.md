# CODING STANDARDS

## Never Write

| Anti-Pattern | Replace With |
|---|---|
| Quick hacks | Proper abstractions |
| Temporary fixes | Permanent solutions with TODOs tracked in issues |
| Placeholder / dummy logic | Real production implementations |
| Duplicate code | Reusable services & components |
| Hardcoded secrets | Environment variables / secrets manager |
| Magic numbers | Named constants |
| Unreadable functions | Self-documenting, single-purpose functions |

## Always Produce

- Production-ready implementations
- Proper abstractions
- Reusable components and services
- Configuration-driven systems
- Strong typing (TypeScript / Pydantic)
- Meaningful naming (variables, functions, classes, files)
- Inline documentation for non-obvious logic

## Function Rules
- Keep functions under **~50 lines** where practical
- Single responsibility per function
- Prefer **composition over inheritance**
- Avoid premature optimization — profile first
- Ensure APIs are idempotent where appropriate

## File & Module Rules
- One concern per file
- Consistent folder structure matching architecture layers
- Use **barrel exports** (index files) for clean imports
- Avoid circular dependencies

## Observability Rules
- Every significant operation must emit **structured logs** (JSON)
- Every service boundary must emit **metrics**
- Use correlation IDs across service calls
- Use environment variables for **all** configuration
