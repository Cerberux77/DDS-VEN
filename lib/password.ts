import "server-only";
import { scryptSync, timingSafeEqual } from "node:crypto";

type ParsedScrypt = {
  saltHex: string;
  expected: Buffer;
};

function parseLegacyScrypt(encoded: string): ParsedScrypt | null {
  const [scheme, saltHex, hashHex, ...rest] = encoded.split(":");
  if (scheme !== "scrypt" || rest.length || !/^[0-9a-f]{32}$/i.test(saltHex) || !/^[0-9a-f]+$/i.test(hashHex) || hashHex.length % 2 !== 0) {
    return null;
  }
  return { saltHex, expected: Buffer.from(hashHex, "hex") };
}

function safeEqual(a: Buffer, b: Buffer) {
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Legacy DDS hashes are stored as:
 *   scrypt:<16-byte salt as hex>:<derived key as hex>
 *
 * The original implementation is preserved by accepting the two equivalent
 * salt representations used by the previous portal codebase: the printable
 * hex string and the underlying 16-byte buffer. No password is re-hashed or
 * rewritten during login.
 */
export function verifyLegacyPassword(password: string, encoded: string) {
  const parsed = parseLegacyScrypt(encoded);
  if (!parsed || !password) return false;

  const candidates = [
    Buffer.from(parsed.saltHex, "utf8"),
    Buffer.from(parsed.saltHex, "hex"),
  ];

  for (const salt of candidates) {
    try {
      const derived = scryptSync(password, salt, parsed.expected.length);
      if (safeEqual(derived, parsed.expected)) return true;
    } catch {
      // Fail closed and try the second legacy salt representation.
    }
  }
  return false;
}
