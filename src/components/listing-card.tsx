import Link from "next/link";
import { ArrowUpRight, Send } from "lucide-react";
import { ListingIcon } from "@/components/listing-icon";
import { trackedUrl } from "@/lib/analytics";
import { formatCompatibility, formatListingType } from "@/lib/format";
import { telegramStartUrl } from "@/lib/telegram";
import type { Listing } from "@/types";

type ListingCardProps = {
  listing: Listing;
};

export function ListingCard({ listing }: ListingCardProps) {
  const telegramUrl = trackedUrl("telegram_click", telegramStartUrl(listing.slug), listing.slug);
  const compatibilityLabel = formatCompatibility(listing.compatibility);

  return (
    <article className={`listing-card scroll-card${listing.featured ? " is-featured" : ""}`}>
      {listing.featured ? <span className="featured-badge">Featured</span> : null}
      <div>
        <div className="card-top">
          <div className="card-identity">
            <ListingIcon icon={listing.icon} title={`${listing.title} icon`} />
            <span className="chip accent">{formatListingType(listing.type)}</span>
          </div>
          {compatibilityLabel ? <span className="chip">{compatibilityLabel}</span> : null}
        </div>
        <h3>
          <Link href={`/marketplace/${listing.slug}`}>{listing.title}</Link>
        </h3>
        <p>{listing.description}</p>
      </div>
      <div>
        <div className="chip-row" aria-label={`${listing.title} labels`}>
          <span className="chip">{listing.categoryName}</span>
          {listing.labels.map((label) => (
            <span className="chip" key={label.id}>
              {label.name}
            </span>
          ))}
        </div>
        <div className="card-actions">
          <Link className="button primary" href={`/marketplace/${listing.slug}`}>
            Details <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <a className="button" href={telegramUrl} target="_blank" rel="noreferrer">
            Telegram <Send size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}
