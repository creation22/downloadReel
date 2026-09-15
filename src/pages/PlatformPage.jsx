import { usePageMeta } from "../lib/seo";
import { platforms } from "../data/platforms";
import { platformToTool } from "../data/tools";
import { Container } from "../components/Container";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { DownloaderBox } from "../components/DownloaderBox";
import { CopyChip } from "../components/CopyChip";
import { FAQ } from "../components/FAQ";
import { ToolGrid } from "../components/ToolGrid";
import { SectionHeading } from "../components/SectionHeading";

const chip =
  "rounded border border-line bg-surface px-2 py-0.5 font-mono text-[11px] text-muted";

/**
 * Reusable platform downloader page. A single component renders every
 * platform route — all content comes from the platform data entry.
 */
export default function PlatformPage({ platform }) {
  usePageMeta({
    title: `${platform.title} | downloadReel`,
    description: platform.description,
  });

  const others = platforms
    .filter((p) => p.slug !== platform.slug)
    .map(platformToTool);

  return (
    <article>
      {/* Hero + downloader */}
      <section className="pb-12 pt-10 sm:pt-12">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Home", to: "/" },
              { label: "Downloaders", to: "/platforms" },
              { label: platform.title },
            ]}
          />

          <div className="mt-8 max-w-3xl">
            <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
              {platform.heading}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              {platform.tagline}
            </p>

            <div className="mt-8">
              <DownloaderBox platform={platform} />
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
                  domains
                </span>
                {platform.domains.map((d) => (
                  <span key={d} className={chip}>
                    {d}
                  </span>
                ))}
              </div>
              <p className="mt-3 flex flex-wrap items-center gap-2 text-[13px] text-faint">
                Supported links look like
                <CopyChip
                  value={platform.exampleUrl}
                  toastMessage="Example link copied"
                />
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Information */}
      <section className="border-t border-line py-12 sm:py-14">
        <Container className="max-w-3xl">
          <h2 className="text-lg font-semibold tracking-tight text-fg sm:text-xl">
            What is the {platform.heading}?
          </h2>
          {platform.whatIs.map((para, i) => (
            <p key={i} className="mt-4 text-[15px] leading-relaxed text-muted">
              {para}
            </p>
          ))}

          <h2 className="mt-12 text-lg font-semibold tracking-tight text-fg sm:text-xl">
            How to use it
          </h2>
          <ol className="mt-6 space-y-4">
            {platform.howTo.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="font-mono text-xs leading-6 text-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[15px] leading-relaxed text-muted">
                  {step}
                </p>
              </li>
            ))}
          </ol>

          <h2 className="mt-12 text-lg font-semibold tracking-tight text-fg sm:text-xl">
            Supported links
          </h2>
          <ul className="mt-6 space-y-2">
            {platform.supportedLinks.map((link) => (
              <li key={link}>
                <CopyChip
                  value={link}
                  variant="row"
                  toastMessage="Link copied"
                />
              </li>
            ))}
          </ul>

          <h2 className="mt-12 text-lg font-semibold tracking-tight text-fg sm:text-xl">
            Frequently asked questions
          </h2>
          <div className="mt-6">
            <FAQ items={platform.faqs} />
          </div>
        </Container>
      </section>

      {/* Other downloaders */}
      <section className="border-t border-line py-12 sm:py-14">
        <Container>
          <SectionHeading
            eyebrow="keep going"
            title="other downloaders"
            align="left"
          />
          <ToolGrid tools={others} className="mt-8" />
        </Container>
      </section>
    </article>
  );
}
