import type { Metadata } from "next"
import Image from "next/image"
import ConnectBand from "@/lib/components/connect-band"
import PageHeader from "@/lib/components/page-header"
import { Arrow, Lines } from "@/lib/components/ui"
import { about, chambers, mailto, partners } from "@/lib/data/site"

export const metadata: Metadata = {
  title: "Who we are",
  description:
    "A public-private partnership of New York City's five borough Chambers of Commerce, built to give small businesses personalized guidance as they open and reopen.",
}

export default function AboutPage() {
  return (
    <>
      <PageHeader
        kicker="The Network"
        title={["Who", "we are"]}
        lead={about.paragraphs[0]}
        aside={
          <dl className="phead__facts">
            {about.facts.map((f) => (
              <div key={f.label}>
                <dd className="display tnum">
                  {f.value.toLocaleString("en-US")}
                  {f.suffix}
                </dd>
                <dt className="label">{f.label}</dt>
              </div>
            ))}
          </dl>
        }
      />

      <section className="story section-pad" data-tone="day" aria-labelledby="story-h">
        <div className="wrap grid12">
          <figure className="story__art" data-reveal="">
            <Image
              src="/media/brand/storefront-illustration.webp"
              alt="Illustration of a shop owner standing beside a storefront with a striped awning"
              width={556}
              height={556}
              sizes="(max-width: 860px) 70vw, 30vw"
            />
          </figure>
          <div className="story__copy">
            <Lines id="story-h" as="h2" className="voice story__h" lines={["Serving the small businesses", "that make New York, New York."]} />
            <div className="prose story__text" data-reveal="">
              <p className="story__lead">{about.paragraphs[1]}</p>
              <p>{about.paragraphs[2]}</p>
              <p>{about.paragraphs[3]}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="chambers section-pad" data-tone="night" aria-labelledby="chambers-h">
        <div className="wrap">
          <div className="chambers__top">
            <Lines id="chambers-h" as="h2" className="display chambers__h" lines={["Five Chambers.", "One Network."]} />
            <Image
              src="/media/partners/chambers-strip.webp"
              alt="Logos of the Bronx, Brooklyn, Manhattan, Queens and Staten Island Chambers of Commerce"
              width={879}
              height={110}
              sizes="(max-width: 860px) 90vw, 36rem"
              className="chambers__logos"
              data-reveal=""
            />
          </div>
          <ul className="chambers__list">
            {chambers.map((c, i) => (
              <li key={c.id} className="chamber" data-reveal="" style={{ ["--d" as string]: `${i * 60}ms` }}>
                <span className="display chamber__borough">{c.borough}</span>
                <span className="chamber__name">{c.name}</span>
                <a className="chamber__link" href={mailto(c.email)}>
                  {c.email}
                </a>
                <a className="chamber__site" href={c.url} target="_blank" rel="noopener noreferrer" aria-label={`${c.name} website`}>
                  <span>Website</span>
                  <Arrow dir="out" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="partners section-pad" data-tone="concrete" aria-labelledby="partners-h">
        <div className="wrap grid12">
          <div className="partners__head">
            <h2 id="partners-h" className="label partners__label" data-reveal="">
              Our partners
            </h2>
            <p className="voice partners__lead" data-reveal="">
              A public-private partnership, launched in the wake of COVID-19.
            </p>
          </div>
          <div className="partners__cols">
            <div data-reveal="">
              <h3 className="label partners__h">Launched and funded by</h3>
              <ul className="partners__list">
                {partners.funding.map((p) => (
                  <li key={p.name}>
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="partner">
                      <span className="partner__name">{p.name}</span>
                      {p.role ? <span className="partner__role">{p.role}</span> : null}
                      <Arrow dir="out" className="partner__go" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div data-reveal="" style={{ ["--d" as string]: "120ms" }}>
              <h3 className="label partners__h">In collaboration with</h3>
              <ul className="partners__list">
                {partners.collaboration.map((p) => (
                  <li key={p.name}>
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="partner">
                      <span className="partner__name">{p.name}</span>
                      <Arrow dir="out" className="partner__go" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <ConnectBand />
    </>
  )
}
