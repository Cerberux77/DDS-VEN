import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { buildFleetScenario, defaultScenarioSelection } from "../lib/dds/scenario-core.ts";
import type { ScenarioSelection } from "../lib/dds/scenario-types.ts";

function select(overrides: Partial<ScenarioSelection> = {}): ScenarioSelection {
  return { ...defaultScenarioSelection(), ...overrides };
}

function approx(actual: number | null, expected: number, tolerance = 1) {
  assert.notEqual(actual, null);
  assert.ok(Math.abs((actual as number) - expected) <= tolerance, `expected ${actual} ≈ ${expected}`);
}

test("S04 Rev1 core Peak Funding controls reconcile exactly", () => {
  approx(buildFleetScenario(select({ frontConfiguration: "STATIC_2F", dso: 45 })).economics.grossPeakFunding, 7_502_982.579450832, 0.001);
  approx(buildFleetScenario(select({ frontConfiguration: "STATIC_2F", dso: 60 })).economics.grossPeakFunding, 7_802_982.579450832, 0.001);
  approx(buildFleetScenario(select({ frontConfiguration: "STATIC_2F", dso: 90 })).economics.grossPeakFunding, 8_144_427.045176248, 0.001);
  approx(buildFleetScenario(select({ frontConfiguration: "STATIC_3F", dso: 90 })).economics.grossPeakFunding, 12_382_318.149388993, 0.001);
  approx(buildFleetScenario(select({ frontConfiguration: "RAMP_3_TO_10", dso: 45 })).economics.grossPeakFunding, 19_253_216.92581714, 0.001);
  approx(buildFleetScenario(select({ frontConfiguration: "RAMP_3_TO_10", dso: 60 })).economics.grossPeakFunding, 20_453_216.925817143, 0.001);
  approx(buildFleetScenario(select({ frontConfiguration: "RAMP_3_TO_10", dso: 90 })).economics.grossPeakFunding, 22_960_556.247195095, 0.001);
});

test("S04 Rev1 FCF controls do not conflate 2F with Ramp", () => {
  approx(buildFleetScenario(select({ frontConfiguration: "STATIC_2F", dso: 90 })).economics.fcf24M, 4_405_332.822590001, 0.001);
  approx(buildFleetScenario(select({ frontConfiguration: "RAMP_3_TO_10", dso: 90 })).economics.fcf24M, -2_754_127.172319226, 0.001);
});

test("S04 equipment controls reconcile for 2F, 3F and 10F Ramp", () => {
  assert.equal(buildFleetScenario(select({ frontConfiguration: "STATIC_2F" })).economics.equipmentCapex, 6_554_286);
  assert.equal(buildFleetScenario(select({ frontConfiguration: "STATIC_3F" })).economics.equipmentCapex, 10_283_636);
  assert.equal(buildFleetScenario(select({ frontConfiguration: "RAMP_3_TO_10" })).economics.equipmentCapex, 30_398_086);
});

test("2F benchmark exposes startup P50 and AFE-backed provenance", () => {
  const scenario = buildFleetScenario(select({ frontConfiguration: "STATIC_2F", dso: 90 }));
  approx(scenario.economics.purchaseStartupP50, 6_789_881.148, 0.001);
  assert.match(scenario.economics.sourceStatus, /AFE_BACKED/);
  assert.equal(scenario.sourceBadge, "AFE BACKED");
});

test("default scenario preserves S04 Ramp selection and optional 4¾ OFF", () => {
  const selection = defaultScenarioSelection();
  assert.equal(selection.frontConfiguration, "RAMP_3_TO_10");
  assert.equal(selection.technical, "EWERT_LEAN");
  assert.equal(selection.dso, 90);
  assert.equal(selection.optional475, "NO");
});

test("optional 4¾ exposes only known CAPEX and does not fabricate complete economics", () => {
  const scenario = buildFleetScenario(select({ optional475: "YES" }));
  assert.equal(scenario.economics.status, "PENDING_S04_RESOLUTION");
  assert.equal(scenario.economics.optional475KnownCapex, 179_603);
  assert.equal(scenario.economics.grossPeakFunding, null);
  assert.match(scenario.economics.note, /incremental logistics\/customs/i);
});

test("leasing scenarios remain pending without invented economics", () => {
  for (const acquisition of ["HYBRID_LEASE_18M", "HYBRID_LEASE_24M"] as const) {
    const scenario = buildFleetScenario(select({ acquisition }));
    assert.equal(scenario.economics.status, "PENDING_LEASING");
    assert.equal(scenario.economics.equipmentCapex, null);
    assert.equal(scenario.economics.grossPeakFunding, null);
    assert.match(scenario.economics.note, /asset eligibility/i);
    assert.match(scenario.economics.note, /buyout/i);
  }
});

test("hydrocarbon benefit ON is pending formal validation", () => {
  const scenario = buildFleetScenario(select({ hydrocarbonBenefit: "ON" }));
  assert.equal(scenario.economics.status, "PENDING_FORMAL_VALIDATION");
  assert.equal(scenario.economics.grossPeakFunding, null);
});

test("LIH remains NBV and Gross Funding is not labelled required equity", () => {
  const scenario = buildFleetScenario(select());
  assert.equal(scenario.reconciliation.lihBasis, "NBV");
  assert.equal(scenario.reconciliation.grossFundingNotEquity, true);
  assert.equal(scenario.reconciliation.australCreditLabelSafe, true);
  assert.equal(scenario.economics.confirmedAustralContribution, 0);
  assert.equal(scenario.economics.netPeakFunding, scenario.economics.grossPeakFunding);
});

