import { chromium } from 'playwright'
import { createRequire } from 'node:module'
import { mkdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
const require = createRequire(import.meta.url)
const base = process.env.QA_URL || 'http://localhost:3011'
const browser = await chromium.launch({channel: 'chrome', headless: true})
await mkdir('.shots/public-service', {recursive: true})
const routes = ['/', '/services', '/about', '/openandonline', '/stories', '/media', '/connect', '/privacy-policy', '/terms-of-service']
const report = {base, pages: [], checks: [], errors: []}
try {
  const page = await browser.newPage()
  page.on('pageerror', error => report.errors.push(error.message))
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({width, height: 900})
    for (const route of routes) {
      const response = await page.goto(base + route)
      await page.evaluate(() => document.fonts.ready)
      await page.addScriptTag({path: require.resolve('axe-core/axe.min.js')})
      // Exercise native lazy loading before checking image availability.
      if (width === 1440) {
        await page.evaluate(async () => {
          for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
            scrollTo(0,y)
            await new Promise(resolve => requestAnimationFrame(resolve))
          }
          await Promise.all([...document.images].map(image => image.decode().catch(() => {})))
          scrollTo(0,0)
        })
      }
      const result = await page.evaluate(async () => {
        const audit = await window.axe.run(document, {runOnly: {type: 'tag', values: ['wcag2a','wcag2aa','wcag21aa']}})
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          h1: document.querySelectorAll('h1').length,
          violations: audit.violations.map(v => ({id:v.id, nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),
          missingAlts: document.querySelectorAll('img:not([alt])').length,
          brokenImages: [...document.images].filter(image=>image.complete && image.naturalWidth===0).map(image=>image.src),
          footerCredit: document.querySelector('body > footer a[href="https://novusnyc.org"]')?.textContent.trim(),
          description: !!document.querySelector('meta[name="description"]')?.content,
          hiddenText: [...document.querySelectorAll('[data-reveal]')].filter(el => getComputedStyle(el).opacity === '0').length,
          emDashes: document.querySelector('main').innerText.includes('—'),
        }
      })
      report.pages.push({route, width, status: response.status(), ...result})
      if ([1440,768,390].includes(width)) await page.screenshot({path:`.shots/public-service/${route.replaceAll('/','') || 'home'}-${width}.png`})
      console.log(route, width, JSON.stringify(result))
    }
  }
  // All services are available at arbitrary scroll positions; there is no pinned stage on home.
  await page.goto(base)
  assert.equal(await page.locator('#morning').count(), 0)
  for (const y of [0, 400, 1000, 1600]) {
    await page.evaluate(y => scrollTo(0,y), y)
    assert.equal(await page.locator('.service-list li').count(), 5)
    for (const item of await page.locator('.service-list p').all()) assert.equal(await item.evaluate(el=>getComputedStyle(el).opacity), '1')
  }
  report.checks.push('All five service descriptions remain visible through normal scrolling')
  await page.goto(base)
  await page.keyboard.press('Tab')
  assert.equal(await page.locator('.skip').evaluate(el=>el===document.activeElement),true)
  await page.keyboard.press('Enter')
  assert.equal(await page.locator('#main').evaluate(el=>el===document.activeElement),true)
  await page.locator('.nav__toggle').click()
  await page.waitForFunction(()=>document.activeElement?.closest('#site-menu'))
  await page.keyboard.press('Escape')
  assert.equal(await page.locator('.nav__toggle').getAttribute('aria-expanded'),'false')
  assert.equal(await page.locator('.nav__toggle').evaluate(el=>el===document.activeElement),true)
  await page.locator('.nav__toggle').click()
  await page.locator('#site-menu a[href="/services"]').click()
  await page.waitForURL('**/services')
  await page.waitForFunction(()=>!document.getElementById('main').inert)
  assert.equal(await page.locator('#main').getAttribute('inert'), null)
  await page.locator('.nav__toggle').click()
  await page.locator('#site-menu a[href="/services"]').click()
  await page.waitForFunction(()=>document.querySelector('.nav__toggle').getAttribute('aria-expanded')==='false')
  report.checks.push('Skip link, mobile menu Escape/focus restoration and route navigation work')
  await page.goto(base + '/connect#queens')
  const anchor = await page.locator('#queens').boundingBox()
  assert.ok(anchor.y >= 60, `Anchor under nav: ${anchor.y}`)
  assert.match(await page.locator('.page-intro a[href*="formtitan"]').getAttribute('href'), /NYCSmallBusinessResourceNetwork/)
  report.checks.push('Borough anchor clears fixed navigation and business profile destination is preserved')
  await page.goto(base+'/walk')
  for (const y of [0,2500]) {
    await page.evaluate(y=>scrollTo(0,y), y)
    const exit = await page.locator('.walk-exit a').boundingBox()
    assert.ok(exit.y >= 50 && exit.y < 200)
  }
  for (const width of [1440, 390]) {
    await page.setViewportSize({width, height:844})
    await page.evaluate(()=>scrollTo(0,2000))
    await page.waitForFunction(()=>Number(getComputedStyle(document.querySelector('.offer__head')).opacity) > .9)
    const bar = await page.locator('.walk-exit').boundingBox()
    const heading = await page.locator('.offer__head').boundingBox()
    assert.ok(heading.y >= bar.y + bar.height, `Walk heading obscured at ${width}px`)
  }
  await page.setViewportSize({width:320, height:900})
  await page.locator('.walk-exit a').click()
  await page.waitForURL('**/services')
  report.checks.push('Walk exit remains visible without covering the scene heading and returns to services')
  await page.goto(base)
  await page.locator('.lang__toggle').click()
  await page.getByRole('dialog',{name:'Choose a language'}).waitFor()
  await page.getByRole('button',{name:'Close the language list'}).click()
  report.checks.push('Existing language picker opens and closes')
  const reduced = await browser.newPage({reducedMotion:'reduce',viewport:{width:390,height:844}})
  for (const route of routes) {
    await reduced.goto(base+route)
    assert.equal(await reduced.locator('[data-reveal]').evaluateAll(els=>els.filter(el=>getComputedStyle(el).opacity==='0').length),0)
    assert.equal(await reduced.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length),0)
  }
  report.checks.push('Reduced motion leaves all standard routes readable without running animations')
  const nojs = await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}})
  for (const route of ['/', '/services','/connect']) {
    await nojs.goto(base+route)
    assert.equal(await nojs.locator('h1').isVisible(),true)
    assert.equal(await nojs.locator('.nav__links a[href="/services"]').isVisible(),true)
    assert.equal(await nojs.locator('.nav__fallback a').isVisible(),true)
    assert.equal(await nojs.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
  }
  report.checks.push('Homepage, services and contact page work without JavaScript on mobile')
  assert.equal(report.pages.filter(p=>p.status!==200||p.overflow||p.h1!==1||p.violations.length||p.missingAlts||p.brokenImages.length||!p.description||p.footerCredit!=='Made by Novus'||p.hiddenText||p.emDashes).length,0)
  assert.equal(report.errors.length,0)
  const icon = await page.request.get(base+'/icon.png')
  assert.equal(icon.status(),200)
  report.checks.push('Page descriptions, loaded images, favicon and Made by Novus credit are present')
} catch (error) {
  report.failure = error.stack
  process.exitCode = 1
} finally {
  await writeFile('docs/public-service-qa.json',JSON.stringify(report,null,2)+'\n')
  await browser.close()
  console.log(JSON.stringify({checks:report.checks,failure:report.failure,errors:report.errors},null,2))
}
