import type {
  ConceptualBhaComponent,
  EconomicSnapshot,
  FleetScenario,
  FrontView,
  FundingBridgeItem,
  ScenarioSelection,
  CashRampRow,
} from "./scenario-types";
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
} from "./scenario-types";
import {
  EWERT_LEAN_3F_ASSET_FAMILIES,
  EWERT_LEAN_3F_FRONTS,
  EWERT_LEAN_3F_POOLS,
} from "./ewert-lean-3f-data";

const REQUIRED_3F_AFE = 9_410_762;
const AUSTRAL_IN_KIND = 5_988_435;
const PANTHERS_AFE_CASH = 3_422_327;
const INFRASTRUCTURE = 859_000;
const VEHICLES = 180_000;
const FORKLIFT = 40_000;
const LOGISTICS = 218_748.37941551342;
const SURETY = 120_304.626;
const IMPORT_SURETY_TOTAL = LOGISTICS + SURETY;
const PREOP_OPEX = 310_712.5;
const PANTHERS_CASH_BEFORE_WC =
  PANTHERS_AFE_CASH + INFRASTRUCTURE + VEHICLES + FORKLIFT + IMPORT_SURETY_TOTAL + PREOP_OPEX;

const OPTIONAL_475 = 179_603;
const LIQUIDITY_FLOOR = 160_196.875;
const BASE_INTERMEDIATE_FT = 1_800;
const BASE_LATERAL_FT = 4_400;
const RATE_1225 = 54.16;
const RATE_0850 = 56.44;
const BASE_FULL_REVENUE = 600_000;
const FIXED_SERVICE_REVENUE =
  BASE_FULL_REVENUE - BASE_INTERMEDIATE_FT * RATE_1225 - BASE_LATERAL_FT * RATE_0850;
const RES_1225_USD_PER_FT = (6_000 * 4.242857142857143) / BASE_INTERMEDIATE_FT;

const VARIABLE_OPEX_PER_WELL = 116_648.00086625;
const FIXED_2F = 140_793.6728175;
const FIXED_3F = 143_356.25;
const DA_2F = 97_121.9333333333;
const DA_3F = 150_758.43333333332;
const TAX_RATE = 0.34;
const WITHHOLDING = 0.02;
const WELLS_PER_FRONT = 0.5;
const OPERATIONS_START = 4;

const INITIAL_IMPORT = 235_697.95348589664;
const LATE_IMPORT = 103_355.05192961676;

const INFRA: Record<number, number> = { 1: 251_100, 2: 317_500, 3: 290_400 };
const WORKSHOP: Record<number, number> = { 1: 243_902, 2: 146_341.2, 3: 97_560.8 };
const VEHICLE: Record<number, number> = { 2: 90_000, 3: 45_000, 4: 45_000 };
const FORKLIFT_SCHEDULE: Record<number, number> = { 2: 20_000, 3: 20_000 };
const OFFICE_IT: Record<number, number> = { 2: 45_409.2, 3: 68_113.8 };
const PREOP: Record<number, number> = {
  0: PREOP_OPEX * 0.15,
  1: PREOP_OPEX * 0.25,
  2: PREOP_OPEX * 0.30,
  3: PREOP_OPEX * 0.30,
};
const IMPORT_SCHEDULE: Record<number, number> = {
  2: INITIAL_IMPORT * 0.25,
  3: INITIAL_IMPORT * 0.75,
  6: LATE_IMPORT,
};
const PR2_SCHEDULE: Record<number, number> = {
  0: 1_240_750,
  6: 1_240_750 + 339_500,
};

const CONCEPTUAL_BHA_COMPONENTS: ConceptualBhaComponent[] = [
  {
    name: "Crossovers",
    sourceStatus: "CONCEPTUAL_INCLUDED_NOT_SEPARATELY_PRICED",
    note:
      "S01 component. No separate supplier line item is priced; quantity, price and asset_id are intentionally not invented.",
  },
];

function included<T extends readonly unknown[]>(values: T, value: unknown): value is T[number] {
  return values.includes(value as never);
}

function asFeet(value: unknown, fallback: number, min: number, max: number) {
  const parsed = Number(value ?? fallback);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) throw new Error("INVALID_SECTION_LENGTH");
  return Math.round(parsed / 100) * 100;
}

