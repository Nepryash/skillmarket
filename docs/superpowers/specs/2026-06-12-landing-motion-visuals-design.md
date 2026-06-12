# SkillMarket Landing Motion Visuals Design

## Goal

Upgrade the SkillMarket landing page with a hybrid motion system that makes the marketplace feel alive, technical, and useful without turning the page into a video tutorial or heavy marketing site.

The recommended direction is **Ambient Console Journey**: preserve the current centered hero, search, CTAs, and marketplace sections, then add a coherent motion layer that suggests a developer moving from discovery to install.

## Scope

In scope:

- Hero console animation that feels like a living developer workflow.
- Scroll-driven section transitions that connect hero, categories, use cases, and featured listings.
- Small interface animations on listing/category elements where they improve comprehension.
- Reduced-motion fallbacks and static first-paint content.
- Optional tiny video/WebM or image-sequence asset only if CSS cannot deliver one specific effect cleanly.

Out of scope:

- Long-form video tutorials.
- Visitor accounts, reviews, favorites, creator submissions, or paid listings.
- A full landing page redesign.
- Motion that hides or delays primary search and marketplace actions.

## Visual Concept

The page should communicate: "You are one search away from a practical agent tool."

The hero visual becomes a compact command-and-results scene:

- Command lines type in short, recognizable actions.
- Result cards or chips appear as the commands resolve.
- Compatibility/type labels pulse briefly, implying filters are active.
- Install-oriented lines settle into view, but without showing a full tutorial.

The rest of the page continues that same rhythm:

- Category cards enter as grouped resource types.
- Use-case cards reveal as filterable intents.
- Featured listings rise in a controlled sequence that feels like search results becoming available.

## Interaction And Motion Behavior

Hero animation:

- Runs after first paint, with text and controls visible immediately.
- Uses CSS keyframes for typing, cursor blink, chip pulse, card drift, and terminal line reveal.
- Loops softly, avoiding fast flashing or distracting perpetual motion.
- Pauses or simplifies on hover/focus if needed so interactive controls remain calm.

Scroll transitions:

- Use the existing scroll-reveal pattern as the base.
- Strengthen continuity by varying section entrance: categories group in, use cases slide slightly from the left, featured cards resolve upward.
- Keep movement small enough that the page remains scannable.

Optional video asset:

- Only consider a small decorative loop for a texture that CSS cannot express well, such as a subtle command scanline or compressed preview layer.
- It must have a static fallback and must not be required to understand the page.
- It must not present itself as a video tutorial.

## Components

### Hero Ambient Console

The existing `.hero-visual`, `.hero-orbit`, and `.terminal-card` structure can be evolved rather than replaced.

Expected elements:

- Terminal command stack with short commands.
- A compact result layer showing marketplace-style resource cards.
- Label chips for Claude Code, Codex, MCP, Prompt, Plugin, and Repo.
- A subtle install handoff cue, such as a copied command line or Telegram handoff indicator.

### Section Motion System

The current `scroll-scene`, `scroll-reveal`, and `reveal-grid` classes remain the foundation.

Expected additions:

- Motion tokens for duration, easing, stagger, and reduced-motion behavior.
- Section-specific reveal classes where the current generic reveal is too flat.
- No JavaScript dependency unless CSS proves insufficient.

### Asset Fallbacks

Every animated element should render meaningful static content:

- Hero terminal shows useful command examples without animation.
- Result cards/chips remain visible if animation is disabled.
- Section content remains readable with `prefers-reduced-motion: reduce`.

## Data And Content

The visual should use real marketplace language from existing seeded concepts rather than abstract placeholders:

- Claude Code skills
- Codex plugins
- MCP servers
- Prompts
- Local models
- GitHub repositories

Commands should be short and readable. Long commands can appear only in static/detail contexts, not in fast animation.

## Accessibility

- Respect `prefers-reduced-motion: reduce`.
- Avoid rapid flashing, high-frequency cursor effects, or large parallax movement.
- Keep search, CTA buttons, nav, and listing links usable without waiting for animations.
- Preserve color contrast against the approved palette: `#0C0F0A`, `#FBFF12`, `#80727B`, and `#FFFFFF`.

## Performance

- Prefer CSS transforms and opacity over layout-affecting animation.
- Avoid loading a large video on the critical path.
- If a video/WebM is used, lazy-load it or keep it decorative with a static poster.
- Keep first viewport content server-rendered and stable.

## Verification

Implementation should be checked with:

- `npm run lint`
- `npm run build`
- Browser review at desktop and mobile widths.
- Reduced-motion review using browser emulation or OS setting.
- Visual check that hero text, search, buttons, and animated visual do not overlap on mobile.

## Decision

Proceed with **Ambient Console Journey with section continuity**:

- CSS-first animation system.
- Optional tiny video only if it adds something CSS cannot deliver.
- Preserve the current landing layout and marketplace-first purpose.
