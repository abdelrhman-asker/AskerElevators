# foundation — plan overview

Entry point for the **foundation** feature. Stories execute in order by their `NN` prefix.

## Stories

| NN | File | Title | Tracker id | Depends on |
|----|------|-------|------------|------------|
| 01 | [01-story-establish-monorepo-and-shared-contracts.md](01-story-establish-monorepo-and-shared-contracts.md) | Establish the monorepo and shared contracts | — | None |
| 02 | [02-story-create-api-and-health-endpoint.md](02-story-create-api-and-health-endpoint.md) | Create the API and health endpoint | — | 01 |
| 03 | [03-story-add-postgresql-and-drizzle.md](03-story-add-postgresql-and-drizzle.md) | Add PostgreSQL and Drizzle | — | 01, 02 |
| 04 | [04-story-create-bilingual-web-foundation.md](04-story-create-bilingual-web-foundation.md) | Create the bilingual web foundation | — | 01, 02, 03 |
| 05 | [05-story-document-and-verify-foundation.md](05-story-document-and-verify-foundation.md) | Document and verify the foundation | — | 01, 02, 03, 04 |

## Dependency notes

- Stories execute sequentially because later workspaces consume conventions and contracts established by earlier stories.
- Story 01 creates the root toolchain and `@elevator/shared`; application work must not bypass that package boundary.
- Story 02 consumes the shared health contract and establishes the API/configuration lifecycle used by database integration.
- Story 03 adds server-owned persistence tooling without coupling liveness to PostgreSQL readiness.
- Story 04 consumes the shared health contract and API boundary while keeping browser configuration isolated from server/database settings.
- Story 05 records repository-wide rules and architecture, then verifies the complete foundation from a clean checkout.

## Implemented configuration note

The approved Story 02–04 plans preserve their original proposed examples for historical traceability. During implementation, the API contract was finalized as `GET /api/health`, the documented development API port was aligned to `3100`, and the local PostgreSQL example port was moved to configurable host port `55432` to avoid a host conflict. Story 05 documentation and verification use these implemented values as authoritative; no versioned `/api/v1/health` route was introduced.
