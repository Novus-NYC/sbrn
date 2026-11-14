import Image from "next/image"
import Link from "next/link"
import { boroughName, stories } from "@/lib/data/site"
import { Arrow, ArrowLink } from "../ui"

const FEATURED = "harlems-heaven-hats"
/** The four stories whose outcome is a dollar figure: together they read like a ledger. */
const INDEX = ["la-bomboniera-marylu", "vincents-barber-shop", "neat-dry-clean", "brooklyn-burgers-and-beer"]

/** One owner in her own words, then an index of what the help added up to. */
export default function StoriesTeaser() {
  const featured = stories.find((s) => s.slug === FEATURED)
  const rows = INDEX.map((slug) => stories.find((s) => s.slug === slug)).filter((s) => s !== undefined)
  if (!featured?.quote) return null
  // the last sentence of her quote is the line people remember
  const sentences = featured.quote.text.split(/(?<=[.!?])\s+/)
  const last = sentences[sentences.length - 1]
  const first = sentences.slice(0, -1).join(" ")
  return (
    <section className="tease" data-tone="day" aria-labelledby="tease-h">
      <div className="wrap grid12">
        <div className="tease__quote">
          <h2 id="tease-h" className="label tease__label" data-reveal="">
            Stories from the five boroughs
          </h2>
          <figure>
            <blockquote>
              <p className="voice tease__big" data-reveal="">
                &ldquo;{last}&rdquo;
              </p>
              <p className="tease__rest" data-reveal="" style={{ ["--d" as string]: "120ms" }}>
                {first}
              </p>
            </blockquote>
            <figcaption className="tease__by" data-reveal="" style={{ ["--d" as string]: "180ms" }}>
              <span className="shutter tease__face" data-reveal="">
                <Image src={featured.image.src} alt={featured.image.alt} width={featured.image.width} height={featured.image.height} sizes="160px" />
              </span>
              <span>
                <strong>{featured.quote.by.split(",")[0]}</strong>
                <br />
                {featured.quote.by.split(",").slice(1).join(",").trim()}
              </span>
            </figcaption>
          </figure>
        </div>

        <div className="tease__index">
          <ul>
            {rows.map((s, i) => (
              <li key={s.slug} data-reveal="" style={{ ["--d" as string]: `${i * 70}ms` }}>
                <Link href={`/stories#${s.slug}`} className="row">
                  <span className="display row__fig tnum">{s.fact.figure}</span>
                  <span className="row__text">
                    <span className="row__name">{s.name}</span>
                    <span className="row__meta">
                      {s.fact.label}. {s.place ? `${s.place}, ` : ""}
                      {boroughName[s.borough]}.
                    </span>
                  </span>
                  <span className="row__go" aria-hidden="true">
                    <Arrow dir="right" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div data-reveal="">
            <ArrowLink href="/stories" className="tease__all">
              Read all {stories.length} stories
            </ArrowLink>
          </div>
        </div>
      </div>
    </section>
  )
}
