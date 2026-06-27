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
    name: "Creativity",
    slug: "creativity",
    description: "Creative resources",
    prompt: "Use for creativity.",
    sortOrder: 3
  },
  {
    id: 4,
    name: "Automation",
    slug: "automation",
    description: "Automation resources",
    prompt: "Use for automation.",
    sortOrder: 4
  },
  {
    id: 5,
    name: "Content",
    slug: "content",
    description: "Content resources",
    prompt: "Use for content.",
    sortOrder: 5
  },
  {
    id: 6,
    name: "MCP",
    slug: "mcp",
    description: "Protocol servers",
    prompt: "Use for MCP.",
    sortOrder: 6
  }
];

test("listingCategoryOptions follows the landing page category order", () => {
  const options = listingCategoryOptions(categories);

  assert.deepEqual(
    options.map((category) => category.slug),
    ["coding", "productivity", "creativity", "automation", "content"]
  );
});
