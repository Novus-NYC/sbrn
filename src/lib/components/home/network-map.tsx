import Image from "next/image"
import Link from "next/link"
import { about, chambers } from "@/lib/data/site"
import NetworkMapMotion from "./network-map-motion"

const MAP_W = 2800
const MAP_H = 1010

/** Line order for the network drawn across the map: one continuous route through all five. */
const ROUTE = ["staten-island", "brooklyn", "manhattan", "bronx", "queens", "brooklyn"] as const

export default function NetworkMap() {
  const byId = Object.fromEntries(chambers.map((c) => [c.id, c]))
  const points = ROUTE.map((id) => byId[id].pin)
  const d = points.map((p, i) => `${i ? "L" : "M"}${p.x} ${(p.y * MAP_H) / MAP_W}`).join(" ")
  return (
    <section className="net" data-tone="night" aria-labelledby="net-h">
      <div className="net__canvas" data-net="">
        <Image
          src="/media/brand/nyc-street-map.webp"
          alt=""
          width={MAP_W}
          height={MAP_H}
          sizes="(max-width: 860px) 300vw, 100vw"
          className="net__map"
        />
        <svg className="net__lines" viewBox={`0 0 100 ${(100 * MAP_H) / MAP_W}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path className="net__route" d={d} pathLength={1} />
        </svg>
        <ul className="net__pins">
          {chambers.map((c) => (
            <li key={c.id} className={`net__pin net__pin--${c.id}`} style={{ left: `${c.pin.x}%`, top: `${c.pin.y}%` }}>
              <Link href={`/connect#${c.id}`} aria-label={`${c.borough}: contact the ${c.name}`}>
                <span className="net__dot" aria-hidden="true" />
                <span className="label net__name">{c.borough}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="wrap net__facts">
        <h2 id="net-h" className="label net__label" data-reveal="">
          One network, citywide
        </h2>
        <dl className="net__list">
          {about.facts.map((f, i) => (
            <div key={f.label} className="net__fact" data-reveal="" style={{ ["--d" as string]: `${i * 110}ms` }}>
              <dd className="display net__num tnum">
                <span data-count={f.value} data-suffix={f.suffix}>
                  {f.value.toLocaleString("en-US")}
                  {f.suffix}
                </span>
              </dd>
              <dt className="label net__what">{f.label}</dt>
            </div>
          ))}
        </dl>
      </div>
      <NetworkMapMotion />
    </section>
  )
}
