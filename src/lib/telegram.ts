import type { Listing } from "@/types";

export function telegramBotUsername() {
  return process.env.TELEGRAM_BOT_USERNAME || "skillmarket_bot";
}

export function telegramStartUrl(listingSlug: string) {
  return `https://t.me/${telegramBotUsername()}?start=${encodeURIComponent(listingSlug)}`;
}

export function listingTelegramMessage(listing: Listing) {
  const commands = listing.commands.map((command) => `${command.label}: ${command.command}`).join("\n");
  return [
    `${listing.title}`,
    listing.description,
    "",
    `Install: ${listing.installUrl}`,
    `Source: ${listing.githubUrl}`,
    commands ? `\nCommands:\n${commands}` : ""
  ].join("\n");
}
