# RSVP sheet: messages stay in their own cell

## What
Long congratulations spilled over the neighbouring cell and hid the divider between Attendance and Message. `tidy()` now wraps and borders every saved row, and `tidyAll()` was run once for the existing rows, with the Message column widened to 320px.

## Mistakes
- `appendRow` shipped with no formatting, and the sheet only looked fine with short test messages. Real guests write long, multi-line text.
- A background Sheets tab did not show the change after the run. Reloading it did. Reload before judging a script's effect.

## What worked
- Testing `save()` and `tidyAll()` in `node:vm` with a stubbed sheet, so the formatting has a real check without touching live data.

## Rules
- Anything that writes guest text to a sheet sets wrap and borders on the row it writes.
- Editing `Code.gs` is not live for new replies until Deploy > Manage deployments > Edit > New version.
