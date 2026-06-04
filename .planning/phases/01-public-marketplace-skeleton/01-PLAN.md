---
phase: 1
name: Public Marketplace Skeleton
status: complete
wave: 1
requirements_addressed: [PUB-01, PUB-02, PUB-03, PUB-04, PUB-05, PUB-06, OPS-01]
---

# Phase 1 Plan: Public Marketplace Skeleton

## Objective

Build the first working vertical slice of SkillMarket: a Next.js app with seeded marketplace data, public landing/browse UI, search/filter controls, listing detail pages, and local development commands.

## Tasks

- [x] Scaffold a Next.js TypeScript app with App Router.
- [x] Add typed marketplace seed data and query helpers.
- [x] Build shared UI components for listings, filters, command blocks, and compatibility/type labels.
- [x] Build the homepage with hero, featured listings, search entry, and category preview.
- [x] Build the marketplace browse page with search and filters.
- [x] Build listing detail pages.
- [x] Add local verification scripts and run build.

## Verification

- [x] `npm run build` passes.
- [x] Homepage renders seeded featured listings.
- [x] Browse page filters by query, type, compatibility, category, and labels.
- [x] Detail page shows install URL, GitHub URL, commands, labels, and compatibility.
- [x] UI uses approved palette.

Verified on 2026-06-02.
