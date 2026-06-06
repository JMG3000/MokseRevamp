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

Expected value format:

```text
The raw Meticulous project ID only. Do not paste workflow YAML, script tags, or command snippets into this variable.
```

Verify GitHub repository variables from a machine with GitHub CLI access:

```powershell
gh variable list --repo JMG3000/MokseRevamp
```

Set the public Meticulous project ID variable if it is missing:

```powershell
gh variable set NEXT_PUBLIC_METICULOUS_PROJECT_ID --repo JMG3000/MokseRevamp --body "<meticulous-project-id>"
```

If the Meticulous workflow fails with `Could not retrieve project data` or ``projectId` is required when authenticating with an OAuth user token`, replace the GitHub Actions secret with the project-specific API token from the Meticulous project settings:

```powershell
gh secret set METICULOUS_API_TOKEN --repo JMG3000/MokseRevamp
```

Do not use a personal/OAuth Meticulous user token for `METICULOUS_API_TOKEN` unless Meticulous support confirms the matching `projects-yaml` setup for this action.

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

## Vercel Project

Current Vercel project:

```text
Team: jacob-garretts-projects
Project: mokserevamp
Project ID: prj_R8mtzD2Qjg2Kzfjh5ti07SWpq9sw
```

Verify the local checkout is linked to the correct Vercel project:

```powershell
Get-Content .vercel\project.json
npx vercel@latest project ls --scope jacob-garretts-projects
```

List Vercel runtime environment variables:

```powershell
npx vercel@latest env ls --scope jacob-garretts-projects
```

Add runtime variables only after their values are confirmed:

```powershell
npx vercel@latest env add NOTION_TOKEN production preview development --scope jacob-garretts-projects
npx vercel@latest env add NOTION_DATABASE_KEY production preview development --scope jacob-garretts-projects
npx vercel@latest env add NOTION_BASE_URL production preview development --scope jacob-garretts-projects
npx vercel@latest env add NEXT_PUBLIC_METICULOUS_PROJECT_ID production preview development --scope jacob-garretts-projects
```

Do not commit `.vercel/`; it is local metadata and is ignored by Git.

## Vercel Web Analytics

Package and layout integration:

```text
@vercel/analytics
app/(Public Pages)/layout.tsx
app/(Admin Dashboard)/layout.tsx
```

The app mounts:

```tsx
<Analytics />
```

Dashboard action still required:

```text
Enable Web Analytics for project `mokserevamp` in Vercel.
```

## CircleCI

Repo config:

```text
.circleci/config.yml
```

Local syntax validation:

```powershell
npx --yes yaml-lint .circleci\config.yml
```

Expected CircleCI job path:

```text
npm ci
npm run typecheck
npm run lint
npm run build
copy .next/static into companion-assets/_next/static
store companion-assets as build artifacts
```

Dashboard action still required:

```text
Connect CircleCI to GitHub repo JMG3000/MokseRevamp.
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
