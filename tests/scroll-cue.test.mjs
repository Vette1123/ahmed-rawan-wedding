// Run: node --test tests/
// Older guests stopped at the hero: the cue was 3.6cqw text inside the image,
// tiny on a phone and below the fold on a short screen.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const rule = (sel) => {
  const m = html.match(new RegExp(`(?:^|\n)${sel.replace(".", "\.")}\{([^}]*)\}`));
  assert.ok(m, `no CSS rule for ${sel}`);
  return m[1];
};

test("cue is pinned to the screen, not the image", () => {
  assert.match(rule(".down"), /position:fixed/);
  assert.match(html, /<button[^>]*class="down"[^>]*>[\s\S]*?مرّر للأسفل/);
  assert.doesNotMatch(html, /class="cue/, "old in-image cue is back");
});

test("cue is readable and easy to hit", () => {
  const css = rule(".down");
  const font = Number(css.match(/font-size:(\d+)px/)?.[1]);
  const height = Number(css.match(/min-height:(\d+)px/)?.[1]);
  assert.ok(font >= 22, `font-size ${font}px, want at least 22px`);
  assert.ok(height >= 56, `min-height ${height}px, want at least 56px`);
});

test("cue scrolls on tap and hides once the guest has scrolled", () => {
  assert.match(html, /scr\.addEventListener\("click"/);
  assert.match(html, /classList\.toggle\("off"/);
});

test("cue arrow respects reduced motion", () => {
  assert.match(html, /prefers-reduced-motion:reduce[\s\S]*.down/);
});
