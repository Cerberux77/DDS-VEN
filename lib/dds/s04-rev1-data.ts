import type { FrontConfiguration, DsoDays } from "./scenario-types";

export type S04CoreScenarioRow = {
  scenario_id: string;
  front_configuration: FrontConfiguration;
  technical_configuration: "EWERT_LEAN";
  acquisition: "PURCHASE";
  dso: DsoDays;
  customs_mode: "TEMPORARY_ADMISSION";
  customs_value_factor: 0.65;
  surety_rate: 0.02;
  guarantee_mode: "SURETY_BOND";
  optional_4_75: "NO";
  austral_asset_credit: 0;
  source_status: string;
  equipment_capex: number;
  logistics: number;
  surety: number;
  suspended_taxes: number;
  restricted_cash: number;
  preop_cash: number;
  m0_m4_cash_requirement: number;
  year1_funding: number;
  peak_funding: number;
  liquidity_floor: number;
  peak_plus_floor: number;
  peak_ar: number;
  revenue_24m: number;
  ebitda_24m: number;
  net_income_24m: number;
  fcf_24m: number;
};

export const S04_DEFAULT_SELECTION = {
  frontConfiguration: "RAMP_3_TO_10",
  technical: "EWERT_LEAN",
  acquisition: "PURCHASE",
  dso: 90,
  customsMode: "TEMPORARY_ADMISSION",
  customsValueFactor: 0.65,
  suretyRate: 0.02,
  guaranteeMode: "SURETY_BOND",
  hydrocarbonBenefit: "OFF",
  optional475: "NO",
  futureTechnicalFrontCount: 10,
} as const;

