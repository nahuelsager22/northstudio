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
import { resolve } from "node:path";
import {
  raiz,
  sharp,
  NOCHE_BG,
  NOCHE_INK,
  PAPEL_BG,
  PAPEL_INK,
  MARCA,
  SOLO_DESTELLO,
  NOMBRE_ANCHO,
  NOMBRE_AIRE,
  LOGOTIPO_PROPORCION,
  logotipo,
} from "./marca.mjs";

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
