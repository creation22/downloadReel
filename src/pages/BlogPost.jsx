import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CaretRight, CheckCircle } from "@phosphor-icons/react";
import { usePageMeta } from "../lib/seo";
import { getPostBySlug, getRelatedPosts, blogPosts } from "../data/blog";
import { Container } from "../components/Container";
import NotFound from "./NotFound";

function formatDate(iso) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function slugifyHeading(h) {
  return h
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  usePageMeta({
    title: post ? `${post.title} — DownloadReel Blog` : "Blog — DownloadReel",
    description: post?.description,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) return <NotFound />;

  const idx = blogPosts.findIndex((p) => p.slug === post.slug);
  const prev = blogPosts[idx - 1];
  const next = blogPosts[idx + 1];
  const related = getRelatedPosts(post, 3);

  return (
    <>
      <article className="pb-14 pt-10 sm:pt-14">
        <Container>
          {/* Breadcrumb */}
          <nav
            className="flex flex-wrap items-center gap-1 font-mono text-[11px] text-faint"
            aria-label="Breadcrumb"
          >
            <Link to="/blog" className="transition-colors hover:text-fg">
              blog
            </Link>
            <CaretRight className="h-3 w-3" />
            <Link
              to={`/blog?cat=${post.category}`}
              className="transition-colors hover:text-fg"
            >
              {post.category}
            </Link>
          </nav>

          {/* Header */}
          <header className="mt-6 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-faint">
              <span className="rounded border border-line bg-surface px-2 py-0.5 uppercase tracking-wide text-muted">
                {post.category}
              </span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readMinutes} min read</span>
            </div>
            <h1 className="mt-4 text-2xl font-bold leading-[1.2] tracking-tight text-fg sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted">
              {post.description}
            </p>
          </header>

          {/* Cover */}
          <figure className="mt-8 overflow-hidden rounded-lg border border-line bg-surface">
            <img
              src={post.cover}
              alt=""
              width="1200"
              height="630"
              className="w-full object-cover"
            />
          </figure>

          {/* Body */}
          <div className="mx-auto mt-10 max-w-3xl">
            {post.intro.map((para, i) => (
              <p
                key={i}
                className={`leading-relaxed text-fg/90 ${
                  i === 0 ? "text-lg sm:text-xl" : "mt-5 text-base"
                }`}
                dangerouslySetInnerHTML={{ __html: para }}
              />
            ))}

            {post.sections.map((section) => (
              <section key={section.h} className="mt-10">
                <h2
                  id={slugifyHeading(section.h)}
                  className="text-xl font-semibold tracking-tight text-fg sm:text-2xl"
                >
                  {section.h}
                </h2>
                {(section.body || []).map((para, i) => (
                  <p
                    key={i}
                    className="mt-4 leading-relaxed text-muted"
                    dangerouslySetInnerHTML={{ __html: para }}
                  />
                ))}
                {section.list && (
                  <ul className="mt-4 space-y-2.5">
                    {section.list.map((item, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-sm leading-relaxed text-muted"
                      >
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span dangerouslySetInnerHTML={{ __html: item }} />
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {/* Tips */}
            {post.tips?.length > 0 && (
              <aside className="mt-10 rounded-lg border border-line bg-surface p-5 sm:p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
                  quick tips
                </p>
                <ul className="mt-4 space-y-2.5">
                  {post.tips.map((tip, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-sm leading-relaxed text-fg/90"
                    >
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span dangerouslySetInnerHTML={{ __html: tip }} />
                    </li>
                  ))}
                </ul>
              </aside>
            )}

            {/* FAQs */}
            {post.faqs?.length > 0 && (
              <section className="mt-10">
                <h2 className="text-xl font-semibold tracking-tight text-fg sm:text-2xl">
                  Frequently asked questions
                </h2>
                <div className="mt-5 divide-y divide-line rounded-lg border border-line bg-surface">
                  {post.faqs.map((faq, i) => (
                    <details key={i} className="group px-5 py-4">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-fg">
                        {faq.q}
                        <CaretRight className="h-4 w-4 shrink-0 text-faint transition-transform duration-150 group-open:rotate-90" />
                      </summary>
                      <p
                        className="mt-3 text-sm leading-relaxed text-muted"
                        dangerouslySetInnerHTML={{ __html: faq.a }}
                      />
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Tool CTA */}
            {post.toolHref && (
              <aside className="mt-10 flex flex-col gap-4 rounded-lg border border-accent/30 bg-accent/5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                    try it now
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-fg/90">
                    This guide pairs with the tool it describes — free, local,
                    and no signup.
                  </p>
                </div>
                <Link
                  to={post.toolHref}
                  className="inline-flex shrink-0 items-center gap-2 rounded-md bg-btn px-4 py-2 text-sm font-medium text-btn-fg transition-colors duration-150 hover:bg-btn-hover"
                >
                  Open the tool <ArrowRight className="h-4 w-4" />
                </Link>
              </aside>
            )}
          </div>

          {/* Prev / next */}
          <nav
            className="mx-auto mt-14 grid max-w-3xl gap-3 border-t border-line pt-8 sm:grid-cols-2"
            aria-label="More posts"
          >
            {prev ? (
              <Link
                to={`/blog/${prev.slug}`}
                className="group rounded-lg border border-line bg-surface p-4 transition-colors duration-150 hover:border-line-strong"
              >
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-faint">
                  <ArrowLeft className="h-3 w-3" /> newer
                </span>
                <p className="mt-2 text-sm font-medium leading-snug text-fg group-hover:text-accent">
                  {prev.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
            {next && (
              <Link
                to={`/blog/${next.slug}`}
                className="group rounded-lg border border-line bg-surface p-4 text-right transition-colors duration-150 hover:border-line-strong"
              >
                <span className="flex items-center justify-end gap-1.5 font-mono text-[11px] text-faint">
                  older <ArrowRight className="h-3 w-3" />
                </span>
                <p className="mt-2 text-sm font-medium leading-snug text-fg group-hover:text-accent">
                  {next.title}
                </p>
              </Link>
            )}
          </nav>
        </Container>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-line py-12 sm:py-14">
          <Container>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
              keep reading
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-fg sm:text-2xl">
              Related guides
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  to={`/blog/${rel.slug}`}
                  className="group overflow-hidden rounded-lg border border-line bg-surface transition-colors duration-150 hover:border-line-strong"
                >
                  <img
                    src={rel.cover}
                    alt=""
                    loading="lazy"
                    width="1200"
                    height="630"
                    className="w-full object-cover"
                  />
                  <div className="p-4">
                    <p className="font-mono text-[11px] text-faint">
                      {rel.category}
                    </p>
                    <p className="mt-1.5 text-sm font-medium leading-snug text-fg group-hover:text-accent">
                      {rel.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
