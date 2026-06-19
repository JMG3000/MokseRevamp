# MokseRevamp Project Monitor Report

- Automation: `MokseRevamp Project Monitor`
- Run timestamp: `2026-06-10T05:17:08-05:00` (Central Time)
- Repository: `D:\repos\codex-projects\MokseRevamp`
- Primary branch inspected: `dev-test`
- Comparison branch inspected: `main` and `origin/main`

## Executive Summary

`dev-test` is currently ahead of local `main` by 17 commits and matches `origin/dev-test`. Local validation is mostly healthy: `npm run typecheck` passed, `npm run build` passed, and `npm run lint` completed with 42 warnings and 0 errors. Security posture is mixed: `npm audit --audit-level=high` did not fail, but it reported 2 moderate vulnerabilities through `next -> postcss`. Workflow health is improving on `dev-test`: the branch already contains CI/security/meticulous pipeline work, and the current uncommitted changes replace the older `promote-dev-test` flow with a broader `dev-test-gate` workflow while adding `@vercel/speed-insights` and more explicit Meticulous recorder wiring.

Main delivery risks are process and branch drift rather than immediate build breakage. `origin/main` has two branch-specific workflow commits (`Create main.yml`, `Create dependabot.yml`) that are not in `dev-test`, while `dev-test` carries the broader delivery automation stack. Live GitHub PR status, review comments, and Vercel/CircleCI run results could not be verified from the local repository alone.

## Branch/Compare Status

- `git status --short --branch`: `## dev-test...origin/dev-test`
- Current checked-out branch: `dev-test`
- Working tree is dirty with 13 modified/deleted files plus 1 untracked workflow file.
- `git rev-list --left-right --count main...dev-test`: `0 17`
- Interpretation: local `main` is 0 commits ahead and 17 commits behind `dev-test`.
- `origin/main` is visible locally at commit `70bc2c2` (`2026-06-06T01:41:56-05:00`).
- Local `main` remains at `68e3ba2` and is shown as `[behind 15]`, so local `main` is stale relative to `origin/main`.
- `dev-test` / `origin/dev-test` head: `a3d7d42` (`Enable browser source maps for Meticulous coverage`, `2026-06-06T02:06:44-05:00`).

## Git/PR Activity

### Recent `dev-test` commits

- `a3d7d42` `2026-06-06T02:06:44-05:00` `Enable browser source maps for Meticulous coverage`
- `61fd5a2` `2026-06-06T01:36:01-05:00` `Add Meticulous project attribute to recorder`
- `1a83e37` `2026-06-06T01:31:35-05:00` `Pass Meticulous project through workflow config`
- `f0b2ec5` `2026-06-06T01:22:51-05:00` `Restore Meticulous recorder env wiring`
- `a12bc0e` `2026-06-06T00:21:49-05:00` `Add CircleCI deploy marker workflow`
- `986fc6c` `2026-06-05T23:54:26-05:00` `Fix security workflow gating`

### Recent `origin/main` commits not reflected in local `main`

- `70bc2c2` `2026-06-06T01:41:56-05:00` `Create main.yml`
- `1b044ee` `2026-06-06T00:22:43-05:00` `Create dependabot.yml`
- `5a1fed1` `2026-06-06T00:19:18-05:00` `Delete .github/dependabot.yml`

### PR activity visibility

- No local PR metadata is stored in the repo.
- No GitHub API or web inspection was available in this run, so open PRs, review states, approvals, merge queues, and checks on hosted branches could not be confirmed.

## File Changes

### `main...dev-test` committed diff summary

Command: `git diff --stat main...dev-test`

- 34 files changed
- 1709 insertions
- 885 deletions

Highest-signal committed changes on `dev-test` versus `main`:

- Added CI/CD and security assets: `.circleci/config.yml`, `.github/workflows/meticulous.yml`, `.github/workflows/promote-dev-test.yml`, `.github/workflows/security.yml`
- Expanded docs and runbooks: `docs/tooling/workflow-command-runbook.md`, `docs/tooling/meticulous-nextjs-app-router.md`
- Added Meticulous integration code: [`D:\repos\codex-projects\MokseRevamp\lib\meticulous.ts`](D:/repos/codex-projects/MokseRevamp/lib/meticulous.ts), [`D:\repos\codex-projects\MokseRevamp\components\tooling\meticulous-recorder.tsx`](D:/repos/codex-projects/MokseRevamp/components/tooling/meticulous-recorder.tsx)
- Significant page/content reshaping in the programs area, especially Stop The Stigma content extraction
- `package.json` and `package-lock.json` changed on branch

### Current uncommitted working tree changes

Command: `git diff --stat`

- 13 tracked files changed
- 72 insertions
- 104 deletions
- One deleted workflow and one untracked workflow replacement

Current working tree file status:

