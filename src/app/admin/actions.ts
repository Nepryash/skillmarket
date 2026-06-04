"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb, saveDb } from "@/lib/db";
import { requireAdmin, signInAdmin, signOutAdmin } from "@/lib/admin-auth";
import type { Compatibility, ListingStatus, ListingType } from "@/types";

function value(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function selectedValues(formData: FormData, key: string) {
  return formData.getAll(key).map(String);
}

function parseId(formData: FormData, key: string) {
  const id = Number(value(formData, key));
  if (!Number.isInteger(id) || id < 1) throw new Error(`Invalid ${key}`);
  return id;
}

function now() {
  return new Date().toISOString();
}

export async function loginAction(formData: FormData) {
  const ok = await signInAdmin(value(formData, "password"));
  if (!ok) redirect("/admin/login?error=1");
  redirect("/admin");
}

export async function logoutAction() {
  await signOutAdmin();
  redirect("/admin/login");
}

export async function upsertListingAction(formData: FormData) {
  await requireAdmin();
  const db = await getDb();
  const listingId = Number(value(formData, "id"));
  const timestamp = now();
  const fields = [
    value(formData, "type") as ListingType,
    value(formData, "title"),
    value(formData, "slug"),
    value(formData, "icon") || "tabler:box",
    value(formData, "description"),
    Number(value(formData, "categoryId")),
    value(formData, "compatibility") as Compatibility,
    value(formData, "installUrl"),
    value(formData, "githubUrl"),
    value(formData, "status") as ListingStatus,
    formData.get("featured") ? 1 : 0
  ] as const;

  if (listingId > 0) {
    db.run(
      `UPDATE listings
       SET type = ?, title = ?, slug = ?, icon = ?, description = ?, category_id = ?, compatibility = ?,
           install_url = ?, github_url = ?, status = ?, featured = ?, updated_at = ?
       WHERE id = ?`,
      [...fields, timestamp, listingId]
    );
    db.run("DELETE FROM listing_labels WHERE listing_id = ?", [listingId]);
    db.run("DELETE FROM commands WHERE listing_id = ?", [listingId]);
  } else {
    db.run(
      `INSERT INTO listings (
        type, title, slug, icon, description, category_id, compatibility, install_url, github_url, status, featured, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [...fields, timestamp, timestamp]
    );
  }

  const id = listingId > 0 ? listingId : Number(db.exec("SELECT last_insert_rowid() AS id")[0].values[0][0]);
  selectedValues(formData, "labelIds").forEach((labelId) => {
    db.run("INSERT INTO listing_labels (listing_id, label_id) VALUES (?, ?)", [id, Number(labelId)]);
  });

  for (let index = 1; index <= 4; index += 1) {
    const label = value(formData, `commandLabel${index}`);
    const command = value(formData, `command${index}`);
    if (label && command) {
      db.run("INSERT INTO commands (listing_id, label, command, sort_order) VALUES (?, ?, ?, ?)", [id, label, command, index]);
    }
  }

  await saveDb();
  revalidatePath("/");
  revalidatePath("/marketplace");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function archiveListingAction(formData: FormData) {
  await requireAdmin();
  const db = await getDb();
  db.run("UPDATE listings SET status = 'archived', updated_at = ? WHERE id = ?", [now(), parseId(formData, "id")]);
  await saveDb();
  revalidatePath("/marketplace");
  revalidatePath("/admin");
}

export async function upsertCategoryAction(formData: FormData) {
  await requireAdmin();
  const db = await getDb();
  const id = Number(value(formData, "id"));
  const params = [value(formData, "name"), value(formData, "slug"), value(formData, "description"), Number(value(formData, "sortOrder"))];
  if (id > 0) {
    db.run("UPDATE categories SET name = ?, slug = ?, description = ?, sort_order = ? WHERE id = ?", [...params, id]);
  } else {
    db.run("INSERT INTO categories (name, slug, description, sort_order) VALUES (?, ?, ?, ?)", params);
  }
  await saveDb();
  revalidatePath("/admin");
  revalidatePath("/marketplace");
}

export async function upsertLabelAction(formData: FormData) {
  await requireAdmin();
  const db = await getDb();
  const id = Number(value(formData, "id"));
  const params = [value(formData, "name"), value(formData, "slug"), value(formData, "color") || "#FBFF12"];
  if (id > 0) {
    db.run("UPDATE labels SET name = ?, slug = ?, color = ? WHERE id = ?", [...params, id]);
  } else {
    db.run("INSERT INTO labels (name, slug, color) VALUES (?, ?, ?)", params);
  }
  await saveDb();
  revalidatePath("/admin");
  revalidatePath("/marketplace");
}
