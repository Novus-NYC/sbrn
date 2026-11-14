import { chambers, connect, mailto, site } from "@/lib/data/site"
import { Btn, Lines } from "./ui"

/** The page ending shared across the site: the gate is up, come in. */
export default function ConnectBand({ heading = ["Connect", "with us"] }: { heading?: [string, string] }) {
  return (
    <section className="band slats" data-tone="coral" aria-labelledby="band-h">
      <div className="wrap grid12 band__grid">
        <Lines id="band-h" as="h2" className="display band__h" lines={heading} />
        <div className="band__body" data-reveal="">
          <p className="band__text">{connect.text}</p>
          <div className="band__actions">
            <Btn href={site.profileFormUrl} variant="ink">
              {connect.formLabel}
            </Btn>
          </div>
          <p className="label band__or">Or write to your borough&rsquo;s Chamber</p>
          <ul className="band__chambers">
            {chambers.map((c) => (
              <li key={c.id}>
                <a href={mailto(c.email)} className="band__mail">
                  <span className="label">{c.borough}</span>
                  <span className="band__addr">{c.email}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
