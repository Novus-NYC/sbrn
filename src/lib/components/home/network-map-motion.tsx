"use client"

import { animate, createSpring, stagger, svg } from "animejs"
import { useEffect } from "react"
import { motionEnabled } from "@/lib/motion/scroll-rig"

/** When the map arrives: the route draws itself, then each borough lands on it. */
export default function NetworkMapMotion() {
  useEffect(() => {
    if (!motionEnabled()) return
    const root = document.querySelector<HTMLElement>("[data-net]")
    if (!root) return
    const route = root.querySelector<SVGPathElement>(".net__route")
    const dots = Array.from(root.querySelectorAll<HTMLElement>(".net__dot"))
    const names = Array.from(root.querySelectorAll<HTMLElement>(".net__name"))
    if (!route) return

    root.classList.add("is-armed")
    let played = false
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || played) return
        played = true
        io.disconnect()
        root.classList.add("is-live")
        animate(svg.createDrawable(route), { draw: ["0 0", "0 1"], duration: 2200, ease: "inOutCubic" })
        animate(dots, {
          scale: [0, 1],
          opacity: [0, 1],
          delay: stagger(260, { start: 250 }),
          ease: createSpring({ stiffness: 220, damping: 13 }),
        })
        animate(names, {
          opacity: [0, 1],
          y: [10, 0],
          duration: 620,
          delay: stagger(260, { start: 420 }),
          ease: "outCubic",
        })
      },
      { threshold: 0.3 },
    )
    io.observe(root)
    return () => io.disconnect()
  }, [])
  return null
}
