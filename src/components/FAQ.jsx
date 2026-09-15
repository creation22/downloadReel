import { ChevronDown } from "lucide-react";

export function FAQ({ items }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.q} className="group py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-medium text-fg [&::-webkit-details-marker]:hidden">
            {item.q}
            <ChevronDown className="h-4 w-4 shrink-0 text-faint transition-transform duration-200 group-open:rotate-180" />
          </summary>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
