import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import PageHeader from "@/lib/components/page-header"
import { Arrow, Btn } from "@/lib/components/ui"
import { offer, openOnline, stories } from "@/lib/data/site"

const featured = stories.find((story) => story.slug === "neat-dry-clean")!

export const metadata: Metadata = {
  title: "Small business services",
  description: "Explore guidance on grants and loans, digital marketing, websites, lease questions and business planning from your borough's Small Business Support Specialists.",
}

export default function ServicesPage() {
  return <>
    <PageHeader kicker="Small business services" title={["Practical help for", "your next step."]} lead="Tell us where you are and what you need. Your borough’s Small Business Support Specialist can help connect you with resources and guidance."
      aside={<figure className="neighborhood-portrait"><Image src={featured.image.src} alt={featured.image.alt} width={featured.image.width} height={featured.image.height} sizes="(max-width: 760px) 92vw, 33vw" priority /><figcaption><span>Meet the neighborhood</span><strong>{featured.name}</strong><Link href={`/stories#${featured.slug}`}>Read their story <Arrow /></Link></figcaption></figure>}>
      <Btn href="/connect">Talk to your local specialist</Btn>
    </PageHeader>
    <section className="service-details section-pad" aria-label="Our services">
      <div className="wrap">
        {offer.services.map((service) => {
          const story = "storySlug" in service ? stories.find((item) => item.slug === service.storySlug) : undefined
          return <article key={service.id} id={service.id} className="service-detail">
            <div><h2>{service.name}</h2><p>{service.summary}</p><Link href="/connect" className="text-link">Ask about {service.name.toLowerCase()} <Arrow /></Link></div>
            <div className={`service-detail__example ${story ? "service-detail__example--photo" : ""}`}>
              {story && <Image src={story.image.src} alt={story.image.alt} width={story.image.width} height={story.image.height} sizes="(max-width: 760px) 92vw, 22vw" />}
              <div><h3>{story ? "How the Network has helped" : "Start a conversation"}</h3><p>{service.proof}</p>{story && <Link className="text-link" href={`/stories#${story.slug}`}>Read {story.name}’s story <Arrow /></Link>}
              {service.id === "getting-online" && <p className="program-note"><strong>Open + Online:</strong> {openOnline.status} <Link href="/openandonline">See the program’s work</Link>.</p>}
            </div></div>
          </article>
        })}
      </div>
    </section>
    <section className="start-support"><div className="wrap start-support__inner"><div><h2>Not sure where to start?</h2><p>Contact us with your questions. We’ll help you find the right next step.</p></div><Btn href="/connect" variant="ink">Get business support</Btn></div></section>
  </>
}
