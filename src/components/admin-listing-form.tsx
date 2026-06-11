"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Save } from "lucide-react";
import { upsertListingAction } from "@/app/admin/actions";
import type { Category, Label, Listing, ListingType, Compatibility } from "@/types";
import { formatListingType } from "@/lib/format";

type AdminListingFormProps = {
  categories: Category[];
  labels: Label[];
  listing?: Listing | null;
};

const listingTypes: Array<ListingType> = ["skill", "plugin", "model", "prompt", "github_repo"];
const compatibilities: Array<Compatibility> = ["claude_code", "codex", "both", "local_lm", "not_applicable"];
const statuses = ["draft", "published", "archived"] as const;

export function AdminListingForm({ categories, labels, listing }: AdminListingFormProps) {
  const initialType = listing?.type ?? "skill";
  const [selectedType, setSelectedType] = useState<ListingType>(initialType);
  const selectedLabelIds = useMemo(() => new Set(listing?.labels.map((label) => label.id) ?? []), [listing]);

  const showPromptField = selectedType === "prompt";
  const showInstallField = selectedType !== "prompt" && selectedType !== "github_repo";
  const showSourceField = selectedType !== "prompt";

  return (
    <form className="admin-form" action={upsertListingAction}>
      <input type="hidden" name="id" value={listing?.id ?? 0} />
      <div className="admin-form-grid">
        <label>
          Title
          <input name="title" required defaultValue={listing?.title} />
        </label>
        <label>
          Slug
          <input name="slug" required defaultValue={listing?.slug} />
        </label>
        <label>
          Iconify icon
          <input name="icon" required defaultValue={listing?.icon ?? "tabler:box"} />
        </label>
        <label>
          Type
          <select
            name="type"
            defaultValue={initialType}
            onChange={(event) => setSelectedType(event.target.value as ListingType)}
          >
            {listingTypes.map((type) => (
              <option key={type} value={type}>
                {formatListingType(type)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Compatibility
          <select
            name="compatibility"
            defaultValue={listing?.compatibility ?? (initialType === "prompt" ? "not_applicable" : "codex")}
          >
            {compatibilities.map((compatibility) => (
              <option key={compatibility} value={compatibility}>
                {compatibility === "not_applicable" ? "Not applicable" : compatibility === "claude_code" ? "Claude Code" : compatibility === "codex" ? "Codex" : compatibility === "local_lm" ? "Local LM" : "Claude Code + Codex"}
              </option>
            ))}
          </select>
        </label>
        <label>
          Category
          <select name="categoryId" defaultValue={listing?.categoryId ?? categories[0]?.id} required>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select name="status" defaultValue={listing?.status ?? "draft"}>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="admin-check">
          <input name="featured" type="checkbox" defaultChecked={listing?.featured} />
          Featured
        </label>
      </div>

      <label>
        Description
        <textarea name="description" required defaultValue={listing?.description} />
      </label>

      {showPromptField ? (
        <label>
          Prompt
          <textarea
            name="prompt"
            required
            rows={7}
            placeholder="Paste the prompt text here"
            defaultValue={listing?.prompt}
          />
        </label>
      ) : null}

      <div className="admin-form-grid">
        {showInstallField ? (
          <label>
            Install URL or command
            <input
              name="installUrl"
              required={showInstallField}
              defaultValue={listing?.installUrl}
              placeholder="https://..."
            />
          </label>
        ) : null}
        {showSourceField ? (
          <label>
            {selectedType === "github_repo" ? "Repository URL" : "Source URL"}
            <input
              name="githubUrl"
              required={selectedType === "github_repo" || selectedType === "skill" || selectedType === "plugin" || selectedType === "model"}
              defaultValue={listing?.githubUrl}
              placeholder="https://github.com/..."
            />
          </label>
        ) : null}
      </div>

      <fieldset>
        <legend>Labels</legend>
        <div className="admin-checkbox-grid">
          {labels.map((label) => (
            <label className="admin-check" key={label.id}>
              <input name="labelIds" type="checkbox" value={label.id} defaultChecked={selectedLabelIds.has(label.id)} />
              {label.name}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>What it can do</legend>
        {[0, 1, 2, 3, 4].map((index) => {
          const bullet = listing?.bullets[index];
          const row = index + 1;
          return (
            <input
              key={row}
              name={`bullet${row}`}
              placeholder={`Bullet point ${row}`}
              defaultValue={bullet?.text}
            />
          );
        })}
      </fieldset>

      <fieldset>
        <legend>Commands</legend>
        {[0, 1, 2, 3].map((index) => {
          const command = listing?.commands[index];
          const row = index + 1;
          return (
            <div className="admin-command-row" key={row}>
              <input name={`commandLabel${row}`} placeholder="Label" defaultValue={command?.label} />
              <input name={`command${row}`} placeholder="Command" defaultValue={command?.command} />
            </div>
          );
        })}
      </fieldset>

      <div className="admin-actions">
        <button className="button primary" type="submit">
          Save listing <Save size={16} aria-hidden="true" />
        </button>
        <Link className="button" href="/admin">
          Cancel
        </Link>
      </div>
    </form>
  );
}
