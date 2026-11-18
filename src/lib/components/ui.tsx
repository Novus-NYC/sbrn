import Link from "next/link"
import type { ReactNode } from "react"

type ArrowDir = "right" | "out" | "up" | "down"

const ARROW_PATH: Record<ArrowDir, string> = {
  right: "M3 12h17M13 5l7 7-7 7",
  out: "M6 18 18 6M8 6h10v10",
  up: "M12 21V4M5 11l7-7 7 7",
  down: "M12 3v17M5 13l7 7 7-7",
}

export function Arrow({ dir = "right", className }: { dir?: ArrowDir; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" aria-hidden="true">
      <path d={ARROW_PATH[dir]} />
    </svg>
  )
}

function isExternal(href: string) {
  return /^(https?:)?\/\//.test(href)
}

function isPlainAnchor(href: string) {
  return href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#")
}

type SmartLinkProps = {
  href: string
  className?: string
  children: ReactNode
  "aria-label"?: string
  "aria-current"?: "page" | undefined
  "data-no-transition"?: boolean
}

/** One link primitive: internal routes use next/link, external links open safely in a new tab. */
export function SmartLink({ href, className, children, ...rest }: SmartLinkProps) {
  if (isExternal(href)) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    )
  }
  if (isPlainAnchor(href)) {
    return (
      <a href={href} className={className} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  )
}

type BtnProps = {
  href: string
  children: ReactNode
  variant?: "coral" | "ghost" | "ink" | "line"
  size?: "md" | "sm"
  arrow?: ArrowDir | false
  className?: string
}

/** Primary action. The hover fill rolls up from the sill like a shutter. */
export function Btn({ href, children, variant = "coral", size = "md", arrow, className = "" }: BtnProps) {
  const dir: ArrowDir | false = arrow === undefined ? (isExternal(href) ? "out" : "right") : arrow
  return (
    <SmartLink href={href} className={`btn btn--${variant} ${size === "sm" ? "btn--sm" : ""} ${className}`}>
      <span>{children}</span>
      {dir ? <Arrow dir={dir} className={`btn__arrow btn__arrow--${dir}`} /> : null}
    </SmartLink>
  )
}

/** Secondary action: label plus a boxed arrow that travels upward on hover. */
export function ArrowLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  const dir: ArrowDir = isExternal(href) ? "out" : "right"
  return (
    <SmartLink href={href} className={`alink ${className}`}>
      <span>{children}</span>
      <span className="alink__mark" aria-hidden="true">
        <Arrow dir={dir} />
        <Arrow dir={dir} />
      </span>
    </SmartLink>
  )
}

/** Text that rolls up to a coral copy of itself on hover (nav and index links). */
export function Roll({ children }: { children: string }) {
  return (
    <span className="roll">
      <span data-text={children}>{children}</span>
    </span>
  )
}

/** The logo lockup set in type: NYC over two tracked lines, as in the brand mark. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`} translate="no">
      <span className="wordmark__nyc">NYC</span>{" "}
      <span className="wordmark__rest">
        <span>Small Business</span> <span>Resource Network</span>
      </span>
    </span>
  )
}

type LinesProps = {
  lines: readonly ReactNode[]
  as?: "h1" | "h2" | "h3" | "p"
  className?: string
  /** extra delay before the first line, in ms */
  delay?: number
  id?: string
}

/**
 * A display heading with art-directed line breaks. With motion on, each line
 * rolls up out of its own sill when the heading enters the viewport.
 */
export function Lines({ lines, as: Tag = "h2", className = "", delay = 0, id }: LinesProps) {
  return (
    <Tag id={id} className={className} data-lines="" data-reveal="lines" style={{ ["--d" as string]: `${delay}ms` }}>
      {lines.map((line, i) => (
        <span key={i} className="ln" style={{ ["--i" as string]: i }}>
          <span>{line}</span>
          {i < lines.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  )
}
