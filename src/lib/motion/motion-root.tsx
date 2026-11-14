"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { refreshScenes } from "./scroll-rig"

declare global {
  interface Window { __sbrn?: boolean }
}

/** Content is visible by default. Optional entrances never control access to it. */
export default function MotionRoot() {
  const pathname = usePathname()

  useEffect(() => {
    window.__sbrn = true
    document.fonts?.ready.then(() => refreshScenes()).catch(() => {})
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => document.documentElement.classList.toggle("motion", !preference.matches)
    sync()
    preference.addEventListener("change", sync)
    return () => preference.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add("is-in")
        observer.unobserve(entry.target)
      }
    }, { threshold: 0.08 })
    document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [pathname])

  return null
}
