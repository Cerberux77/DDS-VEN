import type { DriveDocumentRecord } from "./policy.ts";

export type DriveWhitelist = {
  schemaVersion: number;
  rootDriveFolderId: string;
  records: DriveDocumentRecord[];
};

export function findWhitelistedRecord(
  whitelist: DriveWhitelist,
  driveFileId: string,
): DriveDocumentRecord | null {
  return whitelist.records.find((record) => record.driveFileId === driveFileId) ?? null;
}

export function isWhitelisted(whitelist: DriveWhitelist, driveFileId: string): boolean {
  return findWhitelistedRecord(whitelist, driveFileId) !== null;
}

export function currentRecords(whitelist: DriveWhitelist): DriveDocumentRecord[] {
  return whitelist.records.filter((record) => record.status === "CURRENT");
}

export function assertSingleCurrentPerDocumentType(whitelist: DriveWhitelist): void {
  const seen = new Map<string, string>();
  for (const record of currentRecords(whitelist)) {
    const prior = seen.get(record.documentType);
    if (prior) {
      throw new Error(
        `Multiple CURRENT records for ${record.documentType}: ${prior}, ${record.driveFileId}`,
      );
    }
    seen.set(record.documentType, record.driveFileId);
  }
}
