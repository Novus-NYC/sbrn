/**
 * Translates the rendered page in place from a static dictionary.
 *
 * Pages stay written in English (the source of record). After React renders,
 * this walks the visible copy, groups text into phrases, and swaps each phrase
 * for its dictionary entry. A MutationObserver in the runtime re-applies it as
 * React renders new copy, so every route, menu, form message and interactive
 * state is covered without threading a `t()` call through every component.
 *
 * A phrase is the run of text inside one block element. A sentence with a link
 * in it ("owner of <a>Shop</a>, was…") is one phrase of three segments, keyed
 * as the segments joined by SEP, and translated as a whole with the same number
 * of segments so the link stays a link. When a phrase has no whole entry, each
 * segment is looked up on its own (useful for lists of short labels).
 */

export type Template = { pattern: RegExp; value: string; size: number }

/** Exact phrases, plus patterns such as "Read from {0} (opens in a new tab)" for copy built around names. */
export type Dictionary = { entries: Readonly<Record<string, string>>; templates: readonly Template[] }

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

/** Pairs English and translated messages by id. Entries containing {0}, {1}… become patterns. */
export function compile(source: Readonly<Record<string, string>>, target: Readonly<Record<string, string>>): Dictionary {
  const entries: Record<string, string> = {}
  const templates: Template[] = []
  for (const [id, english] of Object.entries(source)) {
    const value = target[id]
    if (value === undefined) continue
    if (/\{\d\}/.test(english)) {
      const pattern = new RegExp(`^${escape(english).replace(/\\\{(\d)\\\}/g, "(.+?)")}$`)
      templates.push({ pattern, value, size: english.replace(/\{\d\}/g, "").length })
    } else {
      entries[normalize(english)] = value
    }
  }
  // The most specific pattern wins: "{0} Chamber of Commerce website" before "{0} Chamber of Commerce".
  templates.sort((a, b) => b.size - a.size)
  return { entries, templates }
}

export const SEP = "‖"

/** Elements that continue a phrase rather than start a new one. */
const INLINE = new Set([
  "A", "ABBR", "B", "BDI", "BDO", "BR", "CITE", "DATA", "DFN", "EM", "I", "KBD", "MARK", "Q",
  "S", "SAMP", "SMALL", "SPAN", "STRONG", "SUB", "SUP", "TIME", "U", "VAR", "WBR",
])

const SKIP = "script,style,noscript,template,textarea,code,pre,[contenteditable='true'],[translate='no']"

export const ATTRIBUTES = ["alt", "title", "placeholder", "aria-label", "aria-description", "data-text"] as const

const LETTERS = /\p{L}/u

type Origin = { source: string; shown?: string }

const textOrigins = new WeakMap<Text, Origin>()
const attributeOrigins = new WeakMap<Element, Map<string, Origin>>()
let titleOrigin: Origin | undefined

export const normalize = (value: string) => value.replace(/\s+/g, " ").trim()

export const hasLetters = (value: string) => LETTERS.test(value)

/** Addresses read the same in every language. */
const ADDRESS = /^(?:(?:https?:\/\/|www\.)\S+|[^\s@]+@[^\s@]+\.[^\s@]+|[\w-]+(?:\.[\w-]+)*\.[a-z]{2,}(?:\/\S*)?)$/i

const translatable = (value: string) => Boolean(value) && hasLetters(value) && !ADDRESS.test(value)

/** "2024-01-22" in the reader's language ("22 janv.", "1月22日"), matching the English "Jan 22". */
function formatDate(iso: string, language: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!match) return null
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])))
  return new Intl.DateTimeFormat(language, { month: "short", day: "numeric", timeZone: "UTC" }).format(date)
}

/** The English this node was rendered with, even after we have replaced it. */
function track(previous: Origin | undefined, current: string): Origin {
  if (previous && (current === previous.source || current === previous.shown)) return previous
  return { source: current }
}

/** Copy already written in another language (the hero greetings, the picker) is left alone. */
function isForeign(element: Element) {
  const host = element.closest("[lang]")
  return Boolean(host && host !== document.documentElement && !host.getAttribute("lang")?.startsWith("en"))
}

function excluded(element: Element) {
  return Boolean(element.closest(SKIP)) || isForeign(element)
}

function phraseRoot(element: Element) {
  if (element.tagName === "TIME" && element.hasAttribute("datetime")) return element
  let node: Element = element
  while (INLINE.has(node.tagName) && node.parentElement && node.parentElement !== document.body) node = node.parentElement
  return node
}

type Piece = { node: Text; origin: Origin; text: string }

export type Unit = {
  key: string
  segments: string[]
  write: (values: string[]) => void
  /** Copy the dictionary does not hold, such as dates, computed for the language. */
  compute?: (language: string) => string[] | null
}

function splitEdges(source: string) {
  const lead = source.match(/^\s*/)?.[0] ?? ""
  const trail = source.match(/\s*$/)?.[0] ?? ""
  return { lead, trail }
}