export const S04_CORE_SCENARIOS: S04CoreScenarioRow[] = [
{"scenario_id":"2F_PURCHASE_P50_DSO45","front_configuration":"STATIC_2F","technical_configuration":"EWERT_LEAN","acquisition":"PURCHASE","dso":45,"customs_mode":"TEMPORARY_ADMISSION","customs_value_factor":0.65,"surety_rate":0.02,"guarantee_mode":"SURETY_BOND","optional_4_75":"NO","austral_asset_credit":0,"source_status":"AFE_BACKED | PROJECT_CANONICAL | MANAGEMENT_TIMING_ASSUMPTION","equipment_capex":6554286,"logistics":151999.99999999997,"surety":83595.14800000002,"suspended_taxes":911187.1132000001,"restricted_cash":0,"preop_cash":7120093.648,"m0_m4_cash_requirement":7502982.579450832,"year1_funding":7502982.579450832,"peak_funding":7502982.579450832,"liquidity_floor":160196.875,"peak_plus_floor":7663179.454450832,"peak_ar":900000,"revenue_24m":14400000,"ebitda_24m":8221399.831590001,"net_income_24m":3874406.4225900006,"fcf_24m":5305332.822590001},
{"scenario_id":"2F_PURCHASE_P50_DSO60","front_configuration":"STATIC_2F","technical_configuration":"EWERT_LEAN","acquisition":"PURCHASE","dso":60,"customs_mode":"TEMPORARY_ADMISSION","customs_value_factor":0.65,"surety_rate":0.02,"guarantee_mode":"SURETY_BOND","optional_4_75":"NO","austral_asset_credit":0,"source_status":"AFE_BACKED | PROJECT_CANONICAL | MANAGEMENT_TIMING_ASSUMPTION","equipment_capex":6554286,"logistics":151999.99999999997,"surety":83595.14800000002,"suspended_taxes":911187.1132000001,"restricted_cash":0,"preop_cash":7120093.648,"m0_m4_cash_requirement":7802982.579450832,"year1_funding":7802982.579450832,"peak_funding":7802982.579450832,"liquidity_floor":160196.875,"peak_plus_floor":7963179.454450832,"peak_ar":1200000,"revenue_24m":14400000,"ebitda_24m":8221399.831590001,"net_income_24m":3874406.4225900006,"fcf_24m":5005332.822590001},
{"scenario_id":"2F_PURCHASE_P50_DSO90","front_configuration":"STATIC_2F","technical_configuration":"EWERT_LEAN","acquisition":"PURCHASE","dso":90,"customs_mode":"TEMPORARY_ADMISSION","customs_value_factor":0.65,"surety_rate":0.02,"guarantee_mode":"SURETY_BOND","optional_4_75":"NO","austral_asset_credit":0,"source_status":"AFE_BACKED | PROJECT_CANONICAL | MANAGEMENT_TIMING_ASSUMPTION","equipment_capex":6554286,"logistics":151999.99999999997,"surety":83595.14800000002,"suspended_taxes":911187.1132000001,"restricted_cash":0,"preop_cash":7120093.648,"m0_m4_cash_requirement":8144427.045176248,"year1_funding":8144427.045176248,"peak_funding":8144427.045176248,"liquidity_floor":160196.875,"peak_plus_floor":8304623.920176248,"peak_ar":1800000,"revenue_24m":14400000,"ebitda_24m":8221399.831590001,"net_income_24m":3874406.4225900006,"fcf_24m":4405332.822590001},
{"scenario_id":"3F_PROJECTED_P50_DSO45","front_configuration":"STATIC_3F","technical_configuration":"EWERT_LEAN","acquisition":"PURCHASE","dso":45,"customs_mode":"TEMPORARY_ADMISSION","customs_value_factor":0.65,"surety_rate":0.02,"guarantee_mode":"SURETY_BOND","optional_4_75":"NO","austral_asset_credit":0,"source_status":"MODEL_DERIVED | PROJECT_CANONICAL | MANAGEMENT_TIMING_ASSUMPTION","equipment_capex":10283636,"logistics":239381.14417836777,"surety":131651.988,"suspended_taxes":1435006.6692000001,"restricted_cash":0,"preop_cash":10984881.632178366,"m0_m4_cash_requirement":11466505.97698545,"year1_funding":11466505.97698545,"peak_funding":11466505.97698545,"liquidity_floor":173717.1875,"peak_plus_floor":11640223.16448545,"peak_ar":1350000,"revenue_24m":21600000,"ebitda_24m":13960121.968815,"net_income_24m":6802305.462315001,"fcf_24m":9070507.862315001},
{"scenario_id":"3F_PROJECTED_P50_DSO60","front_configuration":"STATIC_3F","technical_configuration":"EWERT_LEAN","acquisition":"PURCHASE","dso":60,"customs_mode":"TEMPORARY_ADMISSION","customs_value_factor":0.65,"surety_rate":0.02,"guarantee_mode":"SURETY_BOND","optional_4_75":"NO","austral_asset_credit":0,"source_status":"MODEL_DERIVED | PROJECT_CANONICAL | MANAGEMENT_TIMING_ASSUMPTION","equipment_capex":10283636,"logistics":239381.14417836777,"surety":131651.988,"suspended_taxes":1435006.6692000001,"restricted_cash":0,"preop_cash":10984881.632178366,"m0_m4_cash_requirement":11916505.97698545,"year1_funding":11916505.97698545,"peak_funding":11916505.97698545,"liquidity_floor":173717.1875,"peak_plus_floor":12090223.16448545,"peak_ar":1800000,"revenue_24m":21600000,"ebitda_24m":13960121.968815,"net_income_24m":6802305.462315001,"fcf_24m":8620507.862315001},
{"scenario_id":"3F_PROJECTED_P50_DSO90","front_configuration":"STATIC_3F","technical_configuration":"EWERT_LEAN","acquisition":"PURCHASE","dso":90,"customs_mode":"TEMPORARY_ADMISSION","customs_value_factor":0.65,"surety_rate":0.02,"guarantee_mode":"SURETY_BOND","optional_4_75":"NO","austral_asset_credit":0,"source_status":"MODEL_DERIVED | PROJECT_CANONICAL | MANAGEMENT_TIMING_ASSUMPTION","equipment_capex":10283636,"logistics":239381.14417836777,"surety":131651.988,"suspended_taxes":1435006.6692000001,"restricted_cash":0,"preop_cash":10984881.632178366,"m0_m4_cash_requirement":12382318.149388993,"year1_funding":12382318.149388993,"peak_funding":12382318.149388993,"liquidity_floor":173717.1875,"peak_plus_floor":12556035.336888993,"peak_ar":2700000,"revenue_24m":21600000,"ebitda_24m":13960121.968815,"net_income_24m":6802305.462315001,"fcf_24m":7720507.862315001},
{"scenario_id":"RAMP_3_TO_10_P50_DSO45","front_configuration":"RAMP_3_TO_10","technical_configuration":"EWERT_LEAN","acquisition":"PURCHASE","dso":45,"customs_mode":"TEMPORARY_ADMISSION","customs_value_factor":0.65,"surety_rate":0.02,"guarantee_mode":"SURETY_BOND","optional_4_75":"NO","austral_asset_credit":0,"source_status":"MODEL_DERIVED | PROJECT_CANONICAL | MANAGEMENT_TIMING_ASSUMPTION","equipment_capex":30398086,"logistics":709435.4798678027,"surety":390166.8680000001,"suspended_taxes":4252818.861200001,"restricted_cash":0,"preop_cash":10984881.632178366,"m0_m4_cash_requirement":13041398.85762591,"year1_funding":18475186.24939081,"peak_funding":19253216.92581714,"liquidity_floor":173717.1875,"peak_plus_floor":19426934.11331714,"peak_ar":4500000,"revenue_24m":50700000,"ebitda_24m":37140319.385599375,"net_income_24m":19316478.310036875,"fcf_24m":1745872.827680774},
{"scenario_id":"RAMP_3_TO_10_P50_DSO60","front_configuration":"RAMP_3_TO_10","technical_configuration":"EWERT_LEAN","acquisition":"PURCHASE","dso":60,"customs_mode":"TEMPORARY_ADMISSION","customs_value_factor":0.65,"surety_rate":0.02,"guarantee_mode":"SURETY_BOND","optional_4_75":"NO","austral_asset_credit":0,"source_status":"MODEL_DERIVED | PROJECT_CANONICAL | MANAGEMENT_TIMING_ASSUMPTION","equipment_capex":30398086,"logistics":709435.4798678027,"surety":390166.8680000001,"suspended_taxes":4252818.861200001,"restricted_cash":0,"preop_cash":10984881.632178366,"m0_m4_cash_requirement":13491398.85762591,"year1_funding":19375186.249390814,"peak_funding":20453216.925817143,"liquidity_floor":173717.1875,"peak_plus_floor":20626934.113317143,"peak_ar":6000000,"revenue_24m":50700000,"ebitda_24m":37140319.385599375,"net_income_24m":19316478.310036875,"fcf_24m":245872.8276807742},
{"scenario_id":"RAMP_3_TO_10_P50_DSO90","front_configuration":"RAMP_3_TO_10","technical_configuration":"EWERT_LEAN","acquisition":"PURCHASE","dso":90,"customs_mode":"TEMPORARY_ADMISSION","customs_value_factor":0.65,"surety_rate":0.02,"guarantee_mode":"SURETY_BOND","optional_4_75":"NO","austral_asset_credit":0,"source_status":"MODEL_DERIVED | PROJECT_CANONICAL | MANAGEMENT_TIMING_ASSUMPTION","equipment_capex":30398086,"logistics":709435.4798678027,"surety":390166.8680000001,"suspended_taxes":4252818.861200001,"restricted_cash":0,"preop_cash":10984881.632178366,"m0_m4_cash_requirement":14391398.85762591,"year1_funding":21175186.24939081,"peak_funding":22960556.247195095,"liquidity_floor":173717.1875,"peak_plus_floor":23134273.434695095,"peak_ar":9000000,"revenue_24m":50700000,"ebitda_24m":37140319.385599375,"net_income_24m":19316478.310036875,"fcf_24m":-2754127.172319226}
];

