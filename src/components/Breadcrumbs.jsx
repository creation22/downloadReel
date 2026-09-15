import { Link } from "react-router-dom";
import { CaretRight } from "@phosphor-icons/react";

export function Breadcrumbs({ items }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1.5 font-mono text-xs text-faint"
    >
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-1.5">
            {i > 0 && <CaretRight className="h-3 w-3 text-line-strong" />}
            {last || !item.to ? (
              <span className="text-muted" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.to}
                className="transition-colors duration-150 hover:text-fg"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
