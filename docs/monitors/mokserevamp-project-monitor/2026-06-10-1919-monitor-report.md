# MokseRevamp Project Monitor Report

Generated: 2026-06-10 19:19 CDT (`2026-06-11T00:19:03Z`)

Repo root: `D:\repos\codex-projects\MokseRevamp`

## Executive Summary

`dev-test` is the active branch and remains ahead of local `main`, but the more relevant comparison against `origin/main` shows divergence in both directions: `dev-test` is 5 commits ahead and 3 commits behind `origin/main`.

The current local worktree contains uncommitted DevOps-focused changes on top of `dev-test`, including a new `Dev Test Gate` workflow, removal of `promote-dev-test.yml`, Meticulous recorder gating via `NEXT_PUBLIC_ENABLE_METICULOUS_RECORDER`, and Vercel Speed Insights integration.

Local verification results are mixed:

- `npm run build`: passed on 2026-06-10 around 19:17 CDT with Next.js `16.2.7`
- `npm run lint`: passed with 42 warnings and 0 errors
- `npm run typecheck`: failed on `.next/types/validator.ts` missing `./routes.js`
- `npm audit --audit-level=high`: exited non-zero due to 2 moderate `postcss` vulnerabilities under `next`

No new commits were recorded after the previous monitor run at `2026-06-10T10:15:28.598Z`; all visible changes since then are uncommitted local edits.

## Branch/Compare Status

Current branch status from `git status --short --branch`:

- `## dev-test...origin/dev-test`
- No ahead/behind indicator against `origin/dev-test`
- 12 tracked file modifications, 1 tracked file deletion, 2 untracked paths

Branch availability:

- Local `dev-test`: available
- Local `main`: available but stale relative to `origin/main`
- `origin/dev-test`: available
- `origin/main`: available

Compare counts:

- `git rev-list --left-right --count main...dev-test` -> `0 17`
- `git rev-list --left-right --count origin/main...dev-test` -> `3 5`

Interpretation:

- Against local `main`, `dev-test` is 17 commits ahead and `main` has no unique commits
- Against `origin/main`, `dev-test` has 5 unique commits while `origin/main` has 3 unique commits
- Local `main` is 15 commits behind `origin/main`, so `origin/main` is the more accurate production comparison point

Unique commits from `origin/main...dev-test`:

- `dev-test` only: `a3d7d42` Enable browser source maps for Meticulous coverage
- `dev-test` only: `61fd5a2` Add Meticulous project attribute to recorder
- `dev-test` only: `1a83e37` Pass Meticulous project through workflow config
- `dev-test` only: `f0b2ec5` Restore Meticulous recorder env wiring
- `dev-test` only: `a12bc0e` Add CircleCI deploy marker workflow
- `origin/main` only: `70bc2c2` Create main.yml
- `origin/main` only: `1b044ee` Create dependabot.yml
- `origin/main` only: `5a1fed1` Delete .github/dependabot.yml

## Git/PR Activity

Recent `dev-test` commit timestamps:

- `a3d7d42` at `2026-06-06T02:06:44-05:00`
- `61fd5a2` at `2026-06-06T01:36:01-05:00`
- `1a83e37` at `2026-06-06T01:31:35-05:00`
- `f0b2ec5` at `2026-06-06T01:22:51-05:00`
- `a12bc0e` at `2026-06-06T00:21:49-05:00`

Recent `origin/main` commit timestamps:

- `70bc2c2` at `2026-06-06T01:41:56-05:00`
- `1b044ee` at `2026-06-06T00:22:43-05:00`
- `5a1fed1` at `2026-06-06T00:19:18-05:00`

Since-last-run activity:

- `git log --since="2026-06-10T10:15:28Z" --all`: no commits returned
- Practical meaning: no commit-level Git activity since the last automation run

PR visibility limitation:

- No GitHub API or PR metadata was available from this local-only inspection
- Open/merged PR counts, review states, and check-run outcomes could not be confirmed directly

## File Changes

Committed branch delta from `main...dev-test`:

- 34 files changed
- 1,709 insertions
- 885 deletions

Committed branch delta from `origin/main...dev-test`:

- 9 files changed
- 165 insertions
- 21 deletions

Current uncommitted worktree delta from `git diff --stat`:

