import { ListingCard } from "@/components/listing-card";
import { MarketplaceFilters } from "@/components/marketplace-filters";
import { getCategories, getLabels, getListings } from "@/lib/marketplace";
import type { Compatibility, ListingFilters, ListingType } from "@/types";

export const dynamic = "force-dynamic";

type MarketplacePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseFilters(params: Record<string, string | string[] | undefined>): ListingFilters {
  const type = firstParam(params.type);
  const compatibility = firstParam(params.compatibility);

  return {
    query: firstParam(params.q) || undefined,
    type: type === "skill" || type === "plugin" ? (type as ListingType) : "all",
    compatibility:
      compatibility === "claude_code" || compatibility === "codex" || compatibility === "both"
        ? (compatibility as Compatibility)
        : "all",
    category: firstParam(params.category) || "all",
    label: firstParam(params.label) || "all"
  };
}

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const [categories, labels, listings] = await Promise.all([getCategories(), getLabels(), getListings(filters)]);

  return (
    <main className="page-shell">
      <section className="section">
        <div className="section-heading">
          <h2>Marketplace</h2>
          <p>Search curated skills and plugin packs for Claude Code, Codex, or both agent workflows.</p>
        </div>
      </section>

      <section className="market-layout">
        <MarketplaceFilters categories={categories} labels={labels} filters={filters} />
        <div>
          {listings.length > 0 ? (
            <div className="listing-grid">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              No listings match these filters yet. Try a broader query or category.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
