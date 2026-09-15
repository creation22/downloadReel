import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { cn } from "../lib/utils";
import { PlatformIcon } from "./icons/PlatformIcon";

/**
 * Developer-utility style tool card: icon, name, one-line description
 * and a mono metadata line (formats / domains). Coming-soon tools
 * render as dashed, non-clickable roadmap cards.
 */
export function ToolCard({ tool }) {
  const icon = tool.icon ? (
    <tool.icon className="h-[18px] w-[18px]" />
  ) : tool.available ? (
    <PlatformIcon slug={tool.id} size={18} />
  ) : null;

  const cardClass = cn(
    "group flex h-full flex-col gap-2 rounded-md border p-4 transition-colors duration-150",
    tool.available
      ? "border-line bg-surface hover:border-line-strong hover:bg-surface-2"
      : "cursor-not-allowed border-dashed border-line bg-surface/50"
  );

  const inner = (
    <>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-line bg-canvas",
              tool.available
                ? "text-muted transition-colors duration-150 group-hover:text-fg"
                : "text-faint"
            )}
          >
            {icon}
          </span>
          <h3
            className={cn(
              "min-w-0 truncate text-sm font-medium",
              tool.available ? "text-fg" : "text-muted"
            )}
          >
            {tool.name}
          </h3>
        </div>
        {tool.available ? (
          <ArrowUpRight className="h-4 w-4 shrink-0 text-faint transition-all duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
        ) : (
          <span className="shrink-0 rounded border border-dashed border-line-strong px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-faint">
            soon
          </span>
        )}
      </div>

      <p
        className={cn(
          "text-[13px] leading-relaxed",
          tool.available ? "text-muted" : "text-faint"
        )}
      >
        {tool.description}
      </p>

      {tool.meta && (
        <p className="mt-auto truncate pt-1 font-mono text-[11px] text-faint">
          {tool.meta}
        </p>
      )}
    </>
  );

  if (tool.available) {
    return (
      <Link to={tool.href} className={cardClass}>
        {inner}
      </Link>
    );
  }

  return (
    <div className={cardClass} aria-disabled="true" title="Coming soon">
      {inner}
    </div>
  );
}
