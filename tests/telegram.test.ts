import assert from "node:assert/strict";
import test from "node:test";
import { listingTelegramMessage, parseTelegramListingSlug, telegramBotToken } from "../src/lib/telegram";
import type { Listing } from "../src/types";

const listing: Listing = {
  id: 1,
  type: "model",
  title: "Qwen2.5 Coder 7B Instruct",
  slug: "qwen25-coder-7b-instruct",
  icon: "tabler:brain",
  description: "A downloadable coding-focused local LM.",
  categoryId: 5,
  categoryName: "Local Models",
  categorySlug: "local-models",
  compatibility: "local_lm",
  installUrl: "https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct",
  githubUrl: "https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct",
  status: "published",
  featured: true,
  labels: [
    { id: 1, name: "Hugging Face", slug: "huggingface", color: "#FBFF12" },
    { id: 2, name: "Code Model", slug: "code-model", color: "#80727B" }
  ],
  commands: [
    {
      id: 1,
      listingId: 1,
      label: "Install CLI",
      command: "pip install -U huggingface_hub transformers",
      sortOrder: 1
    },
    {
      id: 2,
      listingId: 1,
      label: "Download",
      command: "huggingface-cli download Qwen/Qwen2.5-Coder-7B-Instruct --local-dir models/qwen2.5-coder-7b",
      sortOrder: 2
    }
  ],
  createdAt: "2026-06-06T00:00:00.000Z",
  updatedAt: "2026-06-06T00:00:00.000Z"
};

test("listingTelegramMessage includes a broader listing summary and copyable download command", () => {
  const message = listingTelegramMessage(listing);

  assert.match(message, /What it is:/);
  assert.match(message, /Qwen2\.5 Coder 7B Instruct is a model in Local Models/);
  assert.match(message, /Compatibility: Local LM/);
  assert.match(message, /Best for:/);
  assert.match(message, /Download command:/);
  assert.match(message, /huggingface-cli download Qwen\/Qwen2\.5-Coder-7B-Instruct/);
  assert.match(message, /All commands:/);
});

test("parseTelegramListingSlug accepts a private deep link command", () => {
  assert.equal(parseTelegramListingSlug("/start qwen25-coder-7b-instruct"), "qwen25-coder-7b-instruct");
});

test("parseTelegramListingSlug accepts a bot mention start command", () => {
  assert.equal(parseTelegramListingSlug("/start@skilhub_bot qwen25-coder-7b-instruct"), "qwen25-coder-7b-instruct");
});

test("parseTelegramListingSlug accepts a raw listing slug fallback", () => {
  assert.equal(parseTelegramListingSlug("qwen25-coder-7b-instruct"), "qwen25-coder-7b-instruct");
});

test("telegramBotToken ignores placeholder values", () => {
  const previous = process.env.TELEGRAM_BOT_TOKEN;
  process.env.TELEGRAM_BOT_TOKEN = "replace-with-your-telegram-bot-token";

  try {
    assert.equal(telegramBotToken(), "");
  } finally {
    process.env.TELEGRAM_BOT_TOKEN = previous;
  }
});
