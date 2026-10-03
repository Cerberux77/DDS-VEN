export const FRONT_CONFIGURATION_OPTIONS = ["STARTUP_3F_CAPABLE_2F_ACTIVE", "STARTUP_3F_CAPABLE_3F_M7", "STATIC_2F", "STATIC_3F", "RAMP_3_TO_10"] as const;
export type FrontConfiguration = (typeof FRONT_CONFIGURATION_OPTIONS)[number];

export const TECHNICAL_OPTIONS = ["EWERT_LEAN", "IDEAL", "OPTIMIZED"] as const;
export type TechnicalConfiguration = (typeof TECHNICAL_OPTIONS)[number];

export const ACQUISITION_OPTIONS = ["PURCHASE", "HYBRID_LEASE_18M", "HYBRID_LEASE_24M"] as const;
export type AcquisitionStrategy = (typeof ACQUISITION_OPTIONS)[number];

export const DSO_OPTIONS = [45, 60, 90] as const;
export type DsoDays = (typeof DSO_OPTIONS)[number];

export const CUSTOMS_MODE_OPTIONS = ["TEMPORARY_ADMISSION", "DEFINITIVE_IMPORT_STRESS"] as const;
export type CustomsMode = (typeof CUSTOMS_MODE_OPTIONS)[number];

export const CUSTOMS_VALUE_FACTOR_OPTIONS = [1, 0.8, 0.65, "CUSTOM"] as const;
export type CustomsValueFactor = (typeof CUSTOMS_VALUE_FACTOR_OPTIONS)[number];

export const SURETY_RATE_OPTIONS = [0.01, 0.02, 0.03, "CUSTOM"] as const;
export type SuretyRate = (typeof SURETY_RATE_OPTIONS)[number];

export const GUARANTEE_MODE_OPTIONS = ["SURETY_BOND", "CASH_COLLATERAL_STRESS", "CUSTOM"] as const;
export type GuaranteeMode = (typeof GUARANTEE_MODE_OPTIONS)[number];

export const HYDROCARBON_BENEFIT_OPTIONS = ["OFF", "ON"] as const;
export type HydrocarbonBenefit = (typeof HYDROCARBON_BENEFIT_OPTIONS)[number];

export const OPTIONAL_475_OPTIONS = ["NO", "YES"] as const;
export type Optional475 = (typeof OPTIONAL_475_OPTIONS)[number];

export type ScenarioSelection = {
  frontConfiguration: FrontConfiguration;
  technical: TechnicalConfiguration;
  acquisition: AcquisitionStrategy;
  dso: DsoDays;
  customsMode: CustomsMode;
  customsValueFactor: CustomsValueFactor;
  suretyRate: SuretyRate;
  guaranteeMode: GuaranteeMode;
  hydrocarbonBenefit: HydrocarbonBenefit;
  optional475: Optional475;
  futureTechnicalFrontCount: number;
  intermediateFt?: number;
  lateralFt?: number;
};

export type EconomicStatus =
  | "RESOLVED"
  | "PENDING_LEASING"
  | "PENDING_FORMAL_VALIDATION"
  | "PENDING_S04_RESOLUTION";

export type EconomicSnapshot = {
  scenarioId: string | null;
  status: EconomicStatus;
  sourceStatus: string;
  equipmentCapex: number | null;
  purchaseStartupP50: number | null;
  preopCash: number | null;
  m0M4CashRequirement: number | null;
  year1Funding: number | null;
  grossPeakFunding: number | null;
  confirmedAustralContribution: number;
  netPeakFunding: number | null;
  liquidityFloor: number | null;
  targetFundingCapacity: number | null;
  peakAR: number | null;
  revenue24M: number | null;
  ebitda24M: number | null;
  netIncome24M: number | null;
  fcf24M: number | null;
  logistics: number | null;
  surety: number | null;
  suspendedTaxes: number | null;
  restrictedCash: number | null;
  optional475KnownCapex: number;
  panthersCashBeforeWorkingCapital?: number | null;
  bridgeRevenuePerWell?: number | null;
  fullRevenuePerWell?: number | null;
  note: string;
};

