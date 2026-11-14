"use client"

import { eases } from "animejs"
import { useEffect } from "react"
import { addScene, motionEnabled, scrollTopForProgress } from "@/lib/motion/scroll-rig"
import { Scrub, setDash, setOpacity, setScaleX, setScaleY, setSvgY, setY } from "@/lib/motion/scrub"

/**
 * The morning, as a function of one number.
 *
 * `p` is how far the visitor has scrolled through the pinned section.
 *   0.00 to 0.115   the hero gate rolls up
 *   0.08 to 0.21    the block before dawn; the offer is introduced
 *   0.185 to 0.91   five shops, one at a time: the camera walks to it, its
 *                   gate goes up, its lights come on, its service is named
 *   0.91 to 1.00    pull back: the whole block is open, in daylight
 * The sky, the facades and the color of the copy all read the same number.
 */

const HERO_END = 0.115
const SHOPS_START = 0.185
const SHOP_LEN = 0.145
const WIDE_START = 0.91
const DAY_FLIP = 0.628
const GATE_TRAVEL = -200

const shopStart = (i: number) => SHOPS_START + i * SHOP_LEN
const readPoint = (i: number) => shopStart(i) + 0.085

const all = <T extends Element>(root: Element, selector: string) => Array.from(root.querySelectorAll<T>(selector))

