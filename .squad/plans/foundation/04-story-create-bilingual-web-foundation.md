# Story 04 — Create the bilingual web foundation

## Prerequisites

- [Story 01 completed: Establish the monorepo and shared contracts](01-story-establish-monorepo-and-shared-contracts.md).
- [Story 02 completed: Create the API and health endpoint](02-story-create-api-and-health-endpoint.md).
- Story 03 may be completed first according to global order, but the web application must remain independent of PostgreSQL details and credentials.

---

## Story Goal

Create the Vite React workspace with strict TypeScript, Tailwind CSS, minimal shadcn/ui prerequisites, typed browser configuration, and a small Arabic-first bilingual shell. Demonstrate persisted Arabic/English switching, correct root `lang`/`dir`, direction-safe layout, and a resilient status check against the shared API health contract.

Do not build marketing pages, navigation, CMS features, dashboards, authentication, portals, or final visual design.

---

## Context — Read These Files First

1. `.squad/stories/foundation/initialize-elevator-maintenance-platform/intake.md` — read lines 77–81 for the frontend boundary, lines 118–130 for browser configuration and RTL/localization requirements, and lines 164–180 for acceptance constraints.
2. [Story 01](01-story-establish-monorepo-and-shared-contracts.md) — read lines 27–59 for workspace/toolchain conventions and lines 61–89 for the public health contract.
3. [Story 02](02-story-create-api-and-health-endpoint.md) — read lines 79–108 for the health endpoint contract and lines 142–151 for expected network/error behavior.
4. `packages/shared/src/index.ts` — after Story 01, verify the public export for `healthResponseSchema`; never import its private source path.
5. `.env.example` — after Stories 02–03, preserve server-only variables and do not copy them into `apps/web` or any `VITE_*` variable.

---

## Frontend Tasks

### 1 — Initialize the Vite React workspace

**Create files:**

- `apps/web/package.json`
- `apps/web/index.html`
- `apps/web/tsconfig.json`
- `apps/web/tsconfig.app.json`
- `apps/web/tsconfig.node.json`
- `apps/web/vite.config.ts`
- `apps/web/src/vite-env.d.ts`
- `apps/web/src/main.tsx`
- `apps/web/src/App.tsx`

Use package name `@elevator/web`, React with the Vite React plugin, and strict TypeScript derived from `tsconfig.base.json`. Add real `dev`, `build`, `preview`, `lint`, `typecheck`, and `test` scripts.

- Add `@elevator/shared` with `npm install @elevator/shared --workspace @elevator/web` so npm records a standard compatible version range and symlinks the local workspace; import its health schema from the public package entry.
- Set the static `index.html` fallback to `<html lang="ar" dir="rtl">`; runtime locale synchronization will correct it before/while rendering.
- Do not expose server `DATABASE_URL`, PostgreSQL fields, or CORS settings through browser code.

### 2 — Add Tailwind and minimal shadcn/ui foundations

**Create files:**

- `apps/web/components.json`
- `apps/web/src/index.css`
- `apps/web/src/lib/utils.ts`
- `apps/web/src/components/ui/button.tsx`

- Configure Tailwind using its supported Vite integration and import it through `index.css`.
- Configure shadcn/ui aliases for components, utilities, hooks, and UI primitives; ensure they resolve through the web TypeScript and Vite configs only.
- Define centralized semantic CSS tokens for background, foreground, surface/card, border, primary, and focus ring. Provide light defaults and a structurally valid dark token block without building a theme switcher.
- Implement the standard `cn` composition helper and only the accessible button primitive required by the language switcher.
- Use CSS logical properties or direction-aware Tailwind utilities. Do not encode layout with physical left/right margins where inline-start/inline-end is intended.
- Use a system font stack that includes broadly available Arabic-capable fonts. Do not add a private font or runtime font-service dependency.

### 3 — Validate browser-public configuration

**Create files:**

