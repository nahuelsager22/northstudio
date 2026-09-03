# Sistema visual

Cómo funciona la capa visual del sitio: qué significa cada registro, qué token existe y para qué, y cuál es el único vocabulario de movimiento permitido. Todo esto está implementado en `src/app/globals.css`; este documento explica qué quiere decir.

El registro general es el de **un objeto editorial impreso con cuidado**, no el de una interfaz que quiere impresionar. El color y el movimiento son casi ausencias administradas con precisión.

---

## 1. Los tres registros

**Ésta es la convención que más fácil se rompe sin darse cuenta.** Cada familia significa siempre lo mismo. Dos cosas con el mismo registro se leen como la misma cosa, aunque no tengan nada que ver.

| Registro | Familia | Significa | Dónde aparece hoy |
|---|---|---|---|
| **Voz** | Newsreader (serif) | Alguien está hablando | Todo el copy del recorrido, el nombre de un proyecto, lo que el visitante escribe en el formulario, los destinos de la nav |
| **Acción** | Mona Sans (grotesque) | Algo que se opera | El botón de envío, el enlace al sitio de un proyecto |
| **Notación** | Mono de sistema | Algo catalogado | Etiquetas de campo, año de un proyecto, ficha de un caso, el colofón de oficios, el bloque `dato` |

Consecuencias que ya costaron una corrección:

- La nav pasó de mono a serif porque el mono en versalitas con tracking abierto es el registro de una terminal, y hacía leer el encabezado como interfaz de desarrollo.
- Las etiquetas del formulario pasaron a mono cuando compartían registro con el botón de envío: notación y acción no pueden verse igual.
- El enlace vivo de un proyecto y el bloque `dato` usaban ambos la etiqueta en versalitas; cuando caían juntos no se distinguía un destino de un contenido.

**La jerarquía no se resuelve con tamaño ni con color: con registro.**

---

## 2. Tipografía

Dos familias self-hosted (`src/lib/fonts.ts`, binarios en `src/assets/fonts/`), servidas con `next/font/local`. Sólo el eje `wght`: el archivo con `opsz` pesa ~2,3× más y el optical sizing es un refinamiento, no una necesidad. Mona Sans se sirve sólo en `normal` — la interfaz nunca usa itálica.

| Token | Tamaño | Interlineado | Tracking | Peso |
|---|---|---|---|---|
| `text-display` | `clamp(2.75rem, 6vw, 4.5rem)` | 1.05 | −0.02em | 300 |
| `text-title-1` | 2.25rem | 1.15 | −0.01em | 400 |
| `text-title-2` | 1.75rem | 1.15 | −0.01em | 400 |
| `text-title-3` | 1.375rem | 1.15 | −0.01em | 400 |
| `text-body` | 1.125rem | 1.65 | 0 | 400 |
| `text-ui` | 1rem | 1.45 | 0 | 400 |
| `text-label` | 0.8125rem | 1.3 | +0.12em | 500 |
| `text-meta` | 0.8125rem | 1.4 | +0.02em | 400 |

Reglas de uso:

- **El énfasis es itálica.** No hay bold en el sistema. El énfasis vive en el dato (tipo `Segmento`, y `*así*` dentro de un bloque `texto`), no en el markup.
- **Medida de lectura 60–68ch.** Pasado eso la atención se rompe.
- **Un solo display por vista.**
- Los tokens de título tienen interlineado 1.15 y tracking negativo: **sirven para una línea corta y aprietan cualquier cosa de dos líneas para arriba.** Por eso el texto que el visitante escribe en el formulario no usa `text-title-3` sino 20 px con interlineado 1.6 — es prosa, no un encabezado.

---

## 3. Color

Paleta silenciosa en OKLCH, seis tokens, dos temas compuestos por separado (no uno es la inversión del otro). Se exponen a Tailwind con `@theme inline`, así que `bg-bg`, `text-ink`, `border-hairline` y compañía son utilidades themables sin ningún plugin.

