# MokseRevamp Project Monitor Report

Run timestamp: 2026-06-16 05:33 CDT
Repo path: `D:\repos\codex-projects\MokseRevamp`
Branch inspected first: `dev-test`
Checked commit: `f258e7e fix: restore public footer`

## Executive Summary

- Local `dev-test` is currently clean against `origin/dev-test` and passes `lint`, `typecheck`, `build`, and `npm audit --audit-level=high`.
- Production comparison remains materially divergent: `origin/main...dev-test` is `9 24`, while local `main` is stale at `0 36`.
- The worktree has no tracked edits, but one untracked file remains: `mokse_revamped_codex_6_13_history.md`.
- Deploy/preview visibility is limited in this run because Vercel CLI could not be fetched in the restricted shell cache mode, and GitHub CLI auth is invalid.
- Observability is still incomplete relative to the project plan: Vercel Analytics and Speed Insights are present, Sentry is still absent from the checkout.

## Command Evidence

```text
git status --short --branch
## dev-test...origin/dev-test
?? mokse_revamped_codex_6_13_history.md

git rev-list --left-right --count origin/dev-test...HEAD
0 0

git rev-list --left-right --count origin/main...dev-test
9 24

git rev-list --left-right --count main...dev-test
0 36

npm run lint
pass

npm run typecheck
pass

npm run build
pass

npm audit --audit-level=high
found 0 vulnerabilities
```

## Branch/Worktree Drift

- `dev-test` and `origin/dev-test` are aligned at `f258e7e`.
- `origin/main` is the valid production baseline and remains behind/ahead split at `9 24`.
- Local `main` remains stale and should not be used for production-readiness decisions.
- `git diff --name-status` and `git diff --cached --shortstat` are empty.
- One untracked file remains outside the monitor folder: `mokse_revamped_codex_6_13_history.md`.

## Git/PR Activity

Recent `dev-test` commits:

```text
f258e7e 2026-06-16T05:20:12-05:00 fix: restore public footer
358d51c 2026-06-15T23:01:51-05:00 chore: clean lint warnings and audit deps
48225b8 2026-06-15T22:16:47-05:00 chore: redeploy dev-test after notion env fix
1377e5b 2026-06-15T21:22:43-05:00 chore: redeploy dev-test with updated notion env
8444911 2026-06-15T06:24:57-05:00 docs: consolidate monitor reports
```

- GitHub CLI auth is present but invalid for account `JMG3000`; live PR state was not inspectable from this terminal.
- No local branch divergence exists against `origin/dev-test`; current activity is fully reflected in the remote tracking ref.

## File Changes

- `git diff --shortstat origin/main...dev-test`: `108 files changed, 9687 insertions(+), 8114 deletions(-)`.
- High-signal committed differences versus `origin/main`:
  - CI consolidation: `.github/workflows/dev-test-gate.yml` added; `codeql.yml`, `meticulous.yml`, `nextjs.yml`, `promote-dev-test.yml`, and `security.yml` deleted from the production baseline.
  - Admin/session hardening: `app/(Admin Dashboard)/admin/actions.ts`, `lib/admin-dal.ts`, `lib/admin-session.ts`.
  - Runtime/API changes: `app/(API Routes)/api/notion/database/route.ts`, `app/(API Routes)/api/contact/route.ts`, resource routes and public layouts.
  - Documentation growth: audit docs, monitor docs, workflow/tooling docs.
- No tracked local file changes are pending.

## Tooling Status

| Service | Status | Evidence |
| --- | --- | --- |
| Git | Green | `dev-test` == `origin/dev-test` at `f258e7e` |
| GitHub CLI | Blocked | `gh auth status` reports invalid keyring token for `JMG3000` |
| GitHub Actions | Manual-only locally | `.github/workflows/dev-test-gate.yml` has `workflow_dispatch` only |
| CircleCI | Config present, CLI unavailable | `.circleci/config.yml` exists; `circleci` command not found |
| Vercel | Project metadata present, live status unverified | `.vercel/project.json` present; `npx vercel@latest ls ...` failed in cache-only mode |
| Meticulous | Wired in workflow | `dev-test-gate.yml` includes `meticulous` job and companion assets step |
| Observability | Partial | `@vercel/analytics` and `@vercel/speed-insights` present; no Sentry package/config found |
| Notion | Active dependency | `@notionhq/client` in `package.json`; `/api/notion/database` route present |

## Build Status

- `npm run build`: pass on `Next.js 16.2.7 (Turbopack)`.
- Build generated 18 app routes successfully, including dynamic routes for `/admin`, `/api/notion/database`, and `/resources/api`.

## Test Status

- No dedicated `test` script exists in `package.json`.
- Practical validation surface for this repo remains:
  - `npm run lint`: pass
  - `npm run typecheck`: pass
  - `npm run build`: pass
