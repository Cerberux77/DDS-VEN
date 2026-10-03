export const LIFECYCLE_STATUSES = [
  "CURRENT",
  "APPROVED",
  "CANDIDATE",
  "DRAFT",
  "BLOCKED_EXTERNAL",
  "SUPERSEDED",
  "ARCHIVE",
] as const;
export type LifecycleStatus = (typeof LIFECYCLE_STATUSES)[number];

export const COMMUNICATION_STATES = [
  "INTERNAL_MANAGEMENT_DRAFT",
  "EXTERNAL_PRESENTATION_READY",
] as const;
export type CommunicationState = (typeof COMMUNICATION_STATES)[number];

export const GIT_POLICIES = ["METADATA_ONLY", "NORMALIZED_INPUT", "DERIVED_ARTIFACT", "DO_NOT_COPY"] as const;
export type GitPolicy = (typeof GIT_POLICIES)[number];

export const OUTBOUND_KINDS = [
  "ECONOMIC",
  "LEGAL",
  "CONTRACT",
  "AFE",
  "PARTNER_COMMITMENT",
  "FUNDING_ASK",
  "COMMERCIAL_CHANGE",
  "OPERATIONAL_NON_MATERIAL",
] as const;
export type OutboundKind = (typeof OUTBOUND_KINDS)[number];

export type DriveDocumentRecord = {
  driveFileId: string;
  canonicalPath: string;
  version: string | null;
  modifiedTime: string;
  hash: string | null;
  documentType: string;
  status: LifecycleStatus;
  gitPolicy: GitPolicy;
  relatedModelInput: string | null;
  relatedRelease: string | null;
};

export type Approval = {
  approved: boolean;
  actor: string;
  approvedAt: string;
  evidence: string;
};

export type GateResult = { allowed: boolean; reason: string };

const MANUEL_ACTORS = new Set(["manuel", "cerberux77", "manuel vera"]);
const REJECTED_GROSS_FUNDING_LABELS = [
  "required equity",
  "equity raise required",
  "required equity raise",
];

export const LIH_BASIS_LOCK = "NBV" as const;

function isManuelApproval(approval?: Approval | null): boolean {
  return Boolean(
    approval?.approved &&
    MANUEL_ACTORS.has(approval.actor.trim().toLowerCase()) &&
    approval.approvedAt &&
    approval.evidence,
  );
}

export function isSensitiveOutbound(kind: OutboundKind): boolean {
  return kind !== "OPERATIONAL_NON_MATERIAL";
}

export function canSendOutbound(kind: OutboundKind, approval?: Approval | null): GateResult {
  if (!isSensitiveOutbound(kind)) return { allowed: true, reason: "NON_MATERIAL_OUTBOUND" };
  if (!approval?.approved) return { allowed: false, reason: "MANUEL_APPROVAL_REQUIRED" };
  if (!MANUEL_ACTORS.has(approval.actor.trim().toLowerCase())) {
    return { allowed: false, reason: "APPROVER_NOT_MANUEL" };
  }
  if (!approval.approvedAt || !approval.evidence) {
    return { allowed: false, reason: "APPROVAL_EVIDENCE_INCOMPLETE" };
  }
  return { allowed: true, reason: "MANUEL_APPROVED" };
}

export function canReplaceCurrent(candidate: DriveDocumentRecord, approval?: Approval | null): GateResult {
  if (candidate.status !== "CURRENT") {
    return { allowed: false, reason: `STATUS_${candidate.status}_CANNOT_REPLACE_CURRENT` };
  }
  if (!isManuelApproval(approval)) {
    return { allowed: false, reason: "BASELINE_PROMOTION_REQUIRES_MANUEL_APPROVAL" };
  }
  return { allowed: true, reason: "CURRENT_PROMOTION_APPROVED" };
}

export function canMergePullRequest(approval?: Approval | null): GateResult {
  return isManuelApproval(approval)
    ? { allowed: true, reason: "MANUEL_MERGE_APPROVED" }
    : { allowed: false, reason: "MANUEL_MERGE_APPROVAL_REQUIRED" };
}

export function canChangeLihBasis(proposedBasis: string, approval?: Approval | null): GateResult {
  if (proposedBasis.trim().toUpperCase() === LIH_BASIS_LOCK) {
    return { allowed: true, reason: "LIH_NBV_LOCK_PRESERVED" };
  }
  return isManuelApproval(approval)
    ? { allowed: true, reason: "MANUAL_DECISION_GATE_APPROVED" }
    : { allowed: false, reason: "MANUAL_DECISION_GATE_REQUIRED" };
}

export function validateGrossFundingLabel(label: string): GateResult {
  const normalized = label.trim().toLowerCase();
  if (REJECTED_GROSS_FUNDING_LABELS.some((term) => normalized.includes(term))) {
    return { allowed: false, reason: "GROSS_FUNDING_CANNOT_BE_LABELLED_EQUITY" };
  }
  return { allowed: true, reason: "GROSS_FUNDING_WORDING_ACCEPTED" };
}