test("EWERT_LEAN 2F is a physical family model, not identical sets", () => {
  const scenario = buildFleetScenario(select({ frontConfiguration: "STATIC_2F" }));
  assert.equal(scenario.physical.mode, "EWERT_LEAN_2F");
  assert.equal(scenario.physical.fronts.length, 2);
  const mwd = scenario.physical.assetFamilies.find((asset) => asset.family === "MWD");
  assert.ok(mwd);
  assert.equal(mwd.commercialQuantity, 2);
  assert.equal(mwd.commercialUnit, "KIT");
  assert.equal(mwd.physicalQuantity, 4);
  assert.equal(mwd.mainQuantity, 2);
  assert.equal(mwd.backupQuantity, 2);
  assert.equal(mwd.purchaseValue, 607_240);
  assert.equal(scenario.reconciliation.noKitDoubleCount, true);
});

test("PR2 and motor pools expose shared backup / rotation architecture", () => {
  const scenario = buildFleetScenario(select({ frontConfiguration: "STATIC_2F" }));
  const pr2 = scenario.physical.assetFamilies.find((asset) => asset.assetId === "AFE-R0-03-01");
  const motor = scenario.physical.assetFamilies.find((asset) => asset.assetId === "AFE-R0-06-01");
  assert.ok(pr2);
  assert.equal(pr2.physicalQuantity, 3);
  assert.equal(pr2.mainQuantity, 2);
  assert.equal(pr2.backupQuantity, 1);
  assert.equal(pr2.sharedQuantity, 1);
  assert.ok(motor);
  assert.equal(motor.physicalQuantity, 5);
  assert.equal(motor.mainQuantity, 2);
  assert.equal(motor.rotationQuantity, 3);
});

test("Crossovers are conceptual/included and never receive invented asset economics", () => {
  const scenario = buildFleetScenario(select({ frontConfiguration: "STATIC_2F" }));
  const crossovers = scenario.physical.conceptualBhaComponents.find((component) => component.name === "Crossovers");
  assert.ok(crossovers);
  assert.equal(crossovers.sourceStatus, "CONCEPTUAL_INCLUDED_NOT_SEPARATELY_PRICED");
  assert.match(crossovers.note, /quantity, price and asset_id are intentionally not invented/i);
  assert.equal(scenario.physical.assetFamilies.some((asset) => /CROSS/i.test(asset.assetId) || /CROSS/i.test(asset.family)), false);
});

test("3F and Ramp are visibly MODEL DERIVED rather than supplier quoted", () => {
  const three = buildFleetScenario(select({ frontConfiguration: "STATIC_3F" }));
  const ramp = buildFleetScenario(select({ frontConfiguration: "RAMP_3_TO_10" }));
  assert.equal(three.sourceBadge, "MODEL DERIVED");
  assert.equal(three.physical.sourceStatus, "MODEL_DERIVED");
  assert.equal(ramp.sourceBadge, "MODEL DERIVED");
  assert.equal(ramp.physical.sourceStatus, "MODEL_DERIVED");
});

test("Ramp milestones reach 10 fronts at M18 without fabricating supplier line items", () => {
  const scenario = buildFleetScenario(select());
  const last = scenario.physical.rampMilestones.at(-1);
  assert.deepEqual(last, { month: 18, fronts: 10, sourceStatus: "MODEL_DERIVED" });
  assert.equal(scenario.physical.fronts.length, 0);
});

test("default funding bridge uses intuitive operating cash / collections reconciliation wording", () => {
  const scenario = buildFleetScenario(select());
  const residual = scenario.fundingBridge.find((item) => item.order === 6);
  assert.ok(residual);
  assert.equal(residual.component, "Operating Cash / Collections Reconciliation");
  assert.match(residual.treatment, /not a conventional negative cost/i);
  const peak = scenario.fundingBridge.find((item) => item.order === 9);
  assert.equal(peak?.component, "NET PEAK FUNDING");
  assert.match(peak?.treatment ?? "", /Not required equity/i);
});

test("S05 client remains presentation-only and does not import economic snapshot data", () => {
  const root = process.cwd();
  const client = fs.readFileSync(path.join(root, "components/FleetConfigurator.tsx"), "utf8");
  const engine = fs.readFileSync(path.join(root, "lib/dds/scenario-engine.ts"), "utf8");
  const route = fs.readFileSync(path.join(root, "app/api/dds/scenario/route.ts"), "utf8");

  assert.equal(client.includes("s04-rev1-data"), false);
  assert.equal(client.includes("scenario-core"), false);
  assert.equal(client.includes("peak_funding"), false);
  assert.equal(client.includes("equipment_capex"), false);
  assert.equal(client.includes("/api/dds/scenario"), true);
  assert.equal(engine.includes('import "server-only"'), true);
  assert.equal(route.includes("scenario-engine"), true);
});

test("selected resolved scenarios report exact S04 handoff reconciliation", () => {
  for (const frontConfiguration of ["STATIC_2F", "STATIC_3F", "RAMP_3_TO_10"] as const) {
    for (const dso of [45, 60, 90] as const) {
      const scenario = buildFleetScenario(select({ frontConfiguration, dso }));
      assert.equal(scenario.economics.status, "RESOLVED");
      assert.equal(scenario.reconciliation.computationalUiReconciliation, "PASS");
      assert.equal(scenario.reconciliation.economicsSource, "S04_HANDOFF");
      assert.equal(scenario.reconciliation.noIndependentEconomicFormula, true);
    }
  }
});
