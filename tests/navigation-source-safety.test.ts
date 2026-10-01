import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

test("document viewer renders navigation and included materials without source keys", () => {
  const page = fs.readFileSync(path.join(root, "app/deal-room/documents/[id]/page.tsx"), "utf8");
  assert.equal(page.includes("Included materials"), true);
  assert.equal(page.includes("← Atrás"), true);
  assert.equal(page.includes("Siguiente →"), true);
  assert.equal(page.includes("sourceStorageKey"), false);
  assert.equal(page.includes("previewStorageKey"), false);
});

test("phase 2 enrichment contains no direct source URLs", () => {
  const migration = fs.readFileSync(path.join(root, "sql/002_phase2_review_package.sql"), "utf8");
  assert.equal(/https?:\/\//i.test(migration), false);
  assert.equal(migration.includes("source_storage_key"), false);
});
