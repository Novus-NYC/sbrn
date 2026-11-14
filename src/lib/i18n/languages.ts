/**
 * Languages the site can be shown in.
 *
 * English is the source. Every other language is machine translated on
 * request (see `src/app/api/translate/route.ts`). The codes are Google
 * Translate's; `html` is the BCP 47 tag written to <html lang>.
 */

export type Language = {
  /** Google Translate code, sent to the translation route */
  code: string
  /** English name, used for search and as a fallback label */
  name: string
  /** The language's name for itself */
  native: string
  /** BCP 47 tag for <html lang>, when it differs from `code` */
  html?: string
  rtl?: boolean
}

export const SOURCE = "en"

/**
 * New York's five most-spoken languages after English, in the order of NYC
 * Local Law 30's designated citywide languages: Spanish, Chinese, Russian,
 * Bengali, Haitian Creole.
 */
export const FEATURED = ["es", "zh-CN", "ru", "bn", "ht"] as const

export const LANGUAGES: Language[] = [
  { code: "en", name: "English", native: "English" },
  { code: "es", name: "Spanish", native: "Español" },
  { code: "zh-CN", name: "Chinese (Simplified)", native: "简体中文", html: "zh-Hans" },
  { code: "zh-TW", name: "Chinese (Traditional)", native: "繁體中文", html: "zh-Hant" },
  { code: "ru", name: "Russian", native: "Русский" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "ht", name: "Haitian Creole", native: "Kreyòl ayisyen" },
  { code: "ko", name: "Korean", native: "한국어" },
  { code: "ar", name: "Arabic", native: "العربية", rtl: true },
  { code: "ur", name: "Urdu", native: "اردو", rtl: true },
  { code: "fr", name: "French", native: "Français" },
  { code: "pl", name: "Polish", native: "Polski" },
  { code: "yi", name: "Yiddish", native: "ייִדיש", rtl: true },
  { code: "it", name: "Italian", native: "Italiano" },
  { code: "tl", name: "Tagalog (Filipino)", native: "Tagalog", html: "fil" },
  { code: "el", name: "Greek", native: "Ελληνικά" },
  { code: "he", name: "Hebrew", native: "עברית", rtl: true },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "ne", name: "Nepali", native: "नेपाली" },
  { code: "uk", name: "Ukrainian", native: "Українська" },
  { code: "ja", name: "Japanese", native: "日本語" },
  { code: "vi", name: "Vietnamese", native: "Tiếng Việt" },
  { code: "pt", name: "Portuguese", native: "Português" },
  { code: "fa", name: "Persian", native: "فارسی", rtl: true },
  { code: "tr", name: "Turkish", native: "Türkçe" },
  { code: "de", name: "German", native: "Deutsch" },
  { code: "af", name: "Afrikaans", native: "Afrikaans" },
  { code: "sq", name: "Albanian", native: "Shqip" },
  { code: "am", name: "Amharic", native: "አማርኛ" },
  { code: "hy", name: "Armenian", native: "Հայերեն" },
  { code: "as", name: "Assamese", native: "অসমীয়া" },
  { code: "ay", name: "Aymara", native: "Aymar aru" },
  { code: "az", name: "Azerbaijani", native: "Azərbaycan" },
  { code: "bm", name: "Bambara", native: "Bamanankan" },
  { code: "eu", name: "Basque", native: "Euskara" },
  { code: "be", name: "Belarusian", native: "Беларуская" },
  { code: "bho", name: "Bhojpuri", native: "भोजपुरी" },
  { code: "bs", name: "Bosnian", native: "Bosanski" },
  { code: "bg", name: "Bulgarian", native: "Български" },
  { code: "ca", name: "Catalan", native: "Català" },
  { code: "ceb", name: "Cebuano", native: "Cebuano" },
  { code: "ny", name: "Chichewa", native: "Chichewa" },
  { code: "co", name: "Corsican", native: "Corsu" },
  { code: "hr", name: "Croatian", native: "Hrvatski" },
  { code: "cs", name: "Czech", native: "Čeština" },
  { code: "da", name: "Danish", native: "Dansk" },
  { code: "dv", name: "Dhivehi", native: "ދިވެހި", rtl: true },
  { code: "doi", name: "Dogri", native: "डोगरी" },
  { code: "nl", name: "Dutch", native: "Nederlands" },
  { code: "eo", name: "Esperanto", native: "Esperanto" },
  { code: "et", name: "Estonian", native: "Eesti" },
  { code: "ee", name: "Ewe", native: "Eʋegbe" },
  { code: "fi", name: "Finnish", native: "Suomi" },
  { code: "fy", name: "Frisian", native: "Frysk" },
  { code: "gl", name: "Galician", native: "Galego" },
  { code: "ka", name: "Georgian", native: "ქართული" },
  { code: "gn", name: "Guarani", native: "Avañe'ẽ" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "ha", name: "Hausa", native: "Hausa" },
  { code: "haw", name: "Hawaiian", native: "ʻŌlelo Hawaiʻi" },
  { code: "hmn", name: "Hmong", native: "Hmoob" },
  { code: "hu", name: "Hungarian", native: "Magyar" },
  { code: "is", name: "Icelandic", native: "Íslenska" },
  { code: "ig", name: "Igbo", native: "Igbo" },
  { code: "ilo", name: "Ilocano", native: "Ilokano" },
  { code: "id", name: "Indonesian", native: "Bahasa Indonesia" },
  { code: "ga", name: "Irish", native: "Gaeilge" },
  { code: "jv", name: "Javanese", native: "Basa Jawa" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "kk", name: "Kazakh", native: "Қазақ тілі" },
  { code: "km", name: "Khmer", native: "ខ្មែរ" },
  { code: "rw", name: "Kinyarwanda", native: "Ikinyarwanda" },
  { code: "gom", name: "Konkani", native: "कोंकणी" },
  { code: "kri", name: "Krio", native: "Krio" },
  { code: "ku", name: "Kurdish (Kurmanji)", native: "Kurdî" },
  { code: "ckb", name: "Kurdish (Sorani)", native: "کوردی", rtl: true },
  { code: "ky", name: "Kyrgyz", native: "Кыргызча" },
  { code: "lo", name: "Lao", native: "ລາວ" },
  { code: "la", name: "Latin", native: "Latina" },
  { code: "lv", name: "Latvian", native: "Latviešu" },
  { code: "ln", name: "Lingala", native: "Lingála" },
  { code: "lt", name: "Lithuanian", native: "Lietuvių" },
  { code: "lg", name: "Luganda", native: "Luganda" },
  { code: "lb", name: "Luxembourgish", native: "Lëtzebuergesch" },
  { code: "mk", name: "Macedonian", native: "Македонски" },
  { code: "mai", name: "Maithili", native: "मैथिली" },
  { code: "mg", name: "Malagasy", native: "Malagasy" },
  { code: "ms", name: "Malay", native: "Bahasa Melayu" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "mt", name: "Maltese", native: "Malti" },
  { code: "mi", name: "Maori", native: "Te Reo Māori" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "mni-Mtei", name: "Meiteilon (Manipuri)", native: "ꯃꯤꯇꯩꯂꯣꯟ", html: "mni" },
  { code: "lus", name: "Mizo", native: "Mizo ṭawng" },
  { code: "mn", name: "Mongolian", native: "Монгол" },
  { code: "my", name: "Myanmar (Burmese)", native: "မြန်မာ" },
  { code: "no", name: "Norwegian", native: "Norsk" },
  { code: "or", name: "Odia (Oriya)", native: "ଓଡ଼ିଆ" },
  { code: "om", name: "Oromo", native: "Afaan Oromoo" },
  { code: "ps", name: "Pashto", native: "پښتو", rtl: true },
  { code: "qu", name: "Quechua", native: "Runasimi" },
  { code: "ro", name: "Romanian", native: "Română" },
  { code: "sm", name: "Samoan", native: "Gagana Sāmoa" },
  { code: "sa", name: "Sanskrit", native: "संस्कृतम्" },
  { code: "gd", name: "Scots Gaelic", native: "Gàidhlig" },
  { code: "nso", name: "Sepedi", native: "Sepedi" },
  { code: "sr", name: "Serbian", native: "Српски" },
  { code: "st", name: "Sesotho", native: "Sesotho" },
  { code: "sn", name: "Shona", native: "chiShona" },
  { code: "sd", name: "Sindhi", native: "سنڌي", rtl: true },
  { code: "si", name: "Sinhala", native: "සිංහල" },
  { code: "sk", name: "Slovak", native: "Slovenčina" },
  { code: "sl", name: "Slovenian", native: "Slovenščina" },
  { code: "so", name: "Somali", native: "Soomaali" },
  { code: "su", name: "Sundanese", native: "Basa Sunda" },
  { code: "sw", name: "Swahili", native: "Kiswahili" },
  { code: "sv", name: "Swedish", native: "Svenska" },
  { code: "tg", name: "Tajik", native: "Тоҷикӣ" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "tt", name: "Tatar", native: "Татарча" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "th", name: "Thai", native: "ไทย" },
  { code: "ti", name: "Tigrinya", native: "ትግርኛ" },
  { code: "ts", name: "Tsonga", native: "Xitsonga" },
  { code: "tk", name: "Turkmen", native: "Türkmençe" },
  { code: "ak", name: "Twi", native: "Twi" },
  { code: "ug", name: "Uyghur", native: "ئۇيغۇرچە", rtl: true },
  { code: "uz", name: "Uzbek", native: "Oʻzbek" },
  { code: "cy", name: "Welsh", native: "Cymraeg" },
  { code: "xh", name: "Xhosa", native: "isiXhosa" },
  { code: "yo", name: "Yoruba", native: "Yorùbá" },
  { code: "zu", name: "Zulu", native: "isiZulu" },
]

const BY_CODE = new Map(LANGUAGES.map((l) => [l.code, l]))

export const getLanguage = (code: string): Language | undefined => BY_CODE.get(code)

export const isTarget = (code: string) => code !== SOURCE && BY_CODE.has(code)

/** Lowercase, accents stripped: "español" and "espanol" both match. */
export const fold = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
