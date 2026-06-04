import type { Compatibility, ListingType } from "@/types";

export function formatListingType(type: ListingType) {
  if (type === "skill") return "Skill";
  if (type === "plugin") return "Plugin";
  return "Model";
}

export function formatCompatibility(compatibility: Compatibility) {
  if (compatibility === "claude_code") return "Claude Code";
  if (compatibility === "codex") return "Codex";
  if (compatibility === "local_lm") return "Local LM";
  return "Claude Code + Codex";
}
