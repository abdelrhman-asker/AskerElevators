# Story 01 — Establish the monorepo and shared contracts

## Prerequisites

- None. This is the first implementation story in a greenfield repository.
- No prior `NN-story-*.md` precedent exists under `.squad/plans/`; follow the structure in this plan and the repository rules established here.

---

## Story Goal

Create the npm-workspaces skeleton, shared TypeScript/ESLint conventions, and a framework-neutral shared package. Establish a typed health-response contract that later API and web stories consume. Do not create runtime API or UI behavior yet.

---

## Context — Read These Files First

1. `.squad/config.yaml` — read lines 1–12; preserve the TypeScript project root, tracker-free filenames, and global story sequencing.
2. `.squad/stories/foundation/initialize-elevator-maintenance-platform/intake.md` — read lines 46–75 for the greenfield objective, required stack, workspace names, and dependency boundaries.
3. `.squad/stories/foundation/initialize-elevator-maintenance-platform/intake.md` — read lines 89–92 and 111–116 for the shared-contract and quality-gate requirements.
4. `.gitignore` — read lines 1–8; retain the Squad-Kit-managed block exactly and append project rules after it.

---

## Implementation tasks

### 1 — Define the root workspace and runtime contract

**Create file: `package.json`**

- Set `private: true`, `type: "module"`, and workspace globs `apps/*` and `packages/*`.
- Use workspace names `@elevator/api`, `@elevator/web`, and `@elevator/shared` throughout the repository.
- Pin the supported runtime policy to Node.js 24.x and npm 11.x through `engines`; add a matching `packageManager` value after npm creates the lockfile.
- Add root scripts for `dev`, `build`, `lint`, `typecheck`, and `test`. At this stage target only `@elevator/shared`; later stories extend them explicitly as workspaces are added. Do not use placeholder commands that always succeed.
- Keep one root `package-lock.json`; never create workspace lockfiles.

**Create file: `.nvmrc`**

- Record major version `24` so local development and documentation use the same Node.js line.

**Update file: `.gitignore`**

- Preserve lines 1–8 byte-for-byte.
- Append ignores for `node_modules/`, `dist/`, `coverage/`, Vite caches, TypeScript build info, logs, editor/OS artifacts, and all `.env`/`.env.*` files.
- Negate `!.env.example` and `!**/.env.example` after the environment patterns so safe templates remain trackable.

### 2 — Establish strict TypeScript conventions

**Create file: `tsconfig.base.json`**

- Define the shared strictness baseline without browser- or Node-specific globals: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `forceConsistentCasingInFileNames`, `isolatedModules`, and `verbatimModuleSyntax`.
- Use modern ESM-compatible settings. Application-specific configs will supply their runtime library and module-resolution choices.
- Do not define aliases that cross application boundaries. Consumers import the shared package by package name.

**Create file: `eslint.config.js`**

- Use ESLint flat configuration with TypeScript support and ignores for dependencies, build output, coverage, generated Drizzle migrations, and Vite output.
- Enable type-aware rules only where the parser configuration supports the relevant workspace tsconfig.
- Keep React-specific rules out until Story 04 adds the web workspace.

### 3 — Create the framework-neutral shared package

**Create files:**

- `packages/shared/package.json`
- `packages/shared/tsconfig.json`
- `packages/shared/src/index.ts`
- `packages/shared/src/contracts/health.ts`
- `packages/shared/src/contracts/health.test.ts`

Use Zod as the only runtime dependency. Configure package exports so consumers import from `@elevator/shared`; expose types to editors from source and runtime JavaScript from `dist`. Root build ordering must compile this package before runtime consumers.

Define the health contract once and infer its TypeScript type:

```ts
import { z } from "zod";

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
  service: z.literal("elevator-api"),
  timestamp: z.string().datetime(),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
```

- Re-export the schema and type from `packages/shared/src/index.ts`.
- Keep the package free of React, Express, Node, database, and environment access.
- Add real `build`, `lint`, `typecheck`, and `test` scripts. Use Vitest for the contract test; verify valid data parses and invalid status/timestamp data is rejected.

### 4 — Install and lock only Story 01 dependencies

**Create file: `package-lock.json`** through npm, not by hand.

- Install TypeScript, ESLint and its TypeScript integration, and Vitest at the workspace root as development dependencies.
- Install Zod in `@elevator/shared` as a production dependency.
- Commit the single generated root lockfile. Confirm no nested lockfile exists.

---

## Edge Cases & Failure Modes

- If an unsupported Node/npm version runs installation, the `engines` declaration in `package.json` and `.nvmrc` communicate the supported version; document any npm warning rather than weakening the policy.
- If a developer creates a real environment file, the appended patterns in `.gitignore` exclude it while the later `**/.env.example` negation keeps templates trackable.
- If an app attempts to import another app, no root alias enables it; `tsconfig.base.json` and workspace package boundaries require shared code to flow through `@elevator/shared`.
- If the health payload contains a non-ISO timestamp or a status other than `"ok"`, `packages/shared/src/contracts/health.ts` rejects it and `health.test.ts` proves the behavior.
- If consumers run before shared output exists, root scripts build `@elevator/shared` first; do not point Node production imports at uncompiled TypeScript.

---

## Test Plan

1. **Unit:** Add `packages/shared/src/contracts/health.test.ts` with named cases for a valid payload, invalid status, missing service, and malformed timestamp.
2. **Static:** Run the shared package type-check with no emitted files and verify the inferred `HealthResponse` stays aligned with the Zod schema.
3. **Package smoke:** Build `@elevator/shared`, then import its public entry point from a Node ESM one-liner; do not import private source paths.

---

## Verification Steps

1. **Install is reproducible:** From repository root, run `npm ci` after the lockfile exists.
2. **Shared lint passes:** From repository root, run `npm run lint`.
3. **Shared types pass:** From repository root, run `npm run typecheck`.
4. **Shared builds:** From repository root, run `npm run build` and confirm only expected `dist` output is generated.
5. **Regression:** From repository root, run `npm test`; confirm Vitest executes actual health-contract tests.
6. **Boundary check:** Run `Get-ChildItem -Recurse -Filter package-lock.json` and confirm only the root lockfile is returned.

---

## Done Criteria

- [ ] The root is a private npm-workspaces project with one lockfile and documented Node/npm engine policy.
- [ ] `apps/*` and `packages/*` are the only workspace globs, and shared code has no dependency on an application.
- [ ] Strict TypeScript and flat ESLint baselines exist without mixing browser and server globals.
- [ ] `@elevator/shared` exports the Zod health schema and inferred `HealthResponse` type through its public entry point.
- [ ] Shared contract tests reject malformed payloads and the root lint, type-check, build, and test commands pass.
- [ ] Real environment files, dependencies, outputs, coverage, and machine-specific artifacts are ignored without changing Squad-Kit's managed ignore block.
- [ ] No API server, frontend screen, domain model, authentication, or business behavior has been implemented.

**STOP HERE. Report to the user and wait for confirmation before proceeding to Story 02.**
