# MokseRevamp Workflow Command Runbook

This runbook keeps the current workflow commands in one committed place. Do not add real secret values to this file.

## Repository State

```powershell
git -C D:\repos\codex-projects\MokseRevamp status --short --branch
git -C D:\repos\codex-projects\MokseRevamp remote -v
git -C D:\repos\codex-projects\MokseRevamp log --oneline --decorate --max-count=5
```

## Local Verification

```powershell
npm ci
npm run typecheck
npm run lint
npm run build
npm audit --audit-level=moderate
```

## Meticulous Setup

GitHub Actions secret, already added by repo owner:

```text
METICULOUS_API_TOKEN
```

Required repository variable or deployment environment variable:

```text
NEXT_PUBLIC_METICULOUS_PROJECT_ID
```

Confirm the workflow file exists:

```powershell
Get-Content .github\workflows\meticulous.yml
```

Meticulous dashboard setting for Next.js App Router:

```text
Network Stubbing: Stub all requests, apart from requests for server components and static assets
```

The recorder is installed in:

```text
components/tooling/meticulous-recorder.tsx
app/(Public Pages)/layout.tsx
app/(Admin Dashboard)/layout.tsx
```

## CodeRabbit CLI Through WSL

Check authentication:

```powershell
wsl.exe bash -lc "cd /mnt/d/repos/codex-projects/MokseRevamp && cr auth status --agent"
```

Review current branch against main:

```powershell
wsl.exe bash -lc "cd /mnt/d/repos/codex-projects/MokseRevamp && cr review --agent --base main"
```

Review committed changes only:

```powershell
wsl.exe bash -lc "cd /mnt/d/repos/codex-projects/MokseRevamp && cr review --agent --type committed"
```

Show prior findings:

```powershell
wsl.exe bash -lc "cd /mnt/d/repos/codex-projects/MokseRevamp && cr review findings"
```

## GitHub PR Workflow

```powershell
git checkout -b codex/example-branch
git add <files>
git commit -m "Describe change"
git push -u origin codex/example-branch
```

Then open a PR against `main`.

## Linear Workflow

Linear team currently used for this project:

```text
JakeInc
```

Primary workflow issue:

```text
JAK-5 - MokseRevamp workflow integration and audit documentation
https://linear.app/jakjeinc/issue/JAK-5/mokserevamp-workflow-integration-and-audit-documentation
```

Recommended issue labels:

```text
MokseRevamp
Production Readiness
Workflow
Security
QA
```

Record each major workflow milestone as a Linear comment with:

- PR link
- command results
- remaining blockers
- next owner/action

## Secret Handling

Local-only secret notes may live in ignored files such as:

```text
SECRET_README.md
README.secret.md
secrets/
```

Never commit real tokens, env pulls, integration keys, or screenshots containing keys.