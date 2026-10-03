import {
  ACQUISITION_OPTIONS,
  CUSTOMS_MODE_OPTIONS,
  CUSTOMS_VALUE_FACTOR_OPTIONS,
  DSO_OPTIONS,
  FRONT_CONFIGURATION_OPTIONS,
  GUARANTEE_MODE_OPTIONS,
  HYDROCARBON_BENEFIT_OPTIONS,
  OPTIONAL_475_OPTIONS,
  SURETY_RATE_OPTIONS,
  TECHNICAL_OPTIONS,
  type EconomicSnapshot,
  type FleetScenario,
  type FrontView,
  type ScenarioSelection,
} from "./scenario-types.ts";
import {
  S04_2F_PURCHASE_STARTUP_P50,
  S04_CONFIRMED_AUSTRAL_ASSET_CONTRIBUTION,
  S04_CORE_SCENARIOS,
  S04_DEFAULT_FUNDING_BRIDGE,
  S04_DEFAULT_SELECTION,
  S04_LIH_BASIS,
  S04_OPTIONAL_475_KNOWN_CAPEX,
  S04_RAMP_MILESTONES,
} from "./s04-rev1-data.ts";
import {
  EWERT_LEAN_2F_ASSET_FAMILIES,
  EWERT_LEAN_2F_FRONTS,
  EWERT_LEAN_2F_POOLS,
} from "./ewert-lean-2f-data.ts";

function included<T extends readonly unknown[]>(values: T, value: unknown): value is T[number] {
  return values.includes(value as never);
}

export function parseScenarioSelection(value: unknown): ScenarioSelection {
  if (!value || typeof value !== "object") throw new Error("INVALID_SCENARIO_SELECTION");
  const input = value as Record<string, unknown>;
  const frontCount = Number(input.futureTechnicalFrontCount);

  if (
    !included(FRONT_CONFIGURATION_OPTIONS, input.frontConfiguration) ||
    !included(TECHNICAL_OPTIONS, input.technical) ||
    !included(ACQUISITION_OPTIONS, input.acquisition) ||
    !included(DSO_OPTIONS, input.dso) ||
    !included(CUSTOMS_MODE_OPTIONS, input.customsMode) ||
    !included(CUSTOMS_VALUE_FACTOR_OPTIONS, input.customsValueFactor) ||
    !included(SURETY_RATE_OPTIONS, input.suretyRate) ||
    !included(GUARANTEE_MODE_OPTIONS, input.guaranteeMode) ||
    !included(HYDROCARBON_BENEFIT_OPTIONS, input.hydrocarbonBenefit) ||
    !included(OPTIONAL_475_OPTIONS, input.optional475) ||
    !Number.isInteger(frontCount) || frontCount < 1 || frontCount > 10
  ) {
    throw new Error("INVALID_SCENARIO_SELECTION");
  }

  return {
    frontConfiguration: input.frontConfiguration,
    technical: input.technical,
    acquisition: input.acquisition,
    dso: input.dso,
    customsMode: input.customsMode,
    customsValueFactor: input.customsValueFactor,
    suretyRate: input.suretyRate,
    guaranteeMode: input.guaranteeMode,
    hydrocarbonBenefit: input.hydrocarbonBenefit,
    optional475: input.optional475,
    futureTechnicalFrontCount: frontCount,
  } as ScenarioSelection;
}

function rowToEconomics(row: (typeof S04_CORE_SCENARIOS)[number]): EconomicSnapshot {
  return {
    scenarioId: row.scenario_id,
    status: "RESOLVED",
    sourceStatus: row.source_status,
    equipmentCapex: row.equipment_capex,
    purchaseStartupP50: row.front_configuration === "STATIC_2F" ? S04_2F_PURCHASE_STARTUP_P50 : null,
    preopCash: row.preop_cash,
    m0M4CashRequirement: row.m0_m4_cash_requirement,
    year1Funding: row.year1_funding,
    grossPeakFunding: row.peak_funding,
    confirmedAustralContribution: S04_CONFIRMED_AUSTRAL_ASSET_CONTRIBUTION,
    netPeakFunding: row.peak_funding,
    liquidityFloor: row.liquidity_floor,
    targetFundingCapacity: row.peak_plus_floor,
    peakAR: row.peak_ar,
    revenue24M: row.revenue_24m,
    ebitda24M: row.ebitda_24m,
    netIncome24M: row.net_income_24m,
    fcf24M: row.fcf_24m,
    logistics: row.logistics,
    surety: row.surety,
    suspendedTaxes: row.suspended_taxes,
    restrictedCash: row.restricted_cash,
    optional475KnownCapex: S04_OPTIONAL_475_KNOWN_CAPEX,
    note: "Exact S04 Rev1 machine-handoff snapshot. No economic formula is executed in S05.",
  };
}

