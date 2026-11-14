import Image from "next/image"
import Link from "next/link"
import { Arrow, Btn } from "@/lib/components/ui"
import { boroughName, chambers, offer, openOnline, stories } from "@/lib/data/site"

const storefront = stories.find((story) => story.slug === "brooklyn-burgers-and-beer")!
const featured = ["harlems-heaven-hats", "la-bomboniera-marylu", "neat-dry-clean"].map(
  (slug) => stories.find((story) => story.slug === slug)!,
)

export default function HomePage() {
  return (
    <>
      <header className="welcome">
        <div className="wrap welcome__grid">
          <div className="welcome__copy">
            <p className="welcome__eyebrow">Here for small businesses. Here for New York.</p>
            <h1>Local support.<br />For your next step.</h1>
            <p className="welcome__lead">Running a business takes a lot. You don’t have to figure it all out on your own.</p>
            <p>Connect with the NYC Small Business Resource Network for personalized guidance, practical resources, and a specialist in your borough.</p>
            <div className="welcome__actions">
              <Btn href="/connect">Get business support</Btn>
              <a href="#services" className="welcome__secondary">Explore our services <Arrow dir="down" /></a>
            </div>
          </div>
          <figure className="welcome__photo">
            <Image src={storefront.image.src} alt={storefront.image.alt} width={storefront.image.width} height={storefront.image.height} sizes="(max-width: 760px) 100vw, 50vw" priority />
            <figcaption><strong>Brooklyn Burgers &amp; Beer</strong><span>Park Slope, Brooklyn</span><Link href={`/stories#${storefront.slug}`}>Read their story <Arrow /></Link></figcaption>
          </figure>
        </div>
      </header>

      <div className="network-intro">
        <div className="wrap network-intro__inner">
          <p>A citywide network, rooted in your neighborhood.</p>
          <p>Five borough Chambers of Commerce. One place to start.</p>
          <Link href="/about">Meet the Network <Arrow /></Link>
        </div>
      </div>

      <section id="services" className="support section-pad" aria-labelledby="services-h">
        <div className="wrap support__grid">
          <div className="section-intro" data-reveal="">
            <p className="section-tag">How we can help</p>
            <h2 id="services-h">Your business.<br />Your questions.<br />Let’s start there.</h2>
            <p>Whether you’re looking for funding, reaching new customers, or planning what comes next, we’ll help you find your way.</p>
            <Link className="text-link" href="/services">Explore all services <Arrow /></Link>
          </div>
          <div>
            <ul className="service-list">
              {offer.services.map((service) => (
                <li key={service.id}>
                  <Link href={`/services#${service.id}`}>
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
        <div className="wrap">
          <div className="borough-help__heading"><h2 id="borough-help-h">Support close to home.</h2><p>Choose your borough to find your local Chamber contact.</p></div>
          <ul>{chambers.map((chamber) => <li key={chamber.id}><Link href={`/connect#${chamber.id}`}>{chamber.borough}<Arrow /></Link></li>)}</ul>
        </div>
      </section>

      <section className="local-stories section-pad" aria-labelledby="local-stories-h">
        <div className="wrap">
          <div className="section-heading"><div><p className="section-tag">The people behind the businesses</p><h2 id="local-stories-h">New York stories. Real support.</h2></div><Link className="text-link" href="/stories">Read all stories <Arrow /></Link></div>
          <div className="local-stories__grid">
            {featured.map((story) => (
              <article key={story.slug} data-reveal="">
                <Link className="local-story" href={`/stories#${story.slug}`}>
                  <Image src={story.image.src} alt={story.image.alt} width={story.image.width} height={story.image.height} sizes="(max-width: 760px) 92vw, 31vw" />
                  <div><p className="local-story__borough">{boroughName[story.borough]}</p><h3>{story.name}</h3><p>{story.fact.figure} {story.fact.label}.</p><span className="text-link">Read the story <Arrow /></span></div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="start-support" aria-labelledby="start-h">
        <div className="wrap start-support__inner"><div><h2 id="start-h">Tell us what your business needs.</h2><p>Start with your business profile or contact your borough’s Chamber.</p></div><Btn href="/connect" variant="ink">Find your next step</Btn></div>
      </section>
      <aside className="walk-invitation wrap"><p>Want to explore the Network’s interactive neighborhood?</p><Link href="/walk">Take the optional walk <Arrow /></Link></aside>
    </>
  )
}
