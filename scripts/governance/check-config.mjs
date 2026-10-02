import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
const whitelist = readJson("config/governance/drive-whitelist.json");
const brand = readJson("config/brand/smsmantis.tokens.json");
const pilot = readJson("data/governance/pilot-2026-10-02-s03-backup.json");

const validStatuses = new Set(["CURRENT", "APPROVED", "DRAFT", "SUPERSEDED", "ARCHIVE"]);
const validGitPolicies = new Set(["METADATA_ONLY", "NORMALIZED_INPUT", "DERIVED_ARTIFACT", "DO_NOT_COPY"]);
const fail = (message) => {
  console.error(`governance-check: FAIL: ${message}`);
  process.exitCode = 1;
};

if (whitelist.schemaVersion !== 1) fail("unsupported whitelist schemaVersion");
if (!whitelist.rootDriveFolderId) fail("missing rootDriveFolderId");
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
const s03Backup = whitelist.records.find((r) => r.driveFileId === "1DvzaNgcCziA349smoo3kOuoxRNtMZyd4");
if (canonicalModel?.status !== "CURRENT") fail("canonical financial model must remain CURRENT");
if (s03Backup?.status !== "DRAFT") fail("S03 backup must remain DRAFT unless explicitly promoted through a new approved change");
if (s03Backup?.gitPolicy !== "DO_NOT_COPY") fail("S03 backup original must not be copied to Git");

if (!ids.has(brand.source?.driveFileId)) fail("brand token source is not whitelisted");
if (pilot.source?.candidateDriveFileId !== s03Backup?.driveFileId) fail("pilot candidate does not match whitelist");
if (!pilot.evidence?.includes("decision=NO_BASELINE_PROMOTION")) fail("pilot lost NO_BASELINE_PROMOTION evidence");
if (pilot.approver !== null || pilot.release !== null) fail("pilot must not fabricate approval/release");

if (!process.exitCode) {
  console.log(`governance-check: PASS (${whitelist.records.length} whitelisted records, ${currentByType.size} CURRENT document types)`);
}
