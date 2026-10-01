export const ACCESS_LEVELS = ["NONE", "PREVIEW", "RELEASED", "SOURCE_RELEASED"] as const;
export type AccessLevel = (typeof ACCESS_LEVELS)[number];
export type Operation = "VIEW_PREVIEW" | "VIEW_RELEASED" | "DOWNLOAD_SOURCE";

export type AccessInput = {
  authenticated: boolean;
  termsAccepted: boolean;
  grant: AccessLevel;
  documentState: Exclude<AccessLevel, "NONE">;
  canDownload: boolean;
  revoked: boolean;
};

const rank = (v: AccessLevel) => ACCESS_LEVELS.indexOf(v);

export function decideAccess(input: AccessInput, operation: Operation) {
  if (!input.authenticated) return { allowed: false, reason: "AUTH_REQUIRED" } as const;
  if (input.revoked) return { allowed: false, reason: "GRANT_REVOKED" } as const;
  if (!input.termsAccepted) return { allowed: false, reason: "TERMS_REQUIRED" } as const;

  const effective = Math.min(rank(input.grant), rank(input.documentState));
  if (operation === "VIEW_PREVIEW") {
    return effective >= rank("PREVIEW")
      ? ({ allowed: true, reason: "PREVIEW_GRANTED" } as const)
      : ({ allowed: false, reason: "PREVIEW_NOT_GRANTED" } as const);
  }
  if (operation === "VIEW_RELEASED") {
    return effective >= rank("RELEASED")
      ? ({ allowed: true, reason: "RELEASED_GRANTED" } as const)
      : ({ allowed: false, reason: "RELEASED_NOT_GRANTED" } as const);
  }
  return effective >= rank("SOURCE_RELEASED") && input.canDownload
    ? ({ allowed: true, reason: "SOURCE_DOWNLOAD_GRANTED" } as const)
    : ({ allowed: false, reason: "SOURCE_DOWNLOAD_DENIED" } as const);
}
