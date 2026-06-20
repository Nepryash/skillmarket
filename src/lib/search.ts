import type { Listing } from "@/types";

type SearchField = {
  text: string;
  weight: number;
};

const intentSynonyms: Array<[trigger: string, expansions: string[]]> = [
  ["frontend", ["ui", "react", "nextjs", "web"]],
  ["deploy", ["vercel", "netlify", "hosting"]],
  ["local model", ["model", "local lm", "huggingface", "hugging face"]],
  ["prompt", ["template", "prompt pack", "instructions"]],
  ["automation", ["workflow", "mcp", "telegram"]]
];

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[_/-]+/g, " ")
    .replace(/[^\p{L}\p{N}\s.]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function termsForQuery(query: string) {
  const normalized = normalize(query);
  if (!normalized) return { phrase: "", terms: [] as string[] };

  const terms = new Set(normalized.split(" ").filter(Boolean));

  for (const [trigger, expansions] of intentSynonyms) {
    if (normalized.includes(trigger)) {
      for (const expansion of expansions) {
        for (const term of normalize(expansion).split(" ").filter(Boolean)) {
          terms.add(term);
        }
      }
    }
  }

  return { phrase: normalized, terms: Array.from(terms) };
}

function listingTypeText(listing: Listing) {
  if (listing.type === "github_repo") return "github repo repository";
  return listing.type;
}

function compatibilityText(listing: Listing) {
  if (listing.compatibility === "claude_code") return "claude code";
  if (listing.compatibility === "local_lm") return "local lm local model";
  if (listing.compatibility === "not_applicable") return "";
  if (listing.compatibility === "both") return "claude code codex";
  return listing.compatibility;
}

function fieldsForListing(listing: Listing): SearchField[] {
  return [
    { text: listing.title, weight: 120 },
    { text: listing.categoryName, weight: 85 },
    { text: listingTypeText(listing), weight: 80 },
    { text: compatibilityText(listing), weight: 70 },
    { text: listing.labels.map((label) => `${label.name} ${label.slug}`).join(" "), weight: 75 },
    { text: listing.description, weight: 35 },
    { text: listing.bullets.map((bullet) => bullet.text).join(" "), weight: 30 },
    { text: listing.prompt, weight: 25 },
    { text: listing.commands.map((command) => command.label).join(" "), weight: 20 },
    { text: listing.commands.map((command) => command.command).join(" "), weight: 15 }
  ];
}

function scoreListing(listing: Listing, query: string) {
  const { phrase, terms } = termsForQuery(query);
  if (!phrase) return 0;

  let score = 0;

  for (const field of fieldsForListing(listing)) {
    const text = normalize(field.text);
    if (!text) continue;

    if (text.includes(phrase)) {
      score += field.weight * 3;
    }

    for (const term of terms) {
      if (text.includes(term)) {
        score += field.weight;
      }
    }
  }

  return score;
}

export function rankListingsBySearch(listings: Listing[], query?: string) {
  if (!query?.trim()) return listings;

  return listings
    .map((listing, index) => ({
      listing,
      index,
      score: scoreListing(listing, query)
    }))
    .filter((result) => result.score > 0)
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .map((result) => result.listing);
}