- Modified: `.circleci/config.yml`
- Modified: `.github/workflows/meticulous.yml`
- Deleted: `.github/workflows/promote-dev-test.yml`
- Untracked: `.github/workflows/dev-test-gate.yml`
- Modified: `.gitignore`
- Modified: `README.md`
- Modified: `app/(Admin Dashboard)/layout.tsx`
- Modified: `app/(Public Pages)/layout.tsx`
- Modified: `components/tooling/meticulous-recorder.tsx`
- Modified: `docs/audits/2026-06-05/integration-status-2026-06-05.md`
- Modified: `docs/tooling/meticulous-nextjs-app-router.md`
- Modified: `docs/tooling/workflow-command-runbook.md`
- Modified: `package.json`
- Modified: `package-lock.json`

### Concrete working tree changes

- CircleCI build now exports `NEXT_PUBLIC_ENABLE_METICULOUS_RECORDER="1"`.
- Meticulous workflow build/start steps also export `NEXT_PUBLIC_ENABLE_METICULOUS_RECORDER="1"`.
- Legacy `promote-dev-test.yml` has been removed from the working tree.
- New untracked `dev-test-gate.yml` adds:
  - validation job for lint, typecheck, build, audit, secret scan, artifact upload
  - CodeQL job
  - Meticulous job
  - gated push from `dev-test` to `main` after all checks pass
- `README.md` now documents Vercel Speed Insights and the newer `Dev Test Gate` workflow.
- `package.json` adds `@vercel/speed-insights`.

## Comments/Review Notes

- No local review comments, PR discussions, or CodeRabbit review output were present in the repository snapshot.
- The branch does include onboarding/testing documentation for CodeRabbit at [`D:\repos\codex-projects\MokseRevamp\docs\tooling\coderabbit-onboarding-test-2026-06-05.md`](D:/repos/codex-projects/MokseRevamp/docs/tooling/coderabbit-onboarding-test-2026-06-05.md), but that is documentation, not active review state.
- Limitation: hosted review notes cannot be inspected from local git data alone.

## Build Status

Command: `npm run build`

- Status: Passed
- Run during this monitor: `2026-06-10` Central morning run
- Effective framework version during build output: `Next.js 16.2.7`
- Build notes:
  - Production build compiled successfully
  - TypeScript phase completed successfully
  - 18 app routes generated
  - Static and dynamic routes resolved without build failure

## Test Status

Available local validation surface in `package.json`:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

Results from this run:

- `npm run lint`: Passed with warnings, 0 errors, 42 warnings
- `npm run typecheck`: Passed
- `npm run build`: Passed
- No `npm test`, Jest, Vitest, Playwright, or Cypress script is defined in `package.json`.
- Browser regression coverage is workflow-driven through Meticulous rather than a local script.

Lint warning themes:

- Unused variables/imports across admin/public components
- Missing `alt` props on image elements in:
  - `app/(Public Pages)/(Programs)/programs/page.tsx`
  - `app/(Public Pages)/(Programs)/programs/stop-the-stigma/stop-the-stigma-content.tsx`

## Time Since Last Testing

- Time since last local validation at report generation: effectively `0 minutes` because lint, typecheck, build, and audit were executed during this run.
- Most recent committed test/CI-related branch activity is from `2026-06-06T02:06:44-05:00` on `dev-test`.
- Approximate gap from latest `dev-test` commit to this report run: about `4 days 3 hours`.
- No persisted local artifact from the last hosted GitHub Actions or CircleCI execution was available, so “time since last hosted CI test” could not be measured precisely.

## Dependency Updates

Working tree dependency changes:

- Added dependency: `@vercel/speed-insights` `^2.0.0`
- Lockfile updated accordingly

Visible remote Dependabot branches:

- `origin/dependabot/github_actions/dev-test/actions/dependency-review-action-5`
- `origin/dependabot/github_actions/main/actions/checkout-6`
- `origin/dependabot/github_actions/main/actions/setup-node-6`
- `origin/dependabot/npm_and_yarn/main/chakra-ui/cli-3.35.0`
- `origin/dependabot/npm_and_yarn/main/eslint-config-next-16.2.7`
- `origin/dependabot/npm_and_yarn/main/multi-b0dfc253ff`
- `origin/dependabot/npm_and_yarn/main/notionhq/client-5.22.0`
- `origin/dependabot/npm_and_yarn/main/react-dom-19.2.7`

Notable version signal:

- Installed build output reports `Next.js 16.2.7`, while `package.json` still declares `next: ^16.2.6`.
- This is consistent with semver resolution through the lockfile rather than a direct manifest bump.

## Security/Audit Signals

Command: `npm audit --audit-level=high`

- Exit status: passed threshold for `high`
- Findings: `2 moderate severity vulnerabilities`
- Reported package path: `next -> postcss`
- Advisory: `PostCSS has XSS via Unescaped </style> in its CSS Stringify Output`
- Suggested automated remediation from npm would require a breaking downgrade path (`npm audit fix --force` proposed `next@9.3.3`), so the raw recommendation should not be applied blindly.

Workflow/security posture on `dev-test`:

- Branch diff already contains `security.yml`, `codeql.yml` changes, and dependency review wiring.
- New untracked `dev-test-gate.yml` adds:
  - secret pattern scanning
  - CodeQL analysis
  - gated promotion to `main`

Security limitation:

- No live GitHub code scanning alerts or secret scanning alerts were available locally.

## CI Workflow Status

