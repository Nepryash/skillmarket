import type { Category, Label, ListingFilters } from "@/types";

type MarketplaceFiltersProps = {
  categories: Category[];
  labels: Label[];
  filters: ListingFilters;
};

export function MarketplaceFilters({ categories, labels, filters }: MarketplaceFiltersProps) {
  return (
    <form className="filter-panel" action="/marketplace">
      <label>
        Search
        <input name="q" placeholder="skill, MCP, prompt, repo..." defaultValue={filters.query ?? ""} />
      </label>

      <label>
        Type
        <select name="type" defaultValue={filters.type ?? "all"}>
          <option value="all">All</option>
          <option value="skill">Skills</option>
          <option value="plugin">Plugins</option>
          <option value="model">Local models</option>
        </select>
      </label>

      <label>
        Compatibility
        <select name="compatibility" defaultValue={filters.compatibility ?? "all"}>
          <option value="all">All</option>
          <option value="claude_code">Claude Code</option>
          <option value="codex">Codex</option>
          <option value="both">Both</option>
          <option value="local_lm">Local LM</option>
        </select>
      </label>

      <label>
        Main category
        <select name="category" defaultValue={filters.category ?? "all"}>
          <option value="all">All</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Use case / label
        <select name="label" defaultValue={filters.label ?? "all"}>
          <option value="all">All</option>
          {labels.map((label) => (
            <option key={label.id} value={label.slug}>
              {label.name}
            </option>
          ))}
        </select>
      </label>

      <button className="button primary" type="submit">
        Apply filters
      </button>
    </form>
  );
}
