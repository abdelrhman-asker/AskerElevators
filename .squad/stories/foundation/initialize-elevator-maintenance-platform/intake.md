# Story intake

Fill this template for each story you want planned. Keep it copy-paste-friendly: the planner reads **this file and the files in `attachments/`**, nothing else.

- Folder: `.squad/stories/foundation/initialize-elevator-maintenance-platform/intake.md`
- Binaries (screenshots, PDFs, exports): put them in `attachments/` next to this file and list them below.
- Do **not** rely on external links (tracker URLs, wiki, chat) — the planner cannot open them. Paste the content you want considered.

This is **not** an implementation prompt. It is the input to the plan-generation meta-prompt bundled with squad-kit (`generate-plan.md` in the installed package).

---

## Feature

- **Feature name (display):** Elevator Maintenance Platform Foundation
- **Feature slug (folder under `plans/`):** `foundation`

## Tracker (metadata only)

- **Tracker type:** `none`
- **Work item id:** `` *(used in filenames and plan tables; fill manually if empty)*
- **Work item type:** ``
- **Status:** ``
- **Assignee:** ``
- **Labels:** ``

External tracker links are **not** followed by the planner. Keep the id for naming and traceability only.

---

## Title

*(Paste the work item title verbatim. Prefilled when `squad new-story` fetched from a tracker.)*

```
Initialize Elevator Maintenance Platform
```

---

## Description

*(Paste the full work item description. Prefilled when fetched from a tracker.)*