export const S04_2F_PURCHASE_STARTUP_P50 = 6789881.148;
export const S04_OPTIONAL_475_KNOWN_CAPEX = 179603;
export const S04_CONFIRMED_AUSTRAL_ASSET_CONTRIBUTION = 0;
export const S04_LIH_BASIS = "NBV" as const;
export const S04_LIH_DESFASE_WITHOUT_EVENT = 78000;
export const S04_LIH_LIQUIDITY_EFFECT_WITHOUT_EVENT = 0;
export const S04_RECURRING_SPARES_PER_WELL = 55000;

export const S04_RAMP_MILESTONES = [
  { month: 1, fronts: 3, sourceStatus: "MODEL_DERIVED" as const },
  { month: 4, fronts: 4, sourceStatus: "MODEL_DERIVED" as const },
  { month: 6, fronts: 5, sourceStatus: "MODEL_DERIVED" as const },
  { month: 9, fronts: 6, sourceStatus: "MODEL_DERIVED" as const },
  { month: 11, fronts: 7, sourceStatus: "MODEL_DERIVED" as const },
  { month: 14, fronts: 8, sourceStatus: "MODEL_DERIVED" as const },
  { month: 16, fronts: 9, sourceStatus: "MODEL_DERIVED" as const },
  { month: 18, fronts: 10, sourceStatus: "MODEL_DERIVED" as const },
];

export const S04_DEFAULT_FUNDING_BRIDGE = [
  { order: 1, component: "Equipment", amount: 30398086, treatment: "Gross equipment capacity through 10F" },
  { order: 2, component: "Logistics", amount: 709435.4798678027, treatment: "Model-derived P50 logistics through 10F" },
  { order: 3, component: "Surety", amount: 390166.8680000001, treatment: "2% of declared customs value at 65% factor" },
  { order: 4, component: "Pre-op OPEX", amount: 310712.5, treatment: "Preserved management pre-op operating cash" },
  { order: 5, component: "Rent deposit", amount: 19500, treatment: "Pre-op cash use" },
  { order: 6, component: "Operating Cash / Collections Reconciliation", amount: -8867344.600672707, treatment: "Includes collections, operating cash generation/deficit and timing effects; not a conventional negative cost" },
  { order: 7, component: "Restricted customs cash", amount: 0, treatment: "Separated from expense" },
  { order: 8, component: "Confirmed Austral Asset Contribution", amount: 0, treatment: "0 confirmed by current evidence; this does not mean Austral owns zero equipment" },
  { order: 9, component: "NET PEAK FUNDING", amount: 22960556.247195095, treatment: "Not required equity" },
  { order: 10, component: "Liquidity Floor", amount: 173717.1875, treatment: "Preserved S03 floor" },
  { order: 11, component: "TARGET FUNDING CAPACITY", amount: 23134273.434695095, treatment: "Net Peak Funding + Liquidity Floor" },
] as const;
