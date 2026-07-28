import localFont from "next/font/local";

export const newsreader = localFont({
  src: [
    {
      path: "../assets/fonts/newsreader-latin-wght-normal.woff2",
      style: "normal",
      weight: "200 800",
    },
    {
      path: "../assets/fonts/newsreader-latin-wght-italic.woff2",
      style: "italic",
      weight: "200 800",
    },
  ],
  variable: "--font-newsreader",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const monaSans = localFont({
  src: [
    {
      path: "../assets/fonts/mona-sans-latin-wght-normal.woff2",
      style: "normal",
      weight: "200 900",
    },
  ],
  variable: "--font-mona-sans",
  display: "swap",
  fallback: ["-apple-system", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
});
