import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { List, MagnifyingGlass, X } from "@phosphor-icons/react";
import { cn } from "../lib/utils";
import { FOCUS_SEARCH_EVENT } from "../lib/site";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";
import { Container } from "./Container";

const navLinks = [
  { label: "Tools", to: "/tools" },
  { label: "Converters", to: "/converters" },
  { label: "Downloaders", to: "/platforms" },
  { label: "Blog", to: "/blog" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  function handleSearch() {
    if (location.pathname === "/tools") {
      window.dispatchEvent(new CustomEvent(FOCUS_SEARCH_EVENT));
    } else {
      navigate("/tools", { state: { focusSearch: true } });
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur-md">
      <Container className="flex h-14 items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          aria-label="DownloadReel home"
        >
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-2.5 py-1.5 text-sm transition-colors duration-150",
                  isActive
                    ? "font-medium text-fg"
                    : "text-muted hover:text-fg"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={handleSearch}
            aria-label="Search tools"
            title="Search tools"
            className="flex h-8 items-center gap-2 rounded-md border border-line bg-surface pl-2 pr-2 text-muted transition-colors duration-150 hover:border-line-strong hover:text-fg"
          >
            <MagnifyingGlass className="h-4 w-4" />
            <kbd className="hidden rounded border border-line bg-canvas px-1.5 py-0.5 font-mono text-[10px] text-faint lg:inline">
              /
            </kbd>
          </button>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-line bg-surface text-muted transition-colors hover:text-fg"
            onClick={handleSearch}
            aria-label="Search tools"
          >
            <MagnifyingGlass className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-line bg-surface text-muted transition-colors hover:text-fg"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <List className="h-4 w-4" />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="animate-fade-in border-t border-line bg-canvas md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2.5 text-sm transition-colors",
                    isActive
                      ? "bg-surface font-medium text-fg"
                      : "text-muted hover:bg-surface hover:text-fg"
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </Container>
        </div>
      )}
    </header>
  );
}
