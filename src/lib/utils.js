export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${unit === 0 ? value : value.toFixed(1)} ${units[unit]}`;
}

export function formatDuration(totalSeconds) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "";
  const s = Math.round(totalSeconds);
  const m = Math.floor(s / 60);
  const rest = s % 60;
  if (m === 0) return `0:${String(rest).padStart(2, "0")}`;
  const h = Math.floor(m / 60);
  if (h === 0) return `${m}:${String(rest).padStart(2, "0")}`;
  return `${h}:${String(m % 60).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}
