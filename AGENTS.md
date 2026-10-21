# Engineering instructions

These rules apply to every change in this repository.

## Scope and package boundaries

- The npm workspaces are `apps/web`, `apps/api`, and `packages/shared`.
- `apps/web` and `apps/api` may depend on the public `@elevator/shared` entry point. They must never import each other's source.
- `packages/shared` must remain framework-neutral and runtime-neutral. It must never depend on either application, database code, browser APIs, or Node-only APIs.
- Database schema, migrations, connections, and lifecycle belong to `apps/api`.
- Do not add business features, domain tables, authentication, authorization, auditing, or real-time behavior without an approved story.

## Supported tools and commands

- Use Node.js 24 and npm 11. Install only from the repository root with `npm ci`; maintain one root lockfile.
- Start the full development stack with `npm run dev`, or use `npm run dev:api` and `npm run dev:web` separately.
- Vercel uses separate projects rooted at `apps/web` and `apps/api`; their tracked `vercel-build` scripts must compile `@elevator/shared` first. Never add migration execution to a Vercel build or API startup.
- Before handing off a change, run `npm run lint`, `npm run typecheck`, `npm run build`, and `npm test`.
- Database commands are `npm run db:up`, `npm run db:check`, `npm run db:generate`, `npm run db:migrate`, `npm run db:studio`, `npm run test:db`, `npm run db:logs`, and `npm run db:down`.
- `npm run db:reset` is destructive: it removes the local named PostgreSQL volume. Never run it without explicit user authorization and a verified local target.

## Type safety and validation

- Keep TypeScript strict. Do not introduce unbounded `any`, suppress errors without a documented reason, or weaken root compiler/lint rules.
- Validate environment values, HTTP payloads, persisted browser values, and other external input with Zod at the boundary.
- Infer types from shared schemas where practical. Coordinate contract changes through `@elevator/shared` and test both consumers.
- Keep `create-app.ts` testable without binding a port; process environment and listener lifecycle stay in process entry points.
- Keep `apps/api/index.ts` listener-free: it is the Vercel Express entry and must directly import `express` so Vercel detects it. Local listening, signal handling, and owned database shutdown stay in `apps/api/src/start-server.ts`. Do not add `app.ts`, `server.ts`, or another competing Vercel-recognized entry point under `apps/api/src`.

## Security invariants

- Future protected API behavior is deny-by-default and enforced by the API. Hiding UI is never authorization, and CORS is never authorization.
- Customers may access only their own customer/tenant data.
- Technicians may access only explicitly authorized assignments.
- Technicians must never delete or archive customer maintenance requests.
- Important future mutations must be auditable with actor, action, target, timestamp, and minimized relevant context or before/after data. Do not store secrets or unnecessary sensitive values in audit records.
- Do not put secrets or usable credentials in source, logs, tests, examples, browser bundles, or commits. Only explicitly public settings may use `VITE_`; remember that every `VITE_` value is shipped to users.
- Return generic production errors. Do not expose stack traces, environment values, database details, internal paths, or raw upstream errors.

## Database discipline

- Change the Drizzle schema in `apps/api/src/db/schema.ts`, generate a migration explicitly, inspect its SQL, test it, and commit schema plus migration metadata together.
- Never apply migrations during API startup, edit an applied migration, or repair migration drift by silently changing the database.
- Do not add a domain table without its approved migration, tests, and documentation.
- Keep `/api/health` as process liveness independent of PostgreSQL. Use `npm run db:check` for database readiness.
- Every created pool or database resource must have an owned, awaited, idempotent close path.

## Web and localization

- Put every user-facing string in the aligned `ar` and `en` locale resources. Arabic remains the default unless an approved product decision changes it.
- Locale changes must keep messages, persisted preference, `<html lang>`, and `<html dir>` synchronized.
- Use logical or direction-aware layout properties; verify both RTL and LTR behavior. Keep keyboard focus and accessible names visible and meaningful.
- Browser code reads `import.meta.env` only at the bootstrap/configuration boundary and receives validated configuration through typed composition.

## Tests and documentation

- Add focused tests for success, validation failure, authorization/data-scope failure when applicable, safe error behavior, and regressions introduced by the change.
- Default tests must not require PostgreSQL. Database integration tests stay explicit under `npm run test:db`.
- Preserve `.squad` history. Update `README.md`, `docs/architecture.md`, environment examples, and these instructions whenever commands, ports, variables, package boundaries, or foundational flows change.
- Do not claim manual, browser, database, security, or deployment verification unless it was actually performed.
