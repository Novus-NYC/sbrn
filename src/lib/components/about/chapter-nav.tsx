"use client"

import { useEffect, useRef, useState } from "react"

const chapters = [
  ["network-story", "How it began"],
  ["support", "How we help"],
  ["outcomes", "Business outcomes"],
  ["chambers", "Borough chambers"],
] as const

export default function ChapterNav() {
  const rail = useRef<HTMLElement>(null)
  const [current, setCurrent] = useState<string | null>(null)

  useEffect(() => {
    const nav = rail.current
    if (!nav) return

    const sections = chapters.flatMap(([id]) => {
      const section = document.getElementById(id)
      return section ? [section] : []
    })
    let observer: IntersectionObserver | undefined

    function observe() {
      observer?.disconnect()
      if (!nav) return

      const style = window.getComputedStyle(nav)
      const marker = style.position === "sticky"
        ? Number.parseFloat(style.top) + nav.offsetHeight + 24
        : window.innerHeight / 3
      const line = Math.min(window.innerHeight - 1, Math.round(marker))
      observer = new IntersectionObserver((entries) => {
        const active = entries.find((entry) => entry.isIntersecting)
        setCurrent(active?.target.id ?? null)
      }, { rootMargin: `-${line}px 0px -${window.innerHeight - line - 1}px 0px` })
      sections.forEach((section) => observer?.observe(section))
    }

    observe()
    window.addEventListener("resize", observe)
    return () => {
      window.removeEventListener("resize", observe)
      observer?.disconnect()
    }
  }, [])

  return (
    <nav className="about-chapters" aria-label="On this page" ref={rail}>
      <ul className="wrap">
        {chapters.map(([id, label]) => (
          <li key={id}><a href={`#${id}`} aria-current={current === id ? "location" : undefined}>{label}</a></li>
        ))}
      </ul>
    </nav>
  )
}
