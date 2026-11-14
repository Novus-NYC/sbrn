/**
 * Translates the rendered page in place.
 *
 * - Only the *value* of text nodes and a few attributes change. No node is
 *   added, wrapped or moved, so React keeps owning the tree: when it updates a
 *   text, the observer sees the new English and translates that instead.
 * - Headings split into animated lines ([data-lines]) translate as one
 *   sentence, so grammar survives; the sentence lands in the first line.
 * - Anything inside [translate="no"] or .notranslate is left alone (the
 *   wordmark, the greetings already in eight languages, language names).
 * - Results are cached per language in memory and on the device, so a
 *   language you have used before applies instantly.
 */

import { getLanguage, SOURCE } from "./languages"

export type TranslatorState = { lang: string; status: "idle" | "loading" | "error" }

type Unit = { nodes: Text[]; source: string; lead: string; trail: string }
type AttrUnit = { el: Element; name: string; source: string }

const SKIP = 'script,style,noscript,code,pre,textarea,[translate="no"],.notranslate'
const ATTRS = ["alt", "aria-label", "title", "placeholder"]
const LETTER = /\p{L}/u
const RAW = /^(?:[^\s@]+@[^\s@]+\.[^\s@]+|https?:\/\/\S+|www\.\S+)$/
const STORE_LANG = "sbrn-lang"
const STORE_CACHE = "sbrn-tx:"
const BATCH_STRINGS = 60
const BATCH_CHARS = 4200
const SIGN_MAX = 380

const ORIGINAL = new WeakMap<Text, string>()
const WRITTEN = new WeakMap<Text, string>()
const touched = new Set<Text>()
const ATTR_ORIGINAL = new WeakMap<Element, Map<string, string>>()
const ATTR_WRITTEN = new WeakMap<Element, Map<string, string>>()
const touchedEls = new Set<Element>()
const memory = new Map<string, Map<string, string>>()
const listeners = new Set<(s: TranslatorState) => void>()

let state: TranslatorState = { lang: SOURCE, status: "idle" }
let observer: MutationObserver | null = null
let timer = 0
let running: Promise<void> = Promise.resolve()
let title = { original: "", written: "" }

/* ------------------------------------------------------------------ state */

function emit(next: Partial<TranslatorState>) {
  state = { ...state, ...next }
  listeners.forEach((fn) => fn(state))
}

export function subscribe(fn: (s: TranslatorState) => void) {
  listeners.add(fn)
  fn(state)
  return () => {
    listeners.delete(fn)
  }
}

export function storedLanguage(): string {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("lang")
    if (fromUrl && getLanguage(fromUrl)) return fromUrl
    const saved = window.localStorage.getItem(STORE_LANG)
    if (saved && getLanguage(saved)) return saved
  } catch {}
  return SOURCE
}

/* ------------------------------------------------------------------ cache */

function dictFor(lang: string) {
  let dict = memory.get(lang)
  if (!dict) {
    dict = new Map()
    try {
      const raw = window.localStorage.getItem(STORE_CACHE + lang)
      if (raw) for (const [k, v] of Object.entries(JSON.parse(raw) as Record<string, string>)) dict.set(k, v)
    } catch {}
    memory.set(lang, dict)
  }
  return dict
}

let saveTimer = 0
function persist(lang: string) {
  window.clearTimeout(saveTimer)
  saveTimer = window.setTimeout(() => {
    try {
      window.localStorage.setItem(STORE_CACHE + lang, JSON.stringify(Object.fromEntries(dictFor(lang))))
    } catch {
      // storage full or blocked: the memory cache still works this visit
    }
  }, 400)
}

async function fetchBatch(lang: string, q: string[]) {
  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target: lang, q }),
  })
  if (!res.ok) throw new Error(`translate ${res.status}`)
  const data = (await res.json()) as { translations: string[] }
  const dict = dictFor(lang)
  q.forEach((s, i) => dict.set(s, data.translations[i] ?? s))
  persist(lang)
}

/** Resolve every source string, calling `onProgress` as each batch lands. */
async function resolve(lang: string, sources: string[], onProgress: () => void) {
  const dict = dictFor(lang)
  const missing = sources.filter((s) => !dict.has(s))
  const batches: string[][] = []
  let cur: string[] = []
  let chars = 0
  for (const s of missing) {
    if (cur.length && (cur.length >= BATCH_STRINGS || chars + s.length > BATCH_CHARS)) {
      batches.push(cur)
      cur = []
      chars = 0
    }
    cur.push(s.slice(0, BATCH_CHARS))
    chars += s.length
  }
  if (cur.length) batches.push(cur)
  // first batch alone (it holds the top of the page), then three at a time
  let failed = false
  const run = async (b: string[]) => {
    try {
      await fetchBatch(lang, b)
      onProgress()
    } catch {
      failed = true
    }
  }
  if (batches.length) await run(batches[0])
  for (let i = 1; i < batches.length; i += 3) await Promise.all(batches.slice(i, i + 3).map(run))
  if (failed) throw new Error("some text could not be translated")
}

