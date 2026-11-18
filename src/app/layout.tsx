import type { Metadata, Viewport } from "next"
import { Archivo, Newsreader, Noto_Nastaliq_Urdu, Noto_Sans } from "next/font/google"
import type { ReactNode } from "react"
import "./globals.css"
import "./styles/chrome.css"
import "./styles/stage.css"
import "./styles/sections.css"
import Footer from "@/lib/components/footer"
import Navbar from "@/lib/components/navbar"
import { chambers, site } from "@/lib/data/site"
import { languageBootScript } from "@/lib/i18n/languages"
import TranslationRuntime from "@/lib/i18n/runtime"
import GateCurtain from "@/lib/motion/gate-curtain"
import MotionRoot from "@/lib/motion/motion-root"

// One family carries the street: condensed for signs, normal width for reading.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
})

// The human voice: quotes, questions and headlines people actually said.
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["italic"],
  axes: ["opsz"],
  variable: "--font-newsreader",
  display: "swap",
})

// Translations: Archivo and Newsreader cover Latin only. These fill in Greek,
// Cyrillic and Urdu glyph by glyph (unicode-range), so they download only when
// a page is actually shown in one of those languages. Noto Sans has a width
// axis, so Greek and Russian headlines stay condensed like the English ones.
const notoSans = Noto_Sans({
  subsets: ["cyrillic", "greek"],
  axes: ["wdth"],
  variable: "--font-noto",
  display: "swap",
  preload: false,
})

const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  variable: "--font-nastaliq",
  display: "swap",
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Guidance and resources`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  applicationName: site.shortName,
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    title: site.name,
    description: site.description,
    url: site.url,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Are you a small business? We are here to help you. NYC Small Business Resource Network." }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: ["/og.png"],
  },
}

export const viewport: Viewport = {
  themeColor: "#101823",
  width: "device-width",
  initialScale: 1,
}

/**
 * Runs before first paint. `js` marks that scripts are available; `motion`
 * switches on animated initial states only when the visitor has not asked
 * for reduced motion. If the app bundle never arrives, `motion` is removed
 * again so nothing stays hidden.
 */
const flags = `(function(){var d=document.documentElement;d.classList.add('js');try{if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('motion');setTimeout(function(){if(!window.__sbrn)d.classList.remove('motion')},4000)}}catch(e){}})()`

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  alternateName: site.shortName,
  url: site.url,
  email: site.email,
  description: site.description,
  logo: `${site.url}/media/brand/logo-mark.webp`,
  areaServed: { "@type": "City", name: "New York" },
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: "Brooklyn",
    addressRegion: "NY",
    postalCode: "11232",
    addressCountry: "US",
  },
  member: chambers.map((c) => ({ "@type": "Organization", name: c.name, url: c.url })),
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${newsreader.variable} ${notoSans.variable} ${nastaliq.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: flags }} />
        <script dangerouslySetInnerHTML={{ __html: languageBootScript }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Navbar />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <GateCurtain />
        <MotionRoot />
        <TranslationRuntime />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  )
}
