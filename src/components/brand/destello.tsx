import type { SVGProps } from "react";

/**
 * El destello polar solo, sin el cordón.
 *
 * La marca del navbar. Es la misma geometría exacta del astro de la firma
 * (`lockup.tsx` / `mark.tsx`), reencuadrada a una caja de 24: cuatro rayos
 * largos y cuatro cortos.
 *
 * Por qué esto y no un monograma NS: dos letras no dicen nada que el nombre no
 * diga ya, y competirían con la firma. Y por qué esto y no la marca compacta
 * completa: el cordón entero se dispersa por debajo de 32 px, y repetir montaña
 * y estrella arriba mientras el umbral muestra la firma completa era decir dos
 * veces lo mismo. El lockup queda reservado para donde tiene protagonismo.
 *
 * Además significa lo que hace: una barra de navegación orienta, y orientar es
 * exactamente para lo que sirve una estrella polar.
 */
export function Destello(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2 L12.87 9.89 L15.33 8.67 L13.11 11.13 L22 12 L13.11 12.87 L15.33 15.33 L12.87 14.11 L12 22 L11.13 14.11 L8.67 15.33 L10.89 12.87 L2 12 L10.89 11.13 L8.67 8.67 L11.13 9.89 Z" />
    </svg>
  );
}
