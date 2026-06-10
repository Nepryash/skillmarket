import Link from "next/link";
import { ListingCard } from "@/components/listing-card";
import { MarketplaceFilters } from "@/components/marketplace-filters";
import { recordAnalyticsEvent } from "@/lib/analytics";
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
    type: type === "skill" || type === "plugin" || type === "model" ? (type as ListingType) : "all",
    compatibility:
      compatibility === "claude_code" || compatibility === "codex" || compatibility === "both" || compatibility === "local_lm"
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
  const path = `/marketplace?${new URLSearchParams(
    Object.entries(params).flatMap(([key, value]) => {
      if (!value) return [];
      return [[key, Array.isArray(value) ? value[0] : value]];
    })
  ).toString()}`;

  void recordAnalyticsEvent({
    eventType: "page_view",
    path,
    categorySlug: filters.category !== "all" ? filters.category : undefined,
    labelSlug: filters.label !== "all" ? filters.label : undefined
  }).catch((error) => {
    console.error("Failed to record marketplace page view", error);
  });

  if (filters.query) {
    void recordAnalyticsEvent({
      eventType: listings.length > 0 ? "search" : "no_result_search",
      searchQuery: filters.query,
      resultCount: listings.length,
      categorySlug: filters.category !== "all" ? filters.category : undefined,
      labelSlug: filters.label !== "all" ? filters.label : undefined,
      path
    }).catch((error) => {
      console.error("Failed to record marketplace search event", error);
    });
  }

  return (
    <main className="page-shell marketplace-scroll">
      <section className="market-hero scroll-scene">
        <div className="scroll-reveal">
          <span className="section-kicker">Curated catalog</span>
          <h1>Marketplace</h1>
          <p>Search curated local models, MCP servers, plugins, skills, prompts, and useful GitHub repositories for agent workflows.</p>
        </div>
        <div className="market-summary scroll-reveal" aria-label="Marketplace summary">
          <span>{listings.length} matching listings</span>
          <div className="chip-row">
            <Link className="chip accent" href="/marketplace?category=skills">Skills</Link>
            <Link className="chip accent" href="/marketplace?category=plugins">Plugins</Link>
            <Link className="chip accent" href="/marketplace?category=mcp">MCP</Link>
            <Link className="chip" href="/marketplace?category=prompts">Prompts</Link>
          </div>
        </div>
      </section>

      <nav className="category-strip market-categories scroll-reveal" aria-label="Marketplace categories">
        <Link className="chip accent" href="/marketplace">All</Link>
        {categories.map((category) => (
          <Link className="chip" href={`/marketplace?category=${category.slug}`} key={category.id}>
            {category.name}
          </Link>
        ))}
      </nav>

      <section className="market-layout scroll-scene">
        <MarketplaceFilters categories={categories} labels={labels} filters={filters} />
        <div>
          {listings.length > 0 ? (
            <div className="listing-grid reveal-grid">
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
