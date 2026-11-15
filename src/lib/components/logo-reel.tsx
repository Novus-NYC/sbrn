"use client"

import Image from "next/image"
import { useId, useState } from "react"

type Mark = {
  name: string
  href?: string
  caption?: string
  image?: { src: string; width: number; height: number }
}

type Row = { marks: readonly Mark[]; repeat?: number }

export default function LogoReel({ rows, showAllLabel }: { rows: readonly Row[]; showAllLabel: string }) {
  const id = useId()
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="logo-reel" data-expanded={expanded}>
      <div className="wrap logo-reel__controls">
        <button type="button" aria-controls={id} aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>
          {expanded ? "Resume scrolling" : showAllLabel}
        </button>
      </div>
      <div id={id} className="logo-reel__rows">
        {rows.map(({ marks, repeat = 1 }, rowIndex) => (
          <div className="logo-reel__row" key={rowIndex}>
            <div className="logo-reel__track">
              {[false, true].map((duplicate) => (
                <ul className="logo-reel__group" aria-hidden={duplicate || undefined} key={String(duplicate)}>
                  {Array.from({ length: repeat }, (_, copy) =>
                    marks.map(({ name, href, image, caption }) => {
                      const hidden = duplicate || copy > 0
                      const external = href?.startsWith("https://") || href?.startsWith("http://")
                      const title = caption && !name.includes(caption) ? `${caption} on ${name}` : name
                      const linkLabel = external ? `Read from ${title} (opens in a new tab)` : `Find ${title} in the Media archive`
                      const mark = image ? (
                        <>
                          <Image src={image.src} width={image.width} height={image.height} alt={caption ? "" : name} loading="eager" unoptimized />
                          {caption && <span className="logo-reel__caption">{caption}</span>}
                        </>
                      ) : (
                        <span className="logo-reel__name">{name}</span>
                      )

                      return (
                        <li className="logo-reel__item" aria-hidden={hidden || undefined} key={name + copy}>
                          {href ? (
                            <a className="logo-reel__mark" href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} tabIndex={hidden ? -1 : undefined} aria-label={linkLabel}>
                              {mark}
                            </a>
                          ) : (
                            <div className="logo-reel__mark">{mark}</div>
                          )}
                        </li>
                      )
                    }),
                  )}
                </ul>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
