import Link from "next/link";
import { ArrowRight, CornerDownLeft, Search, Sparkles } from "lucide-react";
import { ListingCard } from "@/components/listing-card";
import { recordAnalyticsEvent, trackedUrl } from "@/lib/analytics";
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
      <section className="page-shell hero scroll-scene entrance-scene">
        <div className="hero-copy scroll-reveal">
          <h1>Claude Code, Codex, and local LMs, ready to install.</h1>
          <p>
            Browse curated skills, plugin packs, and downloadable local models. Filter by workflow, then send the exact install links and commands to Telegram.
          </p>
          <form className="hero-search" action="/marketplace">
            <Search size={18} aria-hidden="true" />
            <input name="q" placeholder="Search skills, plugins, local models..." aria-label="Search marketplace" />
            <button type="submit">
              <span>Search</span>
              <CornerDownLeft size={15} aria-hidden="true" />
            </button>
          </form>
          <div className="hero-actions">
            <Link className="button primary" href="/marketplace">
              Browse marketplace <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a className="button" href={telegramUrl} target="_blank" rel="noreferrer">
              Open Telegram <Sparkles size={18} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="hero-visual parallax-stage" aria-hidden="true">
          <div className="hero-orbit" />
          <div className="terminal-card">
            <div className="terminal-line">
              <strong>$</strong>
              <span>gsd-plan-phase 1 --mvp</span>
            </div>
            <div className="terminal-line">
              <strong>$</strong>
              <span>frontend-app-builder</span>
            </div>
            <div className="terminal-line">
              <strong>$</strong>
              <span>huggingface-cli download Qwen/Qwen2.5-Coder-7B-Instruct</span>
            </div>
          </div>
        </div>
      </section>

      <nav className="page-shell category-strip scroll-reveal" aria-label="Featured categories">
        <Link className="chip accent" href="/marketplace">All</Link>
        {categories.map((category) => (
          <Link className="chip" href={`/marketplace?category=${category.slug}`} key={category.id}>
            {category.name}
          </Link>
        ))}
      </nav>

      <section className="page-shell section scroll-scene" id="featured">
        <div className="section-heading scroll-reveal">
          <h2>Featured</h2>
          <p>Start with practical workflows, plugin packs, and local models for planning, frontend builds, design operations, and offline experiments.</p>
        </div>
        <div className="listing-grid reveal-grid">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      <section className="page-shell section scroll-scene" id="categories">
        <div className="section-heading scroll-reveal">
          <h2>Categories</h2>
          <p>Browse by domain first, then narrow by Codex, Claude Code, local LM, listing type, and label.</p>
        </div>
        <div className="listing-grid category-grid reveal-grid">
          {categories.map((category) => (
            <Link className="listing-card" href={`/marketplace?category=${category.slug}`} key={category.id}>
              <div>
                <span className="chip accent">Category</span>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <p className="category-prompt">{category.prompt}</p>
              </div>
              <div className="card-actions">
                <span className="button">Explore</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
