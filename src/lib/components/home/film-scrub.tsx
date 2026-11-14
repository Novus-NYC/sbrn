"use client"

import { useEffect, useRef, useState } from "react"
import type { FilmSource } from "@/lib/data/film"
import { addScene, motionEnabled } from "@/lib/motion/scroll-rig"

type Props = { desktop: FilmSource; mobile: FilmSource; fps: number }

/**
 * Scrubs a self-hosted clip by scroll position.
 *
 * - The video is mounted only when motion is allowed, so reduced-motion and
 *   no-JavaScript visitors never download it: they keep the poster.
 * - One source is chosen up front (phone or desktop) instead of listing both,
 *   so a skipped alternative can never be mistaken for a failed video.
 * - Seeks snap to whole frames and are coalesced: while the decoder is busy
 *   the newest target simply replaces the pending one.
 * - Any error removes the video and leaves the poster in place.
 */
export default function FilmScrub({ desktop, mobile, fps }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const [source, setSource] = useState<FilmSource | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!motionEnabled()) return
    setSource(window.matchMedia("(max-width: 720px)").matches ? mobile : desktop)
  }, [desktop, mobile])

  useEffect(() => {
    const video = ref.current
    const section = video?.closest<HTMLElement>(".film")
    if (!video || !section || !source) return

    const frame = 1 / fps
    let want = 0
    let primed = false
    const seek = () => {
      if (video.seeking || !Number.isFinite(video.duration)) return
      const last = Math.max(0, video.duration - frame)
      const t = Math.min(last, Math.round(want / frame) * frame)
      if (Math.abs(video.currentTime - t) > frame / 2) video.currentTime = t
    }
    const onSeeked = () => seek()
    const onReady = () => {
      video.classList.add("is-ready")
      seek()
    }
    const onError = () => setFailed(true)
    // iOS only decodes frames for a clip that has started once.
    const prime = () => {
      if (primed) return
      primed = true
      const p = video.play()
      if (p) p.then(() => video.pause()).catch(() => {})
    }

    video.addEventListener("seeked", onSeeked)
    video.addEventListener("loadeddata", onReady)
    video.addEventListener("error", onError)
    window.addEventListener("touchstart", prime, { once: true, passive: true })

    const remove = addScene(section, {
      mode: "pin",
      smooth: 0.09,
      onUpdate: ({ progress }) => {
        if (!Number.isFinite(video.duration)) return
        want = progress * video.duration
        seek()
      },
    })

    return () => {
      remove()
      video.removeEventListener("seeked", onSeeked)
      video.removeEventListener("loadeddata", onReady)
      video.removeEventListener("error", onError)
      window.removeEventListener("touchstart", prime)
    }
  }, [source, fps])

  if (!source || failed) return null
  return (
    <video
      ref={ref}
      className="film__video"
      src={source.src}
      width={source.width}
      height={source.height}
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
    />
  )
}
