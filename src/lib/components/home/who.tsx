import { about, ask } from "@/lib/data/site"
import { ArrowLink, Lines } from "../ui"

/** A statement, then the plain account of who the Network is, then one real question. */
export default function Who() {
  return (
    <section id="who" className="who" data-tone="day" aria-labelledby="who-h">
      <div className="wrap">
        <p className="label who__label" data-reveal="">
          {about.heading}
        </p>
        <Lines
          id="who-h"
          as="h2"
          className="display who__h"
          lines={[about.statement[0], about.statement[1], <span key="ny" className="who__ny">{about.statement[2]}</span>]}
        />

        <div className="grid12 who__body">
          <div className="who__copy prose" data-reveal="">
            <p className="who__lead">{about.paragraphs[0]}</p>
            <p>{about.paragraphs[1]}</p>
            <ArrowLink href="/about" className="who__more">
              Meet the Network
            </ArrowLink>
          </div>

          {/* A note taped to the window: the one question kept from the original homepage. */}
          <figure className="note" data-reveal="" style={{ ["--d" as string]: "140ms" }}>
            <span className="note__tape" aria-hidden="true" />
            <figcaption className="label note__tag">{ask.sector} ask</figcaption>
            <blockquote className="voice note__q">&ldquo;{ask.question}&rdquo;</blockquote>
            <p className="note__a">
              <span className="label">We say</span>
              {ask.answer}
            </p>
          </figure>
        </div>
      </div>
    </section>
  )
}
