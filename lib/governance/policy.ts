export const LIFECYCLE_STATUSES = ["CURRENT", "APPROVED", "DRAFT", "SUPERSEDED", "ARCHIVE"] as const;
export type LifecycleStatus = (typeof LIFECYCLE_STATUSES)[number];

export const GIT_POLICIES = ["METADATA_ONLY", "NORMALIZED_INPUT", "DERIVED_ARTIFACT", "DO_NOT_COPY"] as const;
export type GitPolicy = (typeof GIT_POLICIES)[number];

export const OUTBOUND_KINDS = [
  "ECONOMIC",
  "LEGAL",
  "CONTRACT",
  "AFE",
  "PARTNER_COMMITMENT",
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

export type GateResult = {
  allowed: boolean;
  reason: string;
};

const MANUEL_ACTORS = new Set(["manuel", "cerberux77", "manuel vera"]);

export function isSensitiveOutbound(kind: OutboundKind): boolean {
  return kind !== "OPERATIONAL_NON_MATERIAL";
}

export function canSendOutbound(kind: OutboundKind, approval?: Approval | null): GateResult {
  if (!isSensitiveOutbound(kind)) {
    return { allowed: true, reason: "NON_MATERIAL_OUTBOUND" };
  }
  if (!approval?.approved) {
    return { allowed: false, reason: "MANUEL_APPROVAL_REQUIRED" };
  }
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
  if (!approval?.approved) {
    return { allowed: false, reason: "BASELINE_PROMOTION_REQUIRES_MANUEL_APPROVAL" };
  }
  if (!MANUEL_ACTORS.has(approval.actor.trim().toLowerCase())) {
    return { allowed: false, reason: "BASELINE_APPROVER_NOT_MANUEL" };
  }
  return { allowed: true, reason: "CURRENT_PROMOTION_APPROVED" };
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
  if (record.status === "CURRENT") {
    gates.push("MANUEL_BASELINE_APPROVAL");
  }
  return gates;
}

export function shouldCopyOriginalToGit(record: DriveDocumentRecord): boolean {
  return record.gitPolicy === "NORMALIZED_INPUT" || record.gitPolicy === "DERIVED_ARTIFACT";
}
