# downloadReel

Download Reels and videos from Instagram, TikTok, X and more — right in your browser. Free, no signup, local processing.

## Run it

```bash
npm install
```

Terminal 1 — download API (wraps `yt-dlp`):

```bash
npm run api
```

Terminal 2 — frontend:

```bash
npm run dev
```

Open the printed localhost URL (e.g. http://localhost:5173) and head to
`/instagram-video-downloader`. Paste a public Reel link — you'll get a
thumbnail, quality badge, video preview and a download button.

## Download engine requirements

The API needs two tools on your machine (it looks in `server/bin/` first,
then falls back to your `PATH`):

- **yt-dlp** — https://github.com/yt-dlp/yt-dlp#installation
- **ffmpeg** — https://ffmpeg.org/download.html (required to merge
  video+audio streams)

Optional: drop a Netscape-format cookies file at `server/cookies.txt`
(or set `COOKIES_FILE`) to enable login-walled platforms such as
Instagram/Vimeo. Never commit this file.

## Build

```bash
npm run build
```
