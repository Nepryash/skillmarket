import type { Metadata } from "next";
import Image from "next/image";
import { Space_Grotesk, Work_Sans } from "next/font/google";
import Link from "next/link";
import { Github, Search, Send } from "lucide-react";
import { telegramBotUsername } from "@/lib/telegram";
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
  description: "Curated Claude Code and Codex skills, plugins, and local models."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const telegramUrl = `https://t.me/${telegramBotUsername()}`;

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <header className="header-shell">
          <div className="site-header">
            <Link href="/" className="brand" aria-label="SkillMarket home">
              <span className="brand-mark brand-image" aria-hidden="true">
                <Image src="/logoskillhub.svg" alt="" width={40} height={40} priority />
              </span>
              <span className="brand-copy">
                <span>SkillMarket</span>
                <small>Skills, plugins, models</small>
              </span>
            </Link>
            <nav className="site-nav" aria-label="Primary navigation">
              <Link href="/marketplace">Marketplace</Link>
              <Link href="/#featured">Featured</Link>
              <Link href="/#categories">Categories</Link>
              <a href="https://github.com/" rel="noreferrer" target="_blank">
                GitHub
              </a>
            </nav>
            <div className="header-actions">
              <Link href="/marketplace" className="icon-action" aria-label="Search marketplace">
                <Search size={17} aria-hidden="true" />
              </Link>
              <Link href="/marketplace" className="nav-action">
                Browse
              </Link>
            </div>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div className="page-shell footer-grid">
            <div className="footer-brand">
              <Link href="/" className="brand" aria-label="SkillMarket home">
                <span className="brand-mark">SM</span>
                <span className="brand-copy">
                  <span>SkillMarket</span>
                  <small>Curated agent workflows</small>
                </span>
              </Link>
              <p>
                A focused catalog for finding Claude Code and Codex skills, plugins, local models, install links, and practical commands.
              </p>
            </div>
            <nav className="footer-links" aria-label="Marketplace links">
              <span>Explore</span>
              <Link href="/marketplace">All listings</Link>
              <Link href="/marketplace?type=skill">Skills</Link>
              <Link href="/marketplace?type=plugin">Plugins</Link>
              <Link href="/marketplace?type=model">Local models</Link>
            </nav>
            <nav className="footer-links" aria-label="Compatibility links">
              <span>Compatibility</span>
              <Link href="/marketplace?compatibility=codex">Codex</Link>
              <Link href="/marketplace?compatibility=claude_code">Claude Code</Link>
              <Link href="/marketplace?compatibility=both">Both</Link>
              <Link href="/marketplace?compatibility=local_lm">Local LM</Link>
            </nav>
            <div className="footer-cta">
              <span>Fast handoff</span>
              <p>Send a selected listing to Telegram and keep the install command within reach.</p>
              <div className="footer-actions">
                <a className="button primary" href={telegramUrl} target="_blank" rel="noreferrer">
                  Telegram <Send size={16} aria-hidden="true" />
                </a>
                <a className="button" href="https://github.com/" target="_blank" rel="noreferrer">
                  GitHub <Github size={16} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
          <div className="page-shell footer-bottom">
            <span>SkillMarket MVP</span>
            <span>Built for local SQLite validation and Vercel-ready iteration.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
