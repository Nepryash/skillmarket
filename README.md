# SkillMarket

Curated marketplace for Claude Code and Codex skills, plugins, and local models.

## Local Development

Install dependencies:

```bash
npm install
```

Seed Supabase with the current catalog:

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
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: public Supabase key used by server-side read queries.
- `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_SECRET_KEY`: server-only key used for admin writes, seeding, and analytics writes.

## Deployment

### Vercel

This repo includes `vercel.json` for the current deployment target.

Vercel build settings:

- Build command: `npm run build`
- Install command: `npm install`
- Dev command: `next dev`
- Node version: `22.x`

Full deployment notes are in `docs/deployment-vercel.md`.

#### Quick Deploy

```bash
npm i -g vercel
vercel
```

Or connect your GitHub repo at https://vercel.com/import

## Notes

SkillMarket now uses Supabase Postgres for persistence. The local seed script populates the remote tables with the curated catalog.

Keep `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_SECRET_KEY` server-side only. The browser should only ever see `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
