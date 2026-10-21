# Story 05 — Document and verify the foundation

## Prerequisites

- [Story 01 completed: Establish the monorepo and shared contracts](01-story-establish-monorepo-and-shared-contracts.md).
- [Story 02 completed: Create the API and health endpoint](02-story-create-api-and-health-endpoint.md).
- [Story 03 completed: Add PostgreSQL and Drizzle](03-story-add-postgresql-and-drizzle.md).
- [Story 04 completed: Create the bilingual web foundation](04-story-create-bilingual-web-foundation.md).
- Treat scripts, paths, ports, environment names, and observed command results from the implemented repository as authoritative; documentation must match them exactly.

---

## Story Goal

Finish Phase 1 with repository-specific engineering rules, onboarding documentation, architecture/security guardrails, and a clean-checkout verification pass. Correct foundation inconsistencies discovered during verification, but do not add business behavior or broaden scope.

---

## Context — Read These Files First

1. `.squad/stories/foundation/initialize-elevator-maintenance-platform/intake.md` — read lines 132–154 for security/documentation deliverables, lines 164–180 for full acceptance criteria, and lines 217–228 for exclusions.
2. [Story 01](01-story-establish-monorepo-and-shared-contracts.md) — read lines 27–99 for workspace, TypeScript, lint, shared-contract, and lockfile decisions.
3. [Story 02](02-story-create-api-and-health-endpoint.md) — read lines 27–134 for API/configuration/lifecycle decisions and lines 142–151 for HTTP failure policy.
4. [Story 03](03-story-add-postgresql-and-drizzle.md) — read lines 27–121 for Compose, Drizzle, connection ownership, and database commands; read lines 152–159 for rollback constraints.
5. [Story 04](04-story-create-bilingual-web-foundation.md) — read lines 29–148 for frontend/config/localization decisions and lines 156–167 for UI failure behavior.
6. `package.json`, `apps/api/package.json`, and `apps/web/package.json` — after Stories 01–04, verify every command name before documenting it.
7. `.env.example`, `apps/web/.env.example`, and `compose.yaml` — verify every variable, port, service, health check, and volume before documenting setup.
8. Grep for `process.env`, `import.meta.env`, `DATABASE_URL`, `VITE_`, `localStorage`, `lang`, `dir`, and `/api/health` across `apps/` and `packages/`; separately identify historical `/api/v1/health` plan references and confirm implementation matches the boundaries described below.

---

## Implementation tasks

### 1 — Add durable engineering instructions

**Create file: `AGENTS.md`**

Write concise instructions that apply to the whole repository:

- State workspace ownership and dependency direction: web/API may depend on `@elevator/shared`; shared must remain framework/runtime neutral; applications never import each other's source.
- List the exact root install, dev, lint, type-check, build, test, database, and migration commands verified from manifests.
- Require strict TypeScript, no unbounded `any`, Zod validation at every external/config boundary, and inferred types from shared schemas where practical.
- Require API-side deny-by-default authorization in future protected features. UI hiding is never authorization.
- Preserve invariants verbatim: customers access only their own customer/tenant data; technicians access only explicitly authorized assignments; technicians can never delete or archive customer maintenance requests.
- Require future important mutations to emit auditable actor, action, target, timestamp, and minimized relevant context/before-after data.
- Prohibit secrets in source, logs, tests, browser bundles, examples, and commits. Limit browser variables to the `VITE_` allowlist and validate both browser/server environment input.
- Require explicit reviewed Drizzle migrations; never mutate schema or apply migrations during API startup, edit an applied migration, or add a domain table without its migration/test/documentation.
- Require tests for success, authorization/data-scope failure, validation failure, and regression behavior appropriate to each future change.
- Require every user-facing string to use locale resources, keep `ar`/`en` resources aligned, synchronize root language/direction, and prefer logical/direction-aware layout.
- Require architecture/README updates whenever commands, ports, variables, package boundaries, or foundational flows change.

Keep instructions operational and repository-specific. Do not include generated plan prose or claim that unimplemented auth/audit/Socket.IO systems already exist.

### 2 — Create executable onboarding documentation

**Create file: `README.md`**

Include:

