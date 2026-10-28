# Load speed: 1.68 MB single file to a 44 KB page

## What
Moved every inlined image and the song out of `index.html` into `assets/` (WebP q80, MP3 96k), preloaded the envelope, lazy-loaded the rest, made Google Fonts non-blocking, faded the envelope in only after its image decodes. First paint ~200 ms locally; envelope shows after ~80 KB instead of 1.68 MB.

## Mistakes
- Shipped the first version with everything base64-inlined "so it is one file". The script that fades the envelope in sat after ~1.4 MB of inline audio and images, so phones showed a blank dark screen until the whole file arrived.
- The WhatsApp MP3's header said 64 kbps; it was really ~128 kbps (686 KB for 43 s). Measure the file, not the header.
- A scripted `element.click()` is not a user gesture, so the music test reported "paused"; only a real click proves autoplay-after-tap.

## What worked
- `preload="none"` on the audio plus a muted `play()` inside the tap: the song downloads during the 3 s delay and nothing loads it before.

## Rules
- Never inline media over a few KB into HTML; anything the first screen does not need loads after it.
- Gate an image-dependent intro on `img.decode()` with a timeout fallback.
