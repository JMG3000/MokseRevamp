# MokseRevamp Integration Status - 2026-06-05

## Purpose

Track which services are connected to the new MokseRevamp repository and which are still tied to the old working prototype or old developer environment.

## Current Status

| Service | Status | Required action |
| --- | --- | --- |
| GitHub | Connected | Private repo `JMG3000/MokseRevamp` exists, `main` is pushed, and PR #1/#2 exist. Verify repository variable `NEXT_PUBLIC_METICULOUS_PROJECT_ID` through GitHub Actions Variables once `gh` CLI or dashboard access is available. |
| Vercel | Connected, env pending | Created Vercel project `mokserevamp` under `jacob-garretts-projects`; local checkout linked to `prj_R8mtzD2Qjg2Kzfjh5ti07SWpq9sw`. Add runtime env vars after values are confirmed. |
| CodeRabbit | Connected via CLI | WSL CodeRabbit CLI is authenticated and has reviewed the PR branch. Vercel Marketplace subscription onboarding remains stuck outside the repo workflow. |
| GitHub security | Pending | Enable CodeQL, Dependabot, dependency review, and secret scanning where available. |
| Sentry | Pending | Create a new Sentry project/environment and add DSN through Vercel. |
| Linear | Connected | Issue `JAK-5` tracks MokseRevamp workflow integration and audit documentation. Continue logging PR links, command results, blockers, and next actions there. |
| Slack | Pending | Connect notifications and audit workflow channels after repo creation. |
| Airtable | Pending | Reauthenticate and scope records/workflows to the new project. |
| Google Drive | Pending | Connect approved docs and report storage after repo creation. |
| Gmail | Pending | Connect only if audit/report delivery workflows require it. |
| Notion | Pending | Grant least-privilege access only to the production resource database needed by the site. |

## Standing Rule

Do not grant broad all-repository access when a service supports single-repository access. Prefer least privilege for `MokseRevamp` only.

## GitHub Repository

- Repository: `https://github.com/JMG3000/MokseRevamp`
- Main hardening PR: `https://github.com/JMG3000/MokseRevamp/pull/1`
- CodeRabbit onboarding test PR: `https://github.com/JMG3000/MokseRevamp/pull/2`

## Vercel Project

- Team: `jacob-garretts-projects`
- Project name: `mokserevamp`
- Project ID: `prj_R8mtzD2Qjg2Kzfjh5ti07SWpq9sw`
- Local link file: `.vercel/project.json` exists and is ignored by Git.
- Current env status: `vercel env ls` reported no environment variables on 2026-06-05.

Required Vercel env vars still to add after values are confirmed:

- `NOTION_TOKEN`
- `NOTION_DATABASE_KEY`
- `NOTION_BASE_URL`
- `NEXT_PUBLIC_METICULOUS_PROJECT_ID`
- Sentry DSN/env vars after the new Sentry project exists.