- 13 files changed
- 72 insertions
- 104 deletions

Current tracked file changes:

- Modified: `.circleci/config.yml`
- Modified: `.github/workflows/meticulous.yml`
- Deleted: `.github/workflows/promote-dev-test.yml`
- Modified: `.gitignore`
- Modified: `README.md`
- Modified: `app/(Admin Dashboard)/layout.tsx`
- Modified: `app/(Public Pages)/layout.tsx`
- Modified: `components/tooling/meticulous-recorder.tsx`
- Modified: `docs/audits/2026-06-05/integration-status-2026-06-05.md`
- Modified: `docs/tooling/meticulous-nextjs-app-router.md`
- Modified: `docs/tooling/workflow-command-runbook.md`
- Modified: `package-lock.json`
- Modified: `package.json`

Current untracked paths:

- `.github/workflows/dev-test-gate.yml`
- `docs/monitors/`

Key uncommitted content changes:

- Added `@vercel/speed-insights` to `package.json` and `package-lock.json`
- Mounted `<SpeedInsights />` in both route-group layouts
- Changed Meticulous recorder to require `NEXT_PUBLIC_ENABLE_METICULOUS_RECORDER`
- Added the same env flag to CircleCI and GitHub Meticulous workflow build/start steps
- Replaced the old promote workflow with a more explicit `Dev Test Gate` workflow file
- Updated docs and audit notes to describe Speed Insights and the recorder enablement flag

## Comments/Review Notes

Local review-note visibility is limited. No external PR comments or CodeRabbit review threads were accessible from this workspace-only run.

Review-adjacent signals visible in-repo:

- Commit history includes `Add CodeRabbit onboarding test marker`
- Docs continue to reference CodeRabbit onboarding and workflow hardening
- No new review artifacts or comment logs were created after the last run

## Build Status

Command:

- `npm run build`

Result:

- Passed
- Exit code: `0`
- Approximate execution window: 2026-06-10 19:17 CDT

Observed build output:

- Next.js `16.2.7` with Turbopack
- Optimized production build completed successfully
- Static pages generated successfully for 18 routes
- Build succeeded despite the standalone `typecheck` command failing separately

Operational note:

- Build success indicates deployable artifact generation is currently possible from this workspace state
- The typecheck mismatch means CI behavior may differ depending on whether it uses `next build` alone or explicit `tsc --noEmit`

## Test Status

Available verification commands in this repo:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- No `npm test` script is defined in `package.json`

Results:

- `npm run lint`: passed with `42` warnings and `0` errors
- `npm run typecheck`: failed
- `npm run build`: passed
- `npm audit --audit-level=high`: failed its threshold gate because the command still returned vulnerabilities

Typecheck failure:

- File: `.next/types/validator.ts`
- Error: `TS2307: Cannot find module './routes.js' or its corresponding type declarations.`

Lint warning hotspots:

- Unused imports/variables across multiple app components
- Missing `alt` props on image elements in:
- `app/(Public Pages)/(Programs)/programs/page.tsx`
- `app/(Public Pages)/(Programs)/programs/stop-the-stigma/stop-the-stigma-content.tsx`

## Time Since Last Testing

Previous automation run:

- `2026-06-10T10:15:28.598Z`

Current monitor capture time:

- `2026-06-10T19:19:03.7523167-05:00`

Elapsed since previous run:

- `14h 3m`

Evidence of fresh testing during this run:

- `lint`, `typecheck`, `build`, and `audit` were executed locally during this monitor run

Evidence gap:

- No remote CI timestamps were available, so the last GitHub Actions, CircleCI, or Vercel test execution time could not be confirmed

## Dependency Updates

Committed `dev-test` dependency/workflow changes versus `origin/main`:

- `next` advanced from `16.2.6` to `16.2.7` in lockfile
- `@vercel/analytics` was added in committed branch history
- `postcss` resolved to `8.5.15` in lockfile
- GitHub workflow targets were moved to `main` and `dev-test`
- Dependabot target branch changed to `dev-test`

Current uncommitted dependency changes:

- Added `@vercel/speed-insights@^2.0.0`

Dependabot remote branches present:

