import { NextRequest, NextResponse } from "next/server";
import {
  generateAgeZKProof,
  generateDegreeZKProof,
  generateSelectiveClaimZKProof,
} from "@/lib/zk/engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { proofType } = body;

    if (proofType === "age") {
      const pkg = generateAgeZKProof({
        privateDateOfBirth: body.privateDateOfBirth || "2006-05-14",
        privateHolderSecret: body.privateHolderSecret || "KV_DEFAULT_SECRET",
        minimumAge: Number(body.minimumAge || 18),
        currentDate: body.currentDate || "2026-10-07",
        credentialId: body.credentialId || "KV-ID-2024-000103",
        issuer: body.issuer || "RVS College of Engineering & Technology, Jamshedpur",
      });
      return NextResponse.json({ ok: true, proofPackage: pkg });
    }

    if (proofType === "degree" || proofType === "student_status") {
      const pkg = generateDegreeZKProof({
        privateStudentId: body.privateStudentId || "JUT-RVSCET-CSE-PRIVATE",
        privateHolderSecret: body.privateHolderSecret || "KV_DEFAULT_SECRET",
        privateCredentialSalt: body.credentialId || "KV_CRED_SALT",
        degreeProgram: body.degreeProgram || "B.Tech",
        branch: body.branch || "Computer Science & Engineering",
        issuer: body.issuer || "RVS College of Engineering & Technology, Jamshedpur",
        credentialId: body.credentialId || "KV-RVSCET-2028-000124",
        claimLabel: body.claimLabel,
      });
      return NextResponse.json({ ok: true, proofPackage: pkg });
    }

    const circuitMap = {
      achievement: "AchievementVerificationCircuit",
      certificate: "CertificateVerificationCircuit",
      identity: "IdentityVerificationCircuit",
    } as const;

    const circuit =
      circuitMap[proofType as keyof typeof circuitMap] || "AchievementVerificationCircuit";

    const pkg = generateSelectiveClaimZKProof({
      circuit,
      privateHolderSecret: body.privateHolderSecret || "KV_DEFAULT_SECRET",
      claimTitle: body.claimLabel || body.title || "Verified RVSCET Claim",
      category: body.category || "Institutional Claim",
      issuer: body.issuer || "RVS College of Engineering & Technology, Jamshedpur",
      credentialId: body.credentialId || "KV-ACH-2026-0042",
    });

    return NextResponse.json({ ok: true, proofPackage: pkg });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error:
          "We couldn't generate the privacy proof right now. Please check your credential selection and try again.",
      },
      { status: 400 }
    );
  }
}
