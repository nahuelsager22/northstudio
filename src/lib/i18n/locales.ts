export const locales = ["es", "en"] as const;

export type Locale = (typeof locales)[number];

/** ES es la fuente de verdad (docs/contenido.md · i18n). */
export const defaultLocale: Locale = "es";
