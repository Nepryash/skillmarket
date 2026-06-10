import Link from "next/link";
import { ArrowRight, CornerDownLeft, Search, Sparkles } from "lucide-react";
import { ListingCard } from "@/components/listing-card";
import { recordAnalyticsEvent, trackedUrl } from "@/lib/analytics";
import { getCategories, getFeaturedListings } from "@/lib/marketplace";
import { telegramStartUrl } from "@/lib/telegram";

export const dynamic = "force-dynamic";

const useCaseLinks = [
  { name: "Coding", slug: "coding" },
  { name: "Creativity", slug: "creativity" },
  { name: "Productivity", slug: "productivity" },
  { name: "Automation", slug: "automation" },
  { name: "Content", slug: "content" }
];

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
          <h1>Find agent tools worth using.</h1>
          <p>
            SkillMarket is a curated directory of skills, plugins, MCP servers, prompts, local models, and useful GitHub repositories for Claude Code, Codex, and local AI workflows.
          </p>
          <form className="hero-search" action="/marketplace">
            <Search size={18} aria-hidden="true" />
            <input name="q" placeholder="Search skills, MCP, prompts, repos..." aria-label="Search marketplace" />
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

      <section className="page-shell section scroll-scene" id="categories">
        <div className="section-heading scroll-reveal">
          <h2>What you can find</h2>
          <p>Browse by asset type first, then narrow by use case once you know what kind of resource you need.</p>
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
                <span className="button">Browse</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-shell section compact-section scroll-scene" id="use-cases">
        <div className="section-heading scroll-reveal">
          <h2>Browse by use case</h2>
          <p>Use these filters when you know what job the tool should help with.</p>
        </div>
        <div className="use-case-strip reveal-grid">
          {useCaseLinks.map((useCase) => (
            <Link className="use-case-card" href={`/marketplace?label=${useCase.slug}`} key={useCase.slug}>
              {useCase.name}
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
