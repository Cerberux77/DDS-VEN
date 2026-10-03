import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
const whitelist = readJson("config/governance/drive-whitelist.json");
const brand = readJson("config/brand/smsmantis.tokens.json");
const controls = readJson("data/governance/rebase-controls.rev1.json");
const gates = readJson("data/governance/open-gates.rev1.json");
const releaseMatrix = readJson("data/governance/executive-release-matrix.rev1.json");
const afe3fEvent = readJson("data/governance/source-change-2026-10-03-afe-3f.json");

const validStatuses = new Set(["CURRENT", "APPROVED", "CANDIDATE", "DRAFT", "BLOCKED_EXTERNAL", "SUPERSEDED", "ARCHIVE"]);
const validGitPolicies = new Set(["METADATA_ONLY", "NORMALIZED_INPUT", "DERIVED_ARTIFACT", "DO_NOT_COPY"]);
const fail = (message) => {
  console.error(`governance-check: FAIL: ${message}`);
  process.exitCode = 1;
};

if (whitelist.schemaVersion !== 2) fail("whitelist schemaVersion must be Rev1/v2");
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
  if (!record.canonicalPath || !record.documentType || !record.modifiedTime) {
    fail(`incomplete record ${record.driveFileId}`);
  }
  if (record.status === "CURRENT") {
    const previous = currentByType.get(record.documentType);
    if (previous) fail(`multiple CURRENT records for ${record.documentType}: ${previous}, ${record.driveFileId}`);
    currentByType.set(record.documentType, record.driveFileId);
  }
}

const canonicalModel = whitelist.records.find((r) => r.driveFileId === "1fIxd_817m3KMGE892IQd4lqg-hQodsme");
const supplier2f = whitelist.records.find((r) => r.driveFileId === "1O53IiybqYo7P7n138CcxJEG79yqLA1fu");
const supplier3f = whitelist.records.find((r) => r.driveFileId === "10jEXZx_7Gf36LVgW_C6ED9zoRUtvmcjc");
if (canonicalModel?.status !== "CURRENT") fail("canonical financial model must remain CURRENT");
if (supplier2f?.status !== "CURRENT") fail("supplier 2F Rev0 source must be CURRENT source evidence");
if (supplier3f?.status !== "CANDIDATE") fail("new supplier 3F Rev0 must remain CANDIDATE until reconciliation");
if (supplier2f?.gitPolicy !== "DO_NOT_COPY" || supplier3f?.gitPolicy !== "DO_NOT_COPY") {
  fail("supplier original AFEs must not be copied into Git");
}

if (!ids.has(brand.source?.driveFileId)) fail("brand token source is not whitelisted");

const c = controls.canonicalEconomicControls ?? {};
const expected = {
  AFE_REV0_GROSS: 6733889,
  OPTIONAL_4_75: 179603,
  REQUIRED_2F_BASE: 6554286,
  "2F_PEAK_DSO90": 8144427.045176248,
  "3F_EQUIPMENT_PROJECTED": 10283636,
  "10F_EQUIPMENT_MODEL_DERIVED": 30398086,
  RAMP_PEAK_DSO90: 22960556.247195095,
  RAMP_TARGET_FUNDING_CAPACITY_DSO90: 23134273.434695095,
};
for (const [key, value] of Object.entries(expected)) {
  if (c[key] !== value) fail(`canonical economic control drift: ${key}`);
}

if (controls.locks?.LIH_BASIS_LOCK !== "NBV") fail("LIH basis lock drifted from NBV");
if (controls.locks?.LIH_DESFASE_WITHOUT_EVENT !== 78000) fail("LIH no-event desfase drift");
if (controls.locks?.LIH_LIQUIDITY_EFFECT_WITHOUT_EVENT !== 0) fail("LIH no-event liquidity must remain zero");
if (controls.locks?.GROSS_PEAK_FUNDING_LABEL !== "GROSS PEAK FUNDING REQUIREMENT") {
  fail("gross funding wording lock missing");
}
if (controls.communicationState !== "INTERNAL_MANAGEMENT_DRAFT") fail("rebase must remain internal management draft");

const g = new Map((gates.gates ?? []).map((item) => [item.id, item]));
for (let i = 1; i <= 12; i += 1) {
  const id = `G${String(i).padStart(2, "0")}`;
  if (!g.has(id)) fail(`missing open gate ${id}`);
}
if (g.get("G01")?.status !== "BLOCKED_EXTERNAL") fail("leasing gate must remain external-blocked");
if (g.get("G08")?.status !== "OPEN" || g.get("G09")?.status !== "OPEN") fail("S03/S04 tooling gaps must stay visible");
if (g.get("G10")?.status !== "OPEN_ACCESS_GATE") fail("S05 visual access gate must stay visible");
if (g.get("G12")?.status !== "NEW_CANDIDATE") fail("new 3F AFE reconciliation gate missing");

const forbidden = ["required equity", "equity raise required"];
for (const row of releaseMatrix.statements ?? []) {
  const text = String(row.statement).toLowerCase();
  if (text.includes("22,960,556") && forbidden.some((phrase) => text.includes(phrase))) {
    fail("gross peak funding was relabelled as equity");
  }
}
if (releaseMatrix.communicationState !== "INTERNAL_MANAGEMENT_DRAFT") fail("release matrix prematurely external-ready");

const n3 = controls.newSupplier3FCandidate;
if (n3?.grossWithResistivity !== 9590365) fail("new supplier 3F gross mismatch");
if (n3?.requiredBaseExcludingOptional475 !== 9410762) fail("new supplier 3F required-base mismatch");
if (n3?.deltaVsPriorModelDerived !== -872874) fail("new supplier 3F delta mismatch");
if (afe3fEvent.lifecycle !== "CANDIDATE" || afe3fEvent.financialImpact !== "RECALCULATION_REQUIRED") {
  fail("3F source change must remain candidate with recalculation required");
}
if (afe3fEvent.approver !== null || afe3fEvent.release !== null) fail("3F source event must not fabricate approval/release");
if (!afe3fEvent.evidence?.includes("NO_BASELINE_PROMOTION")) fail("3F event lost no-promotion evidence");

if (!process.exitCode) {
  console.log(`governance-check: PASS (${whitelist.records.length} whitelisted records, ${gates.gates.length} open gates, Rev1 controls locked)`);
}