/* ------------------------------------------------------------------ scan */

const normalize = (s: string) => s.replace(/\s+/g, " ").trim()

function originalOf(node: Text) {
  const value = node.nodeValue ?? ""
  const written = WRITTEN.get(node)
  if (written !== undefined && written === value) return ORIGINAL.get(node) ?? value
  ORIGINAL.set(node, value)
  WRITTEN.delete(node)
  return value
}

function textNodes(root: Node, keepEmpty: boolean) {
  const out: Text[] = []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement
      if (!parent || parent.closest(SKIP)) return NodeFilter.FILTER_REJECT
      if (!keepEmpty && !(node.nodeValue ?? "").trim() && !WRITTEN.has(node as Text)) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })
  while (walker.nextNode()) out.push(walker.currentNode as Text)
  return out
}

const worth = (s: string) => LETTER.test(s) && !RAW.test(s)

function collect(root: HTMLElement) {
  const units: Unit[] = []
  const grouped = new Set<Text>()

  root.querySelectorAll<HTMLElement>("[data-lines]").forEach((heading) => {
    if (heading.closest(SKIP)) return
    const nodes = textNodes(heading, true)
    nodes.forEach((n) => grouped.add(n))
    const source = normalize(nodes.map(originalOf).join(""))
    if (worth(source)) units.push({ nodes, source, lead: "", trail: "" })
  })

  for (const node of textNodes(root, false)) {
    if (grouped.has(node)) continue
    const raw = originalOf(node)
    const source = normalize(raw)
    if (!worth(source)) continue
    units.push({ nodes: [node], source, lead: /^\s*/.exec(raw)?.[0] ?? "", trail: /\s*$/.exec(raw)?.[0] ?? "" })
  }

  const attrs: AttrUnit[] = []
  root.querySelectorAll(ATTRS.map((a) => `[${a}]`).join(",")).forEach((el) => {
    if (el.closest(SKIP)) return
    for (const name of ATTRS) {
      const value = el.getAttribute(name)
      if (value === null) continue
      let originals = ATTR_ORIGINAL.get(el)
      if (!originals) ATTR_ORIGINAL.set(el, (originals = new Map()))
      const written = ATTR_WRITTEN.get(el)?.get(name)
      if (written === undefined || written !== value) originals.set(name, value)
      const source = normalize(originals.get(name) ?? value)
      if (worth(source)) attrs.push({ el, name, source })
    }
  })
  return { units, attrs }
}

/* ------------------------------------------------------------------ write */

function write(node: Text, value: string) {
  if (node.nodeValue !== value) node.nodeValue = value
  WRITTEN.set(node, value)
  touched.add(node)
}

function writeAttr(el: Element, name: string, value: string) {
  if (el.getAttribute(name) !== value) el.setAttribute(name, value)
  let written = ATTR_WRITTEN.get(el)
  if (!written) ATTR_WRITTEN.set(el, (written = new Map()))
  written.set(name, value)
  touchedEls.add(el)
}

/** Shop signs are SVG text on a fixed-width fascia: squeeze long ones to fit. */
function fitSigns() {
  document.querySelectorAll<SVGTextElement>("text.b-sign").forEach((t) => {
    t.removeAttribute("textLength")
    t.removeAttribute("lengthAdjust")
    if (state.lang === SOURCE) return
    try {
      if (t.getComputedTextLength() > SIGN_MAX) {
        t.setAttribute("textLength", String(SIGN_MAX))
        t.setAttribute("lengthAdjust", "spacingAndGlyphs")
      }
    } catch {}
  })
}

/**
 * The hero question is set to fill the gate in English. A longer translation
 * can wrap to an extra line and climb under the nav: shrink it, a step at a
 * time, until the whole hero block sits below the bar.
 */
