const NON_SLUG_CHARS = /[^a-z0-9]+/g;

export function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(NON_SLUG_CHARS, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function findBySlug<T extends { slug: string }>(items: T[], slug: string): T | null {
  const target = normalizeSlug(slug);
  if (!target) return null;

  return items.find((item) => normalizeSlug(item.slug) === target) ?? null;
}
