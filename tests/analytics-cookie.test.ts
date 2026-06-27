import assert from "node:assert/strict";
import test from "node:test";
import { isAnalyticsOptOutCookieEnabled } from "../src/lib/analytics-cookie";

test("isAnalyticsOptOutCookieEnabled only accepts the opt-out value", () => {
  assert.equal(isAnalyticsOptOutCookieEnabled("1"), true);
  assert.equal(isAnalyticsOptOutCookieEnabled("0"), false);
  assert.equal(isAnalyticsOptOutCookieEnabled("true"), false);
  assert.equal(isAnalyticsOptOutCookieEnabled(null), false);
});
