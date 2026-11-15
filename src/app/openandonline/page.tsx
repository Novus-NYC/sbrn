import type { Metadata } from "next"
import Image from "next/image"
import BrowserFrame from "@/lib/components/browser-frame"
import ConnectBand from "@/lib/components/connect-band"
import BuildSteps from "@/lib/components/online/build-steps"
import PageHeader from "@/lib/components/page-header"
import { Lines } from "@/lib/components/ui"
import { openOnline } from "@/lib/data/site"

export const metadata: Metadata = {
  title: "Open + Online",
  description:
    "Open + Online builds free websites, logos and branding, and offers expert SEO consulting, for New York City small businesses. See how it works.",
}

/** Column spans for the project wall: an uneven hang, the way frames go up on a real wall. */
const SPANS = ["wall__a", "wall__b", "wall__c", "wall__c", "wall__c", "wall__b", "wall__a", "wall__c", "wall__c", "wall__c", "wall__a", "wall__b"]

export default function OpenOnlinePage() {
  return (
    <>
      <PageHeader
        kicker="A program of the Network"
        title={["Open", "+ Online"]}
        heroImage={{ src: "/media/projects/harlems-heaven-hats.webp", alt: "Website project created for Harlem’s Heaven Hats" }}
        lead={openOnline.lead}
        aside={
          <div className="doorsign" role="note">
            <span className="doorsign__string" aria-hidden="true" />
            <p className="label doorsign__tag">Notice</p>
            <p className="display doorsign__text">{openOnline.status}</p>
          </div>
        }
      >
        <p className="phead__offer">{openOnline.offer}</p>
      </PageHeader>

      {/* ---- how a project runs: the page in the browser builds itself as you read ---- */}
      <section className="build" data-tone="night" aria-labelledby="build-h">
        <div className="wrap">
          <Lines id="build-h" as="h2" className="display build__h" lines={["How our website", "projects work"]} />
        </div>
        <BuildSteps className="wrap grid12 build__grid">
          <div className="build__stage" aria-hidden="true">
            <div className="mock">
              <div className="mock__bar">
                <i />
                <i />
                <i />
                <b>
                  <span className="mock__lock" />
                  yourbusiness.com
                </b>
              </div>
              <div className="mock__page">
                <div className="mock__nav">
                  <span className="mock__logo" />
                  <span className="mock__links">
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
                <div className="mock__hero">
                  <div className="mock__copy">
                    <span className="mock__line mock__line--1" />
                    <span className="mock__line mock__line--2" />
                    <span className="mock__line mock__line--3" />
                    <span className="mock__btn" />
                  </div>
                  <div className="mock__img">
                    <span className="mock__play" />
                  </div>
                </div>
                <div className="mock__row">
                  <i />
                  <i />
                  <i />
                </div>
                <ul className="mock__check">
                  <li>Logo</li>
                  <li>Photos</li>
                  <li>Words</li>
                </ul>
                <span className="mock__pin mock__pin--1">1</span>
                <span className="mock__pin mock__pin--2">2</span>
                <div className="mock__scrub">
                  <span />
                </div>
                <span className="mock__open">Open</span>
              </div>
            </div>
          </div>

          <ol className="build__steps">
            {openOnline.steps.map((step, i) => (
              <li key={step.title} className="step" data-step-item={i + 1}>
                <span className="display step__n tnum" aria-hidden="true">
                  {i + 1}
                </span>
                <div className="step__body">
                  <Image src={step.icon} alt="" width={256} height={256} sizes="64px" className="step__icon" />
                  <h3 className="display step__title">{step.title}</h3>
                  <p className="step__text">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </BuildSteps>
      </section>

      {/* ---- is it really free? ---- */}
      <section className="free section-pad" data-tone="day" aria-labelledby="free-h">
        <div className="wrap grid12">
          <div className="free__head">
            <h2 id="free-h" className="voice free__h" data-reveal="">
              Is it really free?
            </h2>
            <p className="free__stamp display" data-reveal="" style={{ ["--d" as string]: "200ms" }} aria-hidden="true">
              Free
            </p>
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
          <Lines id="wall-h" as="h2" className="display wall__h" lines={["Our website projects,", "and the small businesses", "behind them"]} />
          <ul className="grid12 wall__grid">
            {openOnline.projects.map((p, i) => (
              <li key={p.slug} className={SPANS[i % SPANS.length]} data-reveal="" style={{ ["--d" as string]: `${(i % 3) * 80}ms` }}>
                <BrowserFrame project={p} sizes="(max-width: 860px) 92vw, 45vw" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- funders ---- */}
      <section className="funders section-pad" data-tone="night" aria-labelledby="funders-h">
        <div className="wrap grid12">
          <div className="funders__head">
            <h2 id="funders-h" className="voice funders__h" data-reveal="">
              Thank you to our funders
            </h2>
            <div className="funders__lead" data-reveal="" style={{ ["--d" as string]: "120ms" }}>
              <Image src="/media/partners/wells-fargo.webp" alt="Wells Fargo" width={900} height={204} sizes="240px" />
            </div>
          </div>
          <div className="funders__tiers">
            {openOnline.funders.slice(1).map((tier, t) => (
              <ul key={t} className={`funders__tier funders__tier--${t + 1}`} data-reveal="" style={{ ["--d" as string]: `${t * 90}ms` }}>
                {tier.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </section>

      <ConnectBand />
    </>
  )
}