export function collect(root: Element = document.body): Unit[] {
  const groups = new Map<Element, Piece[]>()
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const node = walker.currentNode as Text
    const parent = node.parentElement
    if (!parent) continue
    const origin = track(textOrigins.get(node), node.data)
    textOrigins.set(node, origin)
    const text = normalize(origin.source)
    if (!translatable(text) || excluded(parent)) continue
    const host = phraseRoot(parent)
    const pieces = groups.get(host)
    if (pieces) pieces.push({ node, origin, text })
    else groups.set(host, [{ node, origin, text }])
  }

  const units: Unit[] = []
  for (const [host, pieces] of groups) {
    const segments = pieces.map((piece) => piece.text)
    const iso = host.tagName === "TIME" && pieces.length === 1 ? host.getAttribute("datetime") : null
    units.push({
      compute: iso ? (language) => {
        const value = formatDate(iso, language)
        return value ? [value] : null
      } : undefined,
      key: segments.join(SEP),
      segments,
      write(values) {
        pieces.forEach(({ node, origin }, index) => {
          const { lead, trail } = splitEdges(origin.source)
          const value = values[index] === segments[index] ? origin.source : lead + values[index] + trail
          origin.shown = value
          if (node.isConnected && node.data !== value) node.data = value
        })
      },
    })
  }

  const selector = ATTRIBUTES.map((name) => `[${name}]`).join(",")
  const elements = root.matches(selector) ? [root, ...root.querySelectorAll(selector)] : [...root.querySelectorAll(selector)]
  for (const element of elements) {
    if (excluded(element)) continue
    let origins = attributeOrigins.get(element)
    if (!origins) {
      origins = new Map()
      attributeOrigins.set(element, origins)
    }
    for (const name of ATTRIBUTES) {
      const current = element.getAttribute(name)
      if (current === null) continue
      const origin = track(origins.get(name), current)
      origins.set(name, origin)
      const text = normalize(origin.source)
      if (!translatable(text)) continue
      units.push({
        key: text,
        segments: [text],
        write([value]) {
          const next = value === text ? origin.source : value
          origin.shown = next
          if (element.isConnected && element.getAttribute(name) !== next) element.setAttribute(name, next)
        },
      })
    }
  }

  if (root === document.body) {
    titleOrigin = track(titleOrigin, document.title)
    const origin = titleOrigin
    const text = normalize(origin.source)
    if (text && hasLetters(text)) {
      units.push({
        key: text,
        segments: [text],
        write([value]) {
          const next = value === text ? origin.source : value
          origin.shown = next
          if (document.title !== next) document.title = next
        },
      })
    }
  }
  return units
}

export type Lookup = { values: string[]; missing: string[] }

/** A phrase in the dictionary's language, or undefined when it has none. */
export function translateText(text: string, dictionary: Dictionary, keep: ReadonlySet<string>): string | undefined {
  const hit = dictionary.entries[text]
  if (hit !== undefined) return hit
  if (keep.has(text) || !hasLetters(text) || ADDRESS.test(text)) return text
  for (const template of dictionary.templates) {
    const match = template.pattern.exec(text)
    if (!match) continue
    const captures = match.slice(1).map((capture) => translateText(capture, dictionary, keep))
    // A pattern only applies when everything it wraps can be translated too.
    if (captures.some((capture) => capture === undefined)) continue
    return template.value.replace(/\{(\d)\}/g, (_, index: string) => captures[Number(index)] ?? "")
  }
  return undefined
}

/** Whole-phrase entry first, then segment by segment. Missing copy stays in English. */
export function lookup(unit: Pick<Unit, "key" | "segments">, dictionary: Dictionary | null, keep: ReadonlySet<string>): Lookup {
  if (!dictionary) return { values: unit.segments, missing: [] }
  if (unit.segments.length > 1) {
    const whole = translateText(unit.key, dictionary, keep)
    if (whole !== undefined) {
      const parts = whole.split(SEP)
      if (parts.length === unit.segments.length) return { values: parts, missing: [] }
    }
  }
  const missing: string[] = []
  const values = unit.segments.map((segment) => {
    const hit = translateText(segment, dictionary, keep)
    if (hit !== undefined) return hit
    missing.push(unit.segments.length > 1 ? `${segment}  ⟵  ${unit.key}` : segment)
    return segment
  })
  return { values, missing }
}

/** Applies a dictionary (or null for English) to the page; returns copy it could not translate. */
export function translatePage(language: string, dictionary: Dictionary | null, keep: ReadonlySet<string>): string[] {
  const missing: string[] = []
  for (const unit of collect()) {
    const computed = dictionary ? unit.compute?.(language) : null
    if (computed) {
      unit.write(computed)
      continue
    }
    const result = lookup(unit, dictionary, keep)
    missing.push(...result.missing)
    unit.write(result.values)
  }
  return [...new Set(missing)]
}
