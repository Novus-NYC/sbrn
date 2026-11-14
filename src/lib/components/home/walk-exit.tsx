"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"

/** The scene reserves the toolbar's actual height, including wrapped translations. */
export default function WalkExit() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const bar = ref.current
    const container = bar?.parentElement
    if (!bar || !container) return
    const measure = () => container.style.setProperty("--walk-toolbar-height", `${bar.getBoundingClientRect().height}px`)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(bar)
    return () => {
      observer.disconnect()
      container.style.removeProperty("--walk-toolbar-height")
    }
  }, [])
  return <aside ref={ref} className="walk-exit" aria-label="Leave the interactive experience"><span>Optional interactive walk</span><Link href="/services">Skip the walk. View all services</Link></aside>
}
