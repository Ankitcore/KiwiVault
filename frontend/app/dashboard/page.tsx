"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  Award,
  CheckCircle2,
  Eye,
  EyeOff,
  FileBadge,
  GraduationCap,
  KeyRound,
  Lock,
  Share2,
  ShieldCheck,
  Sparkles,
  Trophy,
  Wallet,
} from "lucide-react";
import { useVault } from "@/lib/auth/vault-context";
import { KiwiLogo, RvscetLogo } from "@/components/kiwi-logo";
import {
  AcademicCredentialCard,
  AcademicDetailModal,
  DegreeCredentialCard,
} from "@/components/credential-card";
import { ZKProverModal } from "@/components/verification/zk-prover-modal";
import { AcademicCredential } from "@/lib/credentials/seed-data";
import {
  evaluatePrivateAgeEligibility,
  formatDobForHolderView,
} from "@/lib/zk/engine";

export default function DashboardPage() {
  const {
    t,
    activeStudent,
    academicCredentials,
    identityReferences,
    achievements,
    certifications,
    verificationRequests,
    notifications,
    completeVerificationRequest,
  } = useVault();

  const [selectedDetailCred, setSelectedDetailCred] = useState<AcademicCredential | null>(null);
  const [showPrivateIdentityData, setShowPrivateIdentityData] = useState(false);
  const [zkModalState, setZkModalState] = useState<{
    open: boolean;
    claimType: "degree" | "age" | "achievement" | "certificate" | "identity";
    credentialId: string;
    claimTitle: string;
  }>({
    open: false,
    claimType: "degree",
    credentialId: "KV-RVSCET-2028-000124",
    claimTitle: "B.Tech Computer Science & Engineering",
  });

  const studentAcademic = academicCredentials.filter(
    (c) => c.holderId === activeStudent.id
  );
  const studentIdentities = identityReferences.filter(
    (i) => i.holderId === activeStudent.id
  );
  const studentAchievements = achievements.filter(
    (a) => a.holderId === activeStudent.id
  );
  const studentCerts = certifications.filter(
    (c) => c.holderId === activeStudent.id
  );
  const studentRequests = verificationRequests.filter(
    (r) => r.targetHolderId === activeStudent.id
  );

  const degreeCred =
    studentAcademic.find((c) => c.type === "degree") || studentAcademic[0];
  const primaryIdentityCred =
    studentIdentities.find((i) => i.title === "Student Identity") ||
    studentIdentities[0];
  const pendingReq = studentRequests.find((r) => r.status === "pending");

  const firstName = activeStudent.name.split(" ")[0];
  const ageEligibility = evaluatePrivateAgeEligibility(
    activeStudent.privateDateOfBirth,
    18
  );
  const formattedHolderDob = formatDobForHolderView(
    activeStudent.privateDateOfBirth
  );

  const handleOpenProve = (cred: AcademicCredential) => {
    setZkModalState({
      open: true,
      claimType: "degree",
      credentialId: cred.credentialId,
      claimTitle: `${cred.title} (${cred.branch})`,
    });
  };

  return (
    <div className="space-y-8">
      {/* HERO BANNER */}
      <section className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-kiwi-50 via-white to-bark-50 dark:from-slate-900 dark:via-slate-900 dark:to-kiwi-950/30 border border-kiwi-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-kiwi-200 dark:border-slate-700 text-xs font-bold text-kiwi-700 dark:text-kiwi-300">
              <KiwiLogo size={20} float={false} />
              <span>{t("myDigitalVault")} • RVSCET Jamshedpur</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Welcome, {firstName} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {activeStudent.program} in <strong>{activeStudent.branch}</strong> • Semester{" "}
              {activeStudent.semester} • Student ID:{" "}
              <span className="font-mono font-semibold">
                {activeStudent.registrationNumber}
              </span>
            </p>
          </div>

          {/* Wallet Health & Privacy Score Badge */}
          <div className="flex items-center gap-3 self-start md:self-center bg-white/90 dark:bg-slate-800/90 p-4 rounded-2xl border border-kiwi-200 dark:border-slate-700 shadow-sm">
            <RvscetLogo size={44} />
            <div>
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck size={16} />
                <span>{t("walletHealth")}: 100% Optimal</span>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                🛡 100% {t("privacyProtected")} (0 PII Leaked)
              </p>
              <p className="text-[11px] text-slate-400">
                Affiliated to Jharkhand University of Technology (JUT)
              </p>
            </div>
          </div>
        </div>

        {/* IDENTITY CREDENTIAL & PRIVATE AGE VERIFICATION CARD (Section 8) */}
        <div className="mt-5 p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-kiwi-200/80 dark:border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-5 text-xs">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Identity Credential
                </span>
                <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  Student Identity{" "}
                  <span className="font-mono text-[11px] text-kiwi-700 dark:text-kiwi-400">
                    ({primaryIdentityCred?.credentialId || "KV-RVSCET-DEMO-017"})
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    🟢 ACTIVE
                  </span>
                </span>
              </div>

              <div className="h-7 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Age Verification
                </span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  Status: <span className="text-kiwi-700 dark:text-kiwi-400">🔐 Private</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPrivateIdentityData((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition self-start sm:self-auto"
            >
              {showPrivateIdentityData ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>
                {showPrivateIdentityData
                  ? "Hide Private Identity Data"
                  : "View Private Identity Data"}
              </span>
            </button>
          </div>

          {showPrivateIdentityData && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-6 text-xs bg-slate-50/80 dark:bg-slate-800/50 p-3.5 rounded-xl">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Date of Birth
                </span>
                <span className="font-mono font-extrabold text-sm text-slate-900 dark:text-white">
                  {formattedHolderDob}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Age verification eligibility
                </span>
                <span
                  className={`font-extrabold text-sm ${
                    ageEligibility.isEligible
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {ageEligibility.eligibilityLabel}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                🔒 Visible ONLY to the student in their own wallet — NEVER in the verifier view.
              </span>
            </div>
          )}
        </div>

        {/* MY DIGITAL VAULT STATS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mt-6">
          <Link
            href="/wallet"
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-kiwi-400 transition"
          >
            <div className="flex items-center justify-between text-kiwi-600 mb-2">
              <GraduationCap size={22} />
              <span className="text-[10px] font-bold uppercase text-slate-400">
                Academic
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {studentAcademic.length}
            </p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              🎓 {t("academicCredentials")}
            </p>
          </Link>

          <Link
            href="/achievements"
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-amber-400 transition"
          >
            <div className="flex items-center justify-between text-amber-500 mb-2">
              <Trophy size={22} />
              <span className="text-[10px] font-bold uppercase text-slate-400">
                Beyond Class
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {studentAchievements.length}
            </p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              🏆 {t("achievements")}
            </p>
          </Link>

          <Link
            href="/certifications"
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-sky-400 transition"
          >
            <div className="flex items-center justify-between text-sky-500 mb-2">
              <FileBadge size={22} />
              <span className="text-[10px] font-bold uppercase text-slate-400">
                Verified
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {studentCerts.length}
            </p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              📜 {t("certificates")}
            </p>
          </Link>

          <Link
            href="/verifier"
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-kiwi-400 transition"
          >
            <div className="flex items-center justify-between text-purple-600 mb-2">
              <KeyRound size={22} />
              <span className="text-[10px] font-bold uppercase text-slate-400">
                ZK Proofs
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {studentRequests.length}
            </p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              🔐 {t("verificationRequests")}
            </p>
          </Link>

          <Link
            href="/privacy"
            className="col-span-2 lg:col-span-1 p-4 rounded-2xl bg-kiwi-600 text-white shadow-sm hover:bg-kiwi-700 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <ShieldCheck size={22} />
              <span className="text-[10px] font-bold uppercase text-kiwi-100">
                Zero-Knowledge
              </span>
            </div>
            <p className="text-2xl font-black">100%</p>
            <p className="text-xs font-semibold text-kiwi-100">
              🛡 {t("privacyScore")}
            </p>
          </Link>
        </div>

        {/* QUICK ACTIONS BAR (Section 12) */}
        <div className="mt-6 pt-5 border-t border-kiwi-200/70 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t("quickActions")}:
          </span>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/wallet"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition"
            >
              <Wallet size={14} /> {t("viewWallet")}
            </Link>
            <button
              onClick={() =>
                setZkModalState({
                  open: true,
                  claimType: "degree",
                  credentialId: degreeCred?.credentialId || "KV-RVSCET-2028-000124",
                  claimTitle: `${activeStudent.program} (${activeStudent.branch})`,
                })
              }
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-kiwi-600 hover:bg-kiwi-700 text-white shadow-sm transition"
            >
              <KeyRound size={14} /> {t("proveClaim")}
            </button>
            <button
              onClick={() =>
                setZkModalState({
                  open: true,
                  claimType: "age",
                  credentialId:
                    primaryIdentityCred?.credentialId || "KV-ID-2024-000103",
                  claimTitle: "Age ≥ 18",
                })
              }
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition"
            >
              <Share2 size={14} /> {t("shareCredential")}
            </button>
            <Link
              href="/achievements"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition"
            >
              <Trophy size={14} /> {t("viewAchievements")}
            </Link>
          </div>
        </div>
      </section>

      {/* INCOMING VERIFICATION REQUEST PROMPT (Section 45 QR Experience) */}
      {pendingReq && (
        <section className="rounded-3xl p-5 sm:p-6 bg-amber-50/90 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              <Sparkles size={15} />
              <span>Incoming Verification Request • {pendingReq.requestId}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {pendingReq.verifierName} wants to verify:{" "}
              <span className="text-kiwi-700 dark:text-kiwi-400">
                &ldquo;{pendingReq.claimLabel}&rdquo;
              </span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Zero-Knowledge Guarantee: Aadhaar, Date of Birth, Address, Phone &amp; Marks will NOT be shared.
            </p>
          </div>
          <button
            onClick={() => {
              completeVerificationRequest(pendingReq.requestId, {
                status: "verified",
                revealedClaims: [
                  `Claim: ${pendingReq.claimLabel}`,
                  "Issuer: RVS College of Engineering & Technology, Jamshedpur",
                  "Credential Status: ACTIVE",
                ],
                hiddenFields: [
                  "Aadhaar Number",
                  "Date of Birth",
                  "Address & Phone Number",
                  "Student Roll Number & Full Transcript",
                ],
                proofHash: "0x8f9e0d1c2b3a495867768594a3b2c1d08f9e0d1c2b3a495867768594a3b2c1d0",
              });
              setZkModalState({
                open: true,
                claimType: "degree",
                credentialId: pendingReq.credentialId,
                claimTitle: pendingReq.claimLabel,
              });
            }}
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold bg-kiwi-600 hover:bg-kiwi-700 text-white shadow-md transition"
          >
            <KeyRound size={15} /> Approve &amp; Generate Proof
          </button>
        </section>
      )}

      {/* MAIN CONTENT GRID: DEGREE CARD + RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Primary Institutional Degree Credential
            </h2>
            <Link
              href="/wallet"
              className="text-xs font-bold text-kiwi-700 dark:text-kiwi-400 hover:underline"
            >
              Open Full Wallet &rarr;
            </Link>
          </div>

          {degreeCred && (
            <DegreeCredentialCard
              credential={degreeCred}
              onProve={handleOpenProve}
              onViewDetails={(c) => setSelectedDetailCred(c)}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {studentAcademic
              .filter((c) => c.id !== degreeCred?.id)
              .slice(0, 2)
              .map((cred) => (
                <AcademicCredentialCard
                  key={cred.id}
                  credential={cred}
                  onProve={handleOpenProve}
                  onViewDetails={(c) => setSelectedDetailCred(c)}
                />
              ))}
          </div>
        </div>

        {/* RECENT ACTIVITY & PRIVACY SUMMARY (Section 12) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity size={18} className="text-kiwi-600" />
                {t("recentActivity")}
              </h2>
              <span className="text-[11px] font-semibold text-slate-400">
                Live Audit Log
              </span>
            </div>

            <div className="space-y-3">
              {[
                {
                  icon: "✓",
                  badge: "bg-kiwi-100 text-kiwi-800 dark:bg-kiwi-950 dark:text-kiwi-300",
                  title: "Degree credential added",
                  desc: `${degreeCred?.title} (${degreeCred?.credentialId}) anchored by RVSCET.`,
                },
                {
                  icon: "✓",
                  badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
                  title: "SIH certificate verified",
                  desc: "Smart India Hackathon 2026 Winner proved via selective disclosure.",
                },
                {
                  icon: "✓",
                  badge: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
                  title: "Age proof generated",
                  desc: "Proved 'Age >= 18' using Groth16 without revealing Date of Birth.",
                },
                ...notifications.slice(0, 2).map((n) => ({
                  icon: n.type === "revocation" ? "🔒" : "✓",
                  badge:
                    n.type === "revocation"
                      ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                      : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
                  title: n.title,
                  desc: n.message,
                })),
              ].map((act, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs"
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold shrink-0 ${act.badge}`}
                  >
                    {act.icon}
                  </span>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {act.title}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      {act.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Guarantee Card */}
          <div className="rounded-3xl p-6 bg-slate-900 text-white border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-kiwi-400 flex items-center gap-1.5">
                <Lock size={14} /> Zero-Knowledge Vault Architecture
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-kiwi-950 text-kiwi-300 border border-kiwi-800">
                ACTIVE
              </span>
            </div>
            <p className="text-sm font-bold">
              &ldquo;Your credentials belong to you. Your proof reveals only what is necessary.&rdquo;
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your Aadhaar reference ({activeStudent.maskedAadhaar}), Date of Birth, and Semester Marksheets are isolated in your off-chain vault.
            </p>
            <div className="pt-2">
              <Link
                href="/privacy"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-kiwi-400 hover:underline"
              >
                Inspect Privacy Center &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AcademicDetailModal
        credential={selectedDetailCred}
        onClose={() => setSelectedDetailCred(null)}
        onProve={handleOpenProve}
      />

      <ZKProverModal
        isOpen={zkModalState.open}
        onClose={() => setZkModalState((prev) => ({ ...prev, open: false }))}
        defaultClaimType={zkModalState.claimType}
        credentialId={zkModalState.credentialId}
        claimTitle={zkModalState.claimTitle}
      />
    </div>
  );
}
