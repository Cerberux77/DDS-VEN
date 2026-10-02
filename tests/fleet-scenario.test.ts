import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { buildFleetScenario } from "../lib/dds/scenario-core.ts";

const ideal = [4,8,12,16,20,24,28,32,36,40];
const optimized = [4,6,10,12,16,18,22,24,28,30];

test("S01/S04 1-10 fleet matrix reconciles", () => {
  for (let i = 0; i < 10; i += 1) {
    const fronts = (i + 1) as 1|2|3|4|5|6|7|8|9|10;
    assert.equal(buildFleetScenario({ fronts, technical: "IDEAL", acquisition: "PURCHASE" }).counts.totalSets, ideal[i]);
    assert.equal(buildFleetScenario({ fronts, technical: "OPTIMIZED", acquisition: "PURCHASE" }).counts.totalSets, optimized[i]);
  }
});

test("optimized backup pool covers every front by diameter", () => {
  const scenario = buildFleetScenario({ fronts: 3, technical: "OPTIMIZED", acquisition: "PURCHASE" });
  assert.equal(scenario.counts.mainPerDiameter, 3);
  assert.equal(scenario.counts.backupPerDiameter, 2);
  assert.equal(scenario.counts.totalSets, 10);
  assert.equal(scenario.reconciliation.setCountMatches, true);
  assert.equal(scenario.reconciliation.backupCoverageValid, true);

  const backup1214 = scenario.assets.filter((asset) => asset.diameter === '12 1/4"' && asset.role === "BACKUP");
  assert.deepEqual(backup1214.map((asset) => asset.coversFronts), [[1,2],[3]]);
});

test("purchase resolves holding count without inventing AFE values", () => {
  const scenario = buildFleetScenario({ fronts: 2, technical: "IDEAL", acquisition: "PURCHASE" });
  assert.equal(scenario.financials.totalSets, 8);
  assert.equal(scenario.financials.ownedSets, 8);
  assert.equal(scenario.financials.leasedSets, 0);
  assert.equal(scenario.financials.leaseCost.value, 0);
  assert.equal(scenario.financials.equipmentCapex.value, null);
  assert.equal(scenario.financials.peakFunding.value, null);
});

test("hybrid remains asset-unassigned until S02 freezes allocation", () => {
  const scenario = buildFleetScenario({ fronts: 2, technical: "OPTIMIZED", acquisition: "HYBRID_LEASE_18M" });
  assert.equal(scenario.financials.leaseTermMonths, 18);
  assert.equal(scenario.financials.costOfCapitalPct, 16);
  assert.equal(scenario.financials.ownedSets, null);
  assert.equal(scenario.financials.leasedSets, null);
  assert.equal(scenario.reconciliation.acquisitionBalanceValid, null);
  assert.equal(scenario.assets.every((asset) => asset.acquisitionState === "UNASSIGNED"), true);
});

test("asset drilldown exposes required BHA composition", () => {
  const scenario = buildFleetScenario({ fronts: 1, technical: "IDEAL", acquisition: "PURCHASE" });
  const names = scenario.assets[0].composition.map((component) => component.name);
  for (const expected of ["Motor", "Gamma / PWD (MWD)", "Resistivity", "Monel / NMDC", "Jar", "Stabilizers ×2", "Crossovers", "Surface / telemetry", "Spares / support"]) {
    assert.equal(names.includes(expected), true);
  }
});

test("client remains presentation-only and scenario engine remains server-only", () => {
  const root = process.cwd();
  const client = fs.readFileSync(path.join(root, "components/FleetConfigurator.tsx"), "utf8");
  const engine = fs.readFileSync(path.join(root, "lib/dds/scenario-engine.ts"), "utf8");
  const route = fs.readFileSync(path.join(root, "app/api/dds/scenario/route.ts"), "utf8");

  assert.equal(client.includes("scenario-core"), false);
  assert.equal(client.includes("scenario-engine"), false);
  assert.equal(client.includes("Math.ceil"), false);
  assert.equal(client.includes("/api/dds/scenario"), true);
  assert.equal(engine.includes('import "server-only"'), true);
  assert.equal(route.includes("scenario-engine"), true);
});
