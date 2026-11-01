# Form to Google Sheet: reuse this on any site

A static site posts a form to a Google Apps Script web app, and each reply lands as a row in a Google Sheet. No server, no database, no cost, and no phone number in the page. Tested on this invitation since 2026-10-28.

To reuse it, copy `rsvp/Code.gs` and `tests/rsvp-sheet.test.mjs` into the new repo, then follow the steps below. About 15 minutes.

## Set up on a new site

1. Create a Google Sheet, named for the event.
2. In the sheet: Extensions > Apps Script. Paste `Code.gs` over the default code and save.
3. Edit the fields for the new form (see "What to change").
4. Deploy > New deployment > Web app. Execute as: me. Who has access: Anyone. Approve the access prompt.
5. Copy the web app URL ending in `/exec` into the site's config.
6. Pick `tidyAll` in the function dropdown, confirm it shows `tidyAll`, then Run. This formats the sheet.
7. Send one real reply from the live page, check the row, then delete that row.

## What to change

| Where | What |
|---|---|
| `HEAD` in `Code.gs` | Column titles |
| `sh.appendRow([...])` in `save()` | One value per column, same order as `HEAD` |
| `[150, 80, 160, 90, 320]` in `tidyAll()` | One width per column; keep the time column at 150 |
| `clean(p.name, 80)`, `clean(p.message, 500)` | Length caps |
| `BURST`, `MAX_ROWS` | Flood limits: 40 replies per 10 minutes, 3000 rows |

## Page code

Send form fields with `URLSearchParams`. The browser treats that as a simple request, so there is no CORS preflight and the JSON reply can be read. Do not set headers or `no-cors`.

```js
fetch(SHEET_URL, { method: "POST", body: new URLSearchParams({ side, name, attending, message }) })
  .then((res) => res.json())
  .then((d) => { if (!d.ok) throw 0; showThanks(); })
  .catch(() => { button.disabled = false; showError(); });
```

Disable the button before sending and enable it again on failure. Show the thank-you in place of the form.

## After editing the script

Saving is not enough for new replies. Deploy > Manage deployments > pencil > Version: New version > Deploy.

Never use "New deployment" here: it changes the URL and the live form stops reaching the sheet. Functions run from the editor, like `tidyAll`, use the saved code and need no deploy.

## Rules that came from real mistakes

- Keep `/** @OnlyCurrentDoc */`. Without it the deploy asks for access to all your spreadsheets.
- Keep `clean()`. Guest text is untrusted, and a leading `= + - @` would run as a formula.
- Every row written gets wrap and borders through `tidy()`. Real guests write long, multi-line messages that test rows never show.
- Test with `curl -sL -d "name=Test" <url>`, no `-X POST`. Forcing POST returns 411 on the redirect even though the row was saved, so a retry writes a duplicate.
- Run flood tests last. They trip the cap, which then blocks real checks for 10 minutes.
- Reload the Sheet tab before judging a script run. An open tab can show old formatting.
- Look at the function dropdown before Run. A missed click leaves `doPost` selected.
- A phone number in a static page is public. Private data stays behind the script.

## Checks

```
node --test tests/
```
