/**
 * A single, consistent set of minimal stroke icons for all supported
 * platforms. Every mark is drawn on the same 24x24 grid with the same
 * stroke weight. Marks use their platform's brand color; X and Threads
 * are inherently black/white brands and use currentColor so they adapt
 * to the active theme.
 */

const marks = {
  x: <path d="M5 4.5l14 15M19 4.5l-14 15" />,

  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke="#E4405F" />
      <circle cx="12" cy="12" r="3.8" stroke="#E4405F" />
      <circle cx="16.9" cy="7.1" r="0.55" fill="#E4405F" stroke="none" />
    </>
  ),

  tiktok: (
    <>
      <path
        d="M14 4.5v9.3a4.2 4.2 0 1 1-4.2-4.2"
        stroke="#FE2C55"
        transform="translate(1.2 1.2)"
      />
      <path d="M14 4.5v9.3a4.2 4.2 0 1 1-4.2-4.2" />
      <path d="M14 4.5c.5 2.6 2.4 4.5 5 5" stroke="#25F4EE" />
    </>
  ),

  facebook: (
    <>
      <circle cx="12" cy="12" r="8.5" stroke="#1877F2" />
      <path d="M14.8 7.8h-1.6a2.4 2.4 0 0 0-2.4 2.4v6.4" stroke="#1877F2" />
      <path d="M9.3 12.6h4.6" stroke="#1877F2" />
    </>
  ),

  reddit: (
    <>
      <circle cx="12" cy="13.8" r="5.8" stroke="#FF4500" />
      <path d="M12 8V5.2" stroke="#FF4500" />
      <circle cx="12" cy="4" r="1.2" stroke="#FF4500" />
      <circle cx="9.7" cy="13.4" r="0.55" fill="#FF4500" stroke="none" />
      <circle cx="14.3" cy="13.4" r="0.55" fill="#FF4500" stroke="none" />
      <path d="M10.2 15.9c1.1.8 2.5.8 3.6 0" stroke="#FF4500" />
    </>
  ),

  pinterest: (
    <>
      <circle cx="12" cy="12" r="8.5" stroke="#E60023" />
      <path d="M10 16.5v-9h2.6a2.55 2.55 0 0 1 0 5.1H10" stroke="#E60023" />
    </>
  ),

  vimeo: (
    <path
      d="M4.5 8c1.2 3.4 3.4 8 5.6 9.4 2.2-1.4 4.6-6.4 9.4-11"
      stroke="#1AB7EA"
    />
  ),

  threads: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M16 8v5a3 3 0 0 0 6 0v-2a10 10 0 1 0-3.92 7.94" />
    </>
  ),

  snapchat: (
    <path
      d="M12 4c-2.9 0-4.6 2-4.6 4.6 0 1.6.4 2.7.4 3.9-.8.3-2.4.1-2.4 1.5 0 1 1.2 1.4 2.4 1.8-.3 1-1.5 1.6-1.5 2.2 0 .9 2 1.1 3.4 1.1 1 0 1.4-.4 2.3-.4s1.3.4 2.3.4c1.4 0 3.4-.2 3.4-1.1 0-.6-1.2-1.2-1.5-2.2 1.2-.4 2.4-.8 2.4-1.8 0-1.4-1.6-1.2-2.4-1.5 0-1.2.4-2.3.4-3.9C16.6 6 14.9 4 12 4z"
      stroke="#FFFC00"
    />
  ),

  linkedin: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" stroke="#0A66C2" />
      <path d="M7.5 10.5v6" stroke="#0A66C2" />
      <circle cx="7.5" cy="7.6" r="0.55" fill="#0A66C2" stroke="none" />
      <path d="M11.5 16.5v-6" stroke="#0A66C2" />
      <path d="M11.5 12.8a2.5 2.5 0 0 1 5 0v3.7" stroke="#0A66C2" />
    </>
  ),

  twitch: (
    <>
      <path d="M4.5 4h15v10l-3.5 3.5h-3L10 20.5v-3H4.5V4z" stroke="#9146FF" />
      <path d="M10.5 7.5v3.5" stroke="#9146FF" />
      <path d="M14.5 7.5v3.5" stroke="#9146FF" />
    </>
  ),
};

export function PlatformIcon({ slug, size = 18, className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {marks[slug] ?? <circle cx="12" cy="12" r="8.5" />}
    </svg>
  );
}
