# Session 001 — dolist.how Launch

**Date:** 2026-03-12
**Duration:** ~3 hours
**Story Points Delivered:** 13 (Phase 2: 8 SP, Phase 3 partial: 5 SP)

## Goal

Build and deploy dolist.how as a standalone shared checklist app. Two domains (dolist.how, grocery.how) on one SPA, short-code list URLs, voice input, mobile-first.

## What Happened

### Phase 2: Own Site (8 SP)

Started from the grocery MVP already live at notes.ath.how/grocery/. Created new repo, new Netlify site, rebuilt the SPA for multi-list support with short-code URLs.

**Built:**
- Landing page with domain-aware theming (grocery.how shows grocery copy, dolist.how shows general)
- `list.mjs` Netlify Function — full CRUD with Netlify Blobs (create, add, toggle, remove, clear-checked, favorites, reorder)
- 4-char short-code slugs (`abcdefghjkmnpqrstuvwxyz23456789`, no ambiguous chars)
- SPA routing via `_redirects` — single `index.html` handles all paths
- Share button with native share API fallback to clipboard copy
- Name prompt on first visit (localStorage)
- Voice input (Web Speech API, splits on commas and "and")
- Privacy page
- Dark/light mode toggle

**Bugs fixed during live testing:**
1. **Domain detection too broad** — `hostname.includes("grocery")` matched `dolist-grocery-how.netlify.app`. Fixed to exact `===` match.
2. **List not found after creation** — Full page reload raced blob propagation. Switched to `history.pushState` client-side nav.
3. **Deprecated meta tag** — `apple-mobile-web-app-capable` → `mobile-web-app-capable`.
4. **Blank screen after name entry** — CSS `display:none` on `.container` combined with `style.display=""` (which falls back to CSS, not visible). Fixed with explicit display values in `showView()`.
5. **Polling flicker** — `render()` cleared `innerHTML` every 15s. Added JSON state diffing to skip no-op re-renders.

### Phase 3: Categories (partial, 5 SP)

User asked "How do I add categories?" — built it on the spot.

- `Category: Item` syntax in text input (colon-separated)
- Backend stores `category` field per item (max 50 chars)
- Frontend groups unchecked items by category with styled dividers and item counts
- Uncategorized items render first, then each category group
- Voice input parses categories too ("Dairy: milk and Produce: apples")

### Also in this session (notes repo)

- Added speech-to-list to the original grocery MVP at `sites/notes-ath-how/grocery/index.html`
- Product planning in `docs/dolist-plan.md` — iterated through scope decisions with Bert

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Single repo, two domains | One SPA themed by hostname. Simpler to maintain than two repos. |
| No accounts, ever | URL is the access control. "The lightweight-ness IS the feature." |
| No dates/reminders | Dates invite tracking, recurring, overdue — that's Todoist. Make a new list instead. |
| No nesting beyond categories | Categories are one-level grouping. It's a post-it, not an outliner. |
| Client-side nav after create | Avoids blob propagation race. pushState + fetch is instant. |
| 4-char slugs | Short enough to text/remember. 28^4 = ~614K possible codes. |

## Open Issues

| Issue | Priority | Detail |
|-------|----------|--------|
| grocery.how DNS | Medium | dolist.how pointed, grocery.how status unclear |
| 404 on slug `4v57` | Low | May be stale or blob edge case. Not reproducible. |
| Item notes | Next | Phase 3 — optional detail per item |
| Drag-to-reorder | Next | Phase 3 — touch/pointer handlers |
| Assignments | Next | Phase 3 — name chip per item |

## Files Changed

| File | What |
|------|------|
| `index.html` | Entire SPA (landing, list view, categories, share modal, voice, theming) |
| `netlify/functions/list.mjs` | CRUD API with category field support |
| `_redirects` | SPA routing |
| `privacy.html` | Static privacy page |
| `netlify.toml` | Build config |
| `package.json` | @netlify/blobs dependency |
| `CLAUDE.md` | Project instructions (new) |
| `STATE.md` | Session state (new) |
| `ROADMAP.md` | Phase tracking (new) |
