import { usePageMeta } from "../lib/seo";
import { tools, toolCategories } from "../data/tools";
import { Container } from "../components/Container";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ToolDirectory } from "../components/ToolDirectory";

export default function Converters() {
  usePageMeta({
    title: "Video Converters | downloadReel",
    description:
      "Every downloadReel converter in one place — format conversion, audio extraction, downscaling and re-encoding, all locally in your browser.",
  });

  const converterTools = tools.filter((t) => t.category !== "download");
  const categories = toolCategories.filter((c) => c.id !== "download");

  return (
    <section className="pb-16 pt-10 sm:pt-12">
      <Container>
        <Breadcrumbs
          items={[{ label: "Home", to: "/" }, { label: "Converters" }]}
        />

        <div className="mt-8 max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
            directory · local processing
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            video converters
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Convert, extract, downscale and re-encode video files — all
            locally in your browser. Each tool is one fixed preset, nothing to
            configure.
          </p>
        </div>

        <div className="mt-8">
          <ToolDirectory tools={converterTools} categories={categories} />
        </div>
      </Container>
    </section>
  );
}