function pendingEconomics(status: EconomicSnapshot["status"], note: string): EconomicSnapshot {
  return {
    scenarioId: null,
    status,
    sourceStatus:
      status === "PENDING_LEASING" ? "PENDING_LEASING"
      : status === "PENDING_FORMAL_VALIDATION" ? "PENDING_FORMAL_VALIDATION"
      : "PENDING_S04_RESOLUTION",
    equipmentCapex: null,
    purchaseStartupP50: null,
    preopCash: null,
    m0M4CashRequirement: null,
    year1Funding: null,
    grossPeakFunding: null,
    confirmedAustralContribution: S04_CONFIRMED_AUSTRAL_ASSET_CONTRIBUTION,
    netPeakFunding: null,
    liquidityFloor: null,
    targetFundingCapacity: null,
    peakAR: null,
    revenue24M: null,
    ebitda24M: null,
    netIncome24M: null,
    fcf24M: null,
    logistics: null,
    surety: null,
    suspendedTaxes: null,
    restrictedCash: null,
    optional475KnownCapex: S04_OPTIONAL_475_KNOWN_CAPEX,
    note,
  };
}

function economicSnapshot(selection: ScenarioSelection): EconomicSnapshot {
  if (selection.acquisition !== "PURCHASE") {
    return pendingEconomics(
      "PENDING_LEASING",
      "PENDING LEASING TERMS: asset eligibility, rate definition, deposit, term, payment, balloon, buyout, insurance, maintenance, replacement and prepayment are unresolved."
    );
  }

  if (selection.hydrocarbonBenefit === "ON") {
    return pendingEconomics(
      "PENDING_FORMAL_VALIDATION",
      "Hydrocarbon benefit is ON, but S04 grants no economic credit until formal validation."
    );
  }

  const isCoreConfiguration =
    selection.technical === "EWERT_LEAN" &&
    selection.customsMode === "TEMPORARY_ADMISSION" &&
    selection.customsValueFactor === 0.65 &&
    selection.suretyRate === 0.02 &&
    selection.guaranteeMode === "SURETY_BOND" &&
    selection.optional475 === "NO";

  if (!isCoreConfiguration) {
    return pendingEconomics(
      "PENDING_S04_RESOLUTION",
      selection.optional475 === "YES"
        ? "Optional 4¾ capability has known CAPEX USD 179,603, but incremental logistics/customs and the complete scenario economics are unresolved in the S04 handoff."
        : "This selector combination is valid in the S04 schema but no resolved economic snapshot is present in the current S05 machine handoff. S05 does not recalculate it."
    );
  }

  const row = S04_CORE_SCENARIOS.find(
    (candidate) =>
      candidate.front_configuration === selection.frontConfiguration &&
      candidate.dso === selection.dso
  );
  if (!row) return pendingEconomics("PENDING_S04_RESOLUTION", "No matching S04 core scenario snapshot.");
  return rowToEconomics(row);
}

function benchmark2F(dso: ScenarioSelection["dso"]): EconomicSnapshot {
  const row = S04_CORE_SCENARIOS.find(
    (candidate) => candidate.front_configuration === "STATIC_2F" && candidate.dso === dso
  );
  if (!row) throw new Error("MISSING_S04_2F_BENCHMARK");
  return rowToEconomics(row);
}

const CONCEPTUAL_BHA_COMPONENTS = [
  {
    name: "Crossovers",
    sourceStatus: "CONCEPTUAL_INCLUDED_NOT_SEPARATELY_PRICED" as const,
    note: "S01 BHA composition component. No separate AFE Rev0 line item was identified; quantity, price and asset_id are intentionally not invented."
  }
];

function projectedFronts(count: number): FrontView[] {
  return Array.from({ length: count }, (_, index) => ({
    front: index + 1,
    families: [
      {
        holeFamily: "12-1/4\"" as const,
        items: ["MWD/PWD/Gamma capacity", "PR2 8-1/4", "Motor 8 in", "Jar 7-3/4", "NMDC 8 in", "Stabilizer 12-1/8", "UBHO 8 in"],
        operatingNote: "MODEL DERIVED front architecture; not a supplier-quoted line-item allocation."
      },
      {
        holeFamily: "8-1/2\"" as const,
        items: ["MWD/PWD/Gamma capacity", "PR2 6-3/4", "Motor 6-3/4", "Jar 6-1/2", "NMDC 6-3/4", "Stabilizer 8-3/8", "UBHO 6-3/4"],
        operatingNote: "MODEL DERIVED front architecture; phases are capacity families and are not assumed simultaneous."
      }
    ]
  }));
}

