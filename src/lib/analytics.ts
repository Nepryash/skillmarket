import { getSupabaseAdminClient } from "@/lib/supabase-server";
import { getAdminListings } from "@/lib/marketplace";
import { checkRateLimit } from "@/lib/rate-limit";

export type AnalyticsEventType =
  | "page_view"
  | "listing_view"
  | "install_click"
  | "telegram_click"
  | "search"
  | "no_result_search";

type RecordEventInput = {
  eventType: AnalyticsEventType;
  listingId?: number;
  categorySlug?: string;
  labelSlug?: string;
  searchQuery?: string;
  resultCount?: number;
  targetUrl?: string;
  path?: string;
};

type AnalyticsEventRow = {
  event_type: AnalyticsEventType;
  listing_id: number | null;
  category_slug: string | null;
  label_slug: string | null;
  search_query: string | null;
  result_count: number | null;
  target_url: string | null;
  path: string | null;
  created_at: string;
};

type MetricRow = {
  label: string;
  value: number;
};

function countBy<T>(items: T[], getKey: (item: T) => string | null | undefined) {
  const counts = new Map<string, number>();

  for (const item of items) {
    const key = getKey(item);
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return counts;
}

function topMetrics(counts: Map<string, number>, limit = 8): MetricRow[] {
  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, limit)
    .map(([label, value]) => ({ label, value }));
}

function truncate(value: string | undefined, maxLength: number) {
  if (!value) return null;
  return value.slice(0, maxLength);
}

export async function recordAnalyticsEvent(input: RecordEventInput) {
  const rateLimitKey = [
    "analytics",
    input.eventType,
    input.listingId ?? "",
    input.categorySlug ?? "",
    input.labelSlug ?? "",
    input.searchQuery ?? "",
    input.targetUrl ?? "",
    input.path ?? ""
  ].join(":");
  const rateLimit = checkRateLimit(rateLimitKey, 120, 60 * 1000);
  if (!rateLimit.allowed) return;

  const db = getSupabaseAdminClient();
  const { error } = await db.from("analytics_events").insert({
    event_type: input.eventType,
    listing_id: input.listingId ?? null,
    category_slug: truncate(input.categorySlug, 80),
    label_slug: truncate(input.labelSlug, 80),
    search_query: truncate(input.searchQuery, 160),
    result_count: input.resultCount ?? null,
    target_url: truncate(input.targetUrl, 500),
    path: truncate(input.path, 500),
    created_at: new Date().toISOString()
  });

  if (error) throw error;
}

export async function getAnalyticsSummary() {
  const db = getSupabaseAdminClient();
  const [eventsResult, listings] = await Promise.all([
    db.from("analytics_events").select("*").order("id", { ascending: false }),
    getAdminListings()
  ]);

  if (eventsResult.error) throw eventsResult.error;

  const events = (eventsResult.data ?? []) as AnalyticsEventRow[];
  const listingById = new Map(listings.map((listing) => [listing.id, listing]));

  const totals = topMetrics(countBy(events, (event) => event.event_type), 8);

  const topListings = topMetrics(
    countBy(events, (event) => (event.listing_id ? listingById.get(event.listing_id)?.title ?? null : null)),
    8
  );

  const topCategories = topMetrics(
    countBy(events, (event) => {
      if (event.category_slug) return event.category_slug;
      if (!event.listing_id) return null;
      return listingById.get(event.listing_id)?.categorySlug ?? null;
    }),
    8
  );

  const topLabels = topMetrics(
    (() => {
      const counts = new Map<string, number>();

      for (const event of events) {
        const listing = event.listing_id ? listingById.get(event.listing_id) : null;
        if (!listing) continue;
        for (const label of listing.labels) {
          counts.set(label.name, (counts.get(label.name) ?? 0) + 1);
        }
      }

      return counts;
    })(),
    8
  );

  const topSearches = topMetrics(countBy(events, (event) => event.search_query), 8);

  const recentEvents = events.slice(0, 12).map((event) => ({
    event_type: event.event_type,
    listing_title: event.listing_id ? listingById.get(event.listing_id)?.title ?? null : null,
    search_query: event.search_query,
    target_url: event.target_url,
    path: event.path,
    created_at: event.created_at
  }));

  return { totals, topListings, topCategories, topLabels, topSearches, recentEvents };
}

export function trackedUrl(eventType: "install_click" | "telegram_click", targetUrl: string, listingSlug: string) {
  const params = new URLSearchParams({
    event: eventType,
    to: targetUrl,
    listing: listingSlug
  });
  return `/api/track?${params.toString()}`;
}
