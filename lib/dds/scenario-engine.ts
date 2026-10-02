import "server-only";

import {
  ACQUISITION_OPTIONS,
  FRONT_OPTIONS,
  TECHNICAL_OPTIONS,
  type AcquisitionStrategy,
  type BHAComponent,
  type Diameter,
  type FleetAsset,
  type FleetScenario,
  type FrontCount,
  type ScenarioCounts,
  type ScenarioSelection,
  type TechnicalConfiguration,
} from "./scenario-types";

const DIAMETERS: Diameter[] = ['12 1/4"', '8 1/2"'];

const BHA_COMPOSITION: BHAComponent[] = [
  { name: "Motor", relationship: "Downhole BHA", status: "DEFINED" },
  { name: "Gamma / PWD (MWD)", relationship: "Directional + pressure measurement", status: "DEFINED" },
  { name: "Resistivity", relationship: "LWD formation evaluation", status: "DEFINED" },
  { name: "Monel / NMDC", relationship: "Non-magnetic collar section", status: "DEFINED" },
  { name: "Jar", relationship: "Downhole contingency / release", status: "DEFINED" },
  { name: "Stabilizers ×2", relationship: "BHA stabilization", status: "DEFINED" },
  { name: "Crossovers", relationship: "Mechanical interface set", status: "DEFINED" },
  { name: "Surface / telemetry", relationship: "Surface system relationship; exact allocation pending AFE", status: "PENDING_AFE" },
  { name: "Spares / support", relationship: "Minimum operating spares/support quantities pending AFE", status: "PENDING_AFE" },
];

const TECHNICAL_RULES: Record<TechnicalConfiguration, (fronts: number) => ScenarioCounts> = {
  IDEAL: (fronts) => {
    const mainPerDiameter = fronts;
    const backupPerDiameter = fronts;
    const totalPerDiameter = mainPerDiameter + backupPerDiameter;
    return { mainPerDiameter, backupPerDiameter, totalPerDiameter, totalSets: totalPerDiameter * 2 };
  },
  OPTIMIZED: (fronts) => {
    const mainPerDiameter = fronts;
    const backupPerDiameter = Math.ceil(fronts / 2);
    const totalPerDiameter = mainPerDiameter + backupPerDiameter;
    return { mainPerDiameter, backupPerDiameter, totalPerDiameter, totalSets: totalPerDiameter * 2 };
  },
};

function isFrontCount(value: unknown): value is FrontCount {
  return typeof value === "number" && FRONT_OPTIONS.includes(value as FrontCount);
}

function isTechnical(value: unknown): value is TechnicalConfiguration {
  return typeof value === "string" && TECHNICAL_OPTIONS.includes(value as TechnicalConfiguration);
}

function isAcquisition(value: unknown): value is AcquisitionStrategy {
  return typeof value === "string" && ACQUISITION_OPTIONS.includes(value as AcquisitionStrategy);
}

export function parseScenarioSelection(value: unknown): ScenarioSelection {
  if (!value || typeof value !== "object") throw new Error("INVALID_SCENARIO_SELECTION");
  const input = value as Record<string, unknown>;
  if (!isFrontCount(input.fronts) || !isTechnical(input.technical) || !isAcquisition(input.acquisition)) {
    throw new Error("INVALID_SCENARIO_SELECTION");
  }
  return {
    fronts: input.fronts,
    technical: input.technical,
    acquisition: input.acquisition,
  };
}

function diameterCode(diameter: Diameter) {
  return diameter === '12 1/4"' ? "1214" : "0850";
}

function acquisitionState(acquisition: AcquisitionStrategy) {
  return acquisition === "PURCHASE" ? "OWNED" as const : "UNASSIGNED" as const;
}

function makeAsset(input: {
  selection: ScenarioSelection;
  diameter: Diameter;
  role: "MAIN" | "BACKUP";
  ordinal: number;
  coversFronts: number[];
}): FleetAsset {
  const { selection, diameter, role, ordinal, coversFronts } = input;
  const suffix = String(ordinal).padStart(2, "0");
  const state = acquisitionState(selection.acquisition);
  return {
    assetId: `DDS-${diameterCode(diameter)}-${role}-${role === "MAIN" ? "F" : "P"}${suffix}`,
    diameter,
    role,
    assignment: role === "MAIN" ? `FRONT ${suffix}` : `BACKUP POOL ${suffix}`,
    coversFronts,
    owner: "TBD — S02 ownership evidence",
    acquisitionState: state,
    capexValue: null,
    leaseState: selection.acquisition === "PURCHASE" ? "N/A" : "PENDING_ASSET_ASSIGNMENT",
    status: "PLANNED",
    location: "TBD",
    availability: "PLANNED",
    composition: BHA_COMPOSITION.map((item) => ({ ...item })),
  };
}

