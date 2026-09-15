import { useId } from "react";
import { cn } from "../lib/utils";

const BRAND_GRADIENT = "linear-gradient(135deg, #8b5cf6, #d946ef 50%, #f97316)";

/**
 * downloadReel brand mark — a rounded badge with a download arrow
 * dropping into a tray, on the brand gradient.
 */
export function LogoMark({ size = 24, className }) {
  const id = useId();
  const gradId = `dr-logo-${id.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-hidden="true"
      className={cn("shrink-0 rounded-[7px]", className)}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8b5cf6" />
          <stop offset="0.5" stopColor="#d946ef" />
          <stop offset="1" stopColor="#f97316" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill={`url(#${gradId})`} />
      <path
        d="M16 7.5v11m0 0l-4.75-4.75M16 18.5l4.75-4.75"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M9.5 23.5h13"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}

/**
 * Full navbar/footer lockup: mark + two-tone wordmark.
 */
export function Logo({ markSize = 24, className }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark size={markSize} />
      <span className="text-[15px] tracking-tight text-fg">
        <span className="font-medium text-muted">download</span>
        <span
          className="bg-clip-text font-bold text-transparent"
          style={{ backgroundImage: BRAND_GRADIENT }}
        >
          Reel
        </span>
      </span>
    </span>
  );
}
