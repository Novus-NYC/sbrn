"use client"

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react"
import { languageInfo, languages, type Language } from "@/lib/i18n/languages"
import { setLanguage, useLanguage } from "@/lib/i18n/store"

export function Globe({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9.2" />
      <path d="M2.8 12h18.4M12 2.8c2.6 2.6 3.9 5.7 3.9 9.2s-1.3 6.6-3.9 9.2M12 2.8C9.4 5.4 8.1 8.5 8.1 12s1.3 6.6 3.9 9.2" />
    </svg>
  )
}

/**
 * The navbar control. It is written in no single language: the button shows a
 * globe and the current language's code, and every choice is listed in its own
 * script, so a reader who does not know English can still find theirs.
 */
export default function LanguageSwitcher() {
  const language = useLanguage()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()
  const current = languageInfo(language)

  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return
      setOpen(false)
      buttonRef.current?.focus()
    }
    document.addEventListener("pointerdown", onPointer)
    document.addEventListener("keydown", onKey)
    const t = window.setTimeout(() => {
      rootRef.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')?.focus()
    }, 0)
    return () => {
      window.clearTimeout(t)
      document.removeEventListener("pointerdown", onPointer)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  function choose(code: Language) {
    setLanguage(code)
    setOpen(false)
    buttonRef.current?.focus()
  }

  // Arrow keys move through the list; Tab leaves it and closes it.
  function onListKey(event: KeyboardEvent<HTMLUListElement>) {
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button"))
    const index = items.indexOf(document.activeElement as HTMLButtonElement)
    let next = -1
    if (event.key === "ArrowDown") next = (index + 1) % items.length
    else if (event.key === "ArrowUp") next = (index - 1 + items.length) % items.length
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = items.length - 1
    if (next < 0) return
    event.preventDefault()
    items[next].focus()
  }

  return (
    <div
      ref={rootRef}
      className={`lang ${open ? "is-open" : ""}`}
      translate="no"
      onBlur={(event) => {
        if (open && !rootRef.current?.contains(event.relatedTarget as Node)) setOpen(false)
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className="lang__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        lang={current.code}
        dir={current.dir}
        aria-label={`${current.label}: ${current.name}`}
        onClick={() => setOpen((value) => !value)}
      >
        <Globe className="lang__globe" />
        <span className="lang__code" aria-hidden="true">
          {current.code.toUpperCase()}
        </span>
        <svg className="lang__chev" viewBox="0 0 12 8" aria-hidden="true" focusable="false">
          <path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </button>
      <div id={panelId} className="lang__panel" hidden={!open}>
        <p className="lang__title" aria-hidden="true">
          {languages.map((item) => item.label).join(" · ")}
        </p>
        <ul className="lang__list" lang={current.code} aria-label={current.choose} onKeyDown={onListKey}>
          {languages.map((item) => (
            <li key={item.code}>
              <button
                type="button"
                lang={item.code}
                dir={item.dir}
                aria-pressed={item.code === language}
                onClick={() => choose(item.code)}
              >
                <span className="lang__code-sm" aria-hidden="true">
                  {item.code.toUpperCase()}
                </span>
                <span className="lang__name">{item.name}</span>
                <span className="lang__en" lang="en" dir="ltr">
                  {item.english}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/** A compact row of every language, for the mobile menu and anywhere the navbar is out of reach. */
export function LanguageRow({ className = "" }: { className?: string }) {
  const language = useLanguage()
  const current = languageInfo(language)
  return (
    <ul className={`langrow ${className}`} lang={current.code} aria-label={current.choose} translate="no">
      {languages.map((item) => (
        <li key={item.code}>
          <button type="button" lang={item.code} dir={item.dir} aria-pressed={item.code === language} onClick={() => setLanguage(item.code)}>
            {item.name}
          </button>
        </li>
      ))}
    </ul>
  )
}
