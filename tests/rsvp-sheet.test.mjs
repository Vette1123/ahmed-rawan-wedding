// Run: node --test tests/
// Long congratulations spilled over the neighbouring cell and hid the divider.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

function load() {
  const calls = [];
  const range = (r, n) => ({
    setWrap(v) { calls.push(["wrap", r, n, v]); return this; },
    setVerticalAlignment() { return this; },
    setBorder(...a) { calls.push(["border", r, n, a.slice(0, 6).every(Boolean)]); return this; },
    setFontWeight() { return this; },
  });
  let rows = 1;
  const sh = {
    getLastRow: () => rows,
    appendRow() { rows++; return this; },
    setFrozenRows() {},
    setColumnWidth(c, w) { calls.push(["width", c, w]); },
    getRange: (r, c, n) => range(r, n),
  };
  const ctx = { SpreadsheetApp: { BorderStyle: { SOLID: "solid" }, getActive: () => ({ getSheets: () => [sh] }) } };
  vm.runInNewContext(readFileSync(new URL("../rsvp/Code.gs", import.meta.url), "utf8"), ctx);
  return { ctx, sh, calls };
}

test("a new reply wraps and gets borders", () => {
  const { ctx, sh, calls } = load();
  ctx.save(sh, { attending: "yes", message: "الف مليون مبروك" }, "ماجده");
  assert.ok(calls.some((c) => c[0] === "wrap" && c[1] === 2 && c[3] === true), "row 2 not wrapped");
  assert.ok(calls.some((c) => c[0] === "border" && c[1] === 2 && c[3]), "row 2 has no borders");
});

test("tidyAll fixes every existing row", () => {
  const { ctx, sh, calls } = load();
  for (let i = 0; i < 6; i++) sh.appendRow([]);
  ctx.tidyAll();
  assert.ok(calls.some((c) => c[0] === "wrap" && c[1] === 1 && c[2] === 7), "rows 1-7 not wrapped");
  assert.ok(calls.some((c) => c[0] === "width" && c[1] === 5 && c[2] >= 300), "message column too narrow");
});