```
Establish the production-oriented technical foundation for the Elevator Maintenance Platform without implementing business features. The repository currently contains only the initialized Squad-Kit workspace and git ignore rules.

Product context

The finished product will be a bilingual Arabic/English elevator company website and maintenance management system. Later phases will add a CMS-backed public website and portfolio, Super Admin and Admin dashboards, customer and technician portals, buildings and elevators, maintenance contracts and schedules, maintenance requests and technician assignments, request tracking, real-time notifications, maintenance history, reports, and audit logs.

Phase 1 objective

Create a coherent npm-workspaces monorepo in which the React frontend, Express API, shared TypeScript contracts, PostgreSQL development service, database tooling, quality checks, tests, and documentation work together. The foundation must make later security and business features safe to add, but this phase must not implement those features.

Required technical stack

- React, Vite, and TypeScript for the web application.
- Tailwind CSS and shadcn/ui foundations for styling and accessible UI components.
- Node.js, Express, and TypeScript for the API.
- PostgreSQL and Drizzle ORM for persistence.
- Zod for runtime validation and shared schemas.
- Socket.IO is a future requirement; document an integration boundary but do not add real-time behavior in Phase 1.
- npm workspaces for monorepo/package management.
- Docker Compose for the local PostgreSQL development environment.
- Vitest for automated tests.

Functional and technical requirements

1. Monorepo structure
   - Define a root npm workspace with clearly separated applications and reusable packages.
   - Use `apps/web` for the React application, `apps/api` for the Express service, and `packages/shared` for framework-neutral shared TypeScript code. If database code is separated into its own workspace, document the boundary and rationale; otherwise keep it owned by the API.
   - Provide root scripts that orchestrate development, builds, linting, TypeScript checks, and tests across workspaces using standard npm workspace capabilities.
   - Use one root lockfile and avoid duplicate workspace-level dependency management.
   - Establish consistent module, import alias, TypeScript, and output conventions. Shared packages must be consumable by both applications without importing application internals.

2. React frontend foundation
   - Initialize a strict TypeScript Vite React application that can consume the shared package.
   - Configure Tailwind CSS and the minimal shadcn/ui prerequisites, including centralized theme tokens and a documented component location. Do not build product screens or a component library in this story.
   - Provide a minimal shell/start page suitable for verifying startup, locale direction, styling, and API reachability; it must not imply that authentication or business workflows exist.
   - Keep frontend environment access behind a typed/configured boundary using Vite's public-variable convention. Never expose server-only variables to browser code.

3. Express backend foundation
   - Initialize a strict TypeScript Express application with an application factory separated from the process/server entry point so it is testable without binding a network port.
   - Include baseline JSON parsing, centralized not-found handling, centralized error handling, and clean startup/shutdown behavior.
   - Configuration must be loaded and validated at startup with Zod. Invalid or missing required configuration must fail fast with an actionable error and without printing secret values.
   - Reserve a clear versioned API boundary (for example `/api/v1`) for later business endpoints.

4. Shared TypeScript package
   - Create a framework-neutral package for types, Zod schemas, and API contracts shared by the web and API workspaces.
   - Include only a small foundation contract needed by Phase 1, such as the health response schema/type. Do not place database-specific or browser/server runtime-specific code in the shared package.
   - Ensure types are inferred from schemas where practical to prevent drift, and verify package exports/types resolution during build and type-checking.

5. PostgreSQL development environment
   - Define a Docker Compose PostgreSQL service suitable for local development, with an explicit supported PostgreSQL version, a health check, a persistent named volume, and host port/configuration controlled through environment values.
   - Do not commit real credentials. Compose and application configuration must obtain credentials from ignored local environment files or supplied environment variables; safe placeholders belong in example files only.
   - Document commands for starting, checking, stopping, and resetting the development database. Any reset command must be clearly labeled destructive.

6. Drizzle database foundation
   - Configure Drizzle ORM and Drizzle Kit for PostgreSQL, with schema and migrations stored in predictable, documented locations.
   - Provide a reusable connection module with configuration sourced from validated server environment values.
   - Create only the minimum migration/schema artifact needed to prove and document the migration workflow, if the toolchain requires one. Do not introduce business entities, seed production-like data, or silently mutate the schema during normal API startup.
   - Provide scripts and documentation for generating and applying migrations in development.

7. Health API
   - Expose `GET /api/v1/health` as an unauthenticated liveness endpoint.
   - On success, return HTTP 200 JSON conforming to a shared, validated contract. The payload must contain a stable status value and may contain non-sensitive service/version/timestamp information.
   - Do not disclose environment variables, credentials, stack traces, internal paths, or detailed infrastructure information.
   - Keep liveness semantics independent of optional downstream services. If database readiness is added, expose it distinctly and document/test its failure behavior rather than making the basic contract ambiguous.

8. Quality gates and tests
   - Configure ESLint for all TypeScript/React workspaces and keep generated/build output excluded.
   - Enable strict TypeScript checking with appropriate shared base settings and environment-specific configs.
   - Ensure clean-repository commands exist for lint, type-check, build, and test, and that each command returns a non-zero exit code on failure.
   - Configure Vitest and add focused foundation tests: API health success/contract behavior, configuration validation, and at least one frontend smoke/render or locale-direction test. Tests must not require a developer's real secrets; database-dependent tests, if any, must be clearly separated.
   - Avoid placeholder test scripts that pass without running tests.

9. Environment configuration
   - Add documented `.env.example` files at the appropriate root/application scopes showing every required variable with safe example or placeholder values.
   - Ignore real `.env` variants while retaining example templates in version control.
   - Clearly separate browser-public settings from server-only settings. At minimum document API URL/origin, API port, runtime mode, allowed frontend origin, and PostgreSQL connection inputs or `DATABASE_URL`.
   - Validate environment-dependent ports, URLs, origins, and database connection configuration. Define predictable development defaults only where they are non-sensitive and safe.
   - Configure development CORS narrowly for the documented frontend origin; do not use an unrestricted production default.

10. Arabic, English, and RTL foundations
    - Establish a lightweight, typed localization structure supporting locale identifiers `ar` and `en`, with separate translation resources and no hardcoded user-facing shell text outside those resources.
    - Define and document the initial default-locale decision in configuration; do not infer locale from privileged or personal data.
    - When locale changes, synchronize the root document `lang` and `dir` attributes (`rtl` for Arabic, `ltr` for English) and ensure the choice survives a reload using a non-sensitive client preference.
    - Use direction-aware styling practices (logical properties/utilities) so future UI can support both directions. Load a font stack that renders Arabic and English legibly without causing the foundation to depend on an unavailable runtime secret or private asset.
    - Add a minimal, accessible language switch mechanism only to demonstrate and test the foundation; full public-site navigation and translated product content are later work.

11. Security and architecture guardrails
    - Document that authorization is deny-by-default and must be enforced by the API, never only by client UI. Future roles include Super Admin, Admin, Customer, and Technician.
    - Record non-negotiable data-access rules: customers may access only their own tenant/customer data; technicians may access only explicitly authorized assignments; technicians must never delete or archive customer maintenance requests.
    - Document the future audit requirement for important changes, including actor, action, target, timestamp, and relevant before/after or contextual information with sensitive-data minimization.
    - Do not implement authentication, authorization middleware, roles, audit persistence, or business permissions in Phase 1. The architecture must leave explicit extension points for them and must not include permissive placeholder authorization.
    - No hardcoded secrets or credentials, no secrets in logs or browser bundles, and no committed local environment files.

12. Engineering and project documentation
    - Add a root `AGENTS.md` with concise, repository-specific engineering instructions covering workspace boundaries, commands/quality gates, strict typing and Zod validation, migration discipline, testing expectations, localization/RTL practices, security invariants, environment/secret handling, and the rule to update documentation when architecture changes.
    - Add a root README with prerequisites, supported tool/runtime versions, initial setup, environment preparation, workspace commands, database lifecycle, migrations, development URLs, verification, troubleshooting, and a Phase 1 scope/status statement.
    - Add architecture documentation describing the monorepo/package boundaries, dependency direction, request/configuration flow, database ownership and migration approach, localization/RTL approach, future authentication/RBAC/audit boundaries, and future Socket.IO integration boundary.
    - Keep documentation executable and consistent with package scripts, paths, ports, and configuration names.

Expected deliverables

- Root npm workspace manifest and lockfile produced by the later implementation story, plus shared TypeScript/ESLint conventions and root orchestration scripts.
- `apps/web`, `apps/api`, and `packages/shared` foundation workspaces (and an optional documented database workspace if the plan justifies it).
- Tailwind/shadcn prerequisites and bilingual RTL/LTR application shell.
- Docker Compose PostgreSQL configuration, Drizzle configuration, schema/migration location, and migration scripts.
- Validated environment configuration and committed environment examples with no real secrets.
- Versioned health endpoint and its shared contract.
- ESLint, strict type-check, build, and Vitest configuration with meaningful foundation tests.
- Root `AGENTS.md`, root `README.md`, and architecture documentation under a predictable docs location.
```

