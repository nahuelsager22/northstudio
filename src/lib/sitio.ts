/**
 * La dirección pública del sitio.
 *
 * Necesaria para que las URL absolutas de `openGraph`, `alternates` y el sitemap
 * existan: sin una base, Next emite rutas relativas que ningún cliente externo
 * puede resolver, y la tarjeta de previsualización —que es la primera impresión
 * de un link compartido— queda vacía.
 *
 * Se lee del entorno para que un preview no se anuncie con la URL de producción.
 * Vercel expone `VERCEL_PROJECT_PRODUCTION_URL` en producción y `VERCEL_URL` en
 * cada deploy; localmente cae al puerto de desarrollo.
 */
export const urlDelSitio: string = (() => {
  const explicita = process.env.NEXT_PUBLIC_SITIO_URL?.trim();
  if (explicita) return sinBarra(explicita);

  const produccion = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (produccion) return `https://${sinBarra(produccion)}`;

  const deploy = process.env.VERCEL_URL?.trim();
  if (deploy) return `https://${sinBarra(deploy)}`;

  return "http://localhost:3000";
})();

function sinBarra(valor: string): string {
  return valor.replace(/\/+$/, "");
}
