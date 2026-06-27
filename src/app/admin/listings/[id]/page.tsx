import { notFound } from "next/navigation";
import { AdminListingForm } from "@/components/admin-listing-form";
import { deleteListingAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin-auth";
import { listingCategoryOptions } from "@/lib/admin-categories";
import { getAdminListingById, getCategories, getLabels } from "@/lib/marketplace";

type EditListingPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function EditListingPage({ params }: EditListingPageProps) {
  await requireAdmin();
  const { id } = await params;
  const listingId = Number(id);
  if (!Number.isInteger(listingId)) notFound();

  const [listing, categories, labels] = await Promise.all([
    getAdminListingById(listingId),
    getCategories(),
    getLabels()
  ]);

  if (!listing) notFound();

  return (
    <main className="page-shell admin-page">
      <section className="admin-hero">
        <div>
          <span className="section-kicker">Admin</span>
          <h1>Edit listing</h1>
        </div>
        <form action={deleteListingAction}>
          <input type="hidden" name="id" value={listing.id} />
          <button className="button danger" type="submit">
            Delete listing
          </button>
        </form>
      </section>
      <AdminListingForm categories={listingCategoryOptions(categories)} labels={labels} listing={listing} />
    </main>
  );
}


