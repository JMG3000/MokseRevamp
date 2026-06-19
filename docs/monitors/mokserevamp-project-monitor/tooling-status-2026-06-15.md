# MokseRevamp Tooling Status

Updated: 2026-06-15 05:00 CDT
Source monitor: `2026-06-15-0500-monitor-report.md`

## Summary

This file consolidates the current status of the production-readiness tooling stack. It should be updated by future monitor runs when tooling state changes.

| Tool | Status | Current Evidence | Next Action |
| --- | --- | --- | --- |
| Git | Local `dev-test` ahead of `origin/dev-test` by 3 | `git status --short --branch` | Decide whether to push `dev-test` after untracked report files are handled |
| GitHub CLI | Installed but unauthenticated | `gh auth status` says not logged in | Run `gh auth login` |
| GitHub Actions | Local gate is manual-only; user reports remote actions disabled | `.github/workflows/dev-test-gate.yml` only has `workflow_dispatch` | Re-enable when GitHub Actions minutes reset or manual validation is desired |
| CircleCI | Config valid | WSL `circleci config validate .circleci/config.yml` passed | Use as secondary validation lane |
| Vercel | CLI can list deployments; latest preview Error | `npx vercel@latest ls mokserevamp --scope jacob-garretts-projects` | Investigate latest failed preview deployment |
| Vercel Analytics | Dependency present | `@vercel/analytics` in `package.json` | Verify runtime component in layout during UI audit |
| Vercel Speed Insights | Dependency present | `@vercel/speed-insights` in `package.json` | Verify runtime component in layout during UI audit |
| Meticulous | CI wiring present | `dev-test-gate.yml` and CircleCI companion assets | Run visual diff once CI minutes/tooling lane is available |
| CodeRabbit | CLI installed and authenticated | `coderabbit auth status --agent` authenticated as `JMG3000` | Optional final review on complete `dev-test` diff before push |
| Notion | Critical env-backed dependency | API route requires `NOTION_TOKEN`, `NOTION_DATABASE_KEY`, `NOTION_BASE_URL` | Keep least-privilege Notion integration and verify Vercel envs before production |
| Sentry | Not active | no Sentry package in `package.json` | Reintroduce only with confirmed Next/Vercel-compatible setup |
| Dependabot | Active history visible in refs and merged commits | `a8b62d7`, `94b7574`; user reports Dependabot PRs reviewed/merged | Continue targeted update PRs; avoid `npm audit fix --force` |
| Security scan | Local regex/audit pass | secret regex no matches; audit 0 vulnerabilities | Keep exact scan in local/CI gates |

## Current Blockers

1. Latest Vercel preview deployment is Error.
2. GitHub CLI is unauthenticated.
3. `dev-test` is local-only for 3 commits.
4. `origin/main` and `dev-test` remain divergent.
5. No dedicated unit/e2e test script exists.

## Current Green Signals

1. `npm audit --audit-level=high` passes with 0 vulnerabilities.
2. `npm run lint` passes with 0 errors.
3. `npm run typecheck` passes.
4. `npm run build` passes.
5. CircleCI config validates.
6. CodeRabbit CLI auth is valid.
7. Vercel CLI can list project deployments.