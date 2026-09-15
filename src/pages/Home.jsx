import { Link } from "react-router-dom";
import { Laptop } from "lucide-react";
import { usePageMeta } from "../lib/seo";
import { platforms } from "../data/platforms";
import { tools, toolCategories } from "../data/tools";
import { Container } from "../components/Container";
import { SectionHeading } from "../components/SectionHeading";
import { DownloaderBox } from "../components/DownloaderBox";
import { ToolGrid } from "../components/ToolGrid";
import { ToolDirectory } from "../components/ToolDirectory";
import { PlatformIcon } from "../components/icons/PlatformIcon";
import { latestBlogPosts as blogPosts, blogPostCount } from "../data/blog-latest";

const POPULAR_IDS = [
  "instagram",
  "tiktok",
  "x",
  "mov-to-mp4",
  "video-to-mp3",
  "video-to-gif",
  "4k-video",
];

const metaChip =
  "rounded border border-line bg-canvas px-2 py-0.5 font-mono text-[11px] text-faint";

export default function Home() {
  usePageMeta({
    title: "downloadReel — download, convert and edit videos in your browser",
    description:
      "Everything you need to download, convert and edit videos — right in your browser. Free, no signup, local processing.",
  });

  const popular = POPULAR_IDS.map((id) => tools.find((t) => t.id === id)).filter(
    Boolean
  );
  const categories = toolCategories.filter((c) => c.id !== "all");

  return (
    <>
      {/* Hero */}
      <section className="pb-12 pt-14 sm:pb-14 sm:pt-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 font-mono text-[11px] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              open source · local processing
            </p>
            <h1 className="animate-fade-up [animation-delay:60ms] mt-5 text-2xl font-bold leading-[1.2] tracking-tight text-fg sm:text-4xl sm:leading-[1.15]">
              Everything you need to download, convert and edit videos right
              in your browser.
            </h1>

            <div className="animate-fade-up [animation-delay:180ms] mx-auto mt-8 max-w-xl text-left">
              <DownloaderBox />
            </div>

            <p className="animate-fade-up [animation-delay:240ms] mt-4 font-mono text-[11px] text-faint">
              free · no signup · no ads
            </p>

            <div className="animate-fade-up [animation-delay:300ms] mt-5 flex flex-wrap items-center justify-center gap-1">
              {platforms.map((p) => (
                <Link
                  key={p.slug}
                  to={p.href}
                  title={`${p.name} video downloader`}
                  aria-label={`${p.name} video downloader`}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-faint transition-colors duration-150 hover:bg-surface hover:text-fg"
                >
                  <PlatformIcon slug={p.slug} size={16} />
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Popular tools */}
      <section className="border-t border-line py-12 sm:py-14">
        <Container>
          <SectionHeading
            eyebrow="start here"
            title="popular tools"
            description="The most-used downloaders and converters."
          />
          <ToolGrid tools={popular} className="mt-8" />
        </Container>
      </section>

      {/* Tool categories */}
      <section className="border-t border-line py-12 sm:py-14">
        <Container>
          <SectionHeading
            eyebrow="browse"
            title="by category"
            description={`${tools.length} tools across ${categories.length} categories.`}
          />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => {
              const count = tools.filter((t) => t.category === cat.id).length;
              return (
                <Link
                  key={cat.id}
                  to={`/tools?cat=${cat.id}`}
                  className="group flex flex-col gap-2.5 rounded-md border border-line bg-surface p-4 transition-colors duration-150 hover:border-line-strong hover:bg-surface-2"
                >
                  <cat.icon className="h-4 w-4 text-muted transition-colors duration-150 group-hover:text-fg" />
                  <p className="text-sm font-medium text-fg">{cat.label}</p>
                  <p className="font-mono text-[11px] text-faint">
                    {count} tools
                  </p>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Complete tool directory */}
      <section className="border-t border-line py-12 sm:py-14">
        <Container>
          <SectionHeading
            eyebrow="directory"
            title="all tools"
            description="Search the full directory — press / to jump to the search field."
          />
          <div className="mt-8">
            <ToolDirectory />
          </div>
        </Container>
      </section>

      {/* From the blog */}
      <section className="border-t border-line py-12 sm:py-14">
        <Container>
          <SectionHeading
            eyebrow="learn"
            title="from the blog"
            description={`${blogPostCount} guides on formats, codecs, downloading and video workflows.`}
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {blogPosts.slice(0, 3).map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-lg border border-line bg-surface transition-colors duration-150 hover:border-line-strong"
              >
                <img
                  src={post.cover}
                  alt=""
                  loading="lazy"
                  width="1200"
                  height="630"
                  className="w-full object-cover"
                />
                <div className="p-4">
                  <p className="font-mono text-[11px] text-faint">
                    {post.category} · {post.readMinutes} min read
                  </p>
                  <p className="mt-1.5 text-sm font-medium leading-snug text-fg group-hover:text-accent">
                    {post.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted transition-colors hover:text-fg"
            >
              browse all {blogPostCount} posts →
            </Link>
          </div>
        </Container>
      </section>

      {/* Local processing */}
      <section className="border-t border-line py-12 sm:py-14">
        <Container>
          <div className="flex flex-col gap-6 rounded-lg border border-line bg-surface p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-line bg-canvas text-accent">
              <Laptop className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-fg sm:text-xl">
                your files stay on your device.
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                processing happens locally in your browser. your videos don't
                need to be uploaded to a server.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className={metaChip}>no uploads</span>
                <span className={metaChip}>no server</span>
                <span className={metaChip}>no signup</span>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
