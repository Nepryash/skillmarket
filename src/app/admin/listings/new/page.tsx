import { AdminListingForm } from "@/components/admin-listing-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getCategories, getLabels } from "@/lib/marketplace";

export default async function NewListingPage() {
  await requireAdmin();
  const [categories, labels] = await Promise.all([getCategories(), getLabels()]);

  return (
    <main className="page-shell admin-page">
      <section className="admin-hero">
        <div>
          <span className="section-kicker">Admin</span>
          <h1>New listing</h1>
        </div>
      </section>
      <AdminListingForm categories={categories} labels={labels} />
    </main>
  );
}