1. Phase 1 status and a short statement of what exists versus what is intentionally deferred.
2. Prerequisites matching `.nvmrc`, `package.json` engines, npm package manager metadata, PostgreSQL image, and Docker Compose usage.
3. Exact clean-checkout steps: `npm ci`, copy root and web environment examples to ignored local files, replace the local password consistently, start PostgreSQL, wait for health, apply migrations explicitly, and start development.
4. Development URLs: web, API health, and any Drizzle Studio URL only if the implemented command reports one. Label `/api/health` liveness, not database readiness.
5. A command table copied from actual package scripts for quality checks, individual workspaces, database lifecycle, connectivity, generation, migration, Studio, and destructive reset.
6. Environment tables separating root/server/Compose settings from `apps/web/.env` browser-public settings. Explain that `VITE_` values are shipped to users.
7. Database workflow: edit schema, generate, inspect generated SQL, start healthy PostgreSQL, apply, and commit schema plus migration metadata together. State that API startup never migrates.
8. Troubleshooting for port conflicts, unhealthy PostgreSQL, mismatched credentials/URL, CORS origin mismatch, absent shared build output, invalid locale storage, and unavailable API status.
9. A prominently labeled warning that the reset command permanently deletes the named local development volume.
10. Verification commands and expected high-level outcomes without hardcoding volatile test counts.

Use PowerShell-friendly copy examples because the current workspace is Windows, while keeping npm/Docker commands cross-platform. Do not include real credentials.

### 3 — Record architecture and future security boundaries

**Create file: `docs/architecture.md`**

Document only verified foundation behavior and clearly label future extension points:

- A directory/ownership map for root tooling, `apps/web`, `apps/api`, `packages/shared`, and API-owned Drizzle schema/migrations.
- Dependency direction: `web -> shared`, `api -> shared`; never `shared -> apps` or `web -> api source`.
- Browser request flow from parsed `VITE_API_BASE_URL` through `/api/health`, API CORS/app factory/router, shared response validation, and localized UI state.
- Server configuration flow from injected/root local environment through one Zod parser into composed modules. Explain why raw environment access is restricted.
- PostgreSQL lifecycle, lazy pool/Drizzle ownership, explicit readiness command, explicit migration action, graceful resource close, and why liveness is database-independent.
- Locale flow from validated persisted `ar`/`en` preference through provider/messages to root `lang`/`dir`; Arabic is the Phase 1 default.
- Future authentication/RBAC boundary at the Express/API layer with deny-by-default policies, object/tenant scope checks, and no reliance on client controls.
- The exact customer isolation, technician assignment, and technician no-delete/no-archive invariants.
- Future audit boundary for important mutations, including actor/action/target/timestamp/context, sensitive-data minimization, and append-oriented handling.
- Future Socket.IO boundary: attach to the composed HTTP server, authenticate the handshake using the same server-side identity/policy layer, authorize each subscription/room server-side, and emit only post-authorization sanitized events. Mark all real-time behavior unimplemented.
- Phase 1 threat notes: browser bundle exposure, CORS not being authorization, secret/log leakage, migration drift, cross-workspace coupling, malformed health responses, and stale locale/direction state.

Use a small text or Mermaid dependency diagram only if it renders without an external asset. Do not present planned roles, tables, audit storage, readiness routes, or Socket.IO transports as implemented.

### 4 — Run a clean-checkout consistency audit

**Update files only when verification finds a mismatch:** `package.json`, workspace manifests, environment examples, `compose.yaml`, TypeScript/ESLint/Vitest configs, or foundation source/tests.

- Confirm every relevant workspace has real `lint`, `typecheck`, `build`, and `test` behavior and root scripts invoke all of them in dependency-safe order without `--if-present`.
- Confirm `npm ci` recreates dependencies from the single root lockfile without changing it.
- Confirm no tracked `.env` file, nested lockfile, secret, dependency directory, build output, coverage directory, or machine-specific path exists.
- Confirm the API build can load shared runtime output and the web production build contains none of `DATABASE_URL`, `POSTGRES_PASSWORD`, or a replacement local password.
- Confirm default tests do not require live PostgreSQL and the opt-in database check/test is distinctly named/documented.
- Confirm the README, architecture document, examples, Compose file, and package scripts use identical ports, origins, variable names, workspace names, and paths.
- Make the smallest correction at the source of truth, update affected documentation in the same change, and rerun the impacted plus full quality gates.

---

## Edge Cases & Failure Modes

