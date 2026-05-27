import type { Metadata } from "next";
import { Space_Grotesk, Work_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

const body = Work_Sans({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "SkillMarket",
  description: "Curated Claude Code and Codex skills and plugins."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <header className="site-header">
          <Link href="/" className="brand" aria-label="SkillMarket home">
            <span className="brand-mark">SM</span>
            <span>SkillMarket</span>
          </Link>
          <nav className="site-nav" aria-label="Primary navigation">
            <Link href="/marketplace">Marketplace</Link>
            <a href="https://github.com/" rel="noreferrer" target="_blank">
              GitHub
            </a>
            <Link href="/marketplace" className="nav-action">
              Browse
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
