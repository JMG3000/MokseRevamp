# MokseRevamp
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/JMG3000/MokseRevamp/tree/main.svg?style=svg&circle-token=CCIPRJ_F46quKQM532yhNKf59ShjQ_3456209746311ffb53850dd7656d2b6df98b77b9)](https://dl.circleci.com/status-badge/redirect/gh/JMG3000/MokseRevamp/tree/main)


MokseRevamp is the clean production-prep repository for the Mokse website. It was imported from the working prototype with a fresh Git history so it is not linked to the old `MokseWebsite` repository history.

## Current Architecture

- **Framework:** Next.js 16 App Router
- **Router shape:** `app/` directory only; no `pages/`, `src/app/`, or `src/pages/`
- **UI:** React 19, Chakra UI 3, custom shared UI components
- **Primary backend dependency:** Notion API for live resource data
- **Deployment target:** Vercel
- **Workflow tooling:** GitHub Actions, CircleCI, CodeQL, Dependabot, dependency review, static secret scanning, CodeRabbit CLI, Meticulous, Linear (`JAK-5`)
- **Observability/testing in progress:** Vercel Web Analytics, Meticulous visual/session regression workflow; Sentry still pending

## Important Directories

```text
app/                         Next.js App Router routes and route groups
app/(API Routes)/api/        API route handlers
app/(Public Pages)/          Public site route group
app/(Admin Dashboard)/       Disabled admin route group pending production auth
components/                  Shared UI and feature components
components/tooling/          Tooling scripts/components such as Meticulous recorder
data/                        Static content/data modules
public/                      Static assets
docs/audits/                 Dated audit outputs
docs/tooling/                Tooling setup and workflow runbooks
.github/workflows/           CI, CodeQL, and Meticulous workflows
.circleci/config.yml         CircleCI verification workflow
```

## Notion Dependency

The live resources experience depends on Notion. Production deployments must define these server-only environment variables in Vercel:

```text
NOTION_TOKEN
NOTION_DATABASE_KEY
NOTION_BASE_URL
```

Do not commit Notion tokens or pulled env files. Local secret files such as `.env*`, `env.download`, `SECRET_README.md`, and `README.secret.md` are ignored.

## Meticulous

This repo uses the Meticulous Next.js App Router setup. Because the app currently has route-group layouts instead of a single root `app/layout.tsx`, the recorder is installed in both root layouts:

```text
app/(Public Pages)/layout.tsx
app/(Admin Dashboard)/layout.tsx
```

Required GitHub configuration:

```text
Secret: METICULOUS_API_TOKEN
```

The session recorder script uses the configured Meticulous recording token and renders only for local development and Vercel preview deployments. It does not render in Vercel production.

The Stop The Stigma countdown has deterministic rendering support for Meticulous runs. The GitHub Actions workflow also copies `.next/static` into `companion-assets/_next/static` for Meticulous cloud-compute.

## Observability

Vercel Web Analytics is installed with `@vercel/analytics` and mounted in both App Router route-group layouts. Enable Web Analytics for the `mokserevamp` Vercel project before launch.

## CircleCI

CircleCI repo configuration lives at `.circleci/config.yml`. It runs install, typecheck, lint, build, and companion-assets preparation on `dev-test` and `main`. Connect the CircleCI dashboard to `JMG3000/MokseRevamp` to activate the workflow.

## Branch And Deployment Model

```text
dev-test  Development validation branch
main      Vercel production branch
```

Push development changes to `dev-test`. The `Promote dev-test to main` GitHub Actions workflow verifies typecheck, lint, build, high-severity npm audit, companion assets, and Meticulous before pushing the verified commit to `main`. Vercel production should stay connected to `main`.

## CodeRabbit

CodeRabbit CLI is installed inside WSL on this machine. From PowerShell, run it through WSL:

```powershell
wsl.exe bash -lc "cd /mnt/d/repos/codex-projects/MokseRevamp && cr auth status --agent"
wsl.exe bash -lc "cd /mnt/d/repos/codex-projects/MokseRevamp && cr review --agent --base main"
```

CodeRabbit reviews send repository diff/code content to CodeRabbit. Only run reviews when that data sharing is intended.

## Local Development

```powershell
npm ci
npm run dev
npm run typecheck
npm run lint
npm run build
npm audit --audit-level=moderate
```

Open the app at:

```text
http://localhost:3000
```

## Production Readiness Checklist

- Connect Vercel to `JMG3000/MokseRevamp`
- Configure Vercel Notion env vars
- Enable Vercel Web Analytics for `mokserevamp`
- Connect CircleCI to `JMG3000/MokseRevamp`
- Keep `METICULOUS_API_TOKEN` in GitHub Actions secrets only
- Enable GitHub code scanning / Advanced Security for CodeQL uploads and hard-gated dependency review
- Keep local secret notes in ignored files only
- Replace the disabled admin placeholder with production auth before launch
- Complete Sentry setup
- Resolve or intentionally defer remaining lint warnings