export function parseScenarioSelection(value: unknown): ScenarioSelection {
  if (!value || typeof value !== "object") throw new Error("INVALID_SCENARIO_SELECTION");
  const input = value as Record<string, unknown>;
  const frontCount = Number(input.futureTechnicalFrontCount ?? 3);

  if (
    !included(FRONT_CONFIGURATION_OPTIONS, input.frontConfiguration) ||
    !included(TECHNICAL_OPTIONS, input.technical) ||
    !included(ACQUISITION_OPTIONS, input.acquisition) ||
    !included(DSO_OPTIONS, Number(input.dso)) ||
    !included(CUSTOMS_MODE_OPTIONS, input.customsMode) ||
    !included(CUSTOMS_VALUE_FACTOR_OPTIONS, input.customsValueFactor) ||
    !included(SURETY_RATE_OPTIONS, input.suretyRate) ||
    !included(GUARANTEE_MODE_OPTIONS, input.guaranteeMode) ||
    !included(HYDROCARBON_BENEFIT_OPTIONS, input.hydrocarbonBenefit) ||
    !included(OPTIONAL_475_OPTIONS, input.optional475) ||
    !Number.isInteger(frontCount) ||
    frontCount < 1 ||
    frontCount > 10
  ) {
    throw new Error("INVALID_SCENARIO_SELECTION");
  }

  return {
    frontConfiguration: input.frontConfiguration,
    technical: input.technical,
    acquisition: input.acquisition,
    dso: Number(input.dso) as ScenarioSelection["dso"],
    customsMode: input.customsMode,
    customsValueFactor: input.customsValueFactor,
    suretyRate: input.suretyRate,
    guaranteeMode: input.guaranteeMode,
    hydrocarbonBenefit: input.hydrocarbonBenefit,
    optional475: input.optional475,
    futureTechnicalFrontCount: frontCount,
    intermediateFt: asFeet(input.intermediateFt, BASE_INTERMEDIATE_FT, 1_200, 5_500),
    lateralFt: asFeet(input.lateralFt, BASE_LATERAL_FT, 3_000, 6_500),
  } as ScenarioSelection;
}

export function defaultScenarioSelection(): ScenarioSelection {
  return {
    frontConfiguration: "STARTUP_3F_CAPABLE_2F_ACTIVE",
    technical: "EWERT_LEAN",
    acquisition: "PURCHASE",
    dso: 90,
    customsMode: "TEMPORARY_ADMISSION",
    customsValueFactor: 0.65,
    suretyRate: 0.02,
    guaranteeMode: "SURETY_BOND",
    hydrocarbonBenefit: "OFF",
    optional475: "NO",
    futureTechnicalFrontCount: 3,
    intermediateFt: BASE_INTERMEDIATE_FT,
    lateralFt: BASE_LATERAL_FT,
  };
}

function frontCountForMonth(selection: ScenarioSelection, month: number) {
  if (month < OPERATIONS_START) return 0;
  if (selection.frontConfiguration === "STARTUP_3F_CAPABLE_3F_M7") return month >= 7 ? 3 : 2;
  if (selection.frontConfiguration === "STATIC_3F") return 3;
  return 2;
}

function fullRevenuePerWell(selection: ScenarioSelection) {
  const intermediate = selection.intermediateFt ?? BASE_INTERMEDIATE_FT;
  const lateral = selection.lateralFt ?? BASE_LATERAL_FT;
  return FIXED_SERVICE_REVENUE + intermediate * RATE_1225 + lateral * RATE_0850;
}

function bridgeRevenuePerWell(selection: ScenarioSelection) {
  const intermediate = selection.intermediateFt ?? BASE_INTERMEDIATE_FT;
  return fullRevenuePerWell(selection) - intermediate * RES_1225_USD_PER_FT;
}

function scheduledCash(month: number) {
  return (
    (INFRA[month] ?? 0) +
    (WORKSHOP[month] ?? 0) +
    (VEHICLE[month] ?? 0) +
    (FORKLIFT_SCHEDULE[month] ?? 0) +
    (OFFICE_IT[month] ?? 0) +
    (PREOP[month] ?? 0) +
    (IMPORT_SCHEDULE[month] ?? 0) +
    (PR2_SCHEDULE[month] ?? 0)
  );
}

