# RSVP to a Google Sheet, phone numbers out of the repo

## What
The RSVP form posted to `wa.me/<number>`, so both family phone numbers sat in the public page and repo. Replies now POST to a Google Apps Script web app (`rsvp/Code.gs`) bound to the "Ahmed & Rawan Wedding RSVP" sheet. The page shows a thank-you in place. Both numbers were scrubbed from every commit and force-pushed.

## Mistakes
- `curl -L -X POST` against the Apps Script URL returned 411. `-X POST` forces POST on the redirect to googleusercontent too. The row was still written, so a retry wrote a duplicate. Test with `curl -sL -d ...`, no `-X`: the redirect becomes a GET, as in a browser.
- Typing a range into the Sheets Name box missed the box, and `2:44` landed in A1 as a time, overwriting the header. Check the header after any UI edit to the sheet.
- The first deploy asked for access to all of Drive's spreadsheets. `/** @OnlyCurrentDoc */` narrows it to the bound sheet. It belonged in v1.
- The 40-request flood test tripped the burst cap, which then blocked the real check for 10 minutes. Run cap tests last.

## What worked
- Pasting the script into the Apps Script Monaco editor through `monaco.editor.getEditors()[0].executeEdits`: exact text, no auto-indent mangling.
- Form-encoded `fetch` (URLSearchParams) is a CORS simple request, and Apps Script answers it with `Access-Control-Allow-Origin: *`. No preflight, no `no-cors`, and the JSON reply is readable.

## Rules
- A contact number in a static page is public. Anything private goes behind an endpoint.
- Apps Script web apps: `@OnlyCurrentDoc`, cap lengths, prefix a leading `= + - @` with `'`, and rate-cap the public URL.
- After changing the script: Deploy > Manage deployments > Edit > New version, never a new deployment (that changes the URL).
