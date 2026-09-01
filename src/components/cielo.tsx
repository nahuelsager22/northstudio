"use client";

import { useEffect, useRef } from "react";

/**
 * El cielo.
 *
 * La única excepción a la quietud por defecto del sistema, y existe con una
 * restricción que es la que la vuelve criterio en vez de decoración: **solo en
 * modo Noche. En Papel no hay nada.** El modo oscuro de este sitio se llama
 * Noche y significa algo —la noche del norte, el fondo sobre el que la estrella
 * polar orienta—; un campo de estrellas ahí no es un efecto agregado, es la
 * consecuencia del nombre. Y el papel no tiene cielo.
 *
 * De ahí sale el momento que el recorrido no tenía: quien cambia de tema
 * **descubre** un cielo. Nadie se lo anunció, no hay nada que lo señale, y es la
 * clase de detalle que solo aparece si alguien se tomó el trabajo.
 *
 * Las reglas que lo mantienen del lado de la atmósfera y no del efecto:
 *
 * - **Densidad baja.** Alrededor de 50 puntos en una pantalla de portátil. Un
 *   cielo lleno es un salvapantallas.
 * - **Deriva sub-pixel.** Tres capas a velocidades distintas, tan lentas que no
 *   se ven moverse: se nota que algo cambió si volvés, no mientras mirás.
 * - **La fugaz es rara.** Una cada 60–120 segundos, nunca en los primeros
 *   quince. Que sea rara es exactamente lo que la hace valer.
 * - **No interactúa con el scroll.** El parallax responde al puntero, no a la
 *   rueda: nada acá le toca el ritmo a quien recorre (principio 4).
 * - **Se apaga.** Con `prefers-reduced-motion` el campo queda estático —las
 *   estrellas están, pero quietas y sin fugaces—, y cuando la pestaña deja de
 *   verse el bucle se detiene entero.
 *
 * Sin librerías: un canvas y este archivo.
 */

type Capa = { escala: number; alfa: number; deriva: number; parallax: number };

type Estrella = {
  x: number;
  y: number;
  r: number;
  brillo: number;
  /** La capa misma, no su índice: nada tiene que volver a buscarla después. */
  capa: Capa;
  /** Desfase del titileo, para que ninguna respire a la vez que su vecina. */
  fase: number;
};

/**
 * Un cometa, no una raya.
 *
 * La versión anterior era un segmento con degradado que aparecía entero y se
 * apagaba: funcionaba, pero todas salían iguales y en la misma dirección. Un
 * meteoro real tiene tres tiempos —el núcleo enciende, la cola se estira detrás,
 * todo se apaga— y ninguno se parece al anterior.
 */
type Fugaz = {
  x: number;
  y: number;
  /** Dirección normalizada. Puede venir de cualquiera de los dos lados. */
  dx: number;
  dy: number;
  velocidad: number;
  /** >1 acelera, <1 frena. Algunos entran empujados y otros se van muriendo. */
  curva: number;
  /** 0 → 1 a lo largo de la vida. Toda la envolvente cuelga de acá. */
  t: number;
  paso: number;
  largo: number;
  /** Tinte apenas desaturado; casi siempre blanco. */
  tinte: [number, number, number];
};

/**
 * Los tintes de un meteoro real vienen de lo que se quema al entrar: sodio
 * (amarillo cálido), magnesio (azulado), níquel (verdoso). Acá están casi
 * blancos a propósito — la variación tiene que sospecharse, no reconocerse.
 */
const TINTES: [number, number, number][] = [
  [255, 252, 246],
  [255, 252, 246],
  [255, 252, 246],
  [255, 252, 246],
  [255, 232, 214],
  [214, 228, 255],
  [222, 250, 232],
];