export default function MorningDriver({ count }: { count: number }) {
  useEffect(() => {
    if (!motionEnabled()) return
    const section = document.getElementById("morning")
    const stage = section?.querySelector<HTMLElement>(".morning__stage")
    if (!section || !stage) return

    const q = (selector: string) => stage.querySelector<HTMLElement>(selector)
    const herogate = q(".herogate")
    const glow = q(".herogate__glow")
    const street = q("[data-street]")
    const fore = q("[data-fore]")
    const skyline = q(".skyline-wrap")
    const head = q(".offer__head")
    const countEl = q("[data-offer-count]")
    const countWrap = q(".offer__count")
    const intro = q(".offer__intro")
    const final = q(".offer__final")
    const nav = q(".offer__nav")
    if (!herogate || !street || !fore || !skyline || !head || !intro || !final || !nav) return

    const shops = all<HTMLElement>(stage, ".b--shop")
    const fillers = all<HTMLElement>(stage, ".b--filler")
    const items = all<HTMLElement>(stage, ".offer__item")
    const ticks = all<HTMLButtonElement>(stage, ".offer__ticks button")

    const cam = { f: 0, s: 1, k: 1.35 }
    let scrub = new Scrub()
    let stageW = 0
    let origin = 0
    let lastCam = ""
    let lastIndex = -2
    let lastFlags = ""

    const build = () => {
      scrub = new Scrub()
      stageW = stage.clientWidth
      const shopW = shops[0].offsetWidth
      const em = shopW / 44
      const centers = shops.map((el) => el.offsetLeft + el.offsetWidth / 2)
      origin = centers[0]
      const drift = em * 1.7
      const narrow = stageW < 720
      const fit = stageW / (shopW * (count + 1.3))
      const wide = narrow ? Math.max(0.5, fit) : Math.min(1, fit)

      /* ---- the gate ---- */
      scrub.add("gate", setY(herogate), 0.003, HERO_END, 0, -104)

      /* ---- camera: a slow dolly that never quite stops ---- */
      const setF = (v: number) => {
        cam.f = v
      }
      const setS = (v: number) => {
        cam.s = v
      }
      scrub.add("cam.s", setS, 0, HERO_END + 0.03, 1.1, 1, eases.outCubic)
      scrub.add("cam.f", setF, 0, shopStart(0) + 0.105, centers[0] - drift * 1.6, centers[0] + drift)
      for (let i = 1; i < count; i++) {
        const s = shopStart(i)
        scrub.add("cam.f", setF, s - 0.04, s + 0.035, centers[i - 1] + drift, centers[i] - drift, eases.inOutSine)
        scrub.add("cam.f", setF, s + 0.035, s + 0.105, centers[i] - drift, centers[i] + drift)
      }
      const mid = centers[Math.floor(count / 2)]
      scrub.add("cam.f", setF, WIDE_START - 0.005, 0.975, centers[count - 1] + drift, mid, eases.inOutSine)
      scrub.add("cam.s", setS, WIDE_START - 0.005, 0.975, 1, wide, eases.inOutSine)
      // pulling back flattens the parallax: the near layer settles onto the block
      scrub.add(
        "cam.k",
        (v) => {
          cam.k = v
        },
        WIDE_START - 0.005,
        0.975,
        1.35,
        1,
        eases.inOutSine,
      )

      /* ---- sky ---- */
      scrub.add("night", setOpacity(q(".sky__night")), 0.17, 0.5, 1, 0, eases.inOutSine)
      scrub.add("dawn", setOpacity(q(".sky__dawn")), 0.602, 0.672, 1, 0, eases.inOutSine)
      scrub.add("flare", setOpacity(q(".sky__flare")), 0.47, 0.635, 0, 1, eases.inOutSine)
      scrub.add("flare", setOpacity(q(".sky__flare")), 0.635, 0.78, 1, 0.3, eases.outCubic)
      scrub.add("sun", setY(q(".sky__sun"), "svh"), 0.44, 0.7, 40, -22, eases.outCubic)
      scrub.add("sun", setY(q(".sky__sun"), "svh"), 0.7, 1, -22, -31)
      scrub.add("skyline", setOpacity(q(".skyline--night")), 0.2, 0.52, 1, 0.6)
      scrub.add("skyline", setOpacity(q(".skyline--night")), 0.585, 0.69, 0.6, 0, eases.inOutSine)

      /* ---- the whole block lightens ---- */
      const shades = [...all<HTMLElement>(stage, ".b-shade"), ...all<HTMLElement>(stage, ".road__shade")]
      scrub.add("shade", setOpacity(shades), 0.18, 0.5, 0.66, 0.5)
      scrub.add("shade", setOpacity(shades), 0.58, 0.7, 0.5, 0, eases.inOutSine)
      scrub.add("awake", setOpacity(all<SVGElement>(stage, ".b-awake")), 0.56, 0.68, 1, 0)
      scrub.add("lamps", setOpacity(all<HTMLElement>(stage, ".fore__glow")), 0.55, 0.67, 1, 0)

      /* ---- copy over the sky ---- */
      scrub.add("head", setOpacity(head), 0.08, 0.115, 0, 1)
      scrub.add("head", setOpacity(head), 0.885, 0.905, 1, 0)
      scrub.add("count", setOpacity(countWrap), shopStart(0) + 0.03, shopStart(0) + 0.05, 0, 1)
      scrub.add("intro.o", setOpacity(intro), 0.085, 0.125, 0, 1)
      scrub.add("intro.o", setOpacity(intro), shopStart(0) + 0.004, shopStart(0) + 0.028, 1, 0)
      scrub.add("intro.y", setY(intro, "px"), 0.085, 0.13, 28, 0, eases.outCubic)
      scrub.add("intro.y", setY(intro, "px"), shopStart(0) + 0.004, shopStart(0) + 0.028, 0, -18, eases.inCubic)
      scrub.add("nav", setOpacity(nav), 0.13, 0.16, 0, 1)

      /* ---- each shop opens ---- */
      shops.forEach((shop, i) => {
        const s = shopStart(i)
        const $ = <T extends Element = SVGElement>(sel: string) => all<T>(shop, sel)
        const id = `shop${i}`

        scrub.add(`${id}.gate`, setSvgY($(".b-gate")), s + 0.022, s + 0.074, 0, GATE_TRAVEL, eases.inOutCubic)

        // fluorescent tubes catching
        const lit = setOpacity($(".b-lit"))
        scrub.add(`${id}.lit`, lit, s + 0.046, s + 0.052, 0, 0.8)
        scrub.add(`${id}.lit`, lit, s + 0.052, s + 0.057, 0.8, 0.22)
        scrub.add(`${id}.lit`, lit, s + 0.057, s + 0.072, 0.22, 1, eases.outCubic)

        scrub.add(`${id}.sign`, setOpacity($(".b-signlit")), s + 0.056, s + 0.078, 0, 1)

        const neon = setOpacity($(".b-neon"))
        scrub.add(`${id}.neon`, neon, s + 0.07, s + 0.073, 0, 1)
        scrub.add(`${id}.neon`, neon, s + 0.073, s + 0.076, 1, 0.25)
        scrub.add(`${id}.neon`, neon, s + 0.076, s + 0.081, 0.25, 1)

        scrub.add(`${id}.awning`, setScaleY($(".b-awning")), s + 0.064, s + 0.096, 0.1, 1, eases.outBack(1.5))
        scrub.add(`${id}.pop.o`, setOpacity($(".b-pop")), s + 0.076, s + 0.09, 0, 1)
        scrub.add(`${id}.pop.y`, setSvgY($(".b-pop")), s + 0.076, s + 0.1, 18, 0, eases.outBack(1.8))

        // light on the sidewalk matters only while it is still dark out
        if (s < 0.5) {
          const pool = setOpacity($(".b-pool"))
          scrub.add(`${id}.pool`, pool, s + 0.056, s + 0.08, 0, 1)
          scrub.add(`${id}.pool`, pool, 0.58, 0.68, 1, 0)
        }

        // window displays finish themselves
        $(".b-page").forEach((el, j) => {
          scrub.add(`${id}.page${j}`, setScaleX(el), s + 0.074 + j * 0.006, s + 0.09 + j * 0.006, 0, 1, eases.outCubic)
        })
        scrub.add(`${id}.sig`, setDash($(".b-sig")), s + 0.078, s + 0.104, 1, 0)
        scrub.add(`${id}.chart`, setDash($(".b-chart")), s + 0.076, s + 0.1, 1, 0, eases.inOutSine)
        $(".b-tick").forEach((el, j) => {
          scrub.add(`${id}.tick${j}`, setDash(el), s + 0.086 + j * 0.007, s + 0.096 + j * 0.007, 1, 0)
        })

        // its name, rolled up into the sky
        const item = items[i]
        if (item) {
          const line = setY(all<HTMLElement>(item, ".offer__name .ln > span"))
          const detail = all<HTMLElement>(item, ".offer__detail")
          scrub.add(`${id}.name`, line, s + 0.032, s + 0.066, 110, 0, eases.outCubic)
          scrub.add(`${id}.name`, line, s + 0.106, s + 0.126, 0, -112, eases.inCubic)
          scrub.add(`${id}.detail.o`, setOpacity(detail), s + 0.052, s + 0.076, 0, 1)
          scrub.add(`${id}.detail.o`, setOpacity(detail), s + 0.102, s + 0.118, 1, 0)
          scrub.add(`${id}.detail.y`, setY(detail, "px"), s + 0.052, s + 0.08, 16, 0, eases.outCubic)
        }
      })

      /* ---- finale: the rest of the block follows ---- */
      fillers.forEach((b, k) => {
        const order = [2, 1, 0, 3, 4, 5].indexOf(k)
        const t = WIDE_START + 0.012 + Math.max(0, order) * 0.007
        const $ = (sel: string) => all<SVGElement>(b, sel)
        scrub.add(`f${k}.gate`, setSvgY($(".b-gate")), t, t + 0.04, 0, GATE_TRAVEL, eases.inOutCubic)
        scrub.add(`f${k}.lit`, setOpacity($(".b-lit")), t + 0.016, t + 0.036, 0, 1)
        scrub.add(`f${k}.sign`, setOpacity($(".b-signlit")), t + 0.02, t + 0.04, 0, 1)
        scrub.add(`f${k}.neon`, setOpacity($(".b-neon")), t + 0.03, t + 0.04, 0, 1)
        scrub.add(`f${k}.awning`, setScaleY($(".b-awning")), t + 0.022, t + 0.05, 0.1, 1, eases.outBack(1.5))
      })

      all<HTMLElement>(final, ".offer__promise .ln > span").forEach((el, j) => {
        scrub.add(`final${j}`, setY(el), 0.925 + j * 0.011, 0.962 + j * 0.011, 110, 0, eases.outCubic)
      })
      scrub.add("final.cta", setOpacity(all<HTMLElement>(final, ".offer__finalcta")), 0.955, 0.985, 0, 1)

      lastCam = ""
      lastIndex = -2
      lastFlags = ""
    }

    /* ---- the lamp on the hero gate leans toward the pointer ---- */
    const aim = { x: 0.24, y: 0.3 }
    const lamp = { x: 0.24, y: 0.3 }
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      const r = stage.getBoundingClientRect()
      aim.x = (e.clientX - r.left) / r.width
      aim.y = (e.clientY - r.top) / r.height
    }
    stage.addEventListener("pointermove", onPointer, { passive: true })

    build()

    const remove = addScene(section, {
      mode: "pin",
      smooth: 0.105,
      idle: true,
      onUpdate: ({ progress: p, time, dt }) => {
        scrub.render(p)

        // camera
        const x = stageW / 2 - cam.f * cam.s
        const key = `${x.toFixed(1)}|${cam.s.toFixed(4)}|${cam.k.toFixed(3)}`
        if (key !== lastCam) {
          lastCam = key
          street.style.transform = `translate3d(${x.toFixed(1)}px,0,0) scale(${cam.s.toFixed(4)})`
          fore.style.transform = `translate3d(${(stageW / 2 - cam.f * cam.k * cam.s).toFixed(1)}px,0,0) scale(${cam.s.toFixed(4)})`
          skyline.style.transform = `translate3d(${(-(cam.f - origin) * 0.14).toFixed(1)}px,0,0) scale(${(1 + (cam.s - 1) * 0.3).toFixed(4)})`
        }

        // discrete state, all from the same number
        const away = p > HERO_END + 0.004
        const day = p > DAY_FLIP
        const done = p > 0.93
        const flags = `${away}${day}${done}`
        if (flags !== lastFlags) {
          lastFlags = flags
          herogate.classList.toggle("is-away", away)
          herogate.toggleAttribute("inert", away)
          stage.classList.toggle("is-day", day)
          final.classList.toggle("is-on", done)
        }

        let index = -1
        for (let i = 0; i < count; i++) {
          const s = shopStart(i)
          if (p >= s + 0.03 && p <= s + 0.122) index = i
        }
        const reached = Math.min(count - 1, Math.max(0, Math.floor((p - SHOPS_START + 0.02) / SHOP_LEN)))
        const stateKey = index * 10 + reached
        if (stateKey !== lastIndex) {
          lastIndex = stateKey
          items.forEach((el, i) => el.classList.toggle("is-on", i === index))
          if (countEl) countEl.textContent = String(reached + 1)
          ticks.forEach((b, i) => {
            b.classList.toggle("is-open", p >= shopStart(i) + 0.05)
            if (i === index) b.setAttribute("aria-current", "step")
            else b.removeAttribute("aria-current")
          })
        } else {
          ticks.forEach((b, i) => b.classList.toggle("is-open", p >= shopStart(i) + 0.05))
        }

        // idle: the lamp drifts, and follows the pointer, while the gate is down
        if (glow && !away) {
          const k = 1 - Math.exp(-dt / 0.35)
          lamp.x += (aim.x + Math.sin(time * 0.45) * 0.025 - lamp.x) * k
          lamp.y += (aim.y + Math.cos(time * 0.37) * 0.02 - lamp.y) * k
          glow.style.transform = `translate3d(${(lamp.x * 100).toFixed(2)}vw,${(lamp.y * 100).toFixed(2)}vh,0)`
        }
      },
    })

    /* ---- getting around without scrolling by hand ---- */
    const go = (progress: number) => {
      window.scrollTo({ top: scrollTopForProgress(section, progress), behavior: "smooth" })
    }
    const cleanups: Array<() => void> = []
    const on = <K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, fn: (e: HTMLElementEventMap[K]) => void) => {
      el.addEventListener(type, fn)
      cleanups.push(() => el.removeEventListener(type, fn))
    }
    ticks.forEach((b, i) => on(b, "click", () => go(readPoint(i))))
    items.forEach((el, i) =>
      on(el, "focusin", () => {
        if (!el.classList.contains("is-on")) window.scrollTo({ top: scrollTopForProgress(section, readPoint(i)) })
      }),
    )
    on(final, "focusin", () => {
      if (!final.classList.contains("is-on")) window.scrollTo({ top: scrollTopForProgress(section, 0.995) })
    })
    on(herogate, "focusin", () => {
      if (herogate.classList.contains("is-away")) window.scrollTo({ top: scrollTopForProgress(section, 0) })
    })
    const jump = stage.querySelector<HTMLElement>("[data-offer-jump]")
    if (jump) {
      on(jump, "click", (e) => {
        e.preventDefault()
        go(readPoint(0))
      })
    }

    /* ---- re-measure when the stage changes width ---- */
    let width = stage.clientWidth
    let timer = 0
    const ro = new ResizeObserver(() => {
      if (stage.clientWidth === width) return
      width = stage.clientWidth
      window.clearTimeout(timer)
      timer = window.setTimeout(build, 120)
    })
    ro.observe(stage)
    document.fonts?.ready.then(build).catch(() => {})

    return () => {
      remove()
      ro.disconnect()
      window.clearTimeout(timer)
      stage.removeEventListener("pointermove", onPointer)
      cleanups.forEach((fn) => fn())
    }
  }, [count])

  return null
}
