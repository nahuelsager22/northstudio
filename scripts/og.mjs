/**
 * Genera la tarjeta de previsualización del sitio — lo que aparece al compartir
 * un enlace en WhatsApp, Instagram, iMessage, Slack o cualquier lector de Open
 * Graph.
 *
 *   node scripts/og.mjs
 *
 * Sale a `public/og.png` y los layouts la declaran en `openGraph.images` y
 * `twitter.images`. Es un script de estudio: no lo importa ninguna ruta.
 *
 * Por qué una imagen estática y no una ruta `opengraph-image.tsx`: la ruta
 * dinámica de Next rasteriza con Satori, y Satori no lee woff2 — la única forma
 * que hay de Newsreader en el proyecto. El logotipo ya está resuelto como máscara
 * rasterizada del navegador (`marca.mjs`), así que la tarjeta se compone con la
 * misma cadena que las fotos de perfil y sale idéntica a la firma real.
 *
 * Qué lleva y qué no: **la firma sola, sobre la noche, con un cielo discreto.**
 * Sin frase, sin dirección, sin claim. La tarjeta se muestra siempre al lado del
 * título y la descripción de la página —esos ya dicen qué es North Studio—, así
 * que la imagen tiene un solo trabajo: que se reconozca la firma a 300 px de
 * ancho en una pantalla de teléfono. Todo lo que se sume compite con eso.
 *
 * 1200×630 es el formato que WhatsApp, Facebook, LinkedIn y Slack recortan
 * menos (1.91:1). Y pesa poco a propósito: WhatsApp no muestra la vista grande
 * si la imagen pasa de ~300 KB, y un campo plano en PNG entra en una fracción.
 */

import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import {
  raiz,
  sharp,
  NOCHE_BG,
  NOCHE_INK,
  MARCA,
  NOMBRE_ANCHO,
  NOMBRE_AIRE,
  LOGOTIPO_PROPORCION,
  logotipo,
} from "./marca.mjs";

const ANCHO = 1200;
const ALTO = 630;

/**
 * Ancho de la marca en la tarjeta.
 *
 * El grupo firmado (marca + nombre) tiene proporción 1,65:1, y la tarjeta
 * 1,91:1: entra sobrado a lo ancho, así que lo que manda es el alto. Con 560 px
 * de marca el grupo mide ~340 de alto y deja ~145 px de aire arriba y abajo —
 * que es lo que hace que a tamaño de miniatura se lea como una firma apoyada en
 * un cielo y no como un logo que llena un rectángulo.
 */
const MARCA_ANCHO = 560;

/**
 * El cielo. Pocas estrellas, colocadas a mano lejos del grupo y de los bordes
 * (las miniaturas recortan un poco de cada lado). Intensidad "visible" —la misma
 * de los avatares— porque a 300 px de ancho un cielo discreto desaparece, y la
 * tarjeta tiene que decir *noche* sin que haga falta abrirla.
 */
const CIELO = [
  [150, 118, 4.4, 0.72],
  [1040, 96, 3.8, 0.62],
  [1096, 306, 4.6, 0.76],
  [104, 400, 3.6, 0.58],
  [612, 62, 3.2, 0.52],
  [986, 548, 4.0, 0.66],
  [214, 552, 3.4, 0.56],
  [1160, 470, 3.0, 0.48],
];

function grupo() {
  const anchoMarca = MARCA_ANCHO;
  const altoMarca = (MARCA.bbox.alto / MARCA.bbox.ancho) * anchoMarca;
  const anchoNombre = anchoMarca * NOMBRE_ANCHO;
  const altoNombre = Math.round(anchoNombre / LOGOTIPO_PROPORCION);
  const aire = altoMarca * NOMBRE_AIRE;
  const altoGrupo = altoMarca + aire + altoNombre;

  // Ocho píxeles por encima del centro: el grupo es cabeza-pesada (la montaña
  // arriba, el nombre abajo) y centrado por geometría queda visualmente caído.
  const arriba = (ALTO - altoGrupo) / 2 - 8;

  return {
    anchoMarca,
    altoMarca,
    anchoNombre: Math.round(anchoNombre),
    altoNombre,
    marcaY: arriba,
    nombreY: Math.round(arriba + altoMarca + aire),
    nombreX: Math.round((ANCHO - anchoNombre) / 2),
  };
}

const g = grupo();
const escala = g.anchoMarca / MARCA.bbox.ancho;
const x = (ANCHO - g.anchoMarca) / 2 - MARCA.bbox.x * escala;
const y = g.marcaY - MARCA.bbox.y * escala;

const estrellas = CIELO.map(
  ([cx, cy, r, o]) =>
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${NOCHE_INK}" opacity="${o}"/>`
).join("\n  ");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ANCHO}" height="${ALTO}" viewBox="0 0 ${ANCHO} ${ALTO}">
  <rect width="${ANCHO}" height="${ALTO}" fill="${NOCHE_BG}"/>
  ${estrellas}
  <g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${escala.toFixed(5)})" fill="${NOCHE_INK}">
    <path d="${MARCA.destello}"/>
    <path fill-rule="evenodd" d="${MARCA.cordon}"/>
  </g>
</svg>`;

const salida = resolve(raiz, "public");
await mkdir(salida, { recursive: true });

const nombre = await logotipo(NOCHE_INK, g.anchoNombre, g.altoNombre);
const archivo = resolve(salida, "og.png");

const info = await sharp(Buffer.from(svg))
  .composite([{ input: nombre, left: g.nombreX, top: g.nombreY }])
  .png({ compressionLevel: 9, palette: true })
  .toFile(archivo);

console.log(
  `✓ public/og.png  ${info.width}×${info.height}  ${(info.size / 1024).toFixed(1)} KB  fondo ${NOCHE_BG}  tinta ${NOCHE_INK}`
);
