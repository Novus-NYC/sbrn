"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { cta, nav } from "@/lib/data/site"
import { Arrow, Roll, Wordmark } from "./ui"

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Surface appears once content scrolls beneath the bar.
  useEffect(() => {
    let raf = 0
    const read = () => {
      raf = 0
      setScrolled(window.scrollY > 24)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read)
    }
    read()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const close = useCallback((restoreFocus = true) => {
    setOpen(false)
    if (restoreFocus) toggleRef.current?.focus()
  }, [])

  // Close on navigation.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Menu behaviour: lock scroll, trap focus, close on Escape.
  useEffect(() => {
    const main = document.getElementById("main")
    const footer = document.querySelector("footer")
    if (!open) {
      document.documentElement.style.removeProperty("overflow")
      main?.removeAttribute("inert")
      footer?.removeAttribute("inert")
      return
    }
    document.documentElement.style.overflow = "hidden"
    main?.setAttribute("inert", "")
    footer?.setAttribute("inert", "")
    const menu = menuRef.current
    const focusables = () =>
      Array.from(menu?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [])
    const t = window.setTimeout(() => focusables()[0]?.focus(), 60)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        close()
        return
      }
      if (e.key !== "Tab") return
      const list = [toggleRef.current, ...focusables()].filter(Boolean) as HTMLElement[]
      if (!list.length) return
      const first = list[0]
      const last = list[list.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => {
      window.clearTimeout(t)
      document.removeEventListener("keydown", onKey)
      document.documentElement.style.removeProperty("overflow")
      main?.removeAttribute("inert")
      footer?.removeAttribute("inert")
    }
  }, [open, close])

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
      <div className="nav__bar wrap">
        <Link href="/" className="nav__brand">
          <Wordmark />
          <span className="sr-only">, home</span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined}>
                  <Roll>{item.label}</Roll>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav__end">
          {/* On its own page the action is marked current and painted ink, so it reads against the coral gate. */}
          <Link
            href={cta.href}
            className={`btn btn--sm nav__cta ${pathname === cta.href ? "btn--ink nav__cta--here" : "btn--coral"}`}
            aria-current={pathname === cta.href ? "page" : undefined}
          >
            <span>{cta.label}</span>
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="nav__toggle-label">{open ? "Close" : "Menu"}</span>
            <span className="nav__toggle-icon" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>

      {/* Full-screen menu: the gate rolls down with the pages painted on it. */}
      <div
        id="site-menu"
        ref={menuRef}
        className="menu slats slats--night"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        inert={!open}
      >
        <div className="menu__inner wrap">
          <ul className="menu__list">
            <li style={{ ["--i" as string]: 0 }}>
              <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>
                <span className="display">Home</span>
              </Link>
            </li>
            {nav.map((item, i) => (
              <li key={item.href} style={{ ["--i" as string]: i + 1 }}>
                <Link href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined}>
                  <span className="display">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="menu__foot">
            <Link href={cta.href} className="btn btn--coral">
              <span>{cta.label}</span>
              <Arrow dir="right" className="btn__arrow btn__arrow--right" />
            </Link>
            <p className="menu__note">Personalized guidance for small businesses in all five boroughs.</p>
          </div>
        </div>
      </div>
    </header>
  )
}
