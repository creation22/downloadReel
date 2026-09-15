import { platforms } from "../data/platforms";

export const DETECT_ERRORS = {
  empty: "Please enter a valid video URL.",
  invalid: "Please enter a valid video URL.",
  unsupported: "We don't support this platform yet.",
};

/**
 * Detect which supported platform a URL belongs to.
 * Returns { platform, url } on success or { error } on failure.
 */
export function detectPlatform(raw) {
  const value = (raw || "").trim();
  if (!value) return { error: "empty" };

  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  let url;
  try {
    url = new URL(candidate);
  } catch {
    return { error: "invalid" };
  }

  if (!/^https?:$/.test(url.protocol)) return { error: "invalid" };

  const host = url.hostname.toLowerCase().replace(/^www\./, "");

  for (const platform of platforms) {
    if (platform.domains.some((d) => host === d || host.endsWith(`.${d}`))) {
      return { platform, url: url.href };
    }
  }

  return { error: "unsupported" };
}
