# Invitation revamp

## What
Rebuilt the envelope intro (gold comet around the seal, flap lifts with the seal, light bloom into the hero), scroll reveals, map embed, add-to-calendar, music 3 s after opening, looped.

## Mistakes
- Python heredocs turned `\n` / `\r\n` inside JS strings into real newlines twice; the whole script died with a SyntaxError and the envelope stayed invisible. Caught only in the browser console.
- A reveal transition ending on `filter: blur(0)` kept a filter on the parent, which isolates it and silently disabled `mix-blend-mode: multiply` on the timeline icons (white boxes).
- Headless Chrome `--screenshot` with a virtual time budget captured the page before CSS transitions ran; it looked broken when it was not.

## What worked
- Panels masked with a hole under the seal plus a separate seal disc riding the flap: the seal lifts whole instead of splitting in half.
- Browsers block audio before a gesture: start the element muted inside the tap, unmute after the delay.

## Rules
- After any scripted edit of inline JS, parse every `<script>` with `new Function` before opening the page.
- Reveal animations end on `filter: none`, never `blur(0)`.
