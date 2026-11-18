import { compile, type Dictionary } from "../engine"
import type { TranslatedLanguage } from "../languages"

type Messages = Readonly<Record<string, string>>

/**
 * `en.json` holds the site's English copy by message id, exactly as it renders
 * (whitespace collapsed). Each language file holds the same ids. Phrases with
 * a link inside are written as segments joined by ‖ and must keep the same
 * number of segments; {0}, {1}… stand for names or numbers that are filled in.
 * Every file is its own chunk, fetched only when a reader picks that language.
 * Run `npm run i18n:check` after changing site copy to list what needs adding.
 */
const loaders: Record<TranslatedLanguage, () => Promise<{ default: Messages }>> = {
  el: () => import("./el.json"),
  es: () => import("./es.json"),
  ht: () => import("./ht.json"),
  ko: () => import("./ko.json"),
  ru: () => import("./ru.json"),
  tl: () => import("./tl.json"),
  ur: () => import("./ur.json"),
  zh: () => import("./zh.json"),
}

const cache = new Map<TranslatedLanguage, Promise<Dictionary>>()

export function loadDictionary(language: TranslatedLanguage): Promise<Dictionary> {
  let pending = cache.get(language)
  if (!pending) {
    pending = Promise.all([import("./en.json"), loaders[language]()]).then(([source, target]) => compile(source.default, target.default))
    // A failed fetch (offline) may be retried on the next choice.
    pending.catch(() => cache.delete(language))
    cache.set(language, pending)
  }
  return pending
}
