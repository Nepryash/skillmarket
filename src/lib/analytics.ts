import { getDb, saveDb } from "@/lib/db";
import { rowsFromExec } from "@/lib/marketplace";

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

type MetricRow = {
  label: string;
  value: number;
};

async function ensureAnalyticsTable() {
  const db = await getDb();
  db.run(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      listing_id INTEGER REFERENCES listings(id) ON DELETE SET NULL,
      category_slug TEXT,
      label_slug TEXT,
      search_query TEXT,
      result_count INTEGER,
      target_url TEXT,
      path TEXT,
      created_at TEXT NOT NULL
    )
  `);
}

export async function recordAnalyticsEvent(input: RecordEventInput) {
  await ensureAnalyticsTable();
  const db = await getDb();
  db.run(
    `INSERT INTO analytics_events (
      event_type, listing_id, category_slug, label_slug, search_query, result_count, target_url, path, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.eventType,
      input.listingId ?? null,
      input.categorySlug ?? null,
      input.labelSlug ?? null,
      input.searchQuery ?? null,
      input.resultCount ?? null,
      input.targetUrl ?? null,
      input.path ?? null,
      new Date().toISOString()
    ]
  );
  await saveDb();
}

export async function getAnalyticsSummary() {
  await ensureAnalyticsTable();
  const db = await getDb();

  const totals = rowsFromExec<MetricRow>(
    db.exec(
      `SELECT event_type AS label, COUNT(*) AS value
       FROM analytics_events
       GROUP BY event_type
       ORDER BY value DESC`
    )
  );

  const topListings = rowsFromExec<MetricRow>(
    db.exec(
      `SELECT listings.title AS label, COUNT(*) AS value
       FROM analytics_events
       INNER JOIN listings ON listings.id = analytics_events.listing_id
       WHERE analytics_events.listing_id IS NOT NULL
       GROUP BY listings.id
       ORDER BY value DESC, listings.title ASC
       LIMIT 8`
    )
  );

  const topCategories = rowsFromExec<MetricRow>(
    db.exec(
      `SELECT COALESCE(analytics_events.category_slug, categories.slug) AS label, COUNT(*) AS value
       FROM analytics_events
       LEFT JOIN listings ON listings.id = analytics_events.listing_id
       LEFT JOIN categories ON categories.id = listings.category_id
       WHERE COALESCE(analytics_events.category_slug, categories.slug) IS NOT NULL
       GROUP BY label
       ORDER BY value DESC, label ASC
       LIMIT 8`
    )
  );

  const topLabels = rowsFromExec<MetricRow>(
    db.exec(
      `SELECT labels.name AS label, COUNT(*) AS value
       FROM analytics_events
       INNER JOIN listings ON listings.id = analytics_events.listing_id
       INNER JOIN listing_labels ON listing_labels.listing_id = listings.id
       INNER JOIN labels ON labels.id = listing_labels.label_id
       GROUP BY labels.id
       ORDER BY value DESC, labels.name ASC
       LIMIT 8`
    )
  );

  const topSearches = rowsFromExec<MetricRow>(
    db.exec(
      `SELECT search_query AS label, COUNT(*) AS value
       FROM analytics_events
       WHERE search_query IS NOT NULL AND search_query != ''
       GROUP BY search_query
       ORDER BY value DESC, search_query ASC
       LIMIT 8`
    )
  );

  const recentEvents = rowsFromExec<{
    event_type: string;
    listing_title: string | null;
    search_query: string | null;
    target_url: string | null;
    path: string | null;
    created_at: string;
  }>(
    db.exec(
      `SELECT analytics_events.event_type, listings.title AS listing_title, analytics_events.search_query,
              analytics_events.target_url, analytics_events.path, analytics_events.created_at
       FROM analytics_events
       LEFT JOIN listings ON listings.id = analytics_events.listing_id
       ORDER BY analytics_events.id DESC
       LIMIT 12`
    )
  );

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
