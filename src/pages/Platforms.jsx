import { usePageMeta } from "../lib/seo";
import { platforms } from "../data/platforms";
import { platformToTool } from "../data/tools";
import { Container } from "../components/Container";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ToolGrid } from "../components/ToolGrid";

export default function Platforms() {
  usePageMeta({
    title: "Video Downloaders | downloadReel",
    description:
      "Every supported platform on downloadReel — dedicated video downloader pages for X, Instagram, TikTok and more.",
  });

  const tools = platforms.map(platformToTool);

  return (
    <section className="pb-16 pt-10 sm:pt-12">
      <Container>
        <Breadcrumbs
          items={[{ label: "Home", to: "/" }, { label: "Downloaders" }]}
        />

        <div className="mt-8 max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
            directory · {platforms.length} platforms
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            video downloaders
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Every platform downloader in one place. Paste a link on the
            homepage to detect the platform automatically, or open a tool
            below.
          </p>
        </div>

        <ToolGrid tools={tools} className="mt-8" />
      </Container>
    </section>
  );
}
