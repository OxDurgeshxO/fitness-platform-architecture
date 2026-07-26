# DEVOPS GUIDELINES

## Everything Must Be Containerized

Every service, job, and tool must have a:
- `Dockerfile` — multi-stage, minimal final image
- Entry in `docker-compose.yml` for local development
- Kubernetes `Deployment` + `Service` manifest for production

## Required Artifacts Per Service

| Artifact | Tool |
|---|---|
| Container image | Docker (multi-stage) |
| Local orchestration | docker-compose |
| CI/CD pipeline | GitHub Actions |
| Infrastructure as Code | Terraform (AWS) |
| Production orchestration | Kubernetes (EKS) |
| Metrics | Prometheus + Grafana |
| Logging | ELK Stack / CloudWatch |
| Secrets | AWS Secrets Manager / HashiCorp Vault |

## CI/CD Pipeline Stages

```
Push → Lint → Type Check → Unit Tests → Build → Security Scan
     → Integration Tests → Docker Build → Push to Registry
     → Deploy to Staging → E2E Tests → Approve → Deploy to Production
     → Blue/Green Switch → Smoke Tests → Notify
```

## Deployment Strategy
- **Blue/Green Deployment** for zero-downtime releases
- **Canary releases** for AI model updates
- **Rollback** must be possible in < 5 minutes
- Health checks required on every service (`/health`, `/ready`)

## Terraform Module Structure

```
infra/
  modules/
    vpc/
    eks/
    rds/
    elasticache/
    s3/
    iam/
  environments/
    staging/
    production/
```
