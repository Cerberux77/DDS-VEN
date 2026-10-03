import test from "node:test";
import assert from "node:assert/strict";
import {
  LIH_BASIS_LOCK,
  canApproveFinancialArtifact,
  canApproveLeasing,
  canChangeLihBasis,
  canMergePullRequest,
  canPromoteCustoms,
  canReleaseS05,
  canReplaceCurrent,
  canSendOutbound,
  classifyDriveChange,
  externalPresentationState,
  requiredGates,
  shouldCopyOriginalToGit,
  validateAustralAssetWording,
  validateGrossFundingLabel,
  type DriveDocumentRecord,
} from "../lib/governance/policy.ts";

const approval = {
  approved: true,
  actor: "Manuel Vera",
  approvedAt: "2026-10-03T05:30:00Z",
  evidence: "explicit approval",
};

const current: DriveDocumentRecord = {
  driveFileId: "canonical-xlsx",
  canonicalPath: "/05/DDS_Modelo_AC_BLIND.xlsx",
  version: "baseline",
  modifiedTime: "2026-10-02T15:06:19.192Z",
  hash: null,
  documentType: "FINANCIAL_MODEL_XLSX",
  status: "CURRENT",
  gitPolicy: "DO_NOT_COPY",
  relatedModelInput: "DDS_FINANCIAL_MODEL_24M",
  relatedRelease: "DDS_PHASE_2",
};

const candidate: DriveDocumentRecord = {
  driveFileId: "afe-3f",
  canonicalPath: "/ECONOMICAL TECNICAL REBASE/02_S02/DDS Equipment_ 3 Jobs_Rev0.xlsx",
  version: "Rev0",
  modifiedTime: "2026-10-03T05:29:37.845Z",
  hash: null,
  documentType: "AFE_3F_SUPPLIER_SOURCE",
  status: "CANDIDATE",
  gitPolicy: "DO_NOT_COPY",
  relatedModelInput: "DDS_EQUIPMENT_3F",
  relatedRelease: null,
};

test("new supplier 3F AFE is detected but CANDIDATE cannot replace CURRENT", () => {
  assert.equal(classifyDriveChange(null, candidate), "ADDED");
  assert.equal(canReplaceCurrent(candidate).allowed, false);
  assert.match(canReplaceCurrent(candidate).reason, /CANDIDATE/);
});

test("CURRENT promotion requires Manuel approval", () => {
  assert.equal(canReplaceCurrent(current).allowed, false);
  assert.equal(canReplaceCurrent(current, approval).allowed, true);
});

test("economic/legal/AFE/funding outbound cannot auto-send", () => {
  for (const kind of ["ECONOMIC", "LEGAL", "AFE", "FUNDING_ASK"] as const) {
    assert.equal(canSendOutbound(kind).allowed, false);
  }
});

test("sensitive outbound passes only with explicit Manuel approval evidence", () => {
  assert.equal(canSendOutbound("PARTNER_COMMITMENT", approval).allowed, true);
});

test("LIH is locked to NBV unless Manuel manual-decision gate approves a different basis", () => {
  assert.equal(LIH_BASIS_LOCK, "NBV");
  assert.equal(canChangeLihBasis("NBV").allowed, true);
  assert.equal(canChangeLihBasis("DECLARED_VALUE").reason, "MANUAL_DECISION_GATE_REQUIRED");
  assert.equal(canChangeLihBasis("REPLACEMENT_VALUE", approval).allowed, true);
});

test("gross peak funding cannot be relabelled Required Equity", () => {
  assert.equal(validateGrossFundingLabel("GROSS PEAK FUNDING REQUIREMENT").allowed, true);
  assert.equal(validateGrossFundingLabel("Required Equity").allowed, false);
  assert.equal(validateGrossFundingLabel("Equity Raise Required").allowed, false);
});

test("PENDING_LEASING cannot produce approved resolved economics", () => {
  assert.equal(canApproveLeasing({ status: "PENDING_LEASING", termsComplete: false }).allowed, false);
  assert.equal(canApproveLeasing({ status: "RESOLVED", termsComplete: true }).allowed, true);
});

test("PENDING_CUSTOMS cannot be promoted automatically", () => {
  assert.equal(
    canPromoteCustoms({ status: "PENDING_CUSTOMS_VALIDATION", formalEvidence: false }).allowed,
    false,
  );
  assert.equal(canPromoteCustoms({ status: "FORMALLY_VALIDATED", formalEvidence: true }).allowed, true);
});

test("Austral evidence wording cannot become zero-owned-assets claim", () => {
  assert.equal(validateAustralAssetWording("Austral owns zero assets.").allowed, false);
  assert.equal(
    validateAustralAssetWording("0 confirmed asset contribution in current evidence.").allowed,
    true,
  );
});

test("S03/S04 artifact-persistence gaps remain approval blockers", () => {
  assert.equal(
    canApproveFinancialArtifact({
      computationValid: true,
      xlsxGenerated: false,
      formulasVerified: false,
      visualQaComplete: false,
      machineReconciliationPass: true,
    }).allowed,
    false,
  );
});

test("S05 production release requires visual PASS or explicit Manuel waiver plus release approval", () => {
  assert.equal(
    canReleaseS05({
      computationalUiReconciliation: true,
      ciPass: true,
      visualQa: "OPEN_ACCESS_GATE",
    }).allowed,
    false,
  );
  assert.equal(
    canReleaseS05({
      computationalUiReconciliation: true,
      ciPass: true,
      visualQa: "OPEN_ACCESS_GATE",
      visualWaiver: approval,
      releaseApproval: approval,
    }).allowed,
    true,
  );
});

test("PR merge is a Manuel gate", () => {
  assert.equal(canMergePullRequest().allowed, false);
  assert.equal(canMergePullRequest(approval).allowed, true);
});

test("current rebase remains internal management draft while XLSX/visual gates are open", () => {
  assert.equal(
    externalPresentationState({
      financialXlsxPersisted: false,
      visualQaComplete: false,
      openGatesDisclosed: true,
    }),
    "INTERNAL_MANAGEMENT_DRAFT",
  );
});

test("model-affecting records require normalize, tests and financial reconciliation", () => {
  const gates = requiredGates(candidate);
  assert.ok(gates.includes("NORMALIZE_INPUT"));
  assert.ok(gates.includes("MODEL_TESTS"));
  assert.ok(gates.includes("FINANCIAL_RECONCILIATION"));
});

test("original supplier/model sources are not bulk-copied into Git", () => {
  assert.equal(shouldCopyOriginalToGit(current), false);
  assert.equal(shouldCopyOriginalToGit(candidate), false);
});
