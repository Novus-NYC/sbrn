import { chromium } from 'playwright'
import assert from 'node:assert/strict'
const base = process.env.QA_URL || 'http://localhost:3011'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(base + '/openandonline')
  const frames = page.locator('.wall .frame')
  assert.equal(await frames.count(), 12)
  for (const frame of await frames.all()) {
    await frame.scrollIntoViewIfNeeded()
    await page.mouse.move(1, 1)
    await frame.locator('img').evaluate(image => image.decode())
    await frame.hover()
    const name = await frame.locator('.frame__name').innerText()
    await page.waitForFunction(element => getComputedStyle(element.querySelector('img')).transform !== 'none', await frame.elementHandle(), { timeout: 1500 }).catch(() => {
      assert.fail(`${name}: hovering does not animate the preview`)
    })
  }
  const xenia = page.locator('.frame').filter({has:page.locator('img[src*="xenia-world-wide-travel"]')})
  assert.equal(await xenia.evaluate(element => element.tagName), 'DIV', 'Do not invent a live destination to enable animation')
  const linked = page.locator('a.frame').first()
  await page.mouse.move(1,1)
  await linked.focus()
  await page.waitForFunction(element => element.matches(':focus-visible') && getComputedStyle(element.querySelector('img')).transform !== 'none', await linked.elementHandle())
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await xenia.hover()
  assert.equal(await xenia.locator('img').evaluate(element => getComputedStyle(element).transform), 'none')
  console.log('PASS: all 12 previews animate on hover, links animate on keyboard focus, missing URLs stay unlinked, reduced motion is respected')
} finally {
  await browser.close()
}
