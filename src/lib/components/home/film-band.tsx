import Image from "next/image"
import { about } from "@/lib/data/site"
import { film } from "@/lib/data/film"
import FilmScrub from "./film-scrub"

/**
 * A full-bleed film that advances frame by frame as the visitor scrolls.
 * Renders nothing until footage is configured in `src/lib/data/film.ts`.
 * The poster is the reduced-motion and no-JavaScript picture: in those cases
 * the video file is never requested.
 */
export default function FilmBand() {
  const desktop = film.desktop
  if (!desktop) return null
  const mobile = film.mobile ?? desktop
  return (
    <section className="film" data-tone="night" aria-label="Morning on the block">
      <div className="film__stage">
        <picture className="film__poster">
          <source media="(max-width: 720px)" srcSet={mobile.poster} />
          <Image src={desktop.poster} alt={film.alt} width={desktop.width} height={desktop.height} sizes="100vw" />
        </picture>
        <FilmScrub desktop={desktop} mobile={mobile} fps={film.fps} />
        <div className="film__shade" aria-hidden="true" />
        <p className="wrap voice film__line">{about.statement.join(" ")}</p>
      </div>
    </section>
  )
}