### GitHub Actions

Committed workflow signals on `dev-test`:

- `meticulous.yml` exists on branch and runs on `main`, `dev-test`, and pull requests.
- `security.yml`, `codeql.yml`, and `nextjs.yml` have branch-side changes versus `main`.
- `promote-dev-test.yml` exists in committed `dev-test`, but is deleted in the current working tree.

Working tree workflow direction:

- A broader `dev-test-gate.yml` has been prepared but not committed.
- That new gate centralizes validation, CodeQL, Meticulous, and promotion behavior.

### CircleCI

- `.circleci/config.yml` exists on `dev-test`.
- `verify` workflow runs on both `dev-test` and `main`.
- `deploy-production-marker` runs only on `main` after verify passes.
- CircleCI is being used as a deployment marker/handoff system rather than the actual deploy executor.

Hosted CI execution status:

- Not available from local repository data.
- No local logs or artifacts for the latest hosted run were present.

## Deploy/Preview Status

Configured delivery model from repository docs and workflow files:

- Development validation branch: `dev-test`
- Production branch: `main`
- Vercel production is expected to track `main`
- GitHub Actions or gate workflow is intended to push verified `dev-test` commits into `main`
- CircleCI records a production deployment marker on `main`

Current deploy/preview confidence:

- Buildable locally: yes
- Promotion automation present in branch/worktree: yes
- Live Vercel preview URL status: not verifiable locally
- Live production deployment status: not verifiable locally
- Live CircleCI job status: not verifiable locally

## TODO/FIXME/Follow-up Items

Repository search command: `rg -n --glob '!node_modules' --glob '!package-lock.json' "TODO|FIXME|HACK|XXX|BUG" .`

Findings:

- [`D:\repos\codex-projects\MokseRevamp\app\(API Routes)\api\contact\route.ts`](D:/repos/codex-projects/MokseRevamp/app/(API Routes)/api/contact/route.ts): line 37
  - `TODO: Future integration - send email via email service (SendGrid, AWS SES, etc.)`

Operational follow-up items implied by current warnings and workflow changes:

- Resolve 42 lint warnings, especially accessibility `alt` warnings
- Decide whether `promote-dev-test.yml` is fully superseded by `dev-test-gate.yml`
- Commit or discard the current workflow/package/docs changes to reduce branch ambiguity
- Confirm Vercel env vars for `NEXT_PUBLIC_METICULOUS_PROJECT_ID` and optional recorder flag usage

## DevOps Learning Metrics

- Branch divergence: `dev-test` ahead of local `main` by 17 commits
- Local `main` stale against `origin/main`: 15 commits behind
- Branch/workflow churn: 34 committed changed files between `main` and `dev-test`
- Current uncommitted churn: 14 file state changes including 1 untracked workflow
- Validation commands executed this run: 4
- Validation pass rate this run:
  - Hard pass: `typecheck`, `build`, `audit(high-threshold)`
  - Soft pass with warnings: `lint`
- Lint warning count: 42
- Build failure count this run: 0
- Typecheck failure count this run: 0
- Audit findings at `high` threshold: 0 blocking, 2 moderate non-blocking
- TODO/FIXME count from source scan: 1
- Hosted delivery observability coverage visible in repo:
  - GitHub Actions workflows: yes
  - CircleCI config: yes
  - Vercel runtime observability docs: yes
  - Live hosted run evidence in local repo: no

## Risks

- `main` branch state is ambiguous locally because local `main` is stale while `origin/main` has branch-specific workflow commits.
- Current working tree is dirty on `dev-test`, including a workflow replacement (`promote-dev-test.yml` deleted, `dev-test-gate.yml` untracked), which increases the chance of reporting drift versus committed branch state.
- Delivery automation is in transition; the repo contains both the old promotion workflow in committed history and the new gate workflow only in the working tree.
- Lint debt remains non-blocking today but includes accessibility issues that can become release-quality problems.
- Security audit still reports moderate vulnerabilities in a core build dependency path.
- No local evidence of latest hosted CI, PR reviews, or deployment outcomes means actual delivery health can only be inferred, not confirmed end-to-end.

## Recommended Next Actions

1. Commit or intentionally revert the current workflow transition so the repo stops carrying both the old promotion design and the new gate design simultaneously.
2. Sync local `main` with `origin/main` before any manual compare work so branch health reporting is based on current references.
3. Decide whether lint warnings should stay advisory or be tightened into a release gate, then clear the two missing-`alt` warnings first.
4. Inspect hosted GitHub Actions, CircleCI, and Vercel dashboards to verify that the branch automation described in the repo is actually running successfully.
5. Review the `next -> postcss` moderate audit issue and determine whether the practical remediation is to wait for an upstream Next.js patch rather than force an unsafe audit fix.
6. If `dev-test-gate.yml` is the intended path, remove or archive references to `promote-dev-test.yml` after the new workflow is committed and validated.

## Limitations

- This report is based on local repository state and local command execution only.
- No live GitHub, CircleCI, or Vercel API/dashboard access was available.
- PR review activity, hosted check results, preview URLs, production deployment timestamps, and code scanning alert status could not be directly verified.
