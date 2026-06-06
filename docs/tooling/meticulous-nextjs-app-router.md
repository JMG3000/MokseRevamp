# Meticulous Setup - Next.js App Router

MokseRevamp uses the Next.js App Router.

Local routing shape:

- `app/` exists
- `pages/` does not exist
- `src/app/` does not exist
- `src/pages/` does not exist

Because this repo currently uses route-group layouts instead of one root `app/layout.tsx`, the Meticulous recorder is installed in both layouts:

- `app/(Public Pages)/layout.tsx`
- `app/(Admin Dashboard)/layout.tsx`

## Required Values

- GitHub Actions secret: `METICULOUS_API_TOKEN`
- Browser recorder token: stored in `components/tooling/meticulous-recorder.tsx` per the Meticulous recorder-script setup already provided for this repository.

The recorder script only renders in local development or Vercel preview deployments:

- `process.env.NODE_ENV === "development"`
- `process.env.VERCEL_ENV === "preview"`

It sets `data-is-production-environment="false"` and does not render on the Vercel production deployment from `main`.

## Deterministic Rendering

The route `/programs/stop-the-stigma` has a live countdown, so it now reads Meticulous request headers on the server before rendering:

- `meticulous-is-test`
- `meticulous-simulated-date`

When `meticulous-is-test` is `1`, the countdown is frozen using the simulated date. If the simulated date is missing or malformed, the app falls back to a fixed RFC 7231 date so screenshot diffs stay deterministic.

The tabbed `/programs` client view imports the countdown content component directly. In CI, `NEXT_PUBLIC_METICULOUS_DETERMINISTIC=1` freezes that embedded tab view to the same fixed date, while normal production/client behavior remains live.

Implementation files:

```text
lib/meticulous.ts
app/(Public Pages)/(Programs)/programs/stop-the-stigma/page.tsx
app/(Public Pages)/(Programs)/programs/stop-the-stigma/stop-the-stigma-content.tsx
```

## Companion Assets

The GitHub Actions workflow copies static Next.js assets after `npm run build` so Meticulous cloud compute can resolve `_next/static` files:

```yaml
- name: Prepare companion assets
  run: |
    mkdir -p companion-assets/_next
    cp -r .next/static companion-assets/_next/
    ls -la companion-assets
    ls -la companion-assets/_next/static | head
```

The Meticulous action is configured with:

```yaml
companion-assets-folder: "companion-assets"
companion-assets-regex: "^/_next/static/"
```

## Meticulous Project Setting

In the Meticulous dashboard, set Network Stubbing to:

`Stub all requests, apart from requests for server components and static assets`

This is required for Next.js App Router server component requests.
