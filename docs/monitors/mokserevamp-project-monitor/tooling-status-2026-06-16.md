# MokseRevamp Tooling Status

Updated: 2026-06-16 05:33 CDT
Source monitor: `2026-06-16-0533-project-monitor-report.md`

## Tooling Summary

| Service | Status | Current Evidence | Blockers | Green Signals | Next Action |
| --- | --- | --- | --- | --- | --- |
| Git | Green | `dev-test` == `origin/dev-test` at `f258e7e`; no tracked worktree drift | `origin/main...dev-test` still `9 24` | Clean local validation target | Review production diff before promotion |
| GitHub CLI | Blocked | `gh auth status` shows invalid keyring token for `JMG3000` | Cannot inspect live PR/workflow state | CLI installed and account detected | Run `gh auth refresh -h github.com` |
| GitHub Actions | Manual-only | `.github/workflows/dev-test-gate.yml` uses `workflow_dispatch` | No automatic gate execution from local evidence | Gate still defines validate, CodeQL, Meticulous, and promote jobs | Decide when to re-enable automatic triggers |
| CircleCI | Partial | `.circleci/config.yml` still defines `verify` on `dev-test` and `main` | `circleci` command not installed here | Config remains present and readable | Validate config from an environment with CircleCI CLI |
| Vercel | Partial | `.vercel/project.json` identifies project `mokserevamp` | Live `vercel ls` unavailable because `npx vercel@latest` hit `ENOTCACHED` | Project metadata still intact | Re-run deploy listing where Vercel CLI is installed/cached |
| Meticulous | Ready in CI | `dev-test-gate.yml` includes `meticulous` job and companion assets flow | No live run evidence in this monitor | Deterministic build env variables are wired | Run visual diff when CI lane is available |
| Vercel Analytics | Green in codebase | `@vercel/analytics` in `package.json` | Runtime verification not performed here | Dependency present | Confirm layout/runtime usage during next UI pass |
| Vercel Speed Insights | Green in codebase | `@vercel/speed-insights` in `package.json` | Runtime verification not performed here | Dependency present | Confirm layout/runtime usage during next UI pass |
| Sentry | Missing | No Sentry hit in `package.json`, `app`, `components`, `lib`, `.github`, `.circleci`, `next.config.ts` | Observability plan item still incomplete | None | Decide add-vs-defer explicitly |
| Notion | Green in codebase | `@notionhq/client` present; `/api/notion/database` route present | Env correctness not revalidated live | Dependency and route are committed | Reconfirm Vercel envs before promotion |
| Dependency audit | Green | `npm audit --audit-level=high` => `0 vulnerabilities` | Several packages are behind latest | Security overrides already in place | Plan targeted version bump pass |

## Current Blockers

1. GitHub CLI auth is invalid.
2. Live Vercel preview/production status is unavailable from this shell.
3. `origin/main` and `dev-test` are still materially divergent.
4. Sentry observability remains unimplemented.

## Current Green Signals

1. `dev-test` matches `origin/dev-test`.
2. `npm run lint`, `npm run typecheck`, and `npm run build` all pass.
3. `npm audit --audit-level=high` reports `0 vulnerabilities`.
4. Meticulous and CI workflow wiring still exist in the repo.
5. No tracked local worktree edits are pending.

## Next Focus

1. Refresh GitHub auth and recover live GitHub status visibility.
2. Run a live Vercel deployment listing from a shell with cached or installed CLI support.
3. Review and reduce `origin/main...dev-test` drift before promotion.
4. Decide whether Sentry should be implemented now or removed from the active hardening plan.