export function canApproveLeasing(input: {
  status: "PENDING_EXTERNAL" | "PENDING_LEASING" | "RESOLVED";
  termsComplete: boolean;
}): GateResult {
  if (input.status !== "RESOLVED" || !input.termsComplete) {
    return { allowed: false, reason: "LEASING_TERMS_UNRESOLVED" };
  }
  return { allowed: true, reason: "LEASING_TERMS_RESOLVED" };
}

export function canPromoteCustoms(input: {
  status: "PENDING_CUSTOMS_VALIDATION" | "FORMALLY_VALIDATED";
  formalEvidence: boolean;
}): GateResult {
  if (input.status !== "FORMALLY_VALIDATED" || !input.formalEvidence) {
    return { allowed: false, reason: "FORMAL_CUSTOMS_EVIDENCE_REQUIRED" };
  }
  return { allowed: true, reason: "CUSTOMS_FORMALLY_VALIDATED" };
}

export function validateAustralAssetWording(text: string): GateResult {
  const normalized = text.trim().toLowerCase();
  if (normalized.includes("austral owns zero") || normalized.includes("austral posee cero")) {
    return { allowed: false, reason: "UNSUPPORTED_ZERO_OWNED_ASSETS_CLAIM" };
  }
  if (normalized.includes("0 confirmed") || normalized.includes("0 confirmed asset contribution")) {
    return { allowed: true, reason: "EVIDENCE_STATUS_WORDING_ACCEPTED" };
  }
  return { allowed: true, reason: "NO_ZERO_OWNERSHIP_CLAIM" };
}

export function canApproveFinancialArtifact(input: {
  computationValid: boolean;
  xlsxGenerated: boolean;
  formulasVerified: boolean;
  visualQaComplete: boolean;
  machineReconciliationPass: boolean;
}): GateResult {
  const ready =
    input.computationValid &&
    input.xlsxGenerated &&
    input.formulasVerified &&
    input.visualQaComplete &&
    input.machineReconciliationPass;
  return ready
    ? { allowed: true, reason: "FINANCIAL_ARTIFACT_APPROVAL_READY" }
    : { allowed: false, reason: "ARTIFACT_PERSISTENCE_OR_QA_OPEN" };
}

export function canReleaseS05(input: {
  computationalUiReconciliation: boolean;
  ciPass: boolean;
  visualQa: "PASS" | "OPEN_ACCESS_GATE";
  visualWaiver?: Approval | null;
  releaseApproval?: Approval | null;
}): GateResult {
  if (!input.computationalUiReconciliation || !input.ciPass) {
    return { allowed: false, reason: "S05_COMPUTATIONAL_OR_CI_GATE_OPEN" };
  }
  if (input.visualQa !== "PASS" && !isManuelApproval(input.visualWaiver)) {
    return { allowed: false, reason: "S05_VISUAL_QA_OR_MANUEL_WAIVER_REQUIRED" };
  }
  if (!isManuelApproval(input.releaseApproval)) {
    return { allowed: false, reason: "MANUEL_RELEASE_APPROVAL_REQUIRED" };
  }
  return { allowed: true, reason: "S05_RELEASE_APPROVED" };
}

export function externalPresentationState(input: {
  financialXlsxPersisted: boolean;
  visualQaComplete: boolean;
  openGatesDisclosed: boolean;
  approval?: Approval | null;
}): CommunicationState {
  return input.financialXlsxPersisted &&
    input.visualQaComplete &&
    input.openGatesDisclosed &&
    isManuelApproval(input.approval)
    ? "EXTERNAL_PRESENTATION_READY"
    : "INTERNAL_MANAGEMENT_DRAFT";
}

export function classifyDriveChange(
  previous: DriveDocumentRecord | null,
  next: DriveDocumentRecord,
): "ADDED" | "MODIFIED" | "UNCHANGED" {
  if (!previous) return "ADDED";
  const changed =
    previous.modifiedTime !== next.modifiedTime ||
    previous.hash !== next.hash ||
    previous.version !== next.version ||
    previous.status !== next.status ||
    previous.canonicalPath !== next.canonicalPath;
  return changed ? "MODIFIED" : "UNCHANGED";
}

export function requiredGates(record: DriveDocumentRecord): string[] {
  const gates = ["SOURCE_WHITELIST", "LIFECYCLE_STATUS", "EVIDENCE_CAPTURE"];
  if (record.relatedModelInput) {
    gates.push("NORMALIZE_INPUT", "MODEL_TESTS", "FINANCIAL_RECONCILIATION");
  }
  if (record.status === "CURRENT") gates.push("MANUEL_BASELINE_APPROVAL");
  return gates;
}

export function shouldCopyOriginalToGit(record: DriveDocumentRecord): boolean {
  return record.gitPolicy === "NORMALIZED_INPUT" || record.gitPolicy === "DERIVED_ARTIFACT";
}
