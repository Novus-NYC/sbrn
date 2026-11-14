import type { Metadata } from "next"
import Image from "next/image"
import PageHeader from "@/lib/components/page-header"
import { Arrow, ArrowLink, Btn, Lines } from "@/lib/components/ui"
import { ask, chambers, connect, mailto, site } from "@/lib/data/site"

export const metadata: Metadata = {
  title: "Connect with us",
  description:
    "Submit your business profile to the NYC Small Business Resource Network, or write directly to the Chamber of Commerce in your borough.",
}

const MAP_W = 2800
const MAP_H = 1010

export default function ConnectPage() {
  return (
    <>
      <PageHeader kicker="Start here" title={["Connect", "with us"]} lead={connect.text} tone="coral">
        <Btn href={site.profileFormUrl} variant="ink">
          {connect.formLabel}
        </Btn>
      </PageHeader>

      {/* ---- pick your borough: hovering a Chamber lights its pin (CSS :has, no script) ---- */}
      <section className="reach section-pad" data-tone="day" aria-labelledby="reach-h">
        <div className="wrap grid12">
          <div className="reach__mapcol">
            <div className="reach__map" aria-hidden="true">
              <div className="reach__canvas">
                <Image src="/media/brand/nyc-street-map.webp" alt="" width={MAP_W} height={MAP_H} sizes="(max-width: 860px) 100vw, 60vw" quality={60} />
                {chambers.map((c) => (
                  <span key={c.id} className={`reach__pin reach__pin--${c.id}`} style={{ left: `${c.pin.x}%`, top: `${c.pin.y}%` }} />
                ))}
              </div>
            </div>
          </div>

          <div className="reach__list">
            <h2 id="reach-h" className="voice reach__h" data-reveal="">
              {connect.chamberNote.replace(/:$/, ".")}
            </h2>
            <ul>
              {chambers.map((c, i) => (
                <li key={c.id} id={c.id} className={`door door--${c.id}`} data-reveal="" style={{ ["--d" as string]: `${i * 60}ms` }}>
                  <h3 className="display door__borough">{c.borough}</h3>
                  <p className="door__name">{c.name}</p>
                  <div className="door__actions">
                    <a className="door__mail" href={mailto(c.email)}>
                      <span className="label">Write to</span>
                      <span className="door__addr">{c.email}</span>
                      <Arrow className="door__go" />
                    </a>
                    <a className="door__site" href={c.url} target="_blank" rel="noopener noreferrer" aria-label={`${c.name} website`}>
                      <span className="label">Website</span>
                      <Arrow dir="out" />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="helpdesk section-pad" data-tone="night" aria-labelledby="help-h">
        <div className="wrap grid12">
          <div className="helpdesk__q">
            <p className="label helpdesk__tag" data-reveal="">
              The kind of thing people ask
            </p>
            <Lines id="help-h" as="h2" className="voice helpdesk__h" lines={[`“${ask.question}”`]} />
            <p className="helpdesk__a" data-reveal="">
              {ask.answer}
            </p>
          </div>
          <div className="helpdesk__side" data-reveal="" style={{ ["--d" as string]: "140ms" }}>
            <h3 className="label">General inquiries</h3>
            <a className="ulink helpdesk__mail" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <address className="helpdesk__addr">
              {site.name}
              <br />
              {site.address.careOf}
              <br />
              {site.address.street}
              <br />
              {site.address.city}
            </address>
            <ArrowLink href="/stories">See who we have helped</ArrowLink>
          </div>
        </div>
      </section>
    </>
  )
}
