# Vercel deployment guide

This repository is prepared for two Vercel projects connected to the same GitHub repository. The configuration does not deploy the applications or provision PostgreSQL automatically.

## Deployment model

| Vercel project | Root Directory | Runtime | Purpose |
| --- | --- | --- | --- |
| Web | `apps/web` | Vite static output | React SPA and demo routes |
| API | `apps/api` | Node.js 24 / Express Function | `GET /api/health` and future approved APIs |

Both projects use `packages/shared`. In each project's **Settings → Build and Deployment → Root Directory**, keep **Include source files outside of the Root Directory in the Build Step** enabled.

The tracked `vercel.json` files provide the build commands. Do not replace them with commands that run database migrations.

## 1. Create the API project

1. Import the GitHub repository into Vercel.
2. Set the project Root Directory to `apps/api`.
3. Select Node.js `24.x` in Build and Deployment settings.
4. Leave the Install Command and Output Directory at their defaults.
5. Confirm that the tracked Build Command is `npm run vercel-build`.
6. Configure the following environment variables for the intended Vercel environments:

| Variable | Example shape | Notes |
| --- | --- | --- |
| `NODE_ENV` | `production` | Use `production` for production deployments. |
| `WEB_ORIGIN` | `https://your-web-project.vercel.app` | Exact browser origin, without a trailing slash or path. |
| `DATABASE_URL` | `postgresql://…?sslmode=require` | Managed PostgreSQL connection string; never expose it to the web project. |

The Vercel entry point is `apps/api/index.ts`. It directly imports Express for Vercel framework detection, validates configuration, and default-exports the composed application without opening a listener or creating a database connection. Local development continues to use `apps/api/src/start-server.ts`; internal modules deliberately avoid competing Vercel-recognized entry-point names.

After deployment, verify:

```text
GET https://your-api-project.vercel.app/api/health
```

The response is process liveness only and must not claim database readiness.

## 2. Create the web project

1. Import the same GitHub repository as a second Vercel project.
2. Set the Root Directory to `apps/web`.
3. Select the Vite framework preset and Node.js `24.x`.
4. Leave the Install Command at its default.
5. Confirm that the tracked Build Command is `npm run vercel-build` and Output Directory is `dist`.
6. Configure this build-time public variable:

| Variable | Example | Notes |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `https://your-api-project.vercel.app` | Public API origin; never put credentials in a `VITE_` value. |

The web `vercel.json` rewrites unknown paths to `index.html`, allowing direct navigation to routes such as `/demo/requests` while static assets continue to be served by Vercel.

## 3. Align production origins

After both production domains are known:

1. Set the API project's `WEB_ORIGIN` to the exact production web origin.
2. Set the web project's `VITE_API_BASE_URL` to the exact production API origin.
3. Redeploy both projects because environment changes do not modify existing deployments.
4. Verify the web root, every demo route, the public preview, and the browser health indicator.

Do not use wildcard CORS. The current API intentionally allows one exact web origin and enables credentialed requests. For preview deployments, configure a stable authorized preview/branch origin or approve a future multi-origin design; arbitrary generated preview origins are not implicitly trusted.

## PostgreSQL

Docker Compose is for local development and is not deployed to Vercel. Provision managed PostgreSQL separately, preferably near the selected Function region, with encrypted transport, backups, least-privilege credentials, and a pooled/serverless-compatible connection endpoint.

The current deployed health route does not query PostgreSQL. Before database-backed Functions are introduced, review the `pg` pool lifecycle for Vercel Fluid Compute and integrate supported serverless pool lifecycle handling. Migrations remain an explicit controlled release action and must never run from `vercel-build` or API startup.

## Verification before promotion

Run locally from the repository root:

```powershell
npm ci
npm run lint
npm run typecheck
npm run build
npm test
npm run vercel-build --workspace @elevator/api
npm run vercel-build --workspace @elevator/web
```

Then use a Vercel preview deployment to verify configuration and inspect Function logs before promoting to production. A successful deployment does not make the product production-ready: authentication, authorization, tenant isolation, auditing, monitoring, and the remaining production checklist still apply.
