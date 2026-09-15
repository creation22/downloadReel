# downloadReel — System Design

> Local-first video toolbox: download videos from social platforms,
> convert between formats in the browser, and read guides — no signup,
> no uploads (for conversion), free.

## 1. Overview

downloadReel is two cooperating processes plus static content:

| Piece | Tech | Port | Purpose |
|---|---|---|---|
| Frontend (`src/`) | React 19, React Router 7, Vite 7, Tailwind CSS v4, lucide-react, sonner | 5173 (dev) | All UI: downloader pages, converter pages, tools directory, blog |
| Download API (`server/`) | Node 20+ `node:http`, no framework, spawns `yt-dlp` | 8787 | Server-side video extraction + file delivery (platforms block browser-side fetching via CORS) |
| Conversion engine | `@ffmpeg/ffmpeg` + `@ffmpeg/core` (WebAssembly, ESM build, loaded from unpkg CDN) | — (in-browser) | Real format conversion / audio extraction, 100% client-side |

Why two processes: social platforms block cross-origin browser requests
and require JS-challenge solving / merging, so extraction must run
server-side via `yt-dlp`. Conversion is the opposite: it runs locally in
the browser so files never leave the device.

```
┌─────────────┐  paste URL   ┌──────────────────┐  spawn   ┌─────────┐
│   Browser   │ ───────────▶ │  Download API    │ ───────▶ │ yt-dlp  │
│ React SPA   │ ◀─────────── │  :8787 (Node)    │ ◀─────── │+ffmpeg  │
└─────────────┘  JSON/file   └──────────────────┘  merge   └─────────┘
       │                              ▲
       │ .mp4/.mp3/etc (local file)   │ /api/* (CORS: *)
       ▼                              │
┌─────────────┐  load-once from CDN  ┌─┴──────────┐
│ ffmpeg.wasm │ ◀─────────────────── │ unpkg.com  │
│ in-browser  │   @ffmpeg/core (ESM) └────────────┘
└─────────────┘
```

## 2. Frontend (`src/`)

Entry: `src/main.jsx` → `src/App.jsx` (`BrowserRouter`, `Navbar`,
`Footer`, `Toaster`, `ScrollToTop`).

### 2.1 Routing

Static routes: `/`, `/tools`, `/platforms`, `/converters`, `/blog`,
`/blog/:slug` (lazy), `/faq`, `/privacy`, `/terms`, `*` (NotFound).

Generated routes (one shared page component each, content from data):

- `/:slug-video-downloader` → `PlatformPage` — 11 platforms from
  `src/data/platforms.js` (x, instagram, tiktok, facebook, reddit,
  pinterest, vimeo, threads, snapchat, linkedin, twitch).
- `/:slug-converter` → `ConverterPage` — 22 presets from
  `src/data/converters.js` (format, audio-extract, scale, fps, codec…).

Per-page SEO via `usePageMeta` (`src/lib/seo.js`) setting
`document.title` + meta description.

### 2.2 Key components

- `DownloaderBox` — generic flow used by the homepage (auto-detect) and
  every platform page: URL input → `detectPlatform()` → `downloadVideo()`
  → "Video found" card (thumbnail, title, quality/ext/duration/uploader
  badges, `<video>` preview) → download button with **real progress**
  (fetch + byte-counting stream reader → `Downloading… N%`, progress bar,
  Cancel via `AbortController`, blob save on completion).
- `InstagramReelBox` — Instagram-specific port of the
  `dipayansarkar47/insta-reels-downloader` UX ("Download Video" button,
  loading state, thumbnail + quality + download link, quality list, video
  player, error box). Used instead of `DownloaderBox` on the Instagram
  page. Talks to `/api/instagram` (see §3.3).
- `ConverterBox` — file picker → validation → `convertVideo()` with
  stage/progress UI → save-to-disk.
- `Logo` / `LogoMark` — brand lockup: gradient download-badge SVG +
  two-tone `download`/`Reel` wordmark (also the favicon).
- `UrlInput`, `DownloadState` (step flow), `ToolGrid`, `ToolDirectory`
  (search), `FAQ`, `CopyChip`, `Breadcrumbs`, `ThemeToggle` (dark default,
  `light` class on `<html>`, persisted in localStorage).

### 2.3 Data layer (registries power everything)

- `src/data/platforms.js` — platform entries (slug, domains, copy, FAQs);
  `platforms[].href` drives routing.
- `src/data/converters.js` — preset entries built by factories; each has
  `accepts` (allowed extensions), `outputExt`, and
  `buildArgs(input, output)` returning the exact ffmpeg argv.
- `src/data/tools.js` — unifies platforms + converters into the searchable
  `/tools` directory, plus `available: false` future tools.
