import { getStore } from "@netlify/blobs";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json",
};

function generateSlug() {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789"; // no i/l/o/0/1
  let slug = "";
  for (let i = 0; i < 4; i++) {
    slug += chars[Math.floor(Math.random() * chars.length)];
  }
  return slug;
}

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export default async (req, context) => {
  if (req.method === "OPTIONS") {
    return new Response("", { headers: CORS });
  }

  const store = getStore("lists");
  const url = new URL(req.url);
  const page = url.searchParams.get("page");

  // POST without page param = create new list
  if (req.method === "POST" && !page) {
    const body = await req.json();
    if (body.action === "create") {
      // Generate unique slug
      let slug;
      let attempts = 0;
      do {
        slug = generateSlug();
        const existing = await store.get(slug);
        if (!existing) break;
        attempts++;
      } while (attempts < 10);

      const now = new Date().toISOString();
      const listData = {
        name: (body.name || "Untitled List").slice(0, 100),
        theme: body.theme || "general",
        items: [],
        favorites: [],
        createdAt: now,
        updatedAt: now,
      };

      await store.setJSON(slug, listData);
      return new Response(JSON.stringify({ slug }), { headers: CORS });
    }
  }

  // All other operations need a page
  if (!page) {
    return new Response(JSON.stringify({ error: "Missing page parameter" }), {
      status: 400,
      headers: CORS,
    });
  }

  // GET: return list state
  if (req.method === "GET") {
    const raw = await store.get(page);
    if (!raw) {
      return new Response(JSON.stringify({ error: "List not found" }), {
        status: 404,
        headers: CORS,
      });
    }
    return new Response(raw, { headers: CORS });
  }

  // POST: mutate list
  if (req.method === "POST") {
    const raw = await store.get(page);
    if (!raw) {
      return new Response(JSON.stringify({ error: "List not found" }), {
        status: 404,
        headers: CORS,
      });
    }

    let state;
    try {
      state = JSON.parse(raw);
    } catch {
      state = { name: "List", theme: "general", items: [], favorites: [] };
    }

    const body = await req.json();
    const now = new Date().toISOString();

    switch (body.action) {
      case "add": {
        const name = (body.name || "").trim().slice(0, 200);
        if (!name) break;
        // Cap at 100 items
        if (state.items.length >= 100) break;
        state.items.push({
          id: makeId(),
          name,
          checked: false,
          addedBy: (body.by || "").slice(0, 30),
          addedAt: now,
          checkedBy: null,
          checkedAt: null,
        });
        break;
      }
      case "toggle": {
        const item = state.items.find((i) => i.id === body.id);
        if (item) {
          item.checked = !item.checked;
          item.checkedBy = item.checked ? (body.by || "").slice(0, 30) : null;
          item.checkedAt = item.checked ? now : null;
        }
        break;
      }
      case "remove": {
        state.items = state.items.filter((i) => i.id !== body.id);
        break;
      }
      case "clear-checked": {
        state.items = state.items.filter((i) => !i.checked);
        break;
      }
      case "add-favorite": {
        if (!state.favorites) state.favorites = [];
        const fname = (body.name || "").trim().slice(0, 200);
        if (fname && !state.favorites.includes(fname)) {
          if (state.favorites.length < 30) {
            state.favorites.push(fname);
          }
        }
        break;
      }
      case "remove-favorite": {
        if (!state.favorites) state.favorites = [];
        state.favorites = state.favorites.filter((f) => f !== body.name);
        break;
      }
      case "reorder": {
        if (Array.isArray(body.order)) {
          const idMap = new Map(state.items.map((i) => [i.id, i]));
          const reordered = body.order
            .map((id) => idMap.get(id))
            .filter(Boolean);
          // Add any items not in the order array
          const ordered = new Set(body.order);
          state.items.forEach((i) => {
            if (!ordered.has(i.id)) reordered.push(i);
          });
          state.items = reordered;
        }
        break;
      }
    }

    state.updatedAt = now;
    await store.setJSON(page, state);
    return new Response(JSON.stringify(state), { headers: CORS });
  }

  return new Response("Method not allowed", { status: 405, headers: CORS });
};

export const config = {
  path: "/.netlify/functions/list",
};
