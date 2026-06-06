import fs from "node:fs";
import path from "node:path";
import initSqlJs from "sql.js";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "skillmarket.db");

fs.mkdirSync(dataDir, { recursive: true });

async function main() {
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }

  const SQL = await initSqlJs();
  const db = new SQL.Database();
  db.run("PRAGMA foreign_keys = ON");

  db.exec(`
  CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE labels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL
  );

  CREATE TABLE listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK (type IN ('skill', 'plugin', 'model')),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL,
    description TEXT NOT NULL,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    compatibility TEXT NOT NULL CHECK (compatibility IN ('claude_code', 'codex', 'both', 'local_lm')),
    install_url TEXT NOT NULL,
    github_url TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'archived')),
    featured INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE listing_labels (
    listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    label_id INTEGER NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
    PRIMARY KEY (listing_id, label_id)
  );

  CREATE TABLE commands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    command TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE analytics_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    listing_id INTEGER REFERENCES listings(id) ON DELETE SET NULL,
    category_slug TEXT,
    label_slug TEXT,
    search_query TEXT,
    result_count INTEGER,
    target_url TEXT,
    path TEXT,
    created_at TEXT NOT NULL
  );
  `);

  function run(sql: string, params: Array<string | number> = []) {
    db.run(sql, params);
    return Number(db.exec("SELECT last_insert_rowid() AS id")[0].values[0][0]);
  }

const now = new Date().toISOString();

const categoryIds = new Map<string, number>();
  [
  ["Frontend", "frontend", "UI, web apps, visual polish, and frontend workflows", 1],
  ["Automation", "automation", "Repeatable agent workflows and productivity shortcuts", 2],
  ["Design", "design", "Figma, UI review, visual systems, and design execution", 3],
  ["DevOps", "devops", "Deployment, CI, release, and hosting workflows", 4],
  ["Local Models", "local-models", "Downloadable local LMs for offline coding, chat, and agent workflows", 5]
  ].forEach(([name, slug, description, sortOrder]) => {
    const id = run("INSERT INTO categories (name, slug, description, sort_order) VALUES (?, ?, ?, ?)", [
      name,
      slug,
      description,
      Number(sortOrder)
    ]);
    categoryIds.set(String(slug), id);
  });

const labelIds = new Map<string, number>();
  [
  ["MVP", "mvp", "#FBFF12"],
  ["Planning", "planning", "#FFFFFF"],
  ["Automation", "automation", "#80727B"],
  ["UI", "ui", "#80727B"],
  ["Design System", "design-system", "#FBFF12"],
  ["React", "react", "#80727B"],
  ["Video", "video", "#FFFFFF"],
  ["MCP", "mcp", "#FBFF12"],
  ["Telegram", "telegram", "#80727B"],
  ["Templates", "templates", "#FFFFFF"],
  ["Workflow", "workflow", "#FBFF12"],
  ["Brainstorming", "brainstorming", "#80727B"],
  ["Next.js", "nextjs", "#FBFF12"],
  ["GitHub", "github", "#FFFFFF"],
  ["Vercel", "vercel", "#80727B"],
  ["3D", "3d", "#FBFF12"],
  ["Hugging Face", "huggingface", "#FBFF12"],
  ["Local LM", "local-lm", "#FFFFFF"],
  ["Code Model", "code-model", "#80727B"],
  ["Small Model", "small-model", "#FBFF12"]
  ].forEach(([name, slug, color]) => {
    const id = run("INSERT INTO labels (name, slug, color) VALUES (?, ?, ?)", [name, slug, color]);
    labelIds.set(String(slug), id);
  });

  const listings = [
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
] as const;

  for (const listing of listings) {
    const categoryId = categoryIds.get(listing.category);
    if (!categoryId) throw new Error(`Missing category ${listing.category}`);

    const listingId = run(
      `INSERT INTO listings (
      type, title, slug, icon, description, category_id, compatibility, install_url, github_url, status, featured, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        listing.type,
        listing.title,
        listing.slug,
        listing.icon,
        listing.description,
        categoryId,
        listing.compatibility,
        listing.installUrl,
        listing.githubUrl,
        "published",
        listing.featured,
        now,
        now
      ]
    );

    listing.labels.forEach((labelSlug) => {
      const labelId = labelIds.get(labelSlug);
      if (!labelId) throw new Error(`Missing label ${labelSlug}`);
      run("INSERT INTO listing_labels (listing_id, label_id) VALUES (?, ?)", [listingId, labelId]);
    });

    listing.commands.forEach(([label, command], index) => {
      run("INSERT INTO commands (listing_id, label, command, sort_order) VALUES (?, ?, ?, ?)", [
        listingId,
        label,
        command,
        index + 1
      ]);
    });
  }

  fs.writeFileSync(dbPath, Buffer.from(db.export()));
  db.close();

  console.log(`Seeded ${listings.length} listings into ${dbPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