| Token | Papel | Noche |
|---|---|---|
| `bg` | `oklch(0.955 0.006 85)` | `oklch(0.115 0.018 265)` |
| `surface` | `oklch(0.935 0.006 85)` | `oklch(0.155 0.018 265)` |
| `ink` | `oklch(0.22 0.008 60)` | `oklch(0.93 0.006 85)` |
| `muted` | `oklch(0.46 0.006 60)` | `oklch(0.70 0.010 258)` |
| `hairline` | `oklch(0.875 0.006 82)` | `oklch(0.26 0.014 262)` |
| `polar` | `oklch(0.55 0.06 250)` | `oklch(0.74 0.07 250)` |

- **Noche es el tema por defecto.** El sitio se abre de noche siempre y Papel es una elección, que se recuerda. Ya no manda `prefers-color-scheme`: es una decisión de identidad tomada con el costo sobre la mesa —se deja de respetar la preferencia del sistema— porque el cielo era la mitad de la atmósfera y sólo lo veía quien tuviera el sistema en oscuro.
- **El recorrido es una atmósfera, no un fondo.** El sitio no tiene un color de fondo ni tres puestos uno debajo del otro: tiene **un descenso de color y una vuelta**, y ese descenso es el ritmo.

  ```
  cielo  →  (brasa)  →  arena  →  (terracota)  →  tierra  →  (brasa)  →  cielo
  ```

  Es un lugar visto desde el mismo sitio a lo largo del día: se abre de noche, amanece, se pisa tierra y vuelve a caer la noche.

- **Lo que conecta dos planos es lo que hay entre ellos.** Ninguna zona limita con otra sin que un color intermedio las presente primero. Un degradado recto entre dos colores lejanos pasa por el punto muerto que hay entre ellos, y ese punto muerto es exactamente lo que se lee como corte. Las brasas y la terracota de las transiciones no son decoración: son la relación.
- **Las tres superficies.** `cielo` es el fondo del tema (con estrellas si es Noche) y sostiene el umbral, el trabajo **y el pie**; `arena` —`oklch(0.905 0.028 66)`— sostiene el estudio; `tierra` —`oklch(0.33 0.068 45)`— sostiene la conversación. **Arena y tierra son iguales en los dos temas:** la mitad de abajo del recorrido es material del estudio y el tema gobierna sólo el cielo.
- **El plano claro es arena y no papel.** Es la arcilla aclarada, no un blanco neutro: arena y tierra son el mismo color a dos alturas. Un claro neutro entre dos planos con temperatura es el bloque que no pertenece a nada.
- **Una superficie no es un color de fondo: es una paleta chica.** Cada bloque `[data-superficie]` redeclara los seis tokens (y su espejo `--color-*`, porque `@theme inline` resuelve `--color-ink: var(--ink)` en `:root` y lo que se hereda es el valor ya resuelto). Por eso un plano de arena vive dentro de un sitio de noche sin que ninguna clase de texto sepa dónde está.
- **Una transición es una pieza, no un borde.** `components/transicion.tsx`: un bloque propio en el flujo con dos capas —la atmósfera (un degradado de cuatro paradas que pasa por el intermedio cálido) y la onda (una curva asimétrica que sube el plano siguiente dentro del anterior)—. Un horizonte no es horizontal, y una recta a todo el ancho de la ventana es lo que hace que un cambio de fondo se lea como el final de un bloque. Las curvas se alternan: la misma onda tres veces sería un separador.
- **El cambio de plano ocurre en el silencio, nunca cruzando una línea de texto.** La transición **es** ese silencio: no se le suma al `padding-bottom` de nadie, lo reemplaza. Por eso cada momento vuelve a empezar en su contenido y un ancla sigue aterrizando bien.
- **Del cielo se sale por transparencia.** La primera parada del amanecer es `transparent` y no el color del cielo: el canvas de estrellas está fijo detrás, y una atmósfera que se cierra encima las **apaga** en vez de taparlas.
- **La nav calcula el color que tiene detrás, cuadro a cuadro.** Cada tramo declara sus cuatro paradas (`--z0..--z3`) y el encabezado evalúa en qué punto del tramo cae su altura; la mezcla la hace `color-mix` en CSS. Las paradas son las mismas con las que se dibuja el degradado, así que el color que calcula la nav y el que se ve son una sola definición. La tinta es lo único que no se mezcla: salta una vez, a mitad del tramo — el fondo puede ser continuo, el contraste no puede.
- **Los planos van lisos.** Se probó darle grano a cada superficie y la junta entre dos secciones del mismo color se veía: cada una teje el ruido desde su propio origen. El material sigue en el grano del `body`; sobre un campo de color pleno la riqueza la da el color.
- **Dos escenas ocupan una pantalla: el formulario y el pie** (`.escena`). `100svh` y no `100vh` —en un teléfono `vh` mide la ventana con la barra retraída—, y el alto de la nav descontado del centro óptico: centrar en la ventana no es centrar en lo que se ve.
- **Sin blanco ni negro puros.**- **Sin blanco ni negro puros.**- **Sin blanco ni negro puros.** `#FFF` es la perfección clínica y `#000` es vacío, no noche.
- **El acento polar es orientación, no color de marca.** Aparece en exactamente dos lugares: el anillo de foco y el punto que marca la sección activa en la nav. Si se vuelve frecuente deja de ser la estrella.
- **Los seis tokens se mueven juntos o no se mueven.** Bajar el fondo sin bajar `surface` y `hairline` cambia las distancias del sistema, no su luz.
- **La transición de tema alcanza a todo lo que cambia de valor con el tema** (`background-color`, `color`, `border-color`, `outline-color`, `fill`), y explícitamente **no** al anillo de foco: un indicador que tarda 400 ms llega tarde para quien navega con teclado.

