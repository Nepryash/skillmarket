---
phase: 4
name: Deployment And Hardening
status: complete
wave: 1
requirements_addressed: [OPS-02, OPS-03]
---

# Phase 4 Plan: Deployment And Hardening

## Objective

Make the MVP deployable on Vercel with documented environment variables, build settings, local commands, Telegram webhook setup, and production database limitations.

## Tasks

- [x] Add Vercel build configuration.
- [x] Document required environment variables.
- [x] Document Vercel deployment and Telegram webhook setup.
- [x] Add production guard against default admin password.
- [x] Document SQLite production caveat and read-only Vercel mode.
- [x] Verify seed, lint, and production build commands.

## Verification

- [x] `npm run db:seed` passes.
- [x] `npm run lint` passes.
- [x] `npm run build` passes.
- [x] Production build includes Vercel routes and API handlers.
- [x] Documentation identifies required secrets and database caveat.
