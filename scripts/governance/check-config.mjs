import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
const whitelist = readJson("config/governance/drive-whitelist.json");
const brand = readJson("config/brand/smsmantis.tokens.json");
const controls = readJson("data/governance/rebase-controls.rev2.json");
const gates = readJson("data/governance/open-gates.rev2.json");
const releaseMatrix = readJson("data/governance/executive-release-matrix.rev2.json");
const afe3fEvent = readJson("data/governance/source-change-2026-10-03-afe-3f.json");

const validStatuses = new Set(["CURRENT","APPROVED","CANDIDATE","DRAFT","BLOCKED_EXTERNAL","SUPERSEDED","ARCHIVE"]);
const validGitPolicies = new Set(["METADATA_ONLY","NORMALIZED_INPUT","DERIVED_ARTIFACT","DO_NOT_COPY"]);
const fail = (message) => {
  console.error(`governance-check: FAIL: ${message}`);
  process.exitCode = 1;
};

if (whitelist.schemaVersion !== 2) fail("whitelist schemaVersion must remain v2");
if (!whitelist.rootDriveFolderId || !whitelist.rebaseFolderId) fail("missing governed Drive roots");
if (!Array.isArray(whitelist.records) || whitelist.records.length === 0) fail("whitelist is empty");

const ids = new Set();
const currentByType = new Map();
for (const record of whitelist.records ?? []) {
  if (!record.driveFileId) fail("record missing driveFileId");
  if (ids.has(record.driveFileId)) fail(`duplicate driveFileId ${record.driveFileId}`);
  ids.add(record.driveFileId);
  if (!validStatuses.has(record.status)) fail(`invalid status ${record.status}`);
  if (!validGitPolicies.has(record.gitPolicy)) fail(`invalid gitPolicy ${record.gitPolicy}`);
  if (!record.canonicalPath || !record.documentType || !record.modifiedTime) fail(`incomplete record ${record.driveFileId}`);
  if (record.status === "CURRENT") {
    const previous = currentByType.get(record.documentType);
    if (previous) fail(`multiple CURRENT records for ${record.documentType}: ${previous}, ${record.driveFileId}`);
    currentByType.set(record.documentType, record.driveFileId);
  }
}

const canonicalModel = whitelist.records.find((r) => r.driveFileId === "1fIxd_817m3KMGE892IQd4lqg-hQodsme");
const supplier2f = whitelist.records.find((r) => r.driveFileId === "1O53IiybqYo7P7n138CcxJEG79yqLA1fu");
const supplier3f = whitelist.records.find((r) => r.driveFileId === "10jEXZx_7Gf36LVgW_C6ED9zoRUtvmcjc");
if (canonicalModel?.status !== "CURRENT") fail("canonical financial model must remain CURRENT until Manuel promotion gate");
if (supplier2f?.status !== "CURRENT") fail("supplier 2F Rev0 source must remain CURRENT source evidence");
if (supplier3f?.status !== "CANDIDATE") fail("supplier 3F source remains CANDIDATE while Rev2 outputs are candidate");
if (supplier2f?.gitPolicy !== "DO_NOT_COPY" || supplier3f?.gitPolicy !== "DO_NOT_COPY") fail("supplier original AFEs must not be copied into Git");

if (!ids.has(brand.source?.driveFileId)) fail("brand token source is not whitelisted");
for (const requiredDriveEvidence of [
  "1NUeprqe69umdxSCTlqCo1Bf8Fjc9scQniirK9CAqaWI",
  "19MZo2QSwLmpH1AMKB_8aZtDxAlfVVnIdnihIT__t4aQ",
  "1TpZOPdP2jEJsZ1jM8xtUOu7A8ouLrzPIbWqREquKEkM",
  "1_oRZVcnHxuGnGyerdaUZli6AoH670Z8zLqZb7SjqwX4",
  "1aoOqTxbjaXTqk1qYf3f_pDSJVniCS7ct",
  "17wIEE9pYqVn5q_v2nUAb7CNr0we_i193",
  "1OO6UJinbIzKcSNYONmjUaQlRkJNwzZJThZsKJiXZ-PI",
]) {
  if (!ids.has(requiredDriveEvidence)) fail(`persisted Drive evidence missing from whitelist: ${requiredDriveEvidence}`);
}

