import assert from "node:assert/strict";
import test from "node:test";
import { listingCategoryOptions } from "../src/lib/admin-categories";
import type { Category } from "../src/types";

const categories: Category[] = [
  {
    id: 1,
    name: "Coding",
    slug: "coding",
    description: "Code-heavy resources",
    prompt: "Use for coding.",
    sortOrder: 1
  },
  {
    id: 2,
    name: "Productivity",
    slug: "productivity",
    description: "Workflow resources",
    prompt: "Use for productivity.",
    sortOrder: 2
  },
  {
    id: 3,
    name: "MCP",
    slug: "mcp",
    description: "Protocol servers",
    prompt: "Use for MCP.",
    sortOrder: 3
  },
  {
    id: 4,
    name: "Prompts",
    slug: "prompts",
    description: "Prompt packs",
    prompt: "Use for prompts.",
    sortOrder: 4
  }
];

test("listingCategoryOptions includes every available category", () => {
  const options = listingCategoryOptions(categories);

  assert.deepEqual(
    options.map((category) => category.slug),
    ["coding", "productivity", "mcp", "prompts"]
  );
});
