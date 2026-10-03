import type { FleetAssetFamily, FrontView, PoolView } from "./scenario-types";

export const EWERT_LEAN_2F_ASSET_FAMILIES: FleetAssetFamily[] = [
  {
    assetId: "AFE-R0-02-01", family: "MWD", description: "MWD System — Mud Pulse 175C",
    holeFamily: "PLATFORM / SHARED", commercialQuantity: 2, commercialUnit: "KIT", physicalQuantity: 4,
    mainQuantity: 2, backupQuantity: 2, rotationQuantity: 0, sharedQuantity: 0, requiredOrOptional: "REQUIRED",
    purchaseValue: 607240, sourceStatus: "AFE_BACKED", frontAssignment: "2 active fronts; KIT interpretation provides one main + one backup system per commercial KIT",
    temporaryAdmissionCandidate: true, leaseStatus: "PENDING_LEASING",
    notes: ["Commercial quantity is 2 KIT; physical capacity is 4 systems.", "Do not multiply KIT purchase value by physical systems."]
  },
  {
    assetId: "AFE-R0-02-02", family: "PWD", description: "PWD System for Mud Pulse 175C",
    holeFamily: "PLATFORM / SHARED", commercialQuantity: 2, commercialUnit: "KIT", physicalQuantity: 4,
    mainQuantity: 2, backupQuantity: 2, rotationQuantity: 0, sharedQuantity: 0, requiredOrOptional: "REQUIRED",
    purchaseValue: 103580, sourceStatus: "AFE_BACKED", frontAssignment: "2 active fronts; one main + one backup physical system per commercial KIT",
    temporaryAdmissionCandidate: true, leaseStatus: "PENDING_LEASING",
    notes: ["Commercial quantity is 2 KIT; physical capacity is 4 systems.", "Economic authority is purchase_total."]
  },
  {
    assetId: "AFE-R0-02-05", family: "GAMMA", description: "Gamma System for PP 175C",
    holeFamily: "PLATFORM / SHARED", commercialQuantity: 2, commercialUnit: "KIT", physicalQuantity: 4,
    mainQuantity: 2, backupQuantity: 2, rotationQuantity: 0, sharedQuantity: 0, requiredOrOptional: "REQUIRED",
    purchaseValue: 84000, sourceStatus: "AFE_BACKED", frontAssignment: "2 active fronts; one main + one backup physical system per commercial KIT",
    temporaryAdmissionCandidate: true, leaseStatus: "PENDING_LEASING",
    notes: ["Commercial quantity is 2 KIT; physical capacity is 4 systems."]
  },
  {
    assetId: "AFE-R0-02-06", family: "DEPTH_TRACKING", description: "DepthTracking System with sensor & cables",
    holeFamily: "PLATFORM / SHARED", commercialQuantity: 2, commercialUnit: "KIT", physicalQuantity: 4,
    mainQuantity: 2, backupQuantity: 2, rotationQuantity: 0, sharedQuantity: 0, requiredOrOptional: "REQUIRED",
    purchaseValue: 64200, sourceStatus: "AFE_BACKED", frontAssignment: "Dedicated active-front capacity; physical interpretation per S01/S02",
    temporaryAdmissionCandidate: true, leaseStatus: "PENDING_LEASING",
    notes: ["2 commercial KIT = 4 physical capacity units under the approved S01/S02 interpretation."]
  },
  {
    assetId: "AFE-R0-03-01", family: "PR2_RESISTIVITY", description: "PR2 LWD Mud Pulse 175C — 8-1/4 in OD",
    holeFamily: "12-1/4\" hole family", commercialQuantity: 3, commercialUnit: "UNIT", physicalQuantity: 3,
    mainQuantity: 2, backupQuantity: 1, rotationQuantity: 0, sharedQuantity: 1, requiredOrOptional: "REQUIRED",
    purchaseValue: 1488900, sourceStatus: "AFE_BACKED", frontAssignment: "2 active positions + 1 shared backup",
    temporaryAdmissionCandidate: true, leaseStatus: "PENDING_LEASING",
    notes: ["Shared backup covers both 2F active positions in this diameter family."]
  },
  {
    assetId: "AFE-R0-03-02", family: "PR2_RESISTIVITY", description: "PR2 LWD Mud Pulse 175C — 6-3/4 in OD",
    holeFamily: "8-1/2\" hole family", commercialQuantity: 3, commercialUnit: "UNIT", physicalQuantity: 3,
    mainQuantity: 2, backupQuantity: 1, rotationQuantity: 0, sharedQuantity: 1, requiredOrOptional: "REQUIRED",
    purchaseValue: 1314540, sourceStatus: "AFE_BACKED", frontAssignment: "2 active positions + 1 shared backup",
    temporaryAdmissionCandidate: true, leaseStatus: "PENDING_LEASING",
    notes: ["Shared backup covers both 2F active positions in this diameter family."]
  },
  {
    assetId: "AFE-R0-03-03", family: "PR2_SURFACE_SUPPORT", description: "Surface System Support Kit — PR2",
    holeFamily: "PLATFORM / SHARED", commercialQuantity: 2, commercialUnit: "UNIT", physicalQuantity: 2,
    mainQuantity: 2, backupQuantity: 0, rotationQuantity: 0, sharedQuantity: 0, requiredOrOptional: "REQUIRED",
    purchaseValue: 76800, sourceStatus: "AFE_BACKED", frontAssignment: "One per active front",
    temporaryAdmissionCandidate: true, leaseStatus: "PENDING_LEASING", notes: []
  },
  {
    assetId: "AFE-R0-03-06", family: "PR2_CARRIER", description: "8-1/4 in Collar Assembly Tool Carrier",
    holeFamily: "12-1/4\" hole family", commercialQuantity: 2, commercialUnit: "UNIT", physicalQuantity: 2,
    mainQuantity: 2, backupQuantity: 0, rotationQuantity: 0, sharedQuantity: 0, requiredOrOptional: "REQUIRED",
    purchaseValue: 43200, sourceStatus: "AFE_BACKED", frontAssignment: "One per active front within diameter family",
    temporaryAdmissionCandidate: true, leaseStatus: "PENDING_LEASING", notes: []
  },
  {
    assetId: "AFE-R0-03-07", family: "PR2_CARRIER", description: "6-3/4 in Collar Assembly Tool Carrier",
    holeFamily: "8-1/2\" hole family", commercialQuantity: 2, commercialUnit: "UNIT", physicalQuantity: 2,
    mainQuantity: 2, backupQuantity: 0, rotationQuantity: 0, sharedQuantity: 0, requiredOrOptional: "REQUIRED",
    purchaseValue: 37560, sourceStatus: "AFE_BACKED", frontAssignment: "One per active front within diameter family",
    temporaryAdmissionCandidate: true, leaseStatus: "PENDING_LEASING", notes: []
  },
  {
    assetId: "AFE-R0-06-01", family: "MUD_MOTOR", description: "Mud Motor 8 in — 7/8 4.0 STG with stabilizer",
    holeFamily: "12-1/4\" hole family", commercialQuantity: 5, commercialUnit: "UNIT", physicalQuantity: 5,
    mainQuantity: 2, backupQuantity: 0, rotationQuantity: 3, sharedQuantity: 0, requiredOrOptional: "REQUIRED",
    purchaseValue: 359350, sourceStatus: "AFE_BACKED", frontAssignment: "2 active mains + 3 maintenance/rotation pool",
    temporaryAdmissionCandidate: true, leaseStatus: "PENDING_LEASING", notes: []
  },
  {
    assetId: "AFE-R0-06-02", family: "MUD_MOTOR", description: "Mud Motor 6-3/4 in — 7/8 5.7 STG with stabilizer",
    holeFamily: "8-1/2\" hole family", commercialQuantity: 5, commercialUnit: "UNIT", physicalQuantity: 5,
    mainQuantity: 2, backupQuantity: 0, rotationQuantity: 3, sharedQuantity: 0, requiredOrOptional: "REQUIRED",
    purchaseValue: 321500, sourceStatus: "AFE_BACKED", frontAssignment: "2 active mains + 3 maintenance/rotation pool",
    temporaryAdmissionCandidate: true, leaseStatus: "PENDING_LEASING", notes: []
  },
  {
    assetId: "AFE-R0-06-04", family: "FLOAT_SUB", description: "Float Sub 8 in",
    holeFamily: "12-1/4\" hole family", commercialQuantity: 4, commercialUnit: "UNIT", physicalQuantity: 4,
    mainQuantity: 2, backupQuantity: null, rotationQuantity: null, sharedQuantity: null, requiredOrOptional: "REQUIRED",
    purchaseValue: 21600, sourceStatus: "AFE_BACKED", frontAssignment: "Diameter-specific main + backup pool",
    temporaryAdmissionCandidate: true, leaseStatus: "PENDING_LEASING", notes: ["AFE does not freeze an exact reserve split beyond active-front requirement and backup pool."]
  },
  {
    assetId: "AFE-R0-06-05", family: "FLOAT_SUB", description: "Float Sub 6-3/4 in",
    holeFamily: "8-1/2\" hole family", commercialQuantity: 4, commercialUnit: "UNIT", physicalQuantity: 4,
    mainQuantity: 2, backupQuantity: null, rotationQuantity: null, sharedQuantity: null, requiredOrOptional: "REQUIRED",
    purchaseValue: 18400, sourceStatus: "AFE_BACKED", frontAssignment: "Diameter-specific main + backup pool",
    temporaryAdmissionCandidate: true, leaseStatus: "PENDING_LEASING", notes: ["AFE does not freeze an exact reserve split beyond active-front requirement and backup pool."]
  },
  {
    assetId: "AFE-R0-08-01", family: "JAR", description: "Hydraulic Jar 7-3/4 in",
    holeFamily: "12-1/4\" hole family", commercialQuantity: 3, commercialUnit: "UNIT", physicalQuantity: 3,
    mainQuantity: 2, backupQuantity: 1, rotationQuantity: 0, sharedQuantity: 1, requiredOrOptional: "REQUIRED",
    purchaseValue: 125400, sourceStatus: "AFE_BACKED", frontAssignment: "2 active + shared backup",
    temporaryAdmissionCandidate: true, leaseStatus: "PENDING_LEASING", notes: ["Backup allocation is the approved S01/S02 physical interpretation."]
  },
  {
    assetId: "AFE-R0-08-02", family: "JAR", description: "Hydraulic Jar 6-1/2 in",
    holeFamily: "8-1/2\" hole family", commercialQuantity: 3, commercialUnit: "UNIT", physicalQuantity: 3,
    mainQuantity: 2, backupQuantity: 1, rotationQuantity: 0, sharedQuantity: 1, requiredOrOptional: "REQUIRED",
    purchaseValue: 94200, sourceStatus: "AFE_BACKED", frontAssignment: "2 active + shared backup",
    temporaryAdmissionCandidate: true, leaseStatus: "PENDING_LEASING", notes: ["Backup allocation is the approved S01/S02 physical interpretation."]
  },
  {
    assetId: "AFE-R0-10-01", family: "NMDC", description: "Non-Magnetic Drill Collar 8 in",
    holeFamily: "12-1/4\" hole family", commercialQuantity: 4, commercialUnit: "UNIT", physicalQuantity: 4,
    mainQuantity: 2, backupQuantity: null, rotationQuantity: null, sharedQuantity: null, requiredOrOptional: "REQUIRED",
    purchaseValue: 131200, sourceStatus: "AFE_BACKED", frontAssignment: "Diameter-specific main + reserve",
    temporaryAdmissionCandidate: true, leaseStatus: "PENDING_LEASING", notes: []
  },
  {
    assetId: "AFE-R0-10-02", family: "NMDC", description: "Non-Magnetic Drill Collar 6-3/4 in",
    holeFamily: "8-1/2\" hole family", commercialQuantity: 4, commercialUnit: "UNIT", physicalQuantity: 4,
    mainQuantity: 2, backupQuantity: null, rotationQuantity: null, sharedQuantity: null, requiredOrOptional: "REQUIRED",
    purchaseValue: 105600, sourceStatus: "AFE_BACKED", frontAssignment: "Diameter-specific main + reserve",
    temporaryAdmissionCandidate: true, leaseStatus: "PENDING_LEASING", notes: []
  },
  {
    assetId: "AFE-R0-10-03", family: "STABILIZER", description: "Integral Blade Spiral String Stabilizer 12-1/8 in",
    holeFamily: "12-1/4\" hole family", commercialQuantity: 4, commercialUnit: "UNIT", physicalQuantity: 4,
    mainQuantity: 2, backupQuantity: null, rotationQuantity: null, sharedQuantity: null, requiredOrOptional: "REQUIRED",
    purchaseValue: 96400, sourceStatus: "AFE_BACKED", frontAssignment: "Diameter-specific main + reserve",
    temporaryAdmissionCandidate: true, leaseStatus: "PENDING_LEASING", notes: []
  },
  {
    assetId: "AFE-R0-10-04", family: "STABILIZER", description: "Integral Blade Spiral String Stabilizer 8-3/8 in",
    holeFamily: "8-1/2\" hole family", commercialQuantity: 4, commercialUnit: "UNIT", physicalQuantity: 4,
    mainQuantity: 2, backupQuantity: null, rotationQuantity: null, sharedQuantity: null, requiredOrOptional: "REQUIRED",
    purchaseValue: 67200, sourceStatus: "AFE_BACKED", frontAssignment: "Diameter-specific main + reserve",
    temporaryAdmissionCandidate: true, leaseStatus: "PENDING_LEASING", notes: []
  },
  {
    assetId: "AFE-R0-10-05", family: "UBHO", description: "UBHO Sub 8 in",
    holeFamily: "12-1/4\" hole family", commercialQuantity: 4, commercialUnit: "UNIT", physicalQuantity: 4,
    mainQuantity: 2, backupQuantity: null, rotationQuantity: null, sharedQuantity: null, requiredOrOptional: "REQUIRED",
    purchaseValue: 13600, sourceStatus: "AFE_BACKED", frontAssignment: "Diameter-specific main + reserve",
    temporaryAdmissionCandidate: true, leaseStatus: "PENDING_LEASING", notes: []
  },
  {
    assetId: "AFE-R0-10-06", family: "UBHO", description: "UBHO Sub 6-3/4 in",
    holeFamily: "8-1/2\" hole family", commercialQuantity: 4, commercialUnit: "UNIT", physicalQuantity: 4,
    mainQuantity: 2, backupQuantity: null, rotationQuantity: null, sharedQuantity: null, requiredOrOptional: "REQUIRED",
    purchaseValue: 10800, sourceStatus: "AFE_BACKED", frontAssignment: "Diameter-specific main + reserve",
    temporaryAdmissionCandidate: true, leaseStatus: "PENDING_LEASING", notes: []
  },
  {
    assetId: "AFE-R0-05-10", family: "MOTOR_BREAKOUT_UNIT", description: "Motor Breakout Unit",
    holeFamily: "BASE / WORKSHOP", commercialQuantity: 1, commercialUnit: "UNIT", physicalQuantity: 1,
    mainQuantity: 0, backupQuantity: 0, rotationQuantity: 0, sharedQuantity: 1, requiredOrOptional: "REQUIRED",
    purchaseValue: 271000, sourceStatus: "AFE_BACKED", frontAssignment: "Shared base / fleet infrastructure",
    temporaryAdmissionCandidate: true, leaseStatus: "PENDING_LEASING", notes: []
  },
  {
    assetId: "AFE-R0-05-11", family: "MOTOR_R&M_TOOLING", description: "Motor R&M Tooling",
    holeFamily: "BASE / WORKSHOP", commercialQuantity: 1, commercialUnit: "UNIT", physicalQuantity: 1,
    mainQuantity: 0, backupQuantity: 0, rotationQuantity: 0, sharedQuantity: 1, requiredOrOptional: "REQUIRED",
    purchaseValue: 24760, sourceStatus: "AFE_BACKED", frontAssignment: "Shared base / fleet infrastructure",
    temporaryAdmissionCandidate: true, leaseStatus: "PENDING_LEASING", notes: []
  },
  {
    assetId: "AFE-R0-03-08", family: "PR2_VERIFIER", description: "RES-GR Verifier PR2 System",
    holeFamily: "BASE / WORKSHOP", commercialQuantity: 1, commercialUnit: "UNIT", physicalQuantity: 1,
    mainQuantity: 0, backupQuantity: 0, rotationQuantity: 0, sharedQuantity: 1, requiredOrOptional: "REQUIRED",
    purchaseValue: 3970, sourceStatus: "AFE_BACKED", frontAssignment: "Shared base / fleet infrastructure",
    temporaryAdmissionCandidate: true, leaseStatus: "PENDING_LEASING", notes: []
  },
  {
    assetId: "AFE-R0-03-05", family: "PR2_SHOP_EQUIPMENT", description: "Shop Equipment Kit, Parts, PR2 System",
    holeFamily: "BASE / WORKSHOP", commercialQuantity: 1, commercialUnit: "KIT", physicalQuantity: null,
    mainQuantity: 0, backupQuantity: 0, rotationQuantity: 0, sharedQuantity: 1, requiredOrOptional: "REQUIRED",
    purchaseValue: 11245, sourceStatus: "AFE_BACKED", frontAssignment: "Shared base / fleet infrastructure",
    temporaryAdmissionCandidate: true, leaseStatus: "PENDING_LEASING", notes: []
  },
  {
    assetId: "AFE-STARTUP-SPARES", family: "STARTUP_SPARES", description: "AFE startup spares inventory",
    holeFamily: "FLEET / SHARED", commercialQuantity: 1, commercialUnit: "POOL", physicalQuantity: null,
    mainQuantity: 0, backupQuantity: 0, rotationQuantity: 0, sharedQuantity: 1, requiredOrOptional: "REQUIRED",
    purchaseValue: 603080, sourceStatus: "AFE_BACKED", frontAssignment: "Fleet maintenance spare pool",
    temporaryAdmissionCandidate: true, leaseStatus: "PENDING_LEASING",
    notes: ["Startup spares are included in the AFE.", "Old standalone USD250k startup spares assumption is removed.", "Recurring USD55k/well remains OPEX and is not added to startup CAPEX."]
  },
  {
    assetId: "OPTIONAL-4.75", family: "OPTIONAL_4_75", description: "4-3/4 in contingency capability — motor, float sub, motor spares and UBHO",
    holeFamily: "4-3/4\" CONTINGENCY", commercialQuantity: 1, commercialUnit: "POOL", physicalQuantity: null,
    mainQuantity: 0, backupQuantity: 0, rotationQuantity: 0, sharedQuantity: 1, requiredOrOptional: "OPTIONAL",
    purchaseValue: 179603, sourceStatus: "AFE_BACKED", frontAssignment: "Optional contingency capability; OFF by default",
    temporaryAdmissionCandidate: true, leaseStatus: "PENDING_LEASING",
    notes: ["Known CAPEX only. Incremental logistics/customs remain unresolved.", "Do not allocate to base 2F economics when OFF."]
  }
];

