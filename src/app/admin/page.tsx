import Link from "next/link";
import { BarChart3, Edit, LogOut, Plus, Archive, Trash2 } from "lucide-react";
import { archiveListingAction, deleteListingAction, logoutAction, setAnalyticsOptOutAction, upsertCategoryAction, upsertLabelAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminListings, getCategories, getLabels } from "@/lib/marketplace";
import { formatCompatibility, formatListingType } from "@/lib/format";
import { isAnalyticsOptedOut } from "@/lib/analytics-cookie";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();
  const [listings, categories, labels] = await Promise.all([getAdminListings(), getCategories(), getLabels()]);
  const analyticsOptedOut = await isAnalyticsOptedOut();

  return (
    <main className="page-shell admin-page">
      <section className="admin-hero">
        <div>
          <span className="section-kicker">Phase 2</span>
          <h1>Admin content</h1>
          <p>Manage listing status, categories, labels, links, and install commands.</p>
        </div>
        <form action={logoutAction}>
          <button className="button" type="submit">
            Log out <LogOut size={16} aria-hidden="true" />
          </button>
        </form>
      </section>

      <section className="admin-toolbar">
        <Link className="button primary" href="/admin/listings/new">
          New listing <Plus size={16} aria-hidden="true" />
        </Link>
        <Link className="button" href="/admin/analytics">
          Analytics <BarChart3 size={16} aria-hidden="true" />
        </Link>
        <form action={setAnalyticsOptOutAction}>
          <input type="hidden" name="returnTo" value="/admin" />
          <input type="hidden" name="enabled" value={analyticsOptedOut ? "0" : "1"} />
          <button className="button" type="submit">
            {analyticsOptedOut ? "Include my visits" : "Hide my visits"}
          </button>
        </form>
        <span>{listings.length} total listings</span>
      </section>

      <section className="admin-table" aria-label="Listings">
        {listings.map((listing) => {
          const compatibilityLabel = formatCompatibility(listing.compatibility);

          return (
            <article className="admin-row" key={listing.id}>
              <div>
                <h2>{listing.title}</h2>
                <p>
                  {formatListingType(listing.type)}
                  {compatibilityLabel ? ` / ${compatibilityLabel}` : ""} / {listing.status}
                </p>
              </div>
              <div className="admin-row-actions">
                <Link className="button" href={`/admin/listings/${listing.id}`}>
                  Edit <Edit size={16} aria-hidden="true" />
                </Link>
                <form action={archiveListingAction}>
                  <input type="hidden" name="id" value={listing.id} />
                  <button className="button" type="submit">
                    Archive <Archive size={16} aria-hidden="true" />
                  </button>
                </form>
                <form action={deleteListingAction}>
                  <input type="hidden" name="id" value={listing.id} />
                  <button className="button danger" type="submit">
                    Delete <Trash2 size={16} aria-hidden="true" />
                  </button>
                </form>
              </div>
            </article>
          );
        })}
      </section>

      <section className="admin-split">
        <div className="admin-panel">
          <h2>Categories</h2>
          {categories.map((category) => (
            <form className="admin-mini-form" action={upsertCategoryAction} key={category.id}>
              <input type="hidden" name="id" value={category.id} />
              <input name="name" defaultValue={category.name} />
              <input name="slug" defaultValue={category.slug} />
              <input name="description" defaultValue={category.description} />
              <input name="prompt" defaultValue={category.prompt} />
              <input name="sortOrder" type="number" defaultValue={category.sortOrder} />
              <button className="button" type="submit">Save</button>
            </form>
          ))}
          <form className="admin-mini-form" action={upsertCategoryAction}>
            <input type="hidden" name="id" value="0" />
            <input name="name" placeholder="New category" required />
            <input name="slug" placeholder="slug" required />
            <input name="description" placeholder="Description" required />
            <input name="prompt" placeholder="Prompt" required />
            <input name="sortOrder" type="number" placeholder="Order" defaultValue={categories.length + 1} />
            <button className="button primary" type="submit">Add</button>
          </form>
        </div>

        <div className="admin-panel">
          <h2>Labels</h2>
          {labels.map((label) => (
            <form className="admin-mini-form label-form" action={upsertLabelAction} key={label.id}>
              <input type="hidden" name="id" value={label.id} />
              <input name="name" defaultValue={label.name} />
              <input name="slug" defaultValue={label.slug} />
              <input name="color" defaultValue={label.color} />
              <button className="button" type="submit">Save</button>
            </form>
          ))}
          <form className="admin-mini-form label-form" action={upsertLabelAction}>
            <input type="hidden" name="id" value="0" />
            <input name="name" placeholder="New label" required />
            <input name="slug" placeholder="slug" required />
            <input name="color" placeholder="#FBFF12" defaultValue="#FBFF12" />
            <button className="button primary" type="submit">Add</button>
          </form>
        </div>
      </section>
    </main>
  );
}

