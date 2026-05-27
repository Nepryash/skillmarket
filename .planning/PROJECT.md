# SkillMarket

## What This Is

SkillMarket is a free, curated marketplace for Claude Code and Codex skills and plugins. It helps developers discover useful skills/plugins, understand what they do, and get install links or commands through the website and Telegram handoff.

## Core Value

Developers can quickly find a relevant Claude Code or Codex skill/plugin and get the exact install link and basic commands needed to use it.

## Requirements

### Validated

(None yet - ship to validate)

### Active

- [ ] Public visitors can browse a curated marketplace of skills and plugins.
- [ ] Public visitors can search and filter listings by category, label, type, and compatibility.
- [ ] Public visitors can open a short practical detail page with install links and commands.
- [ ] Public visitors can request a selected listing through Telegram handoff.
- [ ] Admin can log in with a single configured password.
- [ ] Admin can create, edit, publish, and archive listings, categories, labels, links, and commands.
- [ ] Admin can view marketplace analytics for traffic, listing interest, clicks, search terms, and no-result searches.
- [ ] The app can run locally with SQLite and has a documented Vercel deployment path.

### Out of Scope

- Visitor accounts - v1 is public browsing only.
- Creator submissions - v1 content is curated by admin.
- Payments - v1 is free and open source.
- Reviews and favorites - not required to validate marketplace discovery.
- File/package delivery through Telegram - v1 sends links and commands only.
- Video tutorials and long-form docs - planned for later iterations.

## Context

The approved design spec is `docs/superpowers/specs/2026-05-27-skillmarket-mvp-design.md`.

The product should feel like a modern developer marketplace. The approved main palette is:

- background: `#0C0F0A`
- accent: `#FBFF12`
- secondary neutral: `#80727B`
- foreground: `#FFFFFF`

The user wants Superpowers for planning and GSD for execution. Vercel is the first deployment target, with the understanding that database persistence may need a hosted SQLite-compatible service or later database change.

## Constraints

- **Tech stack**: Next.js App Router - chosen for full-stack app, admin routes, API routes, and Vercel fit.
- **Database**: SQLite locally - simple MVP persistence, with production caveat documented.
- **Authentication**: Single admin password only - avoids visitor accounts and roles in v1.
- **Telegram**: Website handoff only - the website owns discovery; Telegram returns selected listing install info.
- **Scope**: Fast Catalog MVP - keep Approach 2 extension points in mind, but do not implement paid listings, creator submissions, videos, or rich docs in v1.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Launch as curated catalog | Fastest path to usable marketplace | Pending |
| Track skills and plugins as separate listing types | Keeps both discoverable without forcing a plugin-only model | Pending |
| Use hybrid browse model | Main categories by domain plus filters for type, compatibility, and labels | Pending |
| Keep v1 free/open source | Payments are future scope | Pending |
| Admin-only login | Visitors should browse without accounts | Pending |
| Use Vercel first | Good Next.js deployment path and free Hobby plan for early use | Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

After each phase transition:

1. Requirements invalidated move to Out of Scope with reason.
2. Requirements validated move to Validated with phase reference.
3. New requirements are added to Active.
4. New decisions are added to Key Decisions.

---
*Last updated: 2026-05-27 after GSD initialization*
