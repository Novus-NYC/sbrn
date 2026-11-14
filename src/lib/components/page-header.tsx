import Link from "next/link"
import type { ReactNode } from "react"

type Props = {
  kicker: string
  title: readonly string[]
  lead?: ReactNode
  aside?: ReactNode
  children?: ReactNode
  tone?: "night" | "coral"
}

/** Static page introductions keep the heading and next action immediately readable. */
export default function PageHeader({ kicker, title, lead, aside, children, tone = "night" }: Props) {
  return <header className={`page-intro page-intro--${tone}`}>
    <div className="wrap">
      <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>{kicker}</span></nav>
      <div className={`page-intro__grid ${aside ? "" : "page-intro__grid--single"}`}>
        <div><h1>{title.join(" ")}</h1>{lead && <p className="page-intro__lead">{lead}</p>}{children && <div className="page-intro__extra">{children}</div>}</div>
        {aside && <div className="page-intro__aside">{aside}</div>}
      </div>
    </div>
  </header>
}