- `remotes/origin/dependabot/github_actions/dev-test/actions/dependency-review-action-5`
- `remotes/origin/dependabot/github_actions/main/actions/checkout-6`
- `remotes/origin/dependabot/github_actions/main/actions/setup-node-6`
- `remotes/origin/dependabot/npm_and_yarn/main/chakra-ui/cli-3.35.0`
- `remotes/origin/dependabot/npm_and_yarn/main/eslint-config-next-16.2.7`
- `remotes/origin/dependabot/npm_and_yarn/main/multi-b0dfc253ff`
- `remotes/origin/dependabot/npm_and_yarn/main/notionhq/client-5.22.0`
- `remotes/origin/dependabot/npm_and_yarn/main/react-dom-19.2.7`

## Security/Audit Signals

`npm audit --audit-level=high` output:

- Reported `2 moderate severity vulnerabilities`
- Affected package path: `next` -> bundled `postcss`
- Advisory: PostCSS XSS via unescaped `</style>` in stringify output

Threshold nuance:

- The workflow gate in `dev-test-gate.yml` checks at `--audit-level=high`
- The local command still printed vulnerabilities and exited non-zero, even though the findings are moderate rather than high
- This is a gate reliability risk because the intended severity threshold may not match the observed command behavior in this environment

Static secret scanning posture:

- `dev-test-gate.yml` includes a regex-based secret scan over tracked source
- `security.yml` includes the same class of scan for branch/pull request coverage

Code scanning posture:

- `codeql.yml` was expanded from `master`-only defaults to `main` and `dev-test`
- `dev-test-gate.yml` adds a `CodeQL Advanced` job before promotion

## CI Workflow Status

Workflow/config files tracked in Git:

- `.circleci/config.yml`
- `.github/workflows/codeql.yml`
- `.github/workflows/meticulous.yml`
- `.github/workflows/nextjs.yml`
- `.github/workflows/promote-dev-test.yml`
- `.github/workflows/security.yml`

Current local transition in progress:

- Tracked deletion: `.github/workflows/promote-dev-test.yml`
- Untracked addition: `.github/workflows/dev-test-gate.yml`

Current workflow intent:

- `nextjs.yml`: basic install, typecheck, lint, build on `main` and `dev-test`
- `security.yml`: npm audit, dependency review on PRs, static secret scan
- `meticulous.yml`: build, asset prep, app startup, Meticulous visual diff run
- `.circleci/config.yml`: verify on `dev-test` and `main`, plus `main`-only Vercel production marker
- `dev-test-gate.yml` local draft: consolidated validate + CodeQL + Meticulous + push-to-main job

Status limitation:

- No live GitHub Actions or CircleCI run status could be inspected from this environment
- CI health in this report is derived from workflow definitions plus local command execution

## Deploy/Preview Status

Local Vercel linkage from `.vercel/project.json`:

- `projectName`: `mokserevamp`
- `projectId`: `prj_R8mtzD2Qjg2Kzfjh5ti07SWpq9sw`
- `orgId`: `team_xiHLp9fi5eYWISVuWBgh4uxf`

Deployment posture inferred from repo state:

- `main` is intended as the Vercel production branch
- `dev-test` is the validation branch before production promotion
- CircleCI records a production deployment marker on `main`
- Docs now describe Web Analytics plus Speed Insights as code-integrated

Preview/deploy limitation:

- No Vercel API/dashboard access was available
- No active preview URL, last deployment time, or production deployment result could be confirmed

## TODO/FIXME/Follow-up Items

Source scan command:

- `rg -n --glob '!node_modules/**' --glob '!docs/monitors/**' --glob '!package-lock.json' "TODO|FIXME|HACK|XXX|BUG" .`

Open source markers found:

- `app/(API Routes)/api/contact/route.ts:37`
- `TODO: Future integration - send email via email service (SendGrid, AWS SES, etc.)`

Operational follow-up items visible from docs/workflows:

- Enable Vercel Web Analytics in the dashboard if not already active
- Enable Vercel Speed Insights collection in the dashboard if not already active
- Ensure `NEXT_PUBLIC_ENABLE_METICULOUS_RECORDER` is configured in preview/development environments when recorder capture is desired
- Confirm GitHub code scanning / Advanced Security availability for the repo if CodeQL uploads are expected

## DevOps Learning Metrics

Branching metrics:

