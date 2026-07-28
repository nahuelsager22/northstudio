import type { ReactNode } from "react";
import Script from "next/script";
import { newsreader, monaSans } from "@/lib/fonts";
import { themeInitScript } from "@/lib/theme";
import { motionInitScript } from "@/lib/motion";
import type { Locale } from "@/lib/i18n/locales";
import "@/app/globals.css";

/**
 * Shell compartido por los dos root layouts (ES sin prefijo, EN bajo /en —
 * ver experience-architecture.md §3). Cada grupo de rutas define su propio
 * <html lang>, por eso esto no es un layout.tsx: es la pieza que ambos importan.
 */
export function RootShell({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <html
      lang={locale}
      className={`${newsreader.variable} ${monaSans.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        {/* Aplica un data-theme guardado antes del primer paint; sin eso, manda prefers-color-scheme.
            beforeInteractive es válido acá: es el root layout de App Router, el único lugar
            (junto a pages/_document) que la propia documentación de Next.js habilita para esto. */}
        {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        {/* Marca que hay JS antes del primer paint: sin esto, el estado oculto
            del revelado no se aplica y el recorrido se ve entero igual. */}
        {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
        <Script id="motion-init" strategy="beforeInteractive">
          {motionInitScript}
        </Script>
        {children}
      </body>
    </html>
  );
}
