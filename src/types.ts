export type ListingType = "skill" | "plugin";
export type Compatibility = "claude_code" | "codex" | "both";
export type ListingStatus = "draft" | "published" | "archived";

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
};

export type Label = {
  id: number;
  name: string;
  slug: string;
  color: string;
};

export type Command = {
  id: number;
  listingId: number;
  label: string;
  command: string;
  sortOrder: number;
};

export type Listing = {
  id: number;
  type: ListingType;
  title: string;
  slug: string;
  description: string;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  compatibility: Compatibility;
  installUrl: string;
  githubUrl: string;
  status: ListingStatus;
  featured: boolean;
  labels: Label[];
  commands: Command[];
  createdAt: string;
  updatedAt: string;
};

export type ListingFilters = {
  query?: string;
  type?: ListingType | "all";
  compatibility?: Compatibility | "all";
  category?: string;
  label?: string;
};
