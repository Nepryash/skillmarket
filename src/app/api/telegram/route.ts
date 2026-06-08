import { NextResponse } from "next/server";
import { getListingBySlug } from "@/lib/marketplace";
import {
  listingTelegramMessage,
  parseTelegramListingSlug,
  telegramBotToken,
  telegramFallbackMessage,
  telegramListingNotFoundMessage
} from "@/lib/telegram";

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

async function sendTelegramMessage(chatId: string | number, text: string) {
  const token = telegramBotToken();
  if (!token) {
    console.error("Telegram bot token is not configured");
    return { ok: false, status: 500, error: "Telegram bot token is not configured" };
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true
      })
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error("Telegram sendMessage failed", response.status, body);
    }

    return { ok: response.ok, status: response.status };
  } catch (error) {
    console.error("Telegram sendMessage request failed", error);
    return { ok: false, status: 502, error: "Telegram sendMessage request failed" };
  }
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
    if (chatId) {
      const result = await sendTelegramMessage(chatId, telegramFallbackMessage());
      return NextResponse.json(result, { status: result.ok ? 200 : result.status });
    }

    return NextResponse.json({
      ok: true,
      message: telegramFallbackMessage()
    });
  }

  const payload = await getListingPayload(slug);
  if (!payload) {
    if (chatId) {
      const result = await sendTelegramMessage(chatId, telegramListingNotFoundMessage(slug));
      return NextResponse.json(result, { status: result.ok ? 200 : result.status });
    }

    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  if (chatId) {
    const result = await sendTelegramMessage(chatId, payload.message);
    return NextResponse.json(result, { status: result.ok ? 200 : result.status });
  }

  return NextResponse.json({
    method: "sendMessage",
    chat_id: chatId,
    text: payload.message,
    disable_web_page_preview: true
  });
}
