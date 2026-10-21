# Story 02 — Create the API and health endpoint

## Prerequisites

- [Story 01 completed: Establish the monorepo and shared contracts](01-story-establish-monorepo-and-shared-contracts.md).
- Coordinate changes to `HealthResponse` through `@elevator/shared`; do not duplicate its schema inside the API.

---

## Story Goal

Create a strict TypeScript Express service with validated server configuration, narrow development CORS, centralized HTTP failure handling, a testable application factory, clean process lifecycle handling, and the versioned `GET /api/v1/health` liveness endpoint. The endpoint remains independent of PostgreSQL readiness.

Authentication, authorization, business routes, domain data, Socket.IO, and database access are not in scope.

---

## Context — Read These Files First

1. `.squad/stories/foundation/initialize-elevator-maintenance-platform/intake.md` — read lines 83–87, 105–123, and 132–137 for API structure, health semantics, validation, CORS, and security constraints.
2. [Story 01](01-story-establish-monorepo-and-shared-contracts.md) — read lines 27–59 for root scripts and TypeScript/ESLint conventions, then lines 61–89 for the shared package and exact health contract.
3. `packages/shared/src/contracts/health.ts` — after Story 01, verify `healthResponseSchema` and `HealthResponse`; import from `@elevator/shared`, not this private module path.
4. `package.json` — after Story 01, verify existing root scripts and extend their explicit execution order rather than replacing them.

---

## Backend Tasks

### 1 — Define the API workspace

**Create files:**

- `apps/api/package.json`
- `apps/api/tsconfig.json`
- `.env.example`

Set the package name to `@elevator/api`, keep it private and ESM-based, and add `@elevator/shared` with `npm install @elevator/shared --workspace @elevator/api` so npm records a standard compatible version range and symlinks the local workspace. Add Express, CORS, and Zod runtime dependencies. Add the corresponding type packages, `tsx`, Supertest, and Vitest support as development dependencies.

Add non-placeholder scripts:

- `dev`: start the TypeScript server in watch mode and load the optional repository-root `.env` only for development.
- `build`: emit production JavaScript to `dist` after the shared package is built.
- `start`: execute emitted JavaScript and rely on injected process environment; do not load a committed credential file.
- `lint`, `typecheck`, and `test`: target actual API source/tests and fail on errors.

In the root `.env.example`, document safe examples for:

```dotenv
NODE_ENV=development
PORT=3000
WEB_ORIGIN=http://localhost:5173
DATABASE_URL=postgresql://elevator_app:replace-me@localhost:5432/elevator_platform
```

The example value is documentation, not a usable production secret. Do not add a real `.env` file.

### 2 — Parse configuration once at the boundary

**Create file: `apps/api/src/config/env.ts`**

Export a pure parser and its inferred config type. Accept an explicit key/value source so tests do not mutate global environment state; call it with `process.env` only in the process entry point.

```ts
export const apiEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  WEB_ORIGIN: z.string().url(),
  DATABASE_URL: z.string().url().refine(
    (value) => value.startsWith("postgresql://") || value.startsWith("postgres://"),
    "DATABASE_URL must use the PostgreSQL protocol",
  ),
});
```

- Return a typed, immutable configuration object with application-friendly property names.
- On validation failure, throw one actionable configuration error listing invalid variable names and validation messages, never supplied values.
- Other modules receive config through arguments; they must not read `process.env` directly.

### 3 — Build a testable Express application

**Create files:**

- `apps/api/src/app.ts`
- `apps/api/src/http/not-found.ts`
- `apps/api/src/http/error-handler.ts`
- `apps/api/src/routes/health.ts`

Export `createApp(config)` without listening on a port. Configure:

1. CORS with exactly `config.webOrigin`; do not use `*` or reflect arbitrary origins.
2. `express.json()` with a conservative request-size limit.
3. `GET /api/v1/health` before failure middleware.
4. A JSON 404 handler for unmatched routes.
5. A final four-argument error handler returning a stable, generic error body.

The health handler must create a fresh ISO timestamp, validate the payload with `healthResponseSchema`, and send the parsed value:

```ts
const payload: HealthResponse = {
  status: "ok",
  service: "elevator-api",
  timestamp: new Date().toISOString(),
};

res.status(200).json(healthResponseSchema.parse(payload));
```

Do not query PostgreSQL, expose build internals, or include environment values. The liveness endpoint must remain available when PostgreSQL is unavailable.

### 4 — Separate the process lifecycle

**Create file: `apps/api/src/server.ts`**

