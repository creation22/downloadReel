import { Link } from "react-router-dom";
import { GithubLogo } from "@phosphor-icons/react";
import { SITE } from "../lib/site";
import { Logo } from "./Logo";
import { Container } from "./Container";

const footerLinks = [
  { label: "tools", to: "/tools" },
  { label: "downloaders", to: "/platforms" },
  { label: "converters", to: "/converters" },
  { label: "blog", to: "/blog" },
  { label: "faq", to: "/faq" },
  { label: "privacy", to: "/privacy" },
  { label: "terms", to: "/terms" },
];

export function Footer() {
  return (
    <footer className="border-t border-line">
      <Container className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <Logo />
          <span className="ml-1 hidden font-mono text-[11px] text-faint sm:inline">
            local video toolbox
          </span>
        </div>

        <nav
          className="flex flex-wrap items-center gap-x-5 gap-y-2"
          aria-label="Footer"
        >
          {footerLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm text-muted transition-colors duration-150 hover:text-fg"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={SITE.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
            className="text-muted transition-colors duration-150 hover:text-fg"
          >
            <GithubLogo className="h-4 w-4" />
          </a>
          <p className="font-mono text-xs text-faint">© 2026 DownloadReel</p>
        </div>
      </Container>
    </footer>
  );
}
