# Dirección de Arte — North-Studio (web oficial)

Traduce la identidad ya cerrada en `project-journal.md` a un lenguaje visual concreto. No implementa la web ni define secciones. Cada decisión está atada al **norte rector** (que el visitante sienta que *alguien presta atención de verdad*) y al **mapa emocional** (Apertura: calma · Desarrollo: curiosidad y reconocimiento · Contacto: pertenencia). Todo pasa por el doble filtro: (a) ¿representa, tiene intención, fortalece coherencia, sería eliminable sin perder identidad, envejecería bien? y (b) ¿hace sentir observado al visitante o solo se luce?

Este documento es una **dirección recomendada**, lista para volverse tokens en el bloque de Setup Técnico. Donde una decisión necesita genuinamente la validación del usuario, se marca. No es un catálogo de opciones.

---

## 0. Principio de la dirección

Una regla gobierna las cinco disciplinas: **el registro es el de un objeto editorial impreso con cuidado, no el de una interfaz que quiere impresionar.** El papel, la tinta, el margen y el silencio son el material; el color y el movimiento son casi ausencias administradas con precisión. La atención se demuestra en lo que se retira, no en lo que se agrega. La sobriedad acá no es un default estético: es la consecuencia de decidir que nada compita con la persona que un día ocupará este recorrido.

---

## 1. Tipografía

La tipografía es la voz visible del estudio. Como la voz recomendada es personal, precisa y sin prisa (`project-journal.md`), el sistema tipográfico separa **dos registros con funciones distintas**, nunca decorativos:

- **Serif editorial — la voz.** Donde el estudio habla y donde el lector desacelera: display, títulos, cuerpo de lectura, citas. Aporta calidez, autoridad tranquila y respiración. Es la cara que porta la identidad.
- **Grotesque neutra — la interfaz.** Donde el estudio ayuda a moverse: navegación, etiquetas, microcopy funcional, formularios, el logotipo. Su trabajo es **desaparecer**.

### 1.1 Familias (reales, self-host, con fallback de sistema)

**Serif — Newsreader** (Production Type; open source, variable, con optical sizing e itálicas).
```
font-family: "Newsreader", Georgia, "Times New Roman", "Noto Serif", serif;
```
Por qué: fue diseñada específicamente para **leer en pantalla** — su nombre mismo es *atención al lector*. Tiene calidez humanista sin la personalidad de moda de una Fraunces ni el brillo de lujo de una Didone de alto contraste (ambas se lucirían). El optical sizing hace que el mismo texto se sienta cuidado en título y en cuerpo: un detalle que atiende, no que se anuncia. La itálica real (no oblicua) da un énfasis humano, hablado, coherente con la voz en primera persona.

> Alternativa acotada (requiere validación solo si se busca un grado más de geometría/frialdad controlada): **Spectral** (también Production Type, screen-first, algo más racional). Recomiendo Newsreader por su calidez; se deja Spectral registrada por si en maqueta la voz pide menos curvatura.

**Grotesque — Mona Sans** (open source, variable; neutra, bien *hinted*).
```
font-family: "Mona Sans", -apple-system, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
```
Por qué: necesitábamos una neutra que **desaparezca**, pero elegir Inter por reflejo sería exactamente el "minimalismo genérico por defecto" que el proyecto prohíbe — una decisión que no demuestra criterio. Mona Sans es igual de invisible en uso, self-hosteable y variable, pero es una elección y no un default. En la interfaz, reachar por personalidad sería lucimiento; acá la neutralidad es la decisión correcta, y la personalidad vive en la serif.

**Acento monoespaciado — opcional, muy acotado.** Solo para metadatos numéricos, índices de proyecto y captions técnicos (`ui-monospace, "SF Mono", Menlo, monospace`). Números que se alinean y captions que susurran "esto fue catalogado con cuidado". Regla dura: **jamás en cuerpo ni en títulos**; si aparece fuera de metadatos, se está luciendo y se retira.

### 1.2 Escala

