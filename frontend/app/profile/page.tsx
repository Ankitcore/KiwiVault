"use client";

import React from "react";
import {
  Building2,
  CheckCircle2,
  GraduationCap,
  Lock,
  ShieldCheck,
  User,
  Wallet,
} from "lucide-react";
import { useVault } from "@/lib/auth/vault-context";
import { KiwiLogo, RvscetLogo } from "@/components/kiwi-logo";

export default function ProfilePage() {
  const {
    activeStudent,
    students,
    setActiveStudentById,
    updateStudentPrivacy,
    updateStudentDobForDemo,
  } = useVault();

  const { privacySettings } = activeStudent;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Profile Card */}
      <section className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-kiwi-500 to-kiwi-700 text-white flex items-center justify-center text-2xl font-black shadow-md">
              {activeStudent.name
                .split(" ")
                .map((p) => p[0])
                .join("")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                  {activeStudent.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-kiwi-100 dark:bg-kiwi-950 text-kiwi-800 dark:text-kiwi-300">
                  Verified Holder
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 mt-0.5">
                {activeStudent.program} — {activeStudent.branch}
              </p>
              <p className="font-mono text-xs text-slate-400 mt-0.5">
                {activeStudent.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RvscetLogo size={46} />
            <KiwiLogo size={40} float={false} />
          </div>
        </div>

        {/* Institutional Details Grid (Section 41) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-slate-400 block mb-1">Institution</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {activeStudent.institution}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-slate-400 block mb-1">University Affiliation</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {activeStudent.university}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-slate-400 block mb-1">Semester &amp; Batch</span>
            <span className="font-bold text-slate-900 dark:text-white">
              Semester {activeStudent.semester} ({activeStudent.enrollmentYear}–
              {activeStudent.graduationYear})
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-slate-400 block mb-1">Registration &amp; Roll No</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {activeStudent.registrationNumber} / {activeStudent.rollNumber}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 sm:col-span-2">
            <span className="text-slate-400 block mb-1">Kiwi Vault Cryptographic Address</span>
            <span className="font-mono font-bold text-kiwi-700 dark:text-kiwi-400">
              {activeStudent.walletAddress}
            </span>
          </div>
        </div>
      </section>

      {/* PRIVACY CONTROLS (Section 41) */}
      <section className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock size={18} className="text-kiwi-600" />
              Holder Privacy &amp; Disclosure Preferences
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Control what verifiers can request from your Kiwi Vault.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            {
              key: "showProfileToVerifier" as const,
              title: "Show full profile identity to verifier",
              desc: "Keep OFF to enforce strict Zero-Knowledge anonymity where only the proven claim is visible.",
              value: privacySettings.showProfileToVerifier,
            },
            {
              key: "allowAchievementVerification" as const,
              title: "Allow achievement verification",
              desc: "Permit verifiers to validate your RVSCET Hackathon, Helix, Frolic & Club achievements.",
              value: privacySettings.allowAchievementVerification,
            },
            {
              key: "allowAcademicVerification" as const,
              title: "Allow academic verification",
              desc: "Permit verifiers to validate your B.Tech degree and semester qualification claims.",
              value: privacySettings.allowAcademicVerification,
            },
          ].map((setting) => (
            <div
              key={setting.key}
              className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700"
            >
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {setting.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {setting.desc}
                </p>
              </div>
              <button
                onClick={() =>
                  updateStudentPrivacy({ [setting.key]: !setting.value })
                }
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
                  setting.value
                    ? "bg-kiwi-600 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                {setting.value ? "ON" : "OFF"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Switch Demo Student */}
      <section className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
          Switch Active Demo Student Profile (Section 46)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {students.map((st) => (
            <button
              key={st.id}
              onClick={() => setActiveStudentById(st.id)}
              className={`p-4 rounded-2xl border text-left transition ${
                st.id === activeStudent.id
                  ? "bg-kiwi-50 dark:bg-kiwi-950/50 border-kiwi-500"
                  : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
              }`}
            >
              <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                {st.name}
              </p>
              <p className="text-[11px] text-slate-500">
                {st.branch} • Sem {st.semester}
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
