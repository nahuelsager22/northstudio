# Project Journal — Web oficial de North Studio

La verdad estable del proyecto: qué es, qué se decidió, qué falta y qué no hay que romper. **Describe el presente**, no la historia.

Lo que explica *cómo funciona* algo vive en `docs/`. Las reglas de trabajo del proyecto viven en `north-studio-principles.md`. Acá va **qué se decidió y por qué**.

---

## 1. Filosofía y objetivo

Este proyecto es la web oficial de North Studio, hecha por North Studio. De ahí su tensión central: el estudio se define por *cómo decide*, no por cómo se ve. La web no puede **describir** ese criterio; tiene que ser un **ejemplo** de él. **Es el primer caso del estudio.**

**Norte rector:** que quien recorra la web sienta que *alguien presta atención de verdad* — y que, por extensión, entienda que así observará el estudio su propia identidad.

El detalle demuestra **atención**, no creatividad. Un detalle que se luce comunica "mirá lo que sé hacer"; uno que atiende comunica "te estoy mirando a vos". El primero desplaza el foco hacia el estudio; el segundo lo mantiene en la persona.

**Arco emocional:** calma → curiosidad y reconocimiento → pertenencia. El recorrido va de *ser observado* a *querer ser representado*.

**Matiz vigente y reciente:** la web sigue demostrando en vez de describir, **pero además deja claro qué hace el estudio**. La versión anterior de este principio se aplicó como prohibición de todo contenido informativo, y produjo un sitio que transmitía una experiencia y no explicaba nada. Lo prohibido es el texto declarativo vacío; la información verificable nunca lo estuvo.

---

## 2. Alcance

**Dentro:** un lugar continuo bilingüe (`/` y `/en`), una ruta dedicada por proyecto publicado, y un contacto que envía correo. Contenido autoría del estudio.

**Explícitamente afuera:** blog, newsletter, panel de administración, CMS, analítica, autenticación, comercio, y cualquier ruta de `/about`, `/servicios`, `/proceso` o índice de proyectos separado.

**Estado hoy:** el recorrido está completo y funcionando en los dos idiomas, con un proyecto publicado (Delfina Gayoso), una sección de con quién trabaja el estudio y un pie con los datos de contacto. `pnpm typecheck`, `pnpm build` y `pnpm lint` pasan limpios. Falta contenido y configuración, no estructura.

---

## 3. Stack y dependencias

Las versiones fijadas y los desvíos respecto de la base del estudio están en `north-studio-principles.md` §6. Acá, el motivo de cada decisión de dependencia:

- **Lenis** — única librería del proyecto. Entró después de haber sido descartada (ver D-14). Aporta una fluidez que el recorrido sí aprovecha, y se desmonta entero con `prefers-reduced-motion`.
- **Sin librería de animación** — todo el vocabulario de motion son transiciones CSS más un `IntersectionObserver` de ~30 líneas. Un runtime de animación sería tecnología visible en el bundle sin problema real que resolver.
- **Sin CMS** — el volumen es bajo, lo autoría el estudio, y el compilador es el validador de esquema.
- **Sin librería de i18n** — el sitemap es asimétrico por idioma y no hay negociación que resolver.
- **Sin `next-themes`** — el mecanismo completo son ~20 líneas propias.
- **Sin SDK de Resend** — enviar es un POST con un JSON y `fetch` ya está en el runtime.
- **`sharp`** se usa en `scripts/perfil.mjs` resolviéndolo desde el store de pnpm. Es una dependencia transitiva de Next, no declarada, y sólo la toca un script de estudio que no entra al bundle.

---

## 4. Decisiones tomadas

Numeradas y no se renumeran. Una decisión revertida se tacha y se conserva con el error registrado.

**Identidad y voz**

