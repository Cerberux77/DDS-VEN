import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("deal-room CSP permits Next client hydration while blocking inline event handlers", () => {
  const config = fs.readFileSync("next.config.ts", "utf8");
  assert.match(config, /script-src 'self' 'unsafe-inline'/);
  assert.match(config, /script-src-attr 'none'/);
  assert.match(config, /connect-src 'self'/);
});
