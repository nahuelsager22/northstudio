# El recorrido

Cómo está construido el lugar: qué momentos lo componen, en qué orden, cómo se navega y qué rutas existen. Implementado en `src/app/(es)/page.tsx`, `src/app/(en)/en/page.tsx` y `src/components/momentos/`.

La regla que gobierna todo: **la web no es una colección de secciones, es un lugar que se recorre.** Los momentos no son Home / About / Work / Contact renombrados; nacen de un arco emocional.

---

## 1. Los cuatro momentos

El orden importa y es el resultado de una corrección: **primero se muestra, después se explica.**

| # | Momento | Componente | Intensidad | Ancla |
|---|---|---|---|---|
| 1 | El umbral | `momentos/umbral.tsx` | Contemplativo | — |
| 2 | El trabajo | `momentos/trabajo.tsx` | **Impacto** | `#trabajo` |
| 3 | El estudio | `momentos/estudio.tsx` | Respiración | `#estudio` |
| 4 | La conversación | `momentos/conversacion.tsx` | Cierre | `#contacto` |

**① El umbral.** Pantalla completa, la firma completa y una línea que dice qué hace el estudio. La firma no está centrada ni arriba: se apoya por debajo del centro óptico y desplazada del margen, así entrar es bajar la vista. La transición al momento siguiente es el vacío que sigue — ni flecha ni "scroll para descubrir". Para que ese vacío se lea como decisión y no como final, la página tiene que ser *visiblemente* más alta que la ventana.

**② El trabajo.** Lista editorial de proyectos publicados, no grilla de cards ni slider. Es el punto de mayor intensidad del recorrido, y por eso:

- **sin etiqueta de sección arriba** — un rótulo antes de una imagen a sangre le baja el volumen a lo único que tenía que subirlo;
- **la portada de un proyecto destacado rompe el marco** y se muestra a todo el ancho de la ventana, fuera del paspartú. Es la única vez en todo el sitio que algo desborda el margen, y como es la única, significa;
- **el nombre entra después de la imagen**, en display y sobre el margen editorial: el trabajo se ve antes de saber de quién es.

El ritmo de la lista sale del dato (`destacado`, `clima.ritmo`, el orden), no del capricho. La lista anuncia y no ficha: muestra persona, descriptor y año; la lista de roles completa vive dentro del proyecto.

Si no hay proyectos publicados, el momento se contrae a una línea honesta, **sin etiqueta de sección**. Contraer de verdad es lo que la vuelve honesta; rotular una ausencia es disimularla.

**③ El estudio.** Cinco tiempos y ninguna etiqueta: tesis, puente, qué se hace, colofón de lo que se construye, y remate. Llega **después** del trabajo a propósito — una frase sobre uno mismo se sostiene cuando confirma algo que el visitante ya vio, y suena a promesa cuando lo antecede.

**④ La conversación.** Invitación de una línea y el formulario. Vuelve al margen del umbral: el recorrido cierra donde abrió. Después del formulario no hay nada — sin footer de enlaces, sin "seguinos".

**Un momento más, en ruta propia: un proyecto por dentro.** Ver `docs/contenido.md`.

---

## 2. Navegación

Nav persistente en `src/components/site-nav.tsx`, montada por `site-shell.tsx`.

**No se esconde.** Está siempre, en `muted` y sin banda; recupera la tinta al llegar al tope. Un elemento que se va y vuelve pide ser mirado dos veces.

**Lo que la separa del contenido es un velo, no una placa:** el mismo fondo del lugar disolviéndose en un degradado de 7,5 rem, opaco arriba y nada abajo. Hereda la atmósfera sobre la que se apoya en vez de taparla, y lo que pasa por debajo se intuye sin leerse. Sin blur ni glass — es el color del sitio. Sin esto, el verde a sangre del trabajo cruza entero por detrás de las palabras.

**Los destinos son tres, sin numerar** (`src/lib/i18n/secciones.ts`): Trabajo · Estudio · Contacto. En serif, caja baja, 15 px — el encabezado corriente de una publicación, no una barra. La numeración anterior (`01 · 02 · 03`) prometía un método ordenado y convertía el índice en un catálogo de metodología.

**La sección activa se marca con un punto polar** de 3 px antes de la palabra. Se resuelve por la sección cuyo comienzo quedó más arriba del umbral de lectura (35 % de la ventana): en un scroll continuo varias secciones pueden estar visibles a la vez y "la que está en pantalla" no significa nada.

**El índice sólo existe donde existen las secciones.** En una ruta de proyecto la nav se monta sin él.

**La marca de la nav es el destello solo**, no la firma completa — ver `docs/marca.md`.

---

## 3. El menú móvil

Por debajo de `lg` (1024 px) el índice se reemplaza por un gesto: tres líneas que **se convierten en una N**.

No es un icono que se cambia por otro: son las mismas tres líneas moviéndose a su lugar en la letra. La de arriba y la de abajo rotan a los dos astiles; la del medio rota y se acorta hasta ser la diagonal. Por eso el gesto se siente como *escribir* la inicial del estudio, y usa la misma curva y duración que todo lo demás. Geometría en `globals.css`, clase `.gesto-n`.

El panel abierto es el mismo lugar ocupado por su índice: pantalla completa en `bg` sólido, composición asimétrica, destinos en serif grande. Escape cierra y devuelve el foco al disparador.

**Con el panel abierto el recorrido de atrás se detiene.** El bloqueo es doble y vive junto en `pausarScroll()`: `lenis.stop()` desactiva rueda y táctil, y `overflow: hidden` cubre lo que Lenis no intercepta. Si se separaran, cerrar el panel por un camino podría soltar una mitad y no la otra.

**Cuidado al navegar desde el panel:** el recorrido se suelta **antes** de pedirle que vaya a ningún lado. Un Lenis detenido ignora un `scrollTo`, y esperar al efecto de React dejaba el click sin destino.

---

## 4. Rutas

```
/                     El lugar, en español
/en                   El mismo lugar, en inglés
/proyectos/[slug]     Un proyecto por dentro          [ES]
/en/work/[slug]       El mismo proyecto, en inglés    [EN]
/sitemap.xml  /robots.txt  /icon.svg
```

`(es)` y `(en)` son *route groups*, cada uno con su propio root layout y su `<html lang>` — el patrón de múltiples root layouts de App Router. No hay `[locale]` catch-all porque **el sitemap es asimétrico por diseño**: los segmentos difieren por idioma.

Lo que deliberadamente no existe como ruta: `/about` (la forma de pensar se demuestra en el recorrido), `/servicios` ni `/proceso` (el estudio no vende una lista), índice de proyectos separado (el trabajo vive dentro del recorrido), `/contacto` (es el momento de cierre).

**Metadata.** `metadataBase` sale de `src/lib/sitio.ts`, que deriva la URL del entorno (variable explícita → dominio de producción de Vercel → deploy → localhost). Los dos árboles declaran `alternates.languages` entre sí; sin eso un buscador los ve como dos sitios distintos. El sitemap sale del mismo loader que la interfaz, así que un borrador no aparece.