- **D-1 · La web demuestra, y además articula.** Prohibido explicar el criterio con texto declarativo cuando la experiencia puede encarnarlo; permitido y necesario decir qué hace el estudio en información verificable. *Trade-off:* exige distinguir información de manifiesto en cada línea, y esa distinción se erra fácil.
- **D-2 · Voz del estudio: cercana, cálida y profesional.** North Studio es el sujeto cuando hace falta uno; al visitante se le habla en segunda persona. Sin "nosotros" inflado, salvo donde evitarlo produce una frase contorsionada. *Reemplaza a la voz personal "yo"* (ver §6).
- **D-3 · Nombre "North Studio", sin guion.** El guion era un artefacto técnico.
- **D-4 · El logo es la firma, no la identidad.** Cordón real con caras de luz + destello de 8 puntas + nombre en serif, como una sola escena. Detalle en `docs/marca.md`.
- **D-5 · En un caso de estudio el protagonista es la persona, nunca el estudio.** North Studio aparece sólo a través de las decisiones que se ven. *Motivo:* el relato "había un problema, llegó el estudio, ahora está resuelto" convierte al cliente en el antes y al estudio en el después.

**Recorrido**

- **D-6 · Cuatro momentos, y el trabajo va segundo.** Umbral → trabajo → estudio → contacto, y un pie que los cierra. El trabajo **abre con el título de su sección** y el proyecto vive adentro: el título es más chico que el nombre de la persona, porque la sección presenta y la persona protagoniza. *Motivo:* con el estudio antes, sus frases sonaban a promesa; después, confirman algo que el visitante ya vio. *Trade-off registrado:* el recorrido descarga su energía temprano y la segunda mitad quedó fina (ver P-3).
- **D-7 · Navegación de tres destinos, sin numerar, en serif.** Trabajo · Estudio · Contacto. *Motivo:* la numeración prometía un método ordenado y convertía el índice en catálogo de metodología; el mono en versalitas era el registro de una terminal. *Supera a la nav mínima sin secciones.*
- **D-8 · La nav no se esconde.** Está siempre, en `muted` y sin banda. *Motivo:* problema práctico —para navegar había que volver arriba— y de carácter: un elemento que se va y vuelve pide ser mirado dos veces.
- **D-9 · El silencio entre momentos es `padding-bottom` del momento que termina.** Condición para que un ancla aterrice en el contenido y no en el padding.
- **D-10 · La portada de un proyecto va enmarcada.** ~~Un proyecto destacado rompía el paspartú y se mostraba a todo el ancho de la ventana: la única vez que algo desbordaba el margen.~~ **Revertida:** a sangre, la captura de un sitio ajeno no leía como obra sino como fondo de la página. Ahora va montada sobre un paspartú de `surface` con hairline, como una lámina: es una pieza dentro de la composición y no una interrupción de ella. *Lo que se pierde:* el único gesto de desborde del sitio, que era también el pico de intensidad del recorrido (ver P-3).
- **D-23 · Noche es el tema por defecto.** El sitio se abre de noche siempre; Papel es una elección que se recuerda. *Motivo:* el cielo era la mitad de la atmósfera y sólo lo veía quien tuviera el sistema en oscuro o tocara el toggle (era H-2, y quedó respondida por decisión y no por evidencia). *Lo que se paga, explícito:* se deja de respetar `prefers-color-scheme`. Alguien que puso su sistema en claro por un motivo entra igual a un sitio oscuro.
- **D-24 · El recorrido es una atmósfera continua, no una pila de planos.** ~~Antes: dos planos con una transición.~~ ~~Después: tres superficies (cielo, contra, tierra) puestas una debajo de otra, cada una con un degradado recto o un filo entre ellas.~~ **Reformulada:** el recorrido es **un descenso de color y una vuelta** — cielo → *(brasa)* → arena → *(terracota)* → tierra → *(brasa)* → cielo. *Motivo:* el problema medible no era ninguno de los tres colores sino que no había relación entre ellos: matices 265 → 85 → 45, luminancias 0.115 → 0.93 → 0.33, y un papel casi neutro entre dos planos con temperatura. Tres decisiones que no se conocían — y por eso se leía "negro, blanco, marrón" y no una página. **Lo que conecta dos planos es lo que hay entre ellos:** ninguna zona limita con otra sin que un color intermedio las presente primero. Sigue valiendo que una superficie es una paleta chica (redeclara los seis tokens y su espejo `--color-*`) y que el cambio de plano ocurre en el silencio entre momentos, nunca cruzando una línea de texto.
- **D-29 · El plano claro es arena, no papel.** `oklch(0.905 0.028 66)`: la misma familia cálida de la arcilla, aclarada. ~~Antes era el papel del tema —neutro, y "lo opuesto al cielo", así que se daba vuelta con él.~~ *Motivo:* un blanco neutro entre dos planos con temperatura es el bloque que no pertenece a nada; arena y tierra son ahora **el mismo color a dos alturas**, que es la relación cromática que faltaba entre el medio y el final. *Consecuencia deliberada:* la mitad de abajo del recorrido dejó de depender del tema —arena y tierra son iguales en Noche y en Papel—, y el tema gobierna solamente el cielo. Es un sistema más chico que el anterior: una superficie dependiente del tema en vez de dos.
- **D-30 · Una transición es una pieza de la página, no el borde de una sección.** `components/transicion.tsx`: un bloque propio en el flujo, con dos capas. **La atmósfera** —un degradado de cuatro paradas que pasa por un intermedio cálido— y **la onda** —una curva asimétrica que sube el plano siguiente dentro del anterior—. *Motivo:* mientras cada momento resolvía su propio borde, el recorrido era una pila de secciones; y un horizonte no es horizontal. La idea de la onda viene del sitio de Delfina, y acá tiene motivo propio. *Consecuencia sobre D-9:* la transición **es** el silencio entre dos momentos —no se le suma a ningún `padding-bottom`, lo reemplaza—, así que las secciones vuelven a empezar en su contenido y un ancla sigue aterrizando bien.
- **D-31 · Del cielo se sale por transparencia, no por encima.** La primera parada del degradado que abre el amanecer es `transparent` y no el color del cielo. *Motivo:* el canvas de estrellas está fijo detrás; con un color opaco las estrellas se tapan, con una atmósfera que se cierra encima **se apagan**. Es la diferencia entre un telón y un amanecer. *Condición:* la nav necesita saber de qué color es esa parada aunque el degradado no lo pinte — por eso `--z0` y `--g0` son dos valores distintos.
- **D-27 · El color entra al sistema: la tierra.** Una arcilla cálida —`oklch(0.33 0.068 45)`— **igual en los dos temas**, contra un cielo frío. Fue el primer color propio del estudio más allá del acento polar, y después trajo a la arena (D-29) y a las brasas de las transiciones (D-30). *Motivo:* no es "hacerla más colorida" — es que la mitad de abajo del recorrido se sienta un lugar y no la continuación del mismo vacío, y tiene una razón antes que un gusto: el suelo es donde se habla, y el suelo es de tierra. *Condición:* sigue siendo un plano, no un acento; el polar sigue siendo el único color de orientación.
- **D-28 · La nav calcula el color exacto que tiene detrás, cuadro a cuadro.** ~~Antes buscaba la superficie *pintada* más cercana y usaba su `--bg`.~~ **Reformulada:** cada tramo vertical declara sus cuatro paradas de color (`--z0..--z3`) y la nav evalúa en qué punto del tramo cae la altura del encabezado; entrega las dos paradas que lo rodean y cuánto hay entre ellas, y la mezcla la hace `color-mix` en CSS. *Motivo:* sobre una transición no hay ninguna superficie pintada, así que la nav conservaba el color del plano anterior y aparecía como una capa aparte apoyada encima del recorrido — que era exactamente el problema. **Las paradas son las mismas con las que se dibuja el degradado**, así que lo que calcula la nav y lo que se ve en pantalla son una sola definición y no dos que hay que mantener juntas. *Lo único que no se mezcla es la tinta:* salta una vez, a mitad del tramo, con la transición de color que ya tiene todo el sitio — un valor intermedio entre dos tintas opuestas no se lee sobre ninguno de los dos fondos. El fondo puede ser continuo; el contraste no puede. *Costo:* un `getComputedStyle` por cuadro sobre un solo elemento.
- **D-32 · El formulario y el pie son escenas de una pantalla.** `.escena`: `100svh`, contenido centrado y el alto de la nav descontado del centro óptico. *Motivo:* los dos eran secciones comprimidas entre otras dos, y el cierre del recorrido —que es su pico emocional— llegaba como un resto. *Tres cosas que no son obvias y por eso quedan escritas:* `svh` y no `vh` (en un teléfono `vh` mide la ventana con la barra retraída, así que una escena de `100vh` empieza recortada); centrar en la ventana no es centrar en lo que se ve, porque la nav flota sobre los primeros 3.5rem; y `.escena` va **fuera de toda capa** a propósito, para que le gane a cualquier utilidad de padding vertical que se agregue después. *Costo:* el ancla `#contacto` pierde su `scroll-margin` —una escena se retira sola, por dentro—, y en un teléfono muy corto el formulario desborda su pantalla y la sección crece.
- **Los planos van lisos, sin grano.** Se probó darle grano a cada superficie y la junta entre dos secciones del mismo color se volvía visible: cada una teje el ruido desde su propio origen. Anclarlo a la ventana lo empeoró. El material sigue en el grano del `body`.
- **D-25 · El recorrido cierra volviendo al cielo, al centro y en una pantalla.** ~~Dos filas de etiqueta y valor, todo en mono.~~ ~~Después: una firma con dos enlaces apoyada en la arcilla.~~ **Rehecho por tercera vez, y las tres por el mismo motivo:** el pie no es el final del sitio, es el último momento del recorrido. Ahora **vuelve al cielo** —el recorrido abre bajo las estrellas y cierra bajo las mismas; entre medio se pisa arena y tierra—, **ocupa una pantalla** (D-32) y **se compone al centro**: es el único momento centrado de un sitio construido sobre márgenes asimétricos, y por eso se lee como cierre. Un eje que aparece una sola vez y al final es una resolución. La jerarquía es la de un colofón: dos rótulos chicos en versalitas, la firma grande en el medio, mucho aire entre las tres. Instagram y el correo siguen escritos —alguien los va a querer copiar— pero cada uno **debajo de la palabra que lo nombra**: son el valor de un rótulo, no una línea de contacto suelta. *Beneficio lateral:* en la página de un caso, que transcurre entera bajo el cielo, el pie ya no necesita traer ningún plano — simplemente continúa, y desapareció el borde duro que había ahí. ~~Antes no había pie: el último silencio cerraba como se cierra un libro.~~ *Motivo del cambio:* un estudio que no dice dónde encontrarlo le hace trabajo a quien quiere seguir la conversación por otro lado. Sigue sin haber "seguinos", menú de enlaces ni copyright.
- **D-26 · El trabajo abre con el título de su sección, y no hay lista de clientes.** ~~Una sección aparte con "Trabajamos con" y los nombres debajo, con ejemplos detrás del filtro de ensayos.~~ **Reemplazada:** el título ("Con quién trabajamos") encabeza el momento del trabajo y el proyecto vive adentro. *Motivo:* una lista de nombres al lado de un proyecto duplicaba la misma información con menos evidencia, y los placeholders no tenían por qué existir. Sigue valiendo el criterio del nombre: no "Clientes", que los vuelve una categoría, ni "Confían en North Studio", que le pide al visitante un juicio que le toca a él.

