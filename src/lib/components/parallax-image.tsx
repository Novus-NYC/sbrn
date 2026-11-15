"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"

export default function ParallaxImage({ src, alt, sizes = "100vw", className = "", priority = false, optimized = false }: {
  src: string
  alt: string
  sizes?: string
  className?: string
  priority?: boolean
  optimized?: boolean
}) {
  const frame = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = frame.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let raf = 0
    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const distance = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight
      el.style.setProperty("--parallax-shift", `${Math.max(-1, Math.min(1, distance)) * -9}%`)
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update) }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { update(); window.addEventListener("scroll", schedule, { passive: true }) }
      else window.removeEventListener("scroll", schedule)
    })
    observer.observe(el)
    return () => { observer.disconnect(); window.removeEventListener("scroll", schedule); cancelAnimationFrame(raf) }
  }, [])
  return <div ref={frame} className={`parallax-image ${className}`}><Image src={src} alt={alt} fill sizes={sizes} priority={priority} unoptimized={!optimized} /></div>
}