- `src/lib/detect.js` — `detectPlatform()`: normalises input to a URL,
  matches hostname against platform domains; rejects gibberish hosts
  (encoded chars / no dot — some browsers percent-encode instead of
  throwing) as `invalid`.
- `src/lib/site.js` — `SITE = { name, github }` single source of brand truth.
- `src/services/downloader.js` — `downloadVideo()` → `GET {VITE_DOWNLOAD_API}?url=`
  (`/api/info`); returns normalised `{ title, thumbnail, duration,
  quality, ext, uploader, file: { url, filename, filesize } }`, or an
  honest demo result when no API is configured (never a fake download).
- `src/services/instagram.js` — `fetchInstagramReel()` →
  `GET {VITE_INSTAGRAM_API} (default http://localhost:8787/api/instagram)?url=`
  with generic-API fallback; normalises RapidAPI `links[]` +
  `/api/info`-shaped payloads to one shape.

### 2.4 Theming

Tailwind v4 `@theme` + CSS vars in `src/index.css` (`--canvas`,
`--surface`, `--fg`, `--accent`, …); `:root.light` overrides switch the
whole system. Animations: `page-in` / `fade-up` / `fade-in` only.

## 3. Download API (`server/`)

Zero-dependency Node HTTP server (`server/index.mjs` routes by pathname;
CORS `*`; JSON helper; 405 for non-GET).

```
server/
  index.mjs                 # router: /api/health|info|instagram|file
  config.mjs                # PORT, binaries, FORMAT, BASE_ARGS, timeouts, ALLOWED_DOMAINS
  errors.mjs                # friendlyError(): yt-dlp stderr → {status, message}
  utils.mjs                 # isAllowedUrl, json, safeName, pickThumbnail, pickQuality
  services/ytdlp.mjs        # runYtDlp(): spawn + capture + timeout
  services/instagram.mjs    # fetchInstagramReel(): RapidAPI → yt-dlp fallback
  controllers/              # handleHealth|Info|Instagram|File (one per endpoint)
```

### 3.1 `GET /api/health` → `{ ok, ytdlp, ffmpeg, cookies, proxy, impersonate }`

Reports which binaries were resolved (vendored `server/bin/` preferred,
system `PATH` fallback) and which options are active.

### 3.2 `GET /api/info?url=` → metadata + file ticket

1. `isAllowedUrl()` allow-lists 19 domains (instagram, tiktok, x/twitter,
   facebook, reddit, …); else 400.
2. `yt-dlp -J -f {FORMAT}` → parse JSON → `{ title, ext, filesize,
   thumbnail (best), duration, width/height, quality (e.g. 1080p),
   uploader, file: { url: "/api/file?url=…&name=…", filename } }`.
3. Failures mapped by `friendlyError()`: 401 login-walled (→ add
   `server/cookies.txt`), 404 deleted/private, 400 unsupported, 504
   network/timeout, 502 format-gate (SABR/PO-token), 451 geo/DRM.

Format strategy (`config.mjs`):
`bv*[vcodec^=avc]+ba[acodec^=mp4a] / b[vcodec^=avc] / bv*+ba / b` —
H.264 + AAC in MP4 first, because plain `bv*+ba` often selects AV1/Opus,
which many players can't decode (audio-only playback). `--merge-output-format mp4`.

### 3.3 `GET /api/instagram?url=` → reel-first metadata

`fetchInstagramReel()` tries two providers in order:

1. **RapidAPI** (`social-media-video-downloader`, same provider as the
   reference app) when `RAPIDAPI_KEY`/`RAPID_API_KEY` is set — key stays
   server-side; response normalised (`picture` + `links[0]{quality,link}`)
   to the `/api/info` shape plus a `links[]` quality list. Auth errors
   surface; other provider failures fall through to (2).
2. **yt-dlp** (default, no key) — same probing as `/api/info`, with `file`
   pointing at the local `/api/file` pipeline.

`isInstagramUrl()` accepts `instagram.com` (+subdomains) and `instagr.am`,
reels/posts/IGTV/share paths.

### 3.4 `GET /api/file?url=&name=` → the bytes

1. Validate URL (400 otherwise).
2. Spawn `yt-dlp -f {FORMAT} --merge-output-format mp4 --remux-video mp4
   -o {os.tmpdir()}/downloadreel-{rand}.mp4` with `DOWNLOAD_TIMEOUT_MS`
   (default 5 min; 504 on expiry).
3. On exit 0 + non-empty file → `200 video/mp4` with `Content-Length` +
   `Content-Disposition: attachment`, streamed via `fs.createReadStream`.
   Temp file deleted on stream end, error, or client disconnect (which
   also kills yt-dlp).

