import Image from "next/image"
import { cta, hero, offer, stories } from "@/lib/data/site"
import { Arrow, ArrowLink, Btn } from "../ui"
import { Building } from "./building"
import MorningDriver from "./morning-driver"

/** Deterministic pseudo-random numbers so the skyline is identical on server and client. */
function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

function Skyline({ tone }: { tone: "night" | "day" }) {
  const rnd = seeded(7)
  const blocks: { x: number; w: number; h: number; tower: boolean; step: boolean }[] = []
  let x = 0
  while (x < 2400) {
    const w = 46 + Math.round(rnd() * 70)
    const h = 70 + Math.round(rnd() * 190)
    blocks.push({ x, w, h, tower: rnd() > 0.72, step: rnd() > 0.6 })
    x += w + Math.round(rnd() * 6)
  }
  return (
    <svg className={`skyline skyline--${tone}`} viewBox="0 0 2400 300" preserveAspectRatio="xMinYMax slice" aria-hidden="true" focusable="false">
      {blocks.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={300 - b.h} width={b.w} height={b.h} />
          {b.step ? <rect x={b.x + b.w * 0.2} y={300 - b.h - 16} width={b.w * 0.6} height="16" /> : null}
          {b.tower ? (
            <path d={`M${b.x + 10} ${300 - b.h}v-14h4v14M${b.x + 30} ${300 - b.h}v-14h4v14M${b.x + 6} ${300 - b.h - 14}h32v-22h-32zM${b.x + 4} ${300 - b.h - 36}h36l-18 -14z`} />
          ) : null}
        </g>
      ))}
    </svg>
  )
}

function LampPost({ at }: { at: number }) {
  return (
    <div className="fore__item fore__lamp" style={{ left: `${at}em` }}>
      <span className="fore__glow" />
      <svg viewBox="0 0 60 300" aria-hidden="true" focusable="false">
        <rect x="27" y="40" width="6" height="252" fill="#0d131c" />
        <rect x="22" y="278" width="16" height="22" fill="#0d131c" />
        <path d="M30 42q0 -30 22 -30" stroke="#0d131c" strokeWidth="5" fill="none" />
        <path d="M40 8h20l-3 12h-14z" fill="#0d131c" />
        <ellipse className="fore__bulb" cx="50" cy="21" rx="7" ry="3" fill="#ffe1a0" />
      </svg>
    </div>
  )
}

function Hydrant({ at }: { at: number }) {
  return (
    <div className="street__hydrant" style={{ left: `${at}em` }}>
      <svg viewBox="0 0 40 60" aria-hidden="true" focusable="false">
        <path d="M12 60V22a8 8 0 0 1 16 0v38z" fill="#c7382a" />
        <rect x="8" y="18" width="24" height="5" rx="1" fill="#a52c20" />
        <rect x="4" y="32" width="32" height="8" rx="2" fill="#a52c20" />
        <rect x="8" y="54" width="24" height="6" fill="#a52c20" />
        <circle cx="20" cy="14" r="4" fill="#a52c20" />
      </svg>
    </div>
  )
}

function StreetTree({ at }: { at: number }) {
  return (
    <div className="fore__item fore__tree" style={{ left: `${at}em` }}>
      <svg viewBox="0 0 200 560" aria-hidden="true" focusable="false">
        <path d="M100 560V190M100 300l-34 -56M101 262l36 -60M100 232l-16 -46" stroke="#15201c" strokeWidth="9" fill="none" strokeLinecap="round" />
        <circle cx="100" cy="112" r="92" fill="#1f4b3d" />
        <circle cx="52" cy="150" r="52" fill="#255848" />
        <circle cx="150" cy="146" r="54" fill="#1b4336" />
        <circle cx="104" cy="74" r="58" fill="#2a6352" />
        <circle cx="70" cy="96" r="26" fill="#316f5c" />
        <path d="M78 560v-44h44v44M78 536h44" stroke="#0d131c" strokeWidth="4" fill="none" />
      </svg>
    </div>
  )
}