Escala modular restrenida (razón ≈ 1.2, *minor third*), base de lectura generosa. Editorial: pocos tamaños, mucho aire. Valores en `rem` (base 16px).

| Rol | Tamaño | Familia | Uso |
|---|---|---|---|
| Display | `clamp(2.75rem, 6vw, 4.5rem)` | Serif 300 | Un momento por vista. Nunca grita. |
| Título 1 | `2.25rem` | Serif 400 | Aperturas de movimiento. |
| Título 2 | `1.75rem` | Serif 400 | Sub-momentos. |
| Título 3 | `1.375rem` | Serif 400 | Bloques internos. |
| Lectura (body) | `1.125rem` (18px) | Serif 400 | Texto largo. Interlineado amplio. |
| Interfaz (UI) | `1rem` | Grotesque 400 | Nav, botones, texto funcional. |
| Etiqueta / eyebrow | `0.8125rem` | Grotesque 500 | Mayúsculas, tracking abierto. |
| Metadato / caption | `0.8125rem` | Mono 400 | Índices, fechas, créditos. |

La lectura a 18px con interlineado amplio es una decisión de atención: legibilidad cómoda = respeto por quien lee. El display en peso **light (300)** hace que lo grande respire en vez de golpear — grande no es lo mismo que fuerte.

### 1.3 Pesos

- Serif: **300** (display), **400** (títulos y cuerpo), **500** solo para un énfasis puntual. **Prohibido bold pesado** — el bold es impacto varsity, el registro que estamos abandonando. El énfasis se hace con *itálica*, no con negrita.
- Grotesque: **400** y **500** únicamente. Nunca black/heavy.

### 1.4 Tracking e interlineado

| | Tracking | Interlineado |
|---|---|---|
| Display serif | `-0.02em` | `1.05` |
| Títulos serif | `-0.01em` | `1.15` |
| Lectura serif | `0` | `1.65` |
| UI grotesque | `0` | `1.45` |
| Etiqueta grotesque | `+0.12em` (mayúsc.) | `1.3` |
| Metadato mono | `+0.02em` | `1.4` |

El tracking negativo en tamaños grandes los vuelve **compuestos y calmos** (las letras se conocen entre sí); el tracking positivo en etiquetas chicas las vuelve **arquitectónicas y silenciosas**, no gritonas. El interlineado 1.65 en lectura es aire deliberado: el texto no se apura.

### 1.5 Criterio de uso

- La serif habla; la grotesque orienta. Nunca se mezclan dentro de una misma línea por decoración.
- Medida de línea (line length) tope **60–68ch** en lectura: pasado eso, la legibilidad cae y la atención se rompe.
- Un solo display por vista. Si compiten dos, ninguno se lee.
- El énfasis es itálica, no negrita ni color ni subrayado.

---

## 2. Color

Paleta **silenciosa**: casi todo el sitio es tinta sobre papel. El color no es un recurso de marca que se exhibe; es la temperatura del ambiente. Definida en **OKLCH** (control perceptual, transición limpia claro/oscuro); se acompaña con hex aproximado como fallback. OKLCH es la fuente de verdad.

Dos temperaturas gobiernan la identidad: **papel/tinta cálidos** (el objeto editorial, la honestidad, lo humano) y un único acento **polar** frío y de baja saturación (la estrella polar: orientación, no decoración).

### 2.1 Modo claro — "Papel"

| Token | OKLCH | Hex aprox. | Uso |
|---|---|---|---|
| `bg` | `oklch(0.98 0.004 90)` | `#FAF9F6` | Fondo. Blanco cálido, **no** blanco puro (el blanco puro es la perfección clínica que Discovery rechaza). |
| `surface` | `oklch(0.965 0.004 90)` | `#F4F2EE` | Superficie apenas elevada. |
| `ink` | `oklch(0.22 0.008 60)` | `#201D19` | Texto principal. Casi-negro cálido, **no** `#000` (el negro puro es el registro varsity duro). |
| `muted` | `oklch(0.48 0.006 60)` | `#6E6A63` | Texto secundario, metadatos. |
| `hairline` | `oklch(0.90 0.004 80)` | `#E4E1DB` | Líneas, bordes, reglas editoriales. |
| `polar` | `oklch(0.55 0.06 250)` | `#5A6E88` | Acento: enlaces, foco, la estrella. Uso rarísimo. |

