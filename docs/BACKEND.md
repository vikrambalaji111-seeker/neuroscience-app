# Backend Reference

A small **Express + SQLite** API for the community layer. SQLite is Node's
built-in `node:sqlite` (Node 22.5+/24) — **zero native dependencies**, so it
installs and runs anywhere. Lives in `server/`.

```bash
cd server && npm install && npm start   # http://localhost:8787
npm run dev                              # node --watch
```

Env: `PORT` (8787), `JWT_SECRET` (set a strong one in prod!), `DB_PATH`
(defaults to `server/data.db`). CORS is open (tighten for production).

## Database (`server/db.js`)

Schema created on boot (`CREATE TABLE IF NOT EXISTS`), WAL journal mode:

```
users      (id PK, email UNIQUE, password_hash, display_name, provider, created_at)
progress   (user_id PK→users, data TEXT(json), updated_at)        -- whole progress blob per user
comments   (id PK, topic_id, user_id→users, body, created_at)     -- indexed by (topic_id, created_at)
```

The `progress.data` blob mirrors the frontend progress shape exactly, so sync is
a straight GET/PUT of the whole object.

## API (`server/server.js`)

Auth is **JWT** (`Authorization: Bearer <token>`, 30-day TTL). Passwords are
bcrypt-hashed. The `auth(required)` middleware attaches `req.user`.

| Method & path | Auth | Body / params | Returns |
|---|---|---|---|
| `GET /api/health` | – | – | `{ok:true}` |
| `POST /api/auth/register` | – | `{email, password(6+), displayName?}` | `{token, user}` |
| `POST /api/auth/login` | – | `{email, password}` | `{token, user}` |
| `GET /api/auth/me` | ✓ | – | `{user}` |
| `GET /api/progress` | ✓ | – | `{data}` (null if none) |
| `PUT /api/progress` | ✓ | `{data}` | `{ok:true}` (upsert) |
| `GET /api/topics/:topicId/comments` | – (public read) | – | `{comments:[{id,body,createdAt,userId,author}]}` |
| `POST /api/topics/:topicId/comments` | ✓ | `{body}` | `{comment}` |
| `DELETE /api/comments/:id` | ✓ (own only) | – | `{ok:true}` |

`user` is always the safe shape `{id, email, name, provider}` (never the hash).

## Client (`src/api/backend.js`)

`api.*` wraps each endpoint; token is stored in `localStorage` (`ns-token`).
`checkHealth()` (2.5s timeout) decides backend-up vs local-fallback. Base URL is
`VITE_API_URL` or `http://localhost:8787`.

## Production / scaling notes

- **Set `JWT_SECRET`** to a strong secret; never ship the dev default.
- Point `DB_PATH` at persistent storage, or swap SQLite for managed **Postgres** — the query surface in `db.js` is standard SQL (parameterised), so it ports with minimal change.
- Put the API behind **HTTPS** and tighten CORS to the app origin.
- **Real social OAuth** (Google/Facebook/Instagram/Substack/X/Apple) is not implemented — the modal buttons are flagged "at launch". To add it: register an app with the provider, handle the OAuth redirect (server-side or provider SDK), and on success issue the same JWT (reuse `sign()` / the `users` table; `provider` column already exists). Email+password is the working path today.
- Add rate-limiting and input validation hardening before public launch (comment length is capped; add abuse/report + moderation as needed).