/** Tres profundidades: más lejos = más chico, más tenue, más lento. */
const CAPAS: Capa[] = [
  { escala: 0.55, alfa: 0.34, deriva: 0.0016, parallax: 1.6 },
  { escala: 0.8, alfa: 0.52, deriva: 0.0032, parallax: 3.0 },
  { escala: 1.15, alfa: 0.78, deriva: 0.0055, parallax: 4.6 },
];

/** Un punto cada ~26.000 px²: densidad de cielo, no de planetario. */
const AREA_POR_ESTRELLA = 26000;
const MAX_ESTRELLAS = 140;

/**
 * La constelación NS.
 *
 * Forma una N y una S, como la de Rockstar forma una R: una figura reconocible
 * detrás de las estrellas. Pero es una pieza editorial, no la ilustración de una
 * constelación — y eso son cinco decisiones, no una cantidad de estrellas:
 *
 * - **Las dos letras están en el mismo renglón y no se tocan.** Ni un trazo ni
 *   una estrella las une. Son dos partes de un sistema, no una figura cerrada:
 *   lo que las relaciona es el eje que comparten y el vacío que hay entre ellas.
 * - **Mismo tamaño, distinta inclinación.** Las dos miden lo mismo y pesan lo
 *   mismo; ninguna es secundaria. Pero la N cae 14° y la S 22°, y esos ocho
 *   grados de diferencia son los que impiden que el renglón se lea compuesto:
 *   dos letras exactamente paralelas son tipografía.
 * - **Las dos se pueden reconstruir enteras.** Ninguna estrella de una letra
 *   queda sin trazo. La irregularidad la sostienen las magnitudes, no los trazos
 *   que faltan.
 * - **La protagonista no es de ninguna de las dos.** La estrella más brillante
 *   del cielo está en el hueco, sola. Es la que sostiene la composición y la que
 *   revela la constelación cuando el puntero la toca.
 * - **Un trazo es tan tenue como sus estrellas.** La opacidad de cada línea sale
 *   de la magnitud de sus dos extremos, así que las partes tenues de la figura
 *   se apagan enteras. Sin eso todas las líneas pesan igual y la cosa vuelve a
 *   ser unir los puntos.
 *
 * Los esqueletos viven cada uno en su propio cuadro de alto 1 y derecho, para
 * poder editarlos pensando en la letra. La composición los apoya después.
 */
type Traza = {
  puntos: [number, number][];
  trazos: [number, number][];
  /** Una magnitud por punto: 0 = apenas visible · 3 = la protagonista. */
  magnitudes: number[];
};

/** La N: astiles que no son paralelos y una diagonal quebrada en tres tramos. */
const TRAZA_N: Traza = {
  puntos: [
    [0.06, 1.0], // 0 · pie izquierdo
    [0.03, 0.62], // 1 · astil izquierdo, la que lo desalinea
    [0.0, 0.16], // 2 · vértice de arriba
    [0.2, 0.5], // 3 · diagonal, primer quiebre
    [0.45, 0.78], // 4 · diagonal, segundo quiebre
    [0.66, 1.03], // 5 · pie derecho
    [0.71, 0.58], // 6 · astil derecho, medio
    [0.74, 0.12], // 7 · vértice de arriba a la derecha
  ],
  trazos: [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
  ],
  magnitudes: [1, 0, 2, 1, 0, 2, 1, 2],
};

/** La S: nueve estrellas y un solo cambio de signo del giro, en la cintura. */
const TRAZA_S: Traza = {
  puntos: [
    [0.506, 0.082], // 0 · terminal de arriba
    [0.287, 0.0], // 1 · cresta
    [0.109, 0.082], // 2 · bucle alto
    [0.0, 0.282], // 3 · extremo izquierdo
    [0.041, 0.364], // 4 · la doble
    [0.274, 0.553], // 5 · cintura
    [0.465, 0.882], // 6 · extremo derecho
    [0.246, 1.0], // 7 · curva de abajo
    [0.027, 0.964], // 8 · terminal de abajo
  ],
  trazos: [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 8],
  ],
  magnitudes: [0, 1, 1, 1, 0, 2, 1, 1, 0],
};

