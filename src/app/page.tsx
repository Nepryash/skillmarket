import Link from "next/link";
import { HeroFocusCarousel } from "@/components/hero-focus-carousel";
import { ListingCard } from "@/components/listing-card";
import { ListingIcon } from "@/components/listing-icon";
import { recordAnalyticsEvent, trackedUrl } from "@/lib/analytics";
import { landingCategories } from "@/lib/landing-categories";
import { getCategories, getFeaturedListings } from "@/lib/marketplace";
import { telegramStartUrl } from "@/lib/telegram";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredListings, categories] = await Promise.all([getFeaturedListings(6), getCategories()]);
  void recordAnalyticsEvent({ eventType: "page_view", path: "/" }).catch((error) => {
    console.error("Failed to record homepage analytics event", error);
  });
  const featuredTelegramSlug = featuredListings[0]?.slug;
  const telegramUrl = featuredTelegramSlug
    ? trackedUrl("telegram_click", telegramStartUrl(featuredTelegramSlug), featuredTelegramSlug)
    : `https://t.me/${process.env.TELEGRAM_BOT_USERNAME || "skillmarket_bot"}`;

  return (
    <main>
      <HeroFocusCarousel telegramUrl={telegramUrl} />

      <nav className="page-shell category-strip scroll-reveal" aria-label="Featured categories">
        <Link className="chip accent" href="/marketplace">All</Link>
        {categories.map((category) => (
          <Link className="chip" href={`/marketplace?category=${category.slug}`} key={category.id}>
            {category.name}
          </Link>
        ))}
      </nav>

      <section className="page-shell section scroll-scene" id="categories">
        <div className="section-heading scroll-reveal">
          <h2>Tools</h2>
          <p>Start with the kind of resource you need, then narrow by use case in the marketplace.</p>
        </div>
        <div className="tools-grid reveal-grid">
          {categories.map((category) => (
            <Link className="tool-card" href={`/marketplace?category=${category.slug}`} key={category.id}>
              <div className="tool-card-copy">
                <span>Tool type</span>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
              <div className="tool-card-bottom">
                <p>{category.prompt}</p>
                <span>Browse</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-shell section compact-section scroll-scene" id="use-cases">
        <div className="section-heading scroll-reveal">
          <h2>Categories</h2>
          <p>Filter the marketplace by the kind of work you want the tool to support.</p>
        </div>
        <div className="use-case-grid reveal-grid">
          {landingCategories.map((useCase) => (
            <Link className="use-case-card" href={`/marketplace?label=${useCase.slug}`} key={useCase.slug}>
              <ListingIcon icon={useCase.icon} title={`${useCase.name} category`} />
              <span>{useCase.name}</span>
              <p>{useCase.description}</p>
              <strong>Explore</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-shell section scroll-scene" id="featured">
        <div className="section-heading scroll-reveal">
          <h2>Featured</h2>
          <p>Start with practical resources for coding, design, planning, automation, local models, and reusable prompts.</p>
        </div>
        <div className="listing-grid reveal-grid">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </main>
  );
}
