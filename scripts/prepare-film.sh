#!/usr/bin/env bash
# Prepare a clip for the scroll-scrubbed film band on the home page.
#
#   scripts/prepare-film.sh path/to/clip.mp4 [fps]
#
# Writes, into public/media/film/:
#   film-1280.mp4   16:9, 1280x720   (desktop)
#   film-720.mp4    9:16,  720x1280  (phone, centered crop)
#   film-1280.webp, film-720.webp    first-frame posters
#
# Every frame is a keyframe (-g 1) so the browser can seek to any frame
# instantly, the audio track is dropped, and the index is moved to the front
# of the file (faststart) so the first frame paints before the download ends.
# Requires ffmpeg and the project's node_modules (run npm install first).
set -euo pipefail

SRC="${1:?usage: scripts/prepare-film.sh path/to/clip.mp4 [fps]}"
FPS="${2:-24}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/media/film"
mkdir -p "$OUT"

encode() { # <filter> <output>
  ffmpeg -v error -y -i "$SRC" -an -vf "fps=${FPS},$1" \
    -c:v libx264 -preset slow -crf 24 -g 1 -keyint_min 1 -sc_threshold 0 \
    -pix_fmt yuv420p -movflags +faststart "$2"
}

encode "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720" "$OUT/film-1280.mp4"
encode "scale=-2:1280,crop=720:1280" "$OUT/film-720.mp4"

# Posters: the exact first frame of each encode, as WebP. Not every ffmpeg
# build ships a WebP encoder, so the frame is written as PNG and converted
# with sharp, which this project already depends on.
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
for name in film-1280 film-720; do
  ffmpeg -v error -y -i "$OUT/$name.mp4" -frames:v 1 -update 1 "$OUT/$name.png"
  node -e "require(process.argv[1] + '/node_modules/sharp')(process.argv[2]).webp({ quality: 82 }).toFile(process.argv[3]).then(() => require('fs').unlinkSync(process.argv[2]))" "$ROOT" "$OUT/$name.png" "$OUT/$name.webp"
done

echo "Wrote:"
ls -lh "$OUT" | awk 'NR>1 {print "  " $9 "  " $5}'
cat <<JSON

Paste into src/lib/data/film.ts:
  desktop: { src: "/media/film/film-1280.mp4", poster: "/media/film/film-1280.webp", width: 1280, height: 720 },
  mobile:  { src: "/media/film/film-720.mp4",  poster: "/media/film/film-720.webp",  width: 720,  height: 1280 },
  fps: ${FPS},
JSON
