type Props = {
  className?: string;
  size?: number;
};

/** Open-book mark used in the site nav (inherits currentColor). */
export function BrandLogo({ className, size = 22 }: Props) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M6 5.5c0-.83.67-1.5 1.5-1.5H14c2.2 0 3.5 1.2 4 1.8.5-.6 1.8-1.8 4-1.8h6.5c.83 0 1.5.67 1.5 1.5V24c0 .83-.67 1.5-1.5 1.5H22c-1.7 0-2.9.55-3.6 1.05-.2.14-.45.14-.65 0C17.05 25.05 15.85 24.5 14 24.5H7.5c-.83 0-1.5-.67-1.5-1.5V5.5Z"
        fill="currentColor"
        opacity="0.18"
      />
      <path
        d="M16 8.2c-.7-.55-2.2-1.7-4.5-1.7H7.75c-.41 0-.75.34-.75.75V22.4c0 .3.2.57.49.68 1.55.55 3.2.92 4.76.92 1.55 0 2.7-.45 3.75-1.1.2-.13.45-.13.65 0 1.05.65 2.2 1.1 3.75 1.1 1.56 0 3.21-.37 4.76-.92.29-.11.49-.38.49-.68V7.25c0-.41-.34-.75-.75-.75H20.5c-2.3 0-3.8 1.15-4.5 1.7Z"
        fill="currentColor"
      />
      <path
        d="M16 8.2V23.1"
        stroke="var(--canvas)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M11.2 14.2 9.4 16l1.8 1.8"
        stroke="var(--canvas)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.8 14.2 22.6 16l-1.8 1.8"
        stroke="var(--canvas)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.1 13.4 14.9 18.6"
        stroke="var(--canvas)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
