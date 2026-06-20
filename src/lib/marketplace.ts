import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabase";
import { getSupabaseAdminClient } from "@/lib/supabase-server";
import { rankListingsBySearch } from "@/lib/search";
import type { Category, Command, Label, Listing, ListingBullet, ListingFilters } from "@/types";

type CategoryRow = {
  id: number;
  name: string;
  slug: string;
  description: string;
  prompt: string;
  sort_order: number;
};

type LabelRow = {
  id: number;
  name: string;
  slug: string;
  color: string;
};

type CommandRow = {
  id: number;
  listing_id: number;
  label: string;
  command: string;
  sort_order: number;
};

type ListingBulletRow = {
  id: number;
  listing_id: number;
  text: string;
  sort_order: number;
};

type ListingRow = {
  id: number;
  type: Listing["type"];
  title: string;
  slug: string;
  icon: string;
  description: string;
  prompt: string;
  category_id: number;
  compatibility: Listing["compatibility"];
  install_url: string;
  github_url: string;
  status: Listing["status"];
  featured: number | boolean;
  created_at: string;
  updated_at: string;
};

type ListingLabelRow = {
  listing_id: number;
  label_id: number;
};

type LoadedCatalog = {
  categories: CategoryRow[];
  labels: LabelRow[];
  listings: ListingRow[];
  listingLabels: ListingLabelRow[];
  commands: CommandRow[];
  listingBullets: ListingBulletRow[];
};

function mapLabel(row: LabelRow): Label {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    color: row.color
  };
}

function mapCommand(row: CommandRow): Command {
  return {
    id: row.id,
    listingId: row.listing_id,
    label: row.label,
    command: row.command,
    sortOrder: row.sort_order
  };
}

function mapListingBullet(row: ListingBulletRow): ListingBullet {
  return {
    id: row.id,
    listingId: row.listing_id,
    text: row.text,
    sortOrder: row.sort_order
  };
}

function toListing(
  row: ListingRow,
  categoryById: Map<number, CategoryRow>,
  labelsByListingId: Map<number, LabelRow[]>,
  commandsByListingId: Map<number, CommandRow[]>,
  bulletsByListingId: Map<number, ListingBulletRow[]>
): Listing {
  const category = categoryById.get(row.category_id);
  if (!category) {
    throw new Error(`Missing category ${row.category_id} for listing ${row.id}`);
  }

  const labels = (labelsByListingId.get(row.id) ?? []).slice().sort((left, right) => left.name.localeCompare(right.name));
  const commands = (commandsByListingId.get(row.id) ?? [])
    .slice()
    .sort((left, right) => left.sort_order - right.sort_order || left.id - right.id);
  const bullets = (bulletsByListingId.get(row.id) ?? [])
    .slice()
    .sort((left, right) => left.sort_order - right.sort_order || left.id - right.id);

  return {
    id: row.id,
    type: row.type,
    title: row.title,
    slug: row.slug,
    icon: row.icon,
    description: row.description,
    prompt: row.prompt ?? "",
    categoryId: category.id,
    categoryName: category.name,
    categorySlug: category.slug,
    compatibility: row.compatibility,
    installUrl: row.install_url,
    githubUrl: row.github_url,
    status: row.status,
    featured: Boolean(row.featured),
    labels: labels.map(mapLabel),
    commands: commands.map(mapCommand),
    bullets: bullets.map(mapListingBullet),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function fetchRows<T>(client: SupabaseClient, table: string, columns = "*", allowMissingTable = false) {
  const { data, error } = await client.from(table).select(columns);
  if (allowMissingTable && (error?.code === "42P01" || error?.code === "PGRST205")) return [] as T[];
  if (error) throw error;
  return (data ?? []) as T[];
}

async function loadPublicCatalog(): Promise<LoadedCatalog> {
  const client = getSupabaseClient();
  const [categories, labels, listings, listingLabels, commands, listingBullets] = await Promise.all([
    fetchRows<CategoryRow>(client, "categories"),
    fetchRows<LabelRow>(client, "labels"),
    fetchRows<ListingRow>(client, "listings"),
    fetchRows<ListingLabelRow>(client, "listing_labels"),
    fetchRows<CommandRow>(client, "commands"),
    fetchRows<ListingBulletRow>(client, "listing_bullets", "*", true)
  ]);

  return { categories, labels, listings, listingLabels, commands, listingBullets };
}

async function loadAdminCatalog(): Promise<LoadedCatalog> {
  const client = getSupabaseAdminClient();
  const [categories, labels, listings, listingLabels, commands, listingBullets] = await Promise.all([
    fetchRows<CategoryRow>(client, "categories"),
    fetchRows<LabelRow>(client, "labels"),
    fetchRows<ListingRow>(client, "listings"),
    fetchRows<ListingLabelRow>(client, "listing_labels"),
    fetchRows<CommandRow>(client, "commands"),
    fetchRows<ListingBulletRow>(client, "listing_bullets", "*", true)
  ]);

  return { categories, labels, listings, listingLabels, commands, listingBullets };
}

function hydrateListings(rows: ListingRow[], catalog: LoadedCatalog): Listing[] {
  const categoryById = new Map(catalog.categories.map((category) => [category.id, category]));
  const labelById = new Map(catalog.labels.map((label) => [label.id, label]));
  const labelsByListingId = new Map<number, LabelRow[]>();
  const commandsByListingId = new Map<number, CommandRow[]>();
  const bulletsByListingId = new Map<number, ListingBulletRow[]>();

  for (const listingLabel of catalog.listingLabels) {
    const label = labelById.get(listingLabel.label_id);
    if (!label) continue;
    const existing = labelsByListingId.get(listingLabel.listing_id) ?? [];
    existing.push(label);
    labelsByListingId.set(listingLabel.listing_id, existing);
  }

  for (const command of catalog.commands) {
    const existing = commandsByListingId.get(command.listing_id) ?? [];
    existing.push(command);
    commandsByListingId.set(command.listing_id, existing);
  }

  for (const bullet of catalog.listingBullets) {
    const existing = bulletsByListingId.get(bullet.listing_id) ?? [];
    existing.push(bullet);
    bulletsByListingId.set(bullet.listing_id, existing);
  }

  return rows.map((row) => toListing(row, categoryById, labelsByListingId, commandsByListingId, bulletsByListingId));
}

export async function getCategories(): Promise<Category[]> {
  const { categories } = await loadPublicCatalog();
  return categories
    .slice()
    .sort((left, right) => left.sort_order - right.sort_order || left.name.localeCompare(right.name))
    .map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      prompt: row.prompt ?? "",
      sortOrder: row.sort_order
    }));
}

