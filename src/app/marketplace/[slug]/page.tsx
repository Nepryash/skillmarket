import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Send } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
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
  const sourceUrl = isHttpUrl(listing.githubUrl) ? trackedUrl("install_click", listing.githubUrl, listing.slug) : null;
  const telegramUrl = trackedUrl("telegram_click", telegramStartUrl(listing.slug), listing.slug);
  const compatibilityLabel = formatCompatibility(listing.compatibility);
  const promptText = listing.prompt?.trim() ?? "";
  const panelTitle = listing.type === "prompt" ? "Prompt" : listing.type === "github_repo" ? "Repository" : "Install";
  const panelCopy =
    listing.type === "prompt"
      ? "Copy the prompt directly, or send this listing to Telegram for quick reference."
      : listing.type === "github_repo"
        ? "Use the repository link directly, or send this listing to Telegram for quick reference."
        : "Use the available links directly, or send this listing to Telegram for quick reference.";

  return (
    <main className="page-shell detail-page">
      <section>
        <div className="chip-row">
          <span className="chip accent">{formatListingType(listing.type)}</span>
          {compatibilityLabel ? <span className="chip">{compatibilityLabel}</span> : null}
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

        {promptText ? (
          <section className="install-command" aria-label="Prompt">
            <div className="copyable-block-header">
              <span>Prompt</span>
              <CopyButton text={promptText} className="button copy-inline" />
            </div>
            <code>{promptText}</code>
          </section>
        ) : null}

        {listing.bullets.length > 0 ? (
          <section className="capability-list" aria-label="Listing capabilities">
            <ul>
              {listing.bullets.map((bullet) => (
                <li key={bullet.id}>{bullet.text}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="command-list">
          {listing.commands.map((command) => (
            <div className="command-item" key={command.id}>
              <div className="copyable-block-header">
                <span>{command.label}</span>
                <CopyButton text={command.command} className="button copy-inline" />
              </div>
              <code>{command.command}</code>
            </div>
          ))}
        </div>
      </section>

      <aside className="side-panel" aria-label="Listing actions">
        <h2>{panelTitle}</h2>
        <p className="detail-copy">{panelCopy}</p>
        {listing.type === "prompt" && promptText ? (
          <CopyButton text={promptText} className="button primary" />
        ) : listing.type === "github_repo" && sourceUrl ? (
          <a className="button primary" href={sourceUrl} target="_blank" rel="noreferrer">
            Repository link <ExternalLink size={16} aria-hidden="true" />
          </a>
        ) : installUrl ? (
          <a className="button primary" href={installUrl} target="_blank" rel="noreferrer">
            Install link <ExternalLink size={16} aria-hidden="true" />
          </a>
        ) : listing.installUrl ? (
          <div className="install-command">
            <div className="copyable-block-header">
              <span>Install command</span>
              <CopyButton text={listing.installUrl} className="button copy-inline" />
            </div>
            <code>{listing.installUrl}</code>
          </div>
        ) : null}
        {listing.type !== "github_repo" && sourceUrl ? (
          <a className="button" href={sourceUrl} target="_blank" rel="noreferrer">
            Source <ExternalLink size={16} aria-hidden="true" />
          </a>
        ) : null}
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
