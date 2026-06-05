# MokseRevamp Preproduction Audit - 2026-06-05

## Dashboard

| Area | Status | Notes |
| --- | --- | --- |
| Security | Blocked | Admin auth and local secret handling must be fixed before production. |
| Notion dependency | Blocked | Live schema and API route caching/security need remediation. |
| Vercel readiness | At risk | Existing project is linked to the old developer/repo environment. New repo access is pending. |
| Observability | Not connected | Sentry is not connected to the new repo/project yet. |
| External workflow tools | Not connected | CodeRabbit, Linear, Airtable, Slack, Google Drive, Gmail, and Notion access must be scoped to MokseRevamp after repo creation. |
| Build health | Partial | Typecheck and build passed in the source audit; lint failed. |

## Context

MokseRevamp is a clean production-prep copy of the public/working MokseWebsite prototype. It must not inherit the old repository remotes, commit history, GitHub integrations, Vercel project linkage, or old developer environment connections.

## Show-Stopping Findings

1. Public admin authentication is unsafe: plaintext credentials, client-side validation, independent username/password matching, and password console logging were found in the prototype source.
2. The Notion live database schema does not match the app's API mapping, so live resource links and verification dates may render incorrectly or disappear.
3. The Notion API route is not production-hardened: no cache/revalidate strategy, no timeout handling, no rate limiting, Authorization header fallback, and raw upstream error details are returned to clients.
4. `env.download` in the prototype workspace contains populated Notion values and must never be committed or pushed.

## Required Next Actions

1. Create the private GitHub repository `MokseRevamp` with clean initial history only.
2. Connect Vercel only to `MokseRevamp` and configure server-only Notion environment variables in Vercel.
3. Connect CodeRabbit, Sentry, Linear, Slack, Airtable, Google Drive, Gmail, and Notion after the new repo exists, scoped to this repo/project only.
4. Remediate critical security issues before any production domain or public launch.
5. Record every future audit in a new dated directory with fresh files.
