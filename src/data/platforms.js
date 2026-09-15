/**
 * Central platform registry.
 *
 * This single data structure powers the homepage cards, the platform
 * directory, routing, the downloader pages, breadcrumbs and metadata.
 * Add a new platform by appending an entry here.
 */

const raw = [
  {
    slug: "x",
    name: "X",
    category: "social",
    toolName: "X video downloader",
    title: "X Video Downloader",
    tagline: "Download videos from X using a simple link.",
    description:
      "Download videos from X using a simple link. Paste a public post URL and prepare the video for download.",
    placeholder: "Paste your X video link...",
    exampleUrl: "https://x.com/...",
    domains: ["x.com", "twitter.com", "t.co"],
    cardDescription: "Save videos from public posts and threads.",
    whatIs: [
      "The X video downloader prepares videos posted on X so you can save them to your device. Paste a link to a post that contains a video and the tool handles detection and preparation for you.",
      "You don't need an X account — only the link to a public post.",
    ],
    howTo: [
      "Copy the link to the X post that contains the video.",
      "Paste it into the field above and press Download.",
      "Once the video is prepared, save it to your device.",
    ],
    supportedLinks: ["https://x.com/...", "https://twitter.com/...", "https://t.co/..."],
    faqs: [
      {
        q: "Do I need an X account to use this?",
        a: "No. You only need the link to a public post. Content from protected accounts can't be processed.",
      },
      {
        q: "Can I download videos from replies and threads?",
        a: "Yes, as long as the post containing the video is public and still available on X.",
      },
      {
        q: "Why might a link fail?",
        a: "The post may have been deleted, the account may be protected, or the video may no longer be available.",
      },
    ],
  },
  {
    slug: "instagram",
    name: "Instagram",
    category: "social",
    toolName: "Instagram video downloader",
    title: "Instagram Video Downloader",
    tagline: "Download videos from Instagram using a simple link.",
    description:
      "Download Reels and feed videos from public Instagram posts. Paste a link and prepare the video for download.",
    placeholder: "Paste your Instagram video link...",
    exampleUrl: "https://www.instagram.com/reel/...",
    domains: ["instagram.com", "instagr.am"],
    cardDescription: "Save Reels and feed videos from public posts.",
    whatIs: [
      "The Instagram video downloader prepares videos from public Instagram posts — including Reels and feed videos — so you can save them to your device.",
      "Only content from public accounts can be processed. Private posts aren't accessible.",
    ],
    howTo: [
      "Copy the link to the Instagram Reel or post.",
      "Paste it into the field above and press Download.",
      "Once the video is prepared, save it to your device.",
    ],
    supportedLinks: [
      "https://www.instagram.com/reel/...",
      "https://www.instagram.com/reels/...",
      "https://www.instagram.com/p/...",
      "https://instagram.com/...",
      "https://instagr.am/...",
    ],
    faqs: [
      {
        q: "Can I download videos from private accounts?",
        a: "No. Only posts from public accounts are accessible. If an account is private, its content can't be processed.",
      },
      {
        q: "Do Instagram Stories work with this tool?",
        a: "This tool focuses on Reels and feed videos. Stories disappear after 24 hours and aren't supported.",
      },
      {
        q: "Do I need to log in to Instagram?",
        a: "No. The tool works with public links and never asks for your Instagram credentials.",
      },
    ],
  },
  {
    slug: "tiktok",
    name: "TikTok",
    category: "social",
    toolName: "TikTok video downloader",
    title: "TikTok Video Downloader",
    tagline: "Download videos from TikTok using a simple link.",
    description:
      "Download videos from public TikTok posts using a simple link. Paste a URL and prepare the video for download.",
    placeholder: "Paste your TikTok video link...",
    exampleUrl: "https://www.tiktok.com/@.../video/...",
    domains: ["tiktok.com"],
    cardDescription: "Save videos from public TikTok posts.",
    whatIs: [
      "The TikTok video downloader prepares videos from public TikTok posts so you can save them to your device.",
      "Both full links and shortened share links (vm.tiktok.com) are recognized.",
    ],
    howTo: [
      "Copy the link to the TikTok video using the share menu.",
      "Paste it into the field above and press Download.",
      "Once the video is prepared, save it to your device.",
    ],
    supportedLinks: [
      "https://www.tiktok.com/@.../video/...",
      "https://vm.tiktok.com/...",
      "https://m.tiktok.com/...",
    ],
    faqs: [
      {
        q: "Can I download videos from private TikTok accounts?",
        a: "No. Only videos from public accounts can be processed.",
      },
      {
        q: "Do shortened share links work?",
        a: "Yes. Links from the TikTok share menu, such as vm.tiktok.com links, are recognized.",
      },
      {
        q: "Why might a video fail to download?",
        a: "The post may have been deleted, the account may be private, or the video may be region-restricted.",
      },
    ],
  },
  {
    slug: "facebook",
    name: "Facebook",
    category: "social",
    toolName: "Facebook video downloader",
    title: "Facebook Video Downloader",
    tagline: "Download videos from Facebook using a simple link.",
    description:
      "Download videos from public Facebook posts, Reels and Watch using a simple link.",
    placeholder: "Paste your Facebook video link...",
    exampleUrl: "https://www.facebook.com/watch/?v=...",
    domains: ["facebook.com", "fb.watch", "fb.me"],
    cardDescription: "Save videos from public posts, Reels and Watch.",
    whatIs: [
      "The Facebook video downloader prepares videos from public Facebook posts — feed videos, Reels and Watch content — so you can save them to your device.",
      "Only publicly shared videos can be processed.",
    ],
    howTo: [
      "Copy the link to the Facebook video or Reel.",
      "Paste it into the field above and press Download.",
      "Once the video is prepared, save it to your device.",
    ],
    supportedLinks: [
      "https://www.facebook.com/watch/?v=...",
      "https://www.facebook.com/reel/...",
      "https://fb.watch/...",
    ],
    faqs: [
      {
        q: "Can I download videos from private groups?",
        a: "No. Only videos shared publicly can be processed. Content in private groups requires membership and isn't supported.",
      },
      {
        q: "Are Facebook Reels supported?",
        a: "Yes. Public Reels, feed videos and Watch links are all recognized.",
      },
      {
        q: "Do I need a Facebook account?",
        a: "No. The tool works with public links and never asks for your Facebook credentials.",
      },
    ],
  },
  {
    slug: "reddit",
    name: "Reddit",
    category: "social",
    toolName: "Reddit video downloader",
    title: "Reddit Video Downloader",
    tagline: "Download videos from Reddit using a simple link.",
    description:
      "Download videos hosted on Reddit using a simple link. Paste a post URL and prepare the video for download.",
    placeholder: "Paste your Reddit video link...",
    exampleUrl: "https://www.reddit.com/r/.../comments/...",
    domains: ["reddit.com", "v.redd.it", "redd.it"],
    cardDescription: "Save videos hosted on Reddit posts.",
    whatIs: [
      "The Reddit video downloader prepares videos hosted on Reddit posts so you can save them to your device. Paste a link to a post that contains a video and the tool handles the rest.",
      "Both regular post links and direct v.redd.it media links are recognized.",
    ],
    howTo: [
      "Copy the link to the Reddit post with the video.",
      "Paste it into the field above and press Download.",
      "Once the video is prepared, save it to your device.",
    ],
    supportedLinks: [
      "https://www.reddit.com/r/.../comments/...",
      "https://v.redd.it/...",
    ],
    faqs: [
      {
        q: "Can I download videos from private subreddits?",
        a: "No. Only posts from public subreddits can be processed.",
      },
      {
        q: "What about videos cross-posted from other sites?",
        a: "This tool handles videos hosted on Reddit itself. Videos embedded from external platforms may need that platform's downloader instead.",
      },
      {
        q: "Why might a link fail?",
        a: "The post may have been deleted or removed by moderators, or the video may no longer be hosted on Reddit.",
      },
    ],
  },
  {
    slug: "pinterest",
    name: "Pinterest",
    category: "social",
    toolName: "Pinterest video downloader",
    title: "Pinterest Video Downloader",
    tagline: "Download videos from Pinterest using a simple link.",
    description:
      "Download video pins from public Pinterest boards using a simple link.",
    placeholder: "Paste your Pinterest video link...",
    exampleUrl: "https://www.pinterest.com/pin/...",
    domains: ["pinterest.com", "pin.it"],
    cardDescription: "Save video pins from public boards.",
    whatIs: [
      "The Pinterest video downloader prepares video pins from public Pinterest boards so you can save them to your device.",
      "Standard pin links and shortened pin.it share links are both recognized.",
    ],
    howTo: [
      "Copy the link to the Pinterest video pin.",
      "Paste it into the field above and press Download.",
      "Once the video is prepared, save it to your device.",
    ],
    supportedLinks: [
      "https://www.pinterest.com/pin/...",
      "https://pin.it/...",
    ],
    faqs: [
      {
        q: "Can I download images too?",
        a: "This tool is built for video pins. Static images aren't handled here.",
      },
      {
        q: "Do shortened pin.it links work?",
        a: "Yes. Shortened share links are recognized and resolved like standard pin links.",
      },
      {
        q: "Can I download pins from secret boards?",
        a: "No. Only pins from public boards can be processed.",
      },
    ],
  },
  {
    slug: "vimeo",
    name: "Vimeo",
    category: "video",
    toolName: "Vimeo video downloader",
    title: "Vimeo Video Downloader",
    tagline: "Download videos from Vimeo using a simple link.",
    description:
      "Download videos from public Vimeo posts using a simple link. Paste a URL and prepare the video for download.",
    placeholder: "Paste your Vimeo video link...",
    exampleUrl: "https://vimeo.com/...",
    domains: ["vimeo.com"],
    cardDescription: "Save videos from public Vimeo posts.",
    whatIs: [
      "The Vimeo video downloader prepares videos from public Vimeo posts so you can save them to your device.",
      "Videos with password protection or domain-level privacy can't be processed.",
    ],
    howTo: [
      "Copy the link to the Vimeo video.",
      "Paste it into the field above and press Download.",
      "Once the video is prepared, save it to your device.",
    ],
    supportedLinks: [
      "https://vimeo.com/...",
      "https://player.vimeo.com/video/...",
    ],
    faqs: [
      {
        q: "Can I download private or password-protected videos?",
        a: "No. Only publicly available videos can be processed. Password-protected and private videos aren't accessible.",
      },
      {
        q: "Are Vimeo player links supported?",
        a: "Yes. Both standard vimeo.com links and player.vimeo.com embed links are recognized.",
      },
      {
        q: "Is the original quality preserved?",
        a: "The tool prepares the video as it is hosted. It doesn't re-encode or upscale content.",
      },
    ],
  },
  {
    slug: "threads",
    name: "Threads",
    category: "social",
    toolName: "Threads video downloader",
    title: "Threads Video Downloader",
    tagline: "Download videos from Threads using a simple link.",
    description:
      "Download videos from public Threads posts using a simple link. Paste a URL and prepare the video for download.",
    placeholder: "Paste your Threads video link...",
    exampleUrl: "https://www.threads.net/@.../post/...",
    domains: ["threads.net", "threads.com"],
    cardDescription: "Save videos from public Threads posts.",
    whatIs: [
      "The Threads video downloader prepares videos posted on Threads so you can save them to your device. Paste a link to a post that contains a video and the tool handles the rest.",
      "Only posts from public accounts can be processed.",
    ],
    howTo: [
      "Copy the link to the Threads post with the video.",
      "Paste it into the field above and press Download.",
      "Once the video is prepared, save it to your device.",
    ],
    supportedLinks: [
      "https://www.threads.net/@.../post/...",
      "https://www.threads.com/@.../post/...",
    ],
    faqs: [
      {
        q: "Do I need a Threads account?",
        a: "No. You only need the link to a public post. The tool never asks for your credentials.",
      },
      {
        q: "Can I download videos from private accounts?",
        a: "No. Only posts from public accounts are accessible.",
      },
      {
        q: "Why might a link fail?",
        a: "The post may have been deleted, or the account may be private or region-restricted.",
      },
    ],
  },
  {
    slug: "snapchat",
    name: "Snapchat",
    category: "social",
    toolName: "Snapchat video downloader",
    title: "Snapchat Video Downloader",
    tagline: "Download videos from Snapchat using a simple link.",
    description:
      "Download Spotlight and public story videos from Snapchat using a simple link.",
    placeholder: "Paste your Snapchat video link...",
    exampleUrl: "https://www.snapchat.com/spotlight/...",
    domains: ["snapchat.com"],
    cardDescription: "Save Spotlight and public story videos.",
    whatIs: [
      "The Snapchat video downloader prepares publicly shared Snapchat videos — Spotlight clips and public stories — so you can save them to your device.",
      "Private snaps and content shared directly between accounts aren't supported.",
    ],
    howTo: [
      "Copy the link to the public Snapchat video or Spotlight clip.",
      "Paste it into the field above and press Download.",
      "Once the video is prepared, save it to your device.",
    ],
    supportedLinks: [
      "https://www.snapchat.com/spotlight/...",
      "https://story.snapchat.com/...",
    ],
    faqs: [
      {
        q: "Can I download private snaps?",
        a: "No. Snaps sent directly to other accounts are private by design and can't be processed.",
      },
      {
        q: "What content is supported?",
        a: "Publicly shared videos — Spotlight clips and public stories — can be processed with a link.",
      },
      {
        q: "Why might a link fail?",
        a: "The content may have expired, been removed, or may no longer be publicly available.",
      },
    ],
  },
  {
    slug: "linkedin",
    name: "LinkedIn",
    category: "social",
    toolName: "LinkedIn video downloader",
    title: "LinkedIn Video Downloader",
    tagline: "Download videos from LinkedIn using a simple link.",
    description:
      "Download videos from public LinkedIn posts using a simple link. Paste a URL and prepare the video for download.",
    placeholder: "Paste your LinkedIn video link...",
    exampleUrl: "https://www.linkedin.com/posts/...",
    domains: ["linkedin.com", "lnkd.in"],
    cardDescription: "Save videos from public LinkedIn posts.",
    whatIs: [
      "The LinkedIn video downloader prepares videos from public LinkedIn posts so you can save them to your device.",
      "Only publicly shared posts can be processed. Content visible to a single company or connection circle isn't supported.",
    ],
    howTo: [
      "Copy the link to the LinkedIn post with the video.",
      "Paste it into the field above and press Download.",
      "Once the video is prepared, save it to your device.",
    ],
    supportedLinks: [
      "https://www.linkedin.com/posts/...",
      "https://www.linkedin.com/feed/update/...",
    ],
    faqs: [
      {
        q: "Do I need a LinkedIn account?",
        a: "No. You only need the link to a public post. The tool never asks for your LinkedIn credentials.",
      },
      {
        q: "Can I download videos from private posts?",
        a: "No. Only posts shared publicly can be processed.",
      },
      {
        q: "Why might a link fail?",
        a: "The post may have been deleted, or its visibility may have been changed away from public.",
      },
    ],
  },
  {
    slug: "twitch",
    name: "Twitch",
    category: "video",
    toolName: "Twitch clip downloader",
    title: "Twitch Clip Downloader",
    tagline: "Download clips and videos from Twitch using a simple link.",
    description:
      "Download clips and videos from public Twitch channels using a simple link.",
    placeholder: "Paste your Twitch clip link...",
    exampleUrl: "https://clips.twitch.tv/...",
    domains: ["twitch.tv"],
    cardDescription: "Save clips and videos from public channels.",
    whatIs: [
      "The Twitch clip downloader prepares clips and videos from public Twitch channels so you can save them to your device. Paste a clip link or a video link and the tool handles the rest.",
      "Sub-only videos and deleted content can't be processed.",
    ],
    howTo: [
      "Copy the link to the Twitch clip or video.",
      "Paste it into the field above and press Download.",
      "Once the clip is prepared, save it to your device.",
    ],
    supportedLinks: [
      "https://clips.twitch.tv/...",
      "https://www.twitch.tv/.../clip/...",
      "https://www.twitch.tv/videos/...",
    ],
    faqs: [
      {
        q: "Can I download full live streams?",
        a: "This tool focuses on clips and videos (VODs). Ongoing live streams aren't supported.",
      },
      {
        q: "Are sub-only VODs supported?",
        a: "No. Only publicly available videos and clips can be processed.",
      },
      {
        q: "Why might a link fail?",
        a: "The clip or VOD may have expired — Twitch deletes older content — or the channel may have removed it.",
      },
    ],
  },
];

export const platforms = raw.map((p) => ({
  ...p,
  heading: p.title,
  href: `/${p.slug}-video-downloader`,
}));

export function getPlatformBySlug(slug) {
  return platforms.find((p) => p.slug === slug);
}
