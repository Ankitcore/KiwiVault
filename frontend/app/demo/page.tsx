"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  GraduationCap,
  Lock,
  LockOpen,
  LucideIcon,
  RotateCcw,
  Shield,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { useVault } from "@/lib/auth/vault-context";
import {
  generateDegreeZKProof,
  verifyZKProofPackage,
  ZKProofPackage,
} from "@/lib/zk/engine";

interface DemoStepConfig {
  step: number;
  role: "ISSUER" | "STUDENT" | "VERIFIER";
  navTitle: string;
  stageTitle: string;
  stageSubtitle: string;
  icon: LucideIcon;
}

const DEMO_STEPS: DemoStepConfig[] = [
  {
    step: 1,
    role: "ISSUER",
    navTitle: "Institution Issues Credential",
    stageTitle: "Issuing the Credential",
    stageSubtitle: "RVS College creates a new academic record.",
    icon: FileSpreadsheet,
  },
  {
    step: 2,
    role: "STUDENT",
    navTitle: "Student Receives to Vault",
    stageTitle: "Student's Digital Vault",
    stageSubtitle: "The credential is now secured in Shivam's wallet.",
    icon: Lock,
  },
  {
    step: 3,
    role: "VERIFIER",
    navTitle: "Verifier Requests Proof",
    stageTitle: "Verification Request",
    stageSubtitle: "Verifier asks to confirm degree qualification without raw documents.",
    icon: Shield,
  },
  {
    step: 4,
    role: "STUDENT",
    navTitle: "Zero-Knowledge Proof Generated",
    stageTitle: "Generating Zero-Knowledge Proof",
    stageSubtitle: "Kiwi Vault computes a Groth16 proof while keeping personal data hidden.",
    icon: Zap,
  },
  {
    step: 5,
    role: "VERIFIER",
    navTitle: "Verification Success",
    stageTitle: "Credential Verified",
    stageSubtitle: "Verifier confirms the B.Tech CSE claim with zero private data exposed.",
    icon: CheckCircle2,
  },
  {
    step: 6,
    role: "ISSUER",
    navTitle: "Institution Revokes",
    stageTitle: "Revoking the Credential",
    stageSubtitle: "RVS College updates the on-chain registry state to revoked.",
    icon: AlertTriangle,
  },
  {
    step: 7,
    role: "VERIFIER",
    navTitle: "Verification Fails",
    stageTitle: "Verification Rejected",
    stageSubtitle: "Verifier checks registry status and automatically rejects the revoked credential.",
    icon: Lock,
  },
];

