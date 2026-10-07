import { describe, expect, it } from "vitest";
import {
  computeCredentialHash,
  computeZkCommitment,
  generateCredentialId,
} from "@/lib/credentials/id-generator";
import {
  buildPrivacySafeQrData,
  evaluatePrivateAgeEligibility,
  formatDobForHolderView,
  generateAgeZKProof,
  generateDegreeZKProof,
  generateSelectiveClaimZKProof,
  verifyZKProofPackage,
} from "@/lib/zk/engine";
import { checkBlockchainCredentialStatus } from "@/lib/blockchain/registry";
import {
  DEMO_STUDENTS,
  INITIAL_ACADEMIC_CREDENTIALS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_CERTIFICATIONS,
  INITIAL_IDENTITY_REFERENCES,
  INITIAL_VERIFICATION_REQUESTS,
} from "@/lib/credentials/seed-data";

describe("Kiwi Vault — Core Cryptographic, ZK, and Credential Suite", () => {
  it("generates privacy-safe deterministic Credential IDs without PII", () => {
    const id1 = generateCredentialId("KV-RVSCET", 2026, 184);
    expect(id1).toBe("KV-RVSCET-2026-000184");

    const achId = generateCredentialId("KV-ACH", 2026, 42);
    expect(achId).toBe("KV-ACH-2026-0042");

    const reqId = generateCredentialId("VR-KV", 2026, 892);
    expect(reqId).toBe("VR-KV-2026-00892");
  });

  it("computes deterministic 32-byte hex credential hashes and ZK commitments", () => {
    const hash = computeCredentialHash({
      credentialId: "KV-RVSCET-2026-000184",
      issuer: "RVSCET Jamshedpur",
      type: "degree",
      title: "B.Tech CSE",
      issuedAt: "2026-06-30",
    });
    expect(hash.startsWith("0x")).toBe(true);
    expect(hash.length).toBe(66);

    const commitment = computeZkCommitment({
      credentialId: "KV-RVSCET-2026-000184",
      claimType: "B.Tech CSE",
      holderId: "student-shivam",
    });
    expect(commitment.startsWith("0x")).toBe(true);
    expect(commitment.length).toBe(66);
  });

  it("Test Case 1: Adult demo student exists", () => {
    const adultStudent = DEMO_STUDENTS.find((s) => s.id === "student-shivam");
    expect(adultStudent).toBeDefined();
    expect(adultStudent?.name).toBe("Shivam Kumar");
    const eligibility = evaluatePrivateAgeEligibility(
      adultStudent!.privateDateOfBirth,
      18,
      "2026-10-07"
    );
    expect(eligibility.isEligible).toBe(true);
  });

  it("Test Case 2: Under-18 demo student exists with Student Identity credential KV-RVSCET-DEMO-017", () => {
    const aarav = DEMO_STUDENTS.find((s) => s.id === "student-aarav-under18");
    expect(aarav).toBeDefined();
    expect(aarav?.name).toBe("Aarav Kumar");
    expect(aarav?.registrationNumber).toBe("RVSCET-DEMO-017");
    expect(aarav?.semester).toBe(2);
    expect(aarav?.email).toBe("aarav.demo@rvscet.ac.in");
    expect(formatDobForHolderView(aarav!.privateDateOfBirth)).toBe("15/06/2010");

    const eligibility = evaluatePrivateAgeEligibility(
      aarav!.privateDateOfBirth,
      18,
      "2026-10-07"
    );
    expect(eligibility.isEligible).toBe(false);
    expect(eligibility.eligibilityLabel).toBe("Under 18");

    const idCred = INITIAL_IDENTITY_REFERENCES.find(
      (i) => i.credentialId === "KV-RVSCET-DEMO-017"
    );
    expect(idCred).toBeDefined();
    expect(idCred?.title).toBe("Student Identity");
    expect(idCred?.status).toBe("active");
  });

  it("Test Case 3: Adult student passes 'Age ≥ 18' verification", () => {
    const adultStudent = DEMO_STUDENTS.find((s) => s.id === "student-shivam")!;
    const pkg = generateAgeZKProof({
      privateDateOfBirth: adultStudent.privateDateOfBirth,
      privateHolderSecret: adultStudent.privateHolderSecret,
      minimumAge: 18,
      currentDate: "2026-10-07",
      credentialId: "KV-ID-2024-000103",
    });

    expect(pkg.circuit).toBe("AgeVerificationCircuit");
    expect(pkg.publicSignals[0]).toBe("1");
    expect(pkg.publicOutputSummary.claimSatisfied).toBe(true);

    const verified = verifyZKProofPackage(pkg);
    expect(verified.cryptographicallyValid).toBe(true);
    expect(verified.claimSatisfied).toBe(true);
  });

  it("Test Case 4: Under-18 student (Aarav Kumar) fails 'Age ≥ 18' verification", () => {
    const aarav = DEMO_STUDENTS.find((s) => s.id === "student-aarav-under18")!;
    const pkg = generateAgeZKProof({
      privateDateOfBirth: aarav.privateDateOfBirth,
      privateHolderSecret: aarav.privateHolderSecret,
      minimumAge: 18,
      currentDate: "2026-10-07",
      credentialId: "KV-RVSCET-DEMO-017",
    });

    expect(pkg.circuit).toBe("AgeVerificationCircuit");
    expect(pkg.publicSignals[0]).toBe("0"); // Age >= 18 == FALSE
    expect(pkg.publicOutputSummary.claimSatisfied).toBe(false);

    const verified = verifyZKProofPackage(pkg);
    expect(verified.cryptographicallyValid).toBe(true);
    expect(verified.claimSatisfied).toBe(false);
  });

  it("Test Case 5: Actual DOB is NOT displayed in the verifier result or QR payload", () => {
    const aarav = DEMO_STUDENTS.find((s) => s.id === "student-aarav-under18")!;
    const pkg = generateAgeZKProof({
      privateDateOfBirth: aarav.privateDateOfBirth,
      privateHolderSecret: aarav.privateHolderSecret,
      minimumAge: 18,
      currentDate: "2026-10-07",
      credentialId: "KV-RVSCET-DEMO-017",
    });

    const verifierVisibleJson = JSON.stringify({
      publicSignals: pkg.publicSignals,
      publicOutputSummary: pkg.publicOutputSummary,
      revealed: pkg.privacyManifest.revealed,
    });

    expect(verifierVisibleJson.includes("2010-06-15")).toBe(false);
    expect(verifierVisibleJson.includes("15/06/2010")).toBe(false);
    expect(verifierVisibleJson.includes("20100615")).toBe(false);

    const qrPayload = buildPrivacySafeQrData({
      requestId: "VR-KV-DEMO-017",
      credentialId: "KV-RVSCET-DEMO-017",
      claim: "Age ≥ 18",
      commitmentHash: pkg.publicOutputSummary.commitmentHash,
    });
    expect(qrPayload.includes("2010-06-15")).toBe(false);
    expect(qrPayload.includes("15/06/2010")).toBe(false);
    expect(qrPayload.includes("Aarav")).toBe(false);
  });

  it("Test Case 6: Privacy summary shows 'Date of birth' under NOT REVEALED", () => {
    const aarav = DEMO_STUDENTS.find((s) => s.id === "student-aarav-under18")!;
    const pkg = generateAgeZKProof({
      privateDateOfBirth: aarav.privateDateOfBirth,
      privateHolderSecret: aarav.privateHolderSecret,
      minimumAge: 18,
      currentDate: "2026-10-07",
      credentialId: "KV-RVSCET-DEMO-017",
    });

    expect(pkg.privacyManifest.revealed).toContain(
      "❌ Age ≥ 18 requirement was not satisfied"
    );
    expect(pkg.privacyManifest.revealed).toContain("✓ Credential issuer");
    expect(pkg.privacyManifest.revealed).toContain(
      "✓ Credential validity/status"
    );

    expect(pkg.privacyManifest.hidden).toContain("Date of birth");
    expect(pkg.privacyManifest.hidden).toContain("Aadhaar");
    expect(pkg.privacyManifest.hidden).toContain("Address");
    expect(pkg.privacyManifest.hidden).toContain("Phone number");
    expect(pkg.privacyManifest.hidden).toContain("Student ID");
    expect(pkg.privacyManifest.hidden).toContain("Full identity credential");
  });

  it("Test Case 7: Credential status remains ACTIVE even though the age claim failed", async () => {
    const idCred = INITIAL_IDENTITY_REFERENCES.find(
      (i) => i.credentialId === "KV-RVSCET-DEMO-017"
    )!;
    const aarav = DEMO_STUDENTS.find((s) => s.id === "student-aarav-under18")!;

    const pkg = generateAgeZKProof({
      privateDateOfBirth: aarav.privateDateOfBirth,
      privateHolderSecret: aarav.privateHolderSecret,
      minimumAge: 18,
      currentDate: "2026-10-07",
      credentialId: idCred.credentialId,
    });

    expect(pkg.publicOutputSummary.claimSatisfied).toBe(false);
    expect(idCred.status).toBe("active");

    const chainStatus = await checkBlockchainCredentialStatus({
      credentialId: idCred.credentialId,
      localStatus: idCred.status,
    });
    expect(chainStatus.status).toBe("active");
    expect(chainStatus.isValidOnChain).toBe(true);
  });

  it("Test Case 8: Switching between Adult and Under-18 demo scenarios works", () => {
    const shivam = DEMO_STUDENTS.find((s) => s.id === "student-shivam")!;
    const aarav = DEMO_STUDENTS.find((s) => s.id === "student-aarav-under18")!;

    const adultProof = generateAgeZKProof({
      privateDateOfBirth: shivam.privateDateOfBirth,
      privateHolderSecret: shivam.privateHolderSecret,
      minimumAge: 18,
      currentDate: "2026-10-07",
      credentialId: "KV-ID-2024-000103",
    });
    const under18Proof = generateAgeZKProof({
      privateDateOfBirth: aarav.privateDateOfBirth,
      privateHolderSecret: aarav.privateHolderSecret,
      minimumAge: 18,
      currentDate: "2026-10-07",
      credentialId: "KV-RVSCET-DEMO-017",
    });

    expect(verifyZKProofPackage(adultProof).claimSatisfied).toBe(true);
    expect(verifyZKProofPackage(under18Proof).claimSatisfied).toBe(false);

    const historyEntry = INITIAL_VERIFICATION_REQUESTS.find(
      (r) => r.requestId === "VR-KV-DEMO-017"
    );
    expect(historyEntry).toBeDefined();
    expect(historyEntry?.studentName).toBe("Aarav Kumar");
    expect(historyEntry?.status).toBe("age_restricted");
    expect(historyEntry?.failureReason).toBe("Age requirement not satisfied");
    expect(historyEntry?.privacyNote).toBe("DOB NOT REVEALED");
  });

  it("Test Case 9: Changing the DOB dynamically changes the verification result (not hardcoded by student name)", () => {
    const aarav = DEMO_STUDENTS.find((s) => s.id === "student-aarav-under18")!;

    // 1. With Aarav's default Under-18 DOB (15/06/2010), Age >= 18 is FALSE
    const failProof = generateAgeZKProof({
      privateDateOfBirth: "15/06/2010",
      privateHolderSecret: aarav.privateHolderSecret,
      minimumAge: 18,
      currentDate: "2026-10-07",
      credentialId: "KV-RVSCET-DEMO-017",
    });
    expect(verifyZKProofPackage(failProof).claimSatisfied).toBe(false);

    // 2. If Aarav's DOB is dynamically updated to an adult DOB (15/06/2005), Age >= 18 becomes TRUE
    const passProof = generateAgeZKProof({
      privateDateOfBirth: "15/06/2005",
      privateHolderSecret: aarav.privateHolderSecret,
      minimumAge: 18,
      currentDate: "2026-10-07",
      credentialId: "KV-RVSCET-DEMO-017",
    });
    expect(verifyZKProofPackage(passProof).claimSatisfied).toBe(true);
  });

  it("generates and verifies DegreeVerificationCircuit proof with strict privacy separation", () => {
    const pkg = generateDegreeZKProof({
      privateStudentId: "JUT-RVSCET-2024-CSE-042",
      privateHolderSecret: "KV_SECRET_SHIVAM",
      privateCredentialSalt: "KV-RVSCET-2028-000124",
      degreeProgram: "B.Tech",
      branch: "Computer Science & Engineering",
      issuer: "RVS College of Engineering & Technology, Jamshedpur",
      credentialId: "KV-RVSCET-2028-000124",
    });

    expect(pkg.circuit).toBe("DegreeVerificationCircuit");
    const verification = verifyZKProofPackage(pkg);
    expect(verification.cryptographicallyValid).toBe(true);
    expect(verification.claimSatisfied).toBe(true);
    expect(pkg.privacyManifest.hidden).toContain("Aadhaar Number");
    expect(pkg.privacyManifest.hidden).toContain("Date of Birth (DOB)");
  });

  it("verifies selective achievement and identity proofs", () => {
    const achProof = generateSelectiveClaimZKProof({
      circuit: "AchievementVerificationCircuit",
      privateHolderSecret: "KV_SECRET_SHIVAM",
      claimTitle: "Smart India Hackathon 2026 — Winner",
      category: "Hackathon",
      issuer: "RVS College of Engineering & Technology, Jamshedpur",
      credentialId: "KV-ACH-2026-0042",
    });
    expect(verifyZKProofPackage(achProof).claimSatisfied).toBe(true);
  });

  it("seeds all 4 RVSCET demo students and RVSCET club achievements", () => {
    expect(DEMO_STUDENTS.length).toBe(4);
    expect(INITIAL_ACADEMIC_CREDENTIALS.length).toBeGreaterThan(10);
    expect(INITIAL_ACHIEVEMENTS.length).toBeGreaterThan(6);
    expect(INITIAL_CERTIFICATIONS.length).toBeGreaterThan(4);
  });
});

