import { getDb } from "@/lib/db";
import type { QueryExecResult } from "sql.js";
import type { Category, Command, Label, Listing, ListingFilters } from "@/types";

export type ListingRow = {
  id: number;
  type: Listing["type"];
  title: string;
  slug: string;
  icon: string;
  description: string;
  category_id: number;
  category_name: string;
  category_slug: string;
  compatibility: Listing["compatibility"];
  install_url: string;
  github_url: string;
  status: Listing["status"];
  featured: number;
  created_at: string;
  updated_at: string;
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

export function rowsFromExec<T>(result: QueryExecResult[]): T[] {
  if (!result[0]) return [];
  const { columns, values } = result[0];
  return values.map((valueRow) =>
    Object.fromEntries(columns.map((column, index) => [column, valueRow[index]]))
  ) as T[];
}

async function hydrateListings(rows: ListingRow[]): Promise<Listing[]> {
  if (rows.length === 0) return [];

  const db = await getDb();
  const ids = rows.map((row) => row.id);
  const placeholders = ids.map(() => "?").join(",");

  const labelRows = rowsFromExec<LabelRow & { listing_id: number }>(
    db.exec(
      `SELECT labels.id, labels.name, labels.slug, labels.color, listing_labels.listing_id
       FROM labels
       INNER JOIN listing_labels ON listing_labels.label_id = labels.id
       WHERE listing_labels.listing_id IN (${placeholders})
       ORDER BY labels.name ASC`,
      ids
    )
  );

  const commandRows = rowsFromExec<CommandRow>(
    db.exec(
      `SELECT id, listing_id, label, command, sort_order
       FROM commands
       WHERE listing_id IN (${placeholders})
       ORDER BY sort_order ASC, id ASC`,
      ids
    )
  );

  return rows.map((row) => ({
    id: row.id,
    type: row.type,
    title: row.title,
    slug: row.slug,
    icon: row.icon,
    description: row.description,
    categoryId: row.category_id,
    categoryName: row.category_name,
    categorySlug: row.category_slug,
    compatibility: row.compatibility,
    installUrl: row.install_url,
    githubUrl: row.github_url,
    status: row.status,
    featured: Boolean(row.featured),
    labels: labelRows.filter((label) => label.listing_id === row.id).map(mapLabel),
    commands: commandRows.filter((command) => command.listing_id === row.id).map(mapCommand),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
}

export async function getAdminListings(): Promise<Listing[]> {
  const db = await getDb();
  const rows = rowsFromExec<ListingRow>(
    db.exec(
      `SELECT listings.*, categories.name AS category_name, categories.slug AS category_slug
       FROM listings
       INNER JOIN categories ON categories.id = listings.category_id
       ORDER BY listings.updated_at DESC, listings.title ASC`
    )
  );

  return hydrateListings(rows);
}

export async function getAdminListingById(id: number): Promise<Listing | null> {
  const db = await getDb();
  const rows = rowsFromExec<ListingRow>(
    db.exec(
      `SELECT listings.*, categories.name AS category_name, categories.slug AS category_slug
       FROM listings
       INNER JOIN categories ON categories.id = listings.category_id
       WHERE listings.id = ?`,
      [id]
    )
  );

  return rows[0] ? (await hydrateListings([rows[0]]))[0] : null;
}

export async function getCategories(): Promise<Category[]> {
  const db = await getDb();
  const rows = rowsFromExec<{
    id: number;
    name: string;
    slug: string;
    description: string;
    sort_order: number;
  }>(db.exec("SELECT id, name, slug, description, sort_order FROM categories ORDER BY sort_order ASC, name ASC"));

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    sortOrder: row.sort_order
  }));
}

export async function getLabels(): Promise<Label[]> {
  const db = await getDb();
  const rows = rowsFromExec<LabelRow>(db.exec("SELECT id, name, slug, color FROM labels ORDER BY name ASC"));
  return rows.map(mapLabel);
}

export async function getListings(filters: ListingFilters = {}): Promise<Listing[]> {
  const db = await getDb();
  const clauses = ["listings.status = 'published'"];
  const params: Array<string> = [];

  if (filters.type && filters.type !== "all") {
    clauses.push("listings.type = ?");
    params.push(filters.type);
  }

  if (filters.compatibility && filters.compatibility !== "all") {
    if (filters.compatibility === "local_lm") {
      clauses.push("listings.compatibility = ?");
      params.push(filters.compatibility);
    } else {
      clauses.push("(listings.compatibility = ? OR listings.compatibility = 'both')");
      params.push(filters.compatibility);
    }
  }

  if (filters.category && filters.category !== "all") {
    clauses.push("categories.slug = ?");
    params.push(filters.category);
  }

  if (filters.query) {
    clauses.push("(listings.title LIKE ? OR listings.description LIKE ?)");
    params.push(`%${filters.query}%`, `%${filters.query}%`);
  }

  if (filters.label && filters.label !== "all") {
    clauses.push(
      `EXISTS (
        SELECT 1 FROM listing_labels
        INNER JOIN labels ON labels.id = listing_labels.label_id
        WHERE listing_labels.listing_id = listings.id AND labels.slug = ?
      )`
    );
    params.push(filters.label);
  }

  const rows = rowsFromExec<ListingRow>(
    db.exec(
      `SELECT listings.*, categories.name AS category_name, categories.slug AS category_slug
       FROM listings
       INNER JOIN categories ON categories.id = listings.category_id
       WHERE ${clauses.join(" AND ")}
       ORDER BY listings.featured DESC, listings.updated_at DESC, listings.title ASC`,
      params
    )
  );

  return hydrateListings(rows);
}

export async function getFeaturedListings(limit = 4): Promise<Listing[]> {
  const db = await getDb();
  const rows = rowsFromExec<ListingRow>(
    db.exec(
      `SELECT listings.*, categories.name AS category_name, categories.slug AS category_slug
       FROM listings
       INNER JOIN categories ON categories.id = listings.category_id
       WHERE listings.status = 'published' AND listings.featured = 1
       ORDER BY listings.updated_at DESC
       LIMIT ?`,
      [limit]
    )
  );

  return hydrateListings(rows);
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  const db = await getDb();
  const rows = rowsFromExec<ListingRow>(
    db.exec(
      `SELECT listings.*, categories.name AS category_name, categories.slug AS category_slug
       FROM listings
       INNER JOIN categories ON categories.id = listings.category_id
       WHERE listings.status = 'published' AND listings.slug = ?`,
      [slug]
    )
  );

  return rows[0] ? (await hydrateListings([rows[0]]))[0] : null;
}
