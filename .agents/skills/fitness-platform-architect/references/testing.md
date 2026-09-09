# TESTING GUIDELINES

## Test Coverage Requirements

| Layer | Minimum Coverage |
|---|---|
| Business logic (services) | 90% |
| API routes | 85% |
| UI components | 75% |
| AI model evaluation | Model-specific metrics |

## Required Test Types

| Type | Tool | Scope |
|---|---|---|
| Unit | pytest / Vitest | Functions, classes, components |
| Integration | pytest + TestClient | Service interactions, DB queries |
| API | pytest + HTTPX | All endpoints |
| UI Component | React Testing Library | Every component |
| E2E | Playwright | Critical user journeys |
| Load | Locust / k6 | Peak traffic simulation |
| Security | OWASP ZAP / Bandit | OWASP Top 10 |
| Model Evaluation | Custom eval harness | Accuracy, latency, drift |

## Testing Rules

- Tests are **not optional** — every PR must include tests for new code
- Tests must be **deterministic** — no random failures
- Use **factories** (Factory Boy / faker) for test data — never hardcode IDs
- **Mock external services** — never call real APIs in unit/integration tests
- **Test file co-location** — `feature.test.ts` next to `feature.ts`
- CI must fail if coverage drops below thresholds

## AI Model Testing

- Maintain a **golden dataset** for regression testing on each model
- Track metric history (accuracy, F1, latency) in MLflow or similar
- Alert when model performance degrades > 2% from baseline
- Canary test new model versions against 5% of traffic before full rollout
