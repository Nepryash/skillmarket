import Link from "next/link";
import { BarChart3, ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { getAnalyticsSummary } from "@/lib/analytics";

export const dynamic = "force-dynamic";

function MetricList({ title, items }: { title: string; items: Array<{ label: string; value: number }> }) {
  return (
    <section className="admin-panel metric-panel">
      <h2>{title}</h2>
      {items.length > 0 ? (
        <div className="metric-list">
          {items.map((item) => (
            <div className="metric-row" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      ) : (
        <p className="muted-copy">No events yet.</p>
      )}
    </section>
  );
}

export default async function AdminAnalyticsPage() {
  await requireAdmin();
  const summary = await getAnalyticsSummary();

  return (
    <main className="page-shell admin-page">
      <section className="admin-hero">
        <div>
          <span className="section-kicker">Phase 3</span>
          <h1>Analytics</h1>
          <p>Anonymous marketplace signals for views, clicks, searches, listings, categories, and labels.</p>
        </div>
        <Link className="button" href="/admin">
          <ArrowLeft size={16} aria-hidden="true" /> Admin
        </Link>
      </section>

      <section className="admin-toolbar">
        <span>
          <BarChart3 size={16} aria-hidden="true" /> Marketplace telemetry
        </span>
      </section>

      <section className="admin-split analytics-grid">
        <MetricList title="Event totals" items={summary.totals} />
        <MetricList title="Top listings" items={summary.topListings} />
        <MetricList title="Top categories" items={summary.topCategories} />
        <MetricList title="Top labels" items={summary.topLabels} />
        <MetricList title="Search terms" items={summary.topSearches} />
        <section className="admin-panel metric-panel">
          <h2>Recent events</h2>
          <div className="metric-list">
            {summary.recentEvents.map((event) => (
              <div className="metric-row event-row" key={`${event.created_at}-${event.event_type}-${event.path}`}>
                <span>
                  {event.event_type}
                  {event.listing_title ? ` / ${event.listing_title}` : ""}
                  {event.search_query ? ` / ${event.search_query}` : ""}
                </span>
                <strong>{new Date(event.created_at).toLocaleTimeString()}</strong>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
