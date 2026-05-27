# SkillMarket

Curated marketplace for Claude Code and Codex skills/plugins.

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

## Notes

Phase 1 uses `sql.js` to create and read a real SQLite database file at `data/skillmarket.db` without requiring native SQLite compilation on Windows.

Production deployment on Vercel will need a persistent hosted database path in a later phase. A local SQLite file is suitable for local development, not durable serverless production storage.
