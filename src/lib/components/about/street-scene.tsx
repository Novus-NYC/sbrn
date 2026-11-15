"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { addScene } from "@/lib/motion/scroll-rig"

/** Move the street photograph a short distance as the story passes. */
export default function StreetScene({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = ref.current
    if (!track) return

    const desktopMotion = window.matchMedia("(min-width: 901px) and (prefers-reduced-motion: no-preference)")
    let stop: (() => void) | undefined
    const sync = () => {
      stop?.()
      stop = desktopMotion.matches
        ? addScene(track, {
            onUpdate: ({ progress }) => {
              track.style.setProperty("--street-shift", `${(0.5 - progress) * 42}px`)
              track.style.setProperty("--street-scale", String(1.03 + progress * 0.08))
            },
          })
        : undefined
    }
    sync()
    desktopMotion.addEventListener("change", sync)
    return () => {
      stop?.()
      desktopMotion.removeEventListener("change", sync)
    }
  }, [])

  return <div className="about-story__track" ref={ref}>{children}</div>
}
