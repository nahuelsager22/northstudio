import type { SVGProps } from "react";

/** El astro de la firma, en las coordenadas exactas del lockup. */
const ASTRO =
  "M104 1 L104.61 6.52 L106.33 5.67 L105.48 7.39 L111 8 L105.48 8.61 L106.33 10.33 L104.61 9.48 L104 15 L103.39 9.48 L101.67 10.33 L102.52 8.61 L97 8 L102.52 7.39 L101.67 5.67 L103.39 6.52 Z";

/**
 * Firma completa: cordón + destello + "North Studio", una sola escena
 * (art-direction.md §6.3). `fill="currentColor"` hereda el color del tema.
 *
 * `sinAstro` omite la estrella para que pueda dibujarse aparte, en su propia
 * capa, y moverse a otro ritmo (`AstroDeLaFirma` + `FirmaViva`). Las dos capas
 * comparten el mismo `viewBox`, así que la alineación está garantizada por la
 * geometría y no por un ajuste a ojo: la estrella cae exactamente donde caía.
 */
export function Lockup({
  sinAstro,
  ...props
}: SVGProps<SVGSVGElement> & { sinAstro?: boolean }) {
  return (
    <svg
      viewBox="0 0 190 116"
      role="img"
      aria-label="North Studio"
      fill="currentColor"
      {...props}
    >
      {sinAstro ? null : <path d={ASTRO} />}
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

/** Solo el astro, en el mismo lienzo que la firma. Decorativo: la firma ya se nombra. */
export function AstroDeLaFirma(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 190 116"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d={ASTRO} />
    </svg>
  );
}