- `apps/web/.env.example`
- `apps/web/src/config/env.ts`
- `apps/web/src/config/env.test.ts`

Document only:

```dotenv
VITE_API_BASE_URL=http://localhost:3000
```

Use Zod to export a pure `parseWebEnv(source)` function and inferred `WebConfig`. Accept an absolute HTTP(S) URL, normalize any trailing slash, and reject missing/invalid values with a message naming `VITE_API_BASE_URL` but not echoing its contents. Parse `import.meta.env` once in `main.tsx` and pass the resulting config down; other modules must not read `import.meta.env` directly.

### 4 — Implement typed Arabic/English locale state

**Create files:**

- `apps/web/src/i18n/types.ts`
- `apps/web/src/i18n/messages/en.ts`
- `apps/web/src/i18n/messages/ar.ts`
- `apps/web/src/i18n/storage.ts`
- `apps/web/src/i18n/LocaleProvider.tsx`
- `apps/web/src/i18n/useLocale.ts`

Define:

```ts
export const supportedLocales = ["ar", "en"] as const;
export type Locale = (typeof supportedLocales)[number];
export const defaultLocale: Locale = "ar";
export const localeDirection: Record<Locale, "rtl" | "ltr"> = {
  ar: "rtl",
  en: "ltr",
};
```

- Treat English message keys as the canonical typed shape and make the Arabic resource satisfy the same shape at compile time.
- Put every shell, status, and language-control string in these resources. No user-facing fallback text belongs directly in components.
- Use storage key `elevator.locale.v1`. Read it defensively; accept only `ar` or `en`, otherwise use Arabic. Handle blocked/unavailable `localStorage` without breaking render.
- On initial state and each change, set `document.documentElement.lang` and `.dir` from the locale map and persist the non-sensitive preference when storage is available.
- Expose locale, direction, a typed translation lookup, and `setLocale` through the provider/hook. Throw an actionable developer error if the hook is used outside its provider.

### 5 — Build the minimal verification shell

**Create files:**

- `apps/web/src/components/LanguageSwitcher.tsx`
- `apps/web/src/components/ApiStatus.tsx`

`LanguageSwitcher` uses the shadcn button primitive and exposes two clearly named choices. Mark the active locale with `aria-pressed` and ensure Arabic and English labels remain understandable in either current language.

`ApiStatus` must:

1. request `GET /api/v1/health` using the configured base URL;
2. handle loading, reachable, and unavailable states with localized strings;
3. reject non-2xx and malformed JSON/schema responses;
4. parse success through `healthResponseSchema` from `@elevator/shared`;
5. use `AbortController` so unmount does not update stale state;
6. display no raw error, URL, response body, timestamp, or infrastructure detail.

Compose only a restrained foundation card in `App.tsx`: localized project/foundation heading, direction indicator, language switcher, and API status. Its purpose is verification, not a product landing page.

### 6 — Configure tests and root quality scripts

**Create files:**

- `apps/web/src/test/setup.ts`
- `apps/web/src/App.test.tsx`
- `apps/web/src/i18n/LocaleProvider.test.tsx`

Configure Vitest with jsdom and Testing Library. Reset DOM language/direction, storage, and fetch mocks between tests.

**Update files:**

- `eslint.config.js` — add browser, React Hooks, and React Refresh rules scoped to `apps/web`.
- `package.json` — extend root development/build/lint/type-check/test orchestration explicitly to the web workspace. Build shared before both consumers. Install and use `concurrently` to start API and web cross-platform; do not background processes using shell-specific syntax.
- `package-lock.json` — update through npm after installing React, Vite, Tailwind, shadcn prerequisites, Testing Library, jsdom, and lint/plugin dependencies.

---

## Backend Tasks

No backend source changes required. Use the configured Story 02 origin/port values; do not weaken CORS to make local setup appear to work.

---

## Edge Cases & Failure Modes

