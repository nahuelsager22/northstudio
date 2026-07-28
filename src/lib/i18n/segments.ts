/**
 * Fragmento de copy con su intención tipográfica adentro del contenido.
 * El énfasis es itálica (art-direction.md §1.5): vive en el dato, no en el
 * markup, para que editar o traducir un pasaje no obligue a tocar la interfaz.
 */
export type Segmento = {
  texto: string;
  enfasis?: boolean;
};
