/**
 * Esquema de proyecto (experience-architecture.md §5).
 * Núcleo de metadatos estables + cuerpo de bloques tipados ordenables.
 * Sumar un trabajo = sumar un dato; la interfaz no cambia.
 */

/** Campo traducible: ES fuente de verdad, EN paralelo opcional (fallback silencioso a ES). */
export type CampoLocalizado = {
  es: string;
  en?: string;
};

export type EstadoProyecto = "borrador" | "publicado";

export type TipoMedia = "imagen" | "video";

export type Media = {
  src: string;
  /** Obligatorio — la accesibilidad es una forma de atención (art-direction.md §2.3). */
  alt: CampoLocalizado;
  credito?: string;
  tipo: TipoMedia;
  /**
   * Dimensiones naturales del archivo. Obligatorias: sin ellas el navegador no
   * puede reservar el lugar de la imagen y el texto salta al cargar — un salto
   * es exactamente lo contrario de la calma. No se puede sumar un medio sin
   * saber qué tamaño tiene.
   */
  ancho: number;
  alto: number;
  /** object-position: qué sobrevive cuando el formato obliga a recortar. */
  foco?: string;
};

export type BloqueTexto = {
  tipo: "texto";
  contenido: CampoLocalizado;
};

export type BloqueMedia = {
  tipo: "media";
  media: Media;
};

export type BloquePar = {
  tipo: "par";
  medios: [Media, Media];
};

export type BloqueCita = {
  tipo: "cita";
  texto: CampoLocalizado;
  /** La voz de la persona representada, no la del estudio. */
  atribucion?: string;
};

export type BloqueDato = {
  tipo: "dato";
  etiqueta: CampoLocalizado;
  valor: CampoLocalizado;
};

export type BloquePausa = {
  tipo: "pausa";
  /** Referencia a los tokens de descanso (--spacing-rest / --spacing-rest-lg). */
  tamaño?: "rest" | "rest-lg";
};

export type BloqueProyecto =
  | BloqueTexto
  | BloqueMedia
  | BloquePar
  | BloqueCita
  | BloqueDato
  | BloquePausa;

/** Guiño de matiz dentro del sistema visual — nunca un tema nuevo (experience-architecture.md §5.3). */
export type Clima = {
  acentoPolar?: boolean;
  ritmo?: "pausado" | "regular";
};

export type Proyecto = {
  slug: string;
  estado: EstadoProyecto;
  /**
   * Entrada de ensayo: material de composición, no un caso. Existe para mirar
   * cómo se comporta el sistema con contenido real de prueba y nunca llega a
   * producción (el loader la excluye). Marcarla es parte de la honestidad:
   * el dato dice lo que es, no hace falta recordarlo.
   */
  esEnsayo?: true;
  orden: number;
  destacado?: boolean;
  /** Nombre de quien el proyecto representa. No una categoría. */
  persona: string;
  /** Qué es, dicho como identidad — no como rubro. Copy final, no se inventa. */
  descriptor?: CampoLocalizado;
  año?: number;
  /**
   * Qué hizo North Studio. Honesto, sin inflar.
   *
   * Traducible: `experience-architecture.md` §6 lo daba por compartido entre
   * idiomas ("rol como estructura"), y con contenido real se vio que no lo es —
   * "Arquitectura técnica e implementación" no se lee en inglés. Un metadato que
   * es una frase pertenece a los campos traducibles, no a los compartidos.
   */
  rol?: CampoLocalizado[];
  colaboradores?: string[];
  enlaceVivo?: string;
  portada?: Media;
  clima?: Clima;
  cuerpo: BloqueProyecto[];
};

/** Resuelve un campo traducible con fallback silencioso a ES. */
export function resolverCampo(campo: CampoLocalizado, locale: "es" | "en"): string {
  if (locale === "en") {
    return campo.en ?? campo.es;
  }
  return campo.es;
}
