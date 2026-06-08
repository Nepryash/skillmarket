import { notFound } from "next/navigation";
import { AdminListingForm } from "@/components/admin-listing-form";
import { requireAdmin } from "@/lib/admin-auth";
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
      </section>
      <AdminListingForm categories={categories} labels={labels} listing={listing} />
    </main>
  );
}
