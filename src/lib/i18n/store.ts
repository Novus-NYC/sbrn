"use client"

import { useSyncExternalStore } from "react"
import { defaultLanguage, isLanguage, languageInfo, storageKey, type Language } from "./languages"

/**
 * The chosen language, shared by the navbar control, the hero greetings and
 * the translation runtime. The boot script in <head> has already written any
 * saved or linked choice to <html lang>, so that is the starting value.
 */
let current: Language = defaultLanguage
if (typeof document !== "undefined") {
  const booted = document.documentElement.lang
  if (isLanguage(booted)) current = booted
}

const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getLanguage() {
  return current
}

export function setLanguage(next: Language) {
  if (!isLanguage(next)) return
  const root = document.documentElement
  root.lang = next
  root.dir = languageInfo(next).dir
  try {
    if (next === defaultLanguage) window.localStorage.removeItem(storageKey)
    else window.localStorage.setItem(storageKey, next)
  } catch {
    // Private browsing can refuse storage; the choice still applies to this visit.
  }
  // Keep a shared link honest: ?lang= only appears when it says something.
  const url = new URL(window.location.href)
  if (url.searchParams.has("lang") || next !== defaultLanguage) {
    if (next === defaultLanguage) url.searchParams.delete("lang")
    else url.searchParams.set("lang", next)
    window.history.replaceState(window.history.state, "", url)
  }
  if (next === current) return
  current = next
  listeners.forEach((listener) => listener())
}

/** Server and hydration render English; the saved choice takes over right after. */
export function useLanguage() {
  return useSyncExternalStore(subscribe, getLanguage, () => defaultLanguage)
}