**Sistema visual**

- **D-11 · Tres registros con significado fijo:** serif = voz, grotesque = acción, mono = notación. La regla operativa está en Principles §3; la tabla en `docs/sistema-visual.md`.
- **D-12 · El cielo existe sólo en modo Noche.** Es la única excepción a la quietud por defecto, y la restricción es lo que la vuelve criterio: el papel no tiene cielo. *Trade-off asumido:* deja los dos temas desparejos (ver P-4).
- **D-20 · La constelación forma una N y una S, pero es una pieza editorial, no un dibujo.** ~~Primero se resolvió como una orientación abstracta.~~ ~~Después como un NS unido por un puente, con todos los trazos al mismo peso.~~ ~~Después con la S a la mitad del tamaño de la N y dos trazos sin dibujar.~~ **Formulación vigente:** las dos letras **miden lo mismo y pesan lo mismo** —ninguna es secundaria—, se pueden **reconstruir enteras** —ninguna estrella queda sin trazo—, **no se tocan** —ni línea ni estrella las une—, comparten renglón pero **no inclinación**: la N cae 14° y la S 22°, y esos ocho grados son los que impiden que se lea compuesto, porque dos letras exactamente paralelas son tipografía. La estrella más brillante no pertenece a ninguna de las dos y está en el hueco. Y **la opacidad de cada trazo sale de la magnitud de sus dos extremos**, así que las partes tenues se apagan enteras. *Motivo de la última vuelta:* la S subordinada dejaba la composición desbalanceada y los trazos faltantes dejaban estrellas importantes sin resolver; lo que sostiene la irregularidad son las magnitudes, no los trazos que faltan. *Lo que no hay que deshacer:* que no se toquen, que las dos pesen igual, y que la protagonista no sea de ninguna letra.
- **D-22 · Alrededor de la constelación el cielo tiene más densidad.** Un polvo de ~58 granos —radio menor a un píxel, opacidad 0,07 a 0,22— sembrado en una elipse centrada en la figura, que **rechaza todo lo que caiga a menos de 8 px de una estrella de la letra o 5 px de un trazo**. *Motivo:* hace que el ojo se detenga en esa zona antes de saber por qué, y le da profundidad a la única parte del cielo que tiene una forma adentro. *Es una excepción local declarada a la densidad baja del campo* (D-12: un punto cada ~26.000 px²): acá hay más, a propósito. *Condición para que no se vuelva textura:* que ningún grano llegue a competir con la estrella más tenue del campo, y que el margen de rechazo se mantenga — sin él el polvo se mezcla con la N y la S y las ensucia.