- Documentation that names a nonexistent script or stale port blocks onboarding; Story 05 reads manifests/examples first and copies exact values into `README.md` and `docs/architecture.md`.
- A clean checkout has no `.env`; setup instructs the developer to copy both example files and choose a consistent local-only password before Compose/API commands.
- An unhealthy but running PostgreSQL container is not treated as ready; README uses `docker compose ps`/health plus `db:check` before migration.
- A developer runs destructive reset assuming it only stops containers; README and `AGENTS.md` distinguish `db:down` from the volume-deleting `db:reset` at the command entry.
- CORS is mistaken for authorization; architecture documentation explicitly records that CORS is browser transport policy and future access control remains server-side and deny-by-default.
- Planned RBAC, audit, and Socket.IO boundaries are mistaken for implemented features; each architecture subsection labels current Phase 1 behavior and future work separately.
- Localized UI is extended with hardcoded text or physical-direction styling; `AGENTS.md` makes aligned resources and logical layout mandatory.
- A secret-like local value leaks into docs, logs, build output, or Git; the final audit searches tracked files and browser output and replaces only with obvious placeholders.

---

## Test Plan

1. **Documentation smoke:** Follow `README.md` from a clean checkout/local clone using only tracked files; verify every copied path and command exists and produces the documented class of result.
2. **Static policy:** Inspect `AGENTS.md` for all three access invariants, API-side deny-by-default, audit requirements, migration discipline, validation, localization, testing, and secret handling.
3. **Architecture consistency:** Compare `docs/architecture.md` package arrows, config flow, database ownership, endpoint, locale default, and future boundaries to implemented files identified in Context.
4. **Automated regression:** Run every default Vitest suite across shared, API, and web with PostgreSQL stopped.
5. **Opt-in database smoke:** Start the Compose service, wait for health, run connectivity/migration checks, then stop it without deleting the volume.
6. **Bundle/secret smoke:** Search tracked files and built web assets for real local credentials, `DATABASE_URL`, and `POSTGRES_PASSWORD`; allow only safe variable names/placeholders in example/documentation files and no server variable in the browser bundle.

---

## Verification Steps

1. **Clean install:** In a clean clone/worktree, run `npm ci` from repository root; verify the root lockfile remains unchanged and no nested lockfile appears.
2. **Frontend runs:** Copy environment examples as documented, start the stack, open the documented web URL, switch Arabic/English, reload, and verify API reachable/unavailable states.
3. **Backend runs:** Request the documented health URL with PostgreSQL both running and stopped; confirm the same schema-valid HTTP 200 liveness response.
4. **Database workflow:** Run the documented Compose health, connectivity, generation, and migration commands; stop non-destructively afterward.
5. **Quality gates:** From repository root, run `npm run lint`, `npm run typecheck`, `npm run build`, and `npm test`; all workspaces must execute and pass.
6. **Secret/artifact audit:** Run `git status --short` and targeted searches for environment files, credentials, nested lockfiles, `node_modules`, `dist`, and coverage; confirm none is staged/tracked.
7. **Regression:** Compare README/architecture command and configuration tables one last time against manifests, examples, and Compose.

---

## Done Criteria

- [ ] Root `AGENTS.md` contains executable repository rules for boundaries, commands, typing/validation, migrations, testing, localization, documentation, and secret handling.
- [ ] `AGENTS.md` records API-side deny-by-default, customer isolation, technician assignment scope, the absolute technician delete/archive prohibition, and future audit requirements.
- [ ] Root README provides a verified clean-checkout setup, exact commands/URLs/variables, migration lifecycle, destructive reset warning, troubleshooting, verification, and Phase 1 status.
- [ ] Architecture documentation accurately maps dependencies, request/config/database/locale flows, graceful lifecycle, and database-independent liveness.
- [ ] Authentication/RBAC, audit, and Socket.IO sections are explicit future boundaries and do not claim unimplemented behavior.
- [ ] `npm ci` is reproducible from one root lockfile and root lint, type-check, build, and default test commands execute all workspaces successfully.
- [ ] PostgreSQL Compose health, explicit connectivity, generation, and migration workflows operate as documented; API startup applies no migration.
- [ ] The web bundle contains no server/database settings or secrets, and tracked files contain no real credential, local environment file, build output, dependencies, or machine-specific path.
- [ ] Arabic/English switching, persisted RTL/LTR attributes, shared health validation, API error handling, and graceful resource closure remain covered and passing.
- [ ] No public/CMS pages, dashboards, portals, domain models, authentication/authorization implementation, audit persistence, notifications, reports, or other business functionality was added.

**STOP HERE. Phase 1 foundation is complete; report verification evidence and wait for approval before planning business features.**
