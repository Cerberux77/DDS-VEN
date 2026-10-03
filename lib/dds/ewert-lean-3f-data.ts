import type { FleetAssetFamily, FrontView, PoolView } from "./scenario-types";

const sharedNotes = ["3F supplier-backed AFE Rev0.", "Shared directional core can be reused between 12¼ and 8½ phases; diameter-specific mechanical/LWD packages remain distinct."];

export const EWERT_LEAN_3F_ASSET_FAMILIES: FleetAssetFamily[] = [
  {
    assetId:"AFE-3F-OFFICE",family:"OPERATION_OFFICE",description:"Operation office / technical IT & software",
    holeFamily:"BASE / OFFICE",commercialQuantity:1,commercialUnit:"POOL",physicalQuantity:null,
    mainQuantity:0,backupQuantity:0,rotationQuantity:0,sharedQuantity:1,requiredOrOptional:"REQUIRED",
    purchaseValue:113523,sourceStatus:"AFE_BACKED",frontAssignment:"Base / office",temporaryAdmissionCandidate:false,leaseStatus:"N/A",
    cashTreatment:"PANTHERS_CASH",notes:["Panthers-funded office/IT and technical software package."]
  },
  {
    assetId:"AFE-3F-MWD",family:"MWD",description:"MWD System — Mud Pulse 175C",
    holeFamily:"PLATFORM / SHARED",commercialQuantity:2.5,commercialUnit:"KIT",physicalQuantity:5,
    mainQuantity:3,backupQuantity:2,rotationQuantity:0,sharedQuantity:5,requiredOrOptional:"REQUIRED",
    purchaseValue:759050,sourceStatus:"AFE_BACKED",frontAssignment:"3 active strings + 2 backup strings; shared across hole phases",temporaryAdmissionCandidate:true,leaseStatus:"PENDING_LEASING",
    cashTreatment:"AUSTRAL_IN_KIND",notes:[...sharedNotes,"Commercial 2.5 KIT = 5 physical strings. Never price physical quantity by KIT unit price."]
  },
  {
    assetId:"AFE-3F-PWD",family:"PWD",description:"PWD System for Mud Pulse 175C",
    holeFamily:"PLATFORM / SHARED",commercialQuantity:2.5,commercialUnit:"KIT",physicalQuantity:5,
    mainQuantity:3,backupQuantity:2,rotationQuantity:0,sharedQuantity:5,requiredOrOptional:"REQUIRED",
    purchaseValue:129475,sourceStatus:"AFE_BACKED",frontAssignment:"Shared directional core",temporaryAdmissionCandidate:true,leaseStatus:"PENDING_LEASING",
    cashTreatment:"AUSTRAL_IN_KIND",notes:[...sharedNotes]
  },
  {
    assetId:"AFE-3F-GAMMA",family:"GAMMA",description:"Gamma System for PP 175C",
    holeFamily:"PLATFORM / SHARED",commercialQuantity:2.5,commercialUnit:"KIT",physicalQuantity:5,
    mainQuantity:3,backupQuantity:2,rotationQuantity:0,sharedQuantity:5,requiredOrOptional:"REQUIRED",
    purchaseValue:105000,sourceStatus:"AFE_BACKED",frontAssignment:"Shared directional core",temporaryAdmissionCandidate:true,leaseStatus:"PENDING_LEASING",
    cashTreatment:"AUSTRAL_IN_KIND",notes:[...sharedNotes]
  },
  {
    assetId:"AFE-3F-DEPTH",family:"DEPTH_TRACKING",description:"Depth tracking systems + licenses",
    holeFamily:"PLATFORM / SHARED",commercialQuantity:3,commercialUnit:"KIT",physicalQuantity:6,
    mainQuantity:3,backupQuantity:3,rotationQuantity:0,sharedQuantity:6,requiredOrOptional:"REQUIRED",
    purchaseValue:153300,sourceStatus:"AFE_BACKED",frontAssignment:"3 jobs + redundancy",temporaryAdmissionCandidate:true,leaseStatus:"N/A",
    cashTreatment:"AUSTRAL_IN_KIND",notes:["Hardware + software aggregate for presentation."]
  },
  {
    assetId:"AFE-3F-PRESSURE-8",family:"PWD_PRESSURE_SUB",description:"PWD Pressure Sub 8¼",
    holeFamily:'12-1/4" hole family',commercialQuantity:5,commercialUnit:"UNIT",physicalQuantity:5,
    mainQuantity:3,backupQuantity:2,rotationQuantity:0,sharedQuantity:0,requiredOrOptional:"REQUIRED",
    purchaseValue:133500,sourceStatus:"AFE_BACKED",frontAssignment:"Diameter-specific 3 active + 2 reserve",temporaryAdmissionCandidate:true,leaseStatus:"PENDING_LEASING",
    cashTreatment:"AUSTRAL_IN_KIND",notes:[]
  },
  {
    assetId:"AFE-3F-PRESSURE-6",family:"PWD_PRESSURE_SUB",description:"PWD Pressure Sub 6¾",
    holeFamily:'8-1/2" hole family',commercialQuantity:5,commercialUnit:"UNIT",physicalQuantity:5,
    mainQuantity:3,backupQuantity:2,rotationQuantity:0,sharedQuantity:0,requiredOrOptional:"REQUIRED",
    purchaseValue:118250,sourceStatus:"AFE_BACKED",frontAssignment:"Diameter-specific 3 active + 2 reserve",temporaryAdmissionCandidate:true,leaseStatus:"PENDING_LEASING",
    cashTreatment:"AUSTRAL_IN_KIND",notes:[]
  },
  {
    assetId:"AFE-3F-PR2-8",family:"PR2_RESISTIVITY",description:"PR2 LWD — 8¼ OD / 12¼ intermediate",
    holeFamily:'12-1/4" hole family',commercialQuantity:5,commercialUnit:"UNIT",physicalQuantity:5,
    mainQuantity:3,backupQuantity:2,rotationQuantity:0,sharedQuantity:0,requiredOrOptional:"REQUIRED",
    purchaseValue:2481500,sourceStatus:"AFE_BACKED",frontAssignment:"Available after PO / M6 delivery; 3 operating + 2 backup",temporaryAdmissionCandidate:true,leaseStatus:"PENDING_LEASING",
    cashTreatment:"PANTHERS_CASH",notes:["PO: 50% M0 / 50% M6. M4–M6 bridge operates intermediate section without resistivity."]
  },
  {
    assetId:"AFE-3F-PR2-6",family:"PR2_RESISTIVITY",description:"PR2 LWD — 6¾ OD / 8½ production",
    holeFamily:'8-1/2" hole family',commercialQuantity:5,commercialUnit:"UNIT",physicalQuantity:5,
    mainQuantity:3,backupQuantity:2,rotationQuantity:0,sharedQuantity:0,requiredOrOptional:"REQUIRED",
    purchaseValue:2190900,sourceStatus:"AFE_BACKED",frontAssignment:"Available for startup; 3 operating + 2 backup",temporaryAdmissionCandidate:true,leaseStatus:"PENDING_LEASING",
    cashTreatment:"AUSTRAL_IN_KIND",notes:["Contributed by Ewert/Austral for startup."]
  },
  {
    assetId:"AFE-3F-PR2-PERIPH",family:"PR2_SUPPORT",description:"PR2 surface support / running gear / shop kit / 8¼ carriers / verifier",
    holeFamily:"BASE / 12¼ SUPPORT",commercialQuantity:1,commercialUnit:"POOL",physicalQuantity:null,
    mainQuantity:0,backupQuantity:0,rotationQuantity:0,sharedQuantity:1,requiredOrOptional:"REQUIRED",
    purchaseValue:339500,sourceStatus:"AFE_BACKED",frontAssignment:"Base + front support; provisioned for M6",temporaryAdmissionCandidate:true,leaseStatus:"N/A",
    cashTreatment:"PANTHERS_CASH",notes:["Conservative Rev2 allocation to the new 8¼ package."]
  },
  {
    assetId:"AFE-3F-PR2-CARRIER-6",family:"PR2_CARRIER",description:"6¾ Collar Assembly Tool Carriers",
    holeFamily:'8-1/2" hole family',commercialQuantity:5,commercialUnit:"UNIT",physicalQuantity:5,
    mainQuantity:3,backupQuantity:2,rotationQuantity:0,sharedQuantity:0,requiredOrOptional:"REQUIRED",
    purchaseValue:93900,sourceStatus:"AFE_BACKED",frontAssignment:"6¾ package",temporaryAdmissionCandidate:true,leaseStatus:"N/A",
    cashTreatment:"AUSTRAL_IN_KIND",notes:[]
  },
  {
    assetId:"AFE-3F-MWD-SPARES",family:"MWD_SPARES",description:"MWD/PWD/Gamma/battery spares — 6 months",
    holeFamily:"FLEET / SHARED",commercialQuantity:1,commercialUnit:"POOL",physicalQuantity:null,
    mainQuantity:0,backupQuantity:0,rotationQuantity:0,sharedQuantity:1,requiredOrOptional:"REQUIRED",
    purchaseValue:386530,sourceStatus:"AFE_BACKED",frontAssignment:"Fleet spare pool",temporaryAdmissionCandidate:true,leaseStatus:"N/A",
    cashTreatment:"AUSTRAL_IN_KIND",notes:[]
  },
  {
    assetId:"AFE-3F-WORKSHOP",family:"WORKSHOP_RM",description:"MWD & Mud Motor R&M tools incl. two breakout units",
    holeFamily:"BASE / WORKSHOP",commercialQuantity:1,commercialUnit:"POOL",physicalQuantity:null,
    mainQuantity:0,backupQuantity:0,rotationQuantity:0,sharedQuantity:1,requiredOrOptional:"REQUIRED",
    purchaseValue:487804,sourceStatus:"AFE_BACKED",frontAssignment:"Base/workshop shared infrastructure",temporaryAdmissionCandidate:true,leaseStatus:"N/A",
    cashTreatment:"PANTHERS_CASH",notes:["Includes 6-cylinder breakout USD271k and used 4-cylinder breakout USD46.8k; no separate USD200k crusher line."]
  },
  {
    assetId:"AFE-3F-MOTORS",family:"MUD_MOTOR",description:"Required 8in + 6¾ mud motors and float subs",
    holeFamily:"DIAMETER-SPECIFIC",commercialQuantity:1,commercialUnit:"POOL",physicalQuantity:null,
    mainQuantity:6,backupQuantity:4,rotationQuantity:4,sharedQuantity:0,requiredOrOptional:"REQUIRED",
    purchaseValue:720850,sourceStatus:"AFE_BACKED",frontAssignment:"5 motors per principal OD; 3 active + 2 rotation / backup per OD",temporaryAdmissionCandidate:true,leaseStatus:"PENDING_LEASING",
    cashTreatment:"AUSTRAL_IN_KIND",notes:["4¾ contingency excluded."]
  },
  {
    assetId:"AFE-3F-MOTOR-SPARES",family:"MOTOR_SPARES",description:"8in + 6¾ motor spares / handling / measuring",
    holeFamily:"BASE / WORKSHOP",commercialQuantity:1,commercialUnit:"POOL",physicalQuantity:null,
    mainQuantity:0,backupQuantity:0,rotationQuantity:0,sharedQuantity:1,requiredOrOptional:"REQUIRED",
    purchaseValue:329880,sourceStatus:"AFE_BACKED",frontAssignment:"Maintenance pool",temporaryAdmissionCandidate:true,leaseStatus:"N/A",
    cashTreatment:"AUSTRAL_IN_KIND",notes:["4¾ exclusive spares excluded."]
  },
  {
    assetId:"AFE-3F-JARS",family:"JAR",description:"7¾ + 6½ hydraulic jars and handling tools",
    holeFamily:"DIAMETER-SPECIFIC",commercialQuantity:1,commercialUnit:"POOL",physicalQuantity:8,
    mainQuantity:6,backupQuantity:2,rotationQuantity:0,sharedQuantity:0,requiredOrOptional:"REQUIRED",
    purchaseValue:301400,sourceStatus:"AFE_BACKED",frontAssignment:"3 active + 1 backup per size",temporaryAdmissionCandidate:true,leaseStatus:"N/A",
    cashTreatment:"AUSTRAL_IN_KIND",notes:[]
  },
  {
    assetId:"AFE-3F-JAR-SPARES",family:"JAR_SPARES",description:"Jar spares",
    holeFamily:"FLEET / SHARED",commercialQuantity:1,commercialUnit:"POOL",physicalQuantity:null,
    mainQuantity:0,backupQuantity:0,rotationQuantity:0,sharedQuantity:1,requiredOrOptional:"REQUIRED",
    purchaseValue:35400,sourceStatus:"AFE_BACKED",frontAssignment:"Fleet spare pool",temporaryAdmissionCandidate:true,leaseStatus:"N/A",
    cashTreatment:"AUSTRAL_IN_KIND",notes:[]
  },
  {
    assetId:"AFE-3F-BHA-MECH",family:"NMDC_STAB_UBHO",description:"NMDC + stabilizers + UBHO for 12¼ / 8½",
    holeFamily:"DIAMETER-SPECIFIC",commercialQuantity:1,commercialUnit:"POOL",physicalQuantity:null,
    mainQuantity:6,backupQuantity:4,rotationQuantity:0,sharedQuantity:0,requiredOrOptional:"REQUIRED",
    purchaseValue:531000,sourceStatus:"AFE_BACKED",frontAssignment:"5 per principal family: 3 active + 2 reserve",temporaryAdmissionCandidate:true,leaseStatus:"N/A",
    cashTreatment:"AUSTRAL_IN_KIND",notes:["4¾ UBHO excluded."]
  },
  {
    assetId:"OPTIONAL-4.75",family:"OPTIONAL_4_75",description:"4¾ contingency capability",
    holeFamily:'4-3/4" CONTINGENCY',commercialQuantity:1,commercialUnit:"POOL",physicalQuantity:null,
    mainQuantity:0,backupQuantity:0,rotationQuantity:0,sharedQuantity:1,requiredOrOptional:"OPTIONAL",
    purchaseValue:179603,sourceStatus:"AFE_BACKED",frontAssignment:"Optional / OFF by default",temporaryAdmissionCandidate:true,leaseStatus:"PENDING_LEASING",
    cashTreatment:"OPTIONAL",notes:["Ewert confirmed it can be excluded from Venezuela base calculations."]
  }
];

