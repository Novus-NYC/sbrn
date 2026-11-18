"use client"

import { useEffect, useState } from "react"
import { ATTRIBUTES, collect, hasLetters, translatePage, type Dictionary } from "./engine"
import { loadDictionary } from "./messages"
import { keep } from "./keep"
import { getLanguage, setLanguage, useLanguage } from "./store"
import { isLanguage, storageKey, type Language } from "./languages"

declare global {
  interface Window {
    /** Test hook: what the current page could not translate. Used by scripts/i18n-check.mjs. */
    __sbrnI18n?: { language: () => Language; ready: () => boolean; missing: () => string[]; units: () => { key: string; segments: string[] }[] }
  }
}

// Start fetching a saved language's dictionary while React is still hydrating.
if (typeof window !== "undefined") {
  const booted = getLanguage()
  if (booted !== "en") void loadDictionary(booted).catch(() => undefined)
}

function relevant(records: MutationRecord[]) {
  return records.some((record) => {
    if (record.type === "characterData") return hasLetters(record.target.nodeValue ?? "")
    if (record.type === "attributes") return true
    return Array.from(record.addedNodes).some((node) => hasLetters(node.textContent ?? "") || node.nodeType === Node.ELEMENT_NODE)
  })
}

function settle() {
  document.documentElement.classList.remove("i18n-pending")
}

/** Keeps the page in the chosen language as React renders new routes and states. */
export default function TranslationRuntime() {
  const language = useLanguage()
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    let dictionary: Dictionary | null = null
    let missing: string[] = []
    let ready = language === "en"
    setFailed(false)

    const observer = new MutationObserver((records) => {
      if (!dictionary || !relevant(records)) return
      run()
    })
    const run = () => {
      missing = translatePage(language, dictionary, keep)
      // Our own writes are not news.
      observer.takeRecords()
    }

    window.__sbrnI18n = {
      language: () => language,
      ready: () => ready,
      missing: () => missing,
      units: () => collect().map(({ key, segments }) => ({ key, segments })),
    }

    if (language === "en") {
      translatePage(language, null, keep)
      settle()
    } else {
      loadDictionary(language)
        .then((loaded) => {
          if (cancelled) return
          dictionary = loaded
          run()
          ready = true
          observer.observe(document.body, {
            subtree: true,
            childList: true,
            characterData: true,
            attributes: true,
            attributeFilter: [...ATTRIBUTES],
          })
        })
        .catch(() => {
          if (!cancelled) setFailed(true)
        })
        .finally(() => {
          if (!cancelled) settle()
        })
    }

    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [language])

  // Follow a language change made in another tab.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) return
      const next = event.newValue ?? "en"
      if (isLanguage(next) && next !== getLanguage()) setLanguage(next)
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  return failed ? (
    <p className="i18n-error" role="alert" translate="no">
      This translation could not load. Please check your connection and try again.
    </p>
  ) : null
}