- Local `dev-test` ahead of local `main`: `17` commits
- `dev-test` ahead of `origin/main`: `5` commits
- `dev-test` behind `origin/main`: `3` commits
- Commits since last run: `0`

Change metrics:

- Committed delta `main...dev-test`: `34` files changed
- Current uncommitted delta: `13` files changed
- Workflow/config files currently modified, added, or deleted locally: `4`

Verification metrics from this run:

- Build success count: `1`
- Build failure count: `0`
- Typecheck success count: `0`
- Typecheck failure count: `1`
- Lint success count: `1`
- Lint warnings count: `42`
- Audit clean count: `0`
- Audit vulnerability count: `2 moderate`
- TODO/FIXME markers in source scan: `1`

Monitoring maturity signals:

- Multiple CI layers exist: GitHub Actions, CircleCI, CodeQL, Dependabot, Meticulous
- Production/validation branch discipline is documented
- Deployment observability integration is expanding with Speed Insights
- Remote execution telemetry is still missing from local-only monitoring

## Risks

- `origin/main` and `dev-test` have diverged in both directions, so promotion assumptions are unsafe until the branch relationship is reconciled
- The local workflow transition is incomplete because `dev-test-gate.yml` is untracked while `promote-dev-test.yml` is only locally deleted
- `npm run typecheck` currently fails, so any CI gate that runs explicit `tsc --noEmit` will block promotion
- `npm audit --audit-level=high` returned a failing status despite only moderate findings, which may create confusing gate outcomes
- Build and typecheck disagree, indicating a tooling/config drift around generated `.next` types
- PR/review/deployment status is partially blind without remote API access

## Recommended Next Actions

- Reconcile `dev-test` with `origin/main` before any automated promotion to avoid overwriting main-only changes
- Commit or discard the local workflow transition explicitly: add `.github/workflows/dev-test-gate.yml` and remove `.github/workflows/promote-dev-test.yml` in one reviewed change
- Fix the standalone typecheck failure in `.next/types/validator.ts` so explicit CI verification matches `next build`
- Decide whether `npm audit --audit-level=high` should be tolerated with moderate findings or replaced with a more deterministic gate
- Commit the Speed Insights integration only after confirming dashboard enablement and any required env/config expectations
- If stronger monitoring is needed, add remote-status collection in a future run using GitHub/Vercel/CircleCI APIs rather than local git inspection alone

## Commands Run

- `git branch --all --verbose --no-abbrev`
- `git status --short --branch`
- `git rev-list --left-right --count main...dev-test`
- `git rev-list --left-right --count origin/main...dev-test`
- `git log --decorate --oneline --graph --max-count=20 dev-test`
- `git log --decorate --oneline --graph --max-count=20 main`
- `git log --pretty=format:"%h %cI %s" --max-count=10 dev-test`
- `git log --pretty=format:"%h %cI %s" --max-count=10 origin/main`
- `git log --since="2026-06-10T10:15:28Z" --pretty=format:"%h %cI %d %s" --all`
- `git log --left-right --cherry-pick --oneline origin/main...dev-test`
- `git diff --stat main...dev-test`
- `git diff --stat origin/main...dev-test`
- `git diff --stat`
- `git diff --name-status main...dev-test`
- `git diff --name-status`
- `git diff -- package.json`
- `git diff -- .github/workflows/meticulous.yml .circleci/config.yml .github/workflows/dev-test-gate.yml .github/workflows/promote-dev-test.yml package-lock.json`
- `git diff -- "app/(Admin Dashboard)/layout.tsx" "app/(Public Pages)/layout.tsx" "components/tooling/meticulous-recorder.tsx" README.md .gitignore docs/tooling/meticulous-nextjs-app-router.md docs/tooling/workflow-command-runbook.md docs/audits/2026-06-05/integration-status-2026-06-05.md`
- `rg -n --glob '!node_modules/**' --glob '!docs/monitors/**' --glob '!package-lock.json' "TODO|FIXME|HACK|XXX|BUG" .`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm audit --audit-level=high`

## Limitations

- This report used local repository state only
- Remote PR metadata, review comments, CI run outcomes, and Vercel deployment outcomes were not directly accessible
- Local `main` is stale relative to `origin/main`, so any comparison to local `main` alone would be misleading
