import { es } from "./dictionaries/es";
import { en } from "./dictionaries/en";
import type { Locale } from "./locales";

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type Dictionary = typeof es;

function mergeWithFallback<T extends object>(base: T, override: DeepPartial<T>): T {
  const result = { ...base };
  for (const key in override) {
    const overrideValue = override[key];
    const baseValue = base[key];
    if (Array.isArray(overrideValue)) {
      // Una secuencia se traduce entera o no se traduce: mezclarla por índice
      // dejaría pasajes a medio idioma. Reemplaza; si falta, queda la de ES.
      result[key] = overrideValue as T[Extract<keyof T, string>];
    } else if (
      overrideValue &&
      typeof overrideValue === "object" &&
      baseValue &&
      typeof baseValue === "object"
    ) {
      result[key] = mergeWithFallback(
        baseValue as object,
        overrideValue as DeepPartial<object>
      ) as T[Extract<keyof T, string>];
    } else if (overrideValue !== undefined) {
      result[key] = overrideValue as T[Extract<keyof T, string>];
    }
  }
  return result;
}

/**
 * ES es la fuente de verdad. EN se compone sobre ES: toda clave que falte
 * en `en` cae silenciosamente en el valor de `es` (nunca un hueco ni un
 * "translation missing" — experience-architecture.md §6).
 */
export function getDictionary(locale: Locale): Dictionary {
  if (locale === "en") {
    return mergeWithFallback(es, en);
  }
  return es;
}