function buildAssets(selection: ScenarioSelection, counts: ScenarioCounts): FleetAsset[] {
  const assets: FleetAsset[] = [];

  for (const diameter of DIAMETERS) {
    for (let front = 1; front <= counts.mainPerDiameter; front += 1) {
      assets.push(makeAsset({
        selection,
        diameter,
        role: "MAIN",
        ordinal: front,
        coversFronts: [front],
      }));
    }

    for (let pool = 1; pool <= counts.backupPerDiameter; pool += 1) {
      const coversFronts = selection.technical === "IDEAL"
        ? [pool]
        : [pool * 2 - 1, pool * 2].filter((front) => front <= selection.fronts);

      assets.push(makeAsset({
        selection,
        diameter,
        role: "BACKUP",
        ordinal: pool,
        coversFronts,
      }));
    }
  }

  return assets;
}

function backupCoverageValid(assets: FleetAsset[], fronts: number) {
  return DIAMETERS.every((diameter) => {
    const covered = new Set(
      assets
        .filter((asset) => asset.diameter === diameter && asset.role === "BACKUP")
        .flatMap((asset) => asset.coversFronts)
    );
    return Array.from({ length: fronts }, (_, index) => index + 1).every((front) => covered.has(front));
  });
}

function financials(selection: ScenarioSelection, totalSets: number): FleetScenario["financials"] {
  const purchase = selection.acquisition === "PURCHASE";
  const leaseTermMonths = selection.acquisition === "HYBRID_LEASE_18M"
    ? 18
    : selection.acquisition === "HYBRID_LEASE_24M"
      ? 24
      : 0;

  return {
    totalSets,
    ownedSets: purchase ? totalSets : null,
    leasedSets: purchase ? 0 : null,
    equipmentCapex: {
      value: null,
      currency: "USD",
      state: "PENDING_AFE",
      note: "Requires normalized S02 AFE asset values; no provisional resistivity/additional-cost figures are capitalized here.",
    },
    upfrontCash: {
      value: null,
      currency: "USD",
      state: "PENDING_AFE",
      note: "Requires purchase/down-payment/import/commissioning/deposit values by asset.",
    },
    peakFunding: {
      value: null,
      currency: "USD",
      state: "PENDING_S03",
      note: "Requires the reconciled M1–M24 cash model, DSO scenario and asset-level acquisition schedule.",
    },
    leaseCost: {
      value: purchase ? 0 : null,
      currency: "USD",
      state: purchase ? "RESOLVED" : "PENDING_AFE",
      note: purchase
        ? "No lease cost under PURCHASE."
        : "16% CoC is known, but its basis and the leased asset allocation are not yet frozen.",
    },
    financialImpact24M: {
      value: null,
      currency: "USD",
      state: "PENDING_S03",
      note: "Requires reconciled S03 P&L/cash-flow outputs; UI does not calculate an independent financial model.",
    },
    leaseTermMonths,
    costOfCapitalPct: purchase ? null : 16,
    costOfCapitalBasis: purchase ? "N/A" : "PENDING_DEFINITION (APR/effective/nominal/flat)",
  };
}

export function buildFleetScenario(selectionInput: ScenarioSelection): FleetScenario {
  const selection = parseScenarioSelection(selectionInput);
  const counts = TECHNICAL_RULES[selection.technical](selection.fronts);
  const assets = buildAssets(selection, counts);
  const hybrid = selection.acquisition !== "PURCHASE";
  const resolvedOwned = assets.filter((asset) => asset.acquisitionState === "OWNED").length;
  const resolvedLeased = assets.filter((asset) => asset.acquisitionState === "LEASED").length;

  const assumptions = [
    "S01/S04 technical rules are authoritative: MAIN = F per diameter; IDEAL BACKUP = F; OPTIMIZED BACKUP = CEILING(F/2).",
    "12 1/4 and 8 1/2 sets are modeled as non-interchangeable.",
    "Asset values, owner evidence, locations, surface allocation and minimum spares remain pending S02 AFE reconciliation.",
  ];
  if (hybrid) {
    assumptions.push("HYBRID does not silently assign assets to OWNED or LEASED: S02 has not frozen the asset-by-asset allocation.");
    assumptions.push("Lease CoC = 16% is displayed as an input, but its rate basis remains pending definition.");
  }

  const acquisitionBalanceValid = hybrid
    ? null
    : resolvedOwned + resolvedLeased === assets.length;

  return {
    scenarioKey: `F${String(selection.fronts).padStart(2, "0")}-${selection.technical}-${selection.acquisition}`,
    selection,
    counts,
    assets,
    financials: financials(selection, assets.length),
    assumptions,
    reconciliation: {
      requiredSets: counts.totalSets,
      allocatedAssets: assets.length,
      setCountMatches: counts.totalSets === assets.length,
      backupCoverageValid: backupCoverageValid(assets, selection.fronts),
      acquisitionBalanceValid,
      economicsReconciled: false,
      note: "Physical fleet is derived only from S01/S04 rules. Economic reconciliation remains gated by normalized S02 AFE and S03 outputs.",
    },
    canonicalRefs: [
      "DDS-S01 — Technical Rebase / BHA Architecture",
      "DDS-S02 — Ewert AFE / Asset Gap / Leasing",
      "DDS-S03 — Financial Model 24M Rebase",
      "DDS-S04 — Scenario Engine + Excel Selector",
    ],
  };
}
