/* Apps Script bound to the "Ahmed & Rawan Wedding RSVP" sheet, deployed as a web app
   (Execute as: me, Who has access: Anyone). index.html posts each RSVP here.
   After editing: Deploy > Manage deployments > Edit > New version, so the URL stays the same.
   It can touch only this one spreadsheet: no Gmail, no Drive, no other sheets. */

/** @OnlyCurrentDoc */

var HEAD = ["الوقت", "الجهة", "الاسم", "الحضور", "التهنئة"];
/* The URL is public, so a flood is capped: 40 replies per 10 minutes, 3000 rows in total. */
var BURST = 40, MAX_ROWS = 3000;

function doPost(e) {
  var p = (e && e.parameter) || {};
  var name = clean(p.name, 80);
  if (!name) return out({ ok: false });
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return out({ ok: false });
  try {
    var cache = CacheService.getScriptCache(), n = Number(cache.get("n") || 0);
    var sh = SpreadsheetApp.getActive().getSheets()[0];
    if (n >= BURST || sh.getLastRow() >= MAX_ROWS) return out({ ok: false });
    cache.put("n", String(n + 1), 600);
    save(sh, p, name);
    return out({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function save(sh, p, name) {
  if (sh.getLastRow() === 0) sh.appendRow(HEAD).setFrozenRows(1);
  sh.appendRow([
    new Date(),
    p.side === "bride" ? "العروسة" : "العريس",
    name,
    p.attending === "yes" ? "سيحضر" : "معتذر",
    clean(p.message, 500)
  ]);
}

/* Guest text is untrusted: cap the length, and stop a leading = + - @ from running as a formula. */
function clean(v, max) {
  v = String(v || "").trim().slice(0, max);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
