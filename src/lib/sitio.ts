/**
 * La dirección pública del sitio.
 *
 * Necesaria para que las URL absolutas de `openGraph`, `alternates` y el sitemap
 * existan: sin una base, Next emite rutas relativas que ningún cliente externo
 * puede resolver, y la tarjeta de previsualización —que es la primera impresión
 * de un link compartido— queda vacía.
 *
 * Se lee del entorno para que un preview no se anuncie con la URL de producción.
 *
 * **El sitio vive en Netlify**, y esto sólo conocía las variables de Vercel:
 * en producción caía al puerto de desarrollo, y el sitio publicado salió a la
 * calle con `og:image`, `og:url`, `canonical`, `hreflang` y el sitemap apuntando
 * a `http://localhost:3000`. WhatsApp intentaba bajar la tarjeta de una
 * dirección que no existe, y un buscador leía que la página real era otra.
 *
 * Netlify expone `URL` (la dirección principal del sitio: el dominio propio si
 * es el primario) y `DEPLOY_PRIME_URL` (la dirección estable de cada deploy
 * preview o rama), con `CONTEXT` diciendo cuál es el caso. Se leen sólo cuando
 * `CONTEXT` existe, porque `URL` es un nombre demasiado genérico para confiar en
 * él a ciegas en cualquier máquina.
 *
 * El orden es: la explícita, después el host que esté presente, después el
 * desarrollo local. Vercel se conserva por si algún día el sitio se muda.
 */
export const urlDelSitio: string = (() => {
  const explicita = process.env.NEXT_PUBLIC_SITIO_URL?.trim();
  if (explicita) return sinBarra(explicita);

  const netlify = process.env.CONTEXT?.trim();
  if (netlify) {
    const principal = process.env.URL?.trim();
    if (netlify === "production" && principal) return sinBarra(principal);

    const deploy = process.env.DEPLOY_PRIME_URL?.trim();
    if (deploy) return sinBarra(deploy);
    if (principal) return sinBarra(principal);
  }

  const produccion = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (produccion) return `https://${sinBarra(produccion)}`;

  const deploy = process.env.VERCEL_URL?.trim();
  if (deploy) return `https://${sinBarra(deploy)}`;

  return "http://localhost:3000";
})();

/**
 * Dónde encontrar al estudio fuera del formulario. Vive acá y no en los
 * diccionarios porque no se traduce: un handle y una dirección son la misma
 * cadena en los dos idiomas, y duplicarlas sería crear dos fuentes de verdad
 * para un dato que sólo puede tener una.
 */
export const redes = {
  instagram: "northstudio.ar",
  instagramUrl: "https://instagram.com/northstudio.ar",
  email: "northstudio@northstudio.com.ar",
} as const;

function sinBarra(valor: string): string {
  return valor.replace(/\/+$/, "");
}
