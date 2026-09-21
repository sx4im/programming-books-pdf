type Props = {
  className?: string;
  size?: number;
};

/**
 * Open-book brand mark matching the generated logo:
 * outline book, stacked page edges, bold < > chevrons.
 * Uses currentColor for light/dark themes.
 */
export function BrandLogo({ className, size = 28 }: Props) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Outer book frame */}
      <path
        d="M8 16.5
           C8 16.5 14.5 10 24 10
           C28.2 10 30.4 13.2 32 16.5
           C33.6 13.2 35.8 10 40 10
           C49.5 10 56 16.5 56 16.5
           V44.5
           C56 44.5 49.5 51.5 40 51.5
           C35.8 51.5 33.6 48.2 32 45
           C30.4 48.2 28.2 51.5 24 51.5
           C14.5 51.5 8 44.5 8 44.5
           V16.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Spine */}
      <path
        d="M32 16.5 V45"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Bottom spine notch */}
      <path
        d="M28.5 51.2 C29.8 53.4 34.2 53.4 35.5 51.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Top page stacks — left */}
      <path
        d="M10.5 19.2 C14.8 15.4 19.8 13.6 24.2 13.6 C27.2 13.6 29.4 15.4 30.8 17.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M11.2 21.6 C15 18.4 19.4 16.8 23.6 16.8 C26.4 16.8 28.5 18.3 29.8 20.4"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* Top page stacks — right */}
      <path
        d="M53.5 19.2 C49.2 15.4 44.2 13.6 39.8 13.6 C36.8 13.6 34.6 15.4 33.2 17.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M52.8 21.6 C49 18.4 44.6 16.8 40.4 16.8 C37.6 16.8 35.5 18.3 34.2 20.4"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* Bottom page stacks — left */}
      <path
        d="M10.5 42 C15 46 19.8 48 24.2 48 C27.2 48 29.4 46.1 30.8 43.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M11.2 39.6 C15.2 43.2 19.6 45 23.8 45 C26.6 45 28.7 43.4 30 41.2"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* Bottom page stacks — right */}
      <path
        d="M53.5 42 C49 46 44.2 48 39.8 48 C36.8 48 34.6 46.1 33.2 43.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M52.8 39.6 C48.8 43.2 44.4 45 40.2 45 C37.4 45 35.3 43.4 34 41.2"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* Bold < */}
      <path
        d="M26.2 23.2 L17.4 32 l8.8 8.8"
        stroke="currentColor"
        strokeWidth="5.2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />

      {/* Bold > */}
      <path
        d="M37.8 23.2 L46.6 32 l-8.8 8.8"
        stroke="currentColor"
        strokeWidth="5.2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
