import { useLocation, useSearchParams } from "react-router-dom";
import { usePageMeta } from "../lib/seo";
import { tools, toolCategories } from "../data/tools";
import { Container } from "../components/Container";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ToolDirectory } from "../components/ToolDirectory";

export default function Tools() {
  usePageMeta({
    title: "All Tools | DownloadReel",
    description:
      "The full DownloadReel tool directory — video downloaders, video converters and upcoming tools.",
  });

  const [searchParams] = useSearchParams();
  const location = useLocation();

  const cat = searchParams.get("cat") ?? "all";
  const initialCategory = toolCategories.some((c) => c.id === cat) ? cat : "all";
  const autoFocus = Boolean(location.state?.focusSearch);

  return (
    <section className="pb-16 pt-10 sm:pt-12">
      <Container>
        <Breadcrumbs
          items={[{ label: "Home", to: "/" }, { label: "All Tools" }]}
        />

        <div className="mt-8 max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
            directory
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            All Tools
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Every DownloadReel tool in one place — downloaders, converters and
            what's on the roadmap. Press{" "}
            <kbd className="rounded border border-line bg-surface px-1.5 py-0.5 font-mono text-[10px] text-faint">
              /
            </kbd>{" "}
            to search.
          </p>
        </div>

        <div className="mt-8">
          <ToolDirectory
            tools={tools}
            initialCategory={initialCategory}
            autoFocus={autoFocus}
          />
        </div>
      </Container>
    </section>
  );
}
