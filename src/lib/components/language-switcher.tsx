"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { isLanguage, languages, type Language } from "@/lib/i18n/languages"

type Original = { source: string; translated?: string }
type Target = { apply: (value: string) => void; source: string }
const textOrigins = new WeakMap<Text, Original>()
const attributeOrigins = new WeakMap<Element, Map<string, Original>>()
const translations = new Map<string, string>()
let titleOrigin: Original | undefined
const attributes = ["alt", "title", "placeholder", "aria-label", "aria-description"] as const
const contentSelector = "script,style,noscript,textarea,code,pre,[contenteditable],[translate='no']"

function translatable(text: string) {
  return /\p{L}/u.test(text) && !/^(?:https?:\/\/|www\.|\S+@\S+)/i.test(text.trim())
}

function targets(): Target[] {
  const result: Target[] = []
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const node = walker.currentNode as Text
    if (node.parentElement?.closest(contentSelector)) continue
    const current = node.textContent || ""
    let original = textOrigins.get(node)
    if (!original || (current !== original.source && current !== original.translated)) {
      original = { source: current }
      textOrigins.set(node, original)
    }
    const source = original.source.trim()
    if (!translatable(source)) continue
    const saved = original
    result.push({ source, apply(value) {
      const leading = saved.source.match(/^\s*/)?.[0] || ""
      const trailing = saved.source.match(/\s*$/)?.[0] || ""
      const translated = leading + value + trailing
      saved.translated = translated
      if (node.isConnected && node.textContent !== translated) node.textContent = translated
    } })
  }

  for (const element of document.body.querySelectorAll("[alt],[title],[placeholder],[aria-label],[aria-description]")) {
    if (element.closest(contentSelector)) continue
    let originals = attributeOrigins.get(element)
    if (!originals) { originals = new Map(); attributeOrigins.set(element, originals) }
    for (const name of attributes) {
      const current = element.getAttribute(name)
      if (!current) continue
      let original = originals.get(name)
      if (!original || (current !== original.source && current !== original.translated)) {
        original = { source: current }
        originals.set(name, original)
      }
      if (!translatable(original.source)) continue
      const saved = original
      result.push({ source: saved.source, apply(value) {
        saved.translated = value
        if (element.isConnected && element.getAttribute(name) !== value) element.setAttribute(name, value)
      } })
    }
  }
  return result
}

async function translateBatch(texts: string[], language: Language): Promise<void> {
  const response = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target: language, texts }),
  })
  if (!response.ok) throw new Error("Translation unavailable")
  const body = await response.json() as { translations?: string[] }
  if (!body.translations || body.translations.length !== texts.length) throw new Error("Incomplete translation")
  body.translations.forEach((value, index) => translations.set(`${language}:${texts[index]}`, value))
}

export default function LanguageSwitcher() {
  const pathname = usePathname()
  const [language, setLanguage] = useState<Language>("en")
  const [status, setStatus] = useState("")
  const generation = useRef(0)

  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get("lang")
    const stored = window.localStorage.getItem("sbrn-language")
    if (query && isLanguage(query)) setLanguage(query)
    else if (stored && isLanguage(stored)) setLanguage(stored)
  }, [])

  useEffect(() => {
    let raf = 0
    let pending = false
    let failed = false
    const id = ++generation.current
    const documentElement = document.documentElement
    const direction = languages.find((item) => item.code === language)?.dir || "ltr"
    documentElement.lang = language
    documentElement.dir = direction
    window.localStorage.setItem("sbrn-language", language)

    async function update() {
      pending = false
      if (failed || id !== generation.current) return
      const entries = targets()
      const title = document.title
      if (!titleOrigin || (title !== titleOrigin.source && title !== titleOrigin.translated)) titleOrigin = { source: title }
      if (titleOrigin.source && translatable(titleOrigin.source)) {
        const saved = titleOrigin
        entries.push({ source: saved.source, apply(value) {
          if (id === generation.current) { saved.translated = value; document.title = value }
        } })
      }
      if (language === "en") {
        entries.forEach(({ source, apply }) => apply(source))
        setStatus("")
        return
      }
      const missing = [...new Set(entries.map(({ source }) => source))].filter((source) => !translations.has(`${language}:${source}`))
      if (missing.length) setStatus("Translating page…")
      try {
        let batch: string[] = []
        let size = 0
        for (const source of missing) {
          if (batch.length >= 80 || size + source.length > 12000) {
            await translateBatch(batch, language)
            batch = []
            size = 0
          }
          batch.push(source)
          size += source.length
        }
        if (batch.length) await translateBatch(batch, language)
        if (id !== generation.current) return
        entries.forEach(({ source, apply }) => apply(translations.get(`${language}:${source}`) || source))
        setStatus("")
      } catch {
        failed = true
        if (id === generation.current) setStatus("Translation is temporarily unavailable. Please try again later.")
      }
    }
    const schedule = () => {
      if (pending || failed) return
      pending = true
      raf = requestAnimationFrame(update)
    }
    const observer = new MutationObserver(schedule)
    observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: [...attributes] })
    schedule()
    return () => {
      generation.current++
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [language, pathname])

  function choose(value: string) {
    if (!isLanguage(value)) return
    const url = new URL(window.location.href)
    if (value === "en") url.searchParams.delete("lang")
    else url.searchParams.set("lang", value)
    window.history.replaceState(window.history.state, "", url)
    setStatus("")
    setLanguage(value)
  }

  return (
    <div className="language-picker" translate="no">
      <label htmlFor="site-language" className="sr-only">Website language</label>
      <select id="site-language" value={language} onChange={(event) => choose(event.target.value)} aria-label="Website language">
        {languages.map(({ code, label }) => <option key={code} value={code}>{label}</option>)}
      </select>
      {status && <span className="language-picker__status" role="status">{status}</span>}
    </div>
  )
}
