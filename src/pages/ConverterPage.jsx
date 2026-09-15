import { usePageMeta } from "../lib/seo";
import { converters, converterToTool } from "../data/converters";
import { Container } from "../components/Container";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ConverterBox } from "../components/ConverterBox";
import { FAQ } from "../components/FAQ";
import { ToolGrid } from "../components/ToolGrid";
import { SectionHeading } from "../components/SectionHeading";
import { ArrowRight } from "@phosphor-icons/react";

const chip =
  "rounded border border-line bg-surface px-2 py-0.5 font-mono text-[11px] text-muted";

/**
 * Reusable converter page. A single component renders every converter
 * route — the preset and all content come from the converter data entry.
 */
export default function ConverterPage({ converter }) {
  usePageMeta({
    title: `${converter.title} | DownloadReel`,
    description: converter.description,
  });

  const related = converters
    .filter((c) => c.group === converter.group && c.slug !== converter.slug)
    .slice(0, 8)
    .map(converterToTool);

  return (
    <article>
      {/* Hero + converter */}
      <section className="pb-12 pt-10 sm:pt-12">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Home", to: "/" },
              { label: "Converters", to: "/converters" },
              { label: converter.title },
            ]}
          />

          <div className="mt-8 max-w-3xl">
            <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
              {converter.heading}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              {converter.tagline}
            </p>

            <div className="mt-8">
              <ConverterBox converter={converter} />
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
                  preset
                </span>
                <span className={chip}>in · {converter.preset.input}</span>
                <ArrowRight className="h-3 w-3 text-faint" />
                <span className={chip}>out · {converter.preset.output}</span>
                <span className={chip}>{converter.preset.mode}</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Information */}
      <section className="border-t border-line py-12 sm:py-14">
        <Container className="max-w-3xl">
          <h2 className="text-lg font-semibold tracking-tight text-fg sm:text-xl">
            What is the {converter.heading}?
          </h2>
          {converter.whatIs.map((para, i) => (
            <p key={i} className="mt-4 text-[15px] leading-relaxed text-muted">
              {para}
            </p>
          ))}

          <h2 className="mt-12 text-lg font-semibold tracking-tight text-fg sm:text-xl">
            How to use it
          </h2>
          <ol className="mt-6 space-y-4">
            {converter.howTo.map((step, i) => (
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
            Supported files
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {converter.supportedFiles.map((ext) => (
              <span key={ext} className={chip}>
                {ext}
              </span>
            ))}
          </div>

          <h2 className="mt-12 text-lg font-semibold tracking-tight text-fg sm:text-xl">
            Frequently asked questions
          </h2>
          <div className="mt-6">
            <FAQ items={converter.faqs} />
          </div>
        </Container>
      </section>

      {/* Related converters */}
      {related.length > 0 && (
        <section className="border-t border-line py-12 sm:py-14">
          <Container>
            <SectionHeading
              eyebrow="same engine"
              title="More Converters"
              align="left"
            />
            <ToolGrid tools={related} className="mt-8" />
          </Container>
        </section>
      )}
    </article>
  );
}
