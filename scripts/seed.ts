import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";

loadEnvConfig(process.cwd());

type SeedCategory = {
  name: string;
  slug: string;
  description: string;
  prompt: string;
  sortOrder: number;
};

type SeedLabel = {
  name: string;
  slug: string;
  color: string;
};

type SeedListing = {
  type: "skill" | "plugin" | "model";
  title: string;
  slug: string;
  icon: string;
  description: string;
  category: string;
  compatibility: "claude_code" | "codex" | "both" | "local_lm";
  installUrl: string;
  githubUrl: string;
  featured: number;
  labels: string[];
  commands: Array<[label: string, command: string]>;
};

const categories: SeedCategory[] = [
  {
    name: "Coding",
    slug: "coding",
    description: "Building apps, components, tools, and reusable workflows",
    prompt: "Build, refactor, test, and ship code faster.",
    sortOrder: 1
  },
  {
    name: "Design",
    slug: "design",
    description: "Figma, UI review, visual systems, and design execution",
    prompt: "Turn rough screens into clear, production-ready UI.",
    sortOrder: 2
  },
  {
    name: "Productivity",
    slug: "productivity",
    description: "Planning, automation, research, and daily workflow shortcuts",
    prompt: "Plan work, automate steps, and remove busywork.",
    sortOrder: 3
  },
  {
    name: "Local Models",
    slug: "local-models",
    description: "Downloadable local LMs for offline coding, chat, and agent workflows",
    prompt: "Run models locally for private or offline workflows.",
    sortOrder: 4
  }
];

const labels: SeedLabel[] = [
  { name: "MVP", slug: "mvp", color: "#FBFF12" },
  { name: "Planning", slug: "planning", color: "#FFFFFF" },
  { name: "Automation", slug: "automation", color: "#80727B" },
  { name: "UI", slug: "ui", color: "#80727B" },
  { name: "Design System", slug: "design-system", color: "#FBFF12" },
  { name: "React", slug: "react", color: "#80727B" },
  { name: "Video", slug: "video", color: "#FFFFFF" },
  { name: "MCP", slug: "mcp", color: "#FBFF12" },
  { name: "Telegram", slug: "telegram", color: "#80727B" },
  { name: "Templates", slug: "templates", color: "#FFFFFF" },
  { name: "Workflow", slug: "workflow", color: "#FBFF12" },
  { name: "Brainstorming", slug: "brainstorming", color: "#80727B" },
  { name: "Next.js", slug: "nextjs", color: "#FBFF12" },
  { name: "GitHub", slug: "github", color: "#FFFFFF" },
  { name: "Vercel", slug: "vercel", color: "#80727B" },
  { name: "3D", slug: "3d", color: "#FBFF12" },
  { name: "Hugging Face", slug: "huggingface", color: "#FBFF12" },
  { name: "Local LM", slug: "local-lm", color: "#FFFFFF" },
  { name: "Code Model", slug: "code-model", color: "#80727B" },
  { name: "Small Model", slug: "small-model", color: "#FBFF12" }
];

