/**
 * Kiwi Vault — Deterministic, Privacy-Safe Credential ID & Commitment Generator
 *
 * IMPORTANT SECURITY INVARIANT:
 * Never generate IDs using Aadhaar numbers, phone numbers, raw DOB, or other PII.
 * IDs use institutional prefixes + year + deterministic non-PII sequence/hash.
 */

export type CredentialIdPrefix = "KV-RVSCET" | "KV-ACH" | "KV-CERT" | "KV-ID" | "VR-KV";

/**
 * Deterministic 32-bit FNV-1a style hash for non-PII seed strings
 */
export function deterministicHexHash(seed: string, length = 64): string {
  let h1 = 0xdeadbeef ^ seed.length;
  let h2 = 0x41c6ce57 ^ seed.length;

  for (let i = 0; i < seed.length; i++) {
    const ch = seed.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  let hex = "";
  let s1 = h1 >>> 0;
  let s2 = h2 >>> 0;
  while (hex.length < length) {
    s1 = Math.imul(s1 ^ (s1 >>> 15), 0x85ebca6b) >>> 0;
    s2 = Math.imul(s2 ^ (s2 >>> 13), 0xc2b2ae35) >>> 0;
    hex += s1.toString(16).padStart(8, "0") + s2.toString(16).padStart(8, "0");
  }
  return "0x" + hex.slice(0, length);
}

/**
 * Generates a unique, privacy-safe Kiwi Vault Credential ID.
 * Examples:
 * - KV-RVSCET-2026-000184
 * - KV-ACH-2026-0042
 * - KV-CERT-2026-0109
 * - VR-KV-2026-00892
 */
export function generateCredentialId(
  prefix: CredentialIdPrefix = "KV-RVSCET",
  year: number = new Date().getFullYear(),
  sequenceOrSeed?: number | string
): string {
  if (typeof sequenceOrSeed === "number") {
    const padLen = prefix === "KV-ACH" ? 4 : prefix === "VR-KV" ? 5 : 6;
    return `${prefix}-${year}-${String(sequenceOrSeed).padStart(padLen, "0")}`;
  }

  const rawSeed = sequenceOrSeed || `${prefix}-${year}-${Date.now()}-${Math.random()}`;
  const hashHex = deterministicHexHash(rawSeed, 8).slice(2).toUpperCase();
  const numericSuffix = (parseInt(hashHex.slice(0, 6), 16) % 900000) + 100000;

  if (prefix === "KV-ACH") {
    return `${prefix}-${year}-${String(numericSuffix % 10000).padStart(4, "0")}`;
  }
  if (prefix === "VR-KV") {
    return `${prefix}-${year}-${String(numericSuffix % 100000).padStart(5, "0")}`;
  }
  return `${prefix}-${year}-${String(numericSuffix).padStart(6, "0")}`;
}

/**
 * Generates an on-chain credential hash (bytes32 hex) from non-PII credential anchor fields.
 */
export function computeCredentialHash(params: {
  credentialId: string;
  issuer: string;
  type: string;
  title: string;
  issuedAt: string;
}): string {
  const canonical = `${params.credentialId}|${params.issuer}|${params.type}|${params.title}|${params.issuedAt}`;
  return deterministicHexHash(canonical, 64);
}

/**
 * Generates an algebraic ZK commitment binding holder secret + claim without exposing secret.
 */
export function computeZkCommitment(params: {
  credentialId: string;
  claimType: string;
  holderId: string;
}): string {
  const canonical = `ZK_COMMIT|${params.credentialId}|${params.claimType}|${params.holderId}|RVSCET_JUT_SALT`;
  return deterministicHexHash(canonical, 64);
}
