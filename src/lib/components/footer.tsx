import Link from "next/link"
import { chambers, cta, nav, site } from "@/lib/data/site"
import { Btn, Roll } from "./ui"

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer" data-tone="night">
      <div className="wrap footer__top">
        <div className="footer__lockup">
          <p className="footer__nyc display" aria-hidden="true">
            NYC
          </p>
          <p className="footer__name display">
            <span>Small Business</span>
            <span>Resource Network</span>
          </p>
        </div>
        <div className="footer__cta">
          <p className="voice footer__line">Tell us what you need.</p>
          <Btn href={cta.href}>{cta.label}</Btn>
        </div>
      </div>

      <div className="wrap footer__cols">
        <div>
          <h2 className="label footer__h">Find us</h2>
          <address className="footer__addr">
            {site.name}
            <br />
            {site.address.careOf}
            <br />
            {site.address.street}
            <br />
            {site.address.city}
          </address>
          <a className="ulink footer__mail" href={`mailto:${site.email}`}>
            Email the Network
          </a>
        </div>

        <nav aria-label="Footer">
          <h2 className="label footer__h">Pages</h2>
          <ul className="footer__list">
            <li>
              <Link href="/">
                <Roll>Home</Roll>
              </Link>
            </li>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <Roll>{item.label}</Roll>
                </Link>
              </li>
            ))}
            <li>
              <Link href={cta.href}>
                <Roll>{cta.label}</Roll>
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="label footer__h">Your borough&rsquo;s Chamber</h2>
          <ul className="footer__list">
            {chambers.map((c) => (
              <li key={c.id}>
                <a href={c.url} target="_blank" rel="noopener noreferrer">
                  <Roll>{c.borough}</Roll>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="label footer__h">Fine print</h2>
          <ul className="footer__list">
            <li>
              <Link href="/privacy-policy">
                <Roll>Privacy Policy</Roll>
              </Link>
            </li>
            <li>
              <Link href="/terms-of-service">
                <Roll>Terms of Service</Roll>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="wrap footer__base">
        <p>
          &copy; {year} {site.name}
        </p>
        <a className="ulink" href="https://novusnyc.org" target="_blank" rel="noopener noreferrer">
          Made by Novus
        </a>
      </div>
    </footer>
  )
}
