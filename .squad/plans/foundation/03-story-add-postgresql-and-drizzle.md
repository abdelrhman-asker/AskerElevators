# Story 03 — Add PostgreSQL and Drizzle

## Prerequisites

- [Story 01 completed: Establish the monorepo and shared contracts](01-story-establish-monorepo-and-shared-contracts.md).
- [Story 02 completed: Create the API and health endpoint](02-story-create-api-and-health-endpoint.md).
- Preserve `/api/v1/health` as database-independent liveness; do not convert it into a readiness check.

---

## Story Goal

Provide a reproducible PostgreSQL 17 development service and server-owned Drizzle foundation. Add explicit schema-generation/migration commands, a lazy reusable database resource, an opt-in connectivity check, and shutdown cleanup without adding domain tables or running migrations during API startup.

---

## Context — Read These Files First

1. `.squad/stories/foundation/initialize-elevator-maintenance-platform/intake.md` — read lines 94–103 for Docker/PostgreSQL/Drizzle requirements, lines 105–109 for liveness separation, and lines 171–176 for acceptance expectations.
2. [Story 02](02-story-create-api-and-health-endpoint.md) — read lines 57–77 for validated `DATABASE_URL`, lines 79–118 for app/lifecycle boundaries, and lines 142–151 for required failure behavior.
3. `apps/api/src/config/env.ts` — after Story 02, verify the database URL validation is reusable by tooling without requiring unrelated HTTP settings.
4. `apps/api/src/server.ts` — after Story 02, locate the idempotent shutdown path; database closure belongs there and nowhere in the Express app factory.
5. `apps/api/src/routes/health.ts` — after Story 02, confirm it has no database import before and after this story.

---

## Backend Tasks

### 1 — Define a local PostgreSQL service

**Create file: `compose.yaml`**

- Use the pinned image `postgres:17.11-alpine3.24` and a stable service name `postgres`.
- Read `POSTGRES_DB`, `POSTGRES_USER`, and `POSTGRES_PASSWORD` from environment interpolation with required-value errors; do not place usable credentials in Compose.
- Publish `${POSTGRES_PORT:-5432}:5432` and persist `/var/lib/postgresql/data` in a named volume such as `postgres_data`.
- Add a `pg_isready` health check using the container's escaped environment variables, with explicit interval, timeout, retries, and start period.
- Do not expose PostgreSQL beyond the developer host or add any application container in Phase 1.

**Update file: `.env.example`**

Keep the Story 02 HTTP settings and add aligned safe placeholders:

```dotenv
POSTGRES_DB=elevator_platform
POSTGRES_USER=elevator_app
POSTGRES_PASSWORD=replace-me
POSTGRES_PORT=5432
DATABASE_URL=postgresql://elevator_app:replace-me@localhost:5432/elevator_platform
```

Explain in comments that developers copy this file to ignored `.env` and must choose their own local password. Ensure the `DATABASE_URL` example matches the separate Compose fields.

### 2 — Configure Drizzle without domain schema

**Create files:**

- `apps/api/drizzle.config.ts`
- `apps/api/src/db/schema.ts`

Install `drizzle-orm` and `pg` as API runtime dependencies and `drizzle-kit`, `dotenv`, and `@types/pg` as API development dependencies.

- Load the ignored root `.env` in `drizzle.config.ts` for local CLI use, but validate `DATABASE_URL` through a database-specific exported validator rather than duplicating the full API environment schema.
- Configure PostgreSQL dialect, `src/db/schema.ts` as the schema entry, and `drizzle/` as the generated migration output.
- Keep `schema.ts` intentionally free of domain tables. Export no placeholder business entity and do not create fake seed data merely to force a migration.
- Generated SQL migrations and metadata will be committed when future stories introduce real schema. Normal API startup must never call Drizzle Kit or apply migrations.

**Update file: `apps/api/src/config/env.ts`**

- Export a focused PostgreSQL URL schema/helper used by both `apiEnvSchema` and Drizzle configuration.
- Keep error output redacted and retain the pure explicit-input API from Story 02.

### 3 — Add lazy database ownership and connectivity checking

**Create files:**

- `apps/api/src/db/client.ts`
- `apps/api/src/db/check.ts`

`client.ts` must create and own one `pg.Pool`, wrap it with Drizzle, and return an object containing the typed Drizzle client and an idempotent async `close()` function. Construction must not execute a query, and the module must not create a pool as an import side effect.

`check.ts` is an explicit developer command that:

1. loads and validates configuration;
2. creates the database resource;
3. executes a parameter-free `select 1` readiness probe;
4. prints only a simple success/failure message;
5. closes the pool in `finally` and exits non-zero on failure.

Do not expose this probe as an HTTP endpoint in Phase 1.

### 4 — Close database resources with the HTTP server

**Update file: `apps/api/src/server.ts`**

- Create the lazy database resource during composition so later route modules can receive it through dependency injection.
- On `SIGINT`, `SIGTERM`, or startup failure, close the HTTP server first and then await the database pool's idempotent `close()` within the existing bounded shutdown path.
- Do not pass the database into the health router and do not establish a connection solely to start the process.

### 5 — Add explicit database commands

**Update file: `apps/api/package.json`**

Add:

