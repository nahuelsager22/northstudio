/**
 * Genera la imagen de perfil de North Studio para redes sociales.
 *
 *   node scripts/perfil.mjs
 *
 * Sale a `brand/perfil/`. Es un script de estudio, no de la web: no lo importa
 * ninguna ruta y no entra al bundle.
 *
 * Decisión de qué marca usar, y por qué NO el recorte de favicon:
 * el favicon (`brand/north-studio-favicon-*.svg`) recorta cumbre dominante +
 * vecinas porque a 16–32 px el cordón entero se dispersa. A 1024 px ese mismo
 * recorte se lee como un triángulo con una muesca — es decir, exactamente la
 * "silueta simplificada a ícono" que el proyecto descartó por genérica. Una foto
 * de perfil se guarda grande y se mira grande en el perfil, así que acá va el
 * **cordón completo con sus caras de luz**: varias cumbres, ritmo irregular y el
 * destello. Es lo único que hace que esa montaña sea de North Studio.
 *
 * Los colores no están escritos a mano: se derivan de los mismos valores OKLCH
 * que viven en `globals.css`, convertidos acá. Si el tema cambia, se corrige el
 * valor en un solo lugar y las imágenes se vuelven a generar.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const sharp = require(
  require.resolve("sharp", {
    paths: [resolve(raiz, "node_modules/.pnpm/sharp@0.34.5/node_modules")],
  })
);

/* ── Color ─────────────────────────────────────────────────────────────── */

