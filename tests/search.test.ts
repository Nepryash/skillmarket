import assert from "node:assert/strict";
import test from "node:test";
import { rankListingsBySearch } from "../src/lib/search";
import type { Listing } from "../src/types";

function listing(overrides: Partial<Listing> & Pick<Listing, "id" | "title" | "slug" | "description">): Listing {
  return {
    type: "skill",
    icon: "tabler:box",
    categoryId: 1,
    categoryName: "Coding",
    categorySlug: "coding",
    compatibility: "both",
    installUrl: "",
    githubUrl: "",
    status: "published",
    featured: false,
    labels: [],
    commands: [],
    bullets: [],
    prompt: "",
    createdAt: "2026-06-01T00:00:00.000Z",
    updatedAt: "2026-06-01T00:00:00.000Z",
    ...overrides
  };
}

const listings: Listing[] = [
  listing({
    id: 1,
    title: "React Best Practices",
    slug: "react-best-practices",
    description: "Frontend component structure for modern apps.",
    labels: [{ id: 1, name: "React", slug: "react", color: "#FBFF12" }]
  }),
  listing({
    id: 2,
    title: "Netlify Deploy Toolkit",
    slug: "netlify-deploy-toolkit",
    description: "Deploy and configure modern web apps.",
    categoryName: "Plugins",
    categorySlug: "plugins",
    labels: [{ id: 2, name: "Automation", slug: "automation", color: "#80727B" }]
  }),
  listing({
    id: 3,
    title: "Qwen2.5 Coder 7B Instruct",
    slug: "qwen25-coder-7b-instruct",
    description: "A downloadable coding-focused local LM.",
    type: "model",
    categoryName: "Local Models",
    categorySlug: "local-models",
    compatibility: "local_lm",
    labels: [
      { id: 3, name: "Hugging Face", slug: "huggingface", color: "#FBFF12" },
      { id: 4, name: "Code Model", slug: "code-model", color: "#80727B" }
    ],
    commands: [
      {
        id: 1,
        listingId: 3,
        label: "Download",
        command: "huggingface-cli download Qwen/Qwen2.5-Coder-7B-Instruct",
        sortOrder: 1
      }
    ]
  }),
  listing({
    id: 4,
    title: "Launch Prompt Pack",
    slug: "launch-prompt-pack",
    description: "Reusable planning prompts for launch work.",
    type: "prompt",
    categoryName: "Prompts",
    categorySlug: "prompts",
    compatibility: "not_applicable",
    prompt: "Create a concise product brief and implementation plan."
  })
];

test("rankListingsBySearch returns original order for an empty query", () => {
  assert.deepEqual(rankListingsBySearch(listings, "").map((item) => item.slug), [
    "react-best-practices",
    "netlify-deploy-toolkit",
    "qwen25-coder-7b-instruct",
    "launch-prompt-pack"
  ]);
});

test("rankListingsBySearch matches category and label fields", () => {
  assert.deepEqual(rankListingsBySearch(listings, "productivity").map((item) => item.slug), []);
  assert.deepEqual(rankListingsBySearch(listings, "hugging face").map((item) => item.slug), [
    "qwen25-coder-7b-instruct"
  ]);
});

test("rankListingsBySearch matches command text", () => {
  assert.deepEqual(rankListingsBySearch(listings, "huggingface-cli").map((item) => item.slug), [
    "qwen25-coder-7b-instruct"
  ]);
});

test("rankListingsBySearch expands intent synonyms", () => {
  assert.deepEqual(rankListingsBySearch(listings, "deploy").map((item) => item.slug), [
    "netlify-deploy-toolkit"
  ]);

  assert.equal(rankListingsBySearch(listings, "local model")[0]?.slug, "qwen25-coder-7b-instruct");
  assert.equal(rankListingsBySearch(listings, "frontend")[0]?.slug, "react-best-practices");
});

test("rankListingsBySearch ranks title and label matches above description-only matches", () => {
  const ranked = rankListingsBySearch(
    [
      listing({
        id: 10,
        title: "General Web Toolkit",
        slug: "general-web-toolkit",
        description: "Includes React examples in the documentation."
      }),
      listing({
        id: 11,
        title: "React Patterns",
        slug: "react-patterns",
        description: "Component guidance.",
        labels: [{ id: 11, name: "React", slug: "react", color: "#FBFF12" }]
      })
    ],
    "react"
  );

  assert.deepEqual(ranked.map((item) => item.slug), ["react-patterns", "general-web-toolkit"]);
});
