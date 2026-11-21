import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Hanken_Grotesk } from "next/font/google";
import { Providers } from "@/components/motion/Providers";
import { profile, site } from "@/content/portfolio";
import { siteUrl } from "@/lib/site-url";
import "lenis/dist/lenis.css";
import "./globals.css";

// Display serif (regular + italic) for headlines, a clean grotesk for text.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: site.title, template: `%s | ${profile.name}` },
  description: site.description,
  keywords: site.keywords,
  authors: [{ name: profile.name, url: profile.github.url }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: profile.name,
    title: site.title,
    description: site.description,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0a",
  colorScheme: "dark light",
};

// Runs before first paint. The site is designed dark-first, so dark is the
// default; a visitor's saved choice from the toggle wins.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");document.documentElement.dataset.theme=t==="light"?"light":"dark"}catch(e){document.documentElement.dataset.theme="dark"}})()`;

// Without JavaScript, scroll-reveal content would stay hidden; show it.
const noScriptStyles = `<style>[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}</style>`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${hanken.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <noscript dangerouslySetInnerHTML={{ __html: noScriptStyles }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-text px-5 py-3 text-sm text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
