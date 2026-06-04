import Link from "next/link";
import { Save } from "lucide-react";
import { upsertListingAction } from "@/app/admin/actions";
import type { Category, Label, Listing } from "@/types";
import { formatCompatibility, formatListingType } from "@/lib/format";

type AdminListingFormProps = {
  categories: Category[];
  labels: Label[];
  listing?: Listing | null;
};

const listingTypes = ["skill", "plugin", "model"] as const;
const compatibilities = ["claude_code", "codex", "both", "local_lm"] as const;
const statuses = ["draft", "published", "archived"] as const;

export function AdminListingForm({ categories, labels, listing }: AdminListingFormProps) {
  const selectedLabelIds = new Set(listing?.labels.map((label) => label.id) ?? []);

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
          <select name="type" defaultValue={listing?.type ?? "skill"}>
            {listingTypes.map((type) => (
              <option key={type} value={type}>
                {formatListingType(type)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Compatibility
          <select name="compatibility" defaultValue={listing?.compatibility ?? "codex"}>
            {compatibilities.map((compatibility) => (
              <option key={compatibility} value={compatibility}>
                {formatCompatibility(compatibility)}
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

      <div className="admin-form-grid">
        <label>
          Install URL
          <input name="installUrl" type="url" required defaultValue={listing?.installUrl} />
        </label>
        <label>
          Source URL
          <input name="githubUrl" type="url" required defaultValue={listing?.githubUrl} />
        </label>
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
