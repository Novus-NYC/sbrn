/**
 * The scroll-scrubbed film band on the home page.
 *
 * STATUS: no footage. The brief asked for Higgsfield-generated video, but no
 * Higgsfield access was available when this site was built (no connector in
 * the session, and the browser was not signed in). Nothing was generated and
 * no stock or stand-in footage is shipped. While `src` is null the band does
 * not render at all, and the page makes no video request.
 *
 * TO SWITCH IT ON
 *   1. Generate one of the shots in `directions` (or your own), 16:9, 6 to 10 s.
 *   2. Run `scripts/prepare-film.sh <clip.mp4>`: it writes all-keyframe,
 *      silent, fast-start MP4s for desktop and phone plus matching posters
 *      into `public/media/film/`, and prints the values for this file.
 *   3. Paste those values below. The band appears between "Who we are" and
 *      the network map, and scrubs frame by frame with scroll.
 */

export type FilmSource = {
  src: string
  poster: string
  width: number
  height: number
}

export type Film = {
  desktop: FilmSource | null
  /** Optional portrait crop for phones. Falls back to `desktop`. */
  mobile: FilmSource | null
  /** Frames per second of the encoded clip: seeks are snapped to whole frames. */
  fps: number
  /** One line, read by screen readers in place of the picture. */
  alt: string
  provider: string
  directions: { name: string; duration: string; prompt: string }[]
}

export const film: Film = {
  desktop: null,
  mobile: null,
  fps: 24,
  alt: "A New York block at dawn as shop gates roll up one after another.",
  provider: "Higgsfield",
  directions: [
    {
      name: "Gates up (push in)",
      duration: "8 s",
      prompt:
        "One continuous locked-off wide shot that pushes in very slowly on a row of small New York storefronts at blue hour before dawn. Every shop has a steel roll-down gate, closed. Over the shot the gates roll up one after another from left to right, warm interior light spills onto the wet sidewalk, an awning is cranked out, and the first sunlight catches the brick above. Constant camera speed, no cuts, no people in close-up. Awnings and signs are blank: no readable text or logos anywhere. Naturalistic color, slate blue shadows, coral and amber light.",
    },
    {
      name: "The walk (lateral track)",
      duration: "8 s",
      prompt:
        "One continuous sidewalk-height tracking shot moving left to right at a constant walking pace past small New York storefronts in the first warm light of morning: a barber shop, a cafe, a tailor, a party supply shop. Gates are halfway up or just opened, an owner sweeps, a sandwich board is set out. Shallow parallax from a lamp post and a street tree in the foreground. No cuts, no camera shake, no readable text or logos on any sign. Slate blue shade, coral and gold sunlight.",
    },
  ],
}
