# Vercel Deployment

Vercel is the current deployment target for SkillMarket.

SkillMarket is a Next.js App Router app with full Vercel support, including Server Components, Server Actions, Route Handlers, SSR, and ISR.

## Build Settings

Use the checked-in `vercel.json`:

- Build command: `npm run build`
- Install command: `npm install`
- Dev command: `next dev`
- Node version: `22.x`

The app uses Supabase Postgres for persistence. Seed the tables with `npm run db:seed` after configuring your Supabase environment variables.

## Environment Variables

Set these in Vercel Project Settings -> Environment Variables, not in source control:

| Variable | Required | Notes |
| --- | --- | --- |
| `SKILLMARKET_ADMIN_PASSWORD` | Yes | Use a long random value. Production refuses to use the local `admin` fallback. |
| `TELEGRAM_BOT_TOKEN` | Yes for webhook replies | Rotate the previously shared token before setting this. |
| `TELEGRAM_BOT_USERNAME` | No | Defaults to `skillmarket_bot`. |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public key used for read queries. |
| `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_SECRET_KEY` | Yes for writes | Keep server-side only. Used by admin actions, analytics writes, and seeding. |

## Telegram Webhook

After deploy, set the webhook with the rotated token:

```bash
curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook?url=https://YOUR_VERCEL_DOMAIN/api/telegram"
```

Verify listing resolution:

```bash
curl "https://YOUR_VERCEL_DOMAIN/api/telegram?slug=frontend-app-builder"
```

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase-schema.sql` in the Supabase SQL editor.
3. Set the environment variables above in Vercel and locally.
4. Run `npm run db:seed` once to load the curated catalog into Supabase.

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

1. Push code to GitHub, GitLab, or Bitbucket.
2. Import the project at https://vercel.com/import.
3. Vercel will auto-detect the Next.js configuration.
4. Add environment variables in Project Settings.
5. Deploy.

### Post-Deploy Checklist

- [ ] Verify the Supabase tables contain the seeded catalog.
- [ ] Test marketplace at `/marketplace`.
- [ ] Test admin login at `/admin/login` with `SKILLMARKET_ADMIN_PASSWORD`.
- [ ] Set Telegram webhook using the command above.
- [ ] Test Telegram API endpoint: `/api/telegram?slug=frontend-app-builder`.
- [ ] Monitor analytics at `/admin/analytics`.

## Security Headers

Vercel applies security headers defined in `vercel.json`:

- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer leakage
