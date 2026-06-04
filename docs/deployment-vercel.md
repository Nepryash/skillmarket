# Vercel Deployment

SkillMarket is a Next.js App Router app with full Vercel support, including Server Components, Server Actions, Route Handlers, SSR, and ISR.

## Build Settings

Use the checked-in `vercel.json`:

- Build command: `npm run db:seed && npm run build`
- Install command: `npm install`
- Dev command: `next dev`
- Node version: `22.x`

The seed command creates `data/skillmarket.db` before `next build`; `next.config.ts` includes that file in the server output trace so deployed route handlers can read the seeded catalog.

## Environment Variables

Set these in Vercel Project Settings → Environment Variables, not in source control:

| Variable | Required | Notes |
| --- | --- | --- |
| `SKILLMARKET_ADMIN_PASSWORD` | Yes | Use a long random value. Production refuses to use the local `admin` fallback. |
| `TELEGRAM_BOT_TOKEN` | Yes for webhook replies | Rotate the previously shared token before setting this. |
| `TELEGRAM_BOT_USERNAME` | No | Defaults to `skillmarket_bot`. |
| `SKILLMARKET_READONLY_DB` | Recommended | Set to `1` on Vercel until persistent storage is added. |
| `SKILLMARKET_DB_PATH` | No | Defaults to `data/skillmarket.db`. |

## Telegram Webhook

After deploy, set the webhook with the rotated token:

```bash
curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook?url=https://YOUR_VERCEL_DOMAIN/api/telegram"
```

Verify listing resolution:

```bash
curl "https://YOUR_VERCEL_DOMAIN/api/telegram?slug=frontend-app-builder"
```

## SQLite Production Caveat

The current MVP uses a seeded SQLite file through `sql.js`. This is suitable for a Vercel deployment as a preview/catalog, but Vercel serverless functions do not provide durable writable application storage for this database file.

With `SKILLMARKET_READONLY_DB=1`, the site serves seeded listings and avoids write failures. Admin content changes and analytics writes are not durable in this mode.

Before treating admin edits or analytics as production data, migrate persistence to a durable service such as:
- Vercel Postgres
- Neon
- Turso/libSQL
- Supabase Postgres
- PlanetScale
- AWS RDS

## Quick Start

### Local Verification

```bash
npm install
npm run db:seed
npm run build
npm run start
```

Local smoke test:

```bash
curl "http://localhost:3000/api/telegram?slug=frontend-app-builder"
```

### Deploy to Vercel

#### Option 1: Vercel CLI

```bash
npm i -g vercel
vercel
```

#### Option 2: Git Integration

1. Push code to GitHub/GitLab/Bitbucket
2. Import project at https://vercel.com/import
3. Vercel will auto-detect Next.js configuration
4. Add environment variables in Project Settings
5. Deploy

### Post-Deploy Checklist

- [ ] Verify build logs show successful database seed
- [ ] Test marketplace at `/marketplace`
- [ ] Test admin login at `/admin/login` with `SKILLMARKET_ADMIN_PASSWORD`
- [ ] Set Telegram webhook (see section above)
- [ ] Test Telegram API endpoint: `/api/telegram?slug=frontend-app-builder`
- [ ] Monitor analytics at `/admin/analytics`

## Security Headers

Vercel applies security headers defined in `vercel.json`:

- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer leakage