Design note: it downloads to a temp file instead of piping stdout (`-o -`)
because merging split streams to a pipe forces ffmpeg into MPEG-TS output
(MP4 needs a seekable target for its `moov` atom) — the piped file played
audio-only or not at all.

### 3.5 Configuration (env)

| Var | Default | Effect |
|---|---|---|
| `PORT` | `8787` | API listen port |
| `VITE_DOWNLOAD_API` (frontend) | — | Points UI at `/api/info` |
| `VITE_INSTAGRAM_API` (frontend) | `http://localhost:8787/api/instagram` | Points reel box at `/api/instagram` |
| `RAPIDAPI_KEY` / `RAPID_API_KEY` | — | Enables RapidAPI provider for `/api/instagram` |
| `COOKIES_FILE` / `server/cookies.txt` | — | Netscape cookies for login-walled platforms |
| `PROXY` / `YTDLP_PROXY` / `*_PROXY` | — | Passed as yt-dlp `--proxy` |
| `IMPERSONATE` | off (plain urllib) | e.g. `chrome` to re-enable TLS impersonation |
| `INFO_TIMEOUT_MS` / `DOWNLOAD_TIMEOUT_MS` | 100s / 5min | yt-dlp timeouts |

## 4. Conversion engine (in-browser)

`src/services/converter.js` (`convertVideo(file, converter, {onStage, onProgress})`):

1. Validate ≤ 1 GB (`MAX_INPUT_BYTES`) and extension against preset `accepts`.
2. Lazy-load `@ffmpeg/ffmpeg` once; fetch ESM core + wasm + worker from
   unpkg (`@ffmpeg/core@0.12.10/dist/esm/`) as blob URLs (browser-cached).
3. `writeFile` → `exec(converter.buildArgs(...))` with progress events →
   `readFile` → `Blob` → caller saves it. Temp files deleted in `finally`;
   `cancelConversion()` terminates the engine.

Preset families in `src/data/converters.js`: format (`libx264`/`libvpx-vp9`),
audio-extract (mp3/wav/ogg/aac), downscale (1080p/480p…), fps, bitrate,
codec, HDR→SDR. Verified end-to-end (mp4→mp3) in headless Edge.

## 5. Blog subsystem (generated)

`node scripts/generate-blog.mjs` assembles `src/data/blog.js` + one
1200×630 SVG cover per post into `public/blog/` from:

- `scripts/blog/platforms.mjs` — per-platform downloader guides,
- `scripts/blog/converters.mjs` — converter guides,
- `scripts/blog/core.mjs` — tips/formats/editing posts,
- `scripts/blog/covers.mjs` — deterministic gradient cover art,
- `scripts/blog/lib.mjs` — slugs, dates, post shape.

102 posts. `/blog` (search + category filter) and `/blog/:slug`
(cover, FAQ accordion, related posts) render from the generated data.

## 6. Key flows

**Download:** paste URL → `detectPlatform` (invalid/unsupported errors) →
`GET /api/info` (detecting/fetching states) → preview card (thumbnail,
quality, player) → Download button → streamed `fetch` with live % →
blob save → "Saved".
**Instagram:** same shape via `InstagramReelBox` → `/api/instagram`
(RapidAPI or yt-dlp) → quality list + player.
**Convert:** pick file (type-checked) → engine loads (once) → progress →
"Conversion complete" → save output. Nothing uploaded.

## 7. Non-functional notes

- **Privacy:** conversion never leaves the device; the API sees only pasted
  URLs (never credentials); `server/cookies.txt`, `.env`, logs and
  `server/bin/` are git-ignored.
- **Limits:** login-walled / deleted / geo-blocked / DRM / SABR-gated
  content fails with an explanatory message, not a corrupt file; merged
  `filesize` is an estimate (progress may linger at 99% then complete);
  conversion caps at 1 GB (wasm RAM).
- **Compatibility:** downloads prefer H.264+AAC/MP4 so they play in stock
  players; ESM (not UMD) ffmpeg-core is required by the module worker.
- **Verified:** 51-check headless-browser audit passes — all 33 tool pages,
  static/blog pages, real Twitch download + progress UI, real mp3
  conversion, zero page errors.

## 8. Run / deploy

```bash
npm install
npm run api   # :8787 — needs yt-dlp + ffmpeg on PATH (or server/bin/)
npm run dev   # :5173 — .env already points at the local API
npm run build # → dist/ (102 posts, covers, worker)
npm run preview
```

Repo: `github.com/creation22/downloadReel` (`main`). Blog content is
regenerated with `node scripts/generate-blog.mjs` after editing
`scripts/blog/*` or brand strings.