### 2.2 Modo oscuro — "Noche"

No es la inversión del claro: es la **noche del norte**, el fondo sobre el que la estrella polar orienta.

| Token | OKLCH | Hex aprox. | Uso |
|---|---|---|---|
| `bg` | `oklch(0.18 0.012 250)` | `#17181C` | Fondo. Casi-negro con una traza fría, **no** negro puro (noche, no vacío). |
| `surface` | `oklch(0.22 0.012 250)` | `#1E2025` | Superficie apenas elevada. |
| `ink` | `oklch(0.92 0.006 85)` | `#E9E5DE` | Texto principal. Blanco roto cálido (no `#FFF`: el blanco puro sobre negro vibra y cansa). |
| `muted` | `oklch(0.68 0.008 250)` | `#A0A2A8` | Texto secundario. |
| `hairline` | `oklch(0.30 0.010 250)` | `#3A3D44` | Líneas y bordes. |
| `polar` | `oklch(0.72 0.06 250)` | `#93A6C4` | Acento, mismo rol. |

### 2.3 Criterio de color

- **Croma mínimo en todo.** Neutros entre 0.004–0.012; el acento en 0.06. Nada supera esa saturación: eso es lo que hace la paleta "silenciosa".
- **El acento es la estrella polar, no un color de marca.** Aparece rara vez y siempre como *orientación* (un enlace, el estado de foco, un punto que guía). Si el polar se vuelve frecuente, deja de ser la estrella y pasa a ser decoración: se recorta.
- **Sin gradientes de impacto.** Se permite, opcional y solo en el fondo oscuro, una gradación vertical de valor *imperceptible* como atmósfera de noche (profundidad, no efecto). Si se nota como gradiente, es demasiado.
- **Contraste = respeto.** `ink`/`bg` supera AAA en ambos modos; `muted`/`bg` mantiene AA. La accesibilidad es una forma de atención al visitante, no un checkbox posterior.
- **Ambos modos son de primera clase.** No hay "modo principal y su versión oscura": cada uno se compone con intención propia.

---

## 3. Espacio y ritmo

El vacío es contenido (`project-journal.md`, principio 3). El espacio no es lo que queda entre las cosas: es lo que las hace legibles y lo que le da al visitante lugar para respirar. La composición trabaja como una página editorial con paspartú, no como una grilla de dashboard.

### 3.1 Principios de composición

- **El margen enmarca la atención.** El contenido no llega a los bordes; el vacío perimetral actúa como el mat de un cuadro. Lo enmarcado se percibe cuidado.
- **Asimetría con intención, no centrado por defecto.** Columna editorial desplazada, un margen ancho deliberado como silencio activo. Se evita el "todo centrado" y la grilla perfectamente uniforme (regla anti-genérica de Midfield). El centrado se usa solo cuando la calma lo pide, no por reflejo.
- **Una idea por vista.** Densidad baja. Los elementos pueden estar solos; no hay miedo al vacío.
- **Ritmo vertical sobre una línea base.** El espaciado crece en las transiciones para crear pausas: el silencio entre movimientos es parte del recorrido, como el blanco entre párrafos de un libro.

### 3.2 Escala de espaciado

Base **8px**, con pasos de "respiración" para los descansos entre movimientos. En `rem`:

```
3xs .25 · 2xs .5 · xs .75 · sm 1 · md 1.5 · lg 2 · xl 3 · 2xl 4 · 3xl 6 · 4xl 8 · 5xl 12
```
Los descansos entre secciones usan `4xl`–`5xl` (`clamp` en responsive). Ese salto grande antes de un momento clave hace que el visitante **llegue** a él, no que lo atropelle.