/** Dónde se apoya cada letra. Mismo tamaño, ocho grados de diferencia. */
const COMPOSICION = [
  { traza: TRAZA_N, escala: 1, giro: -14, x: 0, y: 0.34 },
  { traza: TRAZA_S, escala: 1, giro: -22, x: 1.16, y: 0.1 },
];

/** La protagonista: en el hueco, y de ninguna de las dos letras. */
const SUELTAS: [number, number, number][] = [[0.98, 0.62, 3]];

function componer() {
  const puntos: { x: number; y: number; m: number }[] = [];
  const trazos: [number, number][] = [];

  for (const parte of COMPOSICION) {
    const base = puntos.length;
    const radianes = (parte.giro * Math.PI) / 180;
    const co = Math.cos(radianes);
    const si = Math.sin(radianes);

    parte.traza.puntos.forEach(([px, py], i) => {
      const x = px * parte.escala;
      const y = py * parte.escala;
      puntos.push({
        x: parte.x + x * co - y * si,
        y: parte.y + x * si + y * co,
        m: parte.traza.magnitudes[i] ?? 1,
      });
    });

    for (const [a, b] of parte.traza.trazos) trazos.push([base + a, base + b]);
  }

  for (const [x, y, m] of SUELTAS) puntos.push({ x, y, m });
  return { puntos, trazos };
}

const FIGURA = componer();
/** La protagonista es la única de magnitud 3. */
const ASTRO = FIGURA.puntos.findIndex((p) => p.m === 3);

/** Por magnitud: radio, cuánta tinta, y cuánto pesa un trazo que sale de ahí. */
const RADIO_CONSTELACION = [0.85, 1.15, 1.55, 2.3];
const ALFA_CONSTELACION = [0.42, 0.78, 0.92, 1];
const PESO_TRAZO = [0.34, 0.8, 1, 1];

/**
 * El polvo.
 *
 * No es una textura ni un fondo lleno de estrellas: es **densidad**. Alrededor
 * de la constelación el cielo tiene más granos que en cualquier otro lado, y eso
 * hace que el ojo se detenga ahí antes de saber por qué. Tres reglas lo
 * mantienen del lado de la atmósfera:
 *
 * - **Siempre por debajo de la estrella más tenue del campo.** Radio menor a un
 *   píxel y opacidad de 0,07 a 0,22: uno solo no se ve, todos juntos sí.
 * - **No toca las letras.** Se rechaza cualquier grano que caiga a menos de ocho
 *   píxeles de una estrella de la figura o a menos de cinco de un trazo. Sin eso
 *   el polvo se mezcla con la N y la S y las ensucia.
 * - **Se siembra en una elipse centrada en la figura**, con caída hacia afuera,
 *   así la concentración tiene forma de cielo y no de recuadro.
 *
 * Es la única excepción local a la densidad baja del campo (un punto cada
 * ~26.000 px²): acá hay más, y es a propósito.
 */
const POLVO = {
  cantidad: 58,
  /** Cuánto más grande que la figura es la nube. */
  alcance: 1.42,
  margenEstrella: 8,
  margenTrazo: 5,
};

/** Distancia de un punto a un segmento; la usa el rechazo del polvo. */
function distanciaASegmento(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number
) {
  const vx = bx - ax;
  const vy = by - ay;
  const largo = vx * vx + vy * vy;
  const t =
    largo === 0
      ? 0
      : Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / largo));
  return Math.hypot(px - (ax + vx * t), py - (ay + vy * t));
}

