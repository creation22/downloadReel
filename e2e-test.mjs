/**
 * Temporary end-to-end verification script (not part of the app).
 * Uses system Edge via Playwright. Deleted after the run.
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const ROOT = process.cwd();
const sample = fs.readFileSync(path.join(os.tmpdir(), "sample.mp4"));
const clipUrl =
  "https://www.twitch.tv/twitch/clip/RespectfulFastWaterMau5-5MHfVlPos9CR7tr9";

const results = [];
function log(name, ok, detail = "") {
  results.push({ name, ok });
  console.log(`${ok ? "PASS" : "FAIL"} — ${name}${detail ? ` :: ${detail}` : ""}`);
}

function spawnCmd(cmd, args, extraEnv = {}) {
  return spawn(cmd, args, {
    cwd: ROOT,
    shell: true,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, ...extraEnv },
  });
}

async function waitForHttp(url, ms) {
  const deadline = Date.now() + ms;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok || res.status < 500) return true;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

const procs = [];
async function main() {
  // Start the download API + dev server with the API wired in.
  const api = spawnCmd("node", ["server/index.mjs"]);
  procs.push(api);
  if (!(await waitForHttp("http://localhost:8787/api/info?url=x", 15000))) {
    log("api server boots", false);
    return cleanup(1);
  }
  log("api server boots", true);

  const dev = spawnCmd("npm", ["run", "dev"], {
    VITE_DOWNLOAD_API: "http://localhost:8787/api/info",
  });
  procs.push(dev);
  let devPort = 5173;
  const portFound = new Promise((resolve) => {
    dev.stdout.on("data", (d) => {
      const m = String(d).match(/Local:\s+http:\/\/localhost:(\d+)/);
      if (m) {
        devPort = Number(m[1]);
        resolve();
      }
    });
  });
  await Promise.race([portFound, new Promise((r) => setTimeout(r, 20000))]);
  if (!(await waitForHttp(`http://localhost:${devPort}/`, 30000))) {
    log("dev server boots", false);
    return cleanup(1);
  }
  log("dev server boots", true, `port ${devPort}`);
  const base = `http://localhost:${devPort}`;

  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  const pageErrors = [];
  const consoleMsgs = [];
  page.on("pageerror", (e) => pageErrors.push(String(e)));
  page.on("console", (m) => consoleMsgs.push(`[${m.type()}] ${m.text().slice(0, 250)}`));

  // 1 — Homepage renders
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  const h1 = await page.locator("h1").first().textContent();
  log(
    "homepage headline",
    h1.includes("Everything you need to download"),
    h1.trim().slice(0, 60)
  );
  const iconCount = await page.locator('a[aria-label$="video downloader"]').count();
  log("platform icon row", iconCount === 12, `${iconCount} icons`);

  // 2 — Tools directory
  await page.goto(`${base}/tools`);
  const toolLinks = await page.locator(
    "a[href$='-converter'], a[href$='-downloader']"
  ).count();
  log("tool directory", toolLinks === 34, `${toolLinks} available tools`);
  await page.fill('input[aria-label="Search tools"]', "instagram");
  const hits = await page.locator(
    "a[href$='-converter'], a[href$='-downloader']"
  ).count();
  log("tools search", hits === 1, `instagram -> ${hits} result`);
  await page.fill('input[aria-label="Search tools"]', "");

  // 3 — Theme toggle
  await page.click('button[aria-label*="light theme"]');
  const isLight = await page.evaluate(() =>
    document.documentElement.classList.contains("light")
  );
  log("theme toggle -> light", isLight);
  await page.click('button[aria-label*="dark theme"]');
  const isDark = await page.evaluate(() =>
    !document.documentElement.classList.contains("light")
  );
  log("theme toggle -> dark", isDark);

  // 4 — Downloader validation
  await page.goto(`${base}/`);
  await page.fill('input[aria-label="Video URL"]', "not a url at all");
  await page.locator("form").getByRole("button", { name: "Download" }).click();
  log(
    "invalid URL error",
    await page
      .waitForSelector("text=Please enter a valid video URL.", { timeout: 5000 })
      .then(() => true)
      .catch(() => false)
  );
  await page.fill('input[aria-label="Video URL"]', "https://example.com/watch");
  await page.locator("form").getByRole("button", { name: "Download" }).click();
  log(
    "unsupported platform error",
    await page
      .waitForSelector("text=We don't support this platform yet.", { timeout: 5000 })
      .then(() => true)
      .catch(() => false)
  );

  // 5 — Real download round trip (Twitch clip via local API)
  await page.goto(`${base}/twitch-video-downloader`);
  await page.fill('input[aria-label="Video URL"]', clipUrl);
  await page.locator("form").getByRole("button", { name: "Download" }).click();
  await page.waitForSelector("text=Video found", { timeout: 90000 });
  const dl = page.locator('a:has-text("Download video")');
  const enabled = await dl.isEnabled();
  const href = await dl.first().getAttribute("href");
  const realFile = enabled && href && href.includes("/api/file");
  log("real download round trip", realFile, String(href).slice(0, 70));

  // 6 — Converter: wrong file type rejected
  await page.goto(`${base}/mov-to-mp4-converter`);
  await page.setInputFiles('input[type="file"]', {
    name: "sample.mp4",
    mimeType: "video/mp4",
    buffer: sample,
  });
  await page.waitForSelector("text=That file type isn't supported");
  log("converter rejects wrong type", true);

  // 7 — Converter: REAL mp3 extraction with ffmpeg.wasm
  await page.goto(`${base}/video-to-mp3-converter`);
  await page.setInputFiles('input[type="file"]', {
    name: "sample.mp4",
    mimeType: "video/mp4",
    buffer: sample,
  });
  await page.getByRole("button", { name: "Convert" }).click();
  const done = await Promise.race([
    page
      .waitForSelector("text=Conversion complete", { timeout: 240000 })
      .then(() => "done")
      .catch(() => "timeout"),
    page
      .waitForSelector("text=Couldn't load the conversion engine", { timeout: 240000 })
      .then(() => "engine-error")
      .catch(() => null),
    page
      .waitForSelector("text=Conversion failed", { timeout: 240000 })
      .then(() => "convert-error")
      .catch(() => null),
  ]).then((v) => v ?? "timeout");
  if (done !== "done") {
    const body = await page
      .evaluate(() => document.body.innerText)
      .catch(() => "<unavailable>");
    console.log("--- PAGE STATE:\n" + body.slice(0, 700));
    console.log("--- CONSOLE TAIL:\n" + consoleMsgs.slice(-20).join("\n"));
    await page
      .screenshot({ path: path.join(os.tmpdir(), "e2e-conv.png") })
      .catch(() => {});
  }
  log("real conversion completes", done === "done", `state: ${done}`);
  if (done === "done") {
    const sizeRow = await page.locator("text=/KB|MB/").first().textContent();
    const dlPromise = page.waitForEvent("download", { timeout: 30000 });
    await page.getByRole("button", { name: /^Save/ }).click();
    const download = await dlPromise;
    const outPath = path.join(os.tmpdir(), "e2e-out.mp3");
    await download.saveAs(outPath);
    const out = fs.readFileSync(outPath);
    const head = [...out.slice(0, 3)].map((b) => b.toString(16)).join(" ");
    const isMp3 = out.length > 10000 && (out[0] === 0x49 || out[0] === 0xff);
    log(
      "real mp3 saved to disk",
      isMp3,
      `${out.length} bytes, header ${head} — ${sizeRow.trim()}`
    );
  }

  log("no page errors", pageErrors.length === 0, pageErrors.join(" | ").slice(0, 200));

  await browser.close();
  return cleanup(results.some((r) => !r.ok) ? 1 : 0);
}

function cleanup(code) {
  for (const p of procs) {
    try {
      if (process.platform === "win32") {
        spawn("taskkill", ["/PID", String(p.pid), "/T", "/F"]);
      } else {
        p.kill("SIGKILL");
      }
    } catch {
      /* already dead */
    }
  }
  setTimeout(() => process.exit(code), 1500);
}

main().catch((e) => {
  console.error("E2E CRASHED:", e);
  cleanup(1);
});
