import { usePageMeta } from "../lib/seo";
import { sharedFaqs } from "../data/faqs";
import { Container } from "../components/Container";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { FAQ } from "../components/FAQ";

const extraFaqs = [
  {
    q: "How do I download a video?",
    a: "Copy the video's link from the platform, paste it into the input on the homepage, and follow the prompts. Each platform also has its own downloader page with specific instructions.",
  },
  {
    q: "What's the difference between the homepage tool and the platform pages?",
    a: "The homepage tool detects the platform automatically from the link you paste. Platform pages are dedicated to a single platform and include platform-specific instructions and FAQs.",
  },
  {
    q: "How do the video converters work?",
    a: "Each converter page has a fixed preset — like MOV to MP4 or 4K to 1080p — so there's nothing to configure. Conversion runs on a real media engine (FFmpeg compiled to WebAssembly) inside your browser: you select a file, the preset is applied, and the result is saved straight to your device.",
  },
  {
    q: "Are my files uploaded when I use a converter?",
    a: "No. Conversion runs entirely in your browser — your file is processed locally and never leaves your device. The conversion engine is downloaded once (~31 MB) and cached by your browser afterwards.",
  },
];

export default function FAQPage() {
  usePageMeta({
    title: "FAQ | DownloadReel",
    description:
      "Answers to common questions about DownloadReel — supported platforms, accounts, downloads, privacy and troubleshooting.",
  });

  return (
    <section className="pb-16 pt-10 sm:pt-12">
      <Container>
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "FAQ" }]} />

        <div className="mt-8 max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
            help
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Short, direct answers. If something isn't covered here, the tool
            pages include their own FAQs.
          </p>
        </div>

        <div className="mt-8 max-w-3xl">
          <FAQ items={[...sharedFaqs, ...extraFaqs]} />
        </div>
      </Container>
    </section>
  );
}
