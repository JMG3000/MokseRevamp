# MokseRevamp Integration Status - 2026-06-05

## Purpose

Track which services are connected to the new MokseRevamp repository and which are still tied to the old working prototype or old developer environment.

## Current Status

| Service | Status | Required action |
| --- | --- | --- |
| GitHub | Connected, variable fix needed | Private repo `JMG3000/MokseRevamp` exists, `main` is pushed, and PR #1/#2 exist. GitHub Actions run #27046225955 shows `NEXT_PUBLIC_METICULOUS_PROJECT_ID` is currently set to a pasted YAML workflow snippet instead of the Meticulous project ID. |
| Vercel | Connected, env pending | Created Vercel project `mokserevamp` under `jacob-garretts-projects`; local checkout linked to `prj_R8mtzD2Qjg2Kzfjh5ti07SWpq9sw`. Add runtime env vars after values are confirmed. |
| Vercel Web Analytics | Code integrated | Added `@vercel/analytics` and mounted `<Analytics />` in both App Router route-group layouts. Confirm Web Analytics is enabled for the Vercel project dashboard before production launch. |
| CodeRabbit | Connected via CLI | WSL CodeRabbit CLI is authenticated and has reviewed the PR branch. Vercel Marketplace subscription onboarding remains stuck outside the repo workflow. |
| CircleCI | Repo config added | Added `.circleci/config.yml` with install, typecheck, lint, build, companion-assets copy, and artifact storage. Connect the CircleCI project to `JMG3000/MokseRevamp` in the CircleCI dashboard to run it. |
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

## Meticulous CI Finding

GitHub Actions run `27046225955` on PR #1 completed the build, companion-assets copy, and app startup steps successfully. The Meticulous action failed with:

```text
Could not retrieve project data. Is the API token correct?
```

Observed blockers:

- `NEXT_PUBLIC_METICULOUS_PROJECT_ID` is populated but malformed; the workflow log shows it contains a pasted YAML snippet, not a Meticulous project ID.
- `METICULOUS_API_TOKEN` is being accepted as a token value, but latest run `27048742822` reports it behaves like an OAuth user token and requires a project ID. The cloud-compute action metadata does not expose a `project-id` input, so this should be replaced with the project-specific API token from the Meticulous project settings.

Required dashboard fixes:

- Replace GitHub Actions variable `NEXT_PUBLIC_METICULOUS_PROJECT_ID` with the actual Meticulous project ID only.
- Confirm GitHub Actions secret `METICULOUS_API_TOKEN` is the Meticulous API token expected by `alwaysmeticulous/report-diffs-action/cloud-compute@v1`.
- Add `NEXT_PUBLIC_METICULOUS_PROJECT_ID` to Vercel after the value is confirmed.

## 2026-06-05 Workflow Update

- Vercel Web Analytics package is installed and `<Analytics />` is mounted in both route-group layouts.
- Meticulous companion-assets setup now verifies `companion-assets/_next/static` in GitHub Actions.
- Deterministic rendering is implemented for the Stop The Stigma countdown route through `lib/meticulous.ts` and a frozen countdown mode during Meticulous tests.
- CircleCI config is present and YAML syntax was validated with `npx --yes yaml-lint .circleci/config.yml`.
- `npm audit fix` reduced audit findings from 3 moderate to 2 moderate. The remaining advisory is `postcss <8.5.10` through Next; npm only offers `npm audit fix --force`, which would make a breaking downgrade and was not run.
- Latest GitHub Actions status for commit `b9ac936`: `Next.js CI` passed, `CodeQL Advanced` was still running, and `Meticulous Tests` failed only at the Meticulous action step with the token/project configuration issue above.

