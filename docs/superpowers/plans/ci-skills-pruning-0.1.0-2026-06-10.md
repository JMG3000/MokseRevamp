# CI/Skills Pruning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate GitHub Actions to one `dev-test` deployment gate, prune ignored local skills, and avoid burning GitHub Actions minutes until explicitly approved.

**Architecture:** `dev-test` is the active engineering branch and `main` remains Vercel production. GitHub Actions should use only `.github/workflows/dev-test-gate.yml` for validation, CodeQL, Meticulous, and promotion; CircleCI remains a secondary validation dashboard and must not promote production.

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
- GitHub Actions minutes are exhausted for the month, so do not push until explicitly approved.

## Task 1: Remove Redundant GitHub Actions Workflows

**Files:**
- Delete: `.github/workflows/codeql.yml`
- Delete: `.github/workflows/meticulous.yml`
- Delete: `.github/workflows/nextjs.yml`
- Keep: `.github/workflows/dev-test-gate.yml`

- [ ] Delete the three redundant workflow files.
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
git grep -n -E '(notion_secret_|secret_[A-Za-z0-9]{16,}|github_pat_|ghp_[A-Za-z0-9]{36,}|sk-[A-Za-z0-9]{20,}|ctx7sk-|xox[baprs]-|AKIA[0-9A-Z]{16})' -- . ':!package-lock.json' ':!.github/workflows/*.yml'
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

## Task 4: Commit Locally Only

**Files:**
- Stage only tracked CI/config/docs files.
- Do not stage `.agents/`.

- [ ] Confirm final staged scope before commit:

```powershell
git status --short
```

- [ ] Commit locally on `dev-test`.
- [ ] Do not push to `dev-test` until explicitly approved because GitHub Actions minutes are exhausted.
- [ ] Do not push to `main`.

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
- No remote push occurs without explicit approval.

## Assumptions

- `main` remains Vercel production.
- `dev-test` remains the active engineering gate.
- CircleCI remains secondary and does not control production promotion.
- The existing commit `e94742f` remains the baseline for this cleanup.
