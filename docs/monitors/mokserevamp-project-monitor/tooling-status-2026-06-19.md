# MokseRevamp Tooling Status

Updated: 2026-06-23 15:50 CDT
Source: `2026-06-19-0318-project-monitor-report.md`

| Service | Status | Evidence / blocker |
| --- | --- | --- |
| Git | Green | `dev-test` equals `origin/dev-test`; production drift is `9 24` |
| Local validation | Green | Lint, typecheck, build, and high-severity audit pass |
| GitHub CLI | Blocked | Stored token for `JMG3000` is invalid |
| GitHub Actions | Amber | Full gate exists but is manual-only |
| CircleCI | Green | Remote build `25` passed on commit `63f0889`; `npm ci`, typecheck, lint, build, and companion asset upload passed |
| Vercel | Green | Preview deployment for commit `63f0889` completed; deployment URL returned HTTP 200 |
| Meticulous | Green in code | Recorder and deterministic workflow are wired |
| Analytics / Speed Insights | Green in code | Mounted in both route-group layouts |
| Sentry | Green for compilation | Observability configuration passed CircleCI and Vercel Linux compilation; runtime ingestion still requires dashboard confirmation |
| Notion | Green in code | Server package and route present; runtime env not verified |
| Dependencies | Amber | Audit clean; one extraneous local package |

## Remote Pipeline Evidence

| Signal | Value |
| --- | --- |
| Commit | `63f08896ac6b2ef4e7ce6f71a64b9ec97ec062dc` |
| Commit subject | `Configure Sentry observability` |
| CircleCI | `success`, build `25`, workflow/job `verify / verify` |
| CircleCI URL | `https://circleci.com/gh/JMG3000/MokseRevamp/25` |
| Vercel deployment | `success`, deployment `5138233482`, environment `Preview` |
| Vercel URL | `https://mokserevamp-qb0oo89ja-jacob-garretts-projects.vercel.app` |
| URL check | HTTP `200`, `server: Vercel`, `x-vercel-cache: HIT` |
