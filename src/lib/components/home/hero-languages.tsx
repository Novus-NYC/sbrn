"use client"

import { hero } from "@/lib/data/site"
import { languageInfo, languages, type Language } from "@/lib/i18n/languages"
import { setLanguage, useLanguage } from "@/lib/i18n/store"
import { Globe } from "../language-switcher"

const greetings: Record<Language, string> = {
  en: hero.answer,
  ...(Object.fromEntries(hero.greetings.map((g) => [g.lang, g.text])) as Record<Exclude<Language, "en">, string>),
}

/**
 * The hero answer in every other language the Network speaks. Each line is the
 * way into the site in that language: one press translates every page.
 * Written in each language's own words, so it is never machine translated.
 */
export default function HeroLanguages() {
  const language = useLanguage()
  const current = languageInfo(language)
  const others = languages.filter((item) => item.code !== language)

  return (
    <div className="greetings-wrap" translate="no" data-reveal="" style={{ ["--d" as string]: "360ms" }}>
      <p className="greetings__label" lang={current.code} dir={current.dir}>
        <Globe className="greetings__globe" />
        <span>{current.choose}</span>
      </p>
      <ul className="greetings" lang={current.code} aria-label={current.choose}>
        {others.map((item, i) => (
          <li key={item.code} lang={item.code} dir={item.dir} style={{ ["--i" as string]: i }}>
            <button type="button" title={item.read} onClick={() => setLanguage(item.code)}>
              <span className="greetings__text">{greetings[item.code]}</span>
              <span className="greetings__code" aria-hidden="true">
                {item.code.toUpperCase()}
              </span>
              <span className="sr-only">, {item.read}</span>
            </button>
          </li>
        ))}
      </ul>
      {/* Narrow screens: the answer cycles through the languages above a row of plain choices. */}
      <p className="greetings__ticker" aria-hidden="true">
        {others.map((item, i) => (
          <span key={item.code} lang={item.code} dir={item.dir} style={{ ["--i" as string]: i }}>
            {greetings[item.code]}
          </span>
        ))}
      </p>
      <ul className="greetings__chips" lang={current.code} aria-label={current.choose}>
        {others.map((item) => (
          <li key={item.code}>
            <button type="button" lang={item.code} dir={item.dir} onClick={() => setLanguage(item.code)}>
              {item.name}
              <span className="sr-only">, {item.read}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
