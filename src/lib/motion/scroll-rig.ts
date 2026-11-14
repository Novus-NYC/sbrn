/**
 * One clock for every scroll-linked scene.
 *
 * The page always scrolls natively (nothing is hijacked). A scene only reads
 * how far its element has travelled and eases toward that value, so wheel
 * steps and touch flings arrive as a glide instead of a jump. The loop runs
 * only while at least one scene is near the viewport.
 */

export type SceneMode = "pin" | "pass"

export type SceneFrame = {
  /** Smoothed progress, 0..1. */
  progress: number
  /** Unsmoothed progress, 0..1. */
  raw: number
  /** Seconds since the rig started: use it for idle motion. */
  time: number
  /** Seconds since the previous frame. */
  dt: number
}

export type SceneOptions = {
  /**
   * pin:  the element is taller than the viewport and holds a sticky stage.
   *       0 when its top meets the viewport top, 1 when its bottom meets the bottom.
   * pass: the element travels through the viewport.
   *       0 when its top meets the viewport bottom, 1 when its bottom meets the top.
   */
  mode?: SceneMode
  /** Smoothing time constant in seconds. 0 follows the scrollbar exactly. */
  smooth?: number
  /** Keep ticking (for idle motion) while the element is on screen. */
  idle?: boolean
  onUpdate: (frame: SceneFrame) => void
}

type Scene = Required<Omit<SceneOptions, "onUpdate">> & {
  el: HTMLElement
  onUpdate: SceneOptions["onUpdate"]
  top: number
  height: number
  current: number
  near: boolean
  started: boolean
}

const scenes = new Set<Scene>()
let io: IntersectionObserver | null = null
let raf = 0
let last = 0
let start = 0
let vh = 0
let vw = 0
let listening = false

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)

function measure(scene: Scene) {
  const rect = scene.el.getBoundingClientRect()
  scene.top = rect.top + window.scrollY
  scene.height = rect.height
}

function target(scene: Scene): number {
  const y = window.scrollY
  if (scene.mode === "pin") {
    const span = scene.height - vh
    return span <= 0 ? 0 : clamp01((y - scene.top) / span)
  }
  return clamp01((y + vh - scene.top) / (scene.height + vh))
}

function tick(now: number) {
  raf = 0
  const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016)
  last = now
  let alive = false
  for (const scene of scenes) {
    if (!scene.near) continue
    const raw = target(scene)
    if (!scene.started || scene.smooth <= 0) {
      scene.current = raw
      scene.started = true
    } else {
      const diff = raw - scene.current
      scene.current = Math.abs(diff) < 0.00008 ? raw : scene.current + diff * (1 - Math.exp(-dt / scene.smooth))
    }
    scene.onUpdate({ progress: scene.current, raw, time: (now - start) / 1000, dt })
    if (scene.idle || scene.current !== raw) alive = true
  }
  if (alive) request()
}

function request() {
  if (!raf && !document.hidden) raf = requestAnimationFrame(tick)
}

function onScroll() {
  request()
}

function onResize() {
  const w = window.innerWidth
  const h = window.innerHeight
  // Mobile browsers fire resize when the address bar slides: only the height
  // changes, and svh-based stages do not move, so skip the re-measure.
  const widthChanged = w !== vw
  vw = w
  vh = h
  if (widthChanged) for (const scene of scenes) measure(scene)
  request()
}

function listen() {
  if (listening) return
  listening = true
  vh = window.innerHeight
  vw = window.innerWidth
  start = performance.now()
  window.addEventListener("scroll", onScroll, { passive: true })
  window.addEventListener("resize", onResize)
  document.addEventListener("visibilitychange", request)
  io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        for (const scene of scenes) {
          if (scene.el === entry.target) {
            scene.near = entry.isIntersecting
            if (scene.near) measure(scene)
          }
        }
      }
      request()
    },
    { rootMargin: "30% 0px 30% 0px" },
  )
}

function unlisten() {
  if (!listening || scenes.size) return
  listening = false
  window.removeEventListener("scroll", onScroll)
  window.removeEventListener("resize", onResize)
  document.removeEventListener("visibilitychange", request)
  io?.disconnect()
  io = null
  if (raf) cancelAnimationFrame(raf)
  raf = 0
  last = 0
}

/** Register a scene. Returns a cleanup function. */
export function addScene(el: HTMLElement, options: SceneOptions): () => void {
  listen()
  const scene: Scene = {
    el,
    mode: options.mode ?? "pass",
    smooth: options.smooth ?? 0.12,
    idle: options.idle ?? false,
    onUpdate: options.onUpdate,
    top: 0,
    height: 0,
    current: 0,
    near: false,
    started: false,
  }
  measure(scene)
  scenes.add(scene)
  io?.observe(el)
  request()
  return () => {
    scenes.delete(scene)
    io?.unobserve(el)
    unlisten()
  }
}

/** Re-measure every scene (after fonts or images change the layout). */
export function refreshScenes() {
  for (const scene of scenes) measure(scene)
  request()
}

/** The scroll position at which a pinned scene reaches the given progress. */
export function scrollTopForProgress(el: HTMLElement, progress: number): number {
  const rect = el.getBoundingClientRect()
  const top = rect.top + window.scrollY
  return top + (rect.height - window.innerHeight) * clamp01(progress)
}

export function motionEnabled(): boolean {
  return typeof document !== "undefined" && document.documentElement.classList.contains("motion")
}
