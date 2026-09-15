/** Quick smoke test for the blog pages against the built dist (vite preview). */
import { chromium } from "playwright";
import { spawn } from "node:child_process";

const ROOT = process.cwd();
const results = [];
function log(name, ok, detail = "") {
  results.push({ name, ok });
  console.log(`${ok ? "PASS" : "FAIL"} :: ${name}${detail ? ` :: ${detail}` : ""}`);
}

const proc = spawn("cmd", ["/c", "npm run preview -- --port 4187 --strictPort"], {
  cwd: ROOT,
  shell: true,
  stdio: "ignore",
});

async function waitForHttp(url, ms) {
  const deadline = Date.now() + ms;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 400));
  }
  return false;
}

const up = await waitForHttp("http://localhost:4187/", 20000);
log("preview server up", up);

if (up) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));

  // Blog index
  await page.goto("http://localhost:4187/blog", { waitUntil: "networkidle" });
  const cards = await page.locator('a[href^="/blog/"]').count();
  log("blog index renders post cards", cards > 10, `${cards} links`);
  const coverOk = await page
    .locator('img[src^="/blog/"]').first()
    .evaluate((el) => el.complete && el.naturalWidth > 0);
  log("cover images load", coverOk);

  // Search filter
  await page.fill('input[type="search"]', "tiktok");
  await page.waitForTimeout(400);
  const filtered = await page.locator('a[href^="/blog/"]').count();
  log("search filters posts", filtered > 0 && filtered < cards, `${filtered} results`);

  // Category chip
  await page.fill('input[type="search"]', "");
  await page.click('button:has-text("Formats")');
  await page.waitForTimeout(400);
  const catCount = await page.locator('a[href^="/blog/"]').count();
  log("category filter works", catCount > 0 && catCount < cards, `${catCount} posts`);

  // Article page
  const firstPost = await page.locator('a[href^="/blog/"]').first().getAttribute("href");
  await page.goto(`http://localhost:4187${firstPost}`, { waitUntil: "networkidle" });
  const h1 = await page.locator("h1").first().textContent();
  log("article renders title", Boolean(h1 && h1.length > 10), h1?.slice(0, 50));
  const artCover = await page
    .locator('figure img').first()
    .evaluate((el) => el.complete && el.naturalWidth > 0);
  log("article cover loads", artCover);
  const faqCount = await page.locator("details").count();
  log("article has FAQ accordion", faqCount > 0, `${faqqSafe(faqCount)} items`);
  const related = await page.locator('a[href^="/blog/"]').count();
  log("related posts render", related >= 3, `${related} links`);

  // 404 for unknown slug
  await page.goto("http://localhost:4187/blog/this-post-does-not-exist", { waitUntil: "networkidle" });
  const notFoundText = await page.content();
  log("unknown slug shows 404 page", notFoundText.includes("404") || notFoundText.toLowerCase().includes("not found"));

  log("no console/page errors", errors.length === 0, errors.join("; ").slice(0, 200));
  await browser.close();
}

function faqqSafe(n) { return n; }

proc.kill();
const failed = results.filter((r) => !r.ok);
console.log(failed.length === 0 ? `\nALL ${results.length} CHECKS PASSED` : `\n${failed.length} FAILED`);
process.exit(failed.length === 0 ? 0 : 1);
