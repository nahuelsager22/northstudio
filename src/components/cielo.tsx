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
 * La constelación.
 *
 * Dos letras dibujadas con estrellas: la N y la S. No están señaladas, no tienen
 * etiqueta y nadie las anuncia — a simple vista son once puntos más del cielo,
 * apenas más brillantes que sus vecinos.
 *
 * Las líneas que las unen aparecen **solo si alguien se queda mirando ahí**: hay
 * que acercar el puntero y, sobre todo, quedarse quieto. Un barrido rápido no la
 * revela; moverse despacio, sí. Es la diferencia exacta entre buscar algo y estar
 * prestando atención, y este sitio existe para recompensar lo segundo.
 *
 * Coordenadas en el espacio 0–1 de un cuadro propio, que después se ancla arriba
 * a la derecha. La N es tres trazos; la S, una curva de seis puntos.
 */
const CONSTELACION: { puntos: [number, number][]; trazos: [number, number][] }[] = [
  {
    // N — astil izquierdo, diagonal, astil derecho.
    puntos: [
      [0, 1],
      [0, 0],
      [0.62, 1],
      [0.62, 0],
    ],
    trazos: [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
  },
  {
    // S — seis puntos que la insinúan sin cerrarla del todo.
    puntos: [
      [1.32, 0.12],
      [1.0, 0.03],
      [0.92, 0.42],
      [1.34, 0.58],
      [1.28, 0.97],
      [0.94, 0.88],
    ],
    trazos: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
    ],
  },
];

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
    let constelacion: { x: number; y: number }[][] = [];
    /** 0 = invisible; sube mientras el puntero se queda cerca y quieto. */
    let revelado = 0;
    let quietud = 0;

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
      const escala = Math.min(ancho, alto) * (ancho < 640 ? 0.2 : 0.16);
      const origenX = ancho - escala * 2.15;
      const origenY = alto * (ancho < 640 ? 0.14 : 0.2);

      constelacion = CONSTELACION.map((letra) =>
        letra.puntos.map(([x, y]) => ({
          x: origenX + x * escala,
          y: origenY + y * escala,
        }))
      );
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
     * ¿Está alguien mirando la constelación?
     *
     * Dos condiciones a la vez: el puntero cerca, y el puntero **quieto**. La
     * quietud se acumula cuadro a cuadro y se pierde de golpe con cualquier
     * movimiento brusco, así que barrer la pantalla no la revela. Hay que
     * detenerse — que es justo lo que nadie hace de casualidad.
     */
    function actualizarRevelado(px: number, py: number, movimiento: number) {
      if (quieto.matches || constelacion.length === 0) {
        revelado = 0;
        return;
      }

      const centro = centroDeConstelacion();
      const distancia = Math.hypot(px - centro.x, py - centro.y);
      const radio = Math.min(ancho, alto) * 0.34;

      quietud =
        movimiento > 2.2 ? 0 : Math.min(1, quietud + (distancia < radio ? 0.012 : 0));

      const objetivo = distancia < radio ? quietud : 0;
      revelado += (objetivo - revelado) * (objetivo > revelado ? 0.02 : 0.05);
    }

    function centroDeConstelacion() {
      let sx = 0;
      let sy = 0;
      let n = 0;
      for (const letra of constelacion) {
        for (const p of letra) {
          sx += p.x;
          sy += p.y;
          n += 1;
        }
      }
      return n === 0 ? { x: 0, y: 0 } : { x: sx / n, y: sy / n };
    }

    function pintarConstelacion(desplazX: number, desplazY: number) {
      if (constelacion.length === 0) return;

      // Las estrellas de la constelación están siempre, apenas más presentes que
      // el resto. Nadie las va a contar; lo único que se percibe es que ahí el
      // cielo tiene un poco más de peso.
      ctx!.fillStyle = tinta;
      for (const letra of constelacion) {
        for (const p of letra) {
          ctx!.globalAlpha = 0.5 + revelado * 0.45;
          ctx!.beginPath();
          ctx!.arc(p.x + desplazX, p.y + desplazY, 1.25, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      if (revelado <= 0.01) return;

      ctx!.globalAlpha = revelado * 0.16;
      ctx!.strokeStyle = tinta;
      ctx!.lineWidth = 0.75;
      ctx!.lineCap = "round";
      CONSTELACION.forEach((letra, i) => {
        const puntos = constelacion[i];
        if (!puntos) return;
        for (const [desde, hasta] of letra.trazos) {
          const a = puntos[desde];
          const b = puntos[hasta];
          if (!a || !b) continue;
          ctx!.beginPath();
          ctx!.moveTo(a.x + desplazX, a.y + desplazY);
          ctx!.lineTo(b.x + desplazX, b.y + desplazY);
          ctx!.stroke();
        }
      });
      ctx!.globalAlpha = 1;
    }

    function pintar(t: number) {
      ctx!.clearRect(0, 0, ancho, alto);

      const antesX = puntero.sx;
      const antesY = puntero.sy;
      puntero.sx += (puntero.x - puntero.sx) * 0.045;
      puntero.sy += (puntero.y - puntero.sy) * 0.045;
      const movimiento =
        Math.hypot(puntero.sx - antesX, puntero.sy - antesY) *
        Math.min(ancho, alto) *
        0.5;

      actualizarRevelado(
        ((puntero.x + 1) / 2) * ancho,
        ((puntero.y + 1) / 2) * alto,
        movimiento
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
      pintarConstelacion(puntero.sx * 3.0, puntero.sy * 3.0);

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
