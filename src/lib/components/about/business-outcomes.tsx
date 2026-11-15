import Image from "next/image"
import { ArrowLink } from "@/lib/components/ui"
import { stories } from "@/lib/data/site"

const barber = stories.find((story) => story.slug === "vincents-barber-shop")
const hats = stories.find((story) => story.slug === "harlems-heaven-hats")
const juice = stories.find((story) => story.slug === "madefresh-organic")

export default function BusinessOutcomes() {
  if (!barber || !hats?.quote || !juice) return null

  return (
    <section id="outcomes" className="about-outcomes" aria-labelledby="outcomes-h">
      <div className="wrap">
        <header className="about-outcomes__head" data-reveal="">
          <h2 id="outcomes-h" className="voice about-section-title">What local support changes.</h2>
          <ArrowLink href="/stories">Explore all business stories</ArrowLink>
        </header>
        <article className="about-outcomes__feature">
          <figure className="about-outcomes__photo" data-reveal="">
            <Image {...barber.image} sizes="(max-width: 740px) 92vw, (max-width: 1200px) 46vw, 580px" />
            <figcaption>{barber.place}, Staten Island</figcaption>
          </figure>
          <div className="about-outcomes__detail" data-reveal="">
            <h3 className="voice">{barber.name}</h3>
            <div className="about-outcomes__fact">
              <p className="display tnum">{barber.fact.figure}</p>
              <p>{barber.fact.label}</p>
            </div>
            <p>After the shop reopened, SBRN helped owner Emilio secure a LISC grant. When eligibility rules changed, the team reached back out to help him apply for additional funding.</p>
            <ArrowLink href={`/stories#${barber.slug}`}>Read the Stapleton story</ArrowLink>
          </div>
        </article>
        <div className="about-outcomes__notes">
          <article data-reveal="">
            <h3>{hats.name}</h3>
            <blockquote>
              <p className="voice">“I was struggling with my outdated website and didn’t know what to do next until the Small Business Resource Network came by.”</p>
              <p className="about-outcomes__byline">{hats.quote.by}</p>
            </blockquote>
            <ArrowLink href={`/stories#${hats.slug}`}>Read the Harlem story</ArrowLink>
          </article>
          <article data-reveal="">
            <h3>{juice.name}</h3>
            <p className="voice">{juice.fact.figure} {juice.fact.label}.</p>
            <p>SBRN helped founder Juliana Rivera take her Rosedale juice business to the Citi Field Business Expo and Queens Day in Albany.</p>
            <ArrowLink href={`/stories#${juice.slug}`}>Read the Rosedale story</ArrowLink>
          </article>
        </div>
      </div>
    </section>
  )
}
