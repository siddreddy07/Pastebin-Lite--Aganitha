# Pastebin-Lite

A small Pastebin-like app. Paste text, get a shareable link, and optionally make it expire after a date/time or a number of views.

- **server/** Express + TypeScript, Drizzle ORM, Neon Postgres (port 8080)
- **client/** Next.js + shadcn/ui

## Run it

```bash
# server
cd server
cp .env.example .env      # fill in DATABASE_URL and DATABASE_URL_POOLED
npm install
npm run db:migrate
npm run dev

# client (new terminal)
cd client
npm install
npm run dev               # http://localhost:3000
```

When the server is deployed, set `NEXT_PUBLIC_API_URL` on the client to its URL.

## API

| Method | Route | What it does |
|---|---|---|
| POST | `/pastes` | Create a paste. Body: `content`, optional `expires_at` (ISO date/time), optional `max_views` |
| GET | `/pastes/:id` | Read a paste. Counts as one view; 404 once expired or out of views |
| GET | `/pastes/:id/stats` | Views used and whether it is still active. Does not count a view |
| DELETE | `/pastes/:id` | Delete a paste |

## Design notes

- No accounts. A paste's UUID link is the only key to it.
- The dashboard keeps the ids of pastes created in this browser in `localStorage`, then asks `/pastes/:id/stats` for each one to show live status.
- Views are counted in one atomic SQL update, so two people can't both take the last view.
