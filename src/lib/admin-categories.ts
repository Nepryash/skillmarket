import type { Category } from "@/types";
import { landingCategories } from "@/lib/landing-categories";

const landingCategoryOrder = new Map<string, number>(landingCategories.map((category, index) => [category.slug, index] as const));
const allowedCategorySlugs = new Set<string>(landingCategories.map((category) => category.slug));

export function listingCategoryOptions(categories: Category[]) {
  return categories
    .filter((category) => allowedCategorySlugs.has(category.slug))
    .slice()
    .sort((left, right) => {
    const leftOrder = landingCategoryOrder.get(left.slug);
    const rightOrder = landingCategoryOrder.get(right.slug);

    if (leftOrder !== undefined || rightOrder !== undefined) {
      return (leftOrder ?? Number.MAX_SAFE_INTEGER) - (rightOrder ?? Number.MAX_SAFE_INTEGER);
    }

    return left.sortOrder - right.sortOrder || left.name.localeCompare(right.name);
  });
}
