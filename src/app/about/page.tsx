import type { Metadata } from "next"
import Image from "next/image"
import ChamberDirectory from "@/lib/components/about/chamber-directory"
import StreetScene from "@/lib/components/about/street-scene"
import ConnectBand from "@/lib/components/connect-band"
import ParallaxImage from "@/lib/components/parallax-image"
import { Arrow, ArrowLink, Btn, Lines } from "@/lib/components/ui"
import { about, brooklynBurgersPhoto, partners, site } from "@/lib/data/site"

import "./about.css"

export const metadata: Metadata = {
  title: "Who we are",
  description:
    "Meet the five borough Chambers of Commerce behind the NYC Small Business Resource Network and find free, personalized guidance for your business.",
}

export default function AboutPage() {
  return (
    <>
      <header className="about-hero">
        <ParallaxImage
          src="/media/about/lower-manhattan.webp"
          alt="Lower Manhattan and the Hudson River seen from Pier 57"
          sizes="(max-width: 860px) max(100vw, 1050px), 88vw"
          className="about-hero__photo"
          priority
          optimized
        />
        <div className="wrap about-hero__inner">
          <div className="about-hero__intro">
            <p className="label about-hero__kicker" data-reveal="">{site.name}</p>
            <Lines as="h1" className="display about-hero__title" lines={["Built for", "New York."]} />
            <p className="about-hero__lead" data-reveal="">
              New York City’s five borough Chambers of Commerce offer free, one-on-one guidance to local business owners.
            </p>
            <Btn href="#chambers" variant="ghost" arrow="down">Find your borough</Btn>
          </div>
          <dl className="about-hero__facts">
            {about.facts.slice(1).reverse().map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label === "Small businesses" ? "Small businesses citywide" : "Borough chambers"}</dt>
                <dd className="display tnum">{fact.value.toLocaleString("en-US")}{fact.suffix}</dd>
              </div>
            ))}
          </dl>
          <p className="about-hero__credit">
            <a href="https://commons.wikimedia.org/wiki/File:Lower_Manhattan_Skyline_2024.jpg" target="_blank" rel="noreferrer">Photo by Kidfly182</a>
            <span aria-hidden="true"> / </span>
            <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>
            <span> (cropped)</span>
          </p>
        </div>
      </header>

      <section className="about-story" aria-labelledby="story-h">
        <StreetScene>
          <div className="wrap about-story__head">
            <p className="label about-story__place" data-reveal="">Park Slope, Brooklyn</p>
            <h2 id="story-h" className="voice about-story__title" data-reveal="">
              Serving the small businesses that make New York, New York.
            </h2>
          </div>
          <div className="about-story__scene">
            <div className="about-story__photo">
              <Image
                src={brooklynBurgersPhoto.src}
                alt={brooklynBurgersPhoto.alt}
                fill
                sizes="(max-width: 900px) 100vw, 74vw"
              />
            </div>
          </div>
          <div className="wrap about-story__end">
            <div className="about-story__caption" data-reveal="">
              <p>We started in 2020, when COVID-19 put neighborhood businesses at risk. In Park Slope, our Brooklyn team helped Brooklyn Burgers &amp; Beer secure $2,500 in relief after the September 2023 flood.</p>
              <ArrowLink href="/stories#brooklyn-burgers-and-beer">Read the Park Slope story</ArrowLink>
            </div>
          </div>
        </StreetScene>
      </section>

      <section id="chambers" className="about-atlas" aria-labelledby="chambers-h">
        <div className="wrap">
          <header className="about-atlas__head" data-reveal="">
            <Lines id="chambers-h" as="h2" className="display about-atlas__title" lines={["Five chambers.", "One network."]} />
            <p>Find your borough on the map to reach the Chamber of Commerce that works with businesses in your neighborhood.</p>
          </header>
          <ChamberDirectory />
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