---

## Acceptance criteria

*(Checklist, bullets, Gherkin, etc. Prefilled for Azure DevOps when the work item has acceptance criteria.)*

```
- [ ] The repository is an npm-workspaces monorepo with documented boundaries for `apps/web`, `apps/api`, and `packages/shared`; dependency direction prevents shared code from depending on either application.
- [ ] A documented clean-machine setup using supported Node.js/npm and Docker versions can install dependencies from the root lockfile and start the web app, API, and PostgreSQL development service.
- [ ] The Vite React app starts successfully, uses strict TypeScript, Tailwind CSS, and shadcn/ui prerequisites, and consumes at least one contract/type from the shared package.
- [ ] The frontend offers `ar` and `en`; selecting Arabic sets `<html lang="ar" dir="rtl">`, selecting English sets `<html lang="en" dir="ltr">`, and the non-sensitive preference persists across reloads.
- [ ] The minimal shell's visible text is sourced from locale resources and remains usable in both RTL and LTR layouts.
- [ ] The Express API uses a testable app/server separation, validates configuration with Zod before startup, and handles unknown routes and errors through centralized middleware without leaking sensitive details.
- [ ] `GET /api/v1/health` returns HTTP 200 and a JSON payload conforming to the shared health schema; an automated test verifies status, content type, and contract.
- [ ] The local PostgreSQL service is defined by Docker Compose with a pinned supported version, health check, persistent named volume, configurable port/credentials, and no committed real credential.
- [ ] Drizzle is configured against validated server-side database settings; documented scripts can generate and apply migrations, and normal API startup does not auto-generate or silently apply schema changes.
- [ ] Tracked `.env.example` documentation covers all required configuration, real `.env` files are ignored, browser configuration cannot import server secrets, and development CORS is limited to the configured web origin.
- [ ] Root commands for lint, type-check, build, and test cover every relevant workspace and all pass from a clean checkout after documented setup.
- [ ] Vitest includes meaningful automated coverage for the health endpoint, configuration rejection, and a frontend shell/localization behavior; no test command is a no-op.
- [ ] Graceful API shutdown closes the HTTP server and database resources without embedding credentials or environment details in logs.
- [ ] The root `AGENTS.md` records engineering rules and the security invariants for future RBAC, customer isolation, technician assignment scope, the absolute prohibition on technician deletion/archival of customer requests, auditability, validation, secrets, migrations, tests, and localization.
- [ ] The root README and architecture documentation accurately describe setup, commands, ports/URLs, environment variables, database lifecycle, workspace dependencies, request/config flow, localization, and the planned extension points for authentication/RBAC, audits, and Socket.IO.
- [ ] No public/CMS pages, dashboards, portals, domain entities, maintenance workflows, authentication/authorization implementation, notification behavior, reporting, or audit-log persistence is introduced by this phase.
- [ ] No secrets, credentials, machine-specific paths, build output, dependency directories, or local environment files are committed.
```

