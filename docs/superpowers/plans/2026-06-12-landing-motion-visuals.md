# Landing Motion Visuals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved Ambient Console Journey motion layer for the SkillMarket landing page.

**Architecture:** Keep the current Next.js homepage structure and add semantic hero markup for animated console/results content. Use CSS-first transforms, opacity, staggered keyframes, and the existing scroll reveal system, with `prefers-reduced-motion` fallbacks.

**Tech Stack:** Next.js App Router, React server components, TypeScript, CSS keyframes, Node test runner.

---

## File Structure

- Modify `src/app/page.tsx`: evolve the existing `.hero-visual` markup into a static-first animated console/results scene.
- Modify `src/app/globals.css`: add hero console/result styling, loop animations, section continuity refinements, mobile rules, and reduced-motion overrides.
- Create `tests/landing-motion.test.ts`: source-level regression test for motion hooks and reduced-motion fallback.

## Task 1: Add Landing Motion Regression Test

**Files:**
- Create: `tests/landing-motion.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const pageSource = readFileSync("src/app/page.tsx", "utf8");
const cssSource = readFileSync("src/app/globals.css", "utf8");

test("homepage includes ambient console journey hooks", () => {
  assert.match(pageSource, /className="hero-visual parallax-stage ambient-console"/);
  assert.match(pageSource, /className="console-results"/);
  assert.match(pageSource, /className="console-chip-row"/);
  assert.match(pageSource, /data-step="install"/);
});

test("landing motion CSS includes loop animations and reduced-motion fallbacks", () => {
  assert.match(cssSource, /@keyframes console-type/);
  assert.match(cssSource, /@keyframes result-float/);
  assert.match(cssSource, /@keyframes chip-signal/);
  assert.match(cssSource, /prefers-reduced-motion: reduce/);
  assert.match(cssSource, /\.ambient-console/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm.cmd test -- tests/landing-motion.test.ts`

Expected: FAIL because `ambient-console`, `console-results`, and new keyframes are not implemented.

## Task 2: Implement Hero Ambient Console Markup

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace the existing hero visual markup**

Use this structure inside the existing `<div className="hero-visual parallax-stage" aria-hidden="true">` location:

```tsx
<div className="hero-visual parallax-stage ambient-console" aria-hidden="true">
  <div className="hero-orbit" />
  <div className="console-results">
    <div className="console-result-card result-primary">
      <span>Skill</span>
      <strong>frontend-app-builder</strong>
      <p>Build Web Apps</p>
    </div>
    <div className="console-result-card result-secondary">
      <span>MCP</span>
      <strong>browser</strong>
      <p>Test localhost flows</p>
    </div>
    <div className="console-result-card result-tertiary">
      <span>Model</span>
      <strong>Qwen Coder</strong>
      <p>Local coding LM</p>
    </div>
  </div>
  <div className="console-chip-row">
    <span>Claude Code</span>
    <span>Codex</span>
    <span>MCP</span>
    <span>Prompt</span>
    <span>Repo</span>
  </div>
  <div className="terminal-card">
    <div className="terminal-line" data-step="search">
      <strong>$</strong>
      <span>skillmarket search "landing animation"</span>
    </div>
    <div className="terminal-line" data-step="filter">
      <strong>$</strong>
      <span>filter --compat codex --type skill</span>
    </div>
    <div className="terminal-line" data-step="inspect">
      <strong>$</strong>
      <span>open frontend-app-builder</span>
    </div>
    <div className="terminal-line" data-step="install">
      <strong>$</strong>
      <span>copy install command</span>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Run targeted test**

Run: `npm.cmd test -- tests/landing-motion.test.ts`

Expected: still FAIL because CSS keyframes are not implemented yet.

## Task 3: Implement CSS Motion System

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add motion token variables**

Add to `:root`:

```css
  --motion-slow: 7.5s;
  --motion-medium: 4.8s;
  --motion-stagger: 120ms;
```

- [ ] **Step 2: Add hero console/result CSS**

Add styles for `.ambient-console`, `.console-results`, `.console-result-card`, `.console-chip-row`, enhanced `.terminal-line[data-step]`, and these keyframes:

```css
@keyframes console-type { ... }
@keyframes result-float { ... }
@keyframes chip-signal { ... }
@keyframes console-scan { ... }
```

Use transform and opacity only for animated movement. Do not animate layout properties.

- [ ] **Step 3: Add mobile and reduced-motion coverage**

Extend existing media queries so `.console-results` and `.console-chip-row` fit inside the hero visual at `max-width: 900px` and `max-width: 640px`.

Extend the existing `@media (prefers-reduced-motion: reduce)` block to disable animations for:

```css
.ambient-console,
.ambient-console::before,
.console-result-card,
.console-chip-row span,
.terminal-line[data-step]
```

- [ ] **Step 4: Run targeted test**

Run: `npm.cmd test -- tests/landing-motion.test.ts`

Expected: PASS.

## Task 4: Verify Build And Browser

**Files:**
- No code changes unless verification finds a defect.

- [ ] **Step 1: Run project tests**

Run: `npm.cmd test`

Expected: PASS.

- [ ] **Step 2: Run production build**

Run: `npm.cmd run build`

Expected: PASS.

- [ ] **Step 3: Browser check**

Run the local dev server with `npm.cmd run dev`, open the homepage, and check desktop/mobile sizes.

Expected:

- Hero text, search, buttons, and visual do not overlap.
- Console/result scene is visible on desktop.
- Mobile hero keeps terminal lines readable.
- Reduced-motion CSS disables the new animation hooks.
