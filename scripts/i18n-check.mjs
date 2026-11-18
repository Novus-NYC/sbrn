#!/usr/bin/env node
/**
 * Translation coverage check.
 *
 *   npm run i18n:check                       every language, every route
 *   npm run i18n:check -- --lang=es          one language
 *   npm run i18n:check -- --extract=out.json list every English phrase the site renders
 *
 * Needs the site running (npm run dev or npm start); set I18N_BASE to point
 * elsewhere (default http://localhost:3000). For each page it also opens the
 * states that render extra copy (the form confirmation, the outlet list) and
 * checks for sideways overflow at phone width, since translated words are
 * often longer than the English ones.
 */
import { writeFileSync } from "node:fs"
import { chromium } from "playwright"

const base = process.env.I18N_BASE || "http://localhost:3000"
const args = Object.fromEntries(process.argv.slice(2).map((arg) => arg.replace(/^--/, "").split("=")))
const routes = ["/", "/about", "/openandonline", "/stories", "/media", "/connect", "/privacy-policy", "/terms-of-service", "/this-page-does-not-exist"]
const all = ["el", "es", "ht", "ko", "ru", "tl", "ur", "zh"]
const targets = args.lang ? args.lang.split(",") : all

/** Reveal copy that only renders after an interaction. */
async function exercise(page, route, record) {
  await record()
  if (route === "/connect") {
    const form = page.locator("form.intake")
    for (const name of ["firstName", "lastName", "businessName"]) await form.locator(`[name=${name}]`).fill("Test")
    await form.locator("[name=email]").fill("test@example.com")
    await form.locator("[name=phone]").fill("2125550100")
    await form.locator("[name=borough]").selectOption({ index: 2 })
    await form.locator("button[type=submit]").click()
    await page.waitForTimeout(150)
    await record()
  }
  if (route === "/media") {
    await page.locator(".logo-reel__controls button").click()
    await page.waitForTimeout(150)
    await record()
  }
}

async function open(page, url) {
  await page.goto(url, { waitUntil: "networkidle" })
  await page.waitForFunction(() => window.__sbrnI18n?.ready(), null, { timeout: 15000 })
}

const browser = await chromium.launch()

if (args.extract) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const units = new Map()
  for (const route of routes) {
    await open(page, base + route)
    await exercise(page, route, async () => {
      for (const unit of await page.evaluate(() => window.__sbrnI18n.units())) {
        const seen = units.get(unit.key)
        if (seen) seen.routes.add(route)
        else units.set(unit.key, { ...unit, routes: new Set([route]) })
      }
    })
  }
  const out = [...units.values()].map((unit) => ({ ...unit, routes: [...unit.routes] }))
  writeFileSync(args.extract, JSON.stringify(out, null, 1))
  console.log(`${out.length} phrases written to ${args.extract}`)
  await browser.close()
  process.exit(0)
}

let failures = 0
const phone = await browser.newPage({ viewport: { width: 390, height: 844 } })
const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } })
for (const language of targets) {
  const missing = new Map()
  const overflow = []
  for (const route of routes) {
    const url = `${base}${route}?lang=${language}`
    await open(desktop, url)
    const state = await desktop.evaluate(() => ({ lang: document.documentElement.lang, dir: document.documentElement.dir }))
    if (state.lang !== language) throw new Error(`${url} did not switch: html lang is ${state.lang}`)
    await exercise(desktop, route, async () => {
      for (const text of await desktop.evaluate(() => window.__sbrnI18n.missing())) {
        if (!missing.has(text)) missing.set(text, route)
      }
    })
    await open(phone, url)
    const wide = await phone.evaluate(() => {
      const width = document.documentElement.clientWidth
      const offenders = []
      // Text that spills out of its own box: a translated word too long for its line.
      for (const element of document.querySelectorAll("main *, header *, footer *")) {
        if (!Array.from(element.childNodes).some((node) => node.nodeType === 3 && node.textContent.trim())) continue
        const style = getComputedStyle(element)
        if (style.overflowX !== "visible" || style.display === "inline" || element.closest("[aria-hidden=true], [inert], [hidden]")) continue
        if (element.scrollWidth > element.clientWidth + 2) offenders.push(`${element.tagName.toLowerCase()}.${String(element.className).split(" ")[0]} "${element.textContent.trim().slice(0, 40)}"`)
      }
      return { scroll: document.documentElement.scrollWidth > width, offenders: offenders.slice(0, 6) }
    })
    if (wide.scroll || wide.offenders.length) overflow.push(`${route}: ${wide.scroll ? "page scrolls sideways; " : ""}${wide.offenders.join(" | ")}`)
  }
  const ok = missing.size === 0 && overflow.length === 0
  if (!ok) failures++
  console.log(`\n${language}: ${missing.size} untranslated, ${overflow.length} overflow`)
  for (const [text, route] of missing) console.log(`  missing  ${route}  ${text}`)
  for (const line of overflow) console.log(`  overflow ${line}`)
}
await browser.close()
process.exit(failures ? 1 : 0)
