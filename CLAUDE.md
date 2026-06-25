# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static personal portfolio site for Isabella A. Salcedo (poet, educator, oral historian). Plain HTML/CSS/JS — **no build step, no framework, no package manager, no tests.** Three source files (`index.html`, `styles.css`, `script.js`) plus static assets in `images/` and `files/`. Deployed to **GitHub Pages on the custom domain `isabellasalcedo.me`** (bound via the `CNAME` file); push to deploy, no Actions/build.

## Running locally

All asset references use **root-absolute paths** (`/styles.css`, `/images/headshot.jpg`, `/files/resume.pdf`), so opening `index.html` over `file://` breaks — assets won't resolve. The site must be served from a web server with the repo root as the document root: `python3 -m http.server 8000` from the repo root, then open `http://localhost:8000`. (Absolute paths are safe here because the custom domain serves from the root.)

## Architecture

Single-page layout. `index.html` defines four `<section>`s (`#intro`, `#about`, `#works`, `#experience`) plus nav and footer. `script.js` wires up purely presentational behavior with no dependencies:

- Smooth-scroll for in-page `#` anchor links, offset by the navbar height.
- Scroll-spy that toggles `.active` on `.nav-link`s based on the section in view.
- `IntersectionObserver` fade-in for `.work-card` and `.experience-item` elements: JS adds a `.reveal` class (hidden state lives in CSS) and toggles `.is-visible` when they enter the viewport. Honors `prefers-reduced-motion` (shows everything immediately).
- Resume button (`#resumeBtn`) fetches `/files/resume.pdf` as a blob to force a download with a custom filename, falling back to direct navigation on error.

The color palette and shadows are CSS custom properties under `:root` in `styles.css`. Fonts are Playfair Display (headings) and Inter (body), loaded from Google Fonts. Reuse the existing `--` variables rather than hardcoding colors.

## Editing conventions

- Content (works, experience entries, bio) is hardcoded directly in `index.html` — there is no CMS or data file. New work cards follow the `.work-card` block pattern; new roles follow `.experience-item`.
- New JS behavior tied to elements should guard for the element's existence (see the `#resumeBtn` block) since sections may be reordered.
- `styles.css` is **mobile-first**: base rules target small screens; layer enhancements with `min-width` media queries (do not add `max-width` breakpoints). Use the fluid `clamp()`-based `--fs-*` / `--space-*` tokens and the `--radius-organic*` frame shapes rather than fixed pixel values.
