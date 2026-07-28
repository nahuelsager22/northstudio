import type { MetadataRoute } from "next";
import { urlDelSitio } from "@/lib/sitio";

/** Nada que esconder: se permite todo y se apunta al sitemap. Los borradores ya se protegen solos con `noindex`. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${urlDelSitio}/sitemap.xml`,
  };
}
