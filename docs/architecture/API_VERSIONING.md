# API Versioning, Deprecation & Backward Compatibility Policy

## 1. Versioning Strategy
The platform uses **URI path versioning** (`/api/v1/`) combined with semantic versioning on npm/pnpm workspace packages (`@fitness/types`, `@fitness/cv`, `@fitness/ai`).

- **Major Versions (`/v1`, `/v2`)**: Breaking changes to payload schemas, removed endpoints, or modified authentication flows.
- **Minor / Patch Enhancements**: Additive, backward-compatible fields (e.g. optional metadata, additional exercise profiles) introduced without bumping the URI version path.

---

## 2. Backward Compatibility Rules
1. **Additive Changes Allowed**: Adding new optional fields to responses or requests is backward-compatible and does not require a new API version.
2. **Never Remove or Rename Active Fields**: Fields in active schema contracts cannot be renamed or dropped within a major version.
3. **Enum Extension Safety**: Clients must gracefully handle unexpected enum tokens (using Zod `.catch()` or fallback defaults).

---

## 3. Deprecation & Sunset Lifecycle
When an endpoint or schema is scheduled for deprecation:
1. **Announcement Phase (Day 0)**: Mark endpoint as `@deprecated` in OpenAPI spec and documentation.
2. **Deprecation HTTP Headers (Day 0 to 180)**:
   Responses include RFC 8594 Sunset and Deprecation headers:
   ```http
   Deprecation: @1794775855
   Sunset: Wed, 16 May 2027 00:00:00 GMT
   Link: <https://api.fitness.local/docs/v2-migration>; rel="sunset"
   ```
3. **Minimum Grace Period**: Endpoints remain fully functional for a minimum of **180 days** after deprecation notice.
4. **Decommission Phase (Day 181+)**: The deprecated route returns `410 Gone` with a link to migration documentation.
