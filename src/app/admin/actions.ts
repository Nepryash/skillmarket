"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdminClient } from "@/lib/supabase-server";
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

async function deleteListingRelations(listingId: number) {
  const db = getSupabaseAdminClient();
  const [labelsResult, commandsResult] = await Promise.all([
    db.from("listing_labels").delete().eq("listing_id", listingId),
    db.from("commands").delete().eq("listing_id", listingId)
  ]);

  if (labelsResult.error) throw labelsResult.error;
  if (commandsResult.error) throw commandsResult.error;
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
  const db = getSupabaseAdminClient();
  const listingId = Number(value(formData, "id"));
  const timestamp = now();
  const payload = {
    type: value(formData, "type") as ListingType,
    title: value(formData, "title"),
    slug: value(formData, "slug"),
    icon: value(formData, "icon") || "tabler:box",
    description: value(formData, "description"),
    category_id: Number(value(formData, "categoryId")),
    compatibility: value(formData, "compatibility") as Compatibility,
    install_url: value(formData, "installUrl"),
    github_url: value(formData, "githubUrl"),
    status: value(formData, "status") as ListingStatus,
    featured: Boolean(formData.get("featured")),
    updated_at: timestamp
  };

  let id = listingId;

  if (listingId > 0) {
    const { error } = await db.from("listings").update(payload).eq("id", listingId).select("id").single();
    if (error) throw error;
    await deleteListingRelations(listingId);
  } else {
    const insertResult = await db.from("listings").insert({
      ...payload,
      created_at: timestamp
    }).select("id").single();

    if (insertResult.error) throw insertResult.error;
    id = insertResult.data.id;
  }

  const labelIds = selectedValues(formData, "labelIds")
    .map((labelId) => Number(labelId))
    .filter((labelId) => Number.isInteger(labelId) && labelId > 0);

  if (labelIds.length > 0) {
    const { error } = await db.from("listing_labels").insert(
      labelIds.map((labelId) => ({
        listing_id: id,
        label_id: labelId
      }))
    );
    if (error) throw error;
  }

  const commands = Array.from({ length: 4 }, (_, index) => {
    const row = index + 1;
    return {
      label: value(formData, `commandLabel${row}`),
      command: value(formData, `command${row}`),
      sort_order: row
    };
  }).filter((row) => row.label && row.command);

  if (commands.length > 0) {
    const { error } = await db.from("commands").insert(
      commands.map((command) => ({
        listing_id: id,
        label: command.label,
        command: command.command,
        sort_order: command.sort_order
      }))
    );
    if (error) throw error;
  }

  revalidatePath("/");
  revalidatePath("/marketplace");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function archiveListingAction(formData: FormData) {
  await requireAdmin();
  const db = getSupabaseAdminClient();
  const { error } = await db
    .from("listings")
    .update({ status: "archived", updated_at: now() })
    .eq("id", parseId(formData, "id"))
    .select("id")
    .single();
  if (error) throw error;
  revalidatePath("/marketplace");
  revalidatePath("/admin");
}

export async function upsertCategoryAction(formData: FormData) {
  await requireAdmin();
  const db = getSupabaseAdminClient();
  const id = Number(value(formData, "id"));
  const payload = {
    name: value(formData, "name"),
    slug: value(formData, "slug"),
    description: value(formData, "description"),
    sort_order: Number(value(formData, "sortOrder"))
  };

  if (id > 0) {
    const { error } = await db.from("categories").update(payload).eq("id", id).select("id").single();
    if (error) throw error;
  } else {
    const { error } = await db.from("categories").insert(payload);
    if (error) throw error;
  }

  revalidatePath("/admin");
  revalidatePath("/marketplace");
}

export async function upsertLabelAction(formData: FormData) {
  await requireAdmin();
  const db = getSupabaseAdminClient();
  const id = Number(value(formData, "id"));
  const payload = {
    name: value(formData, "name"),
    slug: value(formData, "slug"),
    color: value(formData, "color") || "#FBFF12"
  };

  if (id > 0) {
    const { error } = await db.from("labels").update(payload).eq("id", id).select("id").single();
    if (error) throw error;
  } else {
    const { error } = await db.from("labels").insert(payload);
    if (error) throw error;
  }

  revalidatePath("/admin");
  revalidatePath("/marketplace");
}
