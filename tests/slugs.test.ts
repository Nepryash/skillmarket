import assert from "node:assert/strict";
import test from "node:test";
import { findBySlug, normalizeSlug } from "../src/lib/slugs";

test("normalizeSlug converts human-entered text into a canonical slug", () => {
  assert.equal(normalizeSlug(" Personal Helper "), "personal-helper");
  assert.equal(normalizeSlug("Personal   Helper!"), "personal-helper");
  assert.equal(normalizeSlug("personal_helper"), "personal-helper");
});

test("findBySlug matches legacy stored slugs after normalization", () => {
  const items = [
    { slug: "personal helper" },
    { slug: "frontend-app-builder" }
  ];

  assert.equal(findBySlug(items, "personal-helper")?.slug, "personal helper");
  assert.equal(findBySlug(items, "frontend app builder")?.slug, "frontend-app-builder");
});
