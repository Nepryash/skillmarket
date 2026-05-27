import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell section">
      <div className="empty-state">
        <h1>Page not found</h1>
        <p>The listing or page you requested is not available.</p>
        <Link className="button primary" href="/marketplace">
          Browse marketplace
        </Link>
      </div>
    </main>
  );
}
