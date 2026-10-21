# Elevator Maintenance Platform

The repository provides the production-oriented technical foundation for a bilingual elevator company website and maintenance management system, plus an interactive frontend-only product preview. It includes an npm-workspaces monorepo, Arabic/English React application, Express liveness API, shared runtime contract, and PostgreSQL/Drizzle development tooling.

The dashboard and public website routes use deterministic, clearly labeled sample data for design evaluation only. Authentication, RBAC, business APIs, domain persistence, CMS workflows, audit persistence, reports, notifications, and Socket.IO are intentionally not implemented.

See [Architecture](docs/architecture.md) for package boundaries and request/configuration flows, and [Production preparation](docs/production-readiness.md) for the work required before a production release.

## Prerequisites

- Node.js 24 (`.nvmrc` and `package.json` require `>=24 <25`)
- npm 11 (`packageManager` is `npm@11.6.2`)
- Docker Desktop with Docker Compose v2
- Git

The local database uses the pinned `postgres:17.11-alpine3.24` image. PostgreSQL does not need to be installed directly on Windows.

## Windows PowerShell setup

From the repository root:

```powershell
npm ci
Copy-Item .env.example .env
Copy-Item apps/web/.env.example apps/web/.env
```

Edit the ignored root `.env` and replace `replace-with-a-local-password` in both `POSTGRES_PASSWORD` and `DATABASE_URL` with the same local-only password. Keep `POSTGRES_PORT` and the port inside `DATABASE_URL` aligned.

Start and verify PostgreSQL, then apply committed migrations explicitly:

```powershell
npm run db:up
docker compose --env-file .env ps
npm run db:check
npm run db:migrate
```

Wait until the `postgres` container reports `healthy` before the connectivity or migration commands. Phase 1 contains no domain tables; the migration command is still explicit and is never run by API startup.

Start the frontend and API together:

```powershell
npm run dev
```

Or start them in separate PowerShell windows:

```powershell
npm run dev:api
```

```powershell
npm run dev:web
```

## Development endpoints

| Service | Address | Meaning |
| --- | --- | --- |
| Web | `http://localhost:5173` | Vite development application |
| API health | `http://localhost:3100/api/health` | Process liveness; it does not assert database readiness |
| PostgreSQL | `localhost:55432` by example | Configurable host port mapped to container port `5432` |

Frontend preview routes:

- `http://localhost:5173/` — foundation home and live API status.
- `http://localhost:5173/demo` — interactive operations dashboard with requests, elevators, customers, technicians, and scheduling screens.
- `http://localhost:5173/website-preview` — bilingual public company website concept.

All records under `/demo` are imported from the frontend-only `src/demo/data.ts` module. Preview actions that would require business APIs are disabled and do not pretend to save data.

Drizzle Studio is started with `npm run db:studio`; use the local URL printed by that command rather than relying on a fixed port.

## Environment variables

### Root `.env`: server and local Compose settings

The root file is ignored by Git and is consumed by API development scripts, Drizzle tooling, and Docker Compose.

| Variable | Example | Purpose |
| --- | --- | --- |
| `NODE_ENV` | `development` | API runtime mode: `development`, `test`, or `production` |
| `PORT` | `3100` | API listener port |
| `WEB_ORIGIN` | `http://localhost:5173` | Exact browser origin allowed by development CORS |
| `POSTGRES_DB` | `elevator_platform` | Local Compose database name |
| `POSTGRES_USER` | `elevator_app` | Local Compose database user |
| `POSTGRES_PASSWORD` | placeholder only | Local Compose password; replace in ignored `.env` |
| `POSTGRES_PORT` | `55432` | Host port mapped to PostgreSQL container port `5432` |
| `DATABASE_URL` | PostgreSQL URL using port `55432` | API and Drizzle connection string; credentials must match the Compose fields |

### `apps/web/.env`: browser-public settings

| Variable | Example | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://localhost:3100` | Validated base URL used by the browser API client |

Every `VITE_` variable is bundled into public browser code. Never place credentials, database URLs, private tokens, or server-only settings in this file.

## Commands

### Repository and workspace quality

