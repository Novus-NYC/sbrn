import Link from "next/link"
import { offer } from "@/lib/data/site"

const symbols = [
  <><circle cx="24" cy="24" r="17" /><path d="M28 16h-8a4 4 0 0 0 0 8h8a4 4 0 0 1 0 8h-9M24 12v24" /></>,
  <><path d="M8 36V23h7v13m5 0V13h7v23m5 0V8h7v28M7 39h34" /></>,
  <><path d="m9 7 29 18-13 2-5 12zM25 27l8 11" /></>,
  <><path d="m6 26 10-10 8 6 8-6 10 10-11 12-8-5-7 5zM17 23l8 8m-3-11 8 8" /></>,
  <><path d="M13 7h18l5 5v29H13zM31 7v7h6M18 21h13M18 27h13M18 33h9" /></>,
]

export default function ServiceOverview() {
  return (
    <section className="overview" aria-labelledby="overview-title" data-tone="night">
      <div className="wrap overview__inner">
        <div className="overview__heading" data-reveal="">
          <p className="label">Personalized guidance, across all five boroughs</p>
          <h2 id="overview-title" className="display">What we offer</h2>
          <p>{offer.intro}</p>
        </div>
        <ul className="overview__services">
          {offer.services.map((service, index) => (
            <li key={service.id} data-reveal="" style={{ ["--d" as string]: `${index * 65}ms` }}>
              <Link href="/connect" aria-label={`Ask about ${service.name}`}>
                <span className="overview__icon" aria-hidden="true">
                  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{symbols[index]}</svg>
                </span>
                <span className="overview__rule" />
                <span className="display overview__name">{service.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