function physicalView(selection: ScenarioSelection): FleetScenario["physical"] {
  if (selection.technical === "EWERT_LEAN") {
    if (selection.frontConfiguration === "STATIC_2F") {
      return {
        mode: "EWERT_LEAN_2F",
        sourceStatus: "AFE_BACKED",
        fronts: EWERT_LEAN_2F_FRONTS,
        pools: EWERT_LEAN_2F_POOLS,
        assetFamilies: EWERT_LEAN_2F_ASSET_FAMILIES,
        conceptualBhaComponents: CONCEPTUAL_BHA_COMPONENTS,
        rampMilestones: S04_RAMP_MILESTONES,
        note: "Supplier-backed 2F physical anchor. Commercial KIT quantity and physical capacity are intentionally separated."
      };
    }

    if (selection.frontConfiguration === "STATIC_3F") {
      return {
        mode: "PROJECTED",
        sourceStatus: "MODEL_DERIVED",
        fronts: projectedFronts(3),
        pools: EWERT_LEAN_2F_POOLS,
        assetFamilies: EWERT_LEAN_2F_ASSET_FAMILIES,
        conceptualBhaComponents: CONCEPTUAL_BHA_COMPONENTS,
        rampMilestones: S04_RAMP_MILESTONES,
        note: "3F is MODEL DERIVED and not a supplier quote. Asset drilldown remains the 2F AFE-backed anchor; no line-item 3F AFE is fabricated."
      };
    }

    return {
      mode: "PROJECTED",
      sourceStatus: "MODEL_DERIVED",
      fronts: [],
      pools: EWERT_LEAN_2F_POOLS,
      assetFamilies: EWERT_LEAN_2F_ASSET_FAMILIES,
      conceptualBhaComponents: CONCEPTUAL_BHA_COMPONENTS,
      rampMilestones: S04_RAMP_MILESTONES,
      note: "Ramp 3→10 is a management/model-derived capacity path. Detailed asset cards remain the 2F AFE-backed anchor."
    };
  }

  const fronts = selection.futureTechnicalFrontCount;
  const mainPerDiameter = fronts;
  const backupPerDiameter = selection.technical === "IDEAL" ? fronts : Math.ceil(fronts / 2);
  return {
    mode: "CONCEPTUAL",
    sourceStatus: "MODEL_DERIVED",
    fronts: [],
    pools: [],
    assetFamilies: [],
    conceptualBhaComponents: CONCEPTUAL_BHA_COMPONENTS,
    conceptualSummary: {
      fronts,
      mainPerDiameter,
      backupPerDiameter,
      totalPhysicalBhaPositions: (mainPerDiameter + backupPerDiameter) * 2,
    },
    rampMilestones: S04_RAMP_MILESTONES,
    note: `${selection.technical} is a conceptual physical sensitivity, not EWERT_LEAN and not a supplier quote. No economic result is calculated in S05.`
  };
}

function scenarioLabel(selection: ScenarioSelection) {
  if (selection.frontConfiguration === "STATIC_2F") return "2F STARTUP — EWERT AFE REV0";
  if (selection.frontConfiguration === "STATIC_3F") return "3F STARTUP — PROJECTED";
  return "RAMP 3→10 — MANAGEMENT VIEW";
}

function sourceBadge(selection: ScenarioSelection, economics: EconomicSnapshot): FleetScenario["sourceBadge"] {
  if (economics.status === "PENDING_LEASING") return "PENDING LEASING";
  if (economics.status !== "RESOLVED") return "PENDING VALIDATION";
  return selection.frontConfiguration === "STATIC_2F" ? "AFE BACKED" : "MODEL DERIVED";
}