- `db:generate` — generate migrations from the schema.
- `db:migrate` — apply committed migrations explicitly.
- `db:check` — run the connectivity probe.
- `db:studio` — launch Drizzle Studio for local development only.

**Update file: `package.json`**

Add root forwarding commands for `db:generate`, `db:migrate`, `db:check`, and `db:studio`, plus:

- `db:up`: `docker compose --env-file .env up -d postgres`
- `db:logs`: follow the PostgreSQL service logs.
- `db:down`: stop services without deleting the named volume.
- `db:reset`: run `docker compose --env-file .env down --volumes`; its script name and later documentation must clearly mark this as destructive.

**Update file: `package-lock.json`** through npm. Do not hand-edit dependency resolution.

---

## Frontend Tasks

No frontend changes required. Database configuration and credentials remain server-only.

---

## Edge Cases & Failure Modes

- Missing Compose credentials stop interpolation before PostgreSQL starts; `compose.yaml` supplies no credential defaults.
- A mismatched `DATABASE_URL` can start PostgreSQL but makes `npm run db:check` fail non-zero with a sanitized message; `.env.example` keeps the intended mapping visible.
- PostgreSQL may be running before it is ready; the Compose health check exposes readiness, and developers run `docker compose ps` before migrations.
- `db:generate` against the intentionally empty schema produces no domain migration; this is expected until a future schema story.
- A failed or partially applied future migration is not repaired by API startup. `db:migrate` remains an explicit action, and the executor must inspect Drizzle's migration state before retrying.
- Database unavailability never changes `/api/v1/health`, because `apps/api/src/routes/health.ts` contains no database dependency.
- Repeated shutdown calls do not double-close the pool; `apps/api/src/db/client.ts` and `server.ts` enforce idempotency.
- `db:reset` deletes the named development volume and all local data; it must never run as part of install, dev, test, or migration scripts.

---

## Test Plan

1. **Unit:** Create `apps/api/src/db/client.test.ts` using mocks/fakes to verify pool options receive the validated URL, construction does not query, and repeated `close()` calls are safe.
2. **Unit:** Extend `apps/api/src/config/env.test.ts` for supported PostgreSQL URL schemes and rejection/redaction of other schemes.
3. **Integration (opt-in):** Create `apps/api/src/db/check.integration.test.ts` guarded by an explicit database-test environment flag. Against the Compose service, execute the readiness probe and close the pool. Keep it out of the default unit suite.
4. **Regression:** Re-run `apps/api/src/routes/health.test.ts` while PostgreSQL is stopped to prove liveness independence.
5. **Compose validation:** Run `docker compose --env-file .env config` and inspect the resolved service, health check, port, and named volume without committing `.env` output.

---

## Migration / Rollback

- Phase 1 introduces no domain table and therefore no schema rollback SQL.
- If migration generation emits an empty/unintended artifact, inspect it and remove only that uncommitted artifact before proceeding; never edit an applied migration in place.
- If `db:migrate` fails, stop and inspect the database plus Drizzle migration journal before retrying. Do not make API startup compensate for a half-applied migration.
- `npm run db:down` is the non-destructive service rollback. `npm run db:reset` is the last-resort local reset and permanently removes the named development volume; recreate `.env`, start PostgreSQL, and explicitly reapply committed migrations afterward.

---

## Verification Steps

1. **Compose is valid:** Copy `.env.example` to ignored `.env`, choose a local password, and run `docker compose --env-file .env config`.
2. **Database starts:** From repository root, run `npm run db:up`, then `docker compose ps`; wait for `postgres` to report healthy.
3. **Database is reachable:** Run `npm run db:check`; confirm success and a clean process exit.
4. **Migration workflow:** Run `npm run db:generate` and `npm run db:migrate`; confirm no domain schema is silently introduced.
5. **Backend builds:** Run `npm run build --workspace @elevator/api` after building shared output.
6. **Regression:** Stop PostgreSQL with `npm run db:down`, run API tests, and confirm the health test still passes.
7. **Quality gates:** From repository root, run `npm run lint`, `npm run typecheck`, `npm run build`, and `npm test`.

---

## Done Criteria

- [ ] `compose.yaml` pins `postgres:17.11-alpine3.24`, requires credentials, exposes a configurable host port, persists a named volume, and reports health.
- [ ] The ignored local `.env` workflow and safe `.env.example` keep Compose and `DATABASE_URL` aligned without committed credentials.
- [ ] Drizzle configuration points to the API-owned empty schema and predictable `apps/api/drizzle` migration directory.
- [ ] No domain tables, fake entities, production-like seeds, or automatic startup migrations exist.
- [ ] The reusable database resource has no query-on-import behavior and closes idempotently during process shutdown.
- [ ] Explicit generation, migration, connectivity, Studio, lifecycle, and destructive reset commands exist with distinct behavior.
- [ ] Default tests require no live database; opt-in integration coverage passes against the healthy Compose service.
- [ ] `/api/v1/health` remains HTTP 200 and schema-valid while PostgreSQL is unavailable.
- [ ] Root lint, type-check, build, and default tests pass without committing `.env`, generated output, or credentials.

**STOP HERE. Report to the user and wait for confirmation before proceeding to Story 04.**
