import { AdminListingForm } from "@/components/admin-listing-form";
import { requireAdmin } from "@/lib/admin-auth";
import { landingCategories } from "@/lib/landing-categories";
import { getCategories, getLabels } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

export default async function NewListingPage() {
  await requireAdmin();
  const [categories, labels] = await Promise.all([getCategories(), getLabels()]);
  const landingCategorySlugs = new Set<string>(landingCategories.map((category) => category.slug));
  const landingPageCategories = categories.filter((category) => landingCategorySlugs.has(category.slug));
  const categoryOptions = landingPageCategories.length > 0 ? landingPageCategories : categories;

  return (
    <main className="page-shell admin-page">
      <section className="admin-hero">
        <div>
          <span className="section-kicker">Admin</span>
          <h1>New listing</h1>
        </div>
      </section>
      <AdminListingForm categories={categoryOptions} labels={labels} />
    </main>
  );
}
