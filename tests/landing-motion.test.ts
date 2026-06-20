import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const pageSource = readFileSync("src/app/page.tsx", "utf8");
const cssSource = readFileSync("src/app/globals.css", "utf8");

test("homepage delegates the hero to the synchronized focus carousel", () => {
  assert.match(pageSource, /import \{ HeroFocusCarousel \}/);
  assert.match(pageSource, /<HeroFocusCarousel telegramUrl=\{telegramUrl\} \/>/);
  assert.doesNotMatch(pageSource, /className="console-results"/);
  assert.doesNotMatch(pageSource, /data-step="install"/);
});

test("landing motion CSS includes focus transitions and reduced-motion fallbacks", () => {
  assert.match(cssSource, /@keyframes headline-change/);
  assert.match(cssSource, /@keyframes command-arrive/);
  assert.match(cssSource, /\.focus-carousel-track/);
  assert.match(cssSource, /\.focus-task-card\.active/);
  assert.match(cssSource, /@keyframes chip-signal/);
  assert.match(cssSource, /prefers-reduced-motion: reduce/);
  assert.match(cssSource, /\.hero-changing-text/);
  assert.doesNotMatch(cssSource, /@keyframes result-float/);
});
