import { loginAction } from "@/app/admin/actions";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const errorMessage =
    params.error === "rate-limited"
      ? "Too many attempts. Wait a minute and try again."
      : params.error
        ? "Invalid password."
        : "";

  return (
    <main className="page-shell admin-login">
      <form className="admin-panel admin-login-card" action={loginAction}>
        <span className="section-kicker">Admin</span>
        <h1>Sign in</h1>
        <p>Use the configured admin password to manage marketplace content.</p>
        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
        <label>
          Password
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        <button className="button primary" type="submit">
          Continue
        </button>
      </form>
    </main>
  );
}