/**
 * Cuándo se ve.
 *
 * Antes había que acercar el puntero **y quedarse quieto** hasta que la quietud
 * se acumulara. Era una idea linda y una interacción mala: tardaba varios
 * segundos, se perdía con cualquier movimiento y casi nadie llegaba a verla. Un
 * detalle que nadie ve no existe.
 *
 * Ahora son dos caminos y ninguno exige buscar:
 *
 * - **Se revela sola** cada 13–20 s, con una envolvente propia —entra, sostiene,
 *   se apaga— para que sea algo que pasa en la página y no algo que el visitante
 *   tenga que conseguir.
 * - **La protagonista la abre al toque.** Es la estrella más brillante, respira
 *   apenas, y el puntero sobre ella revela la constelación entera de inmediato.
 *
 * Con `prefers-reduced-motion` no hay ciclo ni respiración: las líneas quedan
 * puestas a media tinta. El detalle existe igual, sin que nada se mueva.
 */
const CICLO = { entrada: 900, sosten: 3200, salida: 1600 };
const ESPERA_REVELACION = { minima: 13000, variable: 7000 };
/** El radio en píxeles alrededor de la protagonista que abre la figura. */
const RADIO_ASTRO = 30;
/** Cuánto se ve con movimiento reducido: puesta, pero sin llamar. */
const REVELADO_QUIETO = 0.55;

function envolventeRevelacion(ms: number) {
  if (ms < 0) return 0;
  const entra = Math.min(1, ms / CICLO.entrada);
  const desde = CICLO.entrada + CICLO.sosten;
  const sale = ms < desde ? 1 : 1 - (ms - desde) / CICLO.salida;
  return Math.max(0, Math.min(entra, sale));
}

