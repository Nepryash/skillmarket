import type { Listing } from "@/types";
import { formatCompatibility, formatListingType } from "@/lib/format";

export function telegramBotUsername() {
  return process.env.TELEGRAM_BOT_USERNAME || "skillmarket_bot";
}

export function telegramBotToken() {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim() || "";
  if (!token || token.toLowerCase().includes("replace-with")) {
    return "";
  }

  return token;
}

export function telegramFallbackMessage() {
  return [
    "Open a SkillMarket listing and tap Get via Telegram.",
    "",
    "You can also send /start followed by a listing slug, for example:",
    "/start frontend-app-builder"
  ].join("\n");
}

export function telegramListingNotFoundMessage(slug: string) {
  return [
    `I could not find a SkillMarket listing for "${slug}".`,
    "",
    "Open the listing from SkillMarket and tap Get via Telegram again."
  ].join("\n");
}

export function telegramStartUrl(listingSlug: string) {
  return `https://t.me/${telegramBotUsername()}?start=${encodeURIComponent(listingSlug)}`;
}

export function parseTelegramListingSlug(input: string) {
  const text = input.trim();
  if (!text) return "";

  const startMatch = text.match(/^\/start(?:@\w+)?(?:\s+([A-Za-z0-9_-]{1,64}))?$/);
  if (startMatch) {
    return startMatch[1] ?? "";
  }

  const slugMatch = text.match(/^([a-z0-9]+(?:-[a-z0-9]+)*)$/);
  return slugMatch ? slugMatch[1] : "";
}

export function listingTelegramMessage(listing: Listing) {
  const listingType = formatListingType(listing.type).toLowerCase();
  const compatibility = formatCompatibility(listing.compatibility);
  const labels = listing.labels.map((label) => label.name).join(", ");
  const downloadCommand = findDownloadCommand(listing);
  const commands = listing.commands.map((command) => `- ${command.label}: ${command.command}`).join("\n");
  const promptText = listing.prompt?.trim() ?? "";
  const installLine = listing.installUrl ? `Install: ${listing.installUrl}` : "";
  const sourceLine = listing.githubUrl ? `Source: ${listing.githubUrl}` : "";
  const compatibilityLine = compatibility ? `Compatibility: ${compatibility}` : "";
  const workflowText = compatibility ? `${compatibility} workflows` : "general workflows";
  const bestForText =
    listing.type === "prompt"
      ? "Developers who want a ready-to-copy prompt and practical command list in one Telegram message."
      : labels
        ? `Developers working with ${labels}, especially when they need a quick, copyable setup path from SkillMarket.`
        : "Developers who want the install link, source link, and practical command list in one Telegram message.";
  const downloadFallback = listing.type === "prompt" ? "Use the prompt above." : "Use the install link above.";

  return [
    `${listing.title}`,
    "",
    "What it is:",
    `${listing.title} is a ${listingType} in ${listing.categoryName} for ${workflowText}. ${listing.description}`,
    `Category: ${listing.categoryName}`,
    compatibilityLine,
    labels ? `Tags: ${labels}` : "",
    promptText ? `Prompt:\n${promptText}` : "",
    "",
    "Best for:",
    bestForText,
    installLine,
    sourceLine,
    "",
    downloadCommand ? `Download command:\n${downloadCommand.command}` : `Download command:\n${downloadFallback}`,
    commands ? `\nAll commands:\n${commands}` : ""
  ]
    .filter(Boolean)
    .join("\n");
}

function findDownloadCommand(listing: Listing) {
  return (
    listing.commands.find((command) => /download/i.test(command.label)) ||
    listing.commands.find((command) => /install/i.test(command.label)) ||
    listing.commands[0]
  );
}
