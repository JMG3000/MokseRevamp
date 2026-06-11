# CI/Skills Pruning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate GitHub Actions to one manual-only `dev-test` deployment gate, prune ignored local skills, and keep moving through local, CircleCI, CodeRabbit CLI, and Vercel validation while GitHub Actions minutes are unavailable until June 30, 2026.

**Architecture:** `dev-test` is the active engineering branch and `main` remains Vercel production. GitHub Actions should use only `.github/workflows/dev-test-gate.yml`, with automatic triggers disabled until minutes reset. CircleCI, local validation, CodeRabbit CLI, and Vercel CLI are the active no-wait path.

**Tech Stack:** Next.js, GitHub Actions, CircleCI, CodeQL, Meticulous, CodeRabbit CLI, Vercel.

---

## Current Findings

- `dev-test` is clean and currently tracks these active GitHub Actions workflows:
  - `.github/workflows/codeql.yml`
  - `.github/workflows/dev-test-gate.yml`
  - `.github/workflows/meticulous.yml`
  - `.github/workflows/nextjs.yml`
- `.github/workflows/security.yml` is absent.
- `.agents/` is ignored by `.gitignore`, but local ignored skills still include `supabase` and full `vercel` / `build-web-apps` trees.
- GitHub Actions minutes are exhausted until June 30, 2026, so automatic GitHub Actions triggers must be disabled before any push.

## Task 1: Remove Redundant GitHub Actions Workflows

**Files:**
- Delete: `.github/workflows/codeql.yml`
- Delete: `.github/workflows/meticulous.yml`
- Delete: `.github/workflows/nextjs.yml`
- Keep: `.github/workflows/dev-test-gate.yml`

- [ ] Delete the three redundant workflow files.
- [ ] Change `.github/workflows/dev-test-gate.yml` to `workflow_dispatch` only so pushes do not consume GitHub Actions minutes.
- [ ] Verify only the deployment gate remains:

```powershell
git ls-files .github/workflows
```

Expected output:

```text
.github/workflows/dev-test-gate.yml
```

## Task 2: Prune Ignored Local Skills

**Files:**
- Keep ignored: `.agents/`
- Modify local ignored workspace files only under `.agents/skills`

- [ ] Confirm `.agents/` is ignored:

```powershell
git check-ignore -v .agents/skills
```

- [ ] Remove the ignored local skill group:

```text
.agents/skills/supabase
```

- [ ] Keep only these ignored local skill groups:

```text
.agents/skills/github
.agents/skills/linear
.agents/skills/coderabbit
.agents/skills/codex-security
.agents/skills/circleci
.agents/skills/vercel
.agents/skills/build-web-apps
```

- [ ] Prune `.agents/skills/vercel` to only:

```text
deployments-cicd
env-vars
nextjs
observability
runtime-cache
verification
```

- [ ] Prune `.agents/skills/build-web-apps` to only:

```text
frontend-app-builder
frontend-testing-debugging
react-best-practices
```

- [ ] Verify `.agents/` remains ignored and unstaged:

```powershell
git status --short --ignored .agents
```

Expected output includes only:

```text
!! .agents/
```

## Task 3: Local Validation Gate

**Files:**
- No source edits expected.
- Validation results should be recorded in the dated audit log if failures remain.

- [ ] Run framework and security checks:

```powershell
npm run lint
npm run typecheck
npm run build
npm audit --audit-level=high
```

- [ ] Run the hardcoded secret regex check:

```powershell
$secretPattern = @(
  'notion_' + 'secret_',
  'secret_' + '[A-Za-z0-9]{16,}',
  'github_pat_',
  'ghp_' + '[A-Za-z0-9]{36,}',
  'sk-' + '[A-Za-z0-9]{20,}',
  'ctx7' + 'sk-',
  'xox[baprs]-',
  'AKIA' + '[0-9A-Z]{16}'
) -join '|'
git grep -n -E $secretPattern -- . ':!package-lock.json' ':!.github/workflows/*.yml'
```

Expected result: no matches.

- [ ] Run repository whitespace validation:

```powershell
git diff --check
```

- [ ] Run workflow/config validation when tools are available:

```powershell
actionlint
circleci config validate
```

- [ ] Run CodeRabbit on the final local diff:

```bash
~/.local/bin/coderabbit review --agent --type uncommitted --dir web
```

## Task 4: Commit And Push Without GitHub Actions Burn

**Files:**
- Stage only tracked CI/config/docs files.
- Do not stage `.agents/`.

- [ ] Confirm final staged scope before commit:

```powershell
git status --short
```

- [ ] Commit locally on `dev-test`.
- [ ] Push `dev-test` only after verifying `.github/workflows/dev-test-gate.yml` has no `push` trigger.
- [ ] Block the push if any GitHub Actions workflow has an automatic push trigger:

```powershell
$pushTriggers = Select-String -Path .github/workflows/*.yml -Pattern '^\s*push\s*:'
if ($pushTriggers) {
  $pushTriggers
  throw "GitHub Actions push trigger detected. Do not push while Actions minutes are unavailable."
}
```

- [ ] Do not push to `main`.
- [ ] If production deployment is needed before June 30, deploy through Vercel CLI after local/CircleCI validation instead of using GitHub Actions promotion.

## Task 5: Log To Linear And Audit Notes

**Files:**
- Update dated audit notes if already present.
- Linear issue: `JAK-5`.

- [ ] Record workflow deletion results.
- [ ] Record local validation pass/fail results.
- [ ] Record skipped remote GitHub Actions reason: monthly Actions minutes exhausted.
- [ ] Confirm no manual `main` push occurred.

## Acceptance Criteria

- `git ls-files .github/workflows` returns only `.github/workflows/dev-test-gate.yml`.
- `.agents/` is ignored and not staged.
- Local validation has either passed or failures are explicitly documented.
- A local commit exists on `dev-test`.
- Remote pushes do not trigger GitHub Actions automatically.

## Assumptions

- `main` remains Vercel production.
- `dev-test` remains the active engineering gate.
- CircleCI remains secondary and does not control production promotion.
- GitHub Actions automatic triggers remain disabled until minutes reset or you explicitly re-enable them.
- The existing commit `e94742f` remains the baseline for this cleanup.
