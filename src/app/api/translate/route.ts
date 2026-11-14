import { NextResponse } from "next/server"
import { isTarget, SOURCE } from "@/lib/i18n/languages"

/**
 * POST /api/translate  { target: "es", q: ["English text", ...] }
 *                   -> { translations: ["Texto", ...] }
 *
 * Translates the site's own English copy. Two providers:
 *   - GOOGLE_TRANSLATE_API_KEY set: Google Cloud Translation (v2), the
 *     supported API. Its free tier covers 500,000 characters a month.
 *   - otherwise: Google Translate's public web endpoint (no key). It is free
 *     but unofficial and can be rate limited, so set a key for production.
 *
 * Guard rails: source is always English, the target must be a listed
 * language, requests are size-capped and same-origin, and results are cached
 * in memory so a popular page is translated once per server instance.
 */

export const runtime = "nodejs"

const MAX_STRINGS = 80
const MAX_CHARS = 6000
const MAX_CACHE = 25_000

const cache = new Map<string, string>()

const key = (target: string, text: string) => `${target}\u0000${text}`

function remember(target: string, text: string, out: string) {
  if (cache.size >= MAX_CACHE) cache.delete(cache.keys().next().value as string)
  cache.set(key(target, text), out)
}

async function viaCloud(target: string, q: string[], apiKey: string): Promise<string[]> {
  const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q, source: SOURCE, target, format: "text" }),
  })
  if (!res.ok) throw new Error(`cloud ${res.status}`)
  const data = (await res.json()) as { data?: { translations?: { translatedText: string }[] } }
  const list = data.data?.translations
  if (!list || list.length !== q.length) throw new Error("cloud: bad shape")
  return list.map((t) => t.translatedText)
}

async function viaPublic(target: string, q: string[]): Promise<string[]> {
  const body = new URLSearchParams()
  for (const s of q) body.append("q", s)
  const res = await fetch(`https://translate.googleapis.com/translate_a/t?client=gtx&sl=${SOURCE}&tl=${encodeURIComponent(target)}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body,
  })
  if (!res.ok) throw new Error(`public ${res.status}`)
  const data = (await res.json()) as unknown
  const list = Array.isArray(data) ? data : [data]
  const out = list.map((item) => (Array.isArray(item) ? String(item[0]) : String(item)))
  if (out.length !== q.length) throw new Error("public: bad shape")
  return out
}

export async function POST(request: Request) {
  // Same-origin only: this is the site's translator, not an open proxy.
  const origin = request.headers.get("origin")
  if (origin) {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host")
    try {
      if (new URL(origin).host !== host) return NextResponse.json({ error: "forbidden" }, { status: 403 })
    } catch {
      return NextResponse.json({ error: "forbidden" }, { status: 403 })
    }
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 })
  }
  const { target, q } = (payload ?? {}) as { target?: unknown; q?: unknown }
  if (typeof target !== "string" || !isTarget(target)) {
    return NextResponse.json({ error: "unsupported language" }, { status: 400 })
  }
  if (!Array.isArray(q) || q.length === 0 || q.length > MAX_STRINGS || !q.every((s) => typeof s === "string")) {
    return NextResponse.json({ error: "q must be 1 to 80 strings" }, { status: 400 })
  }
  const texts = q as string[]
  if (texts.reduce((n, s) => n + s.length, 0) > MAX_CHARS) {
    return NextResponse.json({ error: "too much text" }, { status: 413 })
  }

  const missing = [...new Set(texts.filter((s) => !cache.has(key(target, s))))]
  if (missing.length) {
    try {
      const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY
      const done = apiKey ? await viaCloud(target, missing, apiKey) : await viaPublic(target, missing)
      missing.forEach((s, i) => remember(target, s, done[i]))
    } catch (error) {
      console.error("[translate]", error instanceof Error ? error.message : error)
      return NextResponse.json({ error: "translation unavailable" }, { status: 502 })
    }
  }

  return NextResponse.json(
    { translations: texts.map((s) => cache.get(key(target, s)) ?? s) },
    { headers: { "Cache-Control": "no-store" } },
  )
}