| Command | Purpose |
| --- | --- |
| `npm ci` | Reproduce dependencies from the single root lockfile |
| `npm run dev` | Build shared contracts, then run API and web concurrently |
| `npm run dev:api` | Build shared contracts and start the API watcher |
| `npm run dev:web` | Build shared contracts and start Vite |
| `npm run lint` | Lint shared, API, and web workspaces |
| `npm run typecheck` | Strictly type-check all workspaces |
| `npm run build` | Build shared, API, and web in dependency order |
| `npm test` | Run default shared, API, and web tests without a live database |
| `npm run test:db` | Run the opt-in database integration test against configured PostgreSQL |

An individual workspace can be targeted with commands such as `npm test --workspace @elevator/web` or `npm run typecheck --workspace @elevator/api`.

### PostgreSQL and Drizzle

| Command | Purpose |
| --- | --- |
| `npm run db:up` | Start the local PostgreSQL service |
| `npm run db:logs` | Follow PostgreSQL container logs |
| `npm run db:check` | Run a sanitized `SELECT 1` connectivity check and close the pool |
| `npm run db:generate` | Generate Drizzle migrations from the API-owned schema |
| `npm run db:migrate` | Explicitly apply committed migrations |
| `npm run db:studio` | Start local Drizzle Studio |
| `npm run db:down` | Stop containers without deleting the named volume |
| `npm run db:reset` | **Destructively delete containers and the named local database volume** |

> Warning: `npm run db:reset` permanently deletes all data in the local `postgres_data` volume. It is not a normal stop command and cannot be undone unless the data was backed up.

## Database migration workflow

1. Change the API-owned schema in `apps/api/src/db/schema.ts` only as part of an approved domain story.
2. Run `npm run db:generate`.
3. Inspect every generated SQL and metadata change under `apps/api/drizzle`.
4. Start PostgreSQL, wait for a healthy container, and run `npm run db:check`.
5. Apply with `npm run db:migrate` and run relevant unit and database tests.
6. Commit the schema, generated migration, migration metadata, tests, and documentation together.

Never edit an applied migration or make API startup generate/apply schema changes. If migration application fails, inspect the database and Drizzle journal before retrying.

## Directory structure

```text
apps/
  api/                 Express composition, routes, server lifecycle, database ownership
    drizzle/           Generated Drizzle migration metadata and future SQL migrations
    src/db/            Schema, pool/Drizzle resource, connectivity check
  web/                 React/Vite application, preview routes, demo data, UI, localization, API client
packages/
  shared/              Framework-neutral Zod schemas and inferred TypeScript contracts
docs/
  architecture.md      Implemented flows and future security boundaries
  production-readiness.md
.squad/                Preserved Squad-Kit intake, plans, and history
compose.yaml           Local PostgreSQL service
```

Dependency direction is `apps/web -> @elevator/shared` and `apps/api -> @elevator/shared`. Shared code never depends on either application, and applications never import each other's source.

## Verification

Run the default checks with PostgreSQL stopped:

```powershell
npm run lint
npm run typecheck
npm run build
npm test
npm audit --omit=dev
```

Then start PostgreSQL and run the opt-in checks:

```powershell
npm run db:up
docker compose --env-file .env ps
npm run db:check
npm run test:db
npm run db:down
```

## Troubleshooting

- **Port already in use:** change `PORT` and `VITE_API_BASE_URL` together for the API, or change `POSTGRES_PORT` and the port in `DATABASE_URL` together for PostgreSQL. Keep `WEB_ORIGIN` equal to the exact Vite browser origin.
- **PostgreSQL is running but unavailable:** use `docker compose --env-file .env ps` and `npm run db:logs`; wait for `healthy`, then check that the user, password, database, and port agree with `DATABASE_URL`.
- **CORS blocks the browser:** open `http://localhost:5173`, not an alternate hostname, and keep `WEB_ORIGIN=http://localhost:5173`. Do not broaden CORS as a workaround.
- **Shared import cannot resolve at runtime:** run `npm run build --workspace @elevator/shared`, or use the root development/build commands that do this first.
- **The UI reports the API unavailable:** confirm the API is running on port `3100`, request `/api/health` directly, and verify `apps/web/.env` contains the matching base URL.
- **Locale preference is corrupted:** remove the `elevator.locale.v1` browser storage key. Invalid values already fall back safely to Arabic.
- **Configuration fails at startup:** read the named variable in the sanitized error, then compare the ignored environment file with its `.env.example`; supplied values are intentionally not logged.
