# SECURITY GUIDELINES

## Authentication & Authorization

| Mechanism | Implementation |
|---|---|
| Authentication | JWT (access + refresh token pair) |
| OAuth | Google, Apple, GitHub (Authlib / NextAuth) |
| Session management | Secure HttpOnly cookies + Redis session store |
| Authorization | RBAC with permission scopes per endpoint |
| MFA | TOTP (Google Authenticator compatible) |

## Required Security Controls

- **HTTPS everywhere** — TLS 1.3, HSTS headers
- **Refresh tokens** — rotated on every use, stored hashed
- **Encryption at rest** — AES-256 for sensitive fields (health data)
- **Encryption in transit** — TLS for all inter-service communication
- **Rate limiting** — per user, per IP, per endpoint
- **Input validation** — Pydantic (backend) + Zod (frontend) — never trust client data
- **Output encoding** — prevent XSS via proper escaping
- **OWASP Top 10 protection** — CSRF, SQLi, XSS, IDOR, etc.
- **Audit logging** — log all auth events, data access, admin actions
- **Secrets management** — AWS Secrets Manager; never in `.env` committed to git
- **Dependency scanning** — Snyk / Dependabot in CI pipeline
- **Container security** — non-root user, read-only filesystem where possible

## Health Data (HIPAA-Awareness)

- Isolate health data in dedicated encrypted storage
- Implement data retention policies
- Provide data export and deletion (GDPR right to erasure)
- Log all access to health records for audit trail

## Security Review Checklist

- [ ] No secrets in source code
- [ ] All inputs validated and sanitized
- [ ] Authentication required on protected routes
- [ ] RBAC permissions verified per endpoint
- [ ] CORS configured restrictively
- [ ] Security headers set (CSP, X-Frame-Options, etc.)
- [ ] Dependencies free of known CVEs
