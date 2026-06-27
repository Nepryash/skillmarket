export const landingCategories = [
  { name: "Coding", slug: "coding", icon: "tabler:code", description: "Build, review, debug, and ship software." },
  { name: "Productivity", slug: "productivity", icon: "tabler:checklist", description: "Plan work, manage context, and move faster." },
  { name: "Creativity", slug: "creativity", icon: "tabler:palette", description: "Design, prototype, animate, and explore visuals." },
  { name: "Automation", slug: "automation", icon: "tabler:robot", description: "Connect workflows, agents, tools, and services." },
  { name: "Content", slug: "content", icon: "tabler:article", description: "Draft prompts, copy, docs, scripts, and media." }
] as const;

export type LandingCategory = (typeof landingCategories)[number];