export const EWERT_LEAN_3F_FRONTS: FrontView[] = [1,2,3].map((front) => ({
  front,
  families: [
    {
      holeFamily:'12-1/4"' as const,
      items:["Shared MWD/PWD/Gamma core","PWD Pressure Sub 8¼","Motor 8in","Jar 7¾","NMDC 8in","Stabilizer 12⅛","UBHO 8in","PR2 8¼ from M7"],
      operatingNote: front === 3
        ? "Front 3 is installed-capacity / opportunity standby in the base scenario. PR2 8¼ becomes available from M7."
        : "M4–M6 bridge: directional package operates without PR2 8¼; full resistivity package from M7."
    },
    {
      holeFamily:'8-1/2"' as const,
      items:["Shared MWD/PWD/Gamma core","PWD Pressure Sub 6¾","PR2 6¾","Motor 6¾","Jar 6½","NMDC 6¾","Stabilizer 8⅜","UBHO 6¾"],
      operatingNote: front === 3
        ? "Front 3 capacity is physically available; revenue activation is contract-triggered."
        : "Full production/lateral package including Ewert-contributed PR2 6¾ is available from startup."
    }
  ]
}));

export const EWERT_LEAN_3F_POOLS: PoolView[] = [
  {title:"Shared directional core",items:["5 physical MWD strings from 2.5 KIT = 3 main + 2 backup","5 physical PWD cores","5 Gamma cores","Core reused between 12¼ and 8½ phases"]},
  {title:"PR2 8¼ — Panthers PO",items:["5 tools = 3 operating + 2 backup","50% M0 / 50% M6","Peripherals + import M6","Full revenue contribution from M7"]},
  {title:"PR2 6¾ — Austral/Ewert contribution",items:["5 tools = 3 operating + 2 backup","Available for 8½ production/lateral startup"]},
  {title:"Motor rotation",items:["5 × 8in motors","5 × 6¾ motors","3 active + 2 rotation/backup per OD"]},
  {title:"Base / workshop",items:["Two Motor Breakout Units","Motor R&M tooling","Calibration / electronics","60m × 40m facility funded by Panthers"]},
  {title:"Transport",items:["4 pickups purchased in M2–M4","5t forklift","Chuto + batea rented as OPEX; 2 ACT/well contract reference"]}
];