function collections(revenue: number[], month: number, dso: 45 | 60 | 90) {
  const at = (index: number) => (index >= 0 ? revenue[index] ?? 0 : 0);
  if (dso === 45) return 0.5 * at(month - 1) + 0.5 * at(month - 2);
  if (dso === 60) return at(month - 2);
  return at(month - 3);
}

function resolveCashModel(selection: ScenarioSelection) {
  const rows: CashRampRow[] = [];
  const revenues: number[] = [];
  let cumulativeCash = 0;
  let cumulativeInvoice = 0;
  let cumulativeCollection = 0;

  let revenue24M = 0;
  let ebitda24M = 0;
  let ebit24M = 0;
  let netIncome24M = 0;

  for (let month = 0; month <= 24; month += 1) {
    const activeFronts = frontCountForMonth(selection, month);
    const wells = activeFronts * WELLS_PER_FRONT;
    const full = fullRevenuePerWell(selection);
    const bridge = bridgeRevenuePerWell(selection);
    const revenue = activeFronts === 0 ? 0 : wells * (month <= 6 ? bridge : full);
    revenues.push(revenue);

    const grossCollection = collections(revenues, month, selection.dso);
    const netCollection = grossCollection * (1 - WITHHOLDING);
    cumulativeInvoice += revenue;
    cumulativeCollection += grossCollection;
    const accountsReceivable = Math.max(0, cumulativeInvoice - cumulativeCollection);

    const fixed = activeFronts === 3 ? FIXED_3F : activeFronts === 2 ? FIXED_2F : 0;
    const da = activeFronts === 3 ? DA_3F : activeFronts === 2 ? DA_2F : 0;
    const variable = wells * VARIABLE_OPEX_PER_WELL;
    const ebitda = revenue - variable - fixed;
    const ebit = ebitda - da;
    const taxAccrual = Math.max(0, ebit * TAX_RATE);
    const cashTax = Math.max(0, taxAccrual - grossCollection * WITHHOLDING);
    const operatingCashOut = variable + fixed + cashTax;
    const capexAndPreop = scheduledCash(month);
    const netCashFlow = netCollection - operatingCashOut - capexAndPreop;
    cumulativeCash += netCashFlow;
    const rawFundingRequired = Math.max(0, -cumulativeCash);
    const liquidFundingRequired = rawFundingRequired + (rawFundingRequired > 0 ? LIQUIDITY_FLOOR : 0);

    if (month >= 1) {
      revenue24M += revenue;
      ebitda24M += ebitda;
      ebit24M += ebit;
      netIncome24M += ebit - taxAccrual;
    }

    rows.push({
      month,
      activeFronts,
      wells,
      revenue,
      grossCollection,
      netCollection,
      accountsReceivable,
      scheduledCash,
      operatingCashOut,
      netCashFlow,
      cumulativeCash,
      rawFundingRequired,
      liquidFundingRequired,
    });
  }

  const peakRaw = Math.max(...rows.map((row) => row.rawFundingRequired));
  const peakLiquid = Math.max(...rows.map((row) => row.liquidFundingRequired));
  const peakAR = Math.max(...rows.map((row) => row.accountsReceivable));
  const preop = rows.find((row) => row.month === 3)?.rawFundingRequired ?? 0;
  const m0m4 = Math.max(...rows.filter((row) => row.month <= 4).map((row) => row.rawFundingRequired));
  const year1 = Math.max(...rows.filter((row) => row.month <= 12).map((row) => row.rawFundingRequired));

  return {
    rows,
    peakRaw,
    peakLiquid,
    peakAR,
    preop,
    m0m4,
    year1,
    revenue24M,
    ebitda24M,
    ebit24M,
    netIncome24M,
    fcf24M: rows.at(-1)?.cumulativeCash ?? 0,
    fullRevenuePerWell: fullRevenuePerWell(selection),
    bridgeRevenuePerWell: bridgeRevenuePerWell(selection),
  };
}

