import Link from "next/link"
import { cta, nav, site } from "@/lib/data/site"
import { Btn } from "./ui"

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer footer--editorial" data-tone="night">
      <div className="footer__scene">
        <div className="wrap footer__top">
          <div className="footer__identity">
            <Link href="/" className="footer__brand" aria-label="NYC Small Business Resource Network home">
              <span className="display footer__nyc" translate="no">NYC</span>
              <span className="display footer__name" translate="no">Small Business<br />Resource Network</span>
            </Link>
          </div>
          <div className="footer__cta">
            <p className="label">Get started</p>
            <p className="voice footer__line">Your business has a place here.</p>
            <Btn href={cta.href}>{cta.label}</Btn>
          </div>
        </div>
      </div>
      <div className="wrap footer__links">
        <nav aria-label="Footer pages">
          <ul><li><Link href="/">Home</Link></li>{nav.map(item => <li key={item.href}><Link href={item.href}>{item.label}</Link></li>)}<li><Link href={cta.href}>{cta.label}</Link></li></ul>
        </nav>
        <a href={`mailto:${site.email}`}>{site.email}</a>
      </div>
      <div className="wrap footer__base">
        <p>&copy; {year} {site.name}</p>
        <div className="footer__fine"><Link href="/privacy-policy">Privacy Policy</Link><Link href="/terms-of-service">Terms of Service</Link><a href="https://novusnyc.org" target="_blank" rel="noreferrer">Made by Novus</a></div>
      </div>
    </footer>
  )
}
