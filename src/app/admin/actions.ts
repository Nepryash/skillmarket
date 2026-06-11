"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseAdminClient } from "@/lib/supabase-server";
import { requireAdmin, signInAdmin, signOutAdmin } from "@/lib/admin-auth";
import { checkRateLimit, clientRateLimitKey } from "@/lib/rate-limit";
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
  const [labelsResult, commandsResult, bulletsResult] = await Promise.all([
    db.from("listing_labels").delete().eq("listing_id", listingId),
    db.from("commands").delete().eq("listing_id", listingId),
    db.from("listing_bullets").delete().eq("listing_id", listingId)
  ]);

  if (labelsResult.error) throw labelsResult.error;
  if (commandsResult.error) throw commandsResult.error;
  if (bulletsResult.error) throw bulletsResult.error;
}

export async function loginAction(formData: FormData) {
  const requestHeaders = await headers();
  const rateLimit = checkRateLimit(clientRateLimitKey(requestHeaders, "admin-login"), 8, 60 * 1000);
  if (!rateLimit.allowed) redirect("/admin/login?error=rate-limited");

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
  const type = value(formData, "type") as ListingType;
  const prompt = value(formData, "prompt");
  const installUrl = value(formData, "installUrl");
  const githubUrl = value(formData, "githubUrl");
  const compatibilityValue = value(formData, "compatibility") as Compatibility;
  const compatibility = type === "prompt" ? "not_applicable" : compatibilityValue || "not_applicable";

  if (type === "prompt" && !prompt) {
    throw new Error("Prompt listings require prompt text");
  }

  if (type === "github_repo" && !githubUrl) {
    throw new Error("GitHub repo listings require a source URL");
  }

  if (type !== "prompt" && type !== "github_repo" && !installUrl) {
    throw new Error("Listings require an install URL or command");
  }

  if (type !== "prompt" && !githubUrl) {
    throw new Error("Listings require a source URL");
  }

  const payload = {
    type,
    title: value(formData, "title"),
    slug: value(formData, "slug"),
    icon: value(formData, "icon") || "tabler:box",
    description: value(formData, "description"),
    prompt,
    category_id: Number(value(formData, "categoryId")),
    compatibility,
    install_url: type === "prompt" ? "" : type === "github_repo" ? "" : installUrl,
    github_url: type === "prompt" ? "" : githubUrl,
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

  const bullets = Array.from({ length: 5 }, (_, index) => {
    const row = index + 1;
    return {
      text: value(formData, `bullet${row}`),
      sort_order: row
    };
  }).filter((row) => row.text);

  if (bullets.length > 0) {
    const { error } = await db.from("listing_bullets").insert(
      bullets.map((bullet) => ({
        listing_id: id,
        text: bullet.text,
        sort_order: bullet.sort_order
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
    prompt: value(formData, "prompt"),
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
