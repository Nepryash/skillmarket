import { loginAction } from "@/app/admin/actions";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="page-shell admin-login">
      <form className="admin-panel admin-login-card" action={loginAction}>
        <span className="section-kicker">Admin</span>
        <h1>Sign in</h1>
        <p>Use the configured admin password to manage marketplace content.</p>
        {params.error ? <p className="form-error">Invalid password.</p> : null}
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
