# Netlify Deployment

SkillMarket is a Next.js App Router app. Netlify supports App Router, Server Components, Server Actions, Route Handlers, SSR, and ISR through its maintained OpenNext adapter.

## Build Settings

Use the checked-in `netlify.toml`:

- Build command: `npm run db:seed && npm run build`
- Publish directory: `.next`
- Node version: `22`

The seed command creates `data/skillmarket.db` before `next build`; `next.config.ts` includes that file in the server output trace so deployed route handlers can read the seeded catalog.

## Environment Variables

Set these in Netlify Site configuration, not in source control:

| Variable | Required | Notes |
| --- | --- | --- |
| `SKILLMARKET_ADMIN_PASSWORD` | Yes | Use a long random value. Production refuses to use the local `admin` fallback. |
| `TELEGRAM_BOT_TOKEN` | Yes for webhook replies | Rotate the previously shared token before setting this. |
| `TELEGRAM_BOT_USERNAME` | No | Defaults to `skillmarket_bot`. |
| `SKILLMARKET_READONLY_DB` | Recommended | Set to `1` on Netlify until persistent storage is added. |
| `SKILLMARKET_DB_PATH` | No | Defaults to `data/skillmarket.db`. |
| `NETLIFY_NEXT_SKEW_PROTECTION` | Recommended | Set to `true`; also present in `netlify.toml`. |

## Telegram Webhook

After deploy, set the webhook with the rotated token:

```bash
curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook?url=https://YOUR_NETLIFY_DOMAIN/api/telegram"
```

Verify listing resolution:

```bash
curl "https://YOUR_NETLIFY_DOMAIN/api/telegram?slug=frontend-app-builder"
```

## SQLite Production Caveat

The current MVP uses a seeded SQLite file through `sql.js`. This is suitable for a Netlify preview/catalog deployment, but Netlify serverless functions do not provide durable writable application storage for this database file.

With `SKILLMARKET_READONLY_DB=1`, the site serves seeded listings and avoids write failures. Admin content changes and analytics writes are not durable in this mode.

Before treating admin edits or analytics as production data, migrate persistence to a durable service such as Netlify Database, Neon, Turso/libSQL, Supabase Postgres, or Netlify Blobs with a concurrency-safe data model.

## Verification Commands

```bash
npm install
npm run db:seed
npm run build
```

Local smoke test:

```bash
npm run dev
curl "http://localhost:3000/api/telegram?slug=frontend-app-builder"
```
