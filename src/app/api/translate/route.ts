import { NextResponse, type NextRequest } from "next/server"
import { isLanguage } from "@/lib/i18n/languages"

type TranslationResponse = { data?: { translations?: { translatedText: string }[] } }

/** The key is deliberately server-only. Set a Google Cloud Translation Basic API quota. */
export async function POST(request: NextRequest) {
  const key = process.env.GOOGLE_TRANSLATE_API_KEY
  if (!key) return NextResponse.json({ error: "Translation is not configured." }, { status: 503 })

  // This endpoint translates public page copy. Reject cross-origin requests and oversized batches.
  const origin = request.headers.get("origin")
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 })
  }
  if (Number(request.headers.get("content-length") || 0) > 20000) {
    return NextResponse.json({ error: "Translation batch too large." }, { status: 413 })
  }

  let body: unknown
  try { body = await request.json() } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }) }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  const { target, texts } = body as { target?: unknown; texts?: unknown }
  if (typeof target !== "string" || !isLanguage(target) || target === "en" ||
      !Array.isArray(texts) || texts.length < 1 || texts.length > 96 ||
      !texts.every((text) => typeof text === "string" && text.length > 0 && text.length <= 1000) ||
      texts.join("").length > 15000) {
    return NextResponse.json({ error: "Invalid translation batch." }, { status: 400 })
  }

  try {
    const response = await fetch("https://translation.googleapis.com/language/translate/v2", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-goog-api-key": key },
      body: JSON.stringify({ q: texts, source: "en", target, format: "text" }),
      cache: "no-store",
    })
    if (!response.ok) return NextResponse.json({ error: "Translation service unavailable." }, { status: 502 })
    const result = await response.json() as TranslationResponse
    const translations = result.data?.translations?.map((entry) => entry.translatedText)
    if (!translations || translations.length !== texts.length || translations.some((entry) => typeof entry !== "string")) {
      return NextResponse.json({ error: "Incomplete translation." }, { status: 502 })
    }
    return NextResponse.json({ translations }, { headers: { "Cache-Control": "private, max-age=3600" } })
  } catch {
    return NextResponse.json({ error: "Translation service unavailable." }, { status: 502 })
  }
}
