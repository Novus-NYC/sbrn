"use client"

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react"
import type { Language } from "./languages"
import type { TranslatorState } from "./translator"

type Mods = {
  langs: typeof import("./languages")
  tx: typeof import("./translator")
}

/** The language list and the translator load on first use, not with every page. */
let loading: Promise<Mods> | null = null
const load = () =>
  (loading ??= Promise.all([import("./languages"), import("./translator")]).then(([langs, tx]) => ({ langs, tx })))

function Globe() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3z" />
    </svg>
  )
}

const short = (code: string) => code.split("-")[0].toUpperCase()

/**
 * Language switcher: New York's most spoken languages first, then a search
 * across every language the translator supports.
 */
export default function LanguagePicker() {
  const [open, setOpen] = useState(false)
  const [mods, setMods] = useState<Mods | null>(null)
  const [tx, setTx] = useState<TranslatorState>({ lang: "en", status: "idle" })
  const [query, setQuery] = useState("")
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const panelId = useId()
  const searchId = useId()

  // A visitor who chose a language before gets it back on arrival.
  useEffect(() => {
    let off = () => {}
    let saved = "en"
    try {
      saved = new URLSearchParams(window.location.search).get("lang") ?? window.localStorage.getItem("sbrn-lang") ?? "en"
    } catch {}
    if (saved === "en") return
    load().then((m) => {
      setMods(m)
      off = m.tx.subscribe(setTx)
      m.tx.setLanguage(m.tx.storedLanguage())
    })
    return () => off()
  }, [])

  const ensure = useCallback(() => {
    if (mods) return Promise.resolve(mods)
    return load().then((m) => {
      setMods(m)
      m.tx.subscribe(setTx)
      return m
    })
  }, [mods])

  const close = useCallback((restore = true) => {
    setOpen(false)
    setQuery("")
    if (restore) toggleRef.current?.focus()
  }, [])

  // Escape and outside clicks close the panel.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (!panelRef.current?.contains(t) && !toggleRef.current?.contains(t)) close(false)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onDown)
    panelRef.current?.focus()
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onDown)
    }
  }, [open, close])

  const choose = (code: string) => {
    ensure().then((m) => m.tx.setLanguage(code))
    close()
  }

  const { featured, results } = useMemo(() => {
    if (!mods) return { featured: [] as Language[], results: [] as Language[] }
    const { LANGUAGES, FEATURED, getLanguage, fold } = mods.langs
    const top = ["en", ...FEATURED].map((c) => getLanguage(c)).filter((l): l is Language => Boolean(l))
    const q = fold(query.trim())
    const pool = q
      ? LANGUAGES.filter((l) => fold(l.name).includes(q) || fold(l.native).includes(q) || l.code.toLowerCase() === q)
      : LANGUAGES.filter((l) => !top.includes(l)).sort((a, b) => a.name.localeCompare(b.name))
    return { featured: top, results: pool }
  }, [mods, query])

  const current = mods?.langs.getLanguage(tx.lang)
  const label = current ? current.native : "English"

  return (
    <div className="lang">
      <button
        ref={toggleRef}
        type="button"
        className="lang__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onPointerEnter={() => void load()}
        onFocus={() => void load()}
        onClick={() => {
          if (open) return close()
          ensure().then(() => setOpen(true))
        }}
      >
        <Globe />
        <span className="lang__code" translate="no">
          {short(tx.lang)}
        </span>
        <span className="sr-only">
          Language: <span translate="no">{label}</span>. Change language
        </span>
        {tx.status === "loading" ? <span className="lang__busy" aria-hidden="true" /> : null}
      </button>

      <p className="sr-only" role="status" aria-live="polite">
        {tx.status === "loading" ? "Translating the page" : tx.status === "error" ? "Translation is not available right now" : ""}
      </p>

      {open && mods ? (
        <div ref={panelRef} id={panelId} className="lang__panel" role="dialog" aria-label="Choose a language" tabIndex={-1}>
          <div className="lang__head">
            <p className="label">Language</p>
            <button type="button" className="lang__close" aria-label="Close the language list" onClick={() => close()}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
          </div>

          <p className="lang__group label">Most spoken in New York</p>
          <ul className="lang__top">
            {featured.map((l) => (
              <li key={l.code}>
                <button type="button" className="lang__opt lang__opt--big" aria-pressed={tx.lang === l.code} lang={l.html ?? l.code} onClick={() => choose(l.code)}>
                  <span className="lang__native" translate="no">
                    {l.native}
                  </span>
                  {l.native !== l.name ? (
                    <span className="lang__en" translate="no" lang="en">
                      {l.name}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>

          <label className="lang__group label" htmlFor={searchId}>
            Search every language
          </label>
          <input
            id={searchId}
            className="lang__search"
            type="search"
            autoComplete="off"
            spellCheck={false}
            placeholder={`${mods.langs.LANGUAGES.length} languages`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && results[0]) {
                e.preventDefault()
                choose(results[0].code)
              }
            }}
          />
          <ul className="lang__list" aria-label={query ? "Matching languages" : "All languages"}>
            {results.map((l) => (
              <li key={l.code}>
                <button type="button" className="lang__opt" aria-pressed={tx.lang === l.code} lang={l.html ?? l.code} onClick={() => choose(l.code)}>
                  <span className="lang__native" translate="no">
                    {l.native}
                  </span>
                  {l.native !== l.name ? (
                    <span className="lang__en" translate="no" lang="en">
                      {l.name}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
            {results.length === 0 ? <li className="lang__none">No language matches that search.</li> : null}
          </ul>

          <p className="lang__note">
            Translations are automatic. English is the original, and the binding version of our policies.
          </p>
          {tx.status === "error" ? <p className="lang__error">Translation is not available right now. Please try again in a moment.</p> : null}
        </div>
      ) : null}
    </div>
  )
}
