import type { Metadata } from "next"
import Image from "next/image"
import ConnectBand from "@/lib/components/connect-band"
import PageHeader from "@/lib/components/page-header"
import { Arrow } from "@/lib/components/ui"
import { boroughName, boroughOrder, stories, storiesIntro } from "@/lib/data/site"

export const metadata: Metadata = {
  title: "Stories",
  description:
    "Ten small businesses across the five boroughs, and what changed after a Small Business Resource Network specialist stepped in: grants, websites, contracts.",
}

export default function StoriesPage() {
  return (
    <>
      <PageHeader
        kicker="Stories"
        title={["Our impact on", "small businesses"]}
        lead={storiesIntro.text}
        underClass="under--photos"
        under={stories.map((s) => (
          <Image key={s.slug} src={s.image.src} alt="" width={s.image.width} height={s.image.height} sizes="(max-width: 720px) 34vw, 14vw" />
        ))}
      >
        <nav aria-label="Boroughs">
          <ul className="jump">
            {boroughOrder.map((b) => (
              <li key={b}>
                <a href={`#${b}`} className="jump__link">
                  <span>{boroughName[b]}</span>
                  <Arrow dir="down" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      <div className="boroughs" data-tone="day">
        {boroughOrder.map((b) => {
          const list = stories.filter((s) => s.borough === b)
          return (
            <section key={b} id={b} className="borough" aria-labelledby={`${b}-h`}>
              <div className="wrap grid12">
                <div className="borough__side">
                  <h2 id={`${b}-h`} className="display borough__name">
                    {boroughName[b]}
                  </h2>
                  <p className="label borough__count">{list.length} stories</p>
                </div>
                <div className="borough__stories">
                  {list.map((s, i) => (
                    <article key={s.slug} id={s.slug} className={`tale ${i % 2 ? "tale--flip" : ""}`}>
                      <figure className="shutter tale__img" data-reveal="" style={{ aspectRatio: `${s.image.width} / ${s.image.height}` }}>
                        <Image
                          src={s.image.src}
                          alt={s.image.alt}
                          width={s.image.width}
                          height={s.image.height}
                          sizes="(max-width: 860px) 92vw, 34vw"
                        />
                      </figure>
                      <div className="tale__body" data-reveal="" style={{ ["--d" as string]: "120ms" }}>
                        <p className="tale__fact">
                          <span className="display tale__fig tnum">{s.fact.figure}</span>
                          <span className="tale__label">{s.fact.label}</span>
                        </p>
                        <h3 className="tale__name">
                          {s.name}
                          {s.place ? <span className="tale__place">, {s.place}</span> : null}
                        </h3>
                        {s.quote ? (
                          <blockquote className="tale__quote">
                            <p className="voice">&ldquo;{s.quote.text}&rdquo;</p>
                            <footer>{s.quote.by}</footer>
                          </blockquote>
                        ) : (
                          <p className="tale__text">{s.body}</p>
                        )}
                        {s.url ? (
                          <a className="alink tale__link" href={s.url} target="_blank" rel="noopener noreferrer">
                            <span>Visit {s.name}</span>
                            <span className="alink__mark" aria-hidden="true">
                              <Arrow dir="out" />
                              <Arrow dir="out" />
                            </span>
                          </a>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )
        })}
      </div>

      <ConnectBand />
    </>
  )
}
