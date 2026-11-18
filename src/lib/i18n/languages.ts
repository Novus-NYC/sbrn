/**
 * The site's languages: English plus the eight languages of the Network's
 * original site. Order follows the language code, as the original picker did.
 * `name` is the language in its own script; `read` is the invitation to switch,
 * written in that language so a reader recognises it without knowing English.
 * `label` and `choose` name the control itself in that language; `legalNote`
 * says, on the policy pages, that the English text is the official one.
 */
export const languages = [
  { code: "en", name: "English", english: "English", dir: "ltr", read: "Read in English", label: "Language", choose: "Choose a language", legalNote: "" },
  { code: "el", name: "Ελληνικά", english: "Greek", dir: "ltr", read: "Διαβάστε στα ελληνικά", label: "Γλώσσα", choose: "Επιλέξτε γλώσσα", legalNote: "Αυτή η μετάφραση παρέχεται για διευκόλυνσή σας. Επίσημο είναι το αγγλικό κείμενο." },
  { code: "es", name: "Español", english: "Spanish", dir: "ltr", read: "Leer en español", label: "Idioma", choose: "Elija un idioma", legalNote: "Esta traducción se ofrece para su comodidad. El texto oficial es la versión en inglés." },
  { code: "ht", name: "Kreyòl ayisyen", english: "Haitian Creole", dir: "ltr", read: "Li sit la an kreyòl", label: "Lang", choose: "Chwazi yon lang", legalNote: "Tradiksyon sa a la pou fasilite w. Se vèsyon an angle a ki tèks ofisyèl la." },
  { code: "ko", name: "한국어", english: "Korean", dir: "ltr", read: "한국어로 보기", label: "언어", choose: "언어 선택", legalNote: "이 번역은 편의를 위해 제공됩니다. 공식 문서는 영어 원문입니다." },
  { code: "ru", name: "Русский", english: "Russian", dir: "ltr", read: "Читать на русском", label: "Язык", choose: "Выберите язык", legalNote: "Этот перевод предоставлен для удобства. Официальным является текст на английском языке." },
  { code: "tl", name: "Tagalog", english: "Tagalog", dir: "ltr", read: "Basahin sa Tagalog", label: "Wika", choose: "Pumili ng wika", legalNote: "Ibinigay ang salin na ito para sa iyong kaginhawahan. Ang bersyong Ingles ang opisyal na teksto." },
  { code: "ur", name: "اردو", english: "Urdu", dir: "rtl", read: "اردو میں پڑھیں", label: "زبان", choose: "زبان منتخب کریں", legalNote: "یہ ترجمہ آپ کی سہولت کے لیے فراہم کیا گیا ہے۔ سرکاری متن انگریزی ورژن ہے۔" },
  { code: "zh", name: "中文", english: "Chinese (Simplified)", dir: "ltr", read: "用中文浏览", label: "语言", choose: "选择语言", legalNote: "此译文仅为方便阅读而提供，以英文原文为准。" },
] as const

export type LanguageInfo = (typeof languages)[number]
export type Language = LanguageInfo["code"]
export type TranslatedLanguage = Exclude<Language, "en">

export const defaultLanguage: Language = "en"
export const storageKey = "sbrn-language"

export const isLanguage = (value: unknown): value is Language =>
  typeof value === "string" && languages.some(({ code }) => code === value)

export const languageInfo = (code: Language): LanguageInfo =>
  languages.find((item) => item.code === code) ?? languages[0]

/**
 * Runs in <head> before first paint: applies a saved or linked (?lang=) choice
 * to <html lang dir> and hides the page until the dictionary has been applied,
 * so a returning reader never sees a flash of English. The class is removed by
 * the translation runtime, or after 2.5 seconds whatever happens.
 */
export const languageBootScript = `(function(){try{var d=document.documentElement,m=${JSON.stringify(
  Object.fromEntries(languages.filter((l) => l.code !== "en").map((l) => [l.code, l.dir])),
)},q=new URLSearchParams(location.search).get('lang'),l=q||localStorage.getItem(${JSON.stringify(storageKey)});if(l&&m[l]){d.lang=l;d.dir=m[l];d.classList.add('i18n-pending');setTimeout(function(){d.classList.remove('i18n-pending')},2500)}}catch(e){}})()`
