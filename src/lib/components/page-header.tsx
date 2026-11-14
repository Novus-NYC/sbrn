import type { ReactNode } from "react"
import { Lines } from "./ui"

type Props = {
  kicker: string
  title: readonly string[]
  lead?: ReactNode
  /** something particular to the page, set against the gate */
  aside?: ReactNode
  children?: ReactNode
  /** The gate's paint. Coral is the open sign: used where the page is the way in. */
  tone?: "night" | "coral"
  /**
   * What shows under the gate once it lifts: each page's own shop window
   * (real photos, real sites, real outlets). Decorative: the same content is on
   * the page below in full.
   */
  under?: ReactNode
  underClass?: string
}

/**
 * Every inner page opens on the gate, with its name painted across the slats.
 * Each page lifts it on something different: that is its own window.
 */
export default function PageHeader({ kicker, title, lead, aside, children, tone = "night", under, underClass = "" }: Props) {
  return (
    <>
    <header className={`phead slats ${tone === "coral" ? "slats--coral" : "slats--night"}`}>
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
      <span className="gatebar" aria-hidden="true" />
    </header>
    {under ? (
      <div className={`phead__under ${underClass}`} aria-hidden="true">
        <div className="phead__window">{under}</div>
      </div>
    ) : null}
    </>
  )
}
