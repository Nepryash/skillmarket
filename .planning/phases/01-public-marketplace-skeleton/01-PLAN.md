---
phase: 1
name: Public Marketplace Skeleton
status: ready
wave: 1
requirements_addressed: [PUB-01, PUB-02, PUB-03, PUB-04, PUB-05, PUB-06, OPS-01]
---

# Phase 1 Plan: Public Marketplace Skeleton

## Objective

Build the first working vertical slice of SkillMarket: a Next.js app with seeded marketplace data, public landing/browse UI, search/filter controls, listing detail pages, and local development commands.

## Tasks

- [ ] Scaffold a Next.js TypeScript app with App Router.
- [ ] Add typed marketplace seed data and query helpers.
- [ ] Build shared UI components for listings, filters, command blocks, and compatibility/type labels.
- [ ] Build the homepage with hero, featured listings, search entry, and category preview.
- [ ] Build the marketplace browse page with search and filters.
- [ ] Build listing detail pages.
- [ ] Add local verification scripts and run build.

## Verification

- `npm run build` passes.
- Homepage renders seeded featured listings.
- Browse page filters by query, type, compatibility, category, and labels.
- Detail page shows install URL, GitHub URL, commands, labels, and compatibility.
- UI uses approved palette.
