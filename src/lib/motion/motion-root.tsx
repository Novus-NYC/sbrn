"use client"

import { animate } from "animejs"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { motionEnabled, refreshScenes } from "./scroll-rig"

declare global {
  interface Window {
    __sbrn?: boolean
  }
}

/**
 * Site-wide motion that needs no per-component code:
 *   [data-reveal]  fades / rolls in when it enters the viewport (CSS does the motion)
 *   [data-count]   counts up to its value once, when seen
 * Without JavaScript or with reduced motion none of this runs and every
 * element simply renders in its final state.
 */
export default function MotionRoot() {
  const pathname = usePathname()

  useEffect(() => {
    window.__sbrn = true
    document.fonts?.ready.then(() => refreshScenes()).catch(() => {})
  }, [])

  useEffect(() => {
    if (!motionEnabled()) return

    const seen = new WeakSet<Element>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || seen.has(entry.target)) continue
          seen.add(entry.target)
          io.unobserve(entry.target)
          const el = entry.target as HTMLElement
          el.classList.add("is-in")
          if (el.dataset.count !== undefined) countUp(el)
        }
      },
      { rootMargin: "0px 0px -7% 0px", threshold: 0.08 },
    )

    const scan = () => {
      document.querySelectorAll("[data-reveal]:not(.is-in), [data-count]:not(.is-in)").forEach((el) => {
        if (!seen.has(el)) io.observe(el)
      })
    }
    scan()
    // Content rendered after a client transition settles a frame later.
    const t = window.setTimeout(scan, 120)

    return () => {
      window.clearTimeout(t)
      io.disconnect()
    }
  }, [pathname])

  return null
}

function countUp(el: HTMLElement) {
  const end = Number(el.dataset.count)
  if (!Number.isFinite(end)) return
  const suffix = el.dataset.suffix ?? ""
  const state = { v: 0 }
  const format = (n: number) => Math.round(n).toLocaleString("en-US") + suffix
  el.textContent = format(0)
  animate(state, {
    v: end,
    duration: end > 100 ? 1700 : 900,
    ease: "outExpo",
    onUpdate: () => {
      el.textContent = format(state.v)
    },
    onComplete: () => {
      el.textContent = format(end)
    },
  })
}
