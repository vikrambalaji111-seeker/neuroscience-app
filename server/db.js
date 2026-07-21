// Database layer — Node's built-in SQLite (no native dependencies).
// For production this can be pointed at a managed Postgres with minimal changes;
// the query surface here is intentionally small and standard.
const { DatabaseSync } = require('node:sqlite')
const path = require('path')

const db = new DatabaseSync(process.env.DB_PATH || path.join(__dirname, 'data.db'))

db.exec('PRAGMA journal_mode = WAL;')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    display_name  TEXT NOT NULL,
    provider      TEXT NOT NULL DEFAULT 'email',
    created_at    INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS progress (
    user_id    INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    data       TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS comments (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    topic_id   TEXT NOT NULL,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body       TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_comments_topic ON comments(topic_id, created_at);
`)

module.exports = db
