# La marca

Qué pieza de la firma va en cada lugar, y por qué. Los SVG canónicos están en `brand/`; los componentes React que los usan, en `src/components/brand/`.

**El encuadre:** el logo es la **firma**, no la identidad. La identidad vive en el sistema — tipografía, composición, ritmo, espacio, motion. Eso libera al logo de la sobre-exigencia y a la vez sube la vara: una firma genérica miente.

---

## 1. La escena

La firma es **una sola escena**, no un ícono al lado de un texto: un cordón montañoso, un destello polar en el cielo a la derecha y "North Studio" en serif, compartiendo horizonte, margen izquierdo, ancho y peso de tinta.

- **El cordón** es una silueta de tinta llena —no un contorno—, con varias cumbres de alturas y pendientes distintas, ritmo irregular y profundidad mediante **caras de luz en negativo** (huecos con `fill-rule="evenodd"` que dejan ver el fondo). No es el logo más simple sino el más propio.
- **El astro** es un destello de 8 puntas: cuatro largas y cuatro cortas. Un gesto de luz, ni estrella de librería ni punto.
- **El gesto propio:** la cumbre dominante se inclina levemente hacia la estrella. La roca se orienta hacia la luz que la guía; eso ata montaña y estrella en una sola idea y hace que el símbolo se sostenga solo.
- **El nombre es "North Studio", sin guion.** El guion era un artefacto técnico.

---

## 2. Qué pieza va dónde

**Ésta es la convención que hay que respetar.** Cada pieza tiene un tamaño donde funciona y un lugar donde le corresponde.

| Pieza | Componente / archivo | Dónde | Por qué |
|---|---|---|---|
| Firma completa | `brand/lockup.tsx` | Sólo el umbral | Es donde tiene protagonismo |
| Destello solo | `brand/destello.tsx` | La nav | Ver abajo |
| Recorte de cumbre | `src/app/icon.svg` | Favicon | A 16–32 px el cordón entero se dispersa |
| Cordón + destello | `brand/perfil/*` | Redes sociales | Ver §3 |

**Por qué el destello solo en la nav.** Repetir montaña y estrella arriba mientras el umbral muestra la firma completa era decir dos veces lo mismo. El destello es la reducción máxima que sigue siendo la marca, lee perfecto a 20 px donde el cordón se dispersa, y **significa lo que hace**: una barra de navegación orienta, y orientar es exactamente para lo que sirve una estrella polar. Se descartó un monograma NS: dos letras no dicen nada que el nombre no diga ya, y competirían con la firma.

**`brand/mark.tsx` (cordón + destello, sin nombre) ya no se usa en ninguna vista.** Se conserva como pieza del sistema, no como componente activo.

---

## 3. Foto de perfil para redes

Se genera con `node scripts/perfil.mjs` y sale a `brand/perfil/` en 1024×1024, cada PNG con su SVG al lado.

**Usa el cordón completo, no el recorte de favicon.** A 1024 px ese recorte se lee como un triángulo con una muesca — la silueta simplificada a ícono que el proyecto descartó por genérica. Una foto de perfil se guarda grande y se mira grande.

**El margen se calcula contra la diagonal, no contra el ancho.** Casi todas las redes recortan en círculo: para un contenido de proporción *r* inscripto en un círculo de radio *R*, el ancho máximo es `2R/√(1+1/r²)`. La primera versión usaba un margen prudente contra el ancho y a 48 px la montaña era una astilla en un disco negro.

**Los colores no se escriben a mano:** el script convierte los mismos valores OKLCH de `globals.css` a sRGB. Si el tema cambia, se corrige el valor en un solo lugar y se regenera.

### Las catorce variantes

Siete composiciones × dos formas: **suelta** (solo la marca) y **firmada** (con "North Studio" debajo).

| Composición | Qué es |
|---|---|
| `noche` | La recomendada. Fondo negro profundo, sin estrellas |
| `noche-cielo` | Cielo discreto: hay que abrir la imagen para verlo |
| `noche-cielo-visible` | Cielo presente: las estrellas se notan sin abrir la imagen |
| `papel` | Para donde el fondo oscuro no funcione |
| `transparente-claro` / `-oscuro` | Sin fondo, para donde la plataforma compone el suyo |
| `destello-noche` | Solo el destello, la marca compacta del navbar |

**La firmada baja la marca de 840 a 750 px de ancho.** Con el nombre debajo, el grupo deja de ser apaisado (2,44:1 → 1,65:1) y en un círculo lo que manda es la diagonal. El nombre mide el 70 % del ancho de la marca y se separa un 26 % de su alto, que son las proporciones del lockup.

**Límite conocido:** el nombre es legible a 300 px, se defiende a 128 y desaparece a 64. Es inevitable en un avatar; por eso la variante suelta sigue siendo la recomendada para feeds y la firmada para la foto de perfil grande.

### El logotipo es un raster, y hay un motivo

`scripts/north-studio-logotipo.png` es "North Studio" en Newsreader real, blanco sobre transparente, a 949 px (~2× el tamaño al que se usa).

**El rasterizador de SVG no ve las fuentes del proyecto.** Son woff2 y no están instaladas en el sistema: un `<text font-family="Newsreader">` cae a un serif genérico —comprobado, y se nota— y `sharp.text({ fontfile })` tampoco lee woff2. Así que el logotipo se rasterizó una vez en el navegador, que sí tiene la fuente cargada, con el mismo tracking del lockup (0,012em). Se guarda como máscara para poder teñirlo con cualquiera de las dos tintas.

Vive en `scripts/` y no en `brand/` porque no es un entregable de marca: es un insumo del generador. Si algún día hay un TTF/OTF de Newsreader a mano, se reemplaza por texto vectorial y el archivo deja de hacer falta.

Los SVG de las variantes firmadas llevan ese logotipo incrustado en base64: es la única forma de que el archivo sea autosuficiente sin depender de tener la fuente instalada.

---

## 4. Detalles de implementación

- Los componentes usan `fill="currentColor"`: un solo componente por variante, heredando el color del tema. No hay versiones claro/oscuro separadas en el código.
- **El favicon es un archivo aparte** porque el navegador lo renderiza fuera del DOM de la página y no puede heredar `data-theme`. Resuelve claro/oscuro con `prefers-color-scheme` embebido en el propio SVG.
- El `Lockup` acepta `sinAstro` para omitir la estrella y que pueda dibujarse en su propia capa (`AstroDeLaFirma`), que es lo que permite el parallax de la firma. **Las dos capas comparten el mismo `viewBox`**, así que la alineación la garantiza la geometría y no un ajuste a ojo.
- Los SVG de `brand/` son el entregable canónico de dirección de arte y la hoja de contacto (`brand/preview.html`). El nombre dentro del lockup usa `<text>`; para producción fuera de la web conviene convertirlo a trazos.
