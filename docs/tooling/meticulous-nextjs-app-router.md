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
- GitHub Actions repository variable or deployment env var: `NEXT_PUBLIC_METICULOUS_PROJECT_ID`

The recorder script only renders when `NEXT_PUBLIC_METICULOUS_PROJECT_ID` is set.

## Meticulous Project Setting

In the Meticulous dashboard, set Network Stubbing to:

`Stub all requests, apart from requests for server components and static assets`

This is required for Next.js App Router server component requests.