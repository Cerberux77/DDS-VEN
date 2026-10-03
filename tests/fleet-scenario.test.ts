import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { buildFleetScenario, defaultScenarioSelection } from "../lib/dds/s04-rev2-engine.ts";
import type { ScenarioSelection } from "../lib/dds/scenario-types.ts";

function select(overrides: Partial<ScenarioSelection> = {}): ScenarioSelection {
  return { ...defaultScenarioSelection(), ...overrides };
}

function approx(actual: number | null | undefined, expected: number, tolerance = 1) {
  assert.notEqual(actual, null);
  assert.notEqual(actual, undefined);
  assert.ok(Math.abs((actual as number) - expected) <= tolerance, `expected ${actual} ≈ ${expected}`);
}

test("Rev2 default is 3F-capable / 2F-active with editable well geometry", () => {
  const s = defaultScenarioSelection();
  assert.equal(s.frontConfiguration, "STARTUP_3F_CAPABLE_2F_ACTIVE");
  assert.equal(s.intermediateFt, 1800);
  assert.equal(s.lateralFt, 4400);
  assert.equal(s.dso, 90);
});

test("Rev2 economic asset base and partner contributions reconcile", () => {
  const x = buildFleetScenario(select());
  assert.equal(x.economics.equipmentCapex, 9_410_762);
  assert.equal(x.economics.confirmedAustralContribution, 5_988_435);
  approx(x.economics.purchaseStartupP50, 5_151_092.505415513, 0.001);
  assert.match(x.economics.sourceStatus, /PARTNER_CONTRIBUTION_BACKED/);
});

test("Rev2 DSO liquidity controls reconcile", () => {
  const d45 = buildFleetScenario(select({ dso: 45 })).economics;
  const d60 = buildFleetScenario(select({ dso: 60 })).economics;
  const d90 = buildFleetScenario(select({ dso: 90 })).economics;
  approx(d45.grossPeakFunding, 5_285_982.075880768, 0.001);
  approx(d45.targetFundingCapacity, 5_446_178.950880768, 0.001);
  approx(d60.grossPeakFunding, 5_573_253.504452197, 0.001);
  approx(d60.targetFundingCapacity, 5_733_450.379452197, 0.001);
  approx(d90.grossPeakFunding, 6_147_796.361595053, 0.001);
  approx(d90.targetFundingCapacity, 6_307_993.236595053, 0.001);
});

test("default well geometry preserves USD600k full-service anchor and bridge discount", () => {
  const x = buildFleetScenario(select()).economics;
  approx(x.fullRevenuePerWell, 600_000, 0.001);
  approx(x.bridgeRevenuePerWell, 574_542.8571428572, 0.001);
});

test("intermediate and lateral sliders change revenue server-side", () => {
  const x = buildFleetScenario(select({ intermediateFt: 2200, lateralFt: 5000 })).economics;
  approx(x.fullRevenuePerWell, 655_528, 0.001);
  approx(x.bridgeRevenuePerWell, 624_413.7142857143, 0.001);
});

test("M0 and M6 cash schedule reflect PR2 8¼ 50/50 structure", () => {
  const x = buildFleetScenario(select({ dso: 90 }));
  const m0 = x.cashRamp?.find((row) => row.month === 0);
  const m6 = x.cashRamp?.find((row) => row.month === 6);
  assert.ok(m0);
  assert.ok(m6);
  approx(m0?.scheduledCash, 1_287_356.875, 0.001);
  approx(m6?.scheduledCash, 1_683_605.0519296168, 0.001);
});

test("base scenario peak occurs at M6", () => {
  const x = buildFleetScenario(select({ dso: 90 }));
  const peak = x.cashRamp?.reduce((a, b) => a.liquidFundingRequired > b.liquidFundingRequired ? a : b);
  assert.equal(peak?.month, 6);
  approx(peak?.liquidFundingRequired, 6_307_993.236595053, 0.001);
});

test("third front activation at M7 does not increase initial peak and improves 24M FCF", () => {
  const base = buildFleetScenario(select({ dso: 90 }));
  const three = buildFleetScenario(select({ frontConfiguration: "STARTUP_3F_CAPABLE_3F_M7", dso: 90 }));
  approx(three.economics.targetFundingCapacity, base.economics.targetFundingCapacity as number, 0.001);
  approx(three.economics.fcf24M, 708_734.1963969427, 0.001);
  assert.ok((three.economics.fcf24M as number) > (base.economics.fcf24M as number));
});

test("base 24M outputs reflect bridge startup and 2 active fronts", () => {
  const x = buildFleetScenario(select({ dso: 90 })).economics;
  approx(x.revenue24M, 12_523_628.57142857, 0.001);
  approx(x.ebitda24M, 7_117_353.424069822, 0.001);
  approx(x.netIncome24M, 3_351_343.2638860825, 0.001);
  approx(x.fcf24M, -1_560_188.6415294288, 0.001);
});

