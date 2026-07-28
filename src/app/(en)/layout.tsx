import type { ReactNode } from "react";
import { RootShell } from "@/components/root-shell";

export default function EnLayout({ children }: { children: ReactNode }) {
  return <RootShell locale="en">{children}</RootShell>;
}
