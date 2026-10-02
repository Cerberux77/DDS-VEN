export const FRONT_OPTIONS = [1,2,3,4,5,6,7,8,9,10] as const;
export type FrontCount = (typeof FRONT_OPTIONS)[number];

export const TECHNICAL_OPTIONS = ["IDEAL", "OPTIMIZED"] as const;
export type TechnicalConfiguration = (typeof TECHNICAL_OPTIONS)[number];

export const ACQUISITION_OPTIONS = [
  "PURCHASE",
  "HYBRID_LEASE_18M",
  "HYBRID_LEASE_24M",
] as const;
export type AcquisitionStrategy = (typeof ACQUISITION_OPTIONS)[number];

export type Diameter = "12 1/4\"" | "8 1/2\"";
export type AssetRole = "MAIN" | "BACKUP";
export type AcquisitionState = "OWNED" | "LEASED" | "UNASSIGNED";

export type ScenarioSelection = {
  fronts: FrontCount;
  technical: TechnicalConfiguration;
  acquisition: AcquisitionStrategy;
};

export type BHAComponent = {
  name: string;
  relationship: string;
  status: "DEFINED" | "PENDING_AFE";
};

export type FleetAsset = {
  assetId: string;
  diameter: Diameter;
  role: AssetRole;
  assignment: string;
  coversFronts: number[];
  owner: string;
  acquisitionState: AcquisitionState;
  capexValue: number | null;
  leaseState: string;
  status: "PLANNED";
  location: string;
  availability: string;
  composition: BHAComponent[];
};

export type MoneyMetric = {
  value: number | null;
  currency: "USD";
  state: "RESOLVED" | "PENDING_AFE" | "PENDING_S03";
  note: string;
};

export type ScenarioFinancials = {
  totalSets: number;
  ownedSets: number | null;
  leasedSets: number | null;
  equipmentCapex: MoneyMetric;
  upfrontCash: MoneyMetric;
  peakFunding: MoneyMetric;
  leaseCost: MoneyMetric;
  financialImpact24M: MoneyMetric;
  leaseTermMonths: 0 | 18 | 24;
  costOfCapitalPct: number | null;
  costOfCapitalBasis: string;
};

export type ScenarioCounts = {
  mainPerDiameter: number;
  backupPerDiameter: number;
  totalPerDiameter: number;
  totalSets: number;
};

export type ScenarioReconciliation = {
  requiredSets: number;
  allocatedAssets: number;
  setCountMatches: boolean;
  backupCoverageValid: boolean;
  acquisitionBalanceValid: boolean | null;
  economicsReconciled: boolean;
  note: string;
};

export type FleetScenario = {
  scenarioKey: string;
  selection: ScenarioSelection;
  counts: ScenarioCounts;
  assets: FleetAsset[];
  financials: ScenarioFinancials;
  assumptions: string[];
  reconciliation: ScenarioReconciliation;
  canonicalRefs: string[];
};
