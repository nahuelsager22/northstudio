/**
 * Lo que comparten los generadores de marca (`perfil.mjs`, `og.mjs`): la carga
 * de sharp, la conversión de color, la geometría canónica y el logotipo.
 *
 * Existe porque hay dos consumidores. Antes todo vivía en `perfil.mjs`; la
 * tarjeta de previsualización necesita exactamente las mismas piezas, y tener
 * la geometría del cordón copiada en dos archivos es la forma más segura de
 * que un día difieran.
 */

import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const raiz = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const require = createRequire(import.meta.url);
export const sharp = require(
  require.resolve("sharp", {
    paths: [resolve(raiz, "node_modules/.pnpm/sharp@0.34.5/node_modules")],
  })
);

/* ── Color ─────────────────────────────────────────────────────────────── */

/** OKLCH → sRGB hex. La misma conversión que hace el navegador, sin navegador. */
export function oklchAHex(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;

  const lineal = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];

  const canal = (v) => {
    const g = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
    return Math.round(Math.min(1, Math.max(0, g)) * 255)
      .toString(16)
      .padStart(2, "0");
  };

  return `#${lineal.map(canal).join("")}`.toUpperCase();
}

/** Tokens vigentes de `src/app/globals.css`. */
export const NOCHE_BG = oklchAHex(0.115, 0.018, 265);
export const NOCHE_INK = oklchAHex(0.93, 0.006, 85);
export const PAPEL_BG = oklchAHex(0.955, 0.006, 85);
export const PAPEL_INK = oklchAHex(0.22, 0.008, 60);

/* ── Geometría ─────────────────────────────────────────────────────────── */

/**
 * Copiada sin tocar un punto de `brand/north-studio-mark-*.svg`. El cordón lleva
 * `fill-rule="evenodd"`: los tres subtrazos finales son las caras de luz, huecos
 * que dejan ver el fondo.
 */
export const MARCA = {
  viewBox: [0, 0, 182, 72],
  // Contenido real, sin el aire del viewBox: x 14→168, y 1→64.
  bbox: { x: 14, y: 1, ancho: 154, alto: 63 },
  destello:
    "M104 1 L104.61 6.52 L106.33 5.67 L105.48 7.39 L111 8 L105.48 8.61 L106.33 10.33 L104.61 9.48 L104 15 L103.39 9.48 L101.67 10.33 L102.52 8.61 L97 8 L102.52 7.39 L101.67 5.67 L103.39 6.52 Z",
  cordon:
    "M14 64 L26 56 L44 42 L53 50 L63 33 L74 13 L83 31 L92 25 L99 38 L110 20 L122 33 L134 27 L146 46 L158 56 L168 64 Z M73 15 L66 31 L71 25 Z M109 22 L102 36 L106 28 Z",
};

/** El destello solo, reencuadrado a su propia caja (el mismo de `destello.tsx`). */
export const SOLO_DESTELLO = {
  bbox: { x: 2, y: 2, ancho: 20, alto: 20 },
  path: "M12 2 L12.87 9.89 L15.33 8.67 L13.11 11.13 L22 12 L13.11 12.87 L15.33 15.33 L12.87 14.11 L12 22 L11.13 14.11 L8.67 15.33 L10.89 12.87 L2 12 L10.89 11.13 L8.67 8.67 L11.13 9.89 Z",
};

/**
 * Proporciones del grupo firmado, tomadas del lockup: el nombre mide el 70 % del
 * ancho de la marca y se separa de ella un 26 % del alto de la marca.
 */
export const NOMBRE_ANCHO = 0.7;
export const NOMBRE_AIRE = 0.26;

/* ── El logotipo ───────────────────────────────────────────────────────── */

/**
 * El logotipo, rasterizado del Newsreader real.
 *
 * El rasterizador de SVG **no ve** las fuentes del proyecto: son woff2 y no
 * están instaladas en el sistema, así que un `<text font-family="Newsreader">`
 * cae a un serif genérico — comprobado, y el resultado es visiblemente otra
 * tipografía. `sharp.text({ fontfile })` tampoco lee woff2.
 *
 * Por eso el logotipo entra como máscara: se rasterizó una vez en el navegador,
 * que sí tiene la fuente cargada, con el mismo tracking que el lockup (0.3 sobre
 * 25 = 0.012em). Se guarda blanco sobre transparente para poder teñirlo con
 * cualquiera de las dos tintas, y a 949 px de ancho, ~2× el tamaño al que se usa.
 *
 * Vive junto a los generadores y no en `brand/` porque no es un entregable de
 * marca: es un insumo. Si algún día hay un TTF/OTF de Newsreader a mano, esto se
 * reemplaza por texto vectorial y el archivo deja de hacer falta.
 */
export const LOGOTIPO = resolve(raiz, "scripts/north-studio-logotipo.png");
export const LOGOTIPO_PROPORCION = 949 / 124;

/**
 * El logotipo, escalado y teñido. La máscara es blanca sobre transparente, así
 * que la tinta se aplica pintando un rectángulo del color y recortándolo con
 * ella (`dest-in`).
 */
export async function logotipo(tinta, ancho, alto) {
  const mascara = await sharp(LOGOTIPO)
    .resize(ancho, alto, { fit: "fill" })
    .png()
    .toBuffer();

  return sharp({
    create: { width: ancho, height: alto, channels: 4, background: tinta },
  })
    .composite([{ input: mascara, blend: "dest-in" }])
    .png()
    .toBuffer();
}
