import type { Metadata } from "next"
import Image from "next/image"
import BrowserFrame from "@/lib/components/browser-frame"
import ConnectBand from "@/lib/components/connect-band"
import PageHeader from "@/lib/components/page-header"
import { Lines } from "@/lib/components/ui"
import { openOnline } from "@/lib/data/site"

export const metadata: Metadata = {
  title: "Open + Online",
  description:
    "Open + Online builds free websites, logos and branding, and offers expert SEO consulting, for New York City small businesses. See how it works.",
}

const featuredProjects = openOnline.projects.filter((project) => ["harlems-heaven-hats", "casa-lu-art-space"].includes(project.slug))

export default function OpenOnlinePage() {
  return (
    <>
      <PageHeader
        kicker="A program of the Network"
        title={["Open", "+ Online"]}
        lead={openOnline.lead}
        aside={
          <div className="project-showcase">
            <p className="project-showcase__label">Local businesses. A bigger online presence.</p>
            {featuredProjects.map((project) => <BrowserFrame key={project.slug} project={project} sizes="(max-width: 760px) 75vw, 30vw" />)}
            <a href="#wall-h" className="text-link">Explore all {openOnline.projects.length} projects</a>
          </div>
        }
      >
        <p className="phead__offer">{openOnline.offer}</p>
        <div className="program-status" role="note">
          <h2>Applications are closed</h2>
          <p>{openOnline.status}</p>
          <a href="/connect" className="text-link">Contact us about other support</a>
        </div>
      </PageHeader>

      <section className="program-process section-pad" aria-labelledby="build-h">
        <div className="wrap">
          <div className="section-heading"><div><p className="section-tag">The Open + Online experience</p><h2 id="build-h">How our website projects work</h2></div></div>
          <ol className="program-process__steps">
            {openOnline.steps.map((step, i) => (
              <li key={step.title}>
                <span className="program-process__number" aria-hidden="true">{i + 1}</span>
                <h3>{step.title}</h3><p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- is it really free? ---- */}
      <section className="free section-pad" data-tone="day" aria-labelledby="free-h">
        <div className="wrap grid12">
          <div className="free__head">
            <h2 id="free-h" className="voice free__h" data-reveal="">
              Is it really free?
            </h2>
          </div>
          <ul className="free__list">
            {openOnline.free.map((f, i) => (
              <li key={f.item} className="free__row" data-reveal="" style={{ ["--d" as string]: `${i * 70}ms` }}>
                <h3 className="display free__item">{f.item}</h3>
                <p>{f.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- the work ---- */}
      <section className="wall section-pad" data-tone="concrete" aria-labelledby="wall-h">
        <div className="wrap">
          <div className="project-wall__heading"><div><p className="section-tag">Made for the neighborhood</p><Lines id="wall-h" as="h2" className="display wall__h" lines={["Local businesses.", "Individual stories."]} /></div><p>From fashion and food to art and travel, explore the websites created through Open + Online.</p></div>
          <ul className="grid12 wall__grid">
            {openOnline.projects.map((p, i) => (
              <li key={p.slug} data-reveal="" style={{ ["--d" as string]: `${(i % 3) * 80}ms` }}>
                <BrowserFrame project={p} sizes="(max-width: 860px) 92vw, 45vw" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="supporters section-pad" aria-labelledby="funders-h">
        <div className="wrap">
          <div className="supporters__intro"><div><p className="section-tag">Investing in New York’s small businesses</p><h2 id="funders-h">Thank you to our funders</h2><p>The support behind NYC Small Biz: Open + Online.</p></div>
            <div className="supporters__logo"><Image src="/media/partners/wells-fargo.webp" alt="Wells Fargo" width={900} height={204} sizes="220px" /></div>
          </div>
          <div className="supporters__groups">
            {openOnline.funders.slice(1).map((group, i) => (
              <ul key={i} className={`supporters__group ${i === 0 ? "supporters__group--featured" : ""}`}>
                {group.map((name) => <li key={name}>{name}</li>)}
              </ul>
            ))}
          </div>
        </div>
      </section>

      <ConnectBand />
    </>
  )
}
