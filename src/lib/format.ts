import type { Compatibility, ListingType } from "@/types";

export function formatListingType(type: ListingType) {
  return type === "skill" ? "Skill" : "Plugin";
}

export function formatCompatibility(compatibility: Compatibility) {
  if (compatibility === "claude_code") return "Claude Code";
  if (compatibility === "codex") return "Codex";
  return "Claude Code + Codex";
}