export const EWERT_LEAN_2F_FRONTS: FrontView[] = [1, 2].map((front) => ({
  front,
  families: [
    {
      holeFamily: "12-1/4\"" as const,
      items: ["MWD / PWD / Gamma active capacity", "PR2 8-1/4", "Motor 8 in", "Jar 7-3/4", "NMDC 8 in", "Stabilizer 12-1/8", "UBHO 8 in"],
      operatingNote: "Active capacity for the 12-1/4 hole family. Shared/rotation assets remain in their pools."
    },
    {
      holeFamily: "8-1/2\"" as const,
      items: ["MWD / PWD / Gamma active capacity", "PR2 6-3/4", "Motor 6-3/4", "Jar 6-1/2", "NMDC 6-3/4", "Stabilizer 8-3/8", "UBHO 6-3/4"],
      operatingNote: "Active capacity for the 8-1/2 hole family. This does not imply both hole phases operate simultaneously."
    }
  ]
}));

export const EWERT_LEAN_2F_POOLS: PoolView[] = [
  { title: "PR2 shared backups", items: ["1 × PR2 8-1/4 shared backup", "1 × PR2 6-3/4 shared backup"] },
  { title: "Motor rotation / maintenance", items: ["3 × Motor 8 in rotation pool", "3 × Motor 6-3/4 rotation pool"] },
  { title: "Jar backup", items: ["1 × Jar 7-3/4 shared backup", "1 × Jar 6-1/2 shared backup"] },
  { title: "Telemetry redundancy", items: ["MWD: 2 main + 2 backup physical systems", "PWD: 2 main + 2 backup physical systems", "Gamma: 2 main + 2 backup physical systems", "Depth Tracking: 4 physical capacity units"] },
  { title: "Base / workshop", items: ["Motor Breakout Unit", "Motor R&M tooling", "PR2 verifier", "PR2 shop equipment", "maintenance tooling", "office / IT / software"] },
  { title: "Spares", items: ["AFE startup spares included", "Recurring USD55k/well preserved as OPEX", "Consumption/replenishment bridge pending reconciliation"] }
];
