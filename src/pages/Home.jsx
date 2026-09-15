import { Link } from "react-router-dom";
import { Laptop } from "@phosphor-icons/react";
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

/**
 * 3D-style social tiles floating in the hero background.
 * Deliberately quiet: only 8 tiles, kept to the edges so the center
 * column (badge → headline → search) stays clean and readable.
 * - Asymmetric placement (never mirrored) for an organic feel.
 * - Left tiles tilt right, right tiles tilt left — all facing the content.
 * - Blurred back-layer tiles add depth of field; crisp front tiles lead.
 */
const HERO_3D_TILES = [
  // ---- back layer: small, faint, slightly out of focus ----
  {
    slug: "vimeo",
    size: 34,
    pos: "left-[4%] top-[24%]",
    tile: "bg-[linear-gradient(135deg,#3ecbf2,#0d7fa8)]",
    tilt: "perspective(700px) rotateY(-12deg) rotateX(8deg)",
    opacity: "opacity-30",
    blur: "blur-[1.5px]",
    delay: "2.8s",
    duration: "8.4s",
    hide: "max-md:hidden",
  },
  {
    slug: "reddit",
    size: 36,
    pos: "bottom-[12%] left-[6%]",
    tile: "bg-[linear-gradient(135deg,#ff6a2b,#c93a00)]",
    tilt: "perspective(700px) rotateY(-12deg) rotateX(8deg)",
    opacity: "opacity-30",
    blur: "blur-[1.5px]",
    delay: "0.4s",
    duration: "8s",
    hide: "max-md:hidden",
  },
  {
    slug: "twitch",
    size: 34,
    pos: "bottom-[16%] right-[5%]",
    tile: "bg-[linear-gradient(135deg,#a970ff,#5f24c9)]",
    tilt: "perspective(700px) rotateY(12deg) rotateX(8deg)",
    opacity: "opacity-30",
    blur: "blur-[1.5px]",
    delay: "3.4s",
    duration: "7.8s",
    hide: "max-md:hidden",
  },
  // ---- front layer: crisp, medium, leading the eye to the search ----
  {
    slug: "instagram",
    size: 46,
    pos: "left-[13%] top-[30%]",
    tile: "bg-[linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)]",
    tilt: "perspective(700px) rotateY(-12deg) rotateX(8deg)",
    opacity: "opacity-55 max-sm:opacity-30",
    blur: "",
    delay: "0s",
    duration: "7s",
    hide: "",
  },
  {
    slug: "tiktok",
    size: 52,
    pos: "left-[9%] top-[58%]",
    tile: "bg-[linear-gradient(135deg,#333338,#010101)]",
    tilt: "perspective(700px) rotateY(-12deg) rotateX(8deg)",
    opacity: "opacity-60",
    blur: "",
    delay: "0.8s",
    duration: "7.6s",
    hide: "max-sm:hidden",
  },
  {
    slug: "facebook",
    size: 50,
    pos: "right-[12%] top-[38%]",
    tile: "bg-[linear-gradient(135deg,#2f8bff,#0d4fb0)]",
    tilt: "perspective(700px) rotateY(12deg) rotateX(8deg)",
    opacity: "opacity-60 max-sm:opacity-30",
    blur: "",
    delay: "2.2s",
    duration: "6.8s",
    hide: "",
  },
  {
    slug: "x",
    size: 54,
    pos: "right-[8%] top-[62%]",
    tile: "bg-[linear-gradient(135deg,#2e2e33,#000000)]",
    tilt: "perspective(700px) rotateY(12deg) rotateX(8deg)",
    opacity: "opacity-60",
    blur: "",
    delay: "1.6s",
    duration: "6.4s",
    hide: "max-sm:hidden",
  },
  {
    slug: "snapchat",
    size: 40,
    pos: "bottom-[10%] right-[18%]",
    tile: "bg-[linear-gradient(135deg,#fff86b,#e0d000)]",
    tilt: "perspective(700px) rotateY(12deg) rotateX(8deg)",
    opacity: "opacity-50",
    blur: "",
    delay: "2.6s",
    duration: "7.4s",
    hide: "max-sm:hidden",
    darkGlyph: true,
  },
];

export default function Home() {
  usePageMeta({
    title: "DownloadReel — download, convert and edit videos in your browser",
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
      <section className="relative overflow-hidden pb-12 pt-14 sm:pb-14 sm:pt-20">
        {/* 3D social tiles floating in the hero background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(180deg,transparent,black_12%,black_88%,transparent)]"
        >
          {HERO_3D_TILES.map((t) => (
            <span
              key={t.slug}
              className={`absolute animate-float-soft ${t.pos} ${t.hide}`}
              style={{ animationDelay: t.delay, animationDuration: t.duration }}
            >
              <span
                className={`relative flex items-center justify-center rounded-[14px] border border-white/25 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)] ${t.tile} ${t.opacity} ${t.blur || ""}`}
                style={{ width: t.size, height: t.size, transform: t.tilt }}
              >
                {/* top gloss */}
                <span className="pointer-events-none absolute inset-0 rounded-[14px] bg-[linear-gradient(180deg,rgba(255,255,255,0.38),transparent_46%)]" />
                {/* bottom shade for depth */}
                <span className="pointer-events-none absolute inset-0 rounded-[14px] bg-[linear-gradient(0deg,rgba(0,0,0,0.22),transparent_42%)]" />
                {/* platform glyph in white (black on snapchat's yellow tile) */}
                <span
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    filter: t.darkGlyph
                      ? "brightness(0)"
                      : "brightness(0) invert(1)",
                    opacity: 0.95,
                  }}
                >
                  <PlatformIcon slug={t.slug} size={Math.round(t.size * 0.52)} />
                </span>
              </span>
            </span>
          ))}
        </div>
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 font-mono text-[11px] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              local processing
            </p>
            <h1 className="animate-fade-up [animation-delay:60ms] mt-5 font-display text-[34px] font-extrabold leading-[1.05] tracking-tight text-fg sm:text-[52px] sm:leading-[1.0] lg:text-[74px] lg:leading-[70px]">
              Everything you need to{" "}
              <span className="font-serif font-normal italic text-[#ed5526]">
                download, convert and edit
              </span>{" "}
              videos right in your browser.
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
            title="Popular Tools"
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
            title="By Category"
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
            title="All Tools"
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
            title="From the Blog"
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
              <Laptop weight="duotone" className="h-5 w-5" />
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
