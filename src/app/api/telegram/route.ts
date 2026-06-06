import { NextResponse } from "next/server";
import { getListingBySlug } from "@/lib/marketplace";
import { listingTelegramMessage, parseTelegramListingSlug, telegramBotToken } from "@/lib/telegram";

async function getListingPayload(slug: string) {
  const listing = await getListingBySlug(slug);
  if (!listing) {
    return null;
  }
  return {
    slug: listing.slug,
    title: listing.title,
    installUrl: listing.installUrl,
    sourceUrl: listing.githubUrl,
    commands: listing.commands.map((command) => ({ label: command.label, command: command.command })),
    message: listingTelegramMessage(listing)
  };
}

async function resolveListing(slug: string) {
  const payload = await getListingPayload(slug);
  if (!payload) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  return NextResponse.json(payload);
}

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  return resolveListing(slug);
}

export async function POST(request: Request) {
  const update = await request.json().catch(() => null);
  const text = String(
    update?.message?.text ||
    update?.message?.caption ||
    update?.edited_message?.text ||
    update?.edited_message?.caption ||
    ""
  );
  const chatId = update?.message?.chat?.id ?? update?.edited_message?.chat?.id;
  const slug = parseTelegramListingSlug(text);

  if (!slug) {
    return NextResponse.json({
      ok: true,
      message: "Send /start listing-slug, or open the bot from a SkillMarket Telegram button."
    });
  }

  const payload = await getListingPayload(slug);
  if (!payload) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

  const token = telegramBotToken();
  if (token && chatId) {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: payload.message,
        disable_web_page_preview: true
      })
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error("Telegram sendMessage failed", response.status, body);
      return NextResponse.json({ error: "Telegram sendMessage failed", status: response.status }, { status: 502 });
    }

    return NextResponse.json({ ok: response.ok, status: response.status });
  }

  if (!token && chatId) {
    console.error("Telegram bot token is not configured");
    return NextResponse.json({ error: "Telegram bot token is not configured" }, { status: 500 });
  }

  return NextResponse.json({
    method: "sendMessage",
    chat_id: chatId,
    text: payload.message,
    disable_web_page_preview: true
  });
}
