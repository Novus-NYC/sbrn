import type { ReactNode } from "react"
import TranslationNotice from "@/lib/i18n/translation-notice"

type Run = { text: string; href?: string; bold?: boolean }
type Block =
  | { type: "h"; level: number; text: string }
  | { type: "p"; runs: Run[] }
  | { type: "list"; items: Run[][] }
  | { type: "address"; lines: string[] }

export type LegalData = { dateLabel?: string; date?: string; blocks: Block[] }

function renderRuns(runs: Run[]): ReactNode {
  return runs.map((r, i) => {
    let node: ReactNode = r.text
    if (r.href) {
      const external = /^https?:/.test(r.href)
      node = (
        <a className="ulink" href={r.href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {r.text}
        </a>
      )
    }
    if (r.bold) node = <strong>{node}</strong>
    return <span key={i}>{node}</span>
  })
}

const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

/** Renders the source legal text as-is, with a contents rail built from its own headings. */
export default function LegalDoc({ data }: { data: LegalData }) {
  const sections = data.blocks.filter((b): b is Extract<Block, { type: "h" }> => b.type === "h" && b.level === 2)
  return (
    <div className="legal wrap grid12" data-tone="day">
      <nav className="legal__toc" aria-label="On this page">
        <p className="label">On this page</p>
        <ol>
          {sections.map((s) => (
            <li key={s.text}>
              <a href={`#${slug(s.text)}`}>{s.text}</a>
            </li>
          ))}
        </ol>
      </nav>
      <article className="legal__body">
        <TranslationNotice />
        {data.blocks.map((b, i) => {
          if (b.type === "h") {
            return b.level === 2 ? (
              <h2 key={i} id={slug(b.text)} className="legal__h2">
                {b.text}
              </h2>
            ) : (
              <h3 key={i} className="legal__h3">
                {b.text}
              </h3>
            )
          }
          if (b.type === "list") {
            return (
              <ul key={i} className="legal__list">
                {b.items.map((runs, j) => (
                  <li key={j}>{renderRuns(runs)}</li>
                ))}
              </ul>
            )
          }
          if (b.type === "address") {
            return (
              <address key={i} className="legal__addr">
                {b.lines.map((l, j) => (
                  <span key={j}>{l}</span>
                ))}
              </address>
            )
          }
          return <p key={i}>{renderRuns(b.runs)}</p>
        })}
      </article>
    </div>
  )
}