**Mecanismo de tema.** `data-theme="papel"|"noche"` en `<html>` gana sobre `prefers-color-scheme`; un script `beforeInteractive` lo aplica antes del primer paint para no parpadear. El toggle no tiene tercer estado "automático" a propósito. Qué etiqueta o icono mostrar **se resuelve por CSS y no por estado de React** (`[data-theme-target]`): el servidor no sabe qué prefiere el sistema del visitante, y adivinarlo produce desajuste de hidratación.

---

## 4. Espacio y ritmo

Escala base-8: `3xs .25 · 2xs .5 · xs .75 · sm 1 · md 1.5 · lg 2 · xl 3 · 2xl 4 · 3xl 6 · 4xl 8 · 5xl 12` (rem).

Dos tokens de descanso para las transiciones entre momentos: `rest` (8rem) y `rest-lg` (12rem). Y `anchor` (7rem), que es cuánto se retira un ancla del borde superior — la nav más una respiración.

**El silencio entre momentos vive como `padding-bottom` del momento que termina.** Es la condición para que el borde superior de una sección sea el comienzo real de su contenido: si el silencio fuera `padding-top` del que empieza, llegar por un ancla aterrizaría en doce rem de vacío y la navegación por secciones no podría ser precisa.

Composición: marco centrado de `92rem` como paspartú, con **asimetría adentro** — columnas desplazadas por sangrías porcentuales, nunca centrado por reflejo ni grilla uniforme. Las sangrías de una lista rotan en ciclos que no leen a patrón par/impar.

**En teléfono las sangrías desaparecen.** A 393 px la indentación roba medida sin dar ritmo; ahí el ritmo lo dan la variación vertical y el tamaño tipográfico.

**El aire se mide, no se elige por sensación.** Un espacio interno siempre tiene que ser menor que el que separa un grupo del siguiente, y hay que comprobarlo con el contenido vacío, que es como el visitante lo encuentra.

---

## 5. Material

Un grano tonal apenas perceptible sobre el fondo (`body::before`, SVG `feTurbulence` embebido como data-URI), para que el papel no sea una superficie clínica. No se mueve, no intercepta el cursor y no participa de ningún estado.

Opacidad 0.028 en papel; 0.03 con `mix-blend-mode: screen` en noche — sobre el negro profundo un grano oscuro no existe, y demasiado grano en `screen` levanta el fondo y le roba contraste a las estrellas.

Si se nota como ruido, sobra.

---

## 6. Motion — un solo vocabulario

Sin librería de animación. El vocabulario entero son transiciones CSS más un `IntersectionObserver` de ~30 líneas.

**Un estilo de movimiento nuevo no se agrega: se cambia por uno de éstos o no entra.**

