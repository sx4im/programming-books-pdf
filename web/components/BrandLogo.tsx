import { BRAND_LOGO_PATH } from "../lib/brand-logo-path";

type Props = {
  className?: string;
  size?: number;
};

/**
 * Brand mark from the user-provided SVG.
 * Uses currentColor so it follows light/dark theme text color.
 */
export function BrandLogo({ className, size = 28 }: Props) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 1095 1095"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d={BRAND_LOGO_PATH} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}
