"use client";

import React, { useMemo, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  Filter,
  GraduationCap,
  IdCard,
  KeyRound,
  Lock,
  Search,
  Share2,
  ShieldCheck,
  Trophy,
  FileBadge,
} from "lucide-react";
import { useVault } from "@/lib/auth/vault-context";
import { KiwiLogo, RvscetLogo } from "@/components/kiwi-logo";
import {
  AcademicCredentialCard,
  AcademicDetailModal,
  DegreeCredentialCard,
  IdentityCredentialCard,
} from "@/components/credential-card";
import { AchievementCard } from "@/components/achievement-card";
import {
  CertificateCard,
  CertificatePreviewModal,
} from "@/components/certificate-card";
import { ZKProverModal } from "@/components/verification/zk-prover-modal";
import {
  AcademicCredential,
  AchievementRecord,
  CertificationRecord,
} from "@/lib/credentials/seed-data";
import {
  evaluatePrivateAgeEligibility,
  formatDobForHolderView,
} from "@/lib/zk/engine";

type WalletTab =
  | "academic"
  | "identity"
  | "achievements"
  | "certifications"
  | "shared";

export default function WalletPage() {
  const {
    t,
    activeStudent,
    students,
    setActiveStudentById,
    updateStudentDobForDemo,
    academicCredentials,
    identityReferences,
    achievements,
    certifications,
    verificationRequests,
  } = useVault();

  const [activeTab, setActiveTab] = useState<WalletTab>("academic");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "revoked">("all");
  const [showPrivateIdentityData, setShowPrivateIdentityData] = useState(false);
  const [selectedDetailCred, setSelectedDetailCred] =
    useState<AcademicCredential | null>(null);
  const [previewCertItem, setPreviewCertItem] = useState<
    CertificationRecord | AchievementRecord | null
  >(null);

  const [zkModalState, setZkModalState] = useState<{
    open: boolean;
    claimType: "degree" | "age" | "achievement" | "certificate" | "identity";
    credentialId: string;
    claimTitle: string;
    category?: string;
    minimumAge?: number;
  }>({
    open: false,
    claimType: "degree",
    credentialId: "KV-RVSCET-2028-000124",
    claimTitle: "B.Tech Computer Science & Engineering",
  });

  // Filter items for active student + search query + status filter
  const q = searchQuery.trim().toLowerCase();

  const myAcademic = useMemo(() => {
    return academicCredentials.filter((c) => {
      if (c.holderId !== activeStudent.id) return false;
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q) ||
        c.credentialId.toLowerCase().includes(q) ||
        c.branch.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q)
      );
    });
  }, [academicCredentials, activeStudent.id, q, statusFilter]);

  const myIdentities = useMemo(() => {
    return identityReferences.filter((i) => i.holderId === activeStudent.id);
  }, [identityReferences, activeStudent.id]);

  const myAchievements = useMemo(() => {
    return achievements.filter((a) => {
      if (a.holderId !== activeStudent.id) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.event.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.clubOrBody.toLowerCase().includes(q) ||
        a.credentialId.toLowerCase().includes(q)
      );
    });
  }, [achievements, activeStudent.id, q, statusFilter]);

  const myCerts = useMemo(() => {
    return certifications.filter((c) => {
      if (c.holderId !== activeStudent.id) return false;
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.issuingClubOrDept.toLowerCase().includes(q) ||
        c.credentialId.toLowerCase().includes(q)
      );
    });
  }, [certifications, activeStudent.id, q, statusFilter]);

  const mySharedRequests = useMemo(() => {
    return verificationRequests.filter((r) => r.targetHolderId === activeStudent.id);
  }, [verificationRequests, activeStudent.id]);

  // Intelligent 8-Semester Roadmap Matrix (Section 14)
  const semesterChecklist = useMemo(() => {
    const items = [];
    for (let sem = 1; sem <= 8; sem++) {
      const issuedRecord = academicCredentials.find(
        (c) =>
          c.holderId === activeStudent.id &&
          c.type === "semester" &&
          c.semester === sem
      );
      let state: "issued" | "current" | "not_issued" = "not_issued";
      if (issuedRecord) state = "issued";
      else if (sem === activeStudent.semester && !activeStudent.isGraduated)
        state = "current";
      else if (sem < activeStudent.semester || activeStudent.isGraduated)
        state = "issued";

      items.push({
        semester: sem,
        state,
        record: issuedRecord,
      });
    }
    return items;
  }, [academicCredentials, activeStudent]);

  const degreeCards = myAcademic.filter((c) => c.type === "degree");
  const otherAcademicCards = myAcademic.filter((c) => c.type !== "degree");

  const firstName = activeStudent.name.split(" ")[0];
  const ageEligibility = evaluatePrivateAgeEligibility(
    activeStudent.privateDateOfBirth,
    18
  );
  const formattedHolderDob = formatDobForHolderView(
    activeStudent.privateDateOfBirth
  );
  const primaryIdentityCred =
    myIdentities.find((i) => i.title === "Student Identity") || myIdentities[0];

  return (
    <div className="space-y-6">
      {/* WALLET HEADER */}
      <section className="rounded-[2.5rem] p-8 sm:p-10 bg-gradient-to-br from-white via-kiwi-50/50 to-kiwi-100/30 dark:from-slate-950 dark:via-slate-900 dark:to-kiwi-950/20 border border-slate-200/60 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <KiwiLogo size={64} float />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-kiwi-100 dark:bg-kiwi-950 text-kiwi-800 dark:text-kiwi-300 border border-kiwi-300 dark:border-kiwi-800">
                  {activeStudent.name} • {activeStudent.registrationNumber} • Sem {activeStudent.semester}
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                Welcome, {firstName} 👋
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {t("walletSubtitle")}
              </p>
            </div>
          </div>

          {/* Student Switcher to demonstrate 3rd Sem vs 8th Sem Graduated vs 5th Sem ECE vs Under-18 Aarav */}
          <div className="flex flex-wrap items-center gap-4 bg-white/60 dark:bg-slate-800/60 p-4 rounded-3xl border border-slate-200 dark:border-slate-700">
            <RvscetLogo size={48} />
            <div className="flex flex-col">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Inspect Demo Student Wallet
              </label>
              <select
                value={activeStudent.id}
                onChange={(e) => {
                  setShowPrivateIdentityData(false);
                  setActiveStudentById(e.target.value);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.registrationNumber}) — Sem {st.semester}
                    {st.id === "student-aarav-under18"
                      ? " • Under-18 Demo"
                      : st.isGraduated
                      ? " • Pass-out"
                      : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* HOLDER IDENTITY & PRIVATE AGE VERIFICATION CARD (Section 8) */}
        <div className="mt-5 p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-kiwi-200/80 dark:border-slate-800 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-4 text-xs">
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
                <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  Status: <span className="text-kiwi-700 dark:text-kiwi-400">🔐 Private</span>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPrivateIdentityData((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
              >
                {showPrivateIdentityData ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>
                  {showPrivateIdentityData
                    ? "Hide Private Identity Data"
                    : "View Private Identity Data"}
                </span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setZkModalState({
                    open: true,
                    claimType: "age",
                    credentialId:
                      primaryIdentityCred?.credentialId || "KV-RVSCET-DEMO-017",
                    claimTitle: "Age ≥ 18",
                    minimumAge: 18,
                  })
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-kiwi-600 hover:bg-kiwi-700 text-white shadow-sm transition"
              >
                <KeyRound size={13} /> Prove Age ≥ 18
              </button>
            </div>
          </div>

          {showPrivateIdentityData && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50/80 dark:bg-slate-800/50 p-3.5 rounded-xl">
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Date of Birth (Holder-Only View)
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
                    className={`inline-flex items-center gap-1 font-extrabold text-sm ${
                      ageEligibility.isEligible
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {ageEligibility.eligibilityLabel}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  🔒 Visible ONLY to you in your wallet — NEVER shown to verifiers.
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">
                  Test DOB:
                </span>
                <button
                  type="button"
                  onClick={() => updateStudentDobForDemo("2010-06-15")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                    activeStudent.privateDateOfBirth === "2010-06-15" ||
                    activeStudent.privateDateOfBirth === "15/06/2010"
                      ? "bg-rose-600 text-white"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  15/06/2010 (Under 18)
                </button>
                <button
                  type="button"
                  onClick={() => updateStudentDobForDemo("2006-05-14")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                    activeStudent.privateDateOfBirth === "2006-05-14" ||
                    activeStudent.privateDateOfBirth === "14/05/2006"
                      ? "bg-kiwi-600 text-white"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  14/05/2006 (Adult 18+)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SEARCH & FILTER BAR (Section 56) */}
        <div className="mt-5 pt-4 border-t border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-kiwi-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            {(["all", "active", "revoked"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition ${
                  statusFilter === st
                    ? "bg-kiwi-600 text-white"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* 5 WALLET TABS (Section 13) */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
          {(
            [
              {
                id: "academic",
                label: t("tabAcademic"),
                count: myAcademic.length,
                icon: GraduationCap,
              },
              {
                id: "identity",
                label: t("tabIdentity"),
                count: myIdentities.length,
                icon: IdCard,
              },
              {
                id: "achievements",
                label: t("tabAchievements"),
                count: myAchievements.length,
                icon: Trophy,
              },
              {
                id: "certifications",
                label: t("tabCertifications"),
                count: myCerts.length,
                icon: FileBadge,
              },
              {
                id: "shared",
                label: t("tabShared"),
                count: mySharedRequests.length,
                icon: Share2,
              },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition ${
                  active
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                    : "bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-white border border-slate-200/80 dark:border-slate-700"
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    active
                      ? "bg-kiwi-500 text-slate-950 font-extrabold"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* TAB 1: ACADEMIC CREDENTIALS (Section 14, 15, 16) */}
      {activeTab === "academic" && (
        <div className="space-y-6">
          {/* Semester-Aware Academic Progression Bar (Section 14) */}
          <div className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Intelligent Semester Credential Tracker ({activeStudent.program} —{" "}
                  {activeStudent.branch})
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activeStudent.isGraduated
                    ? "Graduated Pass-Out Student: All 8 Semesters, Provisional Certificate & Final Degree Issued"
                    : `Current Semester ${activeStudent.semester} Student: Semesters 1–${
                        activeStudent.semester - 1
                      } issued, Semester ${activeStudent.semester} in progress`}
                </p>
              </div>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-kiwi-50 dark:bg-kiwi-950 text-kiwi-800 dark:text-kiwi-300 border border-kiwi-200 dark:border-kiwi-800">
                ✓ Student Identity Verified
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
              {semesterChecklist.map((item) => (
                <button
                  key={item.semester}
                  onClick={() => {
                    if (item.record) setSelectedDetailCred(item.record);
                  }}
                  disabled={!item.record}
                  className={`p-3 rounded-2xl border text-left transition ${
                    item.state === "issued"
                      ? "bg-kiwi-50/70 dark:bg-kiwi-950/30 border-kiwi-300 dark:border-kiwi-800 hover:shadow-sm cursor-pointer"
                      : item.state === "current"
                      ? "bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-65 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">
                      Sem {item.semester}
                    </span>
                    {item.state === "issued" ? (
                      <CheckCircle2 size={14} className="text-kiwi-600" />
                    ) : item.state === "current" ? (
                      <Lock size={14} className="text-amber-600" />
                    ) : (
                      <Circle size={13} className="text-slate-400" />
                    )}
                  </div>
                  <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    {item.state === "issued"
                      ? `SGPA ${item.record?.sgpa || "8.8"}`
                      : item.state === "current"
                      ? "🔒 Current"
                      : "○ Not yet issued"}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Degree Cards */}
          {degreeCards.map((deg) => (
            <DegreeCredentialCard
              key={deg.id}
              credential={deg}
              onProve={(c) =>
                setZkModalState({
                  open: true,
                  claimType: "degree",
                  credentialId: c.credentialId,
                  claimTitle: `${c.title} (${c.branch})`,
                })
              }
              onViewDetails={(c) => setSelectedDetailCred(c)}
            />
          ))}

          {/* All Other Academic Credentials */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherAcademicCards.map((cred) => (
              <AcademicCredentialCard
                key={cred.id}
                credential={cred}
                onProve={(c) =>
                  setZkModalState({
                    open: true,
                    claimType: "degree",
                    credentialId: c.credentialId,
                    claimTitle: `${c.title} — ${c.studentName}`,
                  })
                }
                onViewDetails={(c) => setSelectedDetailCred(c)}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: IDENTITY (Section 17 & 23) */}
      {activeTab === "identity" && (
        <div className="space-y-6">
          {/* Demo Age Restriction Simulator Banner (Section 23) */}
          <div className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-kiwi-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-kiwi-700 dark:text-kiwi-400">
                Section 23 — Zero-Knowledge Age Threshold &amp; Restriction Demo
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Age Verification Status:{" "}
                <span className="font-mono text-kiwi-700 dark:text-kiwi-300">
                  {showPrivateIdentityData
                    ? `Date of Birth: ${formattedHolderDob} • Eligibility: ${ageEligibility.eligibilityLabel}`
                    : "🔐 Private (Raw DOB hidden on main surface)"}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Use <strong>[View Private Identity Data]</strong> to inspect or switch the private holder DOB (e.g., <code className="font-mono">15/06/2010</code> Under 18 vs <code className="font-mono">14/05/2006</code> Adult 18+) without exposing it to verifiers.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowPrivateIdentityData((prev) => !prev)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 transition"
              >
                {showPrivateIdentityData
                  ? "Hide Private Identity Data"
                  : "View Private Identity Data"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {myIdentities.map((idRef) => (
              <IdentityCredentialCard
                key={idRef.id}
                identity={idRef}
                onProveIdentity={(ref) =>
                  setZkModalState({
                    open: true,
                    claimType: "identity",
                    credentialId: ref.credentialId,
                    claimTitle: `Identity belongs to verified RVSCET student (${ref.studentName})`,
                  })
                }
                onProveAge={(ref, minAge) =>
                  setZkModalState({
                    open: true,
                    claimType: "age",
                    credentialId: ref.credentialId,
                    claimTitle: `Age >= ${minAge} Verification`,
                    minimumAge: minAge,
                  })
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ACHIEVEMENTS */}
      {activeTab === "achievements" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myAchievements.map((ach) => (
            <AchievementCard
              key={ach.id}
              achievement={ach}
              onProve={(a) =>
                setZkModalState({
                  open: true,
                  claimType: "achievement",
                  credentialId: a.credentialId,
                  claimTitle: `${a.title} (${a.level})`,
                  category: a.category,
                })
              }
              onViewCertificate={(a) => setPreviewCertItem(a)}
            />
          ))}
        </div>
      )}

      {/* TAB 4: CERTIFICATIONS */}
      {activeTab === "certifications" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myCerts.map((cert) => (
            <CertificateCard
              key={cert.id}
              certificate={cert}
              onProve={(c) =>
                setZkModalState({
                  open: true,
                  claimType: "certificate",
                  credentialId: c.credentialId,
                  claimTitle: c.title,
                  category: c.category,
                })
              }
              onPreview={(c) => setPreviewCertItem(c)}
            />
          ))}
        </div>
      )}

      {/* TAB 5: SHARED / VERIFIED HISTORY */}
      {activeTab === "shared" && (
        <div className="space-y-4">
          {mySharedRequests.map((req) => (
            <div
              key={req.id}
              className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-kiwi-700 dark:text-kiwi-400">
                    {req.requestId}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      req.status === "verified"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : req.status === "revoked" || req.status === "age_restricted"
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {req.status === "age_restricted"
                      ? "❌ FAILED (Age requirement not satisfied)"
                      : req.status === "verified"
                      ? "✓ VERIFIED"
                      : req.status}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Privacy: {req.privacyNote || "DOB NOT REVEALED"}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {req.claimLabel} • Shared with {req.verifierName}
                </h4>
                <p className="text-xs text-slate-500">
                  Revealed: {req.revealedClaims.join(" | ")} • Hidden:{" "}
                  {req.hiddenFields.join(", ")}
                </p>
              </div>
              <button
                onClick={() =>
                  setZkModalState({
                    open: true,
                    claimType: req.claimType === "age" ? "age" : "degree",
                    credentialId: req.credentialId,
                    claimTitle: req.claimLabel,
                    minimumAge: req.minimumAge || 18,
                  })
                }
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-kiwi-600 hover:bg-kiwi-700 text-white transition"
              >
                <KeyRound size={13} /> Re-Open Proof &amp; QR
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <AcademicDetailModal
        credential={selectedDetailCred}
        onClose={() => setSelectedDetailCred(null)}
        onProve={(c) =>
          setZkModalState({
            open: true,
            claimType: "degree",
            credentialId: c.credentialId,
            claimTitle: c.title,
          })
        }
      />

      <CertificatePreviewModal
        item={previewCertItem}
        onClose={() => setPreviewCertItem(null)}
        onProve={() => {
          if (!previewCertItem) return;
          setZkModalState({
            open: true,
            claimType: "level" in previewCertItem ? "achievement" : "certificate",
            credentialId: previewCertItem.credentialId,
            claimTitle: previewCertItem.title,
            category: previewCertItem.category,
          });
        }}
      />

      <ZKProverModal
        isOpen={zkModalState.open}
        onClose={() => setZkModalState((prev) => ({ ...prev, open: false }))}
        defaultClaimType={zkModalState.claimType}
        credentialId={zkModalState.credentialId}
        claimTitle={zkModalState.claimTitle}
        category={zkModalState.category}
        minimumAge={zkModalState.minimumAge}
      />
    </div>
  );
}
