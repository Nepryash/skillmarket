import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Send } from "lucide-react";
import { ListingIcon } from "@/components/listing-icon";
import { recordAnalyticsEvent, trackedUrl } from "@/lib/analytics";
import { formatCompatibility, formatListingType } from "@/lib/format";
import { getListingBySlug } from "@/lib/marketplace";
import { telegramStartUrl } from "@/lib/telegram";

type ListingDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);

  if (!listing) {
    notFound();
  }

  void recordAnalyticsEvent({
    eventType: "listing_view",
    listingId: listing.id,
    categorySlug: listing.categorySlug,
    path: `/marketplace/${listing.slug}`
  }).catch((error) => {
    console.error("Failed to record listing view", error);
  });

  const installUrl = isHttpUrl(listing.installUrl) ? trackedUrl("install_click", listing.installUrl, listing.slug) : null;
  const sourceUrl = trackedUrl("install_click", listing.githubUrl, listing.slug);
  const telegramUrl = trackedUrl("telegram_click", telegramStartUrl(listing.slug), listing.slug);

  return (
    <main className="page-shell detail-page">
      <section>
        <div className="chip-row">
          <span className="chip accent">{formatListingType(listing.type)}</span>
          <span className="chip">{formatCompatibility(listing.compatibility)}</span>
          <span className="chip">{listing.categoryName}</span>
        </div>
        <div className="detail-title-row">
          <ListingIcon icon={listing.icon} title={`${listing.title} icon`} />
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
        {installUrl ? (
          <a className="button primary" href={installUrl} target="_blank" rel="noreferrer">
            Install link <ExternalLink size={16} aria-hidden="true" />
          </a>
        ) : (
          <div className="install-command">
            <span>Install command</span>
            <code>{listing.installUrl}</code>
          </div>
        )}
        <a className="button" href={sourceUrl} target="_blank" rel="noreferrer">
          Source <ExternalLink size={16} aria-hidden="true" />
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
