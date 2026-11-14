"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { Wordmark } from "@/lib/components/ui"
import { motionEnabled } from "./scroll-rig"

const DOWN_MS = 520
const SAFETY_MS = 4500

/**
 * Page transition: the gate rolls down over the page you are leaving and
 * rolls back up on the one you asked for. Links stay ordinary links; with
 * reduced motion or without JavaScript they simply navigate.
 */
export default function GateCurtain() {
  const router = useRouter()
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)
  const busy = useRef(false)
  const safety = useRef(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const lift = () => {
      window.clearTimeout(safety.current)
      busy.current = false
      el.classList.remove("is-down")
    }

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = (event.target as Element | null)?.closest?.("a")
      if (!anchor) return
      const raw = anchor.getAttribute("href")
      if (!raw || anchor.target === "_blank" || anchor.hasAttribute("download")) return
      if (anchor.dataset.noTransition !== undefined) return
      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname) return
      if (!motionEnabled() || busy.current) return

      event.preventDefault()
      busy.current = true
      el.classList.add("is-down")
      const go = () => router.push(url.pathname + url.search + url.hash)
      window.setTimeout(go, DOWN_MS)
      // Never leave the gate down if navigation stalls.
      safety.current = window.setTimeout(lift, SAFETY_MS)
    }

    document.addEventListener("click", onClick, true)
    window.addEventListener("pageshow", lift)
    return () => {
      document.removeEventListener("click", onClick, true)
      window.removeEventListener("pageshow", lift)
      window.clearTimeout(safety.current)
    }
  }, [router])

  // The new route has committed: raise the gate.
  useEffect(() => {
    const el = ref.current
    if (!el || !el.classList.contains("is-down")) return
    const t = window.setTimeout(() => {
      window.clearTimeout(safety.current)
      busy.current = false
      el.classList.remove("is-down")
    }, 90)
    return () => window.clearTimeout(t)
  }, [pathname])

  return (
    <div ref={ref} className="curtain slats" aria-hidden="true">
      <Wordmark className="curtain__mark" />
      <span className="curtain__bar" />
    </div>
  )
}
