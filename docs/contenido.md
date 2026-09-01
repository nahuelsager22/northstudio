# Contenido y proyectos

Cómo se modela, se carga y se traduce el contenido. Esquema en `src/lib/content/types.ts`, loader en `src/lib/content/proyectos/index.ts`, intérprete en `src/components/proyecto/`.

**La consecuencia operativa que gobierna todo:** sumar un trabajo es sumar un archivo de datos. La interfaz no cambia.

---

## 1. Dónde vive el contenido

Objetos TypeScript locales, un archivo por proyecto en `src/lib/content/proyectos/`. Sin CMS: el volumen es bajo y crece lento, lo autoría el propio estudio, y el compilador es el validador de esquema sin necesidad de una librería de validación en runtime.

El copy de la interfaz es otra cosa y vive aparte, en los diccionarios (§4).

---

## 2. Esquema de un proyecto

Un proyecto no es una plantilla con huecos: es **un núcleo estable de metadatos + un cuerpo flexible de bloques ordenados**.

**Núcleo:** `slug`, `estado` (`borrador` | `publicado`), `orden`, `destacado?`, `persona`, `descriptor?`, `año?`, `rol?`, `colaboradores?`, `enlaceVivo?`, `portada?`, `clima?`, `esEnsayo?`.

- **`descriptor`** se escribe como identidad, no como rubro. No "sitio para cocinera" sino qué la hace única.
- **`rol` es traducible** (`CampoLocalizado[]`). Empezó siendo compartido entre idiomas y con contenido real se vio que no lo es: "Arquitectura técnica e implementación" no se lee en inglés. Un metadato que es una frase pertenece a los campos traducibles.
- **`Media` exige `ancho` y `alto`.** Sin ellos el navegador no puede reservar el lugar de la imagen y el texto salta al cargar. No se puede sumar un medio sin saber qué tamaño tiene.

---

## 3. El cuerpo — seis bloques tipados

La interfaz sabe leer seis tipos; **el orden, la cantidad y la combinación los define el dato.** Ahí nace la variación entre identidades sin romper la mantenibilidad: no se programa un layout nuevo por proyecto, se compone una secuencia distinta con las mismas piezas.

| Tipo | Qué es | Cómo se compone |
|---|---|---|
| `texto` | La prosa del caso | Serif a medida de lectura, columna al 16 %. Párrafos separados por línea en blanco; énfasis con `*asteriscos*` → itálica |
| `media` | Una imagen o video a plena atención | Proporción natural, sin recortar. Márgenes porcentuales que suman 16 % y **alternan** entre medios consecutivos |
| `par` | Dos medios en relación | El **único** lugar donde dos elementos comparten formato exacto |
| `cita` | La voz de la persona representada | Entra más adentro que ningún otro bloque (28 %), sin comillas decorativas |
| `dato` | El hecho que el proyecto quiso decir en voz alta | Único bloque con hairline encima, usada como notación y no como divisor |
| `pausa` | Silencio deliberado | No muestra nada y es el que más decide. `aria-hidden` |

Cuatro reglas que ya costaron una corrección:

- **Una `pausa` reemplaza el ritmo por defecto, no se suma a él.** Ni ella ni el bloque siguiente llevan el margen normal; si no, escribir una pausa da un salto doble y el dato deja de controlar el ritmo. Vale como regla general: un dato que modula un sistema tiene que poder apagar lo que el sistema hacía sin él.
- **Un medio no se recorta.** Un recorte que nadie pidió es una opinión sobre el trabajo ajeno. La excepción es `par`, donde comparar exige igualdad de condiciones — y ahí `foco` decide qué sobrevive.
- **Los márgenes de `media` alternan** porque varias imágenes con el mismo borde izquierdo dejan de leerse como composición y pasan a leerse como columna.
- **La `cita` no lleva comillas decorativas.** Agregarlas es ponerle énfasis a la voz de otro.

**`clima` — dos perillas, ninguna más.** `ritmo: "pausado"` sube el aire entre bloques un escalón; `acentoPolar` hace que el único punto de orientación de la página tome el acento. No hay tema, paleta, tipografía ni layout por proyecto: si un proyecto necesitara romper el sistema para sentirse distinto, sería lucimiento.

---

## 4. i18n

ES es la fuente de verdad; EN es su paralelo. **El idioma cambia las palabras, nunca el recorrido.**

Sin librería de i18n: dos árboles de rutas reales y diccionarios tipados. El sitemap asimétrico (`/proyectos/…` ↔ `/en/work/…`) ya no encaja con el patrón `[locale]` de esas librerías, y con dos locales fijos no hay negociación que resolver.

- **Diccionarios** en `src/lib/i18n/dictionaries/{es,en}.ts`. `en` es un `DeepPartial` de `es`; `get-dictionary.ts` hace merge profundo con **fallback silencioso clave por clave**. Nunca se muestra un hueco ni un "translation missing".
- **Los arrays son atómicos en el merge.** Una secuencia se traduce entera o cae entera a ES; mezclarlos por índice dejaría pasajes a medio idioma.
- **Contenido traducible** vía `CampoLocalizado` (`{ es, en? }`), resuelto con `resolverCampo()` — mismo principio de fallback. Media, año y slug no se duplican.
- **El énfasis vive en el dato.** El tipo `Segmento` es una lista de fragmentos, cada uno con `enfasis?` opcional que se renderiza en itálica. La intención tipográfica vive en el contenido y no en el markup, así traducir un pasaje no obliga a tocar una vista.
- **Los ids de sección viven en el código** (`src/lib/i18n/secciones.ts`), no en los diccionarios: sólo el nombre visible se traduce, para que traducir no pueda desincronizar un ancla.

---

## 5. Visibilidad de un borrador — tres capas distintas

1. **El trabajo lista sólo `publicado`.**
2. **Un borrador resuelve por URL directa, y lo dice.** El estudio necesita mirar un caso en su lugar real antes de publicarlo. No se lista, no se prerenderiza (`generateStaticParams` devuelve sólo slugs publicados), su página declara `robots: noindex, nofollow` y **escribe en la propia página que es un borrador** — enseñar algo sin publicar y callarlo sería fingir estado.
3. **Un ensayo no existe en producción.** `esEnsayo: true` y el loader lo excluye cuando `NODE_ENV === "production"`: no hay ruta, no hay slug, no hay forma de llegar. El mecanismo se conserva aunque hoy no haya ningún ensayo cargado.

**Un slug inexistente es un 404 real.** Responder 200 con "este proyecto no está publicado" le miente a los buscadores sobre una página que no existe.

---

## 6. Cómo se suma un proyecto

1. Crear `src/lib/content/proyectos/<slug>.ts` exportando un `Proyecto`.
2. Agregarlo al array de `src/lib/content/proyectos/index.ts`.
3. Poner los medios en `public/images/` con sus dimensiones reales en el dato.
4. Escribir el cuerpo como secuencia de bloques. **El protagonista es la persona, nunca el estudio.**
5. Mientras falte material, dejarlo en `estado: "borrador"` y mirarlo por URL directa.

Nada más. No hay interfaz que tocar.
