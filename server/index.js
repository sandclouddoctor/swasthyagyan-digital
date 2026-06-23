import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { initDb, getAllFamilies, getFamily, createFamily, updateFamily, deleteFamily } from "./db.js";
import { initUsersDb, countUsers, getUserByName, getUserBySession,
         getAllUsers, createUser, addSession, removeSession,
         setDisabled, newSessionToken } from "./users.js";
import { buildCsv, familiesToCsv } from "./csv.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 4000;
const BCRYPT_ROUNDS = 12;

/* ════════════════════════════════════════════
   IN-MEMORY RATE LIMITER
════════════════════════════════════════════ */
const rlBuckets = new Map();

function rateLimit(key, max, windowMs) {
  const now = Date.now();
  const hits = (rlBuckets.get(key) || []).filter(t => t > now - windowMs);
  if (hits.length >= max) return false;
  hits.push(now);
  rlBuckets.set(key, hits);
  return true;
}

setInterval(() => {
  const cutoff = Date.now() - 120_000;
  for (const [k, v] of rlBuckets) {
    const fresh = v.filter(t => t > cutoff);
    if (fresh.length === 0) rlBuckets.delete(k);
    else rlBuckets.set(k, fresh);
  }
}, 300_000);

/* ════════════════════════════════════════════
   AUTH MIDDLEWARE
════════════════════════════════════════════ */
async function requireAuth(req, res, next) {
  const ip = req.ip || req.socket?.remoteAddress || "unknown";
  if (!rateLimit(`gl:${ip}`, 120, 60_000)) {
    return res.status(429).json({ error: "Too many requests — slow down." });
  }
  const auth  = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token) return res.status(401).json({ error: "Not logged in." });

  const user = await getUserBySession(token);
  if (!user) return res.status(401).json({ error: "Session expired — please log in again." });

  req.user = user;
  req.sessionToken = token;
  next();
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin access required." });
  }
  next();
}

/* ════════════════════════════════════════════
   EXPRESS APP
════════════════════════════════════════════ */
const app = express();
// Trust Railway's reverse proxy so req.ip is the real client IP
app.set("trust proxy", 1);
app.use(express.json({ limit: "5mb" }));

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// CORS — GitHub Pages client + any tunnel
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

/* ════════════════════════════════════════════
   PUBLIC ENDPOINTS
════════════════════════════════════════════ */
app.get("/api/health", (req, res) => res.json({ ok: true }));

/* ── Register ── */
app.post("/api/auth/register", async (req, res) => {
  const ip = req.ip || "unknown";
  if (!rateLimit(`reg:${ip}`, 5, 60_000)) {
    return res.status(429).json({ error: "Too many attempts. Wait 1 minute." });
  }

  const { username, password, displayName } = req.body || {};
  if (!username || !password)
    return res.status(400).json({ error: "Username and password are required." });
  if (username.length < 3 || username.length > 30)
    return res.status(400).json({ error: "Username must be 3–30 characters." });
  if (!/^[a-zA-Z0-9._-]+$/.test(username))
    return res.status(400).json({ error: "Username: letters, numbers, dots, hyphens, underscores only." });
  if (password.length < 6)
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  if (await getUserByName(username))
    return res.status(409).json({ error: "Username already taken — choose another." });

  const hash  = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user  = await createUser(username, hash, displayName?.trim() || username);
  const token = newSessionToken();
  await addSession(user.username, token);

  console.log(`  👤 Registered: ${user.username} (${user.role})`);
  res.status(201).json({ token, username: user.username, displayName: user.displayName, role: user.role });
});

/* ── Login ── */
app.post("/api/auth/login", async (req, res) => {
  const ip = req.ip || "unknown";
  if (!rateLimit(`login:${ip}`, 10, 60_000)) {
    return res.status(429).json({ error: "Too many login attempts. Wait 1 minute." });
  }

  const { username, password } = req.body || {};
  if (!username || !password)
    return res.status(400).json({ error: "Username and password are required." });

  const user = await getUserByName(username);
  const hash = user?.password_hash || "$2a$12$invalidhashpadding000000000000000000000000000000000000";
  const match = await bcrypt.compare(password, hash);

  if (!user || !match)
    return res.status(401).json({ error: "Invalid username or password." });
  if (user.disabled)
    return res.status(403).json({ error: "Account disabled. Contact your supervisor." });

  const token = newSessionToken();
  await addSession(user.username, token);

  res.json({ token, username: user.username, displayName: user.display_name, role: user.role });
});