### 3.3 Densidad y ritmo

- **Medida de lectura** tope 60–68ch (ver §1.5): el ancho es una decisión de ritmo, no solo de tipografía.
- El ritmo acompaña, no arrastra: incrementos de espaciado consistentes hacen que el scroll se sienta como una respiración regular. Nada tira del visitante hacia adelante.
- La **ausencia de un elemento esperado** (un separador que no está, una sección que no se llena) es ritmo: no llenar por costumbre demuestra criterio (`project-journal.md`, norte rector).

---

## 4. Motion

Principios e intención, no implementación (eso es bloque posterior). Regla marco: **la tecnología desaparece** (`project-journal.md`, principio 5). El estado por defecto es la **quietud**; el movimiento es la excepción y siempre se justifica.

### 4.1 Cuándo el movimiento acompaña

- **Recepción, no espectáculo.** En la primera aparición de un contenido, un fundido sutil con un ascenso de pocos píxeles, lento y una sola vez: la página *recibe* al visitante. Nunca coreografías escalonadas que se anuncian.
- **Continuidad y orientación.** Las transiciones entre estados preservan el lugar del visitante — la metáfora de la estrella polar: nunca se pierde dónde está. El movimiento conecta un momento con el siguiente, no reinicia la atención.
- **Acuse de intención.** Una respuesta contenida al hover (un subrayado que se dibuja despacio, un cambio de valor mínimo): reconoce el gesto del visitante. Es atención — "te vi" — no floritura.
- **Scroll fluido** (Lenis) **solo si el recorrido se beneficia**; se decide en un bloque posterior según necesidad real, no por costumbre.

### 4.2 Cuándo el movimiento se calla

- Sin autoplay, sin parallax de exhibición, sin scroll-jacking que quite control.
- Sin loops decorativos ni movimiento que compita con la lectura.
- Sin múltiples estilos de movimiento conviviendo: un solo vocabulario de motion en todo el sitio.

### 4.3 Intención de tiempo y curva

- Duraciones **lentas y humanas** (≈400–700ms en revelados). El apuro es una emoción prohibida (`project-journal.md`).
- Ease-out suave (algo que llega y se asienta), **nunca** elástico o con rebote: el bounce es lúdico y se luce.
- `prefers-reduced-motion` se respeta por completo: honrar la configuración del visitante es la forma más literal de "prestar atención de verdad".

**Prueba final:** si el visitante nota la animación *como* animación, falló. El motion debe sentirse como la página respirando con él.

---

## 5. Imagen y textura

Decisión y su porqué. La foto de una persona no es el eje (no hay individuo que representar; `project-journal.md`).

### 5.1 Qué se omite, y por qué la omisión es la decisión

**No entra fotografía de paisaje como decoración.** El logo actual usaba una montaña fotográfica literal: ese es el registro de impacto que estamos abandonando. Ilustrar el norte con una foto de montaña sería *contar* ("somos sobre montañas") en vez de *demostrar* atención — y sería un recurso genérico de stock. La montaña, el norte y la estrella viven como **cualidades sentidas** (elevación en el ritmo vertical, una división tipo horizonte, un único punto que orienta) y en el logo, no como imagen literal. **Omitir el stock es, en sí, el movimiento de criterio: la ausencia es atención.**

### 5.2 Qué sí construye el universo del estudio

- **La obra, cuando exista.** El universo se representa a través del trabajo real (el caso Delfina Gayoso y los que vengan). La fotografía de proyecto es **contenido**, nunca relleno de clima: honesta, sin prisa, sin filtros que fabriquen una emoción. Sigue las mismas reglas que todo lo demás.
- **La textura del objeto editorial.** El material del estudio es papel, tinta, la línea fina (hairline), la regla, el margen generoso. Es la textura de un impreso cuidado, no la de un lugar.
- **Grano imperceptible, opcional.** Un tooth/grano tonal apenas perceptible sobre los fondos, para evitar el blanco clínico que Discovery rechaza. Textura como **calidez y honestidad**, no como efecto. Regla dura: si se nota como efecto, sobra.