export function Cielo() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const nodo = canvas.current;
    if (!nodo) return;
    const ctx = nodo.getContext("2d");
    if (!ctx) return;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)");
    let estrellas: Estrella[] = [];
    let fugaz: Fugaz | null = null;
    let proximaFugaz = 0;
    let ancho = 0;
    let alto = 0;
    let raf = 0;
    let corriendo = false;
    let tinta = "#fff";

    /** Geometría de la constelación en píxeles, recalculada al medir. */
    let constelacion: { x: number; y: number; m: number }[] = [];
    /** 0 = invisible; 1 = la figura entera. */
    let revelado = 0;
    /** Cuándo arrancó el ciclo que se revela solo. */
    let revelacionDesde = -Infinity;
    let proximaRevelacion = 0;
    /** El puntero sobre la protagonista, suavizado. */
    let sobreElAstro = 0;
    /** El polvo alrededor de la figura, resembrado al medir. */
    let polvo: { x: number; y: number; r: number; a: number; fase: number }[] =
      [];

    // El puntero mueve las capas a ritmos distintos: eso es profundidad. El
    // objetivo se persigue con suavizado para que nunca haya un salto.
    const puntero = { x: 0, y: 0, sx: 0, sy: 0 };

    function medir() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ancho = window.innerWidth;
      alto = window.innerHeight;
      nodo!.width = Math.floor(ancho * dpr);
      nodo!.height = Math.floor(alto * dpr);
      nodo!.style.width = `${ancho}px`;
      nodo!.style.height = `${alto}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      sembrar();
      ubicarConstelacion();
    }

    /**
     * Se apoya arriba a la derecha, sobre el margen que el recorrido deja libre
     * en todos los formatos. El tamaño sale del lado menor de la ventana: en un
     * teléfono tiene que caber, y en una pantalla ancha no puede volverse un
     * cartel.
     */
    function ubicarConstelacion() {
      // La figura pasó a ser ancha (1,88 × 1,31) al igualar el tamaño de las
      // dos letras: con la escala anterior se comía el margen y el polvo se iba
      // por el borde derecho.
      const escala = Math.min(ancho, alto) * (ancho < 640 ? 0.185 : 0.155);

      // El cuadro se mide sobre la composición ya armada: las letras están
      // giradas, y el margen derecho tiene que ser el mismo en todos los casos.
      const xs = FIGURA.puntos.map((p) => p.x);
      const ys = FIGURA.puntos.map((p) => p.y);
      const izquierda = Math.min(...xs);
      const arriba = Math.min(...ys);
      const anchoCuadro = Math.max(...xs) - izquierda;

      const origenX = ancho - escala * (anchoCuadro + 0.95);
      const origenY = alto * (ancho < 640 ? 0.13 : 0.19);

      constelacion = FIGURA.puntos.map((p) => ({
        x: origenX + (p.x - izquierda) * escala,
        y: origenY + (p.y - arriba) * escala,
        m: p.m,
      }));

      sembrarPolvo();
    }

    /**
     * Se resiembra con cada medición, igual que el campo: el polvo pertenece a
     * la sesión, no al archivo.
     */
    function sembrarPolvo() {
      const xs = constelacion.map((p) => p.x);
      const ys = constelacion.map((p) => p.y);
      const centroX = (Math.min(...xs) + Math.max(...xs)) / 2;
      const centroY = (Math.min(...ys) + Math.max(...ys)) / 2;
      const semiX = ((Math.max(...xs) - Math.min(...xs)) / 2) * POLVO.alcance;
      const semiY = ((Math.max(...ys) - Math.min(...ys)) / 2) * POLVO.alcance;

      polvo = [];
      let intentos = 0;
      while (polvo.length < POLVO.cantidad && intentos < POLVO.cantidad * 40) {
        intentos += 1;
        const angulo = Math.random() * Math.PI * 2;
        // Exponente cerca de 0,5: reparte por área en vez de amontonar al centro.
        const radio = Math.pow(Math.random(), 0.55);
        const x = centroX + Math.cos(angulo) * radio * semiX;
        const y = centroY + Math.sin(angulo) * radio * semiY;

        let choca = false;
        for (const p of constelacion) {
          if (Math.hypot(x - p.x, y - p.y) < POLVO.margenEstrella) {
            choca = true;
            break;
          }
        }
        if (!choca) {
          for (const [desde, hasta] of FIGURA.trazos) {
            const a = constelacion[desde];
            const b = constelacion[hasta];
            if (!a || !b) continue;
            if (
              distanciaASegmento(x, y, a.x, a.y, b.x, b.y) < POLVO.margenTrazo
            ) {
              choca = true;
              break;
            }
          }
        }
        if (choca) continue;

        polvo.push({
          x,
          y,
          r: 0.4 + Math.random() * 0.55,
          a: 0.07 + Math.random() * 0.15,
          fase: Math.random() * Math.PI * 2,
        });
      }
    }

    function sembrar() {
      const cantidad = Math.min(
        MAX_ESTRELLAS,
        Math.round((ancho * alto) / AREA_POR_ESTRELLA)
      );
      estrellas = Array.from({ length: cantidad }, () => {
        const capa = CAPAS[Math.floor(Math.random() * CAPAS.length)] ?? CAPAS[0]!;
        return {
          x: Math.random(),
          y: Math.random(),
          r: (0.5 + Math.random() * 0.9) * capa.escala,
          brillo: 0.55 + Math.random() * 0.45,
          capa,
          fase: Math.random() * Math.PI * 2,
        };
      });
    }

    function programarFugaz(ahora: number) {
      // Antes eran una cada 60–120 s: tan raras que mucha gente no llegaba a ver
      // ninguna, y un detalle que nadie ve no existe. Ahora una cada 9–26 s
      // (~17 de promedio): siguen siendo una sorpresa y ya no un secreto.
      // Nunca en los primeros ocho segundos: una fugaz al entrar se leería como
      // bienvenida, y esto no viene a saludar a nadie.
      proximaFugaz = ahora + 9000 + Math.random() * 17000;
    }

    function lanzarFugaz() {
      // De los dos lados, y con un abanico de ángulos ancho: dos meteoros
      // seguidos por la misma diagonal se leen como un bucle.
      const haciaLaIzquierda = Math.random() < 0.62;
      const angulo = (Math.PI / 180) * (16 + Math.random() * 42);
      const dx = (haciaLaIzquierda ? -1 : 1) * Math.cos(angulo);
      const dy = Math.sin(angulo);

      // Entra por arriba, o por el costado alto. Nunca desde el pie de la
      // pantalla: un meteoro que sube es un cohete.
      const porArriba = Math.random() < 0.68;
      const desdeX = haciaLaIzquierda ? ancho + 60 : -60;

      fugaz = {
        x: porArriba ? Math.random() * ancho : desdeX,
        y: porArriba ? -50 : Math.random() * alto * 0.45,
        dx,
        dy,
        velocidad: 5.5 + Math.random() * 5,
        curva: 0.72 + Math.random() * 0.62,
        t: 0,
        // Entre ~75 y ~150 cuadros de vida: unos se cruzan rápido y otros
        // demoran, que es la diferencia entre un destello y un cometa.
        paso: 1 / (75 + Math.random() * 75),
        largo: 70 + Math.random() * 130,
        tinte: TINTES[Math.floor(Math.random() * TINTES.length)] ?? TINTES[0]!,
      };
    }

    /**
     * La envolvente del cometa, en tres tiempos:
     *   núcleo  enciende rápido y se apaga al final;
     *   cola    aparece un instante después y se estira hasta su largo;
     *   ambos   se desvanecen juntos en el último tercio.
     */
    function envolvente(t: number) {
      const encendido = Math.min(1, t / 0.12);
      const apagado = t < 0.62 ? 1 : Math.max(0, 1 - (t - 0.62) / 0.38);
      const cola = Math.min(1, Math.max(0, (t - 0.05) / 0.3));
      return { intensidad: encendido * apagado, cola };
    }

    function pintarFugaz(f: Fugaz) {
      const { intensidad, cola } = envolvente(f.t);
      if (intensidad <= 0) return;

      const [r, g, b] = f.tinte;
      const largo = f.largo * cola;
      const finX = f.x - f.dx * largo;
      const finY = f.y - f.dy * largo;

      if (largo > 1) {
        const estela = ctx!.createLinearGradient(f.x, f.y, finX, finY);
        estela.addColorStop(0, `rgba(${r},${g},${b},${0.55 * intensidad})`);
        estela.addColorStop(0.35, `rgba(${r},${g},${b},${0.18 * intensidad})`);
        estela.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx!.strokeStyle = estela;
        ctx!.lineWidth = 1.1;
        ctx!.lineCap = "round";
        ctx!.beginPath();
        ctx!.moveTo(f.x, f.y);
        ctx!.lineTo(finX, finY);
        ctx!.stroke();
      }

      // El núcleo: un punto con un halo mínimo. Es lo que hace que se lea como
      // algo que viaja y no como una línea que se dibujó sola.
      const halo = ctx!.createRadialGradient(f.x, f.y, 0, f.x, f.y, 3.2);
      halo.addColorStop(0, `rgba(${r},${g},${b},${0.95 * intensidad})`);
      halo.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx!.fillStyle = halo;
      ctx!.beginPath();
      ctx!.arc(f.x, f.y, 3.2, 0, Math.PI * 2);
      ctx!.fill();
    }

    /**
     * Cuánto se ve, este cuadro.
     *
     * El ciclo automático y el puntero sobre la protagonista no se suman: gana
     * el mayor de los dos. Así el hover puede abrirla en medio de un ciclo que
     * se estaba apagando, sin que nada dé un salto.
     */
    function actualizarRevelado(t: number, px: number, py: number) {
      if (quieto.matches || constelacion.length === 0) {
        revelado = quieto.matches ? REVELADO_QUIETO : 0;
        return;
      }

      if (t > proximaRevelacion) {
        revelacionDesde = t;
        proximaRevelacion =
          t +
          CICLO.entrada +
          CICLO.sosten +
          CICLO.salida +
          ESPERA_REVELACION.minima +
          Math.random() * ESPERA_REVELACION.variable;
      }

      const astro = constelacion[ASTRO];
      const cerca =
        astro !== undefined &&
        Math.hypot(px - astro.x, py - astro.y) < RADIO_ASTRO;
      sobreElAstro +=
        ((cerca ? 1 : 0) - sobreElAstro) * (cerca ? 0.14 : 0.05);

      revelado = Math.max(
        envolventeRevelacion(t - revelacionDesde),
        sobreElAstro
      );
    }

    function pintarConstelacion(t: number, desplazX: number, desplazY: number) {
      if (constelacion.length === 0) return;

      // El polvo va primero: es lo más lejos que hay en esta zona del cielo.
      ctx!.fillStyle = tinta;
      for (const d of polvo) {
        const titileo = quieto.matches
          ? 1
          : 0.88 + Math.sin(t * 0.0006 + d.fase) * 0.12;
        ctx!.globalAlpha = d.a * titileo;
        ctx!.beginPath();
        ctx!.arc(d.x + desplazX, d.y + desplazY, d.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      // El halo de la protagonista: tres anillos, no un degradado. Un degradado
      // queda en `fillStyle` y el cuadro siguiente pinta las estrellas con él
      // —el bug que ya costó una corrección con el cometa—, y además esto se
      // apaga solo cuando la figura está revelada: si ya se ve, no hace falta
      // seguir señalándola.
      const astro = constelacion[ASTRO];
      if (astro) {
        const respiro = quieto.matches
          ? 0.7
          : 0.72 + Math.sin(t * 0.0011) * 0.28;
        const señal = respiro * (1 - revelado * 0.75);
        ctx!.fillStyle = tinta;
        for (const [radio, alfa] of [
          [8.5, 0.05],
          [5.6, 0.07],
          [3.4, 0.09],
        ]) {
          ctx!.globalAlpha = alfa! * señal;
          ctx!.beginPath();
          ctx!.arc(astro.x + desplazX, astro.y + desplazY, radio!, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      // Las estrellas de la constelación están siempre. Sin revelar son un
      // cúmulo suelto más del cielo; lo único que se destaca es la protagonista.
      ctx!.fillStyle = tinta;
      for (const p of constelacion) {
        ctx!.globalAlpha =
          (0.5 + revelado * 0.45) * (ALFA_CONSTELACION[p.m] ?? 1);
        ctx!.beginPath();
        ctx!.arc(
          p.x + desplazX,
          p.y + desplazY,
          RADIO_CONSTELACION[p.m] ?? 1.15,
          0,
          Math.PI * 2
        );
        ctx!.fill();
      }

      if (revelado <= 0.01) return;

      ctx!.strokeStyle = tinta;
      ctx!.lineWidth = 0.75;
      ctx!.lineCap = "round";
      for (const [desde, hasta] of FIGURA.trazos) {
        const a = constelacion[desde];
        const b = constelacion[hasta];
        if (!a || !b) continue;
        // Tan tenue como sus estrellas.
        const peso = ((PESO_TRAZO[a.m] ?? 1) + (PESO_TRAZO[b.m] ?? 1)) / 2;
        ctx!.globalAlpha = revelado * 0.18 * peso;
        ctx!.beginPath();
        ctx!.moveTo(a.x + desplazX, a.y + desplazY);
        ctx!.lineTo(b.x + desplazX, b.y + desplazY);
        ctx!.stroke();
      }
      ctx!.globalAlpha = 1;
    }

    function pintar(t: number) {
      ctx!.clearRect(0, 0, ancho, alto);

      puntero.sx += (puntero.x - puntero.sx) * 0.045;
      puntero.sy += (puntero.y - puntero.sy) * 0.045;

      actualizarRevelado(
        t,
        ((puntero.x + 1) / 2) * ancho + puntero.sx * 3.0,
        ((puntero.y + 1) / 2) * alto + puntero.sy * 3.0
      );

      // Se reafirma cada cuadro: el halo del cometa deja un degradado en
      // `fillStyle`, y sin esto las estrellas del cuadro siguiente se pintarían
      // con él.
      ctx!.fillStyle = tinta;

      for (const e of estrellas) {
        const capa = e.capa;
        const deriva = quieto.matches ? 0 : t * capa.deriva;

        // La deriva envuelve: el cielo no tiene borde del que caerse.
        const x =
          ((((e.x * ancho + deriva) % ancho) + ancho) % ancho) +
          puntero.sx * capa.parallax;
        const y = e.y * alto + puntero.sy * capa.parallax;

        // Titileo mínimo y desfasado. Si se ve parpadear, sobra.
        const titileo = quieto.matches
          ? 1
          : 0.82 + Math.sin(t * 0.0008 + e.fase) * 0.18;

        ctx!.globalAlpha = capa.alfa * e.brillo * titileo;
        ctx!.beginPath();
        ctx!.arc(x, y, e.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      // La constelación va en la capa media: es cielo, no adorno encima de él.
      pintarConstelacion(t, puntero.sx * 3.0, puntero.sy * 3.0);

      if (!quieto.matches) {
        if (!fugaz && t > proximaFugaz) {
          lanzarFugaz();
          programarFugaz(t);
        }

        if (fugaz) {
          fugaz.t += fugaz.paso;

          // La velocidad no es constante: `curva` por encima de 1 hace que el
          // cometa entre y se apure, y por debajo que llegue frenando. Es lo que
          // impide que dos se muevan igual.
          const paso =
            fugaz.velocidad * (1 + (fugaz.curva - 1) * fugaz.t);
          fugaz.x += fugaz.dx * paso;
          fugaz.y += fugaz.dy * paso;

          ctx!.globalAlpha = 1;
          pintarFugaz(fugaz);

          if (
            fugaz.t >= 1 ||
            fugaz.y > alto + 160 ||
            fugaz.x < -220 ||
            fugaz.x > ancho + 220
          ) {
            fugaz = null;
          }
        }
      }

      ctx!.globalAlpha = 1;
      raf = requestAnimationFrame(pintar);
    }

    function arrancar() {
      if (corriendo) return;
      corriendo = true;
      // La tinta la decide el tema, no este archivo: se lee del propio canvas.
      tinta = getComputedStyle(nodo!).color;
      raf = requestAnimationFrame(pintar);
    }

    function frenar() {
      if (!corriendo) return;
      corriendo = false;
      cancelAnimationFrame(raf);
    }

    function alPuntero(evento: PointerEvent) {
      if (quieto.matches) return;
      puntero.x = (evento.clientX / ancho - 0.5) * 2;
      puntero.y = (evento.clientY / alto - 0.5) * 2;
    }

    function alCambiarVisibilidad() {
      if (document.hidden) frenar();
      else arrancar();
    }

    medir();
    // Ni la fugaz ni la constelación aparecen al entrar: esto no viene a saludar.
    proximaRevelacion = performance.now() + 6000;
    programarFugaz(performance.now());
    arrancar();

    window.addEventListener("resize", medir);
    window.addEventListener("pointermove", alPuntero, { passive: true });
    document.addEventListener("visibilitychange", alCambiarVisibilidad);
    quieto.addEventListener("change", sembrar);

    return () => {
      frenar();
      window.removeEventListener("resize", medir);
      window.removeEventListener("pointermove", alPuntero);
      document.removeEventListener("visibilitychange", alCambiarVisibilidad);
      quieto.removeEventListener("change", sembrar);
    };
  }, []);

  return (
    <canvas
      ref={canvas}
      data-cielo
      aria-hidden="true"
      // `text-ink` no pinta nada: es de dónde el canvas lee su tinta, para que
      // las estrellas sean del mismo color que el texto del lugar.
      className="pointer-events-none fixed inset-0 -z-10 text-ink transition-opacity duration-[var(--duration-slow)] ease-[var(--ease-out-calm)]"
    />
  );
}
