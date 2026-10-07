import { NextRequest, NextResponse } from "next/server";
import { verifyZKProofPackage, ZKProofPackage } from "@/lib/zk/engine";
import { checkBlockchainCredentialStatus } from "@/lib/blockchain/registry";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const proofPackage: ZKProofPackage = body.proofPackage;
    const localStatus: "active" | "revoked" | "pending" | "not_issued" =
      body.localStatus || "active";
    const localRevocationReason: string | undefined = body.localRevocationReason;

    const zkResult = verifyZKProofPackage(proofPackage);
    const chainResult = await checkBlockchainCredentialStatus({
      credentialId: proofPackage?.publicOutputSummary?.credentialId || "KV-RVSCET-2026-000184",
      localStatus,
      localRevocationReason,
    });

    const overallVerified =
      zkResult.cryptographicallyValid &&
      zkResult.claimSatisfied &&
      chainResult.isValidOnChain &&
      chainResult.status === "active";

    return NextResponse.json({
      ok: true,
      overallVerified,
      zkVerification: zkResult,
      blockchainVerification: chainResult,
      privacyManifest: proofPackage?.privacyManifest,
      summary: proofPackage?.publicOutputSummary,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error:
          "We couldn't verify the proof against the credential registry. Please try again.",
      },
      { status: 400 }
    );
  }
}
