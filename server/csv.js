import { categoryMeta } from "../shared/schemas.js";

function buildLabelMap(blocks, map = {}) {
  blocks.forEach((b) => {
    if (b.type === "section") return;
    if (b.type === "multi" || b.type === "repeat") {
      map[b.id] = b.label;
      buildLabelMap(b.fields, map);
    } else {
      map[b.id] = b.label;
    }
  });
  return map;
}

function csvEscape(v) {
  if (Array.isArray(v)) v = v.join(";");
  if (typeof v === "object" && v !== null) v = JSON.stringify(v);
  if (v === undefined || v === null) v = "";
  v = String(v).replace(/"/g, '""');
  if (v.includes(",") || v.includes("\n") || v.includes('"')) v = `"${v}"`;
  return v;
}

export function familiesToCsv(families) {
  const header = ["id", "head", "village", "createdBy", "createdAt", "questionnaireDone", "numCards"];
  const lines = [header.join(",")];
  families.forEach((f) => {
    const row = [f.id, f.head, f.village, f.createdBy, f.createdAt, f.family?.completed ? "Yes" : "No", (f.cards || []).length];
    lines.push(row.map(csvEscape).join(","));
  });
  return lines.join("\n");
}

export function buildCsv(families, categoryKey) {
  const meta = categoryMeta(categoryKey);
  if (!meta) return null;
  const fieldIds = Object.keys(buildLabelMap(meta.schema));
  const header = ["family", "village", ...fieldIds];
  const lines = [header.join(",")];
  families.forEach((f) => {
    (f.cards || [])
      .filter((c) => c.category === categoryKey)
      .forEach((c) => {
        const row = header.map((h) => {
          if (h === "family") return csvEscape(f.head);
          if (h === "village") return csvEscape(f.village);
          return csvEscape(c.answers ? c.answers[h] : "");
        });
        lines.push(row.join(","));
      });
  });
  return lines.join("\n");
}
