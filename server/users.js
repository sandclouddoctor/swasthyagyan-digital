/* PostgreSQL user/session store — all exports are async.
   Replaces the sync JSON-file approach. */

import pg from "pg";
import { randomBytes } from "node:crypto";

function sslConfig(url) {
  if (!url) return false;
  if (url.includes("localhost") || url.includes(".railway.internal")) return false;
  return { rejectUnauthorized: false };
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig(process.env.DATABASE_URL),
});

/* ── Schema init (called once on server start from db.js initDb) ── */
export async function initUsersDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      username      TEXT PRIMARY KEY,
      display_name  TEXT        NOT NULL,
      password_hash TEXT        NOT NULL,
      role          TEXT        NOT NULL DEFAULT 'student',
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_login    TIMESTAMPTZ,
      disabled      BOOLEAN     NOT NULL DEFAULT FALSE
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token      TEXT PRIMARY KEY,
      username   TEXT        NOT NULL REFERENCES users(username) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS sessions_username_idx ON sessions(username);
  `);
}

/* ── Helpers ── */
export async function countUsers() {
  const { rows } = await pool.query("SELECT COUNT(*) FROM users");
  return parseInt(rows[0].count, 10);
}

export async function getUserByName(username) {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username.toLowerCase()]
  );
  return rows[0] || null;
}

export async function getUserBySession(token) {
  if (!token) return null;
  const { rows } = await pool.query(
    `SELECT u.* FROM users u
     JOIN sessions s ON s.username = u.username
     WHERE s.token = $1 AND u.disabled = FALSE`,
    [token]
  );
  return rows[0] || null;
}

export async function getAllUsers() {
  const { rows: users } = await pool.query(
    "SELECT *, (SELECT COUNT(*) FROM sessions WHERE username = u.username) AS session_count FROM users u ORDER BY created_at"
  );
  return users.map(u => ({
    username:    u.username,
    displayName: u.display_name,
    role:        u.role,
    createdAt:   u.created_at,
    lastLogin:   u.last_login,
    disabled:    u.disabled,
    sessions:    parseInt(u.session_count, 10),
  }));
}

export async function createUser(username, passwordHash, displayName) {
  const count = await countUsers();
  const role  = count === 0 ? "admin" : "student";
  const { rows } = await pool.query(
    `INSERT INTO users (username, display_name, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [username.toLowerCase(), displayName || username, passwordHash, role]
  );
  const u = rows[0];
  return {
    username:    u.username,
    displayName: u.display_name,
    passwordHash: u.password_hash,
    role:        u.role,
    createdAt:   u.created_at,
    lastLogin:   u.last_login,
    disabled:    u.disabled,
  };
}

export async function addSession(username, token) {
  await pool.query(
    "INSERT INTO sessions (token, username) VALUES ($1, $2) ON CONFLICT DO NOTHING",
    [token, username.toLowerCase()]
  );
  await pool.query(
    "UPDATE users SET last_login = NOW() WHERE username = $1",
    [username.toLowerCase()]
  );
  // Keep only the 8 most recent sessions per user
  await pool.query(
    `DELETE FROM sessions
     WHERE username = $1
       AND token NOT IN (
         SELECT token FROM sessions WHERE username = $1
         ORDER BY created_at DESC LIMIT 8
       )`,
    [username.toLowerCase()]
  );
}

export async function removeSession(username, token) {
  await pool.query(
    "DELETE FROM sessions WHERE username = $1 AND token = $2",
    [username.toLowerCase(), token]
  );
}

export async function setDisabled(username, disabled) {
  const { rowCount } = await pool.query(
    "UPDATE users SET disabled = $1 WHERE username = $2",
    [!!disabled, username.toLowerCase()]
  );
  if (disabled) {
    await pool.query("DELETE FROM sessions WHERE username = $1", [username.toLowerCase()]);
  }
  return rowCount > 0;
}

export function newSessionToken() {
  return randomBytes(32).toString("hex");
}