1. **Recepción** — `[data-reveal]` pasa de `opacity 0` + `translateY(10px)` a su lugar, en `--duration-slow` (700 ms), **una sola vez**; el observer deja de mirar el elemento. Sin coreografías escalonadas: lo que entra junto, entra junto. Se marca por unidad y no por bloque grande, o el movimiento no llega a percibirse.
2. **Continuidad** — el fondo y la tinta transicionan al cambiar de tema; la nav transiciona entre estados; la línea de un campo pasa a tinta al enfocarse.
3. **Acuse** — `.quiet-underline`: un subrayado de 1 px que se dibuja desde la izquierda en `--duration-fast` (400 ms). Se activa por hover propio, por hover del bloque contenedor (`group`) y por foco de teclado. Sólo bajo `@media (hover: hover)`, para que en táctil no quede un estado colgado.

Duraciones 400–700 ms, una sola curva `cubic-bezier(0.16, 1, 0.3, 1)`, ease-out sin rebote.

**El estado oculto sólo existe si hay JS.** Un script `beforeInteractive` marca `html[data-js]` antes del primer paint y el estado inicial del revelado cuelga de ese selector: sin JavaScript el recorrido se ve entero, nunca queda contenido esperando un observer que no va a llegar.

**`prefers-reduced-motion` se respeta por completo:** el guard global anula transiciones y una regla explícita deja todo `[data-reveal]` ya revelado.

**Prueba final:** si el visitante nota la animación *como* animación, falló.

---

## 7. Scroll

Lenis (`src/components/scroll-suave.tsx`) interpola el mismo desplazamiento que el visitante pidió, con inercia corta (`duration: 0.9`). Sin scroll-jacking, sin secciones que se peguen, sin ruedas capturadas. `syncTouch` apagado: el scroll de un dedo en un teléfono ya tiene una física conocida y reemplazarla es hacer visible la tecnología.

**Se desmonta, no se atenúa, con `prefers-reduced-motion`**, y el scroll vuelve a ser el nativo. La navegación funciona igual sin él: `src/lib/scroll.ts` cae a `scrollIntoView`.

`html { scroll-behavior: auto }` a propósito — dejarlo en `smooth` haría que un ancla se animara dos veces.

**Cuánto se retira un ancla del borde lo dice una sola cosa: el `scroll-margin-top` de la sección.** Los dos caminos lo respetan. Pasarle además un `offset` a Lenis lo aplica *encima* del scroll-margin y la sección queda al doble de distancia — es el error que ya se cometió una vez.

---

## 8. El cielo — la excepción atmosférica

`src/components/cielo.tsx`. Es la única excepción a la quietud por defecto, y existe con una restricción que es la que la vuelve criterio en vez de decoración: **sólo en modo Noche. En Papel no hay nada.**

El modo oscuro se llama Noche y significa algo; un campo de estrellas ahí es la consecuencia del nombre, no un efecto agregado. Y el papel no tiene cielo. De ahí sale el único momento de descubrimiento del recorrido: quien cambia de tema **encuentra** un cielo que nadie le anunció.

Reglas que lo mantienen del lado de la atmósfera:

- **Densidad baja** — un punto cada ~26.000 px², con techo de 140. Un cielo lleno es un salvapantallas.
- **Deriva sub-pixel** en tres capas de profundidad: no se ve moverse, se nota que cambió si volvés.
- **El parallax responde al puntero, nunca al scroll.** Nada acá le toca el ritmo a quien recorre.
- **Los cometas son raros** — uno cada 9–26 s, nunca en los primeros ocho. Entran de los dos lados, con velocidad y curva propias, en tres tiempos (el núcleo enciende, la cola se estira, todo se apaga) y con un tinte casi blanco que se sospecha pero no se reconoce.
- **`prefers-reduced-motion`**: campo estático, sin deriva ni cometas. **Pestaña oculta**: el bucle se detiene.

**La constelación NS.** Diecisiete estrellas arriba a la derecha, una de ellas claramente la más brillante del cielo, y alrededor un polvo que hace que ahí haya más cielo que en cualquier otro lado. Cuando aparecen las líneas se reconocen una **N y una S** — pero es una pieza editorial, no la ilustración de una constelación, y eso son cinco decisiones:

| Decisión | Por qué |
|---|---|
| Las dos letras comparten renglón y **no se tocan** | Son dos partes de un sistema, no una figura cerrada: las relaciona el eje y el vacío, no una línea |
| **Mismo tamaño, distinta inclinación** — la N cae 14° y la S 22° | Ninguna es secundaria; y ocho grados de diferencia impiden que el renglón se lea compuesto, porque dos letras exactamente paralelas son tipografía |
| **Las dos se reconstruyen enteras** | Ninguna estrella de una letra queda sin trazo. La irregularidad la sostienen las magnitudes, no los trazos que faltan |
| La protagonista no es de ninguna de las dos | La estrella más brillante está sola en el hueco; es la que sostiene la composición |
| Un trazo es tan tenue como sus estrellas | La opacidad sale de la magnitud de sus dos extremos, así que las partes tenues se apagan enteras. Sin eso todas las líneas pesan igual y vuelve a ser unir los puntos |

Los dos esqueletos viven cada uno en su cuadro de alto 1 y derecho, para poder editarlos pensando en la letra; la composición los apoya después (`COMPOSICION` en `cielo.tsx`).

**El polvo.** No es una textura ni un fondo lleno de estrellas: es **densidad**. Unos 58 granos de radio menor a un píxel y opacidad 0,07–0,22, sembrados en una elipse un 42 % más grande que la figura, con caída hacia afuera. Uno solo no se ve; todos juntos hacen que el ojo se detenga ahí. Tres reglas lo mantienen del lado de la atmósfera: siempre por debajo de la estrella más tenue del campo; **nunca a menos de 8 px de una estrella de la letra ni de 5 px de un trazo** —sin ese rechazo el polvo se mezcla con la N y la S y las ensucia—; y sembrado en elipse, no en recuadro, para que la concentración tenga forma de cielo. Es la única excepción local a la densidad baja del campo, y es deliberada.

**Cuándo se ve.** Dos caminos, y ninguno exige buscar: **se revela sola** cada 13–20 s con una envolvente propia —entra en 0,9 s, sostiene 3,2 s, se apaga en 1,6 s—, y **la protagonista la abre al toque**: respira apenas, lleva un halo de tres anillos que se apaga a medida que la figura aparece, y el puntero a menos de 30 px la revela entera. La primera revelación llega a los seis segundos: esto no viene a saludar. Con `prefers-reduced-motion` no hay ciclo ni respiración y las líneas quedan puestas a media tinta — el detalle existe igual, sin que nada se mueva.

Reemplaza a un mecanismo que pedía acercar el puntero **y quedarse quieto** hasta que la quietud se acumulara. Era una idea linda y una interacción mala: tardaba varios segundos, se perdía con cualquier movimiento y casi nadie llegaba a verla. Un detalle que nadie ve no existe.

**Detalle de implementación que ya causó un bug:** el halo de un cometa deja su degradado en `ctx.fillStyle`. La tinta de las estrellas se reafirma cada cuadro o el cuadro siguiente las pinta con ese degradado.

**La firma también respira** (`src/components/firma-viva.tsx`): el cordón y el astro siguen al puntero a ritmos distintos (1,5 px contra 5 px), en capas separadas que comparten el mismo `viewBox` — la alineación la garantiza la geometría, no un ajuste a ojo.

---

## 9. Accesibilidad

No es una capa posterior: es la forma que toma la atención.

- Contraste `ink`/`bg` sobre AAA en los dos temas; `muted`/`bg` sobre AA.
- Foco visible con el token polar, sin transición.
- **Una excepción declarada, y sólo una:** los campos del formulario. Un anillo rectangular alrededor de un campo sin caja dibuja el marco que el diseño decidió no tener, así que ahí el indicador es el propio renglón — pasa de hairline a tinta y se duplica a 2 px con una sombra que no ocupa lugar. Sigue cumpliendo porque son **dos** cambios simultáneos de alto contraste: el renglón y la etiqueta del campo. Vive sin capa en `globals.css`, porque la utilidad `border-hairline` del campo le ganaría a cualquier regla declarada en `@layer base`.
- El silencio es una decisión visual: el bloque `pausa` lleva `aria-hidden`, anunciarlo sería ruido.