const c = controls.canonicalEconomicControls ?? {};
const expected = {
  AFE_3F_GROSS: 9590365,
  OPTIONAL_4_75: 179603,
  REQUIRED_3F_BASE: 9410762,
  AUSTRAL_EWERT_IN_KIND: 5988435,
  PANTHERS_CASH_BEFORE_OPERATING_WC: 5151092.505415513,
  PR2_8_14_TOOLS: 2481500,
  BRIDGE_REVENUE_PER_WELL_DEFAULT: 574542.8571428572,
  FULL_REVENUE_PER_WELL_DEFAULT: 600000,
  TARGET_LIQUID_DSO45: 5446178.950880768,
  TARGET_LIQUID_DSO60: 5733450.379452197,
  TARGET_LIQUID_DSO90: 6307993.236595053,
  LIQUIDITY_FLOOR: 160196.875,
  PEAK_MONTH: "M6",
};
for (const [key, value] of Object.entries(expected)) {
  if (c[key] !== value) fail(`canonical Rev2 economic control drift: ${key}`);
}

if (controls.locks?.LIH_BASIS_LOCK !== "NBV") fail("LIH basis lock drifted from NBV");
if (controls.locks?.LIH_DESFASE_WITHOUT_EVENT !== 78000) fail("LIH no-event desfase drift");
if (controls.locks?.LIH_LIQUIDITY_EFFECT_WITHOUT_EVENT !== 0) fail("LIH no-event liquidity must remain zero");
if (controls.locks?.PEAK_LIQUID_FUNDING_LABEL !== "PEAK LIQUID FUNDING REQUIREMENT") fail("Rev2 liquid-funding wording lock missing");
if (controls.locks?.GROWTH_BEYOND_3F_STATUS !== "PENDING_S04_RESOLUTION") fail("growth beyond 3F must remain unresolved");
if (controls.communicationState !== "INTERNAL_MANAGEMENT_DRAFT") fail("Rev2 must remain internal management draft until promotion");

const g = new Map((gates.gates ?? []).map((item) => [item.id, item]));
for (let i = 1; i <= 12; i += 1) {
  const id = `G${String(i).padStart(2, "0")}`;
  if (!g.has(id)) fail(`missing open gate ${id}`);
}
if (g.get("G01")?.status !== "BLOCKED_EXTERNAL") fail("leasing gate must remain external-blocked");
if (g.get("G02")?.status !== "BLOCKED_EXTERNAL") fail("customs gate must remain external-blocked");
if (g.get("G03")?.status !== "RECONCILED_CANDIDATE") fail("Austral contribution gate must reflect Rev2 candidate reconciliation");
if (g.get("G05")?.status !== "RECONCILED_CANDIDATE") fail("support infrastructure gate must reflect Rev2 candidate reconciliation");
if (g.get("G08")?.status !== "OPEN" || g.get("G09")?.status !== "OPEN") fail("canonical Excel integration gates must stay visible");
if (g.get("G10")?.status !== "OPEN_ACCESS_GATE") fail("S05 visual access gate must stay visible");
if (g.get("G12")?.status !== "RECONCILED_CANDIDATE") fail("G12 must be reconciled candidate after controlled Rev2 delta");

const forbidden = ["required equity","equity raise required"];
for (const row of releaseMatrix.statements ?? []) {
  const text = String(row.statement).toLowerCase();
  if (forbidden.some((phrase) => text.includes(phrase))) fail("executive release matrix uses prohibited funding wording");
}
if (releaseMatrix.communicationState !== "INTERNAL_MANAGEMENT_DRAFT") fail("release matrix prematurely external-ready");

const currentStatements = new Map((releaseMatrix.statements ?? []).map((row) => [row.statement, row]));
if (currentStatements.get("3F supplier AFE Rev0 gross = USD 9,590,365")?.classification !== "SAFE_TO_PRESENT") {
  fail("supplier-backed 3F gross should be safe to present");
}
if (currentStatements.get("Rev1 Ramp Gross Peak Funding DSO90 = USD 22,960,556")?.classification !== "SUPERSEDED") {
  fail("old Rev1 ramp headline must be superseded");
}

const n3 = controls.supplier3FReconciliation;
if (n3?.grossWithResistivity !== 9590365) fail("supplier 3F gross mismatch");
if (n3?.requiredBaseExcludingOptional475 !== 9410762) fail("supplier 3F required-base mismatch");
if (n3?.deltaVsPriorModelDerived !== -872874) fail("supplier 3F delta mismatch");
if (n3?.status !== "RECONCILED_CANDIDATE") fail("supplier 3F reconciliation status drift");

if (afe3fEvent.lifecycle !== "CANDIDATE" || afe3fEvent.financialImpact !== "RECALCULATION_COMPLETED_CANDIDATE") {
  fail("3F source change must remain candidate with completed candidate recalculation");
}
if (afe3fEvent.approver !== null || afe3fEvent.release !== null) fail("3F source event must not fabricate approval/release");
if (!afe3fEvent.evidence?.includes("NO_CURRENT_PROMOTION")) fail("3F event lost no-promotion evidence");

if (!process.exitCode) {
  console.log(`governance-check: PASS (${whitelist.records.length} whitelisted records, ${gates.gates.length} gates tracked, Rev2 controls locked)`);
}
