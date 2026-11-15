import type { ReactNode } from "react"
import { Lines } from "./ui"
import ParallaxImage from "./parallax-image"

type Props = {
  kicker: string
  title: readonly string[]
  lead?: ReactNode
  /** A page-specific supporting detail. */
  aside?: ReactNode
  children?: ReactNode
  /** Coral highlights the path to get in touch. */
  tone?: "night" | "coral"
  heroImage?: { src: string; alt: string; credit?: string; source?: string }
}

/**
 * Every inner page opens on the gate, with its name painted across the slats.
 * Each page lifts it on something different: that is its own window.
 */
export default function PageHeader({ kicker, title, lead, aside, children, tone = "night", heroImage }: Props) {
  return (
    <>
    <header className={`phead ${heroImage ? "phead--photo" : ""} ${tone === "coral" ? "phead--coral" : ""}`}>
      {heroImage ? <ParallaxImage src={heroImage.src} alt={heroImage.alt} priority className="phead__photo" /> : null}
      <div className="wrap phead__grid">
        <div className="phead__main">
          <p className="label phead__kicker" data-reveal="">
            {kicker}
          </p>
          <Lines as="h1" className="display phead__title" lines={title} />
          {lead ? (
            <p className="phead__lead" data-reveal="" style={{ ["--d" as string]: "180ms" }}>
              {lead}
            </p>
          ) : null}
          {children ? (
            <div className="phead__extra" data-reveal="" style={{ ["--d" as string]: "250ms" }}>
              {children}
            </div>
          ) : null}
        </div>
        {aside ? (
          <div className="phead__aside" data-reveal="" style={{ ["--d" as string]: "320ms" }}>
            {aside}
          </div>
        ) : null}
      </div>

      {heroImage?.source && heroImage.credit ? <a className="phead__credit" href={heroImage.source} target="_blank" rel="noreferrer">Photo: {heroImage.credit}</a> : null}
    </header>

    </>
  )
}
