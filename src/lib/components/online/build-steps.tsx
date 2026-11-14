"use client"

import { useEffect, useRef, type ReactNode } from "react"

/**
 * Watches which step sits at the middle of the viewport and writes it to
 * `data-step` on the section, so the sticky browser mock can build itself
 * with plain CSS. Without JavaScript the mock shows the finished site.
 */
export default function BuildSteps({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root || !document.documentElement.classList.contains("motion")) return
    const steps = Array.from(root.querySelectorAll<HTMLElement>("[data-step-item]"))
    root.dataset.step = "0"
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) root.dataset.step = (entry.target as HTMLElement).dataset.stepItem ?? "0"
        }
        steps.forEach((el) => el.classList.toggle("is-current", el.dataset.stepItem === root.dataset.step))
      },
      { rootMargin: "-46% 0px -46% 0px" },
    )
    steps.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={className} data-step="4">
      {children}
    </div>
  )
}