- **D-21 · La constelación se revela sola, y la protagonista la abre al toque.** Cada 13–20 s entra, sostiene 3,2 s y se apaga; y el puntero sobre la estrella brillante —que respira apenas y tiene un halo de tres anillos— la abre de inmediato. ~~Antes había que acercar el puntero y quedarse quieto varios segundos.~~ *Motivo:* la quietud acumulada era una idea linda y una interacción mala —se perdía con cualquier movimiento y casi nadie llegaba a ver la constelación—. *Lo que se pierde:* el mérito de haberla encontrado; ahora es un detalle que pasa en la página, no algo que el visitante tenga que conseguir. Con `prefers-reduced-motion` no hay ciclo ni respiración: las líneas quedan puestas a media tinta.

- **D-13 · Los seis tokens de color se mueven juntos.** Papel bajó a `L 0.955` porque deslumbraba; Noche bajó a `L 0.115` porque a 0.18 era el gris de una interfaz oscura y las estrellas no tenían dónde brillar.

**Técnicas**

- **D-14 · Lenis entra.** ~~Descartado en su momento por interceptar el scroll nativo.~~ **Revertida:** se comprobó en otro proyecto que aporta una experiencia mejor, y la objeción original —dos experiencias distintas de scroll— se resolvió haciendo que la ausencia de Lenis sea un estado de primera clase: la navegación funciona igual sin él.
- **D-15 · Contenido en objetos TypeScript locales, no CMS.** Ver `docs/contenido.md`.
- **D-16 · i18n sin librería**, con dos árboles de rutas reales y fallback silencioso a ES.
- **D-17 · Contacto de tres campos, sin autocompletado.** *Trade-off explícito:* estos campos dejan de cumplir WCAG 1.3.5. Decisión tomada con el costo sobre la mesa, priorizando la coherencia visual sobre la comodidad de completado en un formulario de dos datos cortos.
- **D-18 · Resend detrás de una interfaz intercambiable, y el acuse es best-effort.** Si falla el aviso al estudio, el formulario lo dice; si falla el acuse, no. Ver `docs/contacto.md`.
- **D-19 · Visibilidad de borradores en tres capas** — no listados · URL directa con `noindex` y aviso visible · ensayos inexistentes en producción.

