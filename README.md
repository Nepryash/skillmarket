# SkillMarket

Curated marketplace for Claude Code and Codex skills, plugins, and local models.

## Local Development

Install dependencies:

```bash
npm install
```

Create the local SQLite database:

```bash
npm run db:seed
```

Start the app:

```bash
npm run dev
```

If port `3000` is already occupied:

```bash
npm run dev -- -p 3100
```

Build check:

```bash
npm run build
```

## Environment

Copy `.env.example` for local secrets when needed:

```bash
Copy-Item .env.example .env.local
```

Important variables:

- `SKILLMARKET_ADMIN_PASSWORD`: required in production.
- `TELEGRAM_BOT_TOKEN`: required for Telegram webhook replies.
- `TELEGRAM_BOT_USERNAME`: optional, defaults to `skillmarket_bot`.
- `SKILLMARKET_READONLY_DB`: set to `1` on Netlify until durable database storage is added.

## Netlify Deployment

This repo includes `netlify.toml`.

Netlify build settings:

- Build command: `npm run db:seed && npm run build`
- Publish directory: `.next`
- Node version: `22`

Full deployment notes are in `docs/deployment-netlify.md`.

## Notes

Phase 1 uses `sql.js` to create and read a real SQLite database file at `data/skillmarket.db` without requiring native SQLite compilation on Windows.

Netlify preview deployment can serve the seeded SQLite database in read-only mode. Admin edits and analytics writes need a durable database before production use.
