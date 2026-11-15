export const languages = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "es", label: "Español", dir: "ltr" },
  { code: "zh", label: "中文", dir: "ltr" },
  { code: "ko", label: "한국어", dir: "ltr" },
  { code: "ru", label: "Русский", dir: "ltr" },
  { code: "ht", label: "Kreyòl ayisyen", dir: "ltr" },
  { code: "ur", label: "اردو", dir: "rtl" },
  { code: "tl", label: "Tagalog", dir: "ltr" },
  { code: "el", label: "Ελληνικά", dir: "ltr" },
] as const

export type Language = (typeof languages)[number]["code"]
export const isLanguage = (value: string): value is Language => languages.some(({ code }) => code === value)
