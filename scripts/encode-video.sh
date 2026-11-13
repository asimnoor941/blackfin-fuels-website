#!/usr/bin/env bash
# Re-encodes the mirrored delivery videos for the web: no audio, small, fast start.
# Needs ffmpeg with libx264. Run from the project root:
#
#   bash scripts/encode-video.sh
#
# Output: public/video/<name>.mp4 (H.264, plays everywhere) and a poster frame in
# src/assets/posters/<name>.jpg. Budget: under 3 MB per clip.
#
# VP9/WebM was tried and dropped: at a quality that matched the MP4 the files
# came out several times larger for this handheld footage.
set -euo pipefail

SRC=reference/original-site/media
OUT=public/video
POSTERS=src/assets/posters
mkdir -p "$OUT" "$POSTERS"

# encode <input> <name> <width> <fps> <crf> <maxrate> <bufsize> <poster second>
encode() {
  local in="$1" name="$2" width="$3" fps="$4" crf="$5" maxrate="$6" bufsize="$7" poster="$8"
  ffmpeg -v error -y -i "$in" -an -vf "fps=${fps},scale=${width}:-2:flags=lanczos" \
    -c:v libx264 -preset slow -crf "$crf" -maxrate "$maxrate" -bufsize "$bufsize" \
    -pix_fmt yuv420p -profile:v high -movflags +faststart "$OUT/$name.mp4"
  ffmpeg -v error -y -ss "$poster" -i "$in" -frames:v 1 -vf "scale=1600:-2:flags=lanczos" -q:v 3 "$POSTERS/$name.jpg"
  stat -c "%s %n" "$OUT/$name.mp4" "$POSTERS/$name.jpg"
}

# The driver unlocking the truck and running the hose across a lawn to the dock gate (39 s).
encode "$SRC/2026/07/home-hero-video.mp4" hose-run 960 24 27 580k 1160k 16
# Customer and crew at the truck outside a waterfront home (19 s).
encode "$SRC/2026/08/What-We-Stand-For.mp4" handoff 1280 30 26 1100k 2200k 5
