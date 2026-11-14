import { openOnline } from "@/lib/data/site"
import BrowserFrame from "../browser-frame"
import { Btn, Lines } from "../ui"
import DriftRows from "./drift-rows"

/** Real sites built through the program, drifting past like windows on a block. */
export default function OnlineStrip() {
  const half = Math.ceil(openOnline.projects.length / 2)
  const rows = [openOnline.projects.slice(0, half), openOnline.projects.slice(half)]
  return (
    <section className="online" data-tone="concrete" aria-labelledby="online-h">
      <div className="wrap grid12 online__top">
        <div className="online__title">
          <p className="label online__label" data-reveal="">
            A program of the Network
          </p>
          <Lines id="online-h" as="h2" className="display online__h" lines={["Open", "+ Online"]} />
        </div>
        <div className="online__copy prose" data-reveal="">
          <p className="online__lead">{openOnline.teaser[1]}</p>
          {/* The program is closed to new applicants: say so here, not only on its page. */}
          <p className="online__status">
            <span className="label">Notice</span>
            {openOnline.status}
          </p>
          <Btn href="/openandonline" variant="ink">
            See the sites it built
          </Btn>
        </div>
      </div>

      <DriftRows>
        {rows.map((row, r) => (
          <ul key={r} className="online__row" data-drift={r === 0 ? "left" : "right"}>
            {row.map((p) => (
              <li key={p.slug}>
                <BrowserFrame project={p} sizes="(max-width: 860px) 72vw, 30vw" />
              </li>
            ))}
          </ul>
        ))}
      </DriftRows>
    </section>
  )
}
