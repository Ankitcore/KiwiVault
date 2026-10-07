import { NextRequest, NextResponse } from "next/server";
import {
  INITIAL_ACADEMIC_CREDENTIALS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_CERTIFICATIONS,
} from "@/lib/credentials/seed-data";
import { computeCredentialHash, generateCredentialId } from "@/lib/credentials/id-generator";

export async function GET() {
  return NextResponse.json({
    ok: true,
    institution: "RVS College of Engineering & Technology, Jamshedpur",
    affiliation: "Jharkhand University of Technology (JUT)",
    counts: {
      academic: INITIAL_ACADEMIC_CREDENTIALS.length,
      achievements: INITIAL_ACHIEVEMENTS.length,
      certifications: INITIAL_CERTIFICATIONS.length,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prefix =
      body.categoryType === "achievement"
        ? "KV-ACH"
        : body.categoryType === "certificate"
        ? "KV-CERT"
        : "KV-RVSCET";
    const credentialId = generateCredentialId(prefix, new Date().getFullYear());
    const credentialHash = computeCredentialHash({
      credentialId,
      issuer: "RVS College of Engineering & Technology, Jamshedpur",
      type: body.categoryType || "academic",
      title: body.title || "RVSCET Credential",
      issuedAt: new Date().toISOString(),
    });
    return NextResponse.json({
      ok: true,
      credentialId,
      credentialHash,
      issuedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not issue credential anchor." },
      { status: 400 }
    );
  }
}
