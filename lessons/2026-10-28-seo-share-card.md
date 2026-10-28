# SEO and share card

## What
Full head: Arabic title and description with date and venue, canonical, robots, OpenGraph and Twitter tags, schema.org Event JSON-LD, seal favicon set, apple-touch-icon, web manifest. New 1200x630 `og.jpg` rendered by headless Chrome from an HTML card so the Arabic calligraphy shapes correctly.

## Mistakes
- The first `og.jpg` was the 720x1240 portrait hero; WhatsApp and Facebook crop portrait previews to a square middle slice, which cut the names.
- Node one-liners in bash heredocs ate `\s`, `\S` and `\n` again; the regex silently became `[sS]`. Patch build scripts with the Edit tool, not shell-quoted code.

## What worked
- Rendering the share card as HTML in headless Chrome: real fonts, real Arabic shaping, no image editor.

## Rules
- Share images are 1200x630 landscape with the names inside the middle 630x630.
- Never write regex or escape sequences through a shell heredoc into a JS file.
