# Marcel's IT blog

Source of <https://it.marcelgerber.ch>, built with [Eleventy](https://www.11ty.dev/) and deployed to GitHub Pages.
(It used to be a Jekyll/Chirpy site; URLs, feed and comments were kept.)

## Develop

```sh
npm install
npm start        # live-reloading dev server on http://localhost:8080
npm run build    # production build into _site/
npm run check    # fail on broken internal links (run after build)
```

Needs Node.js 20 or newer (CI uses 22).

## Write a post

Add `src/posts/YYYY-MM-DD-some-title.md`:

```md
---
title: Some title
date: 2026-01-31T20:00:00+01:00
categories: [howto]
tags: [automation, backup]
---
```

The page is published at `/posts/some-title/`. Optional front matter: `description`, `comments: false`, `toc: false`.
Work in progress can live in `drafts/`, which is not built.

## Layout

| Path | What it is |
| --- | --- |
| `eleventy.config.js` | collections, filters, plugins (feed, syntax highlighting, TOC) |
| `src/_data/site.js` | title, tagline, URL, social links, navigation, comments |
| `src/_includes/` | layouts and partials (Nunjucks) |
| `src/assets/` | CSS, JS and images, copied as-is to `/assets/` |
| `src/posts/`, `src/pages/` | content |
| `.github/workflows/deploy.yml` | build, link check and Pages deployment on push to `main` |

The "Updated" date on a post comes from git history, so CI checks out the full history.
`src/sw.js` only exists to remove the service worker the old theme installed in visitors' browsers; it can be deleted in a few months.
