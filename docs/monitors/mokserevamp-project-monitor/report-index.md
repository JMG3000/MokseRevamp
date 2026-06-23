# MokseRevamp Report Index

Updated: 2026-06-23 15:50 CDT

## Current Reports

| Report | Purpose | Status |
| --- | --- | --- |
| `2026-06-19-0318-project-monitor-report.md` | Current project monitor snapshot for repository recovery, validation, tooling, CI, deployment visibility, and verified Sentry observability pipeline status | Current; remote CircleCI and Vercel evidence refreshed 2026-06-23 |
| `tooling-status-2026-06-19.md` | Current tooling status by service with blockers and next actions | Current; remote CircleCI and Vercel evidence refreshed 2026-06-23 |

## Historical Monitor Reports

| Report | Summary |
| --- | --- |
| `2026-06-16-0533-project-monitor-report.md` | Prior snapshot before the 2026-06-19 recovery and validation run |
| `2026-06-15-0500-monitor-report.md` | Prior consolidated snapshot; stale now because branch and deploy visibility changed |
| `2026-06-13-0353-monitor-report.md` | Historical regression report from broken local validation state |
| `2026-06-10-1919-monitor-report.md` | Historical branch/CI health snapshot |
| `2026-06-10-0517-monitor-report.md` | Historical early monitor run |
| `2026-06-10-0516-monitor-report.md` | Historical early monitor run |

## Historical Tooling Status

| Report | Summary |
| --- | --- |
| `tooling-status-2026-06-16.md` | Prior tooling snapshot before the 2026-06-19 recovery run |
| `tooling-status-2026-06-15.md` | Prior tooling snapshot before the latest `dev-test` cleanup and footer restore |

## Audit Reports

| Report | Purpose |
| --- | --- |
| `../../audits/2026-06-05/preproduction-audit-2026-06-05.md` | Initial preproduction audit |
| `../../audits/2026-06-05/security-findings-2026-06-05.csv` | Initial security findings register |
| `../../audits/2026-06-05/integration-status-2026-06-05.md` | Initial integration status |
| `../../audits/2026-06-05/deployment-readiness-2026-06-05.md` | Initial deployment readiness notes |

## Tooling Docs

| Report | Purpose |
| --- | --- |
| `../../tooling/workflow-command-runbook.md` | CI/CD command patterns and workflow commands |
| `../../tooling/meticulous-nextjs-app-router.md` | Meticulous app-router setup notes |
| `../../tooling/coderabbit-onboarding-test-2026-06-05.md` | CodeRabbit onboarding/test PR notes |

## Cleanup Policy

- Do not delete historical reports by default.
- Treat this index as the entry point for current status.
- Mark stale historical reports explicitly rather than rewriting their contents.
- Future monitor runs should add a new timestamped monitor report and update this index plus the tooling-status file.
