import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Github, Send } from "lucide-react";
import { formatCompatibility, formatListingType } from "@/lib/format";
import { getListingBySlug } from "@/lib/marketplace";

type ListingDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);

  if (!listing) {
    notFound();
  }

  const telegramUrl = `https://t.me/skillmarket_bot?start=${encodeURIComponent(listing.slug)}`;

  return (
    <main className="page-shell detail-page">
      <section>
        <div className="chip-row">
          <span className="chip accent">{formatListingType(listing.type)}</span>
          <span className="chip">{formatCompatibility(listing.compatibility)}</span>
          <span className="chip">{listing.categoryName}</span>
        </div>
        <h1>{listing.title}</h1>
        <p className="detail-copy">{listing.description}</p>

        <div className="chip-row" aria-label={`${listing.title} labels`}>
          {listing.labels.map((label) => (
            <span className="chip" key={label.id}>
              {label.name}
            </span>
          ))}
        </div>

        <div className="command-list">
          {listing.commands.map((command) => (
            <div className="command-item" key={command.id}>
              <span>{command.label}</span>
              <code>{command.command}</code>
            </div>
          ))}
        </div>
      </section>

      <aside className="side-panel" aria-label="Install actions">
        <h2>Install</h2>
        <p className="detail-copy">Use the source link directly, or send this listing to Telegram for quick reference.</p>
        <a className="button primary" href={listing.installUrl} target="_blank" rel="noreferrer">
          Install link <ExternalLink size={16} aria-hidden="true" />
        </a>
        <a className="button" href={listing.githubUrl} target="_blank" rel="noreferrer">
          GitHub/source <Github size={16} aria-hidden="true" />
        </a>
        <a className="button" href={telegramUrl} target="_blank" rel="noreferrer">
          Get via Telegram <Send size={16} aria-hidden="true" />
        </a>
        <Link className="button" href="/marketplace">
          Back to marketplace
        </Link>
      </aside>
    </main>
  );
}
