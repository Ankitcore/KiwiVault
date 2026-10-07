"use client";

import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  CheckCircle2,
  Copy,
  EyeOff,
  FileCode2,
  KeyRound,
  Lock,
  LockOpen,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { AnimatedLockKey, LockState } from "@/components/lock-animation";
import { KiwiLogo, RvscetLogo } from "@/components/kiwi-logo";
import {
  generateAgeZKProof,
  generateDegreeZKProof,
  generateSelectiveClaimZKProof,
  verifyZKProofPackage,
  ZKProofPackage,
} from "@/lib/zk/engine";
import { useVault } from "@/lib/auth/vault-context";

export interface ZKModalTriggerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultClaimType?: "degree" | "age" | "achievement" | "certificate" | "identity";
  credentialId?: string;
  claimTitle?: string;
  category?: string;
  minimumAge?: number;
}

const PROOF_STEPS = [
  "Preparing proof",
  "Generating proof",
  "Verifying proof",
  "Checking credential status",
  "Verified",
];

export function ZKProverModal({
  isOpen,
  onClose,
  defaultClaimType = "degree",
  credentialId = "KV-RVSCET-2028-000124",
  claimTitle = "B.Tech Computer Science & Engineering",
  category = "Academic Qualification",
  minimumAge = 18,
}: ZKModalTriggerProps) {
  const { activeStudent, findCredentialById } = useVault();

  const [selectedAgeThreshold, setSelectedAgeThreshold] = useState<number>(minimumAge);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [lockState, setLockState] = useState<LockState>("proving");
  const [proofPkg, setProofPkg] = useState<ZKProofPackage | null>(null);
  const [showRawJson, setShowRawJson] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [statusReason, setStatusReason] = useState<string | null>(null);

  useEffect(() => {
    setSelectedAgeThreshold(minimumAge);
  }, [minimumAge]);

  useEffect(() => {
    if (!isOpen) return;

    setStepIndex(0);
    setLockState("proving");
    setShowRawJson(false);
    setStatusReason(null);

    const credInfo = findCredentialById(credentialId);

    // Generate real Groth16 ZKProofPackage
    let generated: ZKProofPackage;
    if (defaultClaimType === "age") {
      generated = generateAgeZKProof({
        privateDateOfBirth: activeStudent.privateDateOfBirth,
        privateHolderSecret: activeStudent.privateHolderSecret,
        minimumAge: selectedAgeThreshold,
        credentialId,
        issuer: "RVS College of Engineering & Technology, Jamshedpur",
      });
    } else if (defaultClaimType === "degree") {
      generated = generateDegreeZKProof({
        privateStudentId: activeStudent.registrationNumber,
        privateHolderSecret: activeStudent.privateHolderSecret,
        privateCredentialSalt: credentialId,
        degreeProgram: activeStudent.program,
        branch: activeStudent.branch,
        issuer: "RVS College of Engineering & Technology, Jamshedpur",
        credentialId,
        claimLabel: claimTitle,
      });
    } else {
      const circuitMap = {
        achievement: "AchievementVerificationCircuit",
        certificate: "CertificateVerificationCircuit",
        identity: "IdentityVerificationCircuit",
      } as const;
      generated = generateSelectiveClaimZKProof({
        circuit: circuitMap[defaultClaimType] || "AchievementVerificationCircuit",
        privateHolderSecret: activeStudent.privateHolderSecret,
        claimTitle,
        category,
        issuer: "RVS College of Engineering & Technology, Jamshedpur",
        credentialId,
      });
    }

    setProofPkg(generated);

    const timers: NodeJS.Timeout[] = [];
    [1, 2, 3, 4].forEach((idx) => {
      timers.push(
        setTimeout(() => {
          setStepIndex(idx);
          if (idx === 4) {
            const verifiedCheck = verifyZKProofPackage(generated);
            if (credInfo.status === "revoked") {
              setLockState("revoked");
              setStatusReason(
                credInfo.revocationReason ||
                  "Credential has been revoked by RVSCET Jamshedpur."
              );
            } else if (!verifiedCheck.claimSatisfied) {
              setLockState("age_restricted");
              setStatusReason(
                `Your current verified age does not satisfy the Age >= ${selectedAgeThreshold} requirement for this credential/action.`
              );
            } else {
              setLockState("verified");
            }
          }
        }, idx * 320)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [
    isOpen,
    defaultClaimType,
    credentialId,
    claimTitle,
    category,
    selectedAgeThreshold,
    activeStudent,
    findCredentialById,
  ]);

  if (!isOpen) return null;

  const verificationShareUrl = `https://kiwivault.rvscet.ac.in/verifier?cred=${encodeURIComponent(
    credentialId
  )}&claim=${encodeURIComponent(defaultClaimType)}`;

  const qrPayload = JSON.stringify({
    protocol: "KIWI_VAULT_ZK_V1",
    credentialId,
    claimType: defaultClaimType,
    commitment: proofPkg?.publicOutputSummary.commitmentHash.slice(0, 22),
    piiIncluded: false,
  });

  const handleCopy = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Zero-Knowledge Privacy Proof Modal"
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-kiwi-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-kiwi-50 via-white to-bark-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <KiwiLogo size={34} float={false} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Zero-Knowledge Selective Proof
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-kiwi-100 text-kiwi-800 dark:bg-kiwi-950 dark:text-kiwi-300 border border-kiwi-300 dark:border-kiwi-800">
                  Groth16 • BN128
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Prove more. Reveal less. • {credentialId}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <RvscetLogo size={32} />
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Age threshold selector when proving Age */}
          {defaultClaimType === "age" && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Configurable Age Threshold:
                </span>{" "}
                <span className="text-slate-500 dark:text-slate-400">
                  Test ZK inequality evaluation without exposing DOB
                </span>
              </div>
              <div className="flex items-center gap-2">
                {[18, 21, 25].map((ageOpt) => (
                  <button
                    key={ageOpt}
                    onClick={() => setSelectedAgeThreshold(ageOpt)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                      selectedAgeThreshold === ageOpt
                        ? "bg-kiwi-600 text-white shadow-sm"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    Age &ge; {ageOpt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Animated Lock + Progress Pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-2 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700/80">
              <AnimatedLockKey
                state={lockState}
                size="lg"
                label={
                  lockState === "proving"
                    ? "Generating ZK Proof..."
                    : lockState === "verified"
                    ? "🔓 Credential Verified"
                    : lockState === "revoked"
                    ? "🔒 Credential Revoked"
                    : "🔒 Age Restricted"
                }
              />
              <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                Circuit: <span className="font-mono font-semibold">{proofPkg?.circuit}</span>
              </p>
            </div>

            <div className="md:col-span-8 space-y-2 pl-2">
              {PROOF_STEPS.map((label, idx) => {
                const done = stepIndex > idx || (stepIndex === 4 && idx === 4);
                const active = stepIndex === idx && stepIndex < 4;
                const isFinalStep = idx === 4;
                return (
                  <div key={label} className="flex items-center gap-3 text-xs">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                        done
                          ? isFinalStep && (lockState === "revoked" || lockState === "age_restricted")
                            ? "bg-rose-600 text-white"
                            : "bg-kiwi-600 text-white"
                          : active
                          ? "bg-amber-500 text-white animate-pulse"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                      }`}
                    >
                      {done ? "✓" : idx + 1}
                    </div>
                    <span
                      className={`font-medium ${
                        done
                          ? "text-slate-900 dark:text-white"
                          : active
                          ? "text-amber-600 dark:text-amber-400 font-semibold"
                          : "text-slate-400"
                      }`}
                    >
                      {isFinalStep && lockState === "revoked"
                        ? "Credential Revoked on Registry"
                        : isFinalStep && lockState === "age_restricted"
                        ? `Age Restricted (Public Output: FALSE)`
                        : label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alert Banner if Revoked or Age Restricted */}
          {lockState === "revoked" && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 flex items-start gap-3">
              <ShieldAlert className="text-rose-600 shrink-0 mt-0.5" size={20} />
              <div className="text-xs text-rose-900 dark:text-rose-200">
                <p className="font-bold text-sm mb-0.5">🔒 Credential Revoked</p>
                <p>{statusReason}</p>
                <p className="mt-1 text-rose-700 dark:text-rose-300">
                  Verifiers automatically reject proofs anchored to revoked credentials.
                </p>
              </div>
            </div>
          )}

          {lockState === "age_restricted" && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 flex items-start gap-3">
              <Lock className="text-rose-600 shrink-0 mt-0.5" size={20} />
              <div className="text-xs text-rose-900 dark:text-rose-200 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-extrabold text-sm">
                    🔒 VERIFICATION FAILED — Age requirement not satisfied
                  </p>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-white">
                    🔒 Private
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-200">
                    ❌ Not eligible for this claim
                  </span>
                </div>
                <p className="font-semibold">
                  Verification failed because the required age condition was not satisfied. The student&apos;s date of birth remains private and was not revealed to the verifier.
                </p>
                <p className="font-medium text-rose-800 dark:text-rose-300">
                  Your private date of birth was not revealed to the verifier.
                </p>
              </div>
            </div>
          )}

          {/* Mandatory Privacy Transparency Comparison */}
          {proofPkg && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-kiwi-50/70 dark:bg-kiwi-950/30 border border-kiwi-200 dark:border-kiwi-900/60">
                  <div className="flex items-center gap-2 text-kiwi-800 dark:text-kiwi-300 font-bold text-xs uppercase tracking-wider mb-2.5">
                    <LockOpen size={15} />
                    <span>REVEALED (What did the verifier learn?)</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-200 font-medium">
                    {proofPkg.privacyManifest.revealed.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 border border-slate-800">
                  <div className="flex items-center gap-2 text-kiwi-300 font-bold text-xs uppercase tracking-wider mb-2.5">
                    <EyeOff size={15} />
                    <span>NOT REVEALED (What Remains Private)</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {proofPkg.privacyManifest.hidden.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span>🔒 {item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="text-xs font-bold text-center text-kiwi-800 dark:text-kiwi-300 bg-kiwi-50/60 dark:bg-kiwi-950/40 py-2 px-4 rounded-xl border border-kiwi-200/70 dark:border-kiwi-900">
                Kiwi Vault verifies the required claim without exposing the underlying personal data.
              </p>
            </div>
          )}

          {/* QR Code & Selective Disclosure Sharing */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="md:col-span-4 flex flex-col items-center justify-center bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
              <QRCodeSVG value={qrPayload} size={124} level="M" />
              <span className="mt-2 text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                <QrCode size={11} /> Zero-PII Proof QR
              </span>
            </div>

            <div className="md:col-span-8 space-y-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Share Selective Proof (No Full Document Shared)
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  This QR & link contain only your cryptographic commitment and Credential ID{" "}
                  <span className="font-mono font-semibold">{credentialId}</span>.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCopy("link", verificationShareUrl)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-kiwi-600 hover:bg-kiwi-700 text-white shadow-sm transition"
                >
                  <Copy size={13} />
                  {copiedText === "link" ? "Copied Verification Link!" : "Copy Verification Link"}
                </button>
                <button
                  onClick={() => handleCopy("id", credentialId)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
                >
                  <KeyRound size={13} />
                  {copiedText === "id" ? "Copied Credential ID!" : "Copy Credential ID"}
                </button>
                <button
                  onClick={() => setShowRawJson((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300/70 transition"
                >
                  <FileCode2 size={13} />
                  {showRawJson ? "Hide Groth16 Proof" : "Inspect ZK Proof"}
                </button>
              </div>
            </div>
          </div>

          {/* Raw Groth16 Proof Inspector */}
          {showRawJson && proofPkg && (
            <div className="p-4 rounded-2xl bg-slate-950 text-kiwi-300 font-mono text-[11px] overflow-x-auto border border-slate-800">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400">
                <span>Groth16 Proof & Public Signals (Private Witness Stripped)</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck size={13} /> BN128 Curve
                </span>
              </div>
              <pre className="leading-relaxed">
                {JSON.stringify(
                  {
                    circuit: proofPkg.circuit,
                    publicSignals: proofPkg.publicSignals,
                    proof: proofPkg.proof,
                    verificationKeyHash: proofPkg.verificationKeyHash,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-kiwi-600" />
            Your credentials belong to you. Your proof reveals only what is necessary.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
