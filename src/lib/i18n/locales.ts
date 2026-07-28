export const locales = ["es", "en"] as const;

export type Locale = (typeof locales)[number];

/** ES es la fuente de verdad (experience-architecture.md §6). */
export const defaultLocale: Locale = "es";
