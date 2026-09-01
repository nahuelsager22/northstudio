/**
 * Rate limiting básico, en memoria. Anti-spam sin fricción: el visitante no
 * demuestra que es humano (prohibido el CAPTCHA — hacerle rendir un examen a
 * quien viene a hablar es exactamente lo contrario de escuchar). El límite lo
 * lleva el servidor, en silencio.
 *
 * Deliberadamente sin dependencias ni almacenamiento externo: es una defensa
 * proporcional al problema. Su alcance real —una instancia, memoria viva— está
 * documentado en `docs/contacto.md`: no pretende ser una barrera dura, solo
 * evitar que un mismo origen dispare envíos en cadena.
 */

const VENTANA_MS = 10 * 60 * 1000;
const MAXIMO_POR_VENTANA = 3;
/** Por encima de esto se purga: la memoria tampoco se acumula sola. */
const CLAVES_ANTES_DE_PURGAR = 500;

const registro = new Map<string, number[]>();

function purgar(ahora: number) {
  for (const [clave, marcas] of registro) {
    const vigentes = marcas.filter((marca) => ahora - marca < VENTANA_MS);
    if (vigentes.length === 0) registro.delete(clave);
    else registro.set(clave, vigentes);
  }
}

/**
 * Consume un turno para esa clave. Se llama recién cuando el mensaje ya es
 * válido y está por salir: equivocarse en una letra del email no gasta el cupo
 * de nadie.
 */
export function consumirTurno(clave: string, ahora = Date.now()): boolean {
  const vigentes = (registro.get(clave) ?? []).filter(
    (marca) => ahora - marca < VENTANA_MS
  );

  if (vigentes.length >= MAXIMO_POR_VENTANA) {
    registro.set(clave, vigentes);
    return false;
  }

  vigentes.push(ahora);
  registro.set(clave, vigentes);
  if (registro.size > CLAVES_ANTES_DE_PURGAR) purgar(ahora);
  return true;
}
