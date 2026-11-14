import type { ReactNode } from "react"
import { Lines } from "./ui"

type Props = {
  kicker: string
  title: readonly string[]
  lead?: ReactNode
  /** something particular to the page, set against the gate */
  aside?: ReactNode
  children?: ReactNode
}

/** Every inner page opens on the gate, with its name painted across the slats. */
export default function PageHeader({ kicker, title, lead, aside, children }: Props) {
  return (
    <header className="phead slats slats--night">
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
  )
}
