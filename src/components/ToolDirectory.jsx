import { useEffect, useMemo, useRef, useState } from "react";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { cn } from "../lib/utils";
import { tools as allTools, toolCategories } from "../data/tools";
import { FOCUS_SEARCH_EVENT } from "../lib/site";
import { ToolGrid } from "./ToolGrid";

/**
 * Command-center style tool directory: search, category filters and
 * a responsive grid. Keyboard-friendly — pressing "/" anywhere (when
 * not already typing) focuses the search field.
 */
export function ToolDirectory({
  tools = allTools,
  categories = toolCategories,
  initialCategory = "all",
  autoFocus = false,
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(
    categories.some((c) => c.id === initialCategory) ? initialCategory : "all"
  );
  const searchRef = useRef(null);

  useEffect(() => {
    if (autoFocus) searchRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    function onFocusSearch() {
      searchRef.current?.focus();
    }
    window.addEventListener(FOCUS_SEARCH_EVENT, onFocusSearch);
    return () => window.removeEventListener(FOCUS_SEARCH_EVENT, onFocusSearch);
  }, []);

  useEffect(() => {
    function onKeyDown(e) {
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(e.target?.tagName)
      ) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((tool) => {
      const matchesCategory = category === "all" || tool.category === category;
      const matchesQuery =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        (tool.meta ?? "").toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [tools, query, category]);

  const hasFilters = query.trim() !== "" || category !== "all";

  function reset() {
    setQuery("");
    setCategory("all");
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools..."
            aria-label="Search tools"
            className={cn(
              "h-9 w-full rounded-md border border-line bg-surface pl-9 pr-10 text-sm text-fg",
              "placeholder:text-faint outline-none transition-colors duration-150",
              "focus:border-line-strong focus:ring-4 focus:ring-fg/10"
            )}
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-faint transition-colors hover:text-fg"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-line bg-canvas px-1.5 py-0.5 font-mono text-[10px] text-faint">
              /
            </kbd>
          )}
        </div>

        <div
          className="flex flex-wrap items-center gap-1.5"
          role="group"
          aria-label="Filter by category"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={cn(
                "rounded-md px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors duration-150",
                category === cat.id
                  ? "bg-fg text-canvas"
                  : "border border-line text-muted hover:border-line-strong hover:text-fg"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 font-mono text-[11px] text-faint">
        {filtered.length} / {tools.length} tools
      </p>

      <div className="mt-4">
        {filtered.length > 0 ? (
          <ToolGrid tools={filtered} />
        ) : (
          <div className="rounded-md border border-dashed border-line-strong bg-surface/50 px-6 py-14 text-center">
            <p className="text-sm font-medium text-fg">
              No tools match your search.
            </p>
            <p className="mt-1 text-sm text-faint">
              Try a different search term or category.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-4 inline-flex h-8 items-center rounded-md border border-line bg-surface px-3.5 text-sm font-medium text-muted transition-colors duration-150 hover:border-line-strong hover:text-fg"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
