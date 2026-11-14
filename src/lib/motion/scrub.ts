/**
 * A stateless scrub timeline.
 *
 * Scroll can jump anywhere at any time (a flick, the scrollbar, a keyboard
 * jump), so every value is computed fresh from the playhead position instead
 * of being advanced from the previous frame. Whatever order positions arrive
 * in, the picture for a given position is always the same.
 */

export type Ease = (t: number) => number

type Key = { t0: number; t1: number; from: number; to: number; ease: Ease }

type Track = {
  apply: (value: number) => void
  keys: Key[]
  last: number
}

const linear: Ease = (t) => t

export class Scrub {
  private tracks = new Map<string, Track>()

  /**
   * Animate one value between two playhead positions.
   * Several segments may share an `id`: they form one track, and between
   * segments the value holds at the previous segment's end.
   */
  add(id: string, apply: (value: number) => void, t0: number, t1: number, from: number, to: number, ease: Ease = linear): this {
    let track = this.tracks.get(id)
    if (!track) {
      track = { apply, keys: [], last: Number.NaN }
      this.tracks.set(id, track)
    }
    track.keys.push({ t0, t1: Math.max(t1, t0 + 1e-6), from, to, ease })
    track.keys.sort((a, b) => a.t0 - b.t0)
    return this
  }

  render(t: number) {
    for (const track of this.tracks.values()) {
      const keys = track.keys
      let value = keys[0].from
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i]
        if (t <= k.t0) break
        if (t >= k.t1) {
          value = k.to
          continue
        }
        value = k.from + (k.to - k.from) * k.ease((t - k.t0) / (k.t1 - k.t0))
        break
      }
      value = Math.round(value * 10000) / 10000
      if (value !== track.last) {
        track.last = value
        track.apply(value)
      }
    }
  }

  /** Force every track to re-apply on the next render (after a rebuild or resize). */
  invalidate() {
    for (const track of this.tracks.values()) track.last = Number.NaN
  }
}

/* ---- setters ---- */

type Els = ArrayLike<HTMLElement | SVGElement> | HTMLElement | SVGElement | null | undefined

function list(els: Els): (HTMLElement | SVGElement)[] {
  if (!els) return []
  if ("length" in els) return Array.from(els)
  return [els]
}

export const setOpacity = (els: Els) => {
  const items = list(els)
  return (v: number) => {
    const s = String(v)
    for (const el of items) el.style.opacity = s
  }
}

export const setY = (els: Els, unit = "%") => {
  const items = list(els)
  return (v: number) => {
    const s = `translate3d(0,${v}${unit},0)`
    for (const el of items) el.style.transform = s
  }
}

/** For SVG children, where translate3d is not reliably honored. */
export const setSvgY = (els: Els) => {
  const items = list(els)
  return (v: number) => {
    const s = `translateY(${v}px)`
    for (const el of items) el.style.transform = s
  }
}

export const setScaleY = (els: Els) => {
  const items = list(els)
  return (v: number) => {
    const s = `scaleY(${v})`
    for (const el of items) el.style.transform = s
  }
}

export const setScaleX = (els: Els) => {
  const items = list(els)
  return (v: number) => {
    const s = `scaleX(${v})`
    for (const el of items) el.style.transform = s
  }
}

export const setDash = (els: Els) => {
  const items = list(els)
  return (v: number) => {
    const s = String(v)
    for (const el of items) el.style.strokeDashoffset = s
  }
}
