import type { Metadata } from "next"
import ParallaxImage from "@/lib/components/parallax-image"
import ConnectBand from "@/lib/components/connect-band"
import LogoReel from "@/lib/components/logo-reel"
import PageHeader from "@/lib/components/page-header"
import { Arrow } from "@/lib/components/ui"
import press from "@/lib/data/press.json"

export const metadata: Metadata = {
  title: "Media",
  description:
    "Press coverage and public records about the NYC Small Business Resource Network from 2020 through 2026.",
}

/** `url` is null where the article is no longer online (checked 2026-11-14). */
type Item = { date: string; title: string; outlet: string; kind: string; url: string | null }

// Each mark represents an outlet with an SBRN story in the archive below.
const featuredOutlets = [
  [
    { name: "The New York Times", src: "/media/press/new-york-times.svg", outlet: "The New York Times", width: 512, height: 86 },
    { name: "ABC 7 New York", src: "/media/press/abc7.svg", outlet: "ABC 7 NY", width: 1000, height: 732 },
    { name: "PIX11", src: "/media/press/pix11.svg", outlet: "PIX11", width: 3167, height: 1000 },
    { name: "Spectrum News NY1", src: "/media/press/ny1.svg", outlet: "NY1", width: 1543, height: 411 },
  ],
  [
    { name: "News 12", src: "/media/press/news12.svg", outlet: "News 12", width: 78, height: 22 },
    { name: "amNewYork", src: "/media/press/amnewyork.svg", outlet: "amNewYork", width: 699, height: 107 },
    { name: "Staten Island Advance", src: "/media/press/staten-island-advance.webp", outlet: "Staten Island Advance", width: 720, height: 142 },
  ],
] as const

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

/** "2024-01-22" becomes "Jan 22": no leading zeroes in visible dates. */
function shortDate(iso: string): string {
  const [, m, d] = iso.split("-").map(Number)
  return `${MONTHS[m - 1]} ${d}`
}

const moments: Record<string, { src: string; alt: string; title: string; credit: string; source?: string }> = {
  "2026": { src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/South_Ferry_20261002.jpg/1280px-South_Ferry_20261002.jpg", alt: "South Ferry seen from the Staten Island ferry in October 2026", title: "Federal support for the Staten Island Chamber's SBRN work", credit: "VynedJ, CC BY 4.0", source: "https://commons.wikimedia.org/wiki/File:South_Ferry_20261002.jpg" },
  "2025": { src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c4/New_York_City_Hall_November_2025.jpg/1280px-New_York_City_Hall_November_2025.jpg", alt: "New York City Hall in November 2025", title: "City budget discussions put small business support in focus", credit: "Kidfly182, CC BY 4.0", source: "https://commons.wikimedia.org/wiki/File:New_York_City_Hall_November_2025.jpg" },
  "2024": { src: "/media/projects/harlems-heaven-hats.webp", alt: "Website project for Harlem's Heaven Hats", title: "Open + Online expands digital tools for local businesses", credit: "SBRN project archive" },
  "2023": { src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dd/Rainy_day_in_New_York_City%2C_Manhattan_-_Flickr_-_Bilderschachtel_Photography.jpg/1280px-Rainy_day_in_New_York_City%2C_Manhattan_-_Flickr_-_Bilderschachtel_Photography.jpg", alt: "Heavy rain in Manhattan during the September 2023 flooding", title: "Flood recovery brings new attention to neighborhood storefronts", credit: "Hans-B. Sickler, CC BY 2.0", source: "https://commons.wikimedia.org/wiki/File:Rainy_day_in_New_York_City,_Manhattan_-_Flickr_-_Bilderschachtel_Photography.jpg" },
  "2022": { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/New_York_City_Mayor_Eric_Adams_Small_Business_Week_Kickoff_Brooklyn_New_York_2022_%2852529341556%29.jpg/2560px-New_York_City_Mayor_Eric_Adams_Small_Business_Week_Kickoff_Brooklyn_New_York_2022_%2852529341556%29.jpg", alt: "Mayor Eric Adams at a Brooklyn Small Business Week event in May 2022", title: "The city extends its investment in one-on-one support", credit: "Anthony Quintano, CC BY 2.0", source: "https://commons.wikimedia.org/wiki/File:New_York_City_Mayor_Eric_Adams_Small_Business_Week_Kickoff_Brooklyn_New_York_2022_(52529341556).jpg" },
  "2021": { src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Wo_Hop_outdoor_Mott_St_2021_jeh.jpg/1280px-Wo_Hop_outdoor_Mott_St_2021_jeh.jpg", alt: "Outdoor dining at Wo Hop and neighboring businesses on Mott Street in May 2021", title: "Restaurants adapt and neighborhood commerce returns", credit: "Jim.henderson, CC BY 4.0", source: "https://commons.wikimedia.org/wiki/File:Wo_Hop_outdoor_Mott_St_2021_jeh.jpg" },
  "2020": { src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a8/Closed_Stores_at_Penn_Station_NY_During_Pandemic.jpg/1280px-Closed_Stores_at_Penn_Station_NY_During_Pandemic.jpg", alt: "Closed shops near Penn Station during the COVID-19 pandemic", title: "The pandemic closes storefronts. A network is launched.", credit: "Bonnachoven, CC0", source: "https://commons.wikimedia.org/wiki/File:Closed_Stores_at_Penn_Station_NY_During_Pandemic.jpg" },
}

export default function MediaPage() {
  const items = press as Item[]
  const logoRows = featuredOutlets.map((outlets) => ({
    repeat: 5,
    marks: outlets.flatMap(({ name, outlet, ...image }) => {
      const href = items.find((item) => item.outlet === outlet && item.url)?.url
      return href ? [{ name, href, image }] : []
    }),
  }))
  const years = Array.from(new Set(items.map((i) => i.date.slice(0, 4))))
  const outlets = new Set(items.map((i) => i.outlet)).size
  return (
    <>
      <PageHeader
        kicker="Media"
        title={["In the", "news"]}
        lead={`${items.length} reports and stories from ${outlets} sources, ${years[years.length - 1]} to ${years[0]}.`}
        heroImage={{ src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/2008_newsstand_NYC_USA_2453239739.jpg/3840px-2008_newsstand_NYC_USA_2453239739.jpg", alt: "Readers browsing newspapers and magazines at a Manhattan street newsstand", credit: "Ray Dehler, CC BY 2.0", source: "https://commons.wikimedia.org/wiki/File:2008_newsstand_NYC_USA_2453239739.jpg" }}
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

      <section className="coverage" data-tone="night" aria-labelledby="coverage-title">
        <div className="wrap">
          <div className="coverage__intro">
            <h2 id="coverage-title" className="voice">From the local press</h2>
            <p>Read how New York newsrooms covered the businesses we serve, from recovering after floods to reaching customers online.</p>
          </div>
        </div>
        <LogoReel rows={logoRows} showAllLabel="Show all outlets" />
      </section>

      <div className="press" data-tone="day">
        {years.map((y) => {
          const list = items.filter((i) => i.date.startsWith(y))
          return (
            <section key={y} id={`y${y}`} className="press__year" aria-labelledby={`y${y}-h`}>
              <div className={`press__moment press__moment--${y}`}>
                <ParallaxImage src={moments[y].src} alt={moments[y].alt} sizes="100vw" />
                <div className="wrap press__moment-inner"><p className="label">The year in context</p><p className="voice">{moments[y].title}</p><span>{moments[y].source ? <a href={moments[y].source} target="_blank" rel="noreferrer">Photo: {moments[y].credit}</a> : moments[y].credit}</span></div>
              </div>
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
