"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  EyeOff,
  KeyRound,
  Lock,
  LockOpen,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useVault } from "@/lib/auth/vault-context";
import { ZKProverModal } from "@/components/verification/zk-prover-modal";

export default function PrivacyCenterPage() {
  const {
    activeStudent,
    academicCredentials,
    achievements,
    certifications,
    verificationRequests,
  } = useVault();

  const [zkOpen, setZkOpen] = useState(false);

  const totalStored =
    academicCredentials.filter((c) => c.holderId === activeStudent.id).length +
    achievements.filter((a) => a.holderId === activeStudent.id).length +
    certifications.filter((c) => c.holderId === activeStudent.id).length;

  const proofsGenerated =
    verificationRequests.filter((r) => r.targetHolderId === activeStudent.id).length + 4;

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-kiwi-50 via-white to-bark-50 dark:from-slate-900 dark:via-slate-900 dark:to-kiwi-950/30 border border-kiwi-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-kiwi-700 dark:text-kiwi-400">
              Zero-Knowledge Privacy Architecture
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
              Your Privacy Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              &ldquo;Kiwi Vault separates your private credential data from the claims you choose to prove.&rdquo;
            </p>
          </div>
          <button
            onClick={() => setZkOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold bg-kiwi-600 hover:bg-kiwi-700 text-white shadow-sm transition self-start"
          >
            <KeyRound size={15} /> Generate Selective ZK Proof
          </button>
        </div>

        {/* 4 Key Privacy Metrics (Section 42) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-400 block">Credentials stored</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
              {totalStored}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-400 block">Proofs generated</span>
            <span className="text-2xl font-black text-kiwi-700 dark:text-kiwi-400 mt-1 block">
              {proofsGenerated}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-400 block">Data shared</span>
            <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-1.5 block">
              Minimum required
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800">
            <span className="text-xs text-kiwi-300 block">Sensitive data exposed</span>
            <span className="text-2xl font-black text-kiwi-400 mt-1 block">0</span>
          </div>
        </div>
      </section>

      {/* VISUAL SEPARATION: YOUR DATA vs CLAIMS YOU SHARED (Section 42) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-3xl p-6 bg-slate-900 text-white border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Lock size={16} /> YOUR DATA (OFF-CHAIN VAULT ONLY)
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
              NEVER SHARED
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              { field: "Date of Birth (DOB)", status: "🔒 Private (Used only as local Circom witness)" },
              { field: `Aadhaar Reference (${activeStudent.maskedAadhaar})`, status: "🔒 Private (Salted commitment only)" },
              { field: "Subject-Wise Marks & Full Marksheets", status: "🔒 Private (Stored off-chain)" },
              { field: "University Registration & Roll Number", status: "🔒 Private" },
              { field: "Home Address, Email & Phone Number", status: "🔒 Private" },
            ].map((item) => (
              <div
                key={item.field}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs"
              >
                <span className="font-bold text-slate-100">{item.field}</span>
                <span className="text-amber-300 font-semibold">{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border-2 border-kiwi-300 dark:border-kiwi-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-kiwi-700 dark:text-kiwi-400 flex items-center gap-2">
              <LockOpen size={16} /> CLAIMS YOU SHARED (PUBLIC ZK OUTPUTS)
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-kiwi-100 dark:bg-kiwi-950 text-kiwi-800 dark:text-kiwi-300">
              SELECTIVE DISCLOSURE
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              {
                claim: "✓ Age >= 18",
                circuit: "AgeVerificationCircuit (Groth16)",
                detail: "Verifier learned TRUE without seeing Date of Birth",
              },
              {
                claim: `✓ ${activeStudent.program} (${activeStudent.branch})`,
                circuit: "DegreeVerificationCircuit (Groth16)",
                detail: "Verifier learned valid RVSCET enrollment without marks or roll number",
              },
              {
                claim: "✓ Smart India Hackathon 2026 — Winner",
                circuit: "AchievementVerificationCircuit",
                detail: "Verifier learned award authenticity without full certificate PDF",
              },
              {
                claim: "✓ Verified RVSCET Student Identity",
                circuit: "IdentityVerificationCircuit",
                detail: "Verifier learned institutional affiliation without Aadhaar exposure",
              },
            ].map((c) => (
              <div
                key={c.claim}
                className="p-3.5 rounded-2xl bg-kiwi-50/70 dark:bg-kiwi-950/30 border border-kiwi-200 dark:border-kiwi-900 text-xs"
              >
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                  <span>{c.claim}</span>
                  <span className="font-mono text-[10px] text-kiwi-700 dark:text-kiwi-400">
                    {c.circuit}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mt-1">{c.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ZKProverModal
        isOpen={zkOpen}
        onClose={() => setZkOpen(false)}
        defaultClaimType="age"
        credentialId="KV-ID-2024-000103"
        claimTitle="Age >= 18 Selective Disclosure Proof"
      />
    </div>
  );
}
