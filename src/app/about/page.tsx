import type { Metadata } from "next"
import Image from "next/image"
import ChamberDirectory from "@/lib/components/about/chamber-directory"
import StreetScene from "@/lib/components/about/street-scene"
import ConnectBand from "@/lib/components/connect-band"
import ParallaxImage from "@/lib/components/parallax-image"
import { Arrow, ArrowLink, Btn, Lines } from "@/lib/components/ui"
import { brooklynBurgersPhoto, partners, site } from "@/lib/data/site"

import "./about.css"

export const metadata: Metadata = {
  title: "Who we are",
  description:
    "Meet the five borough Chambers of Commerce behind the NYC Small Business Resource Network and find free, personalized guidance for your business.",
}

export default function AboutPage() {
  return (
    <div className="about-page">
      <header className="about-hero">
        <ParallaxImage
          src="/media/about/brooklyn-bridge-night.webp"
          alt="The illuminated Brooklyn Bridge and Lower Manhattan skyline reflected in the East River"
          sizes="(max-width: 780px) 1080px, 100vw"
          className="about-hero__photo"
          priority
          optimized
        />
        <div className="wrap about-hero__inner">
          <div className="about-hero__intro">
            <p className="label about-hero__kicker">{site.name}</p>
            <Lines as="h1" className="display about-hero__title" lines={["Local help.", <span key="citywide" className="voice">Citywide.</span>]} />
            <p className="about-hero__lead">Free, one-on-one help for New York City businesses from the Chambers of Commerce in all five boroughs.</p>
            <div className="about-hero__actions">
              <Btn href="#chambers" arrow="down">Find your borough</Btn>
              <a href="#network-story" className="about-hero__story-link">Get to know the Network <Arrow dir="down" /></a>
            </div>
          </div>
          <p className="about-photo-credit">
            <a href="https://commons.wikimedia.org/wiki/File:Brooklyn_Bridge_at_night.jpg" target="_blank" rel="noreferrer">Photo by Kai Pilger</a>
          </p>
        </div>
      </header>

      <section id="network-story" className="about-story" aria-labelledby="story-h">
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

      <section className="about-partners" aria-labelledby="partners-h">
        <div className="wrap about-partners__layout">
          <div className="about-partners__head">
            <h2 id="partners-h" className="voice about-partners__title" data-reveal="">The partnership behind the Network.</h2>
            <p data-reveal="">Public agencies, nonprofits and business organizations help the borough chambers connect local owners with advice and services.</p>
            <Image
              src="/media/brand/storefront-row.webp"
              alt=""
              width={1600}
              height={782}
              sizes="(max-width: 740px) 92vw, 47vw"
              className="about-partners__illustration"
            />
          </div>
          <div className="about-partners__credits">
            <div data-reveal="">
              <h3>Launched and funded by</h3>
              <ul>
                {partners.funding.map((partner) => (
                  <li key={partner.name}>
                    <a href={partner.url} target="_blank" rel="noreferrer">
                      <span>
                        <strong>{partner.name}</strong>
                        {partner.role && <small>{partner.role}</small>}
                      </span>
                      <Arrow dir="out" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div data-reveal="">
              <h3>In collaboration with</h3>
              <ul>
                {partners.collaboration.map((partner) => (
                  <li key={partner.name}>
                    <a href={partner.url} target="_blank" rel="noreferrer">
                      <strong>{partner.name}</strong>
                      <Arrow dir="out" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <ConnectBand />
    </div>
  )
}
