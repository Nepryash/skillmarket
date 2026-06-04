# Roadmap: SkillMarket

## Progress

| Phase | Status | Goal |
|-------|--------|------|
| Phase 1 | Complete | Build the public marketplace walking skeleton |
| Phase 2 | Complete | Add admin authentication and content management |
| Phase 3 | Complete | Add analytics and Telegram handoff |
| Phase 4 | Complete | Add deployment documentation and hardening |

## Phases

### Phase 1: Public Marketplace Skeleton

**Goal:** Ship a working Next.js app where visitors can browse seeded skills/plugins, search/filter them, and open detail pages.
**Mode:** mvp

**Requirements:** PUB-01, PUB-02, PUB-03, PUB-04, PUB-05, PUB-06, OPS-01

**Success Criteria:**

1. Local app starts and renders a branded landing/marketplace page.
2. Seeded skill and plugin listings are available through a typed data layer.
3. Search and filters work on the public marketplace page.
4. Listing detail pages show install links, GitHub links, labels, compatibility, and commands.
5. The UI uses the approved `#0C0F0A`, `#FBFF12`, `#80727B`, and `#FFFFFF` palette.

### Phase 2: Admin Content Management

**Goal:** Add single-admin login and admin CRUD for listings, categories, labels, and commands.
**Mode:** mvp

**Requirements:** CMS-01, CMS-02, CMS-03, CMS-04, CMS-05

**Success Criteria:**

1. Admin routes require a configured password/session.
2. Admin can create, edit, publish, draft, and archive listings.
3. Admin can manage categories and labels.
4. Admin can manage repeatable command rows per listing.

### Phase 3: Analytics And Telegram Handoff

**Goal:** Track marketplace usage and connect listing-specific Telegram handoff.
**Mode:** mvp

**Requirements:** ANL-01, ANL-02, ANL-03, ANL-04, TEL-01, TEL-02

**Success Criteria:**

1. Anonymous analytics events are recorded for page views, listing views, clicks, and searches.
2. Admin analytics dashboard displays top listings, categories, labels, clicks, and search terms.
3. Telegram handoff links include selected listing context.
4. Telegram endpoint resolves listing context and returns install links and commands.

### Phase 4: Deployment And Hardening

**Goal:** Make the MVP deployable and documented for Vercel while clearly documenting database limitations.
**Mode:** mvp

**Requirements:** OPS-02, OPS-03

**Success Criteria:**

1. Environment variables are documented.
2. Vercel deployment steps are documented.
3. SQLite local development and production database caveat are documented.
4. Build, lint, and seed commands are documented and verified.

---
*Last updated: 2026-06-04 after Phase 4 Vercel verification*
