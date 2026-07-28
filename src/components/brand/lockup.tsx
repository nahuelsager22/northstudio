import type { SVGProps } from "react";

/**
 * Firma completa: cordón + destello + "North Studio", una sola escena
 * (art-direction.md §6.3). `fill="currentColor"` hereda el color del tema.
 */
export function Lockup(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 190 116"
      role="img"
      aria-label="North Studio"
      fill="currentColor"
      {...props}
    >
      <path d="M104 1 L104.61 6.52 L106.33 5.67 L105.48 7.39 L111 8 L105.48 8.61 L106.33 10.33 L104.61 9.48 L104 15 L103.39 9.48 L101.67 10.33 L102.52 8.61 L97 8 L102.52 7.39 L101.67 5.67 L103.39 6.52 Z" />
      <path
        fillRule="evenodd"
        d="M14 64 L26 56 L44 42 L53 50 L63 33 L74 13 L83 31 L92 25 L99 38 L110 20 L122 33 L134 27 L146 46 L158 56 L168 64 Z M73 15 L66 31 L71 25 Z M109 22 L102 36 L106 28 Z"
      />
      <text
        x="21"
        y="100"
        className="font-serif"
        fontSize="25"
        fontWeight="400"
        letterSpacing="0.3"
      >
        North Studio
      </text>
    </svg>
  );
}
