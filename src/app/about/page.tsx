import type { Metadata } from "next"
import Image from "next/image"
import BusinessOutcomes from "@/lib/components/about/business-outcomes"
import ChamberDirectory from "@/lib/components/about/chamber-directory"
import StreetScene from "@/lib/components/about/street-scene"
import ParallaxImage from "@/lib/components/parallax-image"
import { Arrow, ArrowLink, Btn, Lines } from "@/lib/components/ui"
import { connect, offer, partners, site } from "@/lib/data/site"

import "./about.css"

export const metadata: Metadata = {
  title: "Who we are",
  description:
    "Meet the five borough Chambers of Commerce behind the NYC Small Business Resource Network and find free, personalized guidance for your business.",
}

const chapters = [
  ["network-story", "How it began"],
  ["support", "How we help"],
  ["outcomes", "Business outcomes"],
  ["chambers", "Borough chambers"],
] as const

// Milestones link to their source coverage in the Media archive.
const milestones = [
  { year: "2021", title: "Open + Online launches", description: "The program helps neighborhood businesses build a stronger online presence." },
  { year: "2022", title: "New York City invests $1.5 million", description: "The City announces funding for continued support through the Network." },
  { year: "2026", title: "Federal funding for Staten Island", description: "$3 million is announced for the Staten Island Chamber’s work through the Network." },
] as const

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
      <nav className="about-chapters" aria-label="On this page">
        <ul className="wrap">
          {chapters.map(([id, label]) => (
            <li key={id}><a href={`#${id}`}>{label}</a></li>
          ))}
        </ul>
      </nav>

      <section id="network-story" className="about-story" aria-labelledby="story-h">
        <div className="wrap about-story__intro">
          <p className="label about-eyebrow" data-reveal="">How it began</p>
          <h2 id="story-h" className="voice about-section-title" data-reveal="">The city needed a way to stay open.</h2>
        </div>
        <StreetScene>
          <div className="about-story__scene">
            <Image
              src="/media/about/mott-street-night.webp"
              alt="Restaurant signs and lanterns lighting the storefronts along Mott Street in Manhattan’s Chinatown"
              fill
              sizes="(max-width: 600px) 720px, 100vw"
            />
          </div>
          <div className="wrap about-story__beats">
            <article className="about-story__beat" data-reveal="">
              <p className="label about-eyebrow"><time dateTime="2020">2020</time></p>
              <h3 className="voice">The chambers joined forces.</h3>
              <p>When COVID-19 threatened neighborhood businesses, New York City’s five borough Chambers of Commerce came together to give owners a place to turn for help.</p>
              <ArrowLink href="/media#y2020">Read about the launch</ArrowLink>
            </article>
            <article className="about-story__beat" data-reveal="">
              <h3 className="voice">Support stayed close to home.</h3>
              <p>Small Business Support Specialists work through the borough chambers. They help owners find financing, work through lease questions, reach customers online, and plan their next move.</p>
              <ArrowLink href="#chambers">Find your local chamber</ArrowLink>
            </article>
          </div>
        </StreetScene>
        <div className="wrap about-story__credit">
          <p>Mott Street, Chinatown</p>
          <p className="about-photo-credit">
            <a href="https://commons.wikimedia.org/wiki/File:Mott_Street,_Chinatown,_New_York-L1002097.jpg" target="_blank" rel="noreferrer">Photo by Frank Schulenburg</a>
            <span aria-hidden="true"> / </span>
            <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>
            <span> (resized and cropped)</span>
          </p>
        </div>
      </section>

      <section id="support" className="about-services" aria-labelledby="support-h">
        <div className="wrap about-services__layout">
          <header className="about-services__head">
            <p className="label about-eyebrow">How we help</p>
            <h2 id="support-h" className="voice about-section-title">Bring us a question.</h2>
            <p>Tell us what you’re working on. A specialist at your borough chamber can help you find resources and decide what to do next.</p>
            <ArrowLink href="/connect">Tell us what you need</ArrowLink>
          </header>
          <div className="about-services__topics">
            {offer.services.map((service, index) => (
              <details key={service.id} name="about-services" open={index === 0}>
                <summary className="display">
                  {service.name}
                  <span className="about-services__sign" aria-hidden="true" />
                </summary>
                <div className="about-services__description">
                  <p>{service.proof}</p>
                  {service.storySlug && <ArrowLink href={`/stories#${service.storySlug}`}>Read the business story</ArrowLink>}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <BusinessOutcomes />

      <section id="chambers" className="about-atlas" aria-labelledby="chambers-h">
        <div className="wrap">
          <header className="about-atlas__head" data-reveal="">
            <div>
              <p className="label about-eyebrow">Five boroughs</p>
              <h2 id="chambers-h" className="voice about-section-title">Find your chamber.</h2>
            </div>
            <p>Choose your borough on the map to find the chamber that works with businesses in your neighborhood.</p>
          </header>
          <ChamberDirectory />
        </div>
      </section>

      <section className="about-partners" aria-labelledby="partners-h">
        <div className="wrap about-partners__layout">
          <div className="about-partners__head">
            <h2 id="partners-h" className="voice about-section-title" data-reveal="">The partnership behind the Network.</h2>
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
        <div className="wrap about-milestones">
          <h3 className="voice" data-reveal="">How the work grew.</h3>
          <ol>
            {milestones.map(({ year, title, description }) => (
              <li key={year} data-reveal="">
                <ArrowLink href={`/media#y${year}`}>
                  <time className="display tnum" dateTime={year}>{year}</time>
                  <strong>{title}</strong>
                </ArrowLink>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="about-next slats" aria-labelledby="about-next-h">
        <div className="wrap about-next__inner" data-reveal="">
          <h2 id="about-next-h" className="voice about-section-title">Let’s talk about your business.</h2>
          <div>
            <p>{connect.text}</p>
            <div className="about-next__actions">
              <Btn href={site.profileFormUrl}>{connect.formLabel}</Btn>
              <ArrowLink href="#chambers">Or email your chamber</ArrowLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
