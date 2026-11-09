# Hero video — how to make it

The website plays a realistic clip in the hero when these files exist:

| File | Shape | Needed? |
|---|---|---|
| `assets/hero-desktop.mp4` | 16:9 landscape (1920×1080) | Yes |
| `assets/hero-mobile.mp4` | 9:16 portrait (1080×1920) | **Later** — not needed now |

If the files are missing, the site falls back to the drawn animation automatically.

**Phones (for now):** phones show the desktop clip as a wide band at the top of the screen,
cropped around the diya and bottle. For this to work, keep the diya and bottle **close together,
roughly between 15% and 55% of the frame width** — don't let the bottle start at the far-left edge.

Tools that do this well: **Google Veo 3 / Flow**, **Kling 2.x**, **Runway Gen-4**, **Hailuo / MiniMax**, **Luma Ray**.
Best results: first generate a still **image** of the final lit scene (prompt 3), then use it as the
**end frame** in the video tool ("image-to-video" / "first & last frame") with prompt 1 or 2.

---

## 1. Desktop clip (16:9, 8 seconds)

```
Cinematic photorealistic product film, locked-off static camera, no camera movement.
Pure black background, a completely dark room, polished dark stone surface with soft reflections.
0–2s: a traditional polished brass South Indian diya (agal vilakku) with an engraved round bowl,
short pedestal base and a pointed spout on its RIGHT side slides in smoothly from the right edge
and settles slightly left of centre.
1–3s: a clear glass bottle filled with golden sesame lamp oil, cream paper label, slides in from
the left edge and stops left of the diya.
3–5s: the bottle lifts and tilts, pouring a thin, glossy, slow-motion stream of golden oil into the
diya; the bowl fills with shimmering oil. The bottle returns upright beside the diya.
5–6s: a white cotton wick rests in the spout; a tiny spark and a single warm, steady flame ignites.
6–8s: warm golden candle light gradually spreads across the dark room, softly lighting the brass,
the glass bottle and the surface, with gentle flicker.
Keep the diya and bottle close together in the left-centre of the frame;
keep the right 40% of the frame empty and black (space for text).
Macro detail, shallow depth of field, rich warm tones, luxurious, slow and elegant motion, 4K.
No hands, no people, no text, no logos, no watermark.
```

## 2. Mobile clip (9:16, 8 seconds) — later

Same prompt, but replace the composition lines with:

```
Vertical 9:16 frame. Diya and bottle sit in the UPPER half of the frame, centred.
Keep the lower 45% of the frame empty and black (space for text).
```

## 3. (Optional) Still image for the end frame

```
Photorealistic product photograph, pure black background, dark room. A polished brass South Indian
diya (agal vilakku) with engraved bowl, filled with golden oil, a single warm flame burning on a
cotton wick in its right-side spout. Beside it on the left, a clear glass bottle of golden lamp oil
with a cream label. Warm candle light softly illuminates the brass, glass and the dark reflective
stone surface. Composition in the left 60% of a 16:9 frame, right side empty black.
Macro lens, shallow depth of field, luxury, 4K. No text, no people.
```

*(If he wants his real bottle in the film: upload a photo of his bottle as a reference image.)*

---

## After you have the clip

1. Save it as `assets/hero-desktop.mp4` (and `assets/hero-mobile.mp4`).
2. Keep each file under ~4 MB (Handbrake → "Web" preset, 1080p, no audio) so the page loads fast.
3. Tell Claude — it will read the clip and set, in `js/main.js` → `CONFIG.heroVideo`:
   - `flameAt` — the second the flame lights (the page lights up at that moment),
   - `flameDesktop` / `flameMobile` — where the flame sits in the frame.