---

## 5. Decisiones abiertas

- **A-1 · Dominio propio verificado en Resend.** *Destino:* antes de publicar. *Desbloquea:* que el acuse al visitante llegue. Hoy se rechaza por diseño con el remitente de desarrollo.
- **A-2 · URL final del sitio de Delfina.** *Destino:* cuando exista dominio. Hoy el caso enlaza a una URL de preview de Vercel, que es lo único del caso que se ve sin terminar. Opciones: dominio final, quitar `enlaceVivo` hasta que exista, o dejarlo.
- **A-3 · Qué Easter Eggs entran.** *Destino:* decisión del usuario, propuesta ya presentada. Orden de valor recomendado: modo observación → variación por hora local → estrella polar → segunda visita → lector calmo. La constelación ya está implementada (D-20).
- **A-4 · El colofón de oficios.** Es lo último que existe para informar y no para que algo se sienta. Se conserva porque un visitante derivado necesita saber en dos segundos si esto le sirve. *Destino:* revisar al recorrer el sitio completo.
- **A-6 · Cita de Delfina.** No existe y no se inventa. *Destino:* cuando ella dé una devolución real.

---

## 6. Decisiones descartadas

Se conservan las que siguen evitando que el proyecto repita un error.

- **Voz personal "yo".** Ataba la marca a un individuo y hacía leer el sitio como portfolio personal.
- **Sección "El encargo" con el proceso en cuatro etapas.** Un estudio que enumera sus etapas describe lo que su trabajo debería poder mostrar solo. Se eliminó entera y el sitio quedó 42 % más corto.
- **Ficha de "con quién / cuántos a la vez / qué incluye".** *Cuántos a la vez* transmitía limitación, *qué incluye* era proceso interno, y *con quién* decía "elegimos clientes" — el gesto de alguien que necesita parecer demandado.
- **Índice de nav numerado (`01 · 02 · 03`).** Convertía la nav en catálogo de metodología.
- **Monograma NS para la nav.** Dos letras no dicen nada que el nombre no diga ya, y competirían con la firma. *Vale para la nav y no para el cielo:* una constelación que forma las letras no es un logotipo alternativo sino una figura que hay que descubrir (ver D-20).
- **Recorte de favicon como foto de perfil.** A 1024 px se lee como un triángulo con una muesca: la silueta simplificada a ícono que el proyecto ya había descartado por genérica.
- **Ruta `/about`, `/servicios`, `/proceso`, índice de proyectos separado, página `/contacto`.** Cada una fragmentaría el lugar o sería el texto declarativo que D-1 prohíbe.
- **Grilla de cards uniformes, slider, carrusel** para el trabajo.
- **CAPTCHA en el contacto.** Hacerle rendir un examen a quien viene a hablar es lo contrario de escuchar.
- **Confirmar el envío en producción cuando no hay proveedor.** Dar por enviado un mensaje que nadie va a leer sería fingir atención.
- **El puente del estudio** ("eso se nota en cómo escribís, en qué elegís mostrar, en cuánto espacio dejás…"). Explicaba con tres ejemplos algo que la tesis ya deja entender. *Costo asumido:* el salto de la tesis a "sitios web pensados desde cero" queda más seco, que era exactamente lo que el puente vino a resolver en su momento.
- **El párrafo de dirección de arte del caso Delfina** ("un verde salvia, una serif de trazo fino, fotografía sin estilizar"). Enumeraba decisiones sin decir qué consiguen, y describía una ausencia. Cierra A-5.
- **"Identidad digital"** en la ficha de roles del caso.
- **Comillas decorativas en el bloque `cita`** y **"siguiente proyecto →"** al cerrar un caso.
- **Fotografía de paisaje o stock como clima.** Sería *contar* en vez de demostrar.
- **Fuente variable con eje `opsz`.** Pesa ~2,3× más; el optical sizing es un refinamiento.
- **Tope fijo en píxeles para el ancho de un medio.** Se veía justo en un portátil y chico en 1920.
- **Tercer estado "automático" en el toggle de tema.**
- **Motion (librería), MDX, JSON, `next-themes`, SDK de Resend, librería de i18n.** Todas responden que no a *¿mejora realmente el proyecto?*.
- **Fixture de ensayos de composición.** Cumplió su función —probar que la variación cabe en el orden— y se retiró al publicarse el primer caso real. El mecanismo `esEnsayo` se conserva.