function pendingEconomics(
  status: EconomicSnapshot["status"],
  note: string
): EconomicSnapshot {
  return {
    scenarioId: null,
    status,
    sourceStatus: status,
    equipmentCapex: null,
    purchaseStartupP50: null,
    preopCash: null,
    m0M4CashRequirement: null,
    year1Funding: null,
    grossPeakFunding: null,
    confirmedAustralContribution: AUSTRAL_IN_KIND,
    netPeakFunding: null,
    liquidityFloor: LIQUIDITY_FLOOR,
    targetFundingCapacity: null,
    peakAR: null,
    revenue24M: null,
    ebitda24M: null,
    netIncome24M: null,
    fcf24M: null,
    logistics: LOGISTICS,
    surety: SURETY,
    suspendedTaxes: 1_311_320.4234,
    restrictedCash: 0,
    optional475KnownCapex: OPTIONAL_475,
    panthersCashBeforeWorkingCapital: PANTHERS_CASH_BEFORE_WC,
    bridgeRevenuePerWell: null,
    fullRevenuePerWell: null,
    note,
  };
}

function resolvedEconomics(selection: ScenarioSelection, model: ReturnType<typeof resolveCashModel>): EconomicSnapshot {
  return {
    scenarioId: `REV2|${selection.frontConfiguration}|DSO${selection.dso}|I${selection.intermediateFt}|L${selection.lateralFt}`,
    status: "RESOLVED",
    sourceStatus:
      selection.frontConfiguration === "STARTUP_3F_CAPABLE_2F_ACTIVE"
        ? "AFE_BACKED | PARTNER_CONTRIBUTION_BACKED | MANAGEMENT_TIMING_ASSUMPTION"
        : "AFE_BACKED_CAPACITY | MODEL_DERIVED_ACTIVITY | MANAGEMENT_TIMING_ASSUMPTION",
    equipmentCapex: REQUIRED_3F_AFE,
    purchaseStartupP50: PANTHERS_CASH_BEFORE_WC,
    preopCash: model.preop,
    m0M4CashRequirement: model.m0m4,
    year1Funding: model.year1,
    grossPeakFunding: model.peakRaw,
    confirmedAustralContribution: AUSTRAL_IN_KIND,
    netPeakFunding: model.peakRaw,
    liquidityFloor: LIQUIDITY_FLOOR,
    targetFundingCapacity: model.peakLiquid,
    peakAR: model.peakAR,
    revenue24M: model.revenue24M,
    ebitda24M: model.ebitda24M,
    netIncome24M: model.netIncome24M,
    fcf24M: model.fcf24M,
    logistics: LOGISTICS,
    surety: SURETY,
    suspendedTaxes: 1_311_320.4234,
    restrictedCash: 0,
    optional475KnownCapex: OPTIONAL_475,
    panthersCashBeforeWorkingCapital: PANTHERS_CASH_BEFORE_WC,
    bridgeRevenuePerWell: model.bridgeRevenuePerWell,
    fullRevenuePerWell: model.fullRevenuePerWell,
    note:
      "Rev2 cash-liquidity model. Austral/Ewert in-kind assets are excluded from Panthers purchase cash; PR2 8¼ is 50% M0 / 50% M6, with peripherals/import in M6.",
  };
}

function projectedFronts(count: number): FrontView[] {
  return Array.from({ length: count }, (_, index) => ({
    front: index + 1,
    families: [
      {
        holeFamily: '12-1/4"' as const,
        items: ["Shared MWD/PWD/Gamma core", "8¼ diameter package", "PR2 8¼ from M7"],
        operatingNote: "Conceptual future-front capacity; economics unresolved beyond the supplier-backed 3F package.",
      },
      {
        holeFamily: '8-1/2"' as const,
        items: ["Shared MWD/PWD/Gamma core", "6¾ diameter package", "PR2 6¾"],
        operatingNote: "Conceptual future-front capacity; economics unresolved beyond the supplier-backed 3F package.",
      },
    ],
  }));
}

