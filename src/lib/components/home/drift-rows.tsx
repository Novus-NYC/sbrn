"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { addScene, motionEnabled } from "@/lib/motion/scroll-rig"

/**
 * Rows of frames that slide in opposite directions as the section passes
 * through the viewport. Without motion the rows are ordinary scrollable lists.
 */
export default function DriftRows({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root || !motionEnabled()) return
    const rows = Array.from(root.querySelectorAll<HTMLElement>("[data-drift]"))
    let spans: number[] = []
    const measure = () => {
      spans = rows.map((row) => Math.max(0, row.scrollWidth - root.clientWidth))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(root)
    const remove = addScene(root, {
      mode: "pass",
      smooth: 0.14,
      onUpdate: ({ progress }) => {
        rows.forEach((row, i) => {
          const span = spans[i] ?? 0
          const t = row.dataset.drift === "left" ? progress : 1 - progress
          row.style.transform = `translate3d(${(-span * t).toFixed(1)}px,0,0)`
        })
      },
    })
    return () => {
      remove()
      ro.disconnect()
    }
  }, [])

  return (
    <div ref={ref} className="online__rows">
      {children}
    </div>
  )
}