### 5.3 Criterio de imagen

- Toda imagen es contenido o no está. Nada de mood-filler.
- Si un día entra un registro atmosférico (lugar, material), se decide contra el mismo filtro: ¿representa a quien la web va a alojar, o solo se ve bien? Si solo se ve bien, no entra.

---

## 6. El logo como firma (camino B)

Propuesta para validación, no decisión cerrada. Archivos reales en `/brand` (SVG), variantes claro y oscuro. Hoja de contacto: `/brand/preview.html`.

### 6.0 El encuadre: el logo es la firma, no la identidad

La identidad de North-Studio no vive en el logo. Vive en el **sistema** — tipografía, composición, ritmo, espacio, fotografía (cuando corresponda) y motion (las cinco disciplinas de §1–§5). El logo es solamente la **firma**: la marca de alguien que toma muy buenas decisiones. No tiene que cargar todo el significado del estudio; tiene que ser honesto y sentirse inevitable. Esto libera al logo de la sobre-exigencia y, a la vez, sube la vara: una firma miente si es genérica.

Corrección de rumbo respecto de la primera iteración (registrada como aprendizaje): destilar hacia la **geometría pura** costó demasiada identidad — el pico se leía como triángulo y la estrella como cruz. North-Studio no busca ser **neutro**; busca ser **honesto**, y hay diferencia. El camino no es partir de la figura geométrica sino de la **naturaleza**: una montaña real que se simplifica sin dejar de sentirse montaña.

### 6.1 Qué se conservó

- **El sistema simbólico completo:** norte + montaña (permanencia, elevación) + estrella polar (orientación, guía). Es lo permanente; se preserva el significado, no la ejecución varsity.
- **La relación montaña–estrella:** la estrella orienta desde el cielo, sobre el cordón. Se asciende hacia el punto de guía.

### 6.2 Qué se transformó

| Antes (impacto) | Ahora (firma honesta) |
|---|---|
| Montaña fotográfica y detallada | **Cordón real simplificado**: silueta asimétrica, cumbre dominante y filo, sin ser un triángulo |
| Estrella maciza de 5 puntas (deportiva) | Estrella polar de 4 puntas con **eje vertical dominante** (chispa que guía, no cruz) |
| Letras varsity con doble contorno | Nombre en serif editorial, integrado a la escena |
| Icono + logotipo como dos piezas sueltas | **Una sola idea**: cordón, estrella y nombre comparten horizonte, margen izquierdo, ancho y peso de tinta |
| Negro/blanco duro | Tinta y papel cálidos |

### 6.3 Los entregables

