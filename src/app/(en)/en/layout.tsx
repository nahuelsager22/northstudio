import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { urlDelSitio } from "@/lib/sitio";

const dict = getDictionary("en");

export const metadata: Metadata = {
  metadataBase: new URL(urlDelSitio),
  title: dict.meta.title,
  description: dict.meta.description,
  alternates: {
    canonical: "/en",
    languages: { es: "/", en: "/en" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["es_AR"],
    url: "/en",
    siteName: dict.meta.title,
    title: dict.meta.title,
    description: dict.meta.description,
  },
  twitter: { card: "summary_large_image" },
};

export default function EnSegmentLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
