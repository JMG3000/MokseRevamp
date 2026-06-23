# MokseRevamp Project Monitor Report

Run timestamp: 2026-06-19 03:18 CDT
Remote status refresh: 2026-06-23 15:50 CDT
Branch: `dev-test`
Commit: `63f0889 Configure Sentry observability`

## Status

- Overall: **Green for remote compilation; Amber for production promotion drift**
- Git: `dev-test` equals `origin/dev-test`; remote status verified on `63f08896ac6b2ef4e7ce6f71a64b9ec97ec062dc`.
- Production drift: `origin/main...dev-test` is `9 24`; review before promotion.
- Local documentation changes: monitor/history docs staged for administrative commit; source changes remain unstaged.
- App Router migration: complete structurally; no `pages/`, `src/pages/`, or `src/app/` directories.
- Source inventory: 154 tracked files, 19 page/route source files, 20 routes in the production build output.
- Sentry observability configuration passed the remote CircleCI Linux compilation lane and Vercel preview deployment pipeline.

## Validation

| Check | Result | Evidence |
| --- | --- | --- |
| `npm run lint` | Pass | No warnings or errors |
| `npm run typecheck` | Pass | No TypeScript errors |
| Local build fallback | Pass | `npm run build -- --webpack`; Next.js 16.2.7; 18 static pages generated |
| `npm audit --audit-level=high` | Pass | `0 vulnerabilities` |
| `git diff --cached --check` | Pass | No staged whitespace errors |
| CircleCI remote Linux build | Pass | Build `25`, workflow/job `verify / verify`, commit `63f0889` |
| Vercel remote Linux deployment | Pass | Preview deployment completed for commit `63f0889`; deployment URL returned HTTP 200 |

The first restricted build could not download Geist, Geist Mono, Open Sans, and Poppins from Google Fonts. The same build passed with network access, confirming an environment dependency rather than a source defect.

## Architecture and Integrations

- Next.js 16 App Router, React 19, Chakra UI 3.
- Notion API route and server dependency are present; production environment values were not inspected.
- Vercel Analytics and Speed Insights are mounted in both route-group layouts.
- Sentry observability configuration is present in the current `dev-test` changes and has passed remote CircleCI and Vercel Linux compilation.
- Meticulous recorder and deterministic CI variables remain wired.
- Admin session/auth hardening exists in `lib/admin-dal.ts` and `lib/admin-session.ts`.

## CI and Deployment

- GitHub Actions: `dev-test-gate.yml` remains manual-only (`workflow_dispatch`).
- Gate jobs: validation, CodeQL, Meticulous, promotion to `main`.
- CircleCI config verifies `dev-test` and `main`; remote build `25` passed for `63f0889`.
- Vercel project metadata exists for `mokserevamp`; preview deployment completed successfully for `63f0889`.
- GitHub CLI is installed, but the `JMG3000` keyring token is invalid; live PR/workflow status is blocked.

### Remote Pipeline Refresh - 2026-06-23

| Provider | Result | Evidence |
| --- | --- | --- |
| GitHub commit status | Success | Combined status for `63f08896ac6b2ef4e7ce6f71a64b9ec97ec062dc` reported success |
| CircleCI | Success | `ci/circleci: verify`, build `25`, workflow/job `verify / verify`; `npm ci`, `typecheck`, `lint`, `build`, and companion asset upload passed |
| Vercel | Success | Preview deployment `5138233482`, environment `Preview`, description `Deployment has completed` |
| Vercel URL check | Success | `https://mokserevamp-qb0oo89ja-jacob-garretts-projects.vercel.app` returned HTTP `200` with `server: Vercel` and `x-vercel-cache: HIT` |

## Dependency Signals

- Installed top-level tree resolves successfully.
- `@emnapi/runtime@1.8.1` is reported as extraneous in `node_modules`.
- Dedicated test script is absent; validation relies on lint, typecheck, build, CI security checks, and Meticulous.

## Open Items

1. Review `origin/main...dev-test` before production promotion.
2. Refresh GitHub CLI authentication for live PR/workflow visibility.
3. Treat Sentry observability configuration as remotely compiled on Linux; continue runtime validation separately.
4. Resolve the extraneous `@emnapi/runtime` install with a clean `npm ci` or dependency investigation.
5. Decide whether the local history/monitor files should be committed.
6. Implement the contact email provider noted by the remaining source TODO.
