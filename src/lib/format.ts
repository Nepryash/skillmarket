import type { Compatibility, ListingType } from "@/types";

export function formatListingType(type: ListingType) {
  if (type === "skill") return "Skill";
  if (type === "plugin") return "Plugin";
  if (type === "model") return "Model";
  if (type === "prompt") return "Prompt";
  return "GitHub Repo";
}

export function formatCompatibility(compatibility: Compatibility) {
  if (compatibility === "claude_code") return "Claude Code";
  if (compatibility === "codex") return "Codex";
  if (compatibility === "local_lm") return "Local LM";
  if (compatibility === "not_applicable") return "";
  return "Claude Code + Codex";
}
