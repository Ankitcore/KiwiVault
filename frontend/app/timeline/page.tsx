"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  GraduationCap,
  History,
  KeyRound,
  Lock,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useVault } from "@/lib/auth/vault-context";
import { RvscetLogo } from "@/components/kiwi-logo";
import { ZKProverModal } from "@/components/verification/zk-prover-modal";

export default function TimelinePage() {
  const { activeStudent } = useVault();
  const [zkModal, setZkModal] = useState<{
    open: boolean;
    claimType: "degree" | "achievement";
    credentialId: string;
    claimTitle: string;
  }>({
    open: false,
    claimType: "degree",
    credentialId: "KV-RVSCET-2028-000124",
    claimTitle: "B.Tech CSE Admission & Enrolment",
  });

  const milestones = [
    {
      year: "2024",
      title: "Admission to RVSCET Jamshedpur (JUT Ranchi)",
      subtitle: `${activeStudent.program} in ${activeStudent.branch}`,
      credentialId: "KV-RVSCET-2024-000101",
      type: "academic" as const,
      status: "verified",
      desc: "Official enrollment identity anchored in Kiwi Vault with zero-PII exposure.",
    },
    {
      year: "2024",
      title: "Semester 1 Result — Passed with Distinction (SGPA 8.64)",
      subtitle: "JUT End-Semester Grade Card",
      credentialId: "KV-RVSCET-2025-000142",
      type: "academic" as const,
      status: "verified",
      desc: "Engineering Mathematics I, Physics & Programming in C verified on-chain.",
    },
    {
      year: "2025",
      title: "Semester 2 Result — Passed with Distinction (SGPA 8.82)",
      subtitle: "Cumulative CGPA 8.73",
      credentialId: "KV-RVSCET-2025-000184",
      type: "academic" as const,
      status: "verified",
      desc: "Data Structures & Algorithms (O Grade) & Digital Logic Design.",
    },
    {
      year: "2025",
      title: "Helix Coding Challenge — 1st Place Winner",
      subtitle: "Helix Technical Club, RVSCET",
      credentialId: "KV-ACH-2025-0018",
      type: "achievement" as const,
      status: "verified",
      desc: "Ranked 1st among 180+ participants in competitive algorithmic coding.",
    },
    {
      year: "2026",
      title: "Frolic 2026 Annual Sports Meet — Winner",
      subtitle: "Frolic Sports Council, RVSCET",
      credentialId: "KV-ACH-2026-0034",
      type: "achievement" as const,
      status: "verified",
      desc: "Inter-Department Athletics & Sports Participation & Gold Medal.",
    },
    {
      year: "2026",
      title: "Semester 3 Result & Coursework",
      subtitle: activeStudent.isGraduated
        ? "Completed with Distinction"
        : "Currently Enrolled Semester",
      credentialId: "KV-RVSCET-2026-000210",
      type: "academic" as const,
      status: activeStudent.isGraduated ? "verified" : "current",
      desc: "Operating Systems, Design & Analysis of Algorithms, and DBMS.",
    },
    {
      year: "2026",
      title: "Smart India Hackathon (SIH) 2026 — Winner",
      subtitle: "Track 04: Zero-Knowledge ID",
      credentialId: "KV-ACH-2026-0042",
      type: "achievement" as const,
      status: "verified",
      desc: "National Hackathon Winner representing RVS College of Engineering & Technology.",
    },
    {
      year: String(activeStudent.graduationYear),
      title: "Bachelor of Technology (B.Tech) Degree & Graduation",
      subtitle: "Jharkhand University of Technology (JUT) Convocation",
      credentialId: "KV-RVSCET-2028-000124",
      type: "academic" as const,
      status: activeStudent.isGraduated ? "verified" : "upcoming",
      desc: "Complete verifiable degree credential ready for zero-knowledge career & higher-studies verification.",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-kiwi-700 dark:text-kiwi-400">
            <History size={15} />
            <span>Chronological Digital Academic Journey</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {activeStudent.name}&apos;s Institutional Timeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            From Admission ({activeStudent.enrollmentYear}) to Graduation (
            {activeStudent.graduationYear}) at RVS College of Engineering &amp; Technology, Jamshedpur
          </p>
        </div>
        <RvscetLogo size={48} />
      </section>

      {/* Vertical Timeline */}
      <div className="relative pl-6 sm:pl-10 space-y-6 before:absolute before:top-4 before:bottom-4 before:left-3 sm:before:left-5 before:w-0.5 before:bg-kiwi-300 dark:before:bg-kiwi-800">
        {milestones.map((m, idx) => (
          <div key={idx} className="relative group">
            {/* Node Dot */}
            <div
              className={`absolute -left-6 sm:-left-10 top-4 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                m.status === "verified"
                  ? "bg-kiwi-600 border-kiwi-200 text-white"
                  : m.status === "current"
                  ? "bg-amber-500 border-amber-200 text-white animate-pulse"
                  : "bg-slate-200 dark:bg-slate-800 border-slate-300 text-slate-500"
              }`}
            >
              {m.type === "achievement" ? (
                <Trophy size={12} />
              ) : m.status === "verified" ? (
                <CheckCircle2 size={12} />
              ) : m.status === "current" ? (
                <Lock size={11} />
              ) : (
                <GraduationCap size={12} />
              )}
            </div>

            {/* Card */}
            <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-kiwi-400 shadow-sm transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-kiwi-100 dark:bg-kiwi-950 text-kiwi-800 dark:text-kiwi-300">
                    {m.year}
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-400">
                    {m.credentialId}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      m.status === "verified"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : m.status === "current"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {m.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {m.title}
                </h3>
                <p className="text-xs font-semibold text-kiwi-700 dark:text-kiwi-400">
                  {m.subtitle}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{m.desc}</p>
              </div>

              <button
                onClick={() =>
                  setZkModal({
                    open: true,
                    claimType: m.type === "achievement" ? "achievement" : "degree",
                    credentialId: m.credentialId,
                    claimTitle: m.title,
                  })
                }
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-kiwi-600 hover:bg-kiwi-700 text-white transition"
              >
                <KeyRound size={13} /> Prove Milestone
              </button>
            </div>
          </div>
        ))}
      </div>

      <ZKProverModal
        isOpen={zkModal.open}
        onClose={() => setZkModal((prev) => ({ ...prev, open: false }))}
        defaultClaimType={zkModal.claimType}
        credentialId={zkModal.credentialId}
        claimTitle={zkModal.claimTitle}
      />
    </div>
  );
}