test("3F supplier-backed physical model uses shared directional core", () => {
  const x = buildFleetScenario(select());
  assert.equal(x.physical.mode, "EWERT_LEAN_3F");
  assert.equal(x.physical.sourceStatus, "AFE_BACKED");
  assert.equal(x.physical.fronts.length, 3);
  const mwd = x.physical.assetFamilies.find((a) => a.family === "MWD");
  assert.ok(mwd);
  assert.equal(mwd?.commercialQuantity, 2.5);
  assert.equal(mwd?.physicalQuantity, 5);
  assert.equal(mwd?.mainQuantity, 3);
  assert.equal(mwd?.backupQuantity, 2);
});

test("PR2 ownership/cash treatment reflects partner structure", () => {
  const x = buildFleetScenario(select());
  const pr28 = x.physical.assetFamilies.find((a) => a.assetId === "AFE-3F-PR2-8");
  const pr26 = x.physical.assetFamilies.find((a) => a.assetId === "AFE-3F-PR2-6");
  assert.equal(pr28?.cashTreatment, "PANTHERS_CASH");
  assert.equal(pr26?.cashTreatment, "AUSTRAL_IN_KIND");
  assert.equal(pr28?.purchaseValue, 2_481_500);
  assert.equal(pr26?.purchaseValue, 2_190_900);
});

test("workshop includes two breakout units and no extra crusher CAPEX is invented", () => {
  const x = buildFleetScenario(select());
  const workshop = x.physical.assetFamilies.find((a) => a.assetId === "AFE-3F-WORKSHOP");
  assert.equal(workshop?.purchaseValue, 487_804);
  assert.match(workshop?.notes.join(" ") ?? "", /no separate USD200k crusher/i);
});

test("4¾ remains optional and OFF by default", () => {
  const s = defaultScenarioSelection();
  assert.equal(s.optional475, "NO");
  const pending = buildFleetScenario(select({ optional475: "YES" }));
  assert.equal(pending.economics.status, "PENDING_S04_RESOLUTION");
  assert.equal(pending.economics.optional475KnownCapex, 179_603);
});

test("leasing remains pending with no fabricated economics", () => {
  const x = buildFleetScenario(select({ acquisition: "HYBRID_LEASE_18M" }));
  assert.equal(x.economics.status, "PENDING_LEASING");
  assert.equal(x.economics.grossPeakFunding, null);
});

test("hydrocarbon benefit remains pending formal validation", () => {
  const x = buildFleetScenario(select({ hydrocarbonBenefit: "ON" }));
  assert.equal(x.economics.status, "PENDING_FORMAL_VALIDATION");
});

test("growth beyond 3F no longer exposes stale Rev1 Ramp economics", () => {
  const x = buildFleetScenario(select({ frontConfiguration: "RAMP_3_TO_10" }));
  assert.equal(x.economics.status, "PENDING_S04_RESOLUTION");
  assert.match(x.economics.note, /superseded/i);
  assert.equal(x.economics.grossPeakFunding, null);
});

test("LIH remains NBV", () => {
  const x = buildFleetScenario(select());
  assert.equal(x.reconciliation.lihBasis, "NBV");
  assert.equal(x.reconciliation.noKitDoubleCount, true);
});

test("Crossovers remain conceptual and unpriced", () => {
  const x = buildFleetScenario(select());
  const crossover = x.physical.conceptualBhaComponents.find((c) => c.name === "Crossovers");
  assert.ok(crossover);
  assert.match(crossover?.note ?? "", /not invented/i);
});

test("browser remains presentation-only and exposes section sliders", () => {
  const root = process.cwd();
  const client = fs.readFileSync(path.join(root, "components/FleetConfigurator.tsx"), "utf8");
  assert.equal(client.includes("s04-rev2-engine"), false);
  assert.equal(client.includes("/api/dds/scenario"), true);
  assert.equal(client.includes("Intermediate 12¼ — ft"), true);
  assert.equal(client.includes("Production / Lateral 8½ — ft"), true);
  assert.equal(client.includes('type="range"'), true);
});

test("server boundary points to S04 Rev2 canonical engine", () => {
  const root = process.cwd();
  const engine = fs.readFileSync(path.join(root, "lib/dds/scenario-engine.ts"), "utf8");
  assert.equal(engine.includes('import "server-only"'), true);
  assert.equal(engine.includes("./s04-rev2-engine"), true);
});

test("funding UI uses liquid-cash and in-kind wording", () => {
  const root = process.cwd();
  const client = fs.readFileSync(path.join(root, "components/FleetConfigurator.tsx"), "utf8");
  assert.equal(client.includes("Peak Liquid Funding"), true);
  assert.equal(client.includes("Austral In-Kind"), true);
  assert.equal(client.includes("Panthers Cash Before WC"), true);
  assert.equal(client.includes("Equity Required"), false);
});

test("cash ramp is exposed for M0–M12", () => {
  const x = buildFleetScenario(select());
  assert.equal(x.cashRamp?.length, 13);
  assert.equal(x.cashRamp?.[0].month, 0);
  assert.equal(x.cashRamp?.[12].month, 12);
});