const listings: SeedListing[] = [
  {
    type: "model",
    title: "Qwen2.5 Coder 7B Instruct",
    slug: "qwen25-coder-7b-instruct",
    icon: "tabler:brain",
    description: "A downloadable coding-focused local LM for code generation, code reasoning, and agent-style developer workflows.",
    category: "local-models",
    compatibility: "local_lm",
    installUrl: "https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct",
    githubUrl: "https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct",
    featured: 1,
    labels: ["huggingface", "local-lm", "code-model"],
    commands: [
      ["Install CLI", "pip install -U huggingface_hub transformers"],
      ["Download", "huggingface-cli download Qwen/Qwen2.5-Coder-7B-Instruct --local-dir models/qwen2.5-coder-7b"],
      ["Transformers", "python -c \"from transformers import pipeline; pipe = pipeline('text-generation', model='Qwen/Qwen2.5-Coder-7B-Instruct')\""]
    ]
  },
  {
    type: "model",
    title: "Phi-3.5 Mini Instruct",
    slug: "phi-35-mini-instruct",
    icon: "simple-icons:microsoft",
    description: "A compact instruction model for local prototyping, lightweight chat, and offline assistant experiments.",
    category: "local-models",
    compatibility: "local_lm",
    installUrl: "https://huggingface.co/microsoft/Phi-3.5-mini-instruct",
    githubUrl: "https://huggingface.co/microsoft/Phi-3.5-mini-instruct",
    featured: 0,
    labels: ["huggingface", "local-lm", "small-model"],
    commands: [
      ["Install CLI", "pip install -U huggingface_hub transformers"],
      ["Download", "huggingface-cli download microsoft/Phi-3.5-mini-instruct --local-dir models/phi-3.5-mini"],
      ["Transformers", "python -c \"from transformers import pipeline; pipe = pipeline('text-generation', model='microsoft/Phi-3.5-mini-instruct')\""]
    ]
  },
  {
    type: "model",
    title: "Gemma 2 2B IT",
    slug: "gemma-2-2b-it",
    icon: "simple-icons:google",
    description: "A small instruction-tuned local model suited for laptop-friendly experiments and fast offline demos.",
    category: "local-models",
    compatibility: "local_lm",
    installUrl: "https://huggingface.co/google/gemma-2-2b-it",
    githubUrl: "https://huggingface.co/google/gemma-2-2b-it",
    featured: 0,
    labels: ["huggingface", "local-lm", "small-model"],
    commands: [
      ["Install CLI", "pip install -U huggingface_hub transformers"],
      ["Download", "huggingface-cli download google/gemma-2-2b-it --local-dir models/gemma-2-2b-it"],
      ["Transformers", "python -c \"from transformers import pipeline; pipe = pipeline('text-generation', model='google/gemma-2-2b-it')\""]
    ]
  },
  {
    type: "skill",
    title: "Frontend App Builder",
    slug: "frontend-app-builder",
    icon: "tabler:layout-dashboard",
    description: "Build polished frontend applications, dashboards, landing pages, and visually driven product screens.",
    category: "frontend",
    compatibility: "codex",
    installUrl: "https://github.com/openai/codex",
    githubUrl: "https://github.com/openai/codex",
    featured: 1,
    labels: ["ui", "nextjs", "mvp"],
    commands: [
      ["Use Skill", "$frontend-app-builder"],
      ["Run App", "npm run dev"]
    ]
  },
  {
    type: "plugin",
    title: "Figma Plugin Pack",
    slug: "figma-plugin-pack",
    icon: "simple-icons:figma",
    description: "Design-to-code, diagram generation, Code Connect, and Figma asset workflows for agentic builds.",
    category: "design",
    compatibility: "codex",
    installUrl: "https://www.figma.com/",
    githubUrl: "https://github.com/figma",
    featured: 1,
    labels: ["ui", "planning"],
    commands: [
      ["Get Design Context", "Use figma:get_design_context"],
      ["Generate Diagram", "Use figma:generate_diagram"]
    ]
  },
  {
    type: "skill",
    title: "3D Web Experience",
    slug: "3d-web-experience",
    icon: "tabler:box",
    description: "Plan and build immersive Three.js experiences with strong browser verification.",
    category: "frontend",
    compatibility: "both",
    installUrl: "https://threejs.org/",
    githubUrl: "https://github.com/mrdoob/three.js",
    featured: 0,
    labels: ["3d", "ui"],
    commands: [
      ["Use Skill", "$3d-web-experience"],
      ["Install Three", "npm install three"]
    ]
  },
  {
    type: "plugin",
    title: "Netlify Deploy Toolkit",
    slug: "netlify-deploy-toolkit",
    icon: "simple-icons:netlify",
    description: "Deploy and configure modern web apps on Netlify with framework-specific guidance.",
    category: "devops",
    compatibility: "codex",
    installUrl: "https://docs.netlify.com/",
    githubUrl: "https://github.com/netlify",
    featured: 0,
    labels: ["vercel", "github"],
    commands: [
      ["Deploy", "netlify deploy"],
      ["Production", "netlify deploy --prod"]
    ]
  },
  {
    type: "skill",
    title: "UI/UX Pro Max",
    slug: "ui-ux-pro-max",
    icon: "tabler:palette",
    description: "AI design intelligence for UI/UX planning, color systems, typography, accessibility, and chart guidance.",
    category: "design",
    compatibility: "both",
    installUrl: "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill",
    githubUrl: "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill",
    featured: 0,
    labels: ["design-system", "ui", "planning"],
    commands: [
      ["Install CLI", "npm install -g uipro-cli"],
      ["Claude", "uipro init --ai claude"],
      ["Codex", "uipro init --ai codex"]
    ]
  },
  {
    type: "plugin",
    title: "Remotion",
    slug: "remotion",
    icon: "tabler:video",
    description: "Build videos programmatically with React, then render them through a CLI-first workflow.",
    category: "frontend",
    compatibility: "both",
    installUrl: "https://remotion.dev/docs",
    githubUrl: "https://github.com/remotion-dev/remotion",
    featured: 0,
    labels: ["react", "video", "workflow"],
    commands: [
      ["Create Project", "npx create-video@latest"],
      ["Render", "npx remotion render"]
    ]
  },
  {
    type: "plugin",
    title: "Blender MCP",
    slug: "blender-mcp",
    icon: "simple-icons:blender",
    description: "Connect Blender to MCP clients for natural-language 3D scene and automation workflows.",
    category: "design",
    compatibility: "both",
    installUrl: "https://github.com/ahujasid/blender-mcp",
    githubUrl: "https://github.com/ahujasid/blender-mcp",
    featured: 0,
    labels: ["3d", "mcp", "automation"],
    commands: [
      ["Install", "uv tool install -U blender-mcp"],
      ["Run", "blender-mcp"],
      ["Claude", "claude mcp add blender-mcp uvx blender-mcp"]
    ]
  },
  {
    type: "skill",
    title: "Impeccable",
    slug: "impeccable",
    icon: "tabler:brush",
    description: "A frontend design skill for turning rough interfaces into polished, accessible UI.",
    category: "design",
    compatibility: "both",
    installUrl: "https://impeccable.style",
    githubUrl: "https://github.com/pbakaus/impeccable",
    featured: 0,
    labels: ["design-system", "ui", "workflow"],
    commands: [
      ["Install", "npx impeccable skills install"],
      ["Claude", "/plugin marketplace add pbakaus/impeccable"]
    ]
  },
  {
    type: "plugin",
    title: "Claude Code Templates",
    slug: "claude-code-templates",
    icon: "tabler:template",
    description: "A template hub for Claude Code with ready-made agents, commands, settings, hooks, and MCP integrations.",
    category: "automation",
    compatibility: "both",
    installUrl: "https://github.com/davila7/claude-code-templates",
    githubUrl: "https://github.com/davila7/claude-code-templates",
    featured: 0,
    labels: ["templates", "workflow", "brainstorming"],
    commands: [
      ["Browse", "npx claude-code-templates@latest"],
      ["Scroll Skill", "npx claude-code-templates@latest --skill creative-design/scroll-experience --yes"],
      ["Review Agent", "npx claude-code-templates@latest --agent development-tools/code-reviewer --yes"]
    ]
  },
  {
    type: "skill",
    title: "React Best Practices",
    slug: "react-best-practices",
    icon: "simple-icons:react",
    description: "A focused React skill for component structure, performance, maintainability, and modern frontend patterns.",
    category: "frontend",
    compatibility: "both",
    installUrl: "https://aitmpl.com/component/skill/web-development/react-best-practices",
    githubUrl: "https://aitmpl.com/component/skill/web-development/react-best-practices",
    featured: 0,
    labels: ["react", "ui", "workflow"],
    commands: [
      ["Use Skill", "npx claude-code-templates@latest --skill web-development/react-best-practices --yes"],
      ["Browse", "npx claude-code-templates@latest"]
    ]
  },
  {
    type: "skill",
    title: "Superpowers",
    slug: "superpowers",
    icon: "tabler:brain",
    description: "An agentic skills framework for planning, execution, review, and clean delivery.",
    category: "automation",
    compatibility: "both",
    installUrl: "https://github.com/obra/superpowers",
    githubUrl: "https://github.com/obra/superpowers",
    featured: 0,
    labels: ["planning", "workflow", "brainstorming"],
    commands: [
      ["Install", "/plugin marketplace add obra/superpowers"],
      ["Gemini", "gemini extensions install https://github.com/obra/superpowers"]
    ]
  },
  {
    type: "skill",
    title: "Takopi",
    slug: "takopi",
    icon: "simple-icons:telegram",
    description: "A Telegram bridge for AI coding agents with remote task execution, progress streaming, and session resume.",
    category: "automation",
    compatibility: "both",
    installUrl: "https://github.com/banteg/takopi",
    githubUrl: "https://github.com/banteg/takopi",
    featured: 0,
    labels: ["telegram", "workflow", "automation"],
    commands: [
      ["Install", "uv tool install -U takopi"],
      ["Onboard", "takopi --onboard"],
      ["Doctor", "takopi doctor"]
    ]
  },
  {
    type: "skill",
    title: "GSD",
    slug: "get-shit-done",
    icon: "tabler:route",
    description: "A spec-driven workflow for planning, researching, executing, verifying, and shipping software phases.",
    category: "automation",
    compatibility: "both",
    installUrl: "https://github.com/gsd-build/get-shit-done",
    githubUrl: "https://github.com/gsd-build/get-shit-done",
    featured: 0,
    labels: ["planning", "workflow", "mvp"],
    commands: [
      ["New Project", "/gsd:new-project"],
      ["Plan Phase", "/gsd:plan-phase 1"],
      ["Execute Phase", "/gsd:execute-phase 1"]
    ]
  }
];

