# dolist.how / grocery.how

Dead-simple shared checklists. No accounts, no app, no sign-up. Open a link, make a list, share the URL.

## Owner

Bert Carroll, Ask the Human LLC

## Architecture

```
Browser (dolist.how/k7m2)
  ├── Single HTML file (no framework, no build step)
  ├── Domain-aware theming (grocery.how vs dolist.how)
  ├── Fetch → /.netlify/functions/list?page=k7m2
  └── Auto-refresh every 15s + on tab focus

Netlify Functions
  └── list.mjs (CRUD: create, add, toggle, remove, clear, favorites, reorder)
        └── Netlify Blobs store ("lists", keyed by list slug)

DNS: Cloudflare CNAME → Netlify
```

No database. No auth. No WebSocket. Blobs are the entire backend.

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | Entire SPA — landing page, list view, all CSS/JS |
| `netlify/functions/list.mjs` | Serverless CRUD API |
| `_redirects` | SPA routing (`/* /index.html 200`) |
| `privacy.html` | Static privacy page |
| `netlify.toml` | Build config |

## Domains

- **dolist.how** — general shared checklists (primary)
- **grocery.how** — grocery-themed landing (same app, themed by hostname)

Domain detection: exact match on `window.location.hostname === "grocery.how"` (not `.includes()`)

## Hosting

- **Netlify** — free tier
- **Site:** dolist-grocery-how (auto-named)
- **Deploy:** `netlify deploy --prod --dir=. --functions=netlify/functions`
- **Git:** `ubiquitouszero/dolist-grocery-how` (SSH: `git@github.com-ubiquitouszero:ubiquitouszero/dolist-grocery-how.git`)

## Conventions

- Single HTML file. No framework, no bundler, no build step.
- All CSS in `<style>`, all JS in `<script>` within `index.html`.
- 4-char short codes for list slugs (chars: `abcdefghjkmnpqrstuvwxyz23456789`)
- Category syntax: `Category: Item` (colon-separated in input)
- State diffing before render (compare JSON to skip no-op re-renders)
- Voice input via Web Speech API (splits on commas and "and")

## Guardrails

- **100-item cap** per list, **30 favorite cap**
- **No accounts, no login, no magic links** — the URL is the access control
- **No dates, no reminders, no sub-items** — keep it lightweight
- **Privacy footer required** on all pages
- **SEO meta tags**: noindex/nofollow (private lists, not for search engines)

## Commit Style

`{type}({scope}): {what}` — feat/fix/docs/refactor

## State Shape (Blob)

```json
{
  "name": "Grocery",
  "theme": "grocery",
  "items": [
    { "id": "abc123", "name": "Milk", "category": "Dairy", "checked": false, "addedBy": "Bert", "addedAt": "..." }
  ],
  "favorites": ["Milk", "Eggs"],
  "createdAt": "...",
  "updatedAt": "..."
}
```
