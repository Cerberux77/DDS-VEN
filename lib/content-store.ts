import "server-only";

/**
 * Deliberately server-only. PREVIEW never calls readSource(). In production this
 * adapter should be backed by a private bucket (Neon Storage/Vercel Blob/S3) and
 * keys must never be placed in public/ or exposed as permanent public URLs.
 */
export async function readSource(storageKey: string) {
  const endpoint = process.env.PRIVATE_CONTENT_ENDPOINT;
  const token = process.env.PRIVATE_CONTENT_TOKEN;
  if (!endpoint || !token) throw new Error("Private content store is not configured");
  const url = new URL(storageKey, endpoint.endsWith("/") ? endpoint : `${endpoint}/`);
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (!response.ok) throw new Error(`Private content fetch failed: ${response.status}`);
  return response;
}
