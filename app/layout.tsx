import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

/* One family, display through caption — the layout reference sets its whole
   page in a single tight grotesque, and the wordmark only reads as a wordmark
   because the body underneath it is the same letterforms.
   Self-hosted by next/font — no render-blocking Google Fonts request (NFR-3). */
const grotesk = Instrument_Sans({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Merch HQ — Merch, handled.",
  description:
    "We design and make the merch, then give your club or company its own storefront so your people order and pay for it themselves.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${grotesk.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