---

## 7. Roadmap

El recorrido está completo. Lo que queda no es estructura sino contenido, configuración y refinamiento.

1. **Refinamiento de experiencia** — los dos puntos estructurales abiertos: el pico que no vuelve (P-3) y la atmósfera de Papel (P-4).
2. **Easter Eggs** — según A-3.
3. **Publicación** — dominio, verificación de Resend, envío real de punta a punta.
4. **Segundo proyecto** — el primero que va a poner a prueba de verdad el ritmo de la lista y la variación por secuencia.

---

## 8. Pendientes y riesgos activos

- **P-1 · Verificar un envío real de punta a punta con dominio propio.** Ya se hizo uno con el remitente de desarrollo: llegaron los dos correos. Falta repetirlo en las condiciones definitivas.
- **P-2 · Rotar la API key de Resend antes de publicar.** Viajó en texto plano por el chat. *Riesgo activo.*
- **P-3 · El recorrido pierde intensidad después del trabajo.** La segunda mitad son dos frases y un formulario, y el contacto —que es el pico emocional del arco— es visualmente lo más callado de la página. *Requiere decisión.*
- **P-4 · Papel sigue con menos atmósfera que Noche.** Noche tiene cielo, cometas y constelación. El descenso de color (D-24) existe igual en Papel —arena y tierra son las mismas— y las transiciones lo llevan, así que la distancia se acortó bastante; lo que sigue faltando es atmósfera viva, no planos. *Anotado al pasar:* el papel del tema es casi neutro (croma 0.006) y contra la arena y la arcilla se lee apenas frío. Entibiarlo tocaría el token del tema y no se hizo en esta iteración.
- **P-5 · `src/components/brand/mark.tsx` ya no se usa en ninguna vista.** `--color-surface` dejó de estar sin uso: lo usan las superficies (D-24) y el paspartú de las portadas (D-10).
- **P-8 · El recorrido se verificó a ojo y por medición, pero no con scroll real.** El panel de preview congela `requestAnimationFrame` mientras no se lo muestra y no compone una página desplazada, así que el recorrido se recorrió moviendo el documento con `margin-top` y disparando `scroll` a mano. Todos los planos y las tres transiciones se vieron en captura, en los dos temas y en teléfono; el color que calcula la nav se comprobó leyendo el `background-image` ya resuelto del velo en tres puntos (cielo, arena y tierra) y coincide con el fondo. Lo que **no** se probó es el comportamiento con scroll continuo real: el ritmo de las transiciones al bajar, y la nav cambiando de tinta en movimiento. *Destino:* recorrer el sitio en un navegador real, en los dos temas y en teléfono, antes de publicar.
- **P-6 · El rate limiting vive en memoria de una instancia.** Si el despliegue escala, el límite se relaja solo. Defensa proporcional asumida; revisable con tráfico real.
- **P-7 · Advertencia registrada (D-17):** el formulario dejó de cumplir WCAG 1.3.5 por decisión explícita.