- Missing or invalid `VITE_API_BASE_URL` fails web startup/build configuration with a named, redacted error in `apps/web/src/config/env.ts`.
- An unknown or corrupted stored locale falls back to Arabic; `apps/web/src/i18n/storage.ts` validates before use.
- Security/privacy settings can make `localStorage` throw; locale state still works for the current session and document attributes still update.
- Direct load begins with Arabic `lang`/`dir` in `index.html`; `LocaleProvider` synchronizes a valid stored English choice without leaving mismatched attributes.
- Switching rapidly always derives `lang`, `dir`, messages, and persistence from one locale state; no component owns an independent direction flag.
- Network failure, non-2xx response, invalid JSON, or schema mismatch produces the same localized unavailable state in `ApiStatus.tsx` and exposes no raw diagnostic to users.
- Component unmount aborts the health request and suppresses state updates; abort is not displayed as an error.
- Long Arabic/English strings and mixed-script labels wrap within the logical layout without physical-direction assumptions in `index.css` and shell components.

---

## Test Plan

1. **Unit:** `apps/web/src/config/env.test.ts` accepts valid HTTP(S) API origins, normalizes trailing slash, and rejects missing/invalid values without echoing them.
2. **Unit:** `apps/web/src/i18n/LocaleProvider.test.tsx` verifies Arabic default, stored English restoration, invalid-value fallback, blocked-storage tolerance, persistence, and synchronized root `lang`/`dir`.
3. **Component:** `apps/web/src/App.test.tsx` verifies all shell text comes from the active resource, language controls expose `aria-pressed`, and changing language updates text plus RTL/LTR layout state.
4. **Component:** Mock fetch for health loading, valid shared-contract success, HTTP failure, network rejection, invalid JSON, schema-invalid JSON, and unmount abort.
5. **Smoke:** Build and preview the production bundle; inspect Arabic and English at narrow and wide viewport widths and verify keyboard focus on language controls.

---

## Verification Steps

1. **Frontend tests:** From repository root, run `npm test --workspace @elevator/web` and confirm real Vitest cases execute.
2. **Frontend types:** Run `npm run typecheck --workspace @elevator/web`.
3. **Frontend builds:** Run `npm run build`; confirm shared builds before web/API consumers and Vite emits no server secret.
4. **Frontend runs:** With root and web example files copied to ignored `.env` files, run the root `npm run dev`; open `http://localhost:5173`.
5. **RTL/LTR smoke:** Select Arabic and English, reload after each, and inspect the root element's exact `lang`/`dir` pair plus focus/order behavior.
6. **API integration:** Run the API at `http://localhost:3000`; confirm the localized reachable state. Stop it and confirm the localized unavailable state without raw errors.
7. **Regression:** From repository root, run `npm run lint`, `npm run typecheck`, `npm run build`, and `npm test` across all workspaces.

---

## Done Criteria

- [ ] `@elevator/web` is a strict Vite React workspace and consumes the shared package through its public entry.
- [ ] Tailwind and minimal shadcn/ui prerequisites exist with centralized semantic tokens and one accessible button primitive.
- [ ] Browser configuration contains only validated `VITE_API_BASE_URL`; no server/database variable enters source or bundle.
- [ ] Arabic is the documented default and only valid `ar`/`en` preferences are restored.
- [ ] Locale changes persist when possible and always synchronize root `lang="ar" dir="rtl"` or `lang="en" dir="ltr"`.
- [ ] All visible shell/status/control strings live in type-aligned translation resources.
- [ ] The shell uses direction-safe styling and remains usable with keyboard, narrow widths, and both writing directions.
- [ ] API status validates success with the shared schema and handles every failure mode without exposing diagnostics.
- [ ] Web unit/component tests execute and root quality commands cover shared, API, and web workspaces.
- [ ] No marketing/CMS page, dashboard, portal, authentication, or business workflow has been introduced.

**STOP HERE. Report to the user and wait for confirmation before proceeding to Story 05.**