export type FundingBridgeItem = {
  order: number;
  component: string;
  amount: number;
  treatment: string;
};

export type FleetAssetFamily = {
  assetId: string;
  family: string;
  description: string;
  holeFamily: string;
  commercialQuantity: number;
  commercialUnit: "KIT" | "UNIT" | "POOL";
  physicalQuantity: number | null;
  mainQuantity: number | null;
  backupQuantity: number | null;
  rotationQuantity: number | null;
  sharedQuantity: number | null;
  requiredOrOptional: "REQUIRED" | "OPTIONAL";
  purchaseValue: number;
  sourceStatus: "AFE_BACKED" | "MODEL_DERIVED";
  frontAssignment: string;
  temporaryAdmissionCandidate: boolean;
  leaseStatus: "PENDING_LEASING" | "N/A";
  notes: string[];
  cashTreatment?: "AUSTRAL_IN_KIND" | "PANTHERS_CASH" | "OPTIONAL";
};

export type FrontFamilyCapacity = {
  holeFamily: "12-1/4\"" | "8-1/2\"";
  items: string[];
  operatingNote: string;
};

export type FrontView = {
  front: number;
  families: FrontFamilyCapacity[];
};

export type PoolView = {
  title: string;
  items: string[];
};

export type RampMilestone = {
  month: number;
  fronts: number;
  sourceStatus: "MODEL_DERIVED";
};

export type ConceptualBhaComponent = {
  name: string;
  sourceStatus: "CONCEPTUAL_INCLUDED_NOT_SEPARATELY_PRICED";
  note: string;
};

export type PhysicalView = {
  mode: "EWERT_LEAN_2F" | "EWERT_LEAN_3F" | "PROJECTED" | "CONCEPTUAL";
  sourceStatus: "AFE_BACKED" | "MODEL_DERIVED";
  fronts: FrontView[];
  pools: PoolView[];
  assetFamilies: FleetAssetFamily[];
  conceptualBhaComponents: ConceptualBhaComponent[];
  conceptualSummary?: {
    fronts: number;
    mainPerDiameter: number;
    backupPerDiameter: number;
    totalPhysicalBhaPositions: number;
  };
  rampMilestones: RampMilestone[];
  note: string;
};

export type ScenarioReconciliation = {
  computationalUiReconciliation: "PASS" | "PENDING";
  physicalSource: "S01_S02" | "CONCEPTUAL";
  economicsSource: "S04_HANDOFF" | "S04_REV2_ENGINE";
  noIndependentEconomicFormula: true;
  noKitDoubleCount: boolean;
  lihBasis: "NBV";
  optional475DefaultOff: boolean;
  grossFundingNotEquity: true;
  australCreditLabelSafe: true;
  note: string;
};

export type CashRampRow = {
  month: number;
  activeFronts: number;
  wells: number;
  revenue: number;
  grossCollection: number;
  netCollection: number;
  accountsReceivable: number;
  scheduledCash: number;
  operatingCashOut: number;
  netCashFlow: number;
  cumulativeCash: number;
  rawFundingRequired: number;
  liquidFundingRequired: number;
};

export type FleetScenario = {
  selection: ScenarioSelection;
  scenarioLabel: string;
  sourceBadge: "AFE BACKED" | "MODEL DERIVED" | "PENDING LEASING" | "PENDING VALIDATION";
  benchmark2F: EconomicSnapshot;
  economics: EconomicSnapshot;
  physical: PhysicalView;
  fundingBridge: FundingBridgeItem[];
  cashRamp?: CashRampRow[];
  assumptions: Array<{ label: string; value: string; status: string }>;
  reconciliation: ScenarioReconciliation;
  canonicalRefs: string[];
};