- Meticulous coverage exists in workflow wiring only; no local visual run was performed in this monitor.

## Time Since Last Testing

- Current local validation run completed during this monitor at `2026-06-16 05:33 CDT`.
- Previous consolidated monitor snapshot was `2026-06-15 05:00 CDT`, about `1d 0h 33m` earlier.

## Dependency Updates

`npm outdated --json` returned newer available versions for:

- `next`: `16.2.7` -> `16.2.9`
- `react`: `19.2.4` -> `19.2.7`
- `react-dom`: `19.2.4` -> `19.2.7`
- `eslint-config-next`: `16.2.1` -> `16.2.9`
- `@chakra-ui/react`: `3.34.0` -> `3.36.0`
- `@notionhq/client`: `5.16.0` -> `5.22.0`
- `@tailwindcss/postcss`: `4.2.2` -> `4.3.1`
- `tailwindcss`: `4.2.2` -> `4.3.1`
- `@types/node`: `25.5.0` -> `25.9.3`
- `@types/react`: `19.2.14` -> `19.2.17`
- `eslint`: latest `10.5.0` with current/wanted `9.39.4`
- `typescript`: latest `6.0.3` with current/wanted `5.9.3`

## Security/Audit Signals

- `npm audit --audit-level=high`: pass, `0 vulnerabilities`.
- `package.json` still pins security overrides for `postcss`, `brace-expansion`, and `esbuild`.
- GitHub Actions gate still includes a static secret-pattern scan and CodeQL job, but remote execution state could not be verified here.
- No Sentry package or Sentry config was found in `package.json`, `app`, `components`, `lib`, `.github`, `.circleci`, or `next.config.ts`.

## CI Workflow Status

- Local GitHub workflow evidence:
  - `.github/workflows/dev-test-gate.yml` exists.
  - Trigger is `workflow_dispatch` only.
  - Jobs present: `validate`, `codeql`, `meticulous`, `promote-to-main`.
  - `validate` runs `lint`, `typecheck`, `build`, `npm audit --audit-level=high`, and a secret-pattern scan.
- CircleCI evidence:
  - `.circleci/config.yml` still targets `dev-test` and `main`.
  - `verify` runs `npm ci`, `typecheck`, `lint`, and `build`.
  - CLI verification was not available because `circleci` is not installed in this shell.

## Deploy/Preview Status

- `.vercel/project.json` identifies project `mokserevamp` with project ID `prj_R8mtzD2Qjg2Kzfjh5ti07SWpq9sw`.
- Live deployment listing was not available in this run:
  - `npx vercel@latest ls mokserevamp --scope jacob-garretts-projects`
  - failed with `ENOTCACHED` because the shell is operating in `only-if-cached` mode with no cached Vercel package available.
- No fresh preview/production readiness statement is made without that live signal.

## TODO/FIXME/Follow-up Items

```text
app/(API Routes)/api/contact/route.ts:37 TODO: Future integration - send email via email service (SendGrid, AWS SES, etc.)
```

## Blockers

- GitHub CLI cannot verify PR/workflow state until auth is refreshed.
- Vercel preview/deploy status is unverified in this shell because the CLI package could not be fetched.
- `origin/main` vs `dev-test` divergence remains large enough to require deliberate promotion review.

## Green Signals

- `dev-test` matches `origin/dev-test`.
- `npm run lint` passes.
- `npm run typecheck` passes.
- `npm run build` passes.
- `npm audit --audit-level=high` passes with `0 vulnerabilities`.
- No tracked worktree drift is present.

## Risks

- Production baseline divergence (`9 24`) can hide integration risk even while local validation is green.
- Manual-only GitHub workflow triggers reduce automatic regression detection.
- Observability remains partial because Sentry is still not present.
- One untracked repo file remains and could complicate future cleanliness checks if it is accidental.

## Limitations

- GitHub remote PR/workflow status was not checked live because `gh auth status` reports an invalid token.
- CircleCI config validity was inferred from the checked-in config only; CLI validation was unavailable because the `circleci` command is not installed.
- Vercel deploy/preview status was not checked live because `npx vercel@latest` could not be fetched in the restricted cache mode.
- This monitor reports local validation on commit `f258e7e`; it does not claim fresh remote CI or deploy success.

## Recommended Next Actions

1. Refresh GitHub CLI auth with `gh auth refresh -h github.com` before relying on PR or workflow status.
2. Re-run a live Vercel deployment check from an environment with cached or installed `vercel` CLI.
3. Review the `origin/main...dev-test` diff before any promotion because the branch gap is still large.
4. Decide whether `mokse_revamped_codex_6_13_history.md` should be committed, moved, or ignored.
5. Close the observability gap by deciding whether Sentry should be added or explicitly deferred.
