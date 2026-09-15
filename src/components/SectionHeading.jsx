import { cn } from "../lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}) {
  return (
    <div
      className={cn(
        align === "center" && "mx-auto max-w-2xl text-center",
        "max-w-2xl",
        className
      )}
    >
      {eyebrow && (
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-fg sm:text-2xl">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {description}
        </p>
      )}
    </div>
  );
}