function fundingBridge(model: ReturnType<typeof resolveCashModel>): FundingBridgeItem[] {
  const cashGap = Math.max(0, model.peakRaw - PANTHERS_CASH_BEFORE_WC);
  return [
    { order: 1, component: "3F Required Base AFE", amount: REQUIRED_3F_AFE, treatment: "Economic asset value; not Panthers cash requirement" },
    { order: 2, component: "Austral/Ewert in-kind contribution", amount: -AUSTRAL_IN_KIND, treatment: "Technical fleet contribution including PR2 6¾; excluded from purchase cash" },
    { order: 3, component: "Panthers AFE cash purchases", amount: PANTHERS_AFE_CASH, treatment: "PR2 8¼ + peripherals + workshop + operation office/IT" },
    { order: 4, component: "Infrastructure", amount: INFRASTRUCTURE, treatment: "60m × 40m base, slab/yard, crane, power/generation, office fit-out" },
    { order: 5, component: "Vehicles + forklift", amount: VEHICLES + FORKLIFT, treatment: "4 pickups ramp M2–M4 + 5t forklift" },
    { order: 6, component: "Import / logistics / surety", amount: IMPORT_SURETY_TOTAL, treatment: "All tools; P50 derived from 2F logistics scaling and 2% surety" },
    { order: 7, component: "Pre-op OPEX", amount: PREOP_OPEX, treatment: "M0–M3" },
    { order: 8, component: "Operating / collections gap to peak", amount: cashGap, treatment: "DSO-dependent working-capital and operating timing effect" },
    { order: 9, component: "PEAK LIQUID FUNDING", amount: model.peakRaw, treatment: "Panthers cash requirement before liquidity floor; not total asset value" },
    { order: 10, component: "Liquidity Floor", amount: LIQUIDITY_FLOOR, treatment: "Preserved management liquidity floor" },
    { order: 11, component: "TARGET LIQUID CAPACITY", amount: model.peakLiquid, treatment: "Peak liquid funding + liquidity floor" },
  ];
}

