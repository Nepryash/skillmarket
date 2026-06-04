---
phase: 2
name: Admin Content Management
status: complete
wave: 1
requirements_addressed: [CMS-01, CMS-02, CMS-03, CMS-04, CMS-05]
---

# Phase 2 Plan: Admin Content Management

## Objective

Add the curated-catalog admin surface: single-password login, protected admin routes, listing create/edit/archive, category management, label management, and repeatable command rows.

## Tasks

- [x] Add single-admin password session.
- [x] Protect admin routes.
- [x] Add listing create/edit/archive forms.
- [x] Add category create/edit forms.
- [x] Add label create/edit forms.
- [x] Persist admin changes to the local SQLite database.
- [x] Verify production build and localhost admin routes.

## Verification

- [x] `npm run build` passes.
- [x] Unauthenticated `/admin` redirects to login.
- [x] Admin can log in with configured password.
- [x] Admin can edit a listing and manage commands.
- [x] Admin can manage categories and labels.
