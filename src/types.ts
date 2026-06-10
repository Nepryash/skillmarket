export type ListingType = "skill" | "plugin" | "model";
export type Compatibility = "claude_code" | "codex" | "both" | "local_lm";
export type ListingStatus = "draft" | "published" | "archived";

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  prompt: string;
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

export type ListingBullet = {
  id: number;
  listingId: number;
  text: string;
  sortOrder: number;
};

export type Listing = {
  id: number;
  type: ListingType;
  title: string;
  slug: string;
  icon: string;
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
  bullets: ListingBullet[];
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
