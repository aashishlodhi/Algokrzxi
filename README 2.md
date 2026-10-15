# Algokrzxi

Learning platform for embedded-systems engineers. React + Vite client, Express + MongoDB server. Single user for now (no accounts).

## Run

    npm run install:all
    cp server/.env.example server/.env     # set MONGODB_URI
    npm run dev                            # client :5173, server :5000
    npm run seed                           # optional: build indexes + one sample row

The client works without the server (progress and notes live in localStorage) and syncs when the API is up.

## Structure

    client/src/styles      tokens.css (all colors, radii, blur), glass.css, global.css
    client/src/config      navigation.js (mega menu, footer)
    client/src/modules     one folder per module  <-- content lives here
    client/src/lib         module discovery, search, markdown helpers, API
    server/src             Express + Mongoose (Progress, Note, Feedback)

## Rebrand

Edit the BRAND PALETTE blocks (dark and light) at the top of `client/src/styles/tokens.css`. Nothing else hardcodes colors.

## Add a module (no code changes)

1. Copy `client/src/modules/_template` to `client/src/modules/<slug>`.
2. Edit `module.config.js` (set `status: 'live'`) and write lessons in `lessons/*.md`.
3. Every lesson in a section must have a matching file; `id` is lowercase letters, digits, `-` or `_`.

The catalog, mega menu, search, roadmaps and profile pick it up automatically.

## Lesson Markdown

Frontmatter (`title`, `summary`), then Markdown with GFM tables. `##` headings feed the right-hand "On this page" list. Fenced code needs a language. Diagrams use a `mermaid` fence. Callouts:

    ::: note | warning | pitfall | tip | interview
    text
    :::

    ::: answer
    hidden until the reader clicks "Show answer"
    :::

## Working together

Each author only edits `client/src/modules/<their-slug>/`. Shared UI (anything outside `modules/`) belongs to the shell owner.
