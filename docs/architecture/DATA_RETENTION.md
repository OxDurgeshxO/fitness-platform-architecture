# Data Classification & Retention Policy

## 1. Data Classification Matrix

| Classification Level | Data Category | Examples | Storage Location | Retention Window |
| :--- | :--- | :--- | :--- | :--- |
| **Tier 1: Ephemeral Transient** | Raw Camera Video / Pixels | Webcam RGB frames | Client RAM / GPU only | **0 seconds (Never stored)** |
| **Tier 2: Real-Time Stream** | High-Rate Pose Coordinates | 33 3D landmarks (30 Hz) | Volatile memory / WS buffer | **10 seconds (In-flight only)** |
| **Tier 3: Aggregated Session Telemetry**| Workout Reps & Joint Angles | Min knee angle, valgus ratio | PostgreSQL (`workout_reps`) | **90 days** (Rolled into daily aggregates) |
| **Tier 4: Permanent History** | Workout Summaries & Ledgers | Total reps, calories, date | PostgreSQL (`workouts`) | **Indefinitely** (Until account deletion) |
| **Tier 5: Account Identity** | User Credentials & Profile | Email, password hash | PostgreSQL (`users`) | **Indefinitely** (Until account deletion) |

---

## 2. Automated Lifecycle Pruning
- **Daily Cron Job**: A scheduled database maintenance job executes:
  - Prunes raw `workout_reps` older than 90 days after verifying summary aggregates in `workouts` are materialized.
  - Deletes expired session tokens and rate-limit keys in Redis.

---

## 3. GDPR Article 17 ("Right to Erasure") Workflow
When an athlete triggers "Delete My Account & All Biometric Data":
1. Cascading hard delete executes across `users`, `workouts`, `workout_reps`, `form_issues`, and `coaching_feedbacks`.
2. Redis cache keys associated with `user_id` are purged (`DEL athlete:{id}:*`).
3. Confirmation certificate with cryptographic hash of zeroed rows is generated for compliance ledger.