---

## Attachments

Place files in `attachments/` next to this `intake.md`, then list them here so the planner knows what to open.

| File (relative to this folder) | What it is |
| ------------------------------ | ---------- |
| None. | No attachments are required for this foundation story. |

*(Add rows per file. If none, write "None.")*

---

## Dependencies

- **Blocked by / related ids:** None.
- **Depends on code areas or other stories:** No application code or earlier story exists. This story starts from the initialized Squad-Kit workspace and establishes the base required by all later product stories.

## Extra notes (optional)

- The plan should split implementation into small, dependency-ordered stories with explicit verification commands and file ownership. Establish root conventions before workspace-specific work, and establish shared contracts before consumers.
- The plan must distinguish a liveness endpoint from database readiness if both are proposed.
- Prefer the minimum foundation needed to prove integration; production business behavior belongs in later phases.
- Do not add external links as required context; the planner consumes only this intake and listed attachments.

## Technical hints (optional)

- Repos/roots: `.`. Primary language: `typescript`.
- Intended dependency direction: `apps/web -> packages/shared` and `apps/api -> packages/shared`; never `packages/shared -> apps/*`, and never web-to-api source imports.
- Prefer an API application factory for integration tests and a separate process entry point for listening and signal handling.
- Keep runtime environment parsing in application-specific modules and export validated, typed configuration rather than reading `process.env` or `import.meta.env` throughout the codebase.
- Keep Drizzle schema ownership server-side and make migration execution an explicit developer/deployment action.

## Out of scope

- Public company/marketing pages, portfolio content, CMS authoring, media management, SEO implementation, and final visual design.
- Super Admin/Admin dashboards and customer/technician portal screens.
- Authentication, sessions/tokens, password flows, user provisioning, RBAC middleware/policies, tenant/customer authorization queries, and role management.
- Buildings, elevators, customers, technicians, contracts, schedules, maintenance requests, assignments, tracking, maintenance history, reports, and domain database schemas or seed data.
- Request deletion/archive behavior; only the future prohibition for technicians is documented in this phase.
- Audit-log storage and audit event production; only architecture and engineering requirements are documented.
- Socket.IO server/client integration, notification delivery, presence, subscriptions, queues, email/SMS/push, and any real-time product behavior.
- Production cloud infrastructure, deployment pipelines, domains, TLS, backups, observability platforms, and production secret provisioning.
- Full design-system/component-library development, final translations, content entry, accessibility certification, end-to-end browser suites, load testing, and penetration testing.
- Installing packages or implementing any deliverable as part of intake preparation; those actions occur only after the generated plan is reviewed and approved.
