# دعوة زفاف أحمد و روان

Static wedding invitation (`index.html` + `assets/`): sealed envelope intro, hero, scratch-to-reveal date, timeline, countdown, venue map, RSVP saved to a Google Sheet, background music.

Live: https://vette1123.github.io/ahmed-rawan-wedding/

## Edit

All event data lives in the `INVITE` block near the bottom of `index.html` (names, date, venue, map link, timeline, RSVP form endpoint `rsvpUrl`). `MUSIC_DELAY` sets how long after opening the envelope the music starts. Images live in `assets/` as WebP; the song is `assets/music.mp3`.

Open `index.html` directly, or serve the folder:

```
python -m http.server 8765
```

## RSVP

Each reply is posted to a Google Apps Script web app bound to the "Ahmed & Rawan Wedding RSVP" sheet in Google Drive. Its source is `rsvp/Code.gs`. After editing it, redeploy with Deploy > Manage deployments > Edit > New version so `rsvpUrl` stays the same.
