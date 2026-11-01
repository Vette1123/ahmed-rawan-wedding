# Scroll cue older guests can see

## What
Older guests stopped at the first image. Replaced the hint inside the hero with a 22px, 56px tall button fixed to the bottom of the screen: dark brown with cream text, a moving arrow, tap to scroll. It hides after scrolling and returns at the top.

## Mistakes
- The request was "make the word bigger", but size was half the bug. The hint was anchored to the bottom of a 720:1240 image, so on a short screen or inside WhatsApp's browser it sat below the fold at any size.
- Named the new class `.scr` without searching. That is the scratch-card canvas: the button filled the screen and the new CSS would have broken the cards. Two tests failed and a measured height of 480px exposed it.
- The first test matched `font-size:` while the CSS used the `font:` shorthand, so a correct page failed.

## What worked
- Measuring the button's box at 320x480, 360x560, 412x780 and desktop instead of judging by eye.

## Rules
- A cue that must be seen is positioned against the viewport, never against content that can fall below the fold.
- Grep a class name before using it in this single-file page; all CSS is global.
- Run tests with `node --test tests/`.
