import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const cookieName = "skillmarket_admin";

function adminPassword() {
  if (process.env.SKILLMARKET_ADMIN_PASSWORD) return process.env.SKILLMARKET_ADMIN_PASSWORD;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SKILLMARKET_ADMIN_PASSWORD is required in production.");
  }
  return "admin";
}

function sessionValue() {
  return `admin:${adminPassword()}`;
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(cookieName)?.value === sessionValue();
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
}

export async function signInAdmin(password: string) {
  if (password !== adminPassword()) return false;

  const cookieStore = await cookies();
  cookieStore.set(cookieName, sessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
  return true;
}

export async function signOutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}
