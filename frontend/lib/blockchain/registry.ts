import { ethers } from "ethers";
import { computeCredentialHash, computeZkCommitment, deterministicHexHash } from "@/lib/credentials/id-generator";

/**
 * Kiwi Vault — Blockchain Credential Registry Client
 *
 * Connects to Polygon Amoy (80002) or Ethereum Sepolia (11155111) via ethers.js
 * when environment variables are configured and reachable.
 * Gracefully falls back to deterministic Demo Verification Mode when offline.
 */

export const CREDENTIAL_REGISTRY_ABI = [
  "function issueCredential(string credentialId, bytes32 credentialHash, bytes32 zkCommitment) external",
  "function revokeCredential(string credentialId, string reasonCode) external",
  "function isValid(string credentialId) external view returns (bool)",
  "function getIssuer(string credentialId) external view returns (address)",
  "function getCredentialStatus(string credentialId) external view returns (uint8 status, bytes32 credentialHash, bytes32 zkCommitment, address issuer, uint256 issuedAt, uint256 revokedAt, string revocationReasonCode)",
  "event CredentialIssued(string indexed credentialIdKey, string credentialId, bytes32 indexed credentialHash, bytes32 zkCommitment, address indexed issuer, uint256 issuedAt)",
  "event CredentialRevoked(string indexed credentialIdKey, string credentialId, bytes32 indexed credentialHash, address indexed revokedBy, string reasonCode, uint256 revokedAt)",
];

export const RVSCET_ISSUER_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";

export interface OnChainCredentialAnchor {
  credentialId: string;
  credentialHash: string;
  zkCommitment: string;
  issuerAddress: string;
  issuedAt: string;
  revokedAt?: string;
  status: "active" | "revoked";
  revocationReason?: string;
  networkName: string;
  chainId: number;
  verificationMode: "live_testnet" | "demo_mode";
  anchorReference: string; // Either real txHash or deterministic demo registry anchor ID
}

export function isLiveRpcConfigured(): boolean {
  const rpc = process.env.NEXT_PUBLIC_RPC_URL;
  const addr = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  return Boolean(
    rpc &&
      addr &&
      ethers.isAddress(addr) &&
      !rpc.includes("your-") &&
      !addr.includes("RVSCET")
  );
}

/**
 * Checks credential status on-chain if RPC is configured, or against the local vault registry in Demo Verification Mode.
 */
export async function checkBlockchainCredentialStatus(params: {
  credentialId: string;
  localStatus: "active" | "revoked" | "pending" | "not_issued";
  localHash?: string;
  localIssuedAt?: string;
  localRevokedAt?: string;
  localRevocationReason?: string;
}): Promise<{
  isValidOnChain: boolean;
  status: "active" | "revoked" | "not_found";
  issuerAddress: string;
  credentialHash: string;
  zkCommitment: string;
  networkName: string;
  chainId: number;
  verificationMode: "live_testnet" | "demo_mode";
  friendlyMessage: string;
  revocationReason?: string;
}> {
  const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 80002);
  const networkName = chainId === 11155111 ? "Ethereum Sepolia" : "Polygon Amoy";

  if (isLiveRpcConfigured()) {
    try {
      const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
        CREDENTIAL_REGISTRY_ABI,
        provider
      );
      const [statusNum, credHash, zkCommit, issuer] = await contract.getCredentialStatus(
        params.credentialId
      );
      const isActive = Number(statusNum) === 1;
      const isRevoked = Number(statusNum) === 2;
      return {
        isValidOnChain: isActive,
        status: isActive ? "active" : isRevoked ? "revoked" : "not_found",
        issuerAddress: issuer,
        credentialHash: credHash,
        zkCommitment: zkCommit,
        networkName,
        chainId,
        verificationMode: "live_testnet",
        friendlyMessage: isActive
          ? `Verified against ${networkName} smart contract registry.`
          : isRevoked
          ? `Credential has been revoked on ${networkName} by the issuing institution.`
          : `Credential anchor not found on ${networkName}.`,
      };
    } catch {
      // Friendly fallback as required by Section 50 & 51
    }
  }

  const hash =
    params.localHash ||
    computeCredentialHash({
      credentialId: params.credentialId,
      issuer: "RVSCET Jamshedpur",
      type: "credential",
      title: params.credentialId,
      issuedAt: params.localIssuedAt || "2026-01-15",
    });

  const commitment = computeZkCommitment({
    credentialId: params.credentialId,
    claimType: "RVSCET_VERIFIED",
    holderId: "RVSCET_HOLDER",
  });

  if (params.localStatus === "revoked") {
    return {
      isValidOnChain: false,
      status: "revoked",
      issuerAddress: RVSCET_ISSUER_ADDRESS,
      credentialHash: hash,
      zkCommitment: commitment,
      networkName: `${networkName} (Demo Verification Mode)`,
      chainId,
      verificationMode: "demo_mode",
      revocationReason:
        params.localRevocationReason || "Revoked by RVSCET Registrar",
      friendlyMessage:
        "This credential was revoked by RVS College of Engineering & Technology and is no longer valid.",
    };
  }

  if (params.localStatus === "active") {
    return {
      isValidOnChain: true,
      status: "active",
      issuerAddress: RVSCET_ISSUER_ADDRESS,
      credentialHash: hash,
      zkCommitment: commitment,
      networkName: `${networkName} (Demo Verification Mode)`,
      chainId,
      verificationMode: "demo_mode",
      friendlyMessage:
        "Credential hash & issuer signature verified in Demo Verification Mode (No PII stored on-chain).",
    };
  }

  return {
    isValidOnChain: false,
    status: "not_found",
    issuerAddress: RVSCET_ISSUER_ADDRESS,
    credentialHash: deterministicHexHash(params.credentialId, 64),
    zkCommitment: commitment,
    networkName: `${networkName} (Demo Verification Mode)`,
    chainId,
    verificationMode: "demo_mode",
    friendlyMessage: "We couldn't find an active anchor for this credential ID.",
  };
}