function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  if (!url || !serviceRoleKey) {
    const missing = [
      !url ? "NEXT_PUBLIC_SUPABASE_URL" : "",
      !serviceRoleKey ? "SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY" : ""
    ].filter(Boolean);

    throw new Error(`Missing Supabase seed environment variable(s): ${missing.join(", ")}.`);
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

async function main() {
  const db = createSupabaseClient();

  const clearTables = async () => {
    for (const table of ["analytics_events", "listings", "categories", "labels"] as const) {
      const { error } = await db.from(table).delete().gte("id", 0);
      if (error) throw error;
    }
  };

  await clearTables();

  const categoryInsert = await db.from("categories").insert(
    categories.map((category) => ({
      name: category.name,
      slug: category.slug,
      description: category.description,
      prompt: category.prompt,
      sort_order: category.sortOrder
    }))
  ).select("id, slug");

  if (categoryInsert.error) throw categoryInsert.error;

  const labelInsert = await db.from("labels").insert(
    labels.map((label) => ({
      name: label.name,
      slug: label.slug,
      color: label.color
    }))
  ).select("id, slug");

  if (labelInsert.error) throw labelInsert.error;

  const categoryIds = new Map((categoryInsert.data ?? []).map((row) => [row.slug, row.id] as const));
  const labelIds = new Map((labelInsert.data ?? []).map((row) => [row.slug, row.id] as const));

  const listingInsert = await db.from("listings").insert(
    listings.map((listing) => {
      const categoryId = categoryIds.get(listing.category);
      if (!categoryId) {
        throw new Error(`Missing category ${listing.category}`);
      }

      return {
        type: listing.type,
        title: listing.title,
        slug: listing.slug,
        icon: listing.icon,
        description: listing.description,
        category_id: categoryId,
        compatibility: listing.compatibility,
        install_url: listing.installUrl,
        github_url: listing.githubUrl,
        status: "published",
        featured: listing.featured,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    })
  ).select("id, slug");

  if (listingInsert.error) throw listingInsert.error;

  const listingIds = new Map((listingInsert.data ?? []).map((row) => [row.slug, row.id] as const));

  const listingLabels = listings.flatMap((listing) => {
    const listingId = listingIds.get(listing.slug);
    if (!listingId) throw new Error(`Missing listing ${listing.slug}`);

    return listing.labels.map((labelSlug) => {
      const labelId = labelIds.get(labelSlug);
      if (!labelId) throw new Error(`Missing label ${labelSlug}`);

      return {
        listing_id: listingId,
        label_id: labelId
      };
    });
  });

  const listingLabelsInsert = await db.from("listing_labels").insert(listingLabels);
  if (listingLabelsInsert.error) throw listingLabelsInsert.error;

  const commands = listings.flatMap((listing) => {
    const listingId = listingIds.get(listing.slug);
    if (!listingId) throw new Error(`Missing listing ${listing.slug}`);

    return listing.commands.map(([label, command], index) => ({
      listing_id: listingId,
      label,
      command,
      sort_order: index + 1
    }));
  });

  const commandsInsert = await db.from("commands").insert(commands);
  if (commandsInsert.error) throw commandsInsert.error;

  console.log(`Seeded ${listings.length} listings into Supabase`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
