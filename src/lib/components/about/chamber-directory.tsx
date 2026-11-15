"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Arrow } from "@/lib/components/ui"
import { chambers, mailto, type BoroughId } from "@/lib/data/site"

export default function ChamberDirectory() {
  const [active, setActive] = useState<BoroughId | null>(null)
  const list = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const directory = list.current
    if (!directory) return

    const boroughForRow = new Map(Array.from(directory.children, (row, index) => [row, chambers[index].id]))
    const desktopMotion = window.matchMedia("(min-width: 901px) and (prefers-reduced-motion: no-preference)")
    let observer: IntersectionObserver | undefined

    const observe = () => {
      observer?.disconnect()
      if (!desktopMotion.matches) return

      const center = Math.round(window.innerHeight * 0.57)
      const bottom = window.innerHeight - center - 1
      observer = new IntersectionObserver((entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible && !directory.contains(document.activeElement)) {
          setActive(boroughForRow.get(visible.target) ?? null)
        }
      }, { rootMargin: `-${center}px 0px -${bottom}px 0px` })
      boroughForRow.forEach((_, row) => observer?.observe(row))
    }

    observe()
    window.addEventListener("resize", observe)
    desktopMotion.addEventListener("change", observe)
    return () => {
      window.removeEventListener("resize", observe)
      desktopMotion.removeEventListener("change", observe)
      observer?.disconnect()
    }
  }, [])

  return (
    <div className="about-atlas__layout">
      <nav className="about-atlas__map" aria-label="Find a borough on the map">
        <div className="about-atlas__frame">
          <div className="about-atlas__canvas">
            <Image
              src="/media/brand/nyc-street-map.webp"
              alt=""
              fill
              sizes="(max-width: 900px) 164vw, 86vw"
              quality={60}
            />
            <ul className="about-atlas__pins">
              {chambers.map((chamber) => (
                <li
                  key={chamber.id}
                  className={`about-atlas__pin about-atlas__pin--${chamber.id}`}
                  data-active={active === chamber.id}
                  style={{ left: `${chamber.pin.x}%`, top: `${chamber.pin.y}%` }}
                >
                  <a
                    href={`#chamber-${chamber.id}`}
                    aria-label={`Find ${chamber.borough} chamber contact details`}
                    onFocus={() => setActive(chamber.id)}
                    onMouseEnter={() => setActive(chamber.id)}
                    onClick={() => setActive(chamber.id)}
                  >
                    <span className="about-atlas__dot" aria-hidden="true" />
                    <span className="about-atlas__pin-label">{chamber.borough}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <ul className="about-atlas__list" ref={list}>
        {chambers.map((chamber) => (
          <li
            key={chamber.id}
            id={`chamber-${chamber.id}`}
            className="about-atlas__entry"
            data-active={active === chamber.id}
            onMouseEnter={() => setActive(chamber.id)}
            onFocus={() => setActive(chamber.id)}
            tabIndex={-1}
          >
            <h3 className="display about-atlas__borough">{chamber.borough}</h3>
            <p className="about-atlas__name">{chamber.name}</p>
            <div className="about-atlas__links">
              <a href={mailto(chamber.email)}>{chamber.email}</a>
              <a href={chamber.url} target="_blank" rel="noreferrer" aria-label={`Chamber website for ${chamber.borough}`}>
                Chamber website <Arrow dir="out" />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
