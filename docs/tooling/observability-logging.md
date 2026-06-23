# MokseRevamp Observability And Logging

## Current Implementation

| Layer | Status | Location |
| --- | --- | --- |
| Sentry SDK | Implemented | `instrumentation.ts`, `instrumentation-client.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, `next.config.ts` |
| Vercel Analytics | Implemented | `app/(Public Pages)/layout.tsx`, `app/(Admin Dashboard)/layout.tsx` |
| Vercel Speed Insights | Implemented | `app/(Public Pages)/layout.tsx`, `app/(Admin Dashboard)/layout.tsx` |
| Google Analytics tag | Implemented | `components/tooling/google-tag.tsx` |
| Structured app logging | Baseline utility added | `lib/observability/structured-logger.ts` |

## Logging Standard

Use JSON logs for all API routes and server actions. Do not log secrets, cookies, authorization headers, passwords, raw tokens, or user-submitted message bodies.

Required fields:

```text
level
message
service
environment
timestamp
route
requestId
method
ms
```

Recommended API route pattern:

```ts
import { createRequestLogger } from "@/lib/observability/structured-logger";

export async function GET(request: Request) {
  const logger = createRequestLogger("/api/example", request);

  logger.start();

  try {
    const result = await loadData();
    logger.done({ status: 200 });
    return Response.json(result);
  } catch (error) {
    logger.error("request.failed", error, { status: 500 });
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

Recommended server action pattern:

```ts
import { logEvent } from "@/lib/observability/structured-logger";

logEvent("info", "admin.login.start", { route: "/admin" });
logEvent("warn", "admin.login.rate_limited", { route: "/admin" });
logEvent("error", "admin.login.failed", { route: "/admin", error });
```

## Production Verification

Vercel preview deployment for commit `63f0889` passed:

```text
Vercel status: Ready
Sentry source maps: uploaded
Next build: passed with Turbopack on Linux
```

CircleCI job `25` passed:

```text
npm ci: passed
npm run typecheck: passed
npm run lint: passed
npm run build: passed
```

## Vercel Runtime Log Commands

Use bounded commands. Do not stream indefinitely.

```bash
npx vercel@latest logs https://mokserevamp.vercel.app --level error --since 1h --scope jacob-garretts-projects
npx vercel@latest logs https://mokserevamp.vercel.app --since 30m --scope jacob-garretts-projects
```

## Sentry Notes

- Vercel deployment uploaded source maps for release `63f08896ac6b2ef4e7ce6f71a64b9ec97ec062dc`.
- CircleCI build passes without `SENTRY_AUTH_TOKEN`; source maps are skipped there by design unless the token is added as a CircleCI secret.
- Keep Sentry auth tokens in Vercel/CircleCI/GitHub secrets only.

## Follow-Up Work

1. Replace ad hoc `console.*` calls in API routes and server actions with `createRequestLogger`.
2. Add dashboard confirmation for Vercel Web Analytics and Speed Insights.
3. If Vercel Pro/Enterprise is available, configure a log drain and store the drain signing secret as `DRAIN_SECRET`.
4. Add `SENTRY_AUTH_TOKEN` to CircleCI only if CircleCI must upload source maps independently of Vercel.