- **La firma** (`north-studio-lockup-{light,dark}.svg`): el cordón montañoso simplificado, la estrella polar en el cielo y "North Studio" en serif, compuestos como **una escena única**. No es un ícono al lado de un texto: la silueta se apoya en el mismo horizonte, comparte el margen izquierdo y el ancho del nombre, y usa el mismo peso de tinta que la tipografía. Por eso se siente como una firma y no como un logo pegado a una palabra.
- **Marca compacta** (`north-studio-mark-{light,dark}.svg`): cordón + estrella, sin nombre, para avatar y favicon.
- **Silueta de tinta llena, no contorno:** el cordón es una masa sólida (permanencia, presencia, honestidad) y no una línea de diagrama. Es el único momento de presencia de tinta de todo el sistema; el resto respira en hairlines. Esa presencia está justificada: es la firma.
- **El gesto propio — la cumbre se inclina hacia la estrella.** Es lo que vuelve la firma *ownable* y hace que el isotipo funcione solo, sin agregar elementos: la cumbre dominante se inclina levemente hacia la derecha, hacia la estrella; la roca se orienta hacia la luz que la guía. Ata montaña y estrella en una sola idea aunque estén separadas y encarna el norte rector (orientación, atención). La estrella deja de flotar: es hacia donde la montaña mira.
- **El astro — destello de 8 puntas (4 largas + 4 cortas).** El camino intermedio entre la estrella de librería y el punto: un *destello de luz* refinado, elegante y atemporal, como un brillo observado en el cielo. Recuerda a la estrella fundacional (Rockstar North) pero en un lenguaje mucho más sutil — un gesto de luz que acompaña la montaña, no un adorno. Se descartaron los extremos previos (5 puntas tradicional; punto de luz). Variantes de proporción (rayos más largos/finos; eje vertical dominante) exploradas en la hoja de contacto.
- **Favicon dedicado** (`north-studio-favicon-{light,dark}.svg`): recorte cuadrado de la cumbre dominante inclinada + la estrella, ampliada. El isotipo completo (cordón entero) se dispersa a 16–32 px; el favicon toma solo el gesto esencial para que sobreviva al tamaño mínimo.
- **El nombre: "North Studio", sin guion** (validado). El guion era un artefacto técnico/varsity; su ausencia deja respirar el nombre.
- **El isotipo se sostiene solo.** Sin el nombre debe seguir sintiéndose una firma memorable, no la ilustración de un paisaje. El gesto de la cumbre inclinada es lo que lo consigue; se verifica a escala grande y de favicon.
- **La montaña sintetizada, no reducida a ícono.** Se dejó de simplificar de más: el cordón ahora tiene varias cumbres de alturas y pendientes distintas, ritmo irregular y **profundidad mediante caras de luz en negativo** (huecos con `fill-rule="evenodd"` que dejan ver el fondo, evocando la cara iluminada de la roca). El objetivo no es el logo más simple sino el más *propio*: "esa montaña es de North Studio". Sigue siendo síntesis limpia de una montaña real, no ilustración compleja. Alternativas (mismo cordón sin caras; cluster de torres tipo granito patagónico) exploradas en la hoja de contacto.
- **Favicon simplificado:** el recorte de favicon usa una versión sin caras de luz (a 16–32 px el detalle interno se pierde); toma cumbre dominante + vecinas + destello.
- **Asimetría observada:** nada centrado por reflejo; el ritmo desigual entre cumbres da naturalidad.

### 6.4 Lo que queda abierto a tu validación

- **Proporción del destello:** equilibrado (recomendado) vs. rayos largos/finos vs. eje vertical dominante. Hoja de contacto.
- **Riqueza de la montaña:** cordón con caras de luz (recomendado, cercano a la referencia del usuario) vs. mismo cordón sin caras vs. torres gemelas. Nota: las caras de luz se validan al render — se ejecutan a ciegas en esta etapa.
- **Silueta llena vs. línea fina:** recomiendo la llena. Se produce la de línea solo si se pide comparar.

Cerrado: el nombre es **"North Studio"** sin guion.

> Nota técnica de producción: el nombre usa `<text>` con la serif y fallback de sistema para esta etapa. En implementación se **convierte a trazos (outlines)** para no depender de la fuente instalada. Es una decisión de producción, no de identidad.

---

## 7. Cómo esto se vuelve tokens (handoff a Setup Técnico)

Sin implementar nada, este sistema está listo para tokenizarse:

- **Color:** custom properties en OKLCH, dos temas (`papel` / `noche`), con los nombres de token de §2.
- **Tipografía:** dos familias variables self-host + mono de sistema; escala, pesos, tracking e interlineado de §1 como tokens.
- **Espacio:** escala base-8 de §3.2 como tokens de spacing; tokens de "descanso" para inter-sección.
- **Motion:** tokens de duración (≈400–700ms) y una sola curva ease-out; guard de `prefers-reduced-motion`.
- **Marca:** SVGs de `/brand`, con la opción de migrar `fill`/`stroke` a `currentColor` para que el logo herede el color del tema.

Nada de esto adelanta arquitectura de secciones, sitemap ni elección de librerías: eso pertenece a bloques posteriores.
