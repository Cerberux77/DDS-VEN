import "server-only";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

type ParsedScrypt = {
  saltHex: string;
  expected: Buffer;
};

function parseLegacyScrypt(encoded: string): ParsedScrypt | null {
  const [scheme, saltHex, hashHex, ...rest] = encoded.split(":");
  if (
    scheme !== "scrypt" ||
    rest.length ||
    !/^[0-9a-f]{32}$/i.test(saltHex) ||
    !/^[0-9a-f]+$/i.test(hashHex) ||
    hashHex.length % 2 !== 0
  ) {
    return null;
  }
  return { saltHex, expected: Buffer.from(hashHex, "hex") };
}

function safeEqual(a: Buffer, b: Buffer) {
  return a.length === b.length && timingSafeEqual(a, b);
}

export function hashPassword(password: string) {
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, 64);
  return `scrypt:${salt.toString("hex")}:${derived.toString("hex")}`;
}

/**
 * Legacy DDS hashes are stored as:
 *   scrypt:<16-byte salt as hex>:<derived key as hex>
 *
 * New registrations use the underlying 16-byte salt. The verifier also accepts
 * the printable hex salt representation used by an earlier portal revision so
 * existing hashes remain valid without reset.
 */
export function verifyLegacyPassword(password: string, encoded: string) {
  const parsed = parseLegacyScrypt(encoded);
  if (!parsed || !password) return false;

  const candidates = [
    Buffer.from(parsed.saltHex, "hex"),
    Buffer.from(parsed.saltHex, "utf8"),
  ];

  for (const salt of candidates) {
    try {
      const derived = scryptSync(password, salt, parsed.expected.length);
      if (safeEqual(derived, parsed.expected)) return true;
    } catch {
      // Fail closed and try the alternate legacy salt representation.
    }
  }
  return false;
}
