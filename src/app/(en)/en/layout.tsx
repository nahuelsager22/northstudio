import type { ReactNode } from "react";
import { metadataDe } from "@/lib/metadata";

export const metadata = metadataDe({ locale: "en", rutas: { es: "/", en: "/en" } });

export default function EnSegmentLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
