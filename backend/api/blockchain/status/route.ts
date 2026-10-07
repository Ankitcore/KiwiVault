import { NextRequest, NextResponse } from "next/server";
import { checkBlockchainCredentialStatus } from "@/lib/blockchain/registry";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const status = await checkBlockchainCredentialStatus({
      credentialId: body.credentialId || "KV-RVSCET-2026-000184",
      localStatus: body.localStatus || "active",
      localHash: body.localHash,
      localIssuedAt: body.localIssuedAt,
      localRevokedAt: body.localRevokedAt,
      localRevocationReason: body.localRevocationReason,
    });
    return NextResponse.json({ ok: true, status });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "We couldn't connect to the credential network. Please try again.",
      },
      { status: 500 }
    );
  }
}
