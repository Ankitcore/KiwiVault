"use client";

import React from "react";
import {
  Award,
  Cpu,
  EyeOff,
  GraduationCap,
  KeyRound,
  Link2,
  ShieldCheck,
} from "lucide-react";
import { KiwiLogo, RvscetLogo } from "@/components/kiwi-logo";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-kiwi-50 via-white to-bark-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border border-kiwi-200 dark:border-slate-800 text-center space-y-4">
        <div className="inline-flex items-center gap-4 p-3 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <KiwiLogo size={56} float />
          <span className="text-xl font-black text-slate-300">×</span>
          <RvscetLogo size={56} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          KIWI VAULT
        </h1>
        <p className="text-base font-bold text-kiwi-700 dark:text-kiwi-400">
          Privacy-Preserving Digital Credential Ecosystem
        </p>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Developed as a college-focused prototype for{" "}
          <strong>RVS College of Engineering &amp; Technology (RVSCET), Jamshedpur</strong>,
          affiliated to <strong>Jharkhand University of Technology (JUT), Ranchi</strong>,
          Based on the Problem Statement 23, <strong>Privacy-Preserving Digital Identity and Credential Verification</strong> (HackQubit 2.0).
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            title: "Zero-Knowledge Proofs (Circom & Groth16)",
            desc: "Proves Age >= 18, B.Tech Degree qualification, and RVSCET achievements mathematically without exposing Date of Birth, Aadhaar, or marks.",
            icon: KeyRound,
          },
          {
            title: "Smart Contract Registry (CredentialRegistry.sol)",
            desc: "Stores only cryptographic hashes, issuer addresses, timestamps, and revocation states on Polygon Amoy / Ethereum Sepolia.",
            icon: Link2,
          },
          {
            title: "Verifiable Academic & Club Credentials",
            desc: "Covers Semester 1–8 Results, Final Degrees, and RVSCET clubs including Helix, Frolic, Tarangini, Xpectra, NDLI Club, and Smart India Hackathon.",
            icon: GraduationCap,
          },
          {
            title: "Privacy-First Digital Locker",
            desc: "Your credentials belong to you. Your proof reveals only what is necessary.",
            icon: ShieldCheck,
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
            >
              <div className="w-10 h-10 rounded-xl bg-kiwi-600 text-white flex items-center justify-center">
                <Icon size={20} />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          );
        })}
      </section>

      {/* Mandatory Prototype Disclaimer (Section 64) */}
      <section className="rounded-3xl p-6 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 space-y-2 text-xs text-amber-950 dark:text-amber-200">
        <div className="flex items-center gap-2 font-extrabold text-sm">
          <EyeOff size={18} className="text-amber-600" />
          <span>Important Security &amp; Privacy Prototype Disclaimer</span>
        </div>
        <p>
          All student profiles, academic records, and identity references in this application are clearly marked as <strong>DEMO CREDENTIAL</strong>. This prototype demonstrates privacy-preserving Zero-Knowledge credential verification architecture for RVSCET Jamshedpur and is not an official government identity or Aadhaar replacement system.
        </p>
      </section>
    </div>
  );
}