export async function getLabels(): Promise<Label[]> {
  const { labels } = await loadPublicCatalog();
  return labels
    .slice()
    .sort((left, right) => left.name.localeCompare(right.name))
    .map(mapLabel);
}

export async function getListings(filters: ListingFilters = {}): Promise<Listing[]> {
  const catalog = await loadPublicCatalog();
  const listings = catalog.listings.filter((row) => row.status === "published");
  const categoryBySlug = new Map(catalog.categories.map((category) => [category.slug, category]));
  const labelBySlug = new Map(catalog.labels.map((label) => [label.slug, label]));

  const filtered = listings.filter((row) => {
    if (filters.type && filters.type !== "all" && row.type !== filters.type) {
      return false;
    }

    if (filters.compatibility && filters.compatibility !== "all") {
      if (filters.compatibility === "not_applicable") {
        if (row.compatibility !== filters.compatibility) return false;
      } else if (filters.compatibility === "local_lm") {
        if (row.compatibility !== filters.compatibility) return false;
      } else if (row.compatibility !== filters.compatibility && row.compatibility !== "both") {
        return false;
      }
    }

    if (filters.category && filters.category !== "all") {
      const category = categoryBySlug.get(filters.category);
      if (!category || row.category_id !== category.id) return false;
    }

    if (filters.label && filters.label !== "all") {
      const label = labelBySlug.get(filters.label);
      if (!label) return false;
      const matchingListing = catalog.listingLabels.some((listingLabel) => listingLabel.listing_id === row.id && listingLabel.label_id === label.id);
      if (!matchingListing) return false;
    }

    return true;
  });

  const sorted = filtered.slice().sort((left, right) => {
    const featuredDiff = Number(right.featured) - Number(left.featured);
    if (featuredDiff !== 0) return featuredDiff;
    const updatedDiff = new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime();
    if (updatedDiff !== 0) return updatedDiff;
    return left.title.localeCompare(right.title);
  });

  const hydratedListings = hydrateListings(sorted, catalog);
  return rankListingsBySearch(hydratedListings, filters.query);
}

export async function getFeaturedListings(limit = 4): Promise<Listing[]> {
  const listings = await getListings();
  return listings.filter((listing) => listing.featured).slice(0, limit);
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  const listings = await getListings();
  return listings.find((listing) => listing.slug === slug) ?? null;
}

export async function getAdminListings(): Promise<Listing[]> {
  const catalog = await loadAdminCatalog();
  const sorted = catalog.listings
    .slice()
    .sort((left, right) => {
      const updatedDiff = new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime();
      if (updatedDiff !== 0) return updatedDiff;
      return left.title.localeCompare(right.title);
    });

  return hydrateListings(sorted, catalog);
}

export async function getAdminListingById(id: number): Promise<Listing | null> {
  const listings = await getAdminListings();
  return listings.find((listing) => listing.id === id) ?? null;
}
