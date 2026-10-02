import test from "node:test";
import assert from "node:assert/strict";
import {
  canReplaceCurrent,
  canSendOutbound,
  classifyDriveChange,
  requiredGates,
  shouldCopyOriginalToGit,
  type DriveDocumentRecord,
} from "../lib/governance/policy.ts";

const current: DriveDocumentRecord = {
  driveFileId: "canonical-xlsx",
  canonicalPath: "/05/DDS_Modelo_AC_BLIND.xlsx",
  version: "baseline",
  modifiedTime: "2026-10-01T08:53:40.185Z",
  hash: null,
  documentType: "FINANCIAL_MODEL_XLSX",
  status: "CURRENT",
  gitPolicy: "DO_NOT_COPY",
  relatedModelInput: "DDS_FINANCIAL_MODEL_24M",
  relatedRelease: "DDS_PHASE_2",
};

const backup: DriveDocumentRecord = {
  driveFileId: "backup-s03",
  canonicalPath: "/05/BACKUP_S03_DDS_Modelo_AC_BLIND_2026-10-02_1034.xlsx",
  version: "backup",
  modifiedTime: "2026-10-02T14:36:04.960Z",
  hash: null,
  documentType: "FINANCIAL_MODEL_BACKUP",
  status: "DRAFT",
  gitPolicy: "DO_NOT_COPY",
  relatedModelInput: "DDS_FINANCIAL_MODEL_24M",
  relatedRelease: null,
};

test("real S03 backup is detected as an added governance event", () => {
  assert.equal(classifyDriveChange(null, backup), "ADDED");
});

test("DRAFT backup cannot replace CURRENT baseline", () => {
  assert.equal(canReplaceCurrent(backup).allowed, false);
  assert.match(canReplaceCurrent(backup).reason, /DRAFT/);
});

test("CURRENT promotion still requires Manuel approval", () => {
  assert.equal(canReplaceCurrent(current).reason, "BASELINE_PROMOTION_REQUIRES_MANUEL_APPROVAL");
  assert.equal(
    canReplaceCurrent(current, {
      approved: true,
      actor: "Manuel Vera",
      approvedAt: "2026-10-02T14:40:00Z",
      evidence: "explicit approval",
    }).allowed,
    true,
  );
});

test("financial-model records require normalization, tests and reconciliation gates", () => {
  const gates = requiredGates(backup);
  assert.ok(gates.includes("NORMALIZE_INPUT"));
  assert.ok(gates.includes("MODEL_TESTS"));
  assert.ok(gates.includes("FINANCIAL_RECONCILIATION"));
});

test("sensitive outbound send is blocked without Manuel approval", () => {
  assert.equal(canSendOutbound("AFE").reason, "MANUEL_APPROVAL_REQUIRED");
  assert.equal(canSendOutbound("CONTRACT").allowed, false);
});

test("sensitive outbound send passes only with Manuel approval evidence", () => {
  assert.equal(
    canSendOutbound("ECONOMIC", {
      approved: true,
      actor: "manuel",
      approvedAt: "2026-10-02T14:40:00Z",
      evidence: "chat approval",
    }).allowed,
    true,
  );
});

test("original confidential model source is not copied to Git", () => {
  assert.equal(shouldCopyOriginalToGit(current), false);
});
