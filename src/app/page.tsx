import Image from "next/image"
import Link from "next/link"
import ServiceMark from "@/lib/components/service-mark"
import { Arrow, Btn } from "@/lib/components/ui"
import { boroughName, chambers, offer, openOnline, stories } from "@/lib/data/site"

const storefront = stories.find((story) => story.slug === "brooklyn-burgers-and-beer")!
const neighborhood = stories.find((story) => story.slug === "vincents-barber-shop")!
const featured = stories.find((story) => story.slug === "harlems-heaven-hats")!
const supporting = ["la-bomboniera-marylu", "neat-dry-clean"].map((slug) => stories.find((story) => story.slug === slug)!)
const quote = featured.quote!.text.split(/(?<=[.!?])\s+/).at(-1)

export default function HomePage() {
  return (
    <>
      <header className="welcome">
        <div className="wrap welcome__grid">
          <div className="welcome__copy">
            <p className="welcome__eyebrow"><span aria-hidden="true" /> NYC Small Business Resource Network</p>
            <h1 data-lines="">For the{" "}<br />businesses that{" "}<br />make New York.</h1>
            <p className="welcome__lead">Personalized guidance. Local connections.<br />A real person in your corner.</p>
            <p>Find resources and support for your business through the Chambers of Commerce in all five boroughs.</p>
            <div className="welcome__actions">
              <Btn href="/connect" variant="ink">Get business support</Btn>
              <a href="#services" className="welcome__secondary">Explore our services <Arrow dir="down" /></a>
            </div>
          </div>
          <div className="welcome__neighborhood">
            <figure className="welcome__photo">
              <Image src={storefront.image.src} alt={storefront.image.alt} width={storefront.image.width} height={storefront.image.height} sizes="(max-width: 760px) 92vw, 48vw" priority />
              <figcaption><span><strong>{storefront.name}</strong><span>Park Slope, Brooklyn</span></span><Link href={`/stories#${storefront.slug}`} aria-label={`Read the story of ${storefront.name}`}><span>Read their story</span><Arrow /></Link></figcaption>
            </figure>
            <div className="welcome__local">
              <figure className="welcome__detail">
                <Image src={neighborhood.image.src} alt={neighborhood.image.alt} width={neighborhood.image.width} height={neighborhood.image.height} sizes="(max-width: 760px) 42vw, 200px" />
                <figcaption>Vincent’s Barber Shop, the Bronx</figcaption>
              </figure>
              <div className="welcome__note"><span className="welcome__note-title">Big city.<br />Local roots.</span><p>For the shops, studios, and neighborhood spots that make this city home.</p></div>
            </div>
          </div>
        </div>
      </header>

      <div className="network-intro">
        <div className="wrap network-intro__inner">
          <p>Five boroughs.<br /><strong>One network.</strong></p>
          <p>Local knowledge. Citywide connections.<br />Support from your borough’s Chamber of Commerce.</p>
          <Link href="/about">Meet the Network <Arrow /></Link>
        </div>
      </div>

      <section id="services" className="support section-pad" aria-labelledby="services-h">
        <div className="wrap support__grid">
          <div className="section-intro" data-reveal="">
            <p className="section-tag">How we can help</p>
            <h2 id="services-h" data-lines="">Your next step{" "}<br />starts here.</h2>
            <p>Whether you’re looking for funding, reaching new customers, or planning what comes next, we’ll help you find your way.</p>
            <Link className="text-link" href="/services">Explore all services <Arrow /></Link>
            <Image className="support__drawing" src="/media/brand/storefront-row.webp" alt="" width={1600} height={782} sizes="(max-width: 760px) 70vw, 340px" />
          </div>
          <div>
            <ul className="service-list">
              {offer.services.map((service) => (
                <li key={service.id}>
                  <Link href={`/services#${service.id}`}>
                    <ServiceMark shop={service.shop} />
                    <div><h3>{service.name}</h3><p>{service.summary}</p></div>
                    <Arrow />
                  </Link>
                </li>
              ))}
            </ul>
            <p className="program-note"><strong>Looking for Open + Online?</strong> {openOnline.status} <Link href="/openandonline">View program details</Link>.</p>
          </div>
        </div>
      </section>

      <section className="borough-help" aria-labelledby="borough-help-h">
        <div className="borough-help__map" aria-hidden="true"><Image src="/media/brand/nyc-street-map.webp" alt="" width={2800} height={1010} sizes="(max-width: 760px) 200vw, 100vw" quality={60} /></div>
        <div className="wrap borough-help__grid">
          <div className="borough-help__heading"><p className="section-tag">Around the corner. Across the city.</p><h2 id="borough-help-h">Your borough.<br />Your people.</h2><p>Start with someone who knows your neighborhood. Find your local Chamber contact.</p><span className="borough-help__badge">All five boroughs. All here for you.</span></div>
          <ul>{chambers.map((chamber) => <li key={chamber.id}><Link href={`/connect#${chamber.id}`}><span>{chamber.borough}</span><span className="borough-help__action">Find support <Arrow /></span></Link></li>)}</ul>
        </div>
      </section>

      <section className="local-stories section-pad" aria-labelledby="local-stories-h">
        <div className="wrap">
          <div className="section-heading"><div><p className="section-tag">The people behind the businesses</p><h2 id="local-stories-h">This is who we’re here for.</h2></div><Link className="text-link" href="/stories">Read all stories <Arrow /></Link></div>
          <article className="featured-story" data-reveal="">
            <div className="featured-story__photo"><Image src={featured.image.src} alt={featured.image.alt} width={featured.image.width} height={featured.image.height} sizes="(max-width: 760px) 92vw, 42vw" /><p>{featured.name} <span>Manhattan</span></p></div>
            <div className="featured-story__body"><p className="section-tag">A new chapter for a Harlem original</p><blockquote className="voice">“{quote}”</blockquote><p className="featured-story__by">{featured.quote!.by}</p><p>After more than 30 years in Harlem, Evetta connected with the Network for help with her outdated website. Open + Online helped her start a new chapter.</p><Link className="text-link" href={`/stories#${featured.slug}`}>Read Evetta’s story <Arrow /></Link></div>
          </article>
          <div className="local-stories__grid">
            {supporting.map((story) => (
              <article key={story.slug} data-reveal="">
                <Link className="local-story" href={`/stories#${story.slug}`}>
                  <Image src={story.image.src} alt={story.image.alt} width={story.image.width} height={story.image.height} sizes="(max-width: 760px) 36vw, 200px" />
                  <div><p className="local-story__borough">{boroughName[story.borough]}</p><h3>{story.name}</h3><p>{story.fact.figure} {story.fact.label}.</p><span className="text-link">Read the story <Arrow /></span></div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="start-support" aria-labelledby="start-h">
        <div className="wrap start-support__inner"><div><h2 id="start-h" data-lines="">Let’s talk about{" "}<br />your next chapter.</h2><p>Start with your business profile or contact your borough’s Chamber.</p></div><Btn href="/connect" variant="ink">Get business support</Btn></div>
      </section>
      <aside className="walk-invitation wrap"><p>There’s another way to meet the neighborhood.</p><Link href="/walk">Take the optional interactive walk <Arrow /></Link></aside>
    </>
  )
}
