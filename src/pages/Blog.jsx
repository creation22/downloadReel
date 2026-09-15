import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, CaretLeft, CaretRight, MagnifyingGlass } from "@phosphor-icons/react";
import { usePageMeta } from "../lib/seo";
import { blogPosts, blogCategories } from "../data/blog";
import { Container } from "../components/Container";

const PAGE_SIZE = 24;

function formatDate(iso) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function PostCard({ post, featured = false }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className={`group flex flex-col overflow-hidden rounded-lg border border-line bg-surface transition-colors duration-150 hover:border-line-strong hover:bg-surface-2 ${
        featured ? "sm:flex-row" : ""
      }`}
    >
      <div
        className={`overflow-hidden bg-canvas ${featured ? "sm:w-[46%]" : ""}`}
      >
        <img
          src={post.cover}
          alt=""
          loading="lazy"
          width="1200"
          height="630"
          className={`w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] ${
            featured ? "aspect-[16/10]" : "aspect-[1200/630]"
          }`}
        />
      </div>
      <div className={`flex flex-1 flex-col p-4 ${featured ? "sm:p-6" : ""}`}>
        <div className="flex items-center gap-2 font-mono text-[11px] text-faint">
          <span className="rounded border border-line bg-canvas px-1.5 py-0.5 uppercase tracking-wide text-muted">
            {post.category}
          </span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readMinutes} min read</span>
        </div>
        <h3
          className={`mt-2 font-semibold leading-snug tracking-tight text-fg transition-colors duration-150 group-hover:text-accent ${
            featured ? "text-xl sm:text-2xl" : "text-[15px]"
          }`}
        >
          {post.title}
        </h3>
        <p
          className={`mt-2 text-sm leading-relaxed text-muted ${
            featured ? "sm:text-[15px]" : ""
          }`}
        >
          {post.description}
        </p>
        {featured && (
          <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] text-accent">
            read the guide <ArrowRight className="h-3 w-3" />
          </span>
        )}
      </div>
    </Link>
  );
}

export default function Blog() {
  usePageMeta({
    title: "Blog — DownloadReel",
    description: `Guides on downloading, converting and editing video: ${blogPosts.length} in-depth articles on formats, codecs, tools and workflows.`,
  });

  const [params, setParams] = useSearchParams();
  const activeCat = params.get("cat") || "all";
  const [query, setQuery] = useState(params.get("q") || "");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return blogPosts.filter((p) => {
      if (activeCat !== "all" && p.category !== activeCat) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q))
      );
    });
  }, [activeCat, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const pagePosts = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const featured = current === 1 && activeCat === "all" && !query.trim();
  const gridPosts = featured ? pagePosts.slice(1) : pagePosts;

  function selectCat(cat) {
    const next = new URLSearchParams(params);
    if (cat === "all") next.delete("cat");
    else next.set("cat", cat);
    setParams(next, { replace: true });
    setPage(1);
  }

  return (
    <>
      {/* Hero */}
      <section className="pb-10 pt-14 sm:pb-12 sm:pt-20">
        <Container>
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
              the DownloadReel blog
            </p>
            <h1 className="mt-3 text-2xl font-bold leading-[1.15] tracking-tight text-fg sm:text-4xl">
              Guides on downloading, converting and making sense of video.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
              {blogPosts.length} in-depth articles — platform downloader
              guides, format and codec explainers, compression workflows and
              the practical rules of saving video.
            </p>

            {/* Search */}
            <div className="relative mt-6 max-w-md">
              <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search the blog…"
                aria-label="Search blog posts"
                className="h-10 w-full rounded-md border border-line bg-surface pl-9 pr-3 text-sm text-fg placeholder:text-faint focus:border-line-strong focus:outline-none"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Category chips */}
      <section className="border-t border-line py-4">
        <Container>
          <div className="flex flex-wrap items-center gap-2">
            {[{ id: "all", label: "All", count: blogPosts.length }, ...blogCategories].map(
              (cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => selectCat(cat.id)}
                  className={`rounded-full border px-3 py-1.5 font-mono text-[11px] transition-colors duration-150 ${
                    activeCat === cat.id
                      ? "border-accent/50 bg-accent/10 text-accent"
                      : "border-line bg-surface text-muted hover:border-line-strong hover:text-fg"
                  }`}
                >
                  {cat.label} · {cat.count}
                </button>
              )
            )}
          </div>
        </Container>
      </section>

      {/* Posts */}
      <section className="py-8 sm:py-10">
        <Container>
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-muted">
                No posts match "{query}".
              </p>
            </div>
          ) : (
            <>
              {featured && pagePosts[0] && (
                <div className="mb-6">
                  <PostCard post={pagePosts[0]} featured />
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {gridPosts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {pageCount > 1 && (
            <nav
              className="mt-10 flex items-center justify-center gap-2"
              aria-label="Blog pages"
            >
              <button
                type="button"
                disabled={current === 1}
                onClick={() => setPage(current - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-line bg-surface text-muted transition-colors hover:text-fg disabled:opacity-40"
                aria-label="Previous page"
              >
                <CaretLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={`h-8 min-w-8 rounded-md border px-2 font-mono text-xs transition-colors ${
                    n === current
                      ? "border-accent/50 bg-accent/10 text-accent"
                      : "border-line bg-surface text-muted hover:text-fg"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                disabled={current === pageCount}
                onClick={() => setPage(current + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-line bg-surface text-muted transition-colors hover:text-fg disabled:opacity-40"
                aria-label="Next page"
              >
                <CaretRight className="h-4 w-4" />
              </button>
            </nav>
          )}
        </Container>
      </section>
    </>
  );
}