/** OKLCH → sRGB hex. La misma conversión que hace el navegador, sin navegador. */
function oklchAHex(L, C, hDeg) {
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
const NOCHE_BG = oklchAHex(0.115, 0.018, 265);
const NOCHE_INK = oklchAHex(0.93, 0.006, 85);
const PAPEL_BG = oklchAHex(0.955, 0.006, 85);
const PAPEL_INK = oklchAHex(0.22, 0.008, 60);

/* ── Geometría ─────────────────────────────────────────────────────────── */

/**
 * Copiada sin tocar un punto de `brand/north-studio-mark-*.svg`. El cordón lleva
 * `fill-rule="evenodd"`: los tres subtrazos finales son las caras de luz, huecos
 * que dejan ver el fondo.
 */
const MARCA = {
  viewBox: [0, 0, 182, 72],
  // Contenido real, sin el aire del viewBox: x 14→168, y 1→64.
  bbox: { x: 14, y: 1, ancho: 154, alto: 63 },
  destello:
    "M104 1 L104.61 6.52 L106.33 5.67 L105.48 7.39 L111 8 L105.48 8.61 L106.33 10.33 L104.61 9.48 L104 15 L103.39 9.48 L101.67 10.33 L102.52 8.61 L97 8 L102.52 7.39 L101.67 5.67 L103.39 6.52 Z",
  cordon:
    "M14 64 L26 56 L44 42 L53 50 L63 33 L74 13 L83 31 L92 25 L99 38 L110 20 L122 33 L134 27 L146 46 L158 56 L168 64 Z M73 15 L66 31 L71 25 Z M109 22 L102 36 L106 28 Z",
};

/** El destello solo, reencuadrado a su propia caja (el mismo de `destello.tsx`). */
const SOLO_DESTELLO = {
  bbox: { x: 2, y: 2, ancho: 20, alto: 20 },
  path: "M12 2 L12.87 9.89 L15.33 8.67 L13.11 11.13 L22 12 L13.11 12.87 L15.33 15.33 L12.87 14.11 L12 22 L11.13 14.11 L8.67 15.33 L10.89 12.87 L2 12 L10.89 11.13 L8.67 8.67 L11.13 9.89 Z",
};

const LADO = 1024;

/**
 * Encaja un contenido en el cuadro dejando aire real.
 *
 * `anchoUtil` es cuánto del lado ocupa la marca, y el número salió de mirar el
 * recorte circular a tamaño real, no de una regla. Casi todas las redes recortan
 * la foto de perfil en círculo, así que el margen se calcula contra la
 * **diagonal** y no contra el ancho: para un contenido de proporción r inscripto
 * en un círculo de radio R, el ancho máximo es 2R/√(1+1/r²) — acá 948 px. Con
 * 840 quedan 58 px de aire hasta el borde del círculo.
 *
 * La primera versión usaba 700 y a 48 px la montaña era una astilla en un disco
 * negro: el margen "prudente" contra el ancho desperdiciaba todo el alto que un
 * elemento apaisado deja libre dentro de un círculo.
 *
 * Se centra 12 px por encima del centro geométrico: la masa está abajo (la
 * montaña) y la luz arriba (el destello), así que centrar por geometría la deja
 * visualmente caída.
 */
function encajar(bbox, anchoUtil, subir = 12) {
  const escala = anchoUtil / bbox.ancho;
  const alto = bbox.alto * escala;
  return {
    escala,
    x: (LADO - anchoUtil) / 2 - bbox.x * escala,
    y: (LADO - alto) / 2 - bbox.y * escala - subir,
  };
}

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
 * Vive junto a este script y no en `brand/` porque no es un entregable de marca:
 * es un insumo del generador. Si algún día hay un TTF/OTF de Newsreader a mano,
 * esto se reemplaza por texto vectorial y el archivo deja de hacer falta.
 */
const LOGOTIPO = resolve(raiz, "scripts/north-studio-logotipo.png");
const LOGOTIPO_PROPORCION = 949 / 124;

/**
 * Cielos. Puntos colocados a mano —no al azar— lejos de la marca y del borde del
 * recorte circular. Pocos y grandes a propósito: a 40 px, un campo de estrellas
 * real se vuelve suciedad.
 *
 * Hay dos intensidades y dos disposiciones:
 *
 * · `discreto` es el cielo original: hay que mirar la imagen para verlo.
 * · `visible` sube tamaño y opacidad para que las estrellas se noten sin abrir
 *   la imagen, que es lo que pedía el encargo. Sigue sin ser un planetario:
 *   son las mismas posiciones, más presentes.
 *
 * La disposición cambia cuando la marca lleva el nombre debajo, porque el grupo
 * ocupa mucho más alto y varias estrellas del cielo suelto caerían encima.
 */
const CIELOS = {
  suelto: {
    discreto: [
      [300, 232, 3.4, 0.5],
      [700, 196, 2.6, 0.36],
      [830, 318, 3.0, 0.44],
      [198, 330, 2.4, 0.32],
      [560, 148, 2.2, 0.3],
      [330, 780, 3.2, 0.48],
      [700, 800, 2.6, 0.36],
      [512, 842, 2.4, 0.34],
    ],
    visible: [
      [300, 232, 5.0, 0.82],
      [700, 196, 4.0, 0.66],
      [830, 318, 4.6, 0.74],
      [198, 330, 3.8, 0.62],
      [560, 148, 3.4, 0.56],
      [330, 780, 4.8, 0.8],
      [700, 800, 4.0, 0.66],
      [512, 842, 3.6, 0.6],
      [148, 552, 3.2, 0.5],
      [880, 560, 3.4, 0.54],
    ],
  },
  firmado: {
    discreto: [
      [252, 214, 3.2, 0.46],
      [762, 200, 2.6, 0.36],
      [860, 386, 2.8, 0.4],
      [164, 404, 2.4, 0.32],
      [512, 140, 2.2, 0.3],
      [286, 848, 3.0, 0.44],
      [744, 852, 2.6, 0.36],
    ],
    visible: [
      [252, 214, 4.8, 0.8],
      [762, 200, 4.0, 0.66],
      [860, 386, 4.4, 0.72],
      [164, 404, 3.8, 0.62],
      [512, 140, 3.4, 0.56],
      [286, 848, 4.6, 0.76],
      [744, 852, 4.0, 0.66],
      // Bien al costado del cordón: a la altura de su base parecían suciedad
      // apoyada sobre la línea del horizonte.
      [104, 470, 3.2, 0.5],
      [920, 520, 3.4, 0.54],
    ],
  },
};

/**
 * Proporciones del grupo firmado, tomadas del lockup: el nombre mide el 70 % del
 * ancho de la marca y se separa de ella un 26 % del alto de la marca.
 */
const NOMBRE_ANCHO = 0.7;
const NOMBRE_AIRE = 0.26;

/**
 * Ancho de la marca cuando lleva el nombre debajo.
 *
 * Baja de 840 a 750 porque el grupo deja de ser apaisado: con el nombre, la
 * proporción pasa de 2,44:1 a 1,65:1, y **en un círculo lo que manda es la
 * diagonal**. Para r=1,65 el ancho máximo es 875; con 750 quedan unos 73 px de
 * aire hasta el borde del recorte circular.
 */
const MARCA_ANCHO_SUELTA = 840;
const MARCA_ANCHO_FIRMADA = 750;

/** Geometría del grupo firmado, para colocar marca y nombre y para ubicar el cielo. */
function grupoFirmado() {
  const anchoMarca = MARCA_ANCHO_FIRMADA;
  const altoMarca = (MARCA.bbox.alto / MARCA.bbox.ancho) * anchoMarca;
  const anchoNombre = anchoMarca * NOMBRE_ANCHO;
  const altoNombre = anchoNombre / LOGOTIPO_PROPORCION;
  const aire = altoMarca * NOMBRE_AIRE;
  const altoGrupo = altoMarca + aire + altoNombre;

  // Ocho píxeles por encima del centro geométrico: el grupo es cabeza-pesada
  // (montaña) y centrarlo por geometría lo deja visualmente caído.
  const arriba = (LADO - altoGrupo) / 2 - 8;

  return {
    anchoMarca,
    altoMarca,
    anchoNombre,
    altoNombre: Math.round(altoNombre),
    marcaY: arriba,
    nombreY: Math.round(arriba + altoMarca + aire),
    nombreX: Math.round((LADO - anchoNombre) / 2),
  };
}

function componer({
  fondo,
  tinta,
  cielo = null,
  soloDestello = false,
  conNombre = false,
}) {
  const disposicion = conNombre ? "firmado" : "suelto";
  const estrellas = cielo
    ? CIELOS[disposicion][cielo]
        .map(
          ([cx, cy, r, o]) =>
            `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${tinta}" opacity="${o}"/>`
        )
        .join("\n  ")
    : "";

  const fuente = soloDestello ? SOLO_DESTELLO : MARCA;
  const trazos = soloDestello
    ? `<path d="${SOLO_DESTELLO.path}"/>`
    : `<path d="${MARCA.destello}"/>
    <path fill-rule="evenodd" d="${MARCA.cordon}"/>`;

  let escala;
  let x;
  let y;

  if (conNombre) {
    const g = grupoFirmado();
    const util = soloDestello ? 340 : g.anchoMarca;
    escala = util / fuente.bbox.ancho;
    x = (LADO - util) / 2 - fuente.bbox.x * escala;
    y = soloDestello
      ? g.marcaY + (g.altoMarca - fuente.bbox.alto * escala) / 2 - fuente.bbox.y * escala
      : g.marcaY - fuente.bbox.y * escala;
  } else {
    const util = soloDestello ? 500 : MARCA_ANCHO_SUELTA;
    ({ escala, x, y } = encajar(fuente.bbox, util, soloDestello ? 0 : 12));
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${LADO}" height="${LADO}" viewBox="0 0 ${LADO} ${LADO}">
  ${fondo ? `<rect width="${LADO}" height="${LADO}" fill="${fondo}"/>` : ""}
  ${estrellas}
  <g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${escala.toFixed(5)})" fill="${tinta}">
    ${trazos}
  </g>
</svg>`;
}

/**
 * El logotipo, escalado y teñido. La máscara es blanca sobre transparente, así
 * que la tinta se aplica pintando un rectángulo del color y recortándolo con
 * ella (`dest-in`).
 */
async function logotipo(tinta, ancho, alto) {
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

/**
 * Cada composición se genera en dos formas: suelta y firmada (con "North Studio"
 * debajo). `cielo` es `null`, `"discreto"` o `"visible"`.
 */
const COMPOSICIONES = [
  // La recomendada.
  { nombre: "noche", fondo: NOCHE_BG, tinta: NOCHE_INK },
  { nombre: "noche-cielo", fondo: NOCHE_BG, tinta: NOCHE_INK, cielo: "discreto" },
  {
    nombre: "noche-cielo-visible",
    fondo: NOCHE_BG,
    tinta: NOCHE_INK,
    cielo: "visible",
  },
  { nombre: "papel", fondo: PAPEL_BG, tinta: PAPEL_INK },
  // Sin fondo, para donde la plataforma compone el suyo.
  { nombre: "transparente-claro", fondo: null, tinta: NOCHE_INK },
  { nombre: "transparente-oscuro", fondo: null, tinta: PAPEL_INK },
  // Alternativa: el destello solo, la marca compacta que usa el navbar del sitio.
  {
    nombre: "destello-noche",
    fondo: NOCHE_BG,
    tinta: NOCHE_INK,
    soloDestello: true,
  },
];

const salida = resolve(raiz, "brand/perfil");
await mkdir(salida, { recursive: true });

console.log(`noche  fondo ${NOCHE_BG}  tinta ${NOCHE_INK}`);
console.log(`papel  fondo ${PAPEL_BG}  tinta ${PAPEL_INK}\n`);

const g = grupoFirmado();
let generadas = 0;

for (const base of COMPOSICIONES) {
  for (const conNombre of [false, true]) {
    const archivo = `north-studio-perfil-${base.nombre}${conNombre ? "-firmado" : ""}`;
    const svg = componer({ ...base, conNombre });

    let imagen = sharp(Buffer.from(svg));
    let nombreBuffer = null;

    if (conNombre) {
      nombreBuffer = await logotipo(base.tinta, g.anchoNombre, g.altoNombre);
      imagen = sharp(await imagen.png().toBuffer()).composite([
        { input: nombreBuffer, left: g.nombreX, top: g.nombreY },
      ]);
    }

    await imagen.png({ compressionLevel: 9 }).toFile(resolve(salida, `${archivo}.png`));

    // El SVG queda al lado, para imprimir o regenerar a cualquier tamaño. En las
    // firmadas lleva el logotipo incrustado como imagen: es la única forma de que
    // el archivo sea autosuficiente sin depender de tener Newsreader instalada.
    const svgFinal = conNombre
      ? svg.replace(
          "</svg>",
          `  <image x="${g.nombreX}" y="${g.nombreY}" width="${g.anchoNombre.toFixed(0)}" height="${g.altoNombre}" href="data:image/png;base64,${nombreBuffer.toString("base64")}"/>\n</svg>`
        )
      : svg;

    await writeFile(resolve(salida, `${archivo}.svg`), `${svgFinal}\n`, "utf8");
    console.log(`✓ ${archivo}.png`);
    generadas += 1;
  }
}

console.log(`\n${generadas} variantes en brand/perfil/ (1024×1024, con su SVG)`);
