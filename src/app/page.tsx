import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { ListingCard } from "@/components/listing-card";
import { getCategories, getFeaturedListings } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredListings, categories] = await Promise.all([getFeaturedListings(3), getCategories()]);

  return (
    <main>
      <section className="page-shell hero">
        <div>
          <h1>Claude Code and Codex skills, ready to install.</h1>
          <p>
            Browse curated skills and plugin packs, filter by workflow, and send the exact install links and commands to Telegram when you find the right tool.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/marketplace">
              Browse marketplace <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a className="button" href="https://t.me/skillmarket_bot" target="_blank" rel="noreferrer">
              Open Telegram <Sparkles size={18} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
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
              <span>telegram: send install links</span>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell section">
        <div className="section-heading">
          <h2>Featured</h2>
          <p>Start with practical, high-signal workflows for planning, frontend builds, design operations, and plugin packs.</p>
        </div>
        <div className="listing-grid">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      <section className="page-shell section">
        <div className="section-heading">
          <h2>Categories</h2>
          <p>Browse by domain first, then narrow by Codex, Claude Code, skill, plugin, and label.</p>
        </div>
        <div className="listing-grid">
          {categories.map((category) => (
            <Link className="listing-card" href={`/marketplace?category=${category.slug}`} key={category.id}>
              <div>
                <span className="chip accent">Category</span>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
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
