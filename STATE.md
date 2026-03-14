# dolist.how — Session State

**Last Updated:** 2026-03-12 (Session 1)

## Current Status

Phase 2 live. Categories (Phase 3) partially shipped — backend stores category field, frontend renders category headers. Polling flicker fix and share modal also deployed.

## Active Issues

| Issue | Status | Detail |
|-------|--------|--------|
| Polling flicker | Fixed | State diffing skips render when data unchanged |
| 404 on some list slugs | Investigating | User reported `?page=4v57` returning 404 — may be stale slug or blob propagation edge case |
| grocery.how DNS | Pending | dolist.how pointed, grocery.how not yet confirmed |

## Decisions

| Date | Decision | Context |
|------|----------|---------|
| 2026-03-12 | Single repo, two domains | One SPA themed by hostname, not two separate apps |
| 2026-03-12 | 4-char slugs, no ambiguous chars | `abcdefghjkmnpqrstuvwxyz23456789` — avoids i/l/o/0/1 confusion |
| 2026-03-12 | No accounts ever | URL is the access control. Bookmark it, text it. |
| 2026-03-12 | No dates/reminders | Keeps it lightweight. Make a new list instead. |
| 2026-03-12 | Client-side nav after create | `history.pushState` avoids blob propagation race on full reload |
| 2026-03-12 | Category syntax: `Category: Item` | Colon-separated in input. Category stored per item, rendered as group headers. |
| 2026-03-12 | State diffing before render | Compare JSON strings to skip no-op DOM rebuilds during polling |

## What's Next

- Wire grocery.how DNS (Cloudflare CNAME)
- Item notes (optional detail per item)
- Drag-to-reorder (touch + pointer handlers)
- Assignments (name chip per item)
- Share modal improvements (QR code?)
- Rate limiting (items per list, calls per IP)
- Stale list cleanup (90-day TTL)

## Key Files

| Purpose | Location |
|---------|----------|
| SPA | `index.html` |
| API | `netlify/functions/list.mjs` |
| Project instructions | `CLAUDE.md` |
| This file | `STATE.md` |
| Roadmap | `ROADMAP.md` |
| Product plan (notes repo) | `~/notes/docs/dolist-plan.md` |
| Sessions | `project-management/sessions/` |
