import {
  Archive,
  Scissors,
  Image as ImageIcon,
  Download,
  ArrowLeftRight,
  Minimize2,
  AudioLines,
  Clapperboard,
} from "lucide-react";
import { platforms } from "./platforms";
import { converters, converterToTool } from "./converters";

export const toolCategories = [
  { id: "all", label: "All" },
  { id: "download", label: "Download", icon: Download },
  { id: "convert", label: "Convert", icon: ArrowLeftRight },
  { id: "compress", label: "Compress", icon: Minimize2 },
  { id: "edit", label: "Edit", icon: Scissors },
  { id: "audio", label: "Audio", icon: AudioLines },
  { id: "creator", label: "Creator", icon: Clapperboard },
];

function titleCase(name) {
  return name.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Map a platform entry to the tool shape used by the directory. */
export function platformToTool(p) {
  return {
    id: p.slug,
    name: titleCase(p.toolName),
    description: p.cardDescription,
    category: "download",
    href: p.href,
    available: true,
    meta: p.domains.slice(0, 2).join(" · "),
  };
}

const downloaderTools = platforms.map(platformToTool);
const converterTools = converters.map(converterToTool);

const futureTools = [
  {
    id: "video-compressor",
    name: "Video Compressor",
    description: "Reduce the file size of a video.",
    category: "compress",
    available: false,
    icon: Archive,
    meta: "mp4 · webm · mov",
  },
  {
    id: "video-trimmer",
    name: "Video Trimmer",
    description: "Cut a video down to the part you need.",
    category: "edit",
    available: false,
    icon: Scissors,
    meta: "mp4 · webm · mov",
  },
  {
    id: "thumbnail-downloader",
    name: "Thumbnail Downloader",
    description: "Save the thumbnail image of a video.",
    category: "creator",
    available: false,
    icon: ImageIcon,
    meta: "jpg · png",
  },
];

export const tools = [...downloaderTools, ...converterTools, ...futureTools];