function fitHero() {
  const q = document.querySelector<HTMLElement>(".herogate__q")
  const main = document.querySelector<HTMLElement>(".herogate__main")
  if (!q || !main) return
  q.style.removeProperty("font-size")
  if (state.lang === SOURCE) return
  const base = parseFloat(getComputedStyle(q).fontSize)
  const nav = document.querySelector<HTMLElement>(".nav__bar")?.getBoundingClientRect().bottom ?? 0
  const gate = main.closest<HTMLElement>(".herogate")?.getBoundingClientRect().top ?? 0
  const limit = gate + nav + 12
  for (let scale = 0.94; scale >= 0.55 && main.getBoundingClientRect().top < limit; scale -= 0.06) {
    q.style.fontSize = `${(base * scale).toFixed(1)}px`
  }
}

/** Writes without waking our own observer. */
function quietly(fn: () => void) {
  fn()
  observer?.takeRecords()
}

function applyAll(lang: string, units: Unit[], attrs: AttrUnit[]) {
  const dict = dictFor(lang)
  quietly(() => {
    for (const u of units) {
      const t = dict.get(u.source)
      if (t === undefined) continue
      write(u.nodes[0], u.lead + t + u.trail)
      for (let i = 1; i < u.nodes.length; i++) write(u.nodes[i], "")
    }
    for (const a of attrs) {
      const t = dict.get(a.source)
      if (t !== undefined) writeAttr(a.el, a.name, t)
    }
    const t = dict.get(normalize(title.original))
    if (t) {
      document.title = t
      title.written = t
    }
    fitSigns()
    fitHero()
  })
}

function restoreAll() {
  quietly(() => {
    for (const node of touched) {
      if (node.isConnected && WRITTEN.get(node) === node.nodeValue) node.nodeValue = ORIGINAL.get(node) ?? node.nodeValue
      WRITTEN.delete(node)
    }
    touched.clear()
    for (const el of touchedEls) {
      const originals = ATTR_ORIGINAL.get(el)
      const written = ATTR_WRITTEN.get(el)
      written?.forEach((value, name) => {
        if (el.getAttribute(name) === value) el.setAttribute(name, originals?.get(name) ?? value)
      })
      ATTR_WRITTEN.delete(el)
    }
    touchedEls.clear()
    if (title.written && document.title === title.written) document.title = title.original
    title.written = ""
    fitSigns()
    fitHero()
  })
}

function setDocumentLanguage(code: string) {
  const l = getLanguage(code)
  const html = document.documentElement
  html.lang = l?.html ?? code
  html.classList.toggle("is-translated", code !== SOURCE)
  html.classList.toggle("is-rtl-text", Boolean(l?.rtl))
}

/* ------------------------------------------------------------------ passes */

async function pass() {
  const lang = state.lang
  if (lang === SOURCE) return
  // drop nodes React has since removed
  for (const n of touched) if (!n.isConnected) touched.delete(n)
  for (const el of touchedEls) if (!el.isConnected) touchedEls.delete(el)
  if (document.title !== title.written) title.original = document.title

  const { units, attrs } = collect(document.body)
  const sources = [...new Set([...units.map((u) => u.source), ...attrs.map((a) => a.source), normalize(title.original)])].filter(worth)
  applyAll(lang, units, attrs) // whatever is cached already shows at once
  const dict = dictFor(lang)
  if (sources.every((s) => dict.has(s))) {
    emit({ status: "idle" })
    return
  }
  emit({ status: "loading" })
  try {
    await resolve(lang, sources, () => {
      if (state.lang === lang) applyAll(lang, units, attrs)
    })
    if (state.lang === lang) emit({ status: "idle" })
  } catch {
    if (state.lang === lang) emit({ status: "error" })
  }
}

function queue() {
  running = running.then(pass, pass)
  return running
}

function observe() {
  if (observer) return
  observer = new MutationObserver(() => {
    if (state.lang === SOURCE) return
    window.clearTimeout(timer)
    timer = window.setTimeout(queue, 160)
  })
  observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS })
  let resize = 0
  window.addEventListener("resize", () => {
    window.clearTimeout(resize)
    resize = window.setTimeout(fitHero, 200)
  })
}

/** Show the site in `code`. English restores the original text. */
export function setLanguage(code: string) {
  if (!getLanguage(code)) return Promise.resolve()
  try {
    window.localStorage.setItem(STORE_LANG, code)
  } catch {}
  const url = new URL(window.location.href)
  if (url.searchParams.has("lang")) {
    url.searchParams.delete("lang")
    window.history.replaceState(window.history.state, "", url)
  }
  emit({ lang: code, status: code === SOURCE ? "idle" : state.status })
  setDocumentLanguage(code)
  if (code === SOURCE) {
    restoreAll()
    return Promise.resolve()
  }
  observe()
  // switching between two languages: start from the English, not a translation
  restoreAll()
  return queue()
}
