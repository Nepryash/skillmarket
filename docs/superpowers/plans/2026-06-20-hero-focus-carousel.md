# Hero Focus Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add synchronized changing hero text and an interactive six-task focus carousel to the Skillhub landing page.

**Architecture:** A focused client component owns the active task index, autoplay timer, pause state, and static task content. The server-rendered homepage embeds the component, while existing global CSS supplies the visual transitions and reduced-motion fallback.

**Tech Stack:** Next.js App Router, React 19, TypeScript, CSS, Node test runner.

---

### Task 1: Define carousel behavior with tests

**Files:**
- Create: `tests/hero-focus-carousel.test.tsx`
- Create: `src/components/hero-focus-carousel.tsx`

- [x] Write failing tests for the six phrases, circular previous/next selection, and rendered command content.
- [x] Run `npm test` and confirm failure because the carousel module is absent.
- [x] Add the typed task data, circular index helper, and minimal component markup.
- [x] Run `npm test` and confirm the new behavior passes.

### Task 2: Integrate the synchronized hero experience

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`
- Modify: `tests/landing-motion.test.ts`

- [x] Update the landing source test to require the animated headline and focus-carousel hooks.
- [x] Run `npm test` and confirm the landing test fails against the old grid.
- [x] Replace the static headline and ambient-console markup with `HeroFocusCarousel`.
- [x] Add three-position card styling, phrase transitions, staggered command reveals, focus states, responsive behavior, and reduced-motion rules.
- [x] Remove obsolete result-floating and unsynchronized terminal-line animation selectors.
- [x] Run `npm test` and confirm all tests pass.

### Task 3: Verify production behavior

**Files:**
- Verify only; no planned source additions.

- [x] Run `npm test` and require zero failures.
- [x] Run `npm run build` and require a successful production build and type check.
- [x] Review the homepage at desktop and mobile widths, including autoplay and responsive behavior.
- [x] Inspect `git diff` to confirm only the planned landing-carousel changes and pre-existing user changes remain.
