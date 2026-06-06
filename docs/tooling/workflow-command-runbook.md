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

GitHub Actions repository variable and Vercel preview/development env var:

```text
NEXT_PUBLIC_METICULOUS_PROJECT_ID
```

In this repo, `NEXT_PUBLIC_METICULOUS_PROJECT_ID` feeds the Meticulous recorder token used by the native `<script>` tag. The recorder also has a fallback token in code so the setup does not silently disappear while dashboard wiring is being verified.

If the Meticulous workflow fails with `Could not retrieve project data` or ``projectId` is required when authenticating with an OAuth user token`, replace the GitHub Actions secret with the project-specific API token from the Meticulous project settings:

```powershell
gh secret set METICULOUS_API_TOKEN --repo JMG3000/MokseRevamp
```

Do not use a personal/OAuth Meticulous user token for `METICULOUS_API_TOKEN` unless Meticulous support confirms the matching `projects-yaml` setup for this action.

The browser recorder script uses the Meticulous recording token and only renders in local development or Vercel preview deployments. It should not render in production.

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
npx vercel@latest env add NEXT_PUBLIC_METICULOUS_PROJECT_ID preview development --scope jacob-garretts-projects
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

Expected CircleCI verification job path on `dev-test` and `main`:

```text
npm ci
npm run typecheck
npm run lint
npm run build
copy .next/static into companion-assets/_next/static
store companion-assets as build artifacts
```

Expected CircleCI deploy marker path on `main` only:

```text
verify
deploy-production-marker
circleci run release plan vercel-production
circleci run release update vercel-production --status=running
record Vercel deployment handoff
circleci run release update vercel-production --status=SUCCESS or FAILED
```

The deploy marker job exists because CircleCI Deploys requires a deployment job before deploy marker generation can succeed. It does not deploy the app; Vercel remains the production deployer for the `main` branch.

Dashboard action still required:

```text
Connect CircleCI to GitHub repo JMG3000/MokseRevamp.
```

## Branch And Promotion Workflow

Branch roles:

```text
dev-test  Development validation branch; all active development pushes go here.
main      Production branch; Vercel should use this branch for production deployments.
```

Push the current development branch:

```powershell
git -C D:\repos\codex-projects\MokseRevamp push -u origin dev-test
```

Push the current verified commit to production manually when needed:

```powershell
git -C D:\repos\codex-projects\MokseRevamp push origin HEAD:main
```

The GitHub Actions workflow `.github/workflows/promote-dev-test.yml` also verifies `dev-test` and pushes the exact checked commit to `main` when its configured checks pass. Keep `main` configured as the Vercel production branch.

Historical branch note:

```text
codex/production-hardening-coderabbit
```

This branch was used for the earlier production-hardening and CodeRabbit onboarding/review work. Its commits are already contained by `dev-test` and `main`, so it is no longer the active development branch.

## GitHub Security Workflows

Repo config:

```text
.github/workflows/codeql.yml
.github/workflows/security.yml
.github/dependabot.yml
```

Security workflow coverage:

```text
CodeQL Advanced code scanning
Dependabot npm and GitHub Actions updates targeted at dev-test
Dependency review on pull requests, currently informational until GitHub Dependency Graph / Advanced Security is enabled for the private repo
npm audit high-severity gate
Static secret pattern scan
```

Dashboard actions still required:

```text
Enable GitHub code scanning / Advanced Security where the private repo plan allows it.
Enable secret scanning and push protection where available.
Confirm branch protection rules for main after CircleCI and GitHub Actions are connected.
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
