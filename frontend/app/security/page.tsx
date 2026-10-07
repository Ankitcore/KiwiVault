"use client";

import React from "react";
import {
  CheckCircle2,
  Cpu,
  Database,
  KeyRound,
  Link2,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { RVSCET_ISSUER_ADDRESS } from "@/lib/blockchain/registry";

export default function SecurityCenterPage() {
  const securityCards = [
    {
      title: "Credential Signatures",
      status: "✓ Verified ECDSA & Poseidon",
      desc: "All credentials issued by RVSCET Jamshedpur carry tamper-evident cryptographic commitments.",
      icon: KeyRound,
    },
    {
      title: "Blockchain Integrity",
      status: "✓ CredentialRegistry.sol Active",
      desc: "Anchors only non-PII credential hashes, issuer addresses, timestamps, and revocation states.",
      icon: Link2,
    },
    {
      title: "Revocation Protection",
      status: "✓ Real-Time Status Check",
      desc: "Verifiers query active/revoked status before accepting any Zero-Knowledge proof.",
      icon: ShieldCheck,
    },
    {
      title: "ZK Proof Verification",
      status: "✓ Groth16 BN128 Circuits",
      desc: "AgeVerificationCircuit & DegreeVerificationCircuit strip private witnesses prior to sharing.",
      icon: Cpu,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-kiwi-700 dark:text-kiwi-400">
          Cryptographic &amp; Smart Contract Security
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
          Security Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
          Inspect how Kiwi Vault protects your academic credentials, zero-knowledge proofs, and on-chain revocation anchors.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {securityCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-kiwi-600 text-white flex items-center justify-center">
                      <Icon size={18} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {card.title}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {card.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* PRIVACY BY DESIGN: OFF-CHAIN VS ON-CHAIN SEPARATION (Section 33 & 54) */}
      <section className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Database size={18} className="text-kiwi-600" />
          Privacy-by-Design: Off-Chain vs. On-Chain Data Separation
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Kiwi Vault uses blockchain strictly where immutability and revocation auditability add value. Sensitive personal data is never written to any blockchain.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-2.5">
            <h3 className="font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Lock size={15} /> OFF-CHAIN PRIVATE DATA (Never on Blockchain)
            </h3>
            <ul className="space-y-1.5 text-slate-300">
              <li>• Date of Birth (DOB)</li>
              <li>• Subject-wise Marks, SGPA &amp; CGPA</li>
              <li>• Residential Address &amp; Phone Number</li>
              <li>• Aadhaar Reference (•••• •••• 1234)</li>
              <li>• Complete Certificate PDFs &amp; Roll Number</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-kiwi-50/80 dark:bg-kiwi-950/30 border border-kiwi-200 dark:border-kiwi-900 space-y-2.5">
            <h3 className="font-extrabold text-kiwi-800 dark:text-kiwi-300 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 size={15} /> ON-CHAIN VERIFICATION DATA (CredentialRegistry.sol)
            </h3>
            <ul className="space-y-1.5 text-slate-700 dark:text-slate-200">
              <li>• Credential Hash (bytes32 Keccak256 / Poseidon)</li>
              <li>• Authorized RVSCET Issuer Address ({RVSCET_ISSUER_ADDRESS.slice(0, 12)}...)</li>
              <li>• Issue Timestamp &amp; Revocation Timestamp</li>
              <li>• Revocation Status (ACTIVE / REVOKED)</li>
              <li>• Non-PII Credential Identifier (e.g., KV-RVSCET-2026-000184)</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
