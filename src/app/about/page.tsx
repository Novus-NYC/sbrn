import type { Metadata } from "next"
import Image from "next/image"
import ConnectBand from "@/lib/components/connect-band"
import PageHeader from "@/lib/components/page-header"
import { Arrow, ArrowLink, Lines } from "@/lib/components/ui"
import { about, brooklynBurgersPhoto, chambers, mailto, partners } from "@/lib/data/site"

const skyline = "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/70/Lower_Manhattan_Skyline_2024.jpg/3840px-Lower_Manhattan_Skyline_2024.jpg"

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
        heroImage={{ src: skyline, alt: "Lower Manhattan skyline photographed from Pier 57 in 2024", credit: "Kidfly182, CC BY 4.0", source: "https://commons.wikimedia.org/wiki/File:Lower_Manhattan_Skyline_2024.jpg" }}
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
          <div className="story__copy">
            <h2 id="story-h" className="voice story__h" data-reveal="">
              Serving the small businesses that make New York, New York.
            </h2>
            <div className="prose story__text" data-reveal="">
              <p className="story__lead">{about.paragraphs[1]}</p>
              <p>{about.paragraphs[2]}</p>
              <p>{about.paragraphs[3]}</p>
            </div>
          </div>
          <figure className="story__art" data-reveal="">
            <Image {...brooklynBurgersPhoto} sizes="(max-width: 860px) 92vw, 46vw" />
            <figcaption>
              <span>Brooklyn Burgers &amp; Beer, Park Slope</span>
              <ArrowLink href="/stories#brooklyn-burgers-and-beer">Read their story</ArrowLink>
            </figcaption>
          </figure>
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
