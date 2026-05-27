# Requirements: SkillMarket

**Defined:** 2026-05-27
**Core Value:** Developers can quickly find a relevant Claude Code or Codex skill/plugin and get the exact install link and basic commands needed to use it.

## v1 Requirements

### Public Marketplace

- [ ] **PUB-01**: Visitor can view a landing page that clearly positions SkillMarket as a Claude Code and Codex skill/plugin marketplace.
- [ ] **PUB-02**: Visitor can browse published skill and plugin listings.
- [ ] **PUB-03**: Visitor can search listings by text query.
- [ ] **PUB-04**: Visitor can filter listings by category, label, listing type, and compatibility.
- [ ] **PUB-05**: Visitor can open a listing detail page with description, labels, compatibility, install link, GitHub/source link, and commands.
- [ ] **PUB-06**: Visitor can use install and Telegram actions from listings.

### Content Management

- [ ] **CMS-01**: Admin can log in with a configured admin password.
- [ ] **CMS-02**: Admin can create and edit skill/plugin listings.
- [ ] **CMS-03**: Admin can publish, draft, and archive listings.
- [ ] **CMS-04**: Admin can manage categories and labels.
- [ ] **CMS-05**: Admin can manage repeatable command rows for each listing.

### Analytics

- [ ] **ANL-01**: System records page views and listing views anonymously.
- [ ] **ANL-02**: System records install-link clicks and Telegram handoff clicks.
- [ ] **ANL-03**: System records search terms and no-result searches.
- [ ] **ANL-04**: Admin can view top listings, top categories, top labels, click counts, and search terms.

### Telegram

- [ ] **TEL-01**: Visitor can click a listing-specific Telegram handoff link.
- [ ] **TEL-02**: Telegram endpoint can resolve selected listing context and return install links and commands.

### Operations

- [ ] **OPS-01**: App runs locally with SQLite-backed seed data.
- [ ] **OPS-02**: Project documents required environment variables.
- [ ] **OPS-03**: Project documents Vercel deployment steps and production database caveat.

## v2 Requirements

### Marketplace Expansion

- **MKT-01**: Creator can submit a skill/plugin for review.
- **MKT-02**: Admin can approve or reject creator submissions.
- **MKT-03**: Listing can be marked premium or paid.
- **MKT-04**: Listing can include video tutorial blocks.
- **MKT-05**: Visitor can save favorite listings.
- **MKT-06**: Visitor can review or rate listings.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Visitor accounts | Not needed for public browsing MVP |
| Payments | User wants free/open-source launch first |
| Creator submissions | Curated catalog is faster and lower risk |
| Direct Telegram file delivery | Links and commands are enough for v1 |
| Long-form docs and videos | Future iteration after catalog proves useful |
| Full Telegram browsing | Website remains the discovery interface in v1 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| PUB-01 | Phase 1 | Pending |
| PUB-02 | Phase 1 | Pending |
| PUB-03 | Phase 1 | Pending |
| PUB-04 | Phase 1 | Pending |
| PUB-05 | Phase 1 | Pending |
| PUB-06 | Phase 1 | Pending |
| CMS-01 | Phase 2 | Pending |
| CMS-02 | Phase 2 | Pending |
| CMS-03 | Phase 2 | Pending |
| CMS-04 | Phase 2 | Pending |
| CMS-05 | Phase 2 | Pending |
| ANL-01 | Phase 3 | Pending |
| ANL-02 | Phase 3 | Pending |
| ANL-03 | Phase 3 | Pending |
| ANL-04 | Phase 3 | Pending |
| TEL-01 | Phase 3 | Pending |
| TEL-02 | Phase 3 | Pending |
| OPS-01 | Phase 1 | Pending |
| OPS-02 | Phase 4 | Pending |
| OPS-03 | Phase 4 | Pending |

**Coverage:**

- v1 requirements: 20 total
- Mapped to phases: 20
- Unmapped: 0

---
*Requirements defined: 2026-05-27*
*Last updated: 2026-05-27 after GSD initialization*