export function buildFleetScenario(selectionInput: ScenarioSelection): FleetScenario {
  const selection = parseScenarioSelection(selectionInput);
  const economics = economicSnapshot(selection);
  const isDefaultFundingBridge =
    economics.status === "RESOLVED" &&
    selection.frontConfiguration === S04_DEFAULT_SELECTION.frontConfiguration &&
    selection.technical === S04_DEFAULT_SELECTION.technical &&
    selection.acquisition === S04_DEFAULT_SELECTION.acquisition &&
    selection.dso === S04_DEFAULT_SELECTION.dso &&
    selection.customsMode === S04_DEFAULT_SELECTION.customsMode &&
    selection.customsValueFactor === S04_DEFAULT_SELECTION.customsValueFactor &&
    selection.suretyRate === S04_DEFAULT_SELECTION.suretyRate &&
    selection.guaranteeMode === S04_DEFAULT_SELECTION.guaranteeMode &&
    selection.hydrocarbonBenefit === S04_DEFAULT_SELECTION.hydrocarbonBenefit &&
    selection.optional475 === S04_DEFAULT_SELECTION.optional475;

  return {
    selection,
    scenarioLabel: scenarioLabel(selection),
    sourceBadge: sourceBadge(selection, economics),
    benchmark2F: benchmark2F(selection.dso),
    economics,
    physical: physicalView(selection),
    fundingBridge: isDefaultFundingBridge ? S04_DEFAULT_FUNDING_BRIDGE.map((item) => ({ ...item })) : [],
    assumptions: [
      { label: "Customs Mode", value: selection.customsMode, status: selection.customsMode === "TEMPORARY_ADMISSION" ? "EWERT PRACTICE / PENDING CUSTOMS VALIDATION" : "STRESS / PENDING S04 RESOLUTION" },
      { label: "Customs Value Factor", value: selection.customsValueFactor === "CUSTOM" ? "CUSTOM" : `${Number(selection.customsValueFactor) * 100}%`, status: selection.customsValueFactor === 0.65 ? "EWERT PRACTICE / PENDING CUSTOMS VALIDATION" : "SCHEMA VALID / UNRESOLVED ECONOMICS" },
      { label: "Surety", value: selection.suretyRate === "CUSTOM" ? "CUSTOM" : `${Number(selection.suretyRate) * 100}%`, status: selection.suretyRate === 0.02 ? "P50" : "SENSITIVITY" },
      { label: "Guarantee", value: selection.guaranteeMode, status: selection.guaranteeMode === "SURETY_BOND" ? "BASE" : "STRESS / CUSTOM" },
      { label: "Hydrocarbon Benefit", value: selection.hydrocarbonBenefit, status: selection.hydrocarbonBenefit === "OFF" ? "NO ECONOMIC CREDIT" : "PENDING FORMAL VALIDATION" },
      { label: "Optional 4¾", value: selection.optional475, status: selection.optional475 === "NO" ? "OFF / BASE" : "OPTIONAL CAPABILITY · USD 179,603 KNOWN CAPEX · LOGISTICS/CUSTOMS PENDING" },
      { label: "Leasing", value: selection.acquisition, status: selection.acquisition === "PURCHASE" ? "PURCHASE RESOLVED" : "PENDING LEASING TERMS" },
      { label: "Austral Asset Credit", value: "USD 0 confirmed", status: "0 CONFIRMED BY CURRENT EVIDENCE — NOT ZERO ASSETS OWNED" },
      { label: "LIH", value: S04_LIH_BASIS, status: "USD 78,000 desfase without event · zero liquidity effect absent event" },
      { label: "Service contract preparation", value: "30–60 days", status: "MANAGEMENT TIMING ASSUMPTION / NOT EWERT CONTRACTUAL TERMS" },
      { label: "Spares", value: "AFE startup spares included", status: "USD 55k/well recurring OPEX preserved · replenishment reconciliation pending" },
    ],
    reconciliation: {
      computationalUiReconciliation: economics.status === "RESOLVED" ? "PASS" : "PENDING",
      physicalSource: selection.technical === "EWERT_LEAN" ? "S01_S02" : "CONCEPTUAL",
      economicsSource: "S04_HANDOFF",
      noIndependentEconomicFormula: true,
      noKitDoubleCount: true,
      lihBasis: "NBV",
      optional475DefaultOff: true,
      grossFundingNotEquity: true,
      australCreditLabelSafe: true,
      note: economics.status === "RESOLVED"
        ? "Selected economics are an exact S04 Rev1 machine-handoff lookup."
        : "Selector is accepted, but S05 intentionally withholds unresolved economics instead of calculating a second model."
    },
    canonicalRefs: [
      "S01 — DDS Equipment Architecture v2.1 / EWERT AFE REV0 RECONCILED",
      "S02 — AFE normalized / Asset Register / 2F Base",
      "S04 — DDS Scenario Engine Rev1 S05 Machine Handoff CANDIDATE 2026-10-03",
    ],
  };
}

export function defaultScenarioSelection(): ScenarioSelection {
  return { ...S04_DEFAULT_SELECTION };
}
