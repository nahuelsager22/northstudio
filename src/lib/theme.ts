export type Theme = "papel" | "noche";

export const THEME_STORAGE_KEY = "north-studio-theme";

/**
 * Runs before paint (see ThemeScript) to apply a stored theme override.
 * Without a stored value, `prefers-color-scheme` in globals.css governs the theme.
 */
export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    if (stored === "papel" || stored === "noche") {
      document.documentElement.setAttribute("data-theme", stored);
    }
  } catch (e) {}
})();
`;

export function setTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // localStorage unavailable — theme still applies for this session.
  }
}

export function clearThemeOverride(): void {
  document.documentElement.removeAttribute("data-theme");
  try {
    localStorage.removeItem(THEME_STORAGE_KEY);
  } catch {
    // localStorage unavailable.
  }
}
