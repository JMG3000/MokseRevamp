# MokseRevamp Codex History Export

**Export date:** 2026-06-13
**Project:** MokseRevamp
**Repo:** JMG3000/MokseRevamp
**Primary branch model:** `dev-test` for active engineering, `main` for Vercel production

## Executive Summary

This thread covered the creation and hardening of a clean `MokseRevamp` repository from the working Mokse prototype, with emphasis on production readiness, Notion API security, Vercel deployment, Meticulous visual testing, CodeRabbit review, CircleCI validation, and GitHub Actions cost control.

The most important operational decision was to keep development on `dev-test`, keep `main` as the production branch, and temporarily disable automatic GitHub Actions triggers because GitHub Actions minutes were unavailable until June 30, 2026. CircleCI and local validation became the active no-wait validation path.

## Repository Setup Decisions

- Created or used a new private GitHub repository named `MokseRevamp`.
- Kept the new repo separate from the old `MokseWebsite` repository.
- Preserved the old repo by avoiding inherited Git history and old remotes.
- Used `dev-test` as the active development branch.
- Preserved `main` as the Vercel production branch.
- Avoided committing secrets; secrets were intended to live in GitHub, Vercel, Meticulous, Sentry, or provider dashboards.

## Tooling And Integration Work

### CodeRabbit

- CodeRabbit onboarding through Vercel was blocked by a marketplace/onboarding loop.
- CodeRabbit CLI was used instead.
- Working review command was adjusted from the stale `--dir web` path to repo root:

```bash
~/.local/bin/coderabbit review --agent --type uncommitted --dir .
```

- CodeRabbit initially reported findings around duplicated Meticulous recorder code and plan validation gaps.
- Findings were addressed.
- Final CodeRabbit CLI review reported `0` findings.

### Meticulous

- Meticulous recorder wiring was added and preserved.
- The recorder was centralized through `components/tooling/meticulous-recorder.tsx`.
- Preview/development recording is gated by environment flags.
- Deterministic rendering support was included through environment variables such as:
  - `NEXT_PUBLIC_ENABLE_METICULOUS_RECORDER`
  - `NEXT_PUBLIC_METICULOUS_DETERMINISTIC`
  - `NEXT_PUBLIC_METICULOUS_PROJECT_ID`
  - `NEXT_PUBLIC_METICULOUS_SIMULATED_DATE`
- Companion assets were configured for `_next/static` usage.
- Raw recording/API tokens are intentionally not reproduced in this export.

### Vercel

- Vercel production remains tied to `main`.
- Vercel Analytics and Speed Insights were added to the app layout.
- Production browser source maps were enabled to support visual/debug tooling.
- Vercel env vars discussed included:
  - `NOTION_TOKEN`
  - `NOTION_DATABASE_KEY`
  - `NOTION_BASE_URL`
  - Meticulous public recorder flags

### CircleCI

- `.circleci/config.yml` was created/configured as a secondary validation lane.
- CircleCI config validates successfully using WSL CLI:

```bash
circleci config validate
```

- CircleCI config includes:
  - dependency install
  - typecheck
  - lint
  - build
  - companion assets preparation
  - production deployment marker job on `main`
- A later CircleCI GitHub App pipeline was configured in the UI with a `PR merged` trigger.
- Direct pushes to `dev-test` may not trigger that specific CircleCI pipeline unless a branch-push trigger is also configured.

### GitHub Actions

- Redundant workflow files were removed:
  - `.github/workflows/codeql.yml`
  - `.github/workflows/meticulous.yml`
  - `.github/workflows/nextjs.yml`
- Only `.github/workflows/dev-test-gate.yml` remains.
- Automatic `push:` triggers were removed to avoid consuming GitHub Actions minutes.
- The remaining gate is manual-only via `workflow_dispatch`.
- The manual gate still preserves future jobs for:
  - validation
  - CodeQL
  - Meticulous
  - promotion from `dev-test` to `main`

## Important Commits And Branch State

Key commit pushed to `dev-test`:

```text
24a7650 chore: disable automatic github actions gate
```

This commit:
- removed redundant GitHub Actions workflows,
- kept only the manual `dev-test-gate`,
- added/updated plan documentation,
- preserved the shared Meticulous recorder,
- avoided a manual push to `main`.

At the time of the last push:

```text
origin/dev-test = 24a7650
main was not manually pushed
```

## Validation Results

Local validation completed successfully:

```bash
npm run lint
npm run typecheck
npm run build
npm audit --audit-level=high
git diff --check
circleci config validate
```

Results:

- `npm run lint`: passed with warnings only.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- `npm audit --audit-level=high`: passed.
- Moderate Next/PostCSS advisory remained and was documented; no forced audit fix was applied.
- Secret-pattern scan passed after the plan command was adjusted to avoid self-triggering.
- `git diff --check`: passed.
- CircleCI config validation passed.
- CodeRabbit CLI review passed with `0` findings.
- `actionlint` was unavailable locally.

## Plans And Logs Created

Plan naming convention was established:

```text
<upgradePlanName>-<buildVersion>-<date>.md
```

Plan files created:

```text
docs/superpowers/plans/ci-skills-pruning-0.1.0-2026-06-10.md
docs/superpowers/plans/ci-skills-pruning-0.1.0-2026-06-10-added-files.md
```

The `.log` suffix was avoided for companion files because this repo ignores `*.log*`.

## Security Notes

- Notion integration is a critical production dependency.
- Notion secrets must not be hardcoded into client-side code.
- The revoked Context7 key was treated as invalid and should not be reused.
- Raw Meticulous and Sentry tokens/DSNs are not reproduced in this export.
- One later uncommitted local change appeared to hardcode a Sentry DSN in a layout file; that change was not pushed and was flagged as unsafe.

## Outstanding Risks / Follow-Ups

- Review and repair current uncommitted local changes before any future commit:
  - deleted Meticulous recorder file,
  - invalid Sentry code in `app/(Admin Dashboard)/layout.tsx`,
  - partial Sentry config in `next.config.ts`,
  - package changes adding `@sentry/nextjs`.
- Decide whether CircleCI should trigger on:
  - PR merged only,
  - branch push to `dev-test`,
  - or both.
- Re-enable GitHub Actions `push:` triggers only after GitHub Actions minutes reset or cost risk is explicitly accepted.
- Continue architectural audit after CI/CD workflow is stable.
- Resolve or document the remaining moderate npm audit advisory without using `npm audit fix --force`.

## Current Operating Rules

- `dev-test` is the active engineering branch.
- `main` is production on Vercel.
- Do not manually push `main` unless explicitly approved.
- Do not commit or push unvalidated local changes.
- Keep secrets in provider dashboards or ignored local files.
- Keep plan files and added-files companion logs under `docs/superpowers/plans/`.