export default function Morning() {
  const services = offer.services
  return (
    <section id="morning" className="morning" aria-label="Welcome">
      <div className="morning__stage">
        {/* ------------------------------------------------------------
            The hero is a closed roll-down gate. Scrolling raises it.
        ------------------------------------------------------------- */}
        <div className="herogate slats" data-herogate>
          <span className="herogate__glow" aria-hidden="true" />
          <span className="herogate__sweep" aria-hidden="true" />

          <div className="wrap herogate__grid">
            <div className="herogate__main">
              <h1 className="herogate__h1">
                <span className="display herogate__q" data-lines="" data-reveal="lines">
                  <span className="ln" style={{ ["--i" as string]: 0 }}>
                    <span>Are you a</span>
                  </span>
                  <span className="ln" style={{ ["--i" as string]: 1 }}>
                    <span>small business?</span>
                  </span>
                </span>{" "}
                <span className="voice herogate__a" data-reveal="" style={{ ["--d" as string]: "160ms" }}>
                  {hero.answer}
                </span>
              </h1>
              <p className="herogate__body" data-reveal="" style={{ ["--d" as string]: "220ms" }}>
                {hero.body}
              </p>
              <div className="herogate__actions" data-reveal="" style={{ ["--d" as string]: "280ms" }}>
                <Btn href={cta.href}>{cta.label}</Btn>
                <a className="btn btn--ghost" href="#offer" data-offer-jump="">
                  <span>See what we offer</span>
                  <Arrow dir="down" className="btn__arrow btn__arrow--down" />
                </a>
              </div>
            </div>

            <ul className="greetings" aria-label="We are here to help you, in eight more languages" data-reveal="" style={{ ["--d" as string]: "360ms" }}>
              {hero.greetings.map((g, i) => (
                <li key={g.lang} lang={g.lang} dir={"dir" in g ? g.dir : undefined} style={{ ["--i" as string]: i }}>
                  {g.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="wrap herogate__foot" data-reveal="" style={{ ["--d" as string]: "440ms" }}>
            <div className="herogate__trust">
              <p className="label">With the Chambers of Commerce of all five boroughs</p>
              <Image
                src="/media/partners/chambers-strip.webp"
                alt="Bronx, Brooklyn, Manhattan, Queens and Staten Island Chambers of Commerce"
                width={879}
                height={110}
                sizes="(max-width: 720px) 88vw, 520px"
                className="herogate__logos"
                priority
              />
            </div>
            <p className="herogate__cue label" aria-hidden="true">
              <span>Scroll to raise the gate</span>
              <Arrow dir="down" className="herogate__cuearrow" />
            </p>
          </div>

          <span className="gatebar" aria-hidden="true" />
        </div>

        {/* ------------------------------------------------------------
            Behind the gate: the block, before sunrise.
        ------------------------------------------------------------- */}
        <div className="offer" id="offer">
          <div className="offer__head">
            <h2 className="label offer__h">{offer.heading}</h2>
            <p className="label offer__count tnum" aria-hidden="true">
              <span data-offer-count="">1</span> / {services.length}
            </p>
          </div>

          <p className="voice offer__intro">{offer.intro}</p>

          <div className="scene" aria-hidden="true">
            <div className="sky">
              <span className="sky__dawn" />
              <span className="sky__night" />
              <span className="sky__flare" />
              <span className="sky__sun" />
            </div>
            <div className="skyline-wrap">
              <Skyline tone="day" />
              <Skyline tone="night" />
            </div>
            <div className="street" data-street="">
              <div className="street__row">
                <Building filler={0} />
                <Building filler={1} />
                <Building filler={2} />
                {services.map((s, i) => (
                  <Building key={s.id} kind={s.shop} sign={s.name.toUpperCase()} index={i} />
                ))}
                <Building filler={3} />
                <Building filler={4} />
                <Building filler={5} />
              </div>
              <Hydrant at={219} />
              <Hydrant at={355} />
            </div>
            <div className="road">
              <span className="road__shade" />
            </div>
            <div className="fore" data-fore="">
              {/* This layer moves 1.35x faster than the block during the walk and settles
                  onto it for the wide shot. Positions are chosen so a trunk or pole never
                  stands in front of the shop being read, in either state. */}
              <LampPost at={88} />
              <StreetTree at={132} />
              <LampPost at={176} />
              <LampPost at={306} />
              <StreetTree at={352} />
              <LampPost at={410} />
              <StreetTree at={470} />
              <LampPost at={520} />
            </div>
          </div>

          <ol className="offer__list">
            {services.map((s, i) => (
              <li key={s.id} className="offer__item" data-item={i}>
                <h3 className="display offer__name">
                  <span className="ln">
                    <span>{s.name}</span>
                  </span>
                </h3>
                <div className="offer__detail">
                  <p className="offer__proof">{s.proof}</p>
                  {s.storySlug ? (
                    <ArrowLink href={`/stories#${s.storySlug}`}>
                      Read the story
                      <span className="sr-only"> of {stories.find((t) => t.slug === s.storySlug)?.name}</span>
                    </ArrowLink>
                  ) : (
                    <ArrowLink href={cta.href}>Find your Chamber</ArrowLink>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <div className="offer__final">
            <p className="display offer__promise">
              {hero.promise.map((line, i) => (
                <span key={line} className="ln">
                  <span className={i === hero.promise.length - 1 ? "offer__promise-em" : undefined}>{line}</span>{" "}
                </span>
              ))}
            </p>
            <div className="offer__finalcta">
              <Btn href={cta.href}>{cta.label}</Btn>
            </div>
          </div>

          <div className="offer__nav">
            <ul className="offer__ticks" aria-label="Services on the block">
              {services.map((s, i) => (
                <li key={s.id}>
                  <button type="button" data-go={i} aria-label={`Go to ${s.name}`}>
                    <i />
                  </button>
                </li>
              ))}
            </ul>
            <a className="label offer__skip" href="#who">
              Skip the walk
            </a>
          </div>
        </div>
      </div>
      <MorningDriver count={services.length} />
    </section>
  )
}