---

## 9. Aprendizajes

- **Dos colores no se relacionan por acercarse: se relacionan por lo que hay entre ellos.** El sitio tenía tres planos razonables y se leía como tres bloques. No hizo falta cambiarlos a todos —hizo falta que ninguno limitara con otro sin un color intermedio que los presentara—. El degradado recto entre dos colores lejanos pasa por el punto muerto que hay entre ellos, y ese punto muerto es lo que se lee como corte.
- **Un borde entre dos cajas puede caer en una fracción de píxel** (medido: 847.30) y entonces las dos lo pintan a medias: por esa décima se ve el fondo del documento como una línea. Se arregla montando un píxel, no ajustando colores — los colores ya eran idénticos.

Enunciados como regla, no como anécdota.

- **Honesto ≠ neutro.** Destilar hasta la geometría pura vacía la identidad. Para simplificar un símbolo hay que partir de la naturaleza real, no de la figura abstracta.
- **El vacío sólo se lee como decisión si la página lo sostiene.** Un umbral de exactamente 100vh con todo centrado no lee como silencio: lee como final.
- **Cuando algo se contrae, se contrae entero** — incluida su etiqueta. Rotular una ausencia es disimularla.
- **La sobriedad se rompe por escala, no por gusto.** Un sistema tokenizado no garantiza la composición: cada formato hay que mirarlo.
- **Lo que acompaña no debe poder quedarse.** Cuando un comportamiento es "se retira y vuelve", hay que revisar qué lo retiene, y que sólo lo retenga quien lo necesita.
- **Un dato que modula un sistema tiene que poder apagar lo que el sistema hacía sin él.** Si no, el dato no controla de verdad.
- **Dos cosas con el mismo registro tipográfico se leen como la misma cosa.** La jerarquía no se resuelve con tamaño ni con color: con registro.
- **El aire no se elige por sensación, se compara** — y se mide con el contenido vacío, que es como el visitante lo encuentra.
- **Las clases que agrupan propiedades esconden qué se está animando.** Cuando lo que transiciona incluye un indicador de accesibilidad, hay que nombrar la propiedad.
- **La degradación honesta no es una sola.** El mismo silencio que en un entorno es cortesía, en el otro es mentira.
- **La construcción "no es X, es Y" es maquinaria de persuasión.** Plantea un contraincendio para que la decisión propia se lea como superior, y suele esconder un golpe a cómo trabajan otros.
- **Si hay que decir que se observa, es que no se nota.** Vale para todo texto que anuncia una cualidad en vez de ejercerla.
- **Para un elemento apaisado dentro de un círculo, el margen se calcula contra la diagonal.** Un margen prudente contra el ancho desperdicia todo el alto disponible.
- **Un archivo de bloque que sobrevive al bloque se vuelve una segunda memoria que nadie mantiene.** Comprobado en este proyecto: el journal creció a 557 líneas acumulando bloques cerrados hasta dejar de servir para retomar el trabajo.

**Candidatos a subir al Playbook** (universales, no propios de este proyecto): *dos cosas con el mismo registro se leen como la misma cosa*; *la construcción "no es X, es Y" es maquinaria de persuasión*; *si hay que decir que se observa, es que no se nota*; *la degradación honesta no es una sola*. No se subieron: modificar la metodología excede el alcance de esta migración.

---

## 10. Hipótesis en observación

- **H-1 · Que el trabajo en segundo lugar sostenga la credibilidad con un solo caso publicado.** *Veredicto pendiente:* se mide cuando haya un segundo proyecto y se pueda comparar.
- ~~**H-2 · Que el cielo se descubra.**~~ *Cerrada sin veredicto empírico:* se resolvió por decisión (D-23). Noche pasó a ser el default, así que el cielo ya no depende de que alguien lo encuentre. Lo que ahora se descubre es Papel.
