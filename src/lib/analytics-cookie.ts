import { cookies } from "next/headers";

export const analyticsOptOutCookieName = "skillmarket_analytics_opt_out";
export const analyticsOptOutCookieValue = "1";

export function isAnalyticsOptOutCookieEnabled(value: string | null | undefined) {
  return value === analyticsOptOutCookieValue;
}

export async function isAnalyticsOptedOut() {
  const cookieStore = await cookies();
  return isAnalyticsOptOutCookieEnabled(cookieStore.get(analyticsOptOutCookieName)?.value);
}
