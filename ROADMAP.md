# Roadmap: dolist.how / grocery.how

## Overview

Dead-simple shared checklists. No accounts, no app, no sign-up. The lightweight-ness IS the feature.

## Milestones

- [x] **Phase 1: MVP** — Grocery list on notes.ath.how (household use)
- [x] **Phase 2: Own Site** — Standalone app, short-code lists, landing page, share button
- [ ] **Phase 3: Organization** — Categories, item notes, assignments, drag-to-reorder
- [ ] **Phase 4: Polish** — PWA, offline, print view, og:image

---

## Completed Phases

### Phase 1: MVP on notes.ath.how — COMPLETE
**Story Points:** 5

- [x] Server-synced checkboxes via Netlify Blobs
- [x] Favorites (quick re-add frequent items)
- [x] Added-by tracking (who added, who checked)
- [x] Clear checked items
- [x] Dark/light mode, mobile-first
- [x] Name prompt on first use (localStorage)
- [x] Voice input via Web Speech API

### Phase 2: Own Site + Short-Code Lists — COMPLETE
**Story Points:** 8

- [x] New repo (`ubiquitouszero/dolist-grocery-how`)
- [x] New Netlify site with `list.mjs` function
- [x] SPA routing (`_redirects` → single `index.html`)
- [x] Landing page with "Start a list" CTA
- [x] 4-char short-code slug generation
- [x] Domain-aware theming (grocery.how vs dolist.how)
- [x] Share button (copy URL + native share)
- [x] Client-side navigation after list creation (no reload race)
- [x] State diffing to prevent polling flicker
- [x] Privacy page
- [x] dolist.how DNS pointed

---

## In Progress

### Phase 3: Organization — IN PROGRESS
**Story Points:** 8

- [x] Categories as section headers (`Category: Item` syntax)
- [x] Category stored per item in blob, rendered as grouped dividers
- [ ] Item notes (optional detail line per item, tap to expand)
- [ ] Assignments (tap name chip to assign item to someone)
- [ ] Drag-to-reorder within and between sections
- [ ] List color/theme picker
- [ ] grocery.how DNS

---

## Future Phases

### Phase 4: Polish — NOT STARTED
**Story Points:** 5

- [ ] PWA install prompt (Add to Home Screen)
- [ ] Offline mode (service worker, queued actions)
- [ ] Print view (CSS @media print)
- [ ] og:image for link previews
- [ ] Rate limiting (items per list, calls per IP)
- [ ] Stale list cleanup (90-day TTL)

---

## Progress

| Phase | SP | Status |
|-------|-----|--------|
| 1. MVP | 5 | Done |
| 2. Own Site | 8 | Done |
| 3. Organization | 8 | In Progress |
| 4. Polish | 5 | Not Started |
| **Total Completed** | **13** | |