/* ── Logout ── */
app.post("/api/auth/logout", requireAuth, async (req, res) => {
  await removeSession(req.user.username, req.sessionToken);
  res.json({ ok: true });
});

/* ════════════════════════════════════════════
   USER MANAGEMENT (admin only)
════════════════════════════════════════════ */
app.get("/api/users", requireAuth, requireAdmin, async (req, res) => {
  res.json(await getAllUsers());
});

app.patch("/api/users/:username", requireAuth, requireAdmin, async (req, res) => {
  const target = req.params.username.toLowerCase();
  if (target === req.user.username)
    return res.status(400).json({ error: "Cannot modify your own account here." });
  const { disabled } = req.body || {};
  const ok = await setDisabled(target, !!disabled);
  if (!ok) return res.status(404).json({ error: "User not found." });
  res.json({ ok: true });
});

/* ════════════════════════════════════════════
   FAMILY DATA (protected)
════════════════════════════════════════════ */
app.get("/api/families", requireAuth, async (req, res) => {
  res.json(await getAllFamilies());
});

app.get("/api/families/:id", requireAuth, async (req, res) => {
  const fam = await getFamily(req.params.id);
  if (!fam) return res.status(404).json({ error: "Family not found." });
  res.json(fam);
});

app.post("/api/families", requireAuth, async (req, res) => {
  const { head, village } = req.body || {};
  const fam = await createFamily({
    head:      head || "Unnamed household",
    village:   village || "—",
    createdBy: req.user.display_name || req.user.username,
  });
  res.status(201).json(fam);
});

app.put("/api/families/:id", requireAuth, async (req, res) => {
  const existing = await getFamily(req.params.id);
  if (!existing) return res.status(404).json({ error: "Family not found." });

  const incoming = req.body || {};
  // Replace temp IDs assigned on the client
  incoming.cards = (incoming.cards || []).map(c =>
    c.id?.startsWith("tmp-")
      ? { ...c, id: "CARD-" + randomUUID().slice(0, 8).toUpperCase() }
      : c
  );

  const merged = await updateFamily(req.params.id, {
    head:    incoming.head    ?? existing.head,
    village: incoming.village ?? existing.village,
    family:  incoming.family  ?? existing.family,
    cards:   incoming.cards   ?? existing.cards,
  });
  res.json(merged);
});

app.delete("/api/families/:id", requireAuth, async (req, res) => {
  const existing = await getFamily(req.params.id);
  if (!existing) return res.status(404).json({ error: "Family not found." });
  await deleteFamily(req.params.id);
  res.json({ ok: true });
});

/* ════════════════════════════════════════════
   CSV EXPORTS
════════════════════════════════════════════ */
app.get("/api/export/families.csv", requireAuth, async (req, res) => {
  const families = await getAllFamilies();
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="families.csv"');
  res.send(familiesToCsv(families));
});

app.get("/api/export/cards/:category.csv", requireAuth, async (req, res) => {
  const families = await getAllFamilies();
  const csv = buildCsv(families, req.params.category);
  if (csv === null) return res.status(404).send("Unknown category");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="${req.params.category}.csv"`);
  res.send(csv);
});

/* ════════════════════════════════════════════
   LOCAL DASHBOARD (served from server/public/)
   Only active when running locally; on Railway
   the GitHub Pages dashboard is used instead.
════════════════════════════════════════════ */
app.use(express.static(path.join(__dirname, "public")));
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

/* ════════════════════════════════════════════
   START
════════════════════════════════════════════ */
async function start() {
  try {
    await initDb();
    await initUsersDb();
    const userCount = await countUsers();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`\n╔══════════════════════════════════════════╗`);
      console.log(`║      VAP Family Ledger Server            ║`);
      console.log(`╠══════════════════════════════════════════╣`);
      console.log(`║  Port:      ${PORT}                          ║`);
      console.log(`║  Dashboard: /dashboard                   ║`);
      console.log(`╚══════════════════════════════════════════╝`);
      if (userCount === 0) {
        console.log(`\n  ⚠️  No accounts yet.`);
        console.log(`  Open the app and REGISTER — your account becomes admin.\n`);
      } else {
        console.log(`\n  ✅ Ready. ${userCount} user(s) registered.\n`);
      }
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

start();
