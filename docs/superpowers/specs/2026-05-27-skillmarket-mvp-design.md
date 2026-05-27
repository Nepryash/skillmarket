# SkillMarket MVP Design

## Summary

SkillMarket v1 is a free, curated marketplace for Claude Code and Codex skills and plugins. It launches as a polished public catalog with a modern landing page, searchable listings, Telegram handoff for install instructions, admin-managed content, and marketplace analytics.

The v1 implementation follows the Fast Catalog MVP approach. It should keep future iterations in mind, especially paid listings, creator submissions, videos, and richer plugin pages, but those features are out of scope for the first launch.

## Product Scope

The public site lists skills and plugins as separate item types. Visitors can browse, search, filter, open detail pages, and use install or Telegram handoff actions without logging in.

Each listing includes:

- title
- short description
- listing type: skill or plugin
- category
- labels
- compatibility: Claude Code, Codex, or both
- install link
- GitHub/source link when available
- basic commands

The homepage combines a catching landing page with immediate marketplace usefulness. The first viewport should include a strong hero, prominent search, and featured skills/plugins.

Out of scope for v1:

- visitor accounts
- creator submissions
- payments
- reviews
- favorites
- file/package delivery through Telegram
- video tutorial pages
- long-form documentation pages

## UI Direction

The UI should feel like a modern developer marketplace rather than a generic SaaS landing page. It should be polished, sharp, practical, and readable.

Primary palette:

- background: `#0C0F0A`
- accent: `#FBFF12`
- secondary neutral: `#80727B`
- foreground: `#FFFFFF`

Public UI requirements:

- landing hero with subtle motion or lightweight 3D effect
- clear Claude Code and Codex positioning
- featured marketplace listings visible immediately
- category chips
- compatibility filters
- listing type filters
- direct Telegram call-to-action
- short practical listing detail pages

Admin UI requirements:

- utilitarian dashboard layout
- protected admin area
- sidebar navigation
- listing manager
- category and label management
- analytics dashboard
- repeatable command rows inside the listing editor

Motion and 3D should support the landing page impression only. The admin panel should remain quiet, dense, and operational.

## Architecture

SkillMarket v1 is a Next.js full-stack app using the App Router.

Main route groups:

- public landing page
- marketplace browse page
- listing detail pages
- admin login
- admin listings
- admin categories and labels
- admin analytics
- API/server routes for analytics and Telegram handoff

Main modules:

- Marketplace module: listing queries, filters, search, featured listings.
- Admin module: single-admin login, content CRUD, archive workflow.
- Analytics module: event recording and aggregation.
- Telegram module: website handoff to bot, selected listing install response.
- Persistence module: SQLite-backed local database through a typed ORM.

Vercel is the first deployment target. Local development uses SQLite. Production deployment must document the database caveat: a local SQLite file is not reliable as persistent storage in serverless deployment, so production should use a hosted SQLite-compatible service or migrate later.

## Data Model

Core entities:

### listings

Stores both skill and plugin listings.

Fields:

- id
- type: `skill` or `plugin`
- title
- slug
- description
- category_id
- compatibility: `claude_code`, `codex`, or `both`
- install_url
- github_url
- status: `draft`, `published`, or `archived`
- featured flag
- created_at
- updated_at

### categories

Fields:

- id
- name
- slug
- description
- sort_order

### labels

Fields:

- id
- name
- slug
- color

### listing_labels

Many-to-many relation between listings and labels.

Fields:

- listing_id
- label_id

### commands

Stores repeatable commands for a listing.

Fields:

- id
- listing_id
- label
- command
- sort_order

### analytics_events

Stores anonymous marketplace events.

Fields:

- id
- event_type
- listing_id when relevant
- path
- referrer
- search_query when relevant
- anonymous_session_id
- metadata_json
- created_at

Important event types:

- `page_view`
- `listing_view`
- `install_click`
- `telegram_click`
- `search`
- `search_no_results`

Admin authentication is single-admin only in v1. The admin password is provided through environment variables and protected by a signed session cookie.

## User Flows

### Visitor Browse Flow

1. Visitor lands on the homepage.
2. Visitor sees the hero, search, and featured listings.
3. Visitor browses marketplace listings.
4. Visitor filters by category, label, type, and compatibility.
5. Visitor opens a listing detail page.
6. Visitor copies or follows install links and commands.
7. Analytics records listing views and click actions.

### Telegram Handoff Flow

1. Visitor clicks "Get via Telegram" on a listing.
2. Website records a `telegram_click` analytics event.
3. Visitor is sent to the Telegram bot with selected listing context.
4. Bot responds with install link, GitHub/source link, and commands for that listing.

Telegram does not browse the full marketplace in v1. The website is the discovery interface.

### Admin Content Flow

1. Admin logs in with the configured admin password.
2. Admin creates or edits listings.
3. Admin assigns category, labels, compatibility, install links, and commands.
4. Admin publishes or archives listings.
5. Public marketplace reflects published listing changes.

### Admin Analytics Flow

1. Admin opens analytics dashboard.
2. Dashboard shows page views, listing views, install clicks, Telegram clicks, top listings, top categories, top labels, search terms, and no-result searches.
3. Admin uses this data to decide what content to add or improve.

## Testing Strategy

Unit tests:

- listing filtering
- listing search
- slug handling
- analytics aggregation helpers

Integration tests:

- admin authentication guard
- listing CRUD
- category and label CRUD
- analytics event recording
- Telegram handoff route

End-to-end tests:

- browse marketplace
- filter/search listings
- open detail page
- trigger install click tracking
- trigger Telegram click tracking
- log in as admin
- create or edit a listing

Manual checks:

- homepage responsive layout
- text fitting on listing cards
- contrast using the approved palette
- admin form usability
- Vercel deployment documentation accuracy

## Launch Definition

V1 is launch-ready when:

- the app runs locally with SQLite
- seeded sample listings exist for Claude Code and Codex skills/plugins
- public marketplace search and filters work
- listing detail pages show core install information
- admin login works
- admin can manage listings, categories, labels, links, and commands
- analytics events are recorded
- admin dashboard displays marketplace statistics
- Telegram handoff sends selected listing install information
- environment variables are documented
- Vercel deployment steps are documented
- production database caveat is clearly documented

## Future Iterations

Future phases may add:

- hosted production database migration
- payment support
- premium listing flags
- creator accounts
- creator submission and approval queue
- richer documentation pages
- video tutorials
- reviews and ratings
- favorites or saved listings
- full Telegram marketplace browsing
- direct package/file delivery

These features should not be implemented in v1.
