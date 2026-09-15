/**
 * Copies the ffmpeg.wasm engine files from node_modules into public/ffmpeg
 * so the app loads them same-origin (no CDN dependency at runtime).
 * Runs on install / dev / build / preview. public/ffmpeg is gitignored —
 * it is rebuilt from the @ffmpeg/* packages whenever they're installed.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const FILES = [
  ["node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.js", "public/ffmpeg/ffmpeg-core.js"],
  ["node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.wasm", "public/ffmpeg/ffmpeg-core.wasm"],
  ["node_modules/@ffmpeg/ffmpeg/dist/umd/814.ffmpeg.js", "public/ffmpeg/814.ffmpeg.js"],
];

fs.mkdirSync(path.join(ROOT, "public/ffmpeg"), { recursive: true });

for (const [from, to] of FILES) {
  const src = path.join(ROOT, from);
  const dest = path.join(ROOT, to);
  if (!fs.existsSync(src)) {
    console.error(`prepare-ffmpeg: missing ${from} — run npm install first`);
    process.exit(1);
  }
  const srcSize = fs.statSync(src).size;
  const destSize = fs.existsSync(dest) ? fs.statSync(dest).size : -1;
  if (srcSize !== destSize) {
    fs.copyFileSync(src, dest);
    console.log(`prepare-ffmpeg: ${to} (${(srcSize / 1048576).toFixed(1)} MB)`);
  }
}
