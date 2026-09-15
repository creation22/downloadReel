import { usePageMeta } from "../lib/seo";
import { Container } from "../components/Container";
import { Breadcrumbs } from "../components/Breadcrumbs";

export default function Terms() {
  usePageMeta({
    title: "Terms | DownloadReel",
    description: "Terms of use for DownloadReel tools and services.",
  });

  return (
    <section className="pb-16 pt-10 sm:pt-12">
      <Container className="max-w-3xl">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Terms" }]} />

        <h1 className="mt-8 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            Terms
        </h1>

        <div className="mt-8 space-y-8">
          <div>
            <h2 className="text-base font-semibold text-fg">Using the tools</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              DownloadReel provides tools for preparing downloads of videos you
              already have access to. The tools are free to use and require no
              account.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-fg">
              Your responsibility
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              You are responsible for making sure you have the right to
              download, store and use any content you save. Don't use the
              tools to infringe copyright or to work around the terms of
              service of any platform.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-fg">Availability</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              Tools are provided as-is. Platforms change how they serve
              content, so a tool may stop working for certain links without
              notice. Tools marked as coming soon are not available yet.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-fg">Changes</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              These terms may be updated as the service evolves. Continued use
              of the tools after a change means you accept the updated terms.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
