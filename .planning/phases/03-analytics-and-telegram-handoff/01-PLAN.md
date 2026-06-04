---
phase: 3
name: Analytics And Telegram Handoff
status: complete
wave: 1
requirements_addressed: [ANL-01, ANL-02, ANL-03, ANL-04, TEL-01, TEL-02]
---

# Phase 3 Plan: Analytics And Telegram Handoff

## Objective

Track anonymous marketplace usage and connect listing-specific Telegram handoff so admins can see discovery signals and visitors can retrieve listing install details through Telegram context.

## Tasks

- [x] Add anonymous analytics event storage.
- [x] Record page views, listing views, click events, searches, and no-result searches.
- [x] Add tracked install and Telegram redirect links.
- [x] Add protected admin analytics dashboard.
- [x] Add Telegram endpoint that resolves listing context and returns install links and commands.
- [x] Verify production build and core analytics routes.

## Verification

- [x] `npm run build` passes.
- [x] Marketplace search records search analytics.
- [x] Listing detail view records listing analytics.
- [x] Tracked install and Telegram links redirect correctly.
- [x] Admin analytics route requires auth and renders aggregate metrics.
- [x] Telegram endpoint resolves a published listing slug.
