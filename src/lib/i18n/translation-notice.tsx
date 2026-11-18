"use client"

import { languageInfo, languages } from "./languages"
import { setLanguage, useLanguage } from "./store"

/**
 * Policy pages are machine-free but still translations: say, in the reader's
 * language, that the English text governs, and offer it in one press.
 */
export default function TranslationNotice() {
  const language = useLanguage()
  if (language === "en") return null
  const current = languageInfo(language)
  const english = languages[0]
  return (
    <aside className="legal__notice" translate="no" lang={current.code} dir={current.dir}>
      <p>{current.legalNote}</p>
      <button type="button" lang="en" dir="ltr" onClick={() => setLanguage("en")}>
        {english.read}
      </button>
    </aside>
  )
}