export default function JudgeDemoPage() {
  const {
    activeStudent,
    issueAcademicCredential,
    revokeAnyCredential,
    restoreAnyCredential,
  } = useVault();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [demoCredId, setDemoCredId] = useState<string>("KV-RVSCET-2028-000124");
  const [demoCredHash, setDemoCredHash] = useState<string>(
    "0x7f29a3c18b421465b72485d22e9182736455463728190a1b2c3d4e5f60718293"
  );
  const [zkProof, setZkProof] = useState<ZKProofPackage | null>(null);
  const [isRevokedState, setIsRevokedState] = useState<boolean>(false);

  const executeStepAction = (targetStep: number) => {
    setCurrentStep(targetStep);

    if (targetStep === 1) {
      restoreAnyCredential(demoCredId);
      setIsRevokedState(false);
    } else if (targetStep === 2) {
      restoreAnyCredential(demoCredId);
      setIsRevokedState(false);
      const issued = issueAcademicCredential({
        holderId: activeStudent.id,
        type: "degree",
        title: "B.Tech CSE Degree",
        subtitle: "RVS College of Engineering & Technology, Jamshedpur",
        academicYear: "2024–2028",
      });
      setDemoCredId(issued.credentialId);
      setDemoCredHash(issued.credentialHash);
    } else if (targetStep === 4 || targetStep === 5) {
      const pkg = generateDegreeZKProof({
        privateStudentId: activeStudent.registrationNumber,
        privateHolderSecret: activeStudent.privateHolderSecret,
        privateCredentialSalt: demoCredId,
        degreeProgram: "B.Tech",
        branch: "Computer Science & Engineering",
        issuer: "RVS College of Engineering & Technology, Jamshedpur",
        credentialId: demoCredId,
        claimLabel: "B.Tech CSE Degree",
      });
      verifyZKProofPackage(pkg);
      setZkProof(pkg);
      setIsRevokedState(false);
    } else if (targetStep === 6 || targetStep === 7) {
      revokeAnyCredential(demoCredId, "Administrative correction");
      setIsRevokedState(true);
    }
  };

  const activeConfig = DEMO_STEPS[currentStep - 1];

  return (
    <div className="max-w-5xl mx-auto py-10 sm:py-14 px-2 sm:px-4">
      {/* 1. HEADER SECTION */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-kiwi-600 to-kiwi-400 tracking-tight">
          How Kiwi Vault Works
        </h1>
        <p className="mt-4 mb-10 sm:mb-12 text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-medium">
          A step-by-step walkthrough of the credential lifecycle. See how Kiwi Vault protects privacy from issuance to verification.
        </p>
      </div>

      {/* 2. MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* LEFT NAVIGATION STEPPER */}
        <div className="md:col-span-4 space-y-3">
          {DEMO_STEPS.map((item) => {
            const isActive = item.step === currentStep;
            const isCompleted = item.step < currentStep;
            const StepIcon = isCompleted ? CheckCircle2 : item.icon;

            return (
              <button
                key={item.step}
                onClick={() => executeStepAction(item.step)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3.5 ${
                  isActive
                    ? "bg-[#80C332] text-white shadow-md shadow-[#80C332]/25"
                    : isCompleted
                    ? "bg-gray-100/80 dark:bg-slate-800/60 text-neutral-600 dark:text-slate-300 hover:bg-gray-100"
                    : "bg-transparent text-neutral-400 dark:text-slate-500 hover:bg-gray-50 dark:hover:bg-slate-900 hover:text-neutral-600"
                }`}
              >
                <StepIcon
                  size={18}
                  className={`shrink-0 ${
                    isActive
                      ? "text-white"
                      : isCompleted
                      ? "text-neutral-500 dark:text-slate-400"
                      : "text-neutral-400 dark:text-slate-500"
                  }`}
                />
                <div className="min-w-0">
                  <span
                    className={`block text-[10px] font-bold uppercase tracking-wider leading-tight ${
                      isActive
                        ? "text-white/85"
                        : isCompleted
                        ? "text-neutral-400 dark:text-slate-400"
                        : "text-neutral-400/80 dark:text-slate-500"
                    }`}
                  >
                    {item.role}
                  </span>
                  <span
                    className={`block text-xs sm:text-[13px] leading-snug mt-0.5 ${
                      isActive
                        ? "font-bold text-white"
                        : isCompleted
                        ? "font-medium text-neutral-600 dark:text-slate-300"
                        : "font-medium text-neutral-400 dark:text-slate-500"
                    }`}
                  >
                    {item.navTitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* RIGHT MAIN STAGE / CONTENT AREA */}
        <div className="md:col-span-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.05)] flex flex-col justify-between min-h-[430px]">
            {/* Top Stage Header + Dynamic Content */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col">
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                  {activeConfig.stageTitle}
                </h2>
                <p className="text-sm text-neutral-500 dark:text-slate-400 mt-1">
                  {activeConfig.stageSubtitle}
                </p>
              </div>

              {/* STEP 1: ISSUING THE CREDENTIAL */}
              {currentStep === 1 && (
                <div className="bg-gray-50/40 dark:bg-slate-800/40 rounded-xl border border-gray-100 dark:border-slate-800 p-6 space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-800 text-xs sm:text-sm">
                    <span className="text-neutral-500 dark:text-slate-400">
                      Student:
                    </span>
                    <span className="font-bold text-neutral-900 dark:text-white">
                      {activeStudent.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-800 text-xs sm:text-sm">
                    <span className="text-neutral-500 dark:text-slate-400">
                      Credential:
                    </span>
                    <span className="font-bold text-neutral-900 dark:text-white">
                      B.Tech CSE Degree
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-800 text-xs sm:text-sm">
                    <span className="text-neutral-500 dark:text-slate-400">
                      Aadhaar:
                    </span>
                    <span
                      className="font-semibold text-neutral-700 dark:text-slate-300 blur-[4px] select-none"
                      aria-label="Masked Aadhaar"
                    >
                      1234 5678 9012
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-800 text-xs sm:text-sm">
                    <span className="text-neutral-500 dark:text-slate-400">
                      DOB:
                    </span>
                    <span
                      className="font-semibold text-neutral-700 dark:text-slate-300 blur-[4px] select-none"
                      aria-label="Masked Date of Birth"
                    >
                      14/05/2006
                    </span>
                  </div>

                  <div className="pt-3 space-y-2">
                    <p className="text-xs text-neutral-400 dark:text-slate-400 text-center">
                      Generating blockchain commitment...
                    </p>
                    <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
                      <div className="h-full w-full rounded-full bg-[#80C332] transition-all duration-500" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: STUDENT'S DIGITAL VAULT */}
              {currentStep === 2 && (
                <div className="flex-1 flex items-center justify-center py-6">
                  <div className="relative w-full max-w-[290px]">
                    {/* Subtle watermark Lock icon behind top-left */}
                    <Lock
                      size={76}
                      strokeWidth={1.75}
                      className="absolute -top-6 -left-7 text-[#80C332]/25 pointer-events-none select-none"
                    />

                    {/* Centered Degree Vault Card */}
                    <div className="relative bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-[0_12px_32px_rgb(0,0,0,0.06)] overflow-hidden">
                      <div className="bg-[#F6FBF2] dark:bg-kiwi-950/30 px-5 py-3.5 flex items-center gap-2.5 border-b border-gray-100/80 dark:border-slate-700/60">
                        <GraduationCap
                          size={18}
                          className="text-neutral-800 dark:text-white"
                        />
                        <span className="font-bold text-neutral-800 dark:text-white text-sm sm:text-base">
                          Degree
                        </span>
                      </div>

                      <div className="p-5 space-y-1.5">
                        <p className="text-sm font-bold text-neutral-900 dark:text-white">
                          B.Tech Computer Science
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-slate-400">
                          RVSCET, Jamshedpur
                        </p>
                        <div className="pt-2">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800">
                            Verified Issuer
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: VERIFIER REQUESTS PROOF */}
              {currentStep === 3 && (
                <div className="bg-gray-50/40 dark:bg-slate-800/40 rounded-xl border border-gray-100 dark:border-slate-800 p-6 space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-800 text-xs sm:text-sm">
                    <span className="text-neutral-500 dark:text-slate-400">
                      Request ID:
                    </span>
                    <span className="font-mono font-bold text-neutral-900 dark:text-white">
                      VR-KV-2026-00892
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-800 text-xs sm:text-sm">
                    <span className="text-neutral-500 dark:text-slate-400">
                      Claim Requested:
                    </span>
                    <span className="font-bold text-neutral-900 dark:text-white">
                      B.Tech CSE Degree
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-800 text-xs sm:text-sm">
                    <span className="text-neutral-500 dark:text-slate-400">
                      Expected Issuer:
                    </span>
                    <span className="font-semibold text-neutral-800 dark:text-slate-200">
                      RVSCET, Jamshedpur (JUT)
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 text-xs sm:text-sm">
                    <span className="text-neutral-500 dark:text-slate-400">
                      Disclosure Mode:
                    </span>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F6FBF2] dark:bg-kiwi-950 text-[#589017] dark:text-kiwi-300 border border-kiwi-200 dark:border-kiwi-800">
                      Zero-Knowledge Selective Proof
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 4: ZERO-KNOWLEDGE PROOF GENERATED */}
              {currentStep === 4 && (
                <div className="bg-gray-50/40 dark:bg-slate-800/40 rounded-xl border border-gray-100 dark:border-slate-800 p-6 space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-800 text-xs sm:text-sm">
                    <span className="text-neutral-500 dark:text-slate-400">
                      Circuit:
                    </span>
                    <span className="font-mono font-bold text-neutral-900 dark:text-white">
                      DegreeVerificationCircuit (Groth16)
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-800 text-xs sm:text-sm">
                    <span className="text-neutral-500 dark:text-slate-400">
                      Public Claim Output:
                    </span>
                    <span className="font-bold text-[#589017] dark:text-kiwi-400">
                      B.Tech CSE = TRUE
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-800 text-xs sm:text-sm">
                    <span className="text-neutral-500 dark:text-slate-400">
                      Private Witness (Aadhaar &amp; DOB):
                    </span>
                    <span className="font-semibold text-neutral-700 dark:text-slate-300 blur-[4px] select-none">
                      1234 5678 • 14/05/2006
                    </span>
                  </div>

                  <div className="pt-3 space-y-2">
                    <p className="text-xs text-neutral-400 dark:text-slate-400 text-center">
                      Proof generated locally ({demoCredHash.slice(0, 18)}...)
                    </p>
                    <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
                      <div className="h-full w-full rounded-full bg-[#80C332] transition-all duration-500" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: VERIFICATION SUCCESS */}
              {currentStep === 5 && (
                <div className="bg-white dark:bg-slate-800/40 rounded-xl border border-gray-100 dark:border-slate-800 p-6 space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F6FBF2] dark:bg-kiwi-950 text-[#80C332] flex items-center justify-center border border-kiwi-200 dark:border-kiwi-800">
                        <LockOpen size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neutral-900 dark:text-white">
                          ✓ Credential Verified
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-slate-400">
                          Credential ID: {demoCredId} • Status: Active
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-[#F6FBF2]/80 dark:bg-kiwi-950/30 border border-kiwi-100 dark:border-kiwi-900 space-y-1.5">
                      <p className="font-bold text-neutral-800 dark:text-kiwi-300 uppercase tracking-wider text-[10px]">
                        Revealed to Verifier
                      </p>
                      <p className="text-neutral-700 dark:text-slate-200 font-medium">
                        ✓ Degree: B.Tech CSE
                      </p>
                      <p className="text-neutral-700 dark:text-slate-200 font-medium">
                        ✓ Issuer: RVSCET, Jamshedpur
                      </p>
                      <p className="text-neutral-700 dark:text-slate-200 font-medium">
                        ✓ Credential Status: Active
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 space-y-1.5">
                      <p className="font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                        Remained Private in Vault
                      </p>
                      <p className="text-neutral-500 dark:text-slate-400">
                        🔒 Aadhaar &amp; Date of Birth
                      </p>
                      <p className="text-neutral-500 dark:text-slate-400">
                        🔒 Address &amp; Phone Number
                      </p>
                      <p className="text-neutral-500 dark:text-slate-400">
                        🔒 Student ID &amp; Full Marksheet
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: INSTITUTION REVOKES */}
              {currentStep === 6 && (
                <div className="bg-gray-50/40 dark:bg-slate-800/40 rounded-xl border border-gray-100 dark:border-slate-800 p-6 space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-800 text-xs sm:text-sm">
                    <span className="text-neutral-500 dark:text-slate-400">
                      Credential ID:
                    </span>
                    <span className="font-mono font-bold text-neutral-900 dark:text-white">
                      {demoCredId}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-800 text-xs sm:text-sm">
                    <span className="text-neutral-500 dark:text-slate-400">
                      Authority:
                    </span>
                    <span className="font-bold text-neutral-900 dark:text-white">
                      RVSCET Registrar
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-800 text-xs sm:text-sm">
                    <span className="text-neutral-500 dark:text-slate-400">
                      Revocation Reason:
                    </span>
                    <span className="font-semibold text-neutral-800 dark:text-slate-200">
                      Administrative correction
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 text-xs sm:text-sm">
                    <span className="text-neutral-500 dark:text-slate-400">
                      New Registry State:
                    </span>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                      Revoked
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 7: VERIFICATION FAILS */}
              {currentStep === 7 && (
                <div className="flex-1 flex items-center justify-center py-4">
                  <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl border border-rose-100 dark:border-rose-900/60 shadow-[0_12px_32px_rgb(0,0,0,0.05)] p-6 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-200/70 dark:border-rose-800">
                      <ShieldAlert size={24} />
                    </div>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                      🔒 Credential Revoked — Verification Failed
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-slate-400 leading-relaxed">
                      The verifier checked the on-chain status for{" "}
                      <span className="font-mono font-semibold text-neutral-700 dark:text-slate-200">
                        {demoCredId}
                      </span>{" "}
                      and rejected the proof because the credential was revoked by RVSCET. All personal student data remained private.
                    </p>
                    <div className="pt-1">
                      <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-gray-100 dark:bg-slate-700 text-neutral-600 dark:text-slate-300">
                        0 Bytes of PII Exposed
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 5. NAVIGATION & ACTION FOOTER */}
            <div className="px-6 sm:px-8 py-5 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  onClick={() => executeStepAction(Math.max(1, currentStep - 1))}
                  className="text-xs sm:text-sm font-semibold text-neutral-500 hover:text-neutral-800 dark:text-slate-400 dark:hover:text-white transition"
                >
                  Previous Step
                </button>
              ) : (
                <div />
              )}

              {currentStep < DEMO_STEPS.length ? (
                <button
                  onClick={() =>
                    executeStepAction(Math.min(DEMO_STEPS.length, currentStep + 1))
                  }
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-kiwi-600 hover:bg-kiwi-500 text-white shadow-lg shadow-kiwi-600/20 transition-all hover:translate-x-1"
                >
                  <span>Next Step</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  onClick={() => executeStepAction(1)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-kiwi-600 hover:bg-kiwi-500 text-white shadow-lg shadow-kiwi-600/20 transition-all hover:scale-105"
                >
                  <RotateCcw size={16} />
                  <span>Restart Walkthrough</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
