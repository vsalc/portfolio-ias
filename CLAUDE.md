# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static personal portfolio site for Isabella A. Salcedo (poet, educator, oral historian). Plain HTML/CSS/JS — **no build step, no framework, no package manager, no tests.** Four HTML pages (`index.html`, `about.html`, `works.html`, `cv.html`) sharing one stylesheet (`styles.css`) and one script (`script.js`), plus static assets in `images/` and `files/`. Deployed to **GitHub Pages on the custom domain `isabellasalcedo.me`** (bound via the `CNAME` file); push to deploy, no Actions/build.

## Running locally

All asset references use **root-absolute paths** (`/styles.css`, `/images/headshot.jpg`, `/files/resume.pdf`, `/works.html`), so opening a page over `file://` breaks — assets and inter-page links won't resolve. The site must be served from a web server with the repo root as the document root: `python3 -m http.server 8000` from the repo root, then open `http://localhost:8000`. (Absolute paths are safe here because the custom domain serves from the root.)

## Architecture

Multipage site, not a single-page app. Each page is a standalone HTML document that repeats the same `.nav` (Works / About / CV) and footer; navigation is ordinary page-to-page links (`/`, `/works.html`, `/about.html`, `/cv.html`) — there are no in-page `#` anchors, no smooth-scroll, and no scroll-spy.

`script.js` is shared across all pages, dependency-free, and guards every element lookup since most behavior is page-specific:

- Resume download (CV page only): the `#resumeBtn` handler fetches `/files/resume.pdf` as a blob to force the filename `salcedo-isabella-resume.pdf`, falling back to direct navigation on error. Guarded by an `if (resumeBtn)` check.
- Reveal-on-scroll: an `IntersectionObserver` adds `.is-visible` to `.work` (works page) and `.experience-item` (CV page) elements as they enter the viewport; CSS owns the hidden/visible states. Honors `prefers-reduced-motion` (and absent `IntersectionObserver`) by showing everything immediately.

The palette, fonts, type scale, and spacing are CSS custom properties under `:root` in `styles.css`: colors (`--ink`, `--ink-soft`, `--paper`, `--accent`, `--rule`, …), fonts (`--font-display`, `--font-body`, `--font-meta`), the fluid `clamp()`-based type scale (`--fs-hero`, `--fs-page-title`, `--fs-h2`, `--fs-body`, `--fs-meta`), and spacing (`--space-section`, `--space-block`, `--gutter`, `--measure`). Fonts are **Playfair Display** (display) and **Lora** (body), loaded from Google Fonts. Reuse the existing `--` variables rather than hardcoding values.

## Editing conventions

- Content (works, experience entries, bio) is hardcoded directly in the relevant HTML page — there is no CMS or data file. New work entries on `works.html` follow the `.work` block pattern; new roles on `cv.html` follow `.experience-item`.
- When adding content to a page, keep the shared `.nav` and footer markup identical across all four pages so navigation stays consistent.
- New JS behavior tied to elements should guard for the element's existence (see the `#resumeBtn` block) since `script.js` runs on every page but most elements exist on only one.
- `styles.css` is **mobile-first**: base rules target small screens; layer enhancements with `min-width` media queries (do not add `max-width` breakpoints). Use the fluid `--fs-*` / `--space-*` tokens rather than fixed pixel values.
