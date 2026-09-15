import { usePageMeta } from "../lib/seo";
import { Container } from "../components/Container";
import { Breadcrumbs } from "../components/Breadcrumbs";

export default function Privacy() {
  usePageMeta({
    title: "Privacy | DownloadReel",
    description:
      "How DownloadReel handles the links you paste and the videos you download.",
  });

  return (
    <section className="pb-16 pt-10 sm:pt-12">
      <Container className="max-w-3xl">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Privacy" }]} />

        <h1 className="mt-8 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            Privacy
        </h1>

        <div className="mt-8 space-y-8">
          <div>
            <h2 className="text-base font-semibold text-fg">Current status</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              The converter tools run a real media engine (FFmpeg compiled to
              WebAssembly) inside your browser — files are processed locally
              and never leave your device. The download tools need a
              processing service to fetch videos from platforms; when none is
              connected, they only preview the flow. This page will be
              updated as the service evolves.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-fg">Links you paste</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              The tools exist to prepare a download from a link you already
              have access to. DownloadReel doesn't build a public gallery, doesn't
              republish content, and doesn't share the links you submit.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-fg">Accounts</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              There are no accounts. The tools never ask for credentials to
              any platform, and no signup is required.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-fg">Downloaded files</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              Downloads are handled by your browser and go straight to your
              device. DownloadReel doesn't keep copies of the videos you download.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-fg">
              Your responsibility
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              Only download content you have the right to save. Respect
              creators' rights and the terms of the platform the content comes
              from.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