- Parse `process.env` once, call `createApp`, and bind the configured port.
- Handle `SIGINT` and `SIGTERM` idempotently: stop accepting connections, await server close, and exit successfully.
- Handle startup/listen failures with a non-zero exit code and a sanitized log message. Do not serialize the validated config or raw environment.
- Add a bounded forced-exit fallback so shutdown cannot hang indefinitely; clear it after successful close.
- Story 03 will add database resource closure to the same shutdown path.

### 5 — Wire root orchestration

**Update file: `package.json`**

- Extend root `build`, `lint`, `typecheck`, and `test` to run shared first and API second using explicit workspace commands.
- Make root API development build `@elevator/shared` before starting `@elevator/api`, ensuring runtime package output exists.
- Do not use `--if-present`; a missing required workspace script must fail visibly.

**Update file: `eslint.config.js`**

- Add Node globals/configuration for `apps/api` without leaking them into the shared package.

**Update file: `package-lock.json`** through npm after dependency installation.

---

## Frontend Tasks

No frontend changes required. Story 04 creates the React application and consumes this health endpoint.

---

## Edge Cases & Failure Modes

- Missing, malformed, non-PostgreSQL `DATABASE_URL`, invalid `WEB_ORIGIN`, or out-of-range `PORT` causes startup to fail before listening; `apps/api/src/config/env.ts` reports field names/messages without secret values.
- A request from an origin other than the configured `WEB_ORIGIN` receives no permissive CORS grant; `apps/api/src/app.ts` owns this policy.
- An unavailable PostgreSQL server does not change `/api/v1/health`; `apps/api/src/routes/health.ts` performs no database work.
- Unknown paths return the documented JSON 404 response through `apps/api/src/http/not-found.ts`; unexpected errors return a generic 500 without stack traces through `error-handler.ts`.
- Repeated or overlapping `SIGINT`/`SIGTERM` signals initiate shutdown once in `apps/api/src/server.ts`.
- A malformed internal health payload fails schema parsing and reaches centralized error handling rather than returning a contract-breaking 200.

---

## Test Plan

1. **Unit:** Create `apps/api/src/config/env.test.ts` covering a valid environment, defaults, invalid port, invalid origin, missing database URL, non-PostgreSQL protocol, and redaction of supplied secret values from error messages.
2. **Integration:** Create `apps/api/src/routes/health.test.ts` with Supertest. Assert status 200, JSON content type, exact stable fields, ISO timestamp, and successful `healthResponseSchema` parsing.
3. **Integration:** In the health test, supply a syntactically valid but unreachable PostgreSQL URL and prove liveness still returns 200 without attempting a connection.
4. **Integration:** Create `apps/api/src/http/http-errors.test.ts` covering JSON 404 behavior, generic 500 behavior, and absence of stack/config leakage.
5. **Static:** Verify production source outside `config/env.ts` and `server.ts` contains no `process.env` access.

---

## Verification Steps

1. **Backend tests:** From repository root, run `npm test --workspace @elevator/api`.
2. **Backend types:** From repository root, run `npm run typecheck --workspace @elevator/api` after building shared output.
3. **Backend builds:** From repository root, run `npm run build`; then run the built API with documented environment values.
4. **Backend runs:** From repository root, run `npm run dev --workspace @elevator/api`, then request `http://localhost:3000/api/v1/health` and validate the response with the shared schema.
5. **Failure behavior:** Start once with an invalid `PORT` and once without `DATABASE_URL`; confirm each fails before listening and logs no supplied values.
6. **Regression:** From repository root, run `npm run lint`, `npm run typecheck`, `npm run build`, and `npm test` for all implemented workspaces.

---

## Done Criteria

- [ ] `@elevator/api` is a strict ESM TypeScript workspace that consumes `@elevator/shared` only through its public export.
- [ ] Configuration is parsed once with Zod, invalid startup configuration fails safely, and server-only settings never enter browser code.
- [ ] The app factory is independent of network binding and process environment access.
- [ ] `GET /api/v1/health` returns HTTP 200 JSON matching the shared schema and does not depend on database availability.
- [ ] Development CORS permits only the configured web origin.
- [ ] Unknown routes and unexpected failures return centralized JSON errors without secrets, paths, or stacks.
- [ ] `SIGINT` and `SIGTERM` stop the HTTP server idempotently with a bounded fallback.
- [ ] API configuration, health, 404, and error tests execute and pass; root quality commands include shared and API workspaces.
- [ ] No authentication, RBAC, business routes, database queries, or Socket.IO behavior has been added.

**STOP HERE. Report to the user and wait for confirmation before proceeding to Story 03.**
