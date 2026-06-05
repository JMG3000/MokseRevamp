# MokseRevamp Integration Status - 2026-06-05

## Purpose

Track which services are connected to the new MokseRevamp repository and which are still tied to the old working prototype or old developer environment.

## Current Status

| Service | Status | Required action |
| --- | --- | --- |
| GitHub | Blocked | Local clean repo and initial commit exist; push to `JMG3000/MokseRevamp` returned `Repository not found`. Create the private GitHub repo or grant repo-creation access, then push `main`. |
| Vercel | Pending | Connect only to `MokseRevamp`; configure Notion env vars in Vercel. |
| CodeRabbit | Pending | Install/connect against `MokseRevamp` only. |
| GitHub security | Pending | Enable CodeQL, Dependabot, dependency review, and secret scanning where available. |
| Sentry | Pending | Create a new Sentry project/environment and add DSN through Vercel. |
| Linear | Pending | Connect launch blockers to `MokseRevamp` after repo creation. |
| Slack | Pending | Connect notifications and audit workflow channels after repo creation. |
| Airtable | Pending | Reauthenticate and scope records/workflows to the new project. |
| Google Drive | Pending | Connect approved docs and report storage after repo creation. |
| Gmail | Pending | Connect only if audit/report delivery workflows require it. |
| Notion | Pending | Grant least-privilege access only to the production resource database needed by the site. |

## Standing Rule

Do not grant broad all-repository access when a service supports single-repository access. Prefer least privilege for `MokseRevamp` only.

## Push Attempt

- Intended origin: https://github.com/JMG3000/MokseRevamp.git`r
- Local branch: main`r
- Result: Repository not found from GitHub on 2026-06-05.

