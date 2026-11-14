import type { Metadata } from "next"
import ConnectBand from "@/lib/components/connect-band"
import PageHeader from "@/lib/components/page-header"
import { Arrow } from "@/lib/components/ui"
import press from "@/lib/data/press.json"

export const metadata: Metadata = {
  title: "Media",
  description:
    "Press coverage of the NYC Small Business Resource Network since its launch in 2020, from The New York Times and Crain's to the borough papers.",
}

/** `url` is null where the article is no longer online (checked 2026-11-14). */
type Item = { date: string; title: string; outlet: string; kind: string; url: string | null }

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

/** "2024-01-22" becomes "Jan 22": no leading zeroes in visible dates. */
function shortDate(iso: string): string {
  const [, m, d] = iso.split("-").map(Number)
  return `${MONTHS[m - 1]} ${d}`
}

export default function MediaPage() {
  const items = press as Item[]
  const years = Array.from(new Set(items.map((i) => i.date.slice(0, 4))))
  const outlets = new Set(items.map((i) => i.outlet)).size
  return (
    <>
      <PageHeader
        kicker="Media"
        title={["In the", "news"]}
        lead={`${items.length} stories from ${outlets} outlets, ${years[years.length - 1]} to ${years[0]}.`}
      >
        <nav aria-label="Years">
          <ul className="jump">
            {years.map((y) => (
              <li key={y}>
                <a href={`#y${y}`} className="jump__link">
                  <span className="tnum">{y}</span>
                  <Arrow dir="down" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      <div className="press" data-tone="day">
        {years.map((y) => {
          const list = items.filter((i) => i.date.startsWith(y))
          return (
            <section key={y} id={`y${y}`} className="press__year" aria-labelledby={`y${y}-h`}>
              <div className="wrap grid12">
                <div className="press__side">
                  <h2 id={`y${y}-h`} className="display press__num tnum">
                    {y}
                  </h2>
                  <p className="label press__count">
                    {list.length} {list.length === 1 ? "story" : "stories"}
                  </p>
                </div>
                <ol className="press__list">
                  {list.map((item, i) => {
                    const body = (
                      <>
                        <span className="clip__meta">
                          <time className="label tnum" dateTime={item.date}>
                            {shortDate(item.date)}
                          </time>
                          <span className="label clip__outlet">{item.outlet}</span>
                          {item.kind !== "News" ? <span className="label clip__kind">{item.kind}</span> : null}
                        </span>
                        <span className="voice clip__title">{item.title}</span>
                      </>
                    )
                    return (
                      <li key={item.date + item.title} data-reveal="" style={{ ["--d" as string]: `${Math.min(i, 6) * 45}ms` }}>
                        {item.url ? (
                          <a className="clip" href={item.url} target="_blank" rel="noopener noreferrer">
                            {body}
                            <span className="clip__go" aria-hidden="true">
                              <Arrow dir="out" />
                            </span>
                          </a>
                        ) : (
                          <div className="clip clip--still">{body}</div>
                        )}
                      </li>
                    )
                  })}
                </ol>
              </div>
            </section>
          )
        })}
      </div>

      <ConnectBand />
    </>
  )
}
