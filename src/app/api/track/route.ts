import { NextResponse } from "next/server";
import { recordAnalyticsEvent, type AnalyticsEventType } from "@/lib/analytics";
import { getListingBySlug } from "@/lib/marketplace";
import { telegramStartUrl } from "@/lib/telegram";

const allowedEvents = new Set<AnalyticsEventType>(["install_click", "telegram_click"]);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const event = url.searchParams.get("event") as AnalyticsEventType | null;
  const targetUrl = url.searchParams.get("to");
  const listingSlug = url.searchParams.get("listing");

  if (!event || !allowedEvents.has(event) || !targetUrl) {
    return NextResponse.json({ error: "Invalid tracking request" }, { status: 400 });
  }

  if (!listingSlug) {
    return NextResponse.json({ error: "Missing listing" }, { status: 400 });
  }

  const listing = await getListingBySlug(listingSlug);
  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  const allowedTargets = new Set([listing.installUrl, listing.githubUrl, telegramStartUrl(listing.slug)]);
  if (!allowedTargets.has(targetUrl)) {
    return NextResponse.json({ error: "Invalid redirect target" }, { status: 400 });
  }

  void recordAnalyticsEvent({
    eventType: event,
    listingId: listing.id,
    categorySlug: listing.categorySlug,
    targetUrl,
    path: url.pathname
  }).catch((error) => {
    console.error("Failed to record tracking event", error);
  });

  return NextResponse.redirect(targetUrl);
}