export function buildFleetScenario(selectionInput: ScenarioSelection): FleetScenario {
  const selection = parseScenarioSelection(selectionInput);
  const unresolvedCore =
    selection.technical !== "EWERT_LEAN" ||
    selection.customsMode !== "TEMPORARY_ADMISSION" ||
    selection.customsValueFactor !== 0.65 ||
    selection.suretyRate !== 0.02 ||
    selection.guaranteeMode !== "SURETY_BOND" ||
    selection.optional475 !== "NO";

  let economics: EconomicSnapshot;
  let model: ReturnType<typeof resolveCashModel> | null = null;

  if (selection.acquisition !== "PURCHASE") {
    economics = pendingEconomics("PENDING_LEASING", "Leasing terms remain unresolved; no payment, rate, deposit, balloon or buyout is fabricated.");
  } else if (selection.hydrocarbonBenefit === "ON") {
    economics = pendingEconomics("PENDING_FORMAL_VALIDATION", "Hydrocarbon benefit requires formal validation before economic credit.");
  } else if (selection.frontConfiguration === "RAMP_3_TO_10") {
    economics = pendingEconomics("PENDING_S04_RESOLUTION", "Rev1 3→10 funding is superseded for management presentation. Growth beyond supplier-backed 3F must be rebuilt using partner-contribution scaling.");
  } else if (unresolvedCore) {
    economics = pendingEconomics("PENDING_S04_RESOLUTION", "This selector combination has no approved Rev2 economic resolution.");
  } else {
    model = resolveCashModel(selection);
    economics = resolvedEconomics(selection, model);
  }

  const supplierBacked =
    selection.technical === "EWERT_LEAN" && selection.frontConfiguration !== "RAMP_3_TO_10";
  const physical = supplierBacked
    ? {
        mode: "EWERT_LEAN_3F" as const,
        sourceStatus: "AFE_BACKED" as const,
        fronts: EWERT_LEAN_3F_FRONTS,
        pools: EWERT_LEAN_3F_POOLS,
        assetFamilies: EWERT_LEAN_3F_ASSET_FAMILIES,
        conceptualBhaComponents: CONCEPTUAL_BHA_COMPONENTS,
        rampMilestones: [],
        note:
          selection.frontConfiguration === "STARTUP_3F_CAPABLE_2F_ACTIVE"
            ? "Supplier-backed 3F-capable fleet. Fronts 1–2 are active; Front 3 is opportunity/standby. Shared directional core is reused between 12¼ and 8½ phases; diameter-specific packages remain distinct."
            : "Supplier-backed 3F-capable fleet. Revenue activation varies by scenario; physical asset base is the Ewert 3 Jobs Rev0 AFE.",
      }
    : {
        mode: "PROJECTED" as const,
        sourceStatus: "MODEL_DERIVED" as const,
        fronts: projectedFronts(selection.futureTechnicalFrontCount),
        pools: [],
        assetFamilies: [],
        conceptualBhaComponents: CONCEPTUAL_BHA_COMPONENTS,
        rampMilestones: [],
        note: "Conceptual future-front view only. Rev2 economics beyond 3F are intentionally unresolved.",
      };

  const benchmarkSelection = { ...selection, frontConfiguration: "STARTUP_3F_CAPABLE_2F_ACTIVE" as const };
  const benchmarkModel = resolveCashModel(benchmarkSelection);
  const benchmark = resolvedEconomics(benchmarkSelection, benchmarkModel);

  return {
    selection,
    scenarioLabel:
      selection.frontConfiguration === "STARTUP_3F_CAPABLE_2F_ACTIVE"
        ? "3F CAPABLE / 2F ACTIVE — BRIDGE STARTUP"
        : selection.frontConfiguration === "STARTUP_3F_CAPABLE_3F_M7"
        ? "3F CAPABLE / FRONT 3 ACTIVE M7"
        : selection.frontConfiguration === "STATIC_3F"
        ? "3F ACTIVE FROM OPERATIONS START"
        : selection.frontConfiguration === "STATIC_2F"
        ? "2F ACTIVE / 3F CAPABLE — LEGACY ALIAS"
        : "GROWTH >3F — REBASE REQUIRED",
    sourceBadge: economics.status === "RESOLVED" ? "AFE BACKED" : economics.status === "PENDING_LEASING" ? "PENDING LEASING" : "PENDING VALIDATION",
    benchmark2F: benchmark,
    economics,
    physical,
    fundingBridge: model ? fundingBridge(model) : [],
    cashRamp: model ? model.rows.slice(0, 13) : [],
    assumptions: [
      { label: "Installed capacity", value: "3F capable", status: "EWERT 3 JOBS AFE REV0" },
      { label: "Active startup fronts", value: selection.frontConfiguration === "STATIC_3F" ? "3" : "2", status: "MANAGEMENT SCENARIO" },
      { label: "Intermediate 12¼", value: `${selection.intermediateFt} ft`, status: "USER-ADJUSTABLE" },
      { label: "Lateral 8½", value: `${selection.lateralFt} ft`, status: "USER-ADJUSTABLE" },
      { label: "PR2 8¼ PO", value: "50% M0 / 50% M6", status: "PANTHERS CASH" },
      { label: "PR2 6¾", value: "Austral/Ewert contribution", status: "IN-KIND / AVAILABLE FOR STARTUP" },
      { label: "Bridge service M4–M6", value: "12¼ without RES / 8½ with RES", status: "COMMERCIAL BRIDGE" },
      { label: "Full resistivity revenue", value: "M7+", status: "PR2 8¼ ARRIVAL / COMMISSIONING" },
      { label: "Warehouse", value: "60m × 40m", status: "3-MONTH CONSTRUCTION RAMP" },
      { label: "Chuto + batea", value: "rental OPEX", status: "2 ACT/WELL CONTRACT REFERENCE" },
      { label: "LIH", value: "NBV", status: "PROJECT CANONICAL — UNCHANGED" },
      { label: "Customs", value: "Temporary Admission / 65% factor / 2% surety", status: "PENDING CUSTOMS VALIDATION" },
    ],
    reconciliation: {
      computationalUiReconciliation: economics.status === "RESOLVED" ? "PASS" : "PENDING",
      physicalSource: supplierBacked ? "S01_S02" : "CONCEPTUAL",
      economicsSource: "S04_REV2_ENGINE",
      noIndependentEconomicFormula: true,
      noKitDoubleCount: true,
      lihBasis: "NBV",
      optional475DefaultOff: true,
      grossFundingNotEquity: true,
      australCreditLabelSafe: true,
      note:
        economics.status === "RESOLVED"
          ? "Rev2 canonical server-side cash engine. Browser remains presentation-only."
          : "Unresolved scenario intentionally returns a controlled pending state.",
    },
    canonicalRefs: [
      "Ewert — DDS Equipment_ 3 Jobs_Rev0.xlsx",
      "Meeting 2026-10-02 — 3F-capable / 2F-active bridge, PR2 timing, base infrastructure",
      "DDS Venezuela Rev2 Cash Ramp — CANDIDATE 2026-10-03",
      "S06 governance G12 — 3F AFE normalization / reconciliation",
    ],
  };
}
