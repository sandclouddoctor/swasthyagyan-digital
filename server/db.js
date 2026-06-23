/* PostgreSQL data layer — replaces the JSON file approach.
   All exports are async. Railway provides DATABASE_URL automatically.
   For local dev: set DATABASE_URL in a .env file or use `railway run`. */

import pg from "pg";
import { randomUUID } from "node:crypto";

function sslConfig(url) {
  if (!url) return false;
  // Disable SSL for local dev and Railway internal connections
  if (url.includes("localhost") || url.includes(".railway.internal")) return false;
  return { rejectUnauthorized: false };
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig(process.env.DATABASE_URL),
});

/* ── Schema initialisation ── */
export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS families (
      id         TEXT PRIMARY KEY,
      head       TEXT    NOT NULL DEFAULT 'Unnamed household',
      village    TEXT    NOT NULL DEFAULT '—',
      created_by TEXT    NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      family     JSONB   NOT NULL DEFAULT '{"answers":{},"completed":false}',
      cards      JSONB   NOT NULL DEFAULT '[]'
    );
  `);
}

/* ── Row → JS object ── */
function rowToFamily(row) {
  return {
    id:        row.id,
    head:      row.head,
    village:   row.village,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    family:    row.family,
    cards:     row.cards || [],
  };
}

/* ── CRUD ── */
export async function getAllFamilies() {
  const { rows } = await pool.query(
    "SELECT * FROM families ORDER BY updated_at DESC"
  );
  return rows.map(rowToFamily);
}

export async function getFamily(id) {
  const { rows } = await pool.query(
    "SELECT * FROM families WHERE id = $1", [id]
  );
  return rows[0] ? rowToFamily(rows[0]) : null;
}

export async function createFamily({ head, village, createdBy }) {
  const id = "FAM-" + randomUUID().slice(0, 8).toUpperCase();
  const { rows } = await pool.query(
    `INSERT INTO families (id, head, village, created_by)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [id, head || "Unnamed household", village || "—", createdBy || ""]
  );
  return rowToFamily(rows[0]);
}

export async function updateFamily(id, updates) {
  const { rows } = await pool.query(
    `UPDATE families
     SET head       = $1,
         village    = $2,
         family     = $3::jsonb,
         cards      = $4::jsonb,
         updated_at = NOW()
     WHERE id = $5
     RETURNING *`,
    [
      updates.head,
      updates.village,
      JSON.stringify(updates.family),
      JSON.stringify(updates.cards || []),
      id,
    ]
  );
  return rows[0] ? rowToFamily(rows[0]) : null;
}

export async function deleteFamily(id) {
  await pool.query("DELETE FROM families WHERE id = $1", [id]);
}
