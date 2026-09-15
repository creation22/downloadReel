/**
 * Shared helpers for the blog generator.
 */

export function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function countWords(post) {
  let words = 0;
  const texts = [
    ...post.intro,
    ...(post.sections || []).flatMap((s) => [
      ...(s.body || []),
      ...(s.list || []),
    ]),
    ...(post.tips || []),
    ...(post.faqs || []).flatMap((f) => [f.q, f.a]),
  ];
  for (const t of texts) words += String(t).split(/\s+/).filter(Boolean).length;
  return words;
}

/** Deterministic pseudo-random 0..1 from a seed string + salt. */
export function rand(seed, salt = "") {
  return (hash(seed + salt) % 10000) / 10000;
}

/** Assign a deterministic date spread over the past ~18 months. */
export function spreadDate(slug, index, total) {
  const start = new Date("2026-09-05T12:00:00Z").getTime();
  const dayMs = 86400000;
  const span = 540; // days
  const step = span / Math.max(total, 1);
  const jitter = Math.floor(rand(slug, "d") * step * 0.8);
  const d = new Date(start - (index * step + jitter) * dayMs);
  return d.toISOString().slice(0, 10);
}

/**
 * Finalize a raw post definition: fill slug, cover, date, readMinutes,
 * and derive a card/SEO description from the intro.
 */
export function makePost(raw, index, total) {
  const slug = raw.slug || slugify(raw.title);
  const first = (raw.intro && raw.intro[0]) || raw.title;
  const description =
    raw.description || (first.length > 180 ? first.slice(0, 177).trimEnd() + "…" : first);
  return {
    ...raw,
    slug,
    description,
    cover: `/blog/${slug}.svg`,
    date: spreadDate(slug, index, total),
    readMinutes: Math.max(3, Math.round(countWords({ ...raw, slug }) / 200)),
    toolHref: raw.toolHref || null,
  };
}

export const CATEGORY_META = {
  downloaders: { label: "Downloader guides" },
  converters: { label: "Converter guides" },
  formats: { label: "Formats & codecs" },
  editing: { label: "Editing & processing" },
  tips: { label: "Tips & best practices" },
};
