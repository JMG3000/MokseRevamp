# MokseRevamp Deployment Readiness - 2026-06-05

## Current State

MokseRevamp is a clean production-prep repo initialized separately from the prototype history. Production deployment should wait until critical security issues are remediated and provider access is scoped to this new repo.

## Required Before Vercel Production

1. Confirm the new Git remote points only to `MokseRevamp`.
2. Configure `NOTION_TOKEN`, `NOTION_DATABASE_KEY`, and `NOTION_BASE_URL` in Vercel as server-only environment variables.
3. Add Notion API caching or static generation protection before public traffic.
4. Replace unsafe admin authentication with a production auth path.
5. Add error boundaries/loading and error states for the Notion-backed resource asset.
6. Connect Sentry and verify server/client error capture.
7. Resolve lint failures and dependency advisories before launch.

## MokseRevamp Check Results

| Check | Result | Notes |
| --- | --- | --- |
| npm ci | Passed | Installed from package-lock; reported 3 moderate vulnerabilities. |
| npm run typecheck | Passed | Passed after neutralizing admin credentials and adding explicit member typing. |
| npm run build | Passed | Build succeeded; local warning remains about parent workspace root inference. |
| npm run lint | Failed | 10 errors and 44 warnings remain. |
| npm audit --audit-level=moderate | Failed | 3 moderate advisories: brace-expansion DoS and postcss/next XSS advisory chain. |

## Local Warning

Next.js inferred `D:\repos\codex-projects\package-lock.json` as a workspace root because this local folder has a parent lockfile. This should be reviewed after GitHub/Vercel import; the deployed repo should not inherit the parent workspace layout.

## Repository Creation Blocker

The clean local repository is ready, but GitHub push failed because JMG3000/MokseRevamp does not yet exist or is not visible to the available GitHub tooling. No old remote is configured in MokseRevamp.

