# Production preparation checklist

Phase 1 is a development foundation, not a production deployment. Complete and review this checklist before any public or customer-data release.

## Product and access control

- [ ] Define identity, session/token, password recovery, and account lifecycle requirements.
- [ ] Implement API-side deny-by-default RBAC and object/tenant authorization.
- [ ] Prove customer isolation and technician assignment scope with negative tests.
- [ ] Enforce that technicians can never delete or archive customer maintenance requests.
- [ ] Define privileged administrative actions and approval/recovery procedures.

## Security and privacy

- [ ] Provision secrets through the deployment platform; do not ship `.env` files.
- [ ] Terminate TLS and set trusted proxy, secure-header, cookie, CSRF, and rate-limit policies appropriate to the chosen authentication design.
- [ ] Replace development CORS settings with an exact production web origin; do not treat CORS as authorization.
- [ ] Add dependency, static-analysis, container, and secret scanning to CI.
- [ ] Complete a threat model, privacy review, logging/redaction review, and penetration test for the implemented business scope.
- [ ] Define retention, deletion, data residency, and incident-response policies.

## Database and auditability

- [ ] Design approved domain schemas with tenant/customer ownership constraints and migration tests.
- [ ] Review generated SQL, back up before migration, test rollback/recovery, and run migrations as a separate controlled release step.
- [ ] Use managed production PostgreSQL with encrypted transport, least-privilege credentials, backups, point-in-time recovery, monitoring, and restore drills.
- [ ] Implement append-oriented audit records for important mutations with actor, action, target, timestamp, and minimized context.
- [ ] Define connection limits and timeouts against the selected production database capacity.

## Web and API delivery

- [x] Add repository-level Vercel build manifests, a Vite SPA fallback, and a listener-free Express deployment entry.
- [ ] Create and verify the separate web/API Vercel projects, environment scopes, production domains, and rollback behavior.
- [ ] Choose and document supported browsers, accessibility target, and Arabic/English content ownership.
- [ ] Run automated browser tests and manual keyboard, screen-reader, narrow/wide viewport, RTL, and LTR reviews.
- [ ] Configure production web/API origins, cache policy, compression, asset hosting, and SPA route fallback.
- [ ] Add readiness behavior separately from `/api/health` if required by the hosting platform.
- [ ] Establish structured logs, metrics, traces, alerting, uptime checks, and sanitized error reporting.

## Real-time and external services

- [ ] Introduce Socket.IO only after handshake and per-subscription authorization are designed and tested.
- [ ] Define queues, retry/idempotency, delivery guarantees, and sensitive-data handling before notifications or external messaging.
- [ ] Review every third-party processor, credential scope, failure mode, and data-processing agreement.

## Release engineering

- [ ] Add CI gates for clean install, lint, strict type-check, build, default tests, database tests, migration review, production audit, and secret/bundle scans.
- [ ] Build reproducible runtime artifacts using pinned supported Node.js and PostgreSQL versions.
- [ ] Separate development, staging, and production configuration and credentials.
- [ ] Verify graceful shutdown, deployment health checks, rollback, backup restoration, and disaster recovery in staging.
- [ ] Document ownership, on-call escalation, support procedures, release approval, and post-release validation.

Do not mark the platform production-ready solely because the Phase 1 quality gates pass. Authentication, authorization, tenant isolation, auditing, operational controls, and the approved business model remain future work.
