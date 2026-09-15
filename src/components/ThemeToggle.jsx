import { useState } from "react";
import { Moon, Sun } from "@phosphor-icons/react";

/**
 * Dark-first theme toggle. Adds/removes the `light` class on <html>
 * and persists the choice. The initial class is applied by an inline
 * script in index.html to avoid a flash of the wrong theme.
 */
export function ThemeToggle({ className }) {
  const [light, setLight] = useState(() =>
    document.documentElement.classList.contains("light")
  );

  function toggle() {
    const next = !light;
    document.documentElement.classList.toggle("light", next);
    try {
      localStorage.setItem("downloadreel-theme", next ? "light" : "dark");
    } catch {
      /* private mode — ignore */
    }
    setLight(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={light ? "Switch to dark theme" : "Switch to light theme"}
      title={light ? "Switch to dark theme" : "Switch to light theme"}
      className={
        className ??
        "flex h-8 w-8 items-center justify-center rounded-md border border-line bg-surface text-muted transition-colors duration-150 hover:border-line-strong hover:text-fg"
      }
    >
      {light ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  );
}
