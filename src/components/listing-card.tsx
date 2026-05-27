import Link from "next/link";
import { ArrowUpRight, Send } from "lucide-react";
import { formatCompatibility, formatListingType } from "@/lib/format";
import type { Listing } from "@/types";

type ListingCardProps = {
  listing: Listing;
};

export function ListingCard({ listing }: ListingCardProps) {
  const telegramUrl = `https://t.me/skillmarket_bot?start=${encodeURIComponent(listing.slug)}`;

  return (
    <article className="listing-card">
      <div>
        <div className="card-top">
          <span className="chip accent">{formatListingType(listing.type)}</span>
          <span className="chip">{formatCompatibility(listing.compatibility)}</span>
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
