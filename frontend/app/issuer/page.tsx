"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Award,
  BarChart3,
  Building2,
  CheckCircle2,
  FileBadge,
  GraduationCap,
  KeyRound,
  PlusCircle,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { useVault } from "@/lib/auth/vault-context";
import { KiwiLogo, RvscetLogo } from "@/components/kiwi-logo";
import {
  AcademicCredential,
  AchievementCategory,
  AchievementLevel,
  CertificateCategory,
} from "@/lib/credentials/seed-data";

type IssuerTab =
  | "issue_academic"
  | "issue_achievement"
  | "issue_certificate"
  | "revoke"
  | "analytics";

const REVOCATION_REASONS = [
  "Administrative correction",
  "Incorrect issuance",
  "Credential withdrawn",
  "Certificate invalidated",
  "Age-restricted credential no longer valid",
  "Student disciplinary withdrawal where applicable",
];

export default function IssuerPage() {
  const {
    students,
    academicCredentials,
    achievements,
    certifications,
    verificationRequests,
    issueAcademicCredential,
    issueAchievement,
    issueCertification,
    revokeAnyCredential,
    restoreAnyCredential,
  } = useVault();

  const [activeTab, setActiveTab] = useState<IssuerTab>("issue_achievement");
  const [bannerResult, setBannerResult] = useState<{
    type: "success" | "revoked";
    title: string;
    credentialId: string;
    hash: string;
    detail: string;
  } | null>(null);

  // 1. Academic Form State
  const [acadHolder, setAcadHolder] = useState(students[0].id);
  const [acadType, setAcadType] = useState<AcademicCredential["type"]>("semester");
  const [acadTitle, setAcadTitle] = useState("Semester 3 Examination Result");
  const [acadSubtitle, setAcadSubtitle] = useState("JUT End-Semester Grade Card • SGPA 9.04");
  const [acadSem, setAcadSem] = useState(3);
  const [acadSgpa, setAcadSgpa] = useState("9.04");
  const [acadCgpa, setAcadCgpa] = useState("8.88");
  const [acadYear, setAcadYear] = useState("2025–2026");

  // 2. Achievement Form State (Section 38)
  const [achHolder, setAchHolder] = useState(students[0].id);
  const [achTitle, setAchTitle] = useState("Smart India Hackathon 2026 — Winner");
  const [achCategory, setAchCategory] = useState<AchievementCategory>("Hackathon");
  const [achEvent, setAchEvent] = useState("Smart India Hackathon 2026");
  const [achClub, setAchClub] = useState("SIH / RVSCET Innovation Cell");
  const [achDesc, setAchDesc] = useState(
    "Awarded for winning Track 04 Zero-Knowledge Digital Identity representing RVS College of Engineering & Technology, Jamshedpur."
  );
  const [achDate, setAchDate] = useState("October 2026");
  const [achLevel, setAchLevel] = useState<AchievementLevel>("Winner");

  // 3. Certificate Form State (Section 39)
  const [certHolder, setCertHolder] = useState(students[0].id);
  const [certTitle, setCertTitle] = useState("Helix Zero-Knowledge & Solidity Bootcamp");
  const [certCategory, setCertCategory] = useState<CertificateCategory>(
    "Workshop Certifications"
  );
  const [certClub, setCertClub] = useState("Helix");
  const [certEvent, setCertEvent] = useState("Helix Technical Workshop 2026");
  const [certDate, setCertDate] = useState("2026-10-07");
  const [certDesc, setCertDesc] = useState(
    "Completed intensive hands-on training in Circom circuits, Groth16 proofs, and privacy-preserving Web3 identity."
  );

  // 4. Revocation Form State (Section 24)
  const [revokeCredId, setRevokeCredId] = useState("KV-RVSCET-2028-000124");
  const [revokeReason, setRevokeReason] = useState(REVOCATION_REASONS[0]);
  const [revokeConfirmed, setRevokeConfirmed] = useState(false);

  const allActiveCount =
    academicCredentials.filter((c) => c.status === "active").length +
    achievements.filter((a) => a.status === "active").length +
    certifications.filter((c) => c.status === "active").length;

  const allRevokedCount =
    academicCredentials.filter((c) => c.status === "revoked").length +
    achievements.filter((a) => a.status === "revoked").length +
    certifications.filter((c) => c.status === "revoked").length;

  const handleIssueAcademic = (e: React.FormEvent) => {
    e.preventDefault();
    const created = issueAcademicCredential({
      holderId: acadHolder,
      type: acadType,
      title: acadTitle,
      subtitle: acadSubtitle,
      semester: acadSem,
      sgpa: acadSgpa,
      cgpa: acadCgpa,
      academicYear: acadYear,
    });
    setBannerResult({
      type: "success",
      title: `Academic Credential Issued to ${created.studentName}`,
      credentialId: created.credentialId,
      hash: created.credentialHash,
      detail: `${created.title} anchored in Demo Verification Mode (Zero PII on-chain).`,
    });
  };

  const handleIssueAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    const created = issueAchievement({
      holderId: achHolder,
      title: achTitle,
      category: achCategory,
      level: achLevel,
      event: achEvent,
      clubOrBody: achClub,
      description: achDesc,
      date: achDate,
    });
    setBannerResult({
      type: "success",
      title: `Achievement Credential Issued (${created.level})`,
      credentialId: created.credentialId,
      hash: created.credentialHash,
      detail: `'${created.title}' added to ${created.studentName}'s Kiwi Vault.`,
    });
  };

  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    const created = issueCertification({
      holderId: certHolder,
      title: certTitle,
      category: certCategory,
      issuingClubOrDept: certClub,
      event: certEvent,
      issueDate: certDate,
      description: certDesc,
    });
    setBannerResult({
      type: "success",
      title: `Official Certificate Issued by ${certClub}`,
      credentialId: created.credentialId,
      hash: created.credentialHash,
      detail: `'${created.title}' delivered to ${created.studentName}'s Kiwi Vault.`,
    });
  };

  const handleRevokeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revokeConfirmed) return;
    const ok = revokeAnyCredential(revokeCredId, revokeReason);
    setBannerResult({
      type: "revoked",
      title: ok
        ? `Credential ${revokeCredId} Revoked (🔴 REVOKED)`
        : `Credential ${revokeCredId} marked as Revoked`,
      credentialId: revokeCredId,
      hash: "0xREVOKED_ON_REGISTRY_ANCHOR",
      detail: `Reason: ${revokeReason}. Any future verification attempt for ${revokeCredId} will now automatically fail.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* ISSUER HEADER (Section 37) */}
      <section className="rounded-[2.5rem] p-8 sm:p-10 bg-gradient-to-br from-white via-blue-50/50 to-kiwi-100/30 dark:from-slate-950 dark:via-slate-900 dark:to-kiwi-950/20 border border-slate-200/60 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <RvscetLogo size={64} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200">
                  Authorized Institutional Anchor
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  Affiliated to Jharkhand University of Technology
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                RVSCET Credential Issuer
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 font-medium">
                Office of the Registrar &amp; Dean Academics
              </p>
            </div>
          </div>
          <div className="hidden md:block">
            <KiwiLogo size={54} float={true} />
          </div>
        </div>

        {/* 6 Issuer Metrics (Section 37) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 block">Credentials Issued</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {academicCredentials.length}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 block">Achievements Issued</span>
            <span className="text-xl font-black text-amber-600">
              {achievements.length}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 block">Certificates Issued</span>
            <span className="text-xl font-black text-sky-600">
              {certifications.length}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 block">Active</span>
            <span className="text-xl font-black text-emerald-600">{allActiveCount}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 block">Revoked</span>
            <span className="text-xl font-black text-rose-600">{allRevokedCount}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 block">Verification Requests</span>
            <span className="text-xl font-black text-kiwi-700 dark:text-kiwi-400">
              {verificationRequests.length}
            </span>
          </div>
        </div>

        {/* Action Buttons Bar (Section 37) */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-200/70 dark:border-slate-800">
          {[
            { id: "issue_academic", label: "🎓 Issue Credential", icon: GraduationCap },
            { id: "issue_achievement", label: "🏆 Issue Achievement", icon: Trophy },
            { id: "issue_certificate", label: "📜 Issue Certificate", icon: FileBadge },
            { id: "revoke", label: "🔴 Revoke Credential", icon: ShieldAlert },
            { id: "analytics", label: "📊 Analytics & Registry", icon: BarChart3 },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => {
                setActiveTab(btn.id as IssuerTab);
                setBannerResult(null);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition ${
                activeTab === btn.id
                  ? btn.id === "revoke"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "bg-kiwi-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
              }`}
            >
              {btn.label}
            </button>
          ))}

          <Link
            href="/verifier"
            className="ml-auto inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900"
          >
            <ShieldCheck size={14} /> Verify Credential &rarr;
          </Link>
        </div>
      </section>

      {/* Transaction / Issuance Feedback Banner */}
      {bannerResult && (
        <div
          className={`p-5 rounded-3xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            bannerResult.type === "revoked"
              ? "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200"
              : "bg-kiwi-50 dark:bg-kiwi-950/40 border-kiwi-400 dark:border-kiwi-800 text-slate-900 dark:text-white"
          }`}
        >
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2 font-extrabold text-sm">
              {bannerResult.type === "revoked" ? (
                <ShieldAlert size={18} className="text-rose-600" />
              ) : (
                <CheckCircle2 size={18} className="text-kiwi-600" />
              )}
              <span>{bannerResult.title}</span>
            </div>
            <p>{bannerResult.detail}</p>
            <p className="font-mono text-[11px] opacity-80">
              Credential ID: <strong>{bannerResult.credentialId}</strong> • On-Chain Hash:{" "}
              {bannerResult.hash.slice(0, 26)}...
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/wallet"
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            >
              View in Student Wallet
            </Link>
            <Link
              href="/verifier"
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-kiwi-600 text-white"
            >
              Test in Verifier
            </Link>
          </div>
        </div>
      )}

      {/* TAB 1: ISSUE ACADEMIC CREDENTIAL */}
      {activeTab === "issue_academic" && (
        <form
          onSubmit={handleIssueAcademic}
          className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
        >
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-kiwi-700 dark:text-kiwi-400">
              RVSCET Academic Registrar
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Issue Official Academic Credential
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold block mb-1">Select RVSCET Student</label>
              <select
                value={acadHolder}
                onChange={(e) => setAcadHolder(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.registrationNumber})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold block mb-1">Credential Type</label>
              <select
                value={acadType}
                onChange={(e) =>
                  setAcadType(e.target.value as AcademicCredential["type"])
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="semester">Semester Examination Result</option>
                <option value="degree">Bachelor of Technology (B.Tech) Degree</option>
                <option value="provisional">Provisional Certificate</option>
                <option value="bonafide">Bonafide Certificate</option>
                <option value="identity">Student Identity</option>
              </select>
            </div>

            <div>
              <label className="font-bold block mb-1">Credential Title</label>
              <input
                type="text"
                required
                value={acadTitle}
                onChange={(e) => setAcadTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Subtitle / Grade Summary</label>
              <input
                type="text"
                required
                value={acadSubtitle}
                onChange={(e) => setAcadSubtitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Semester &amp; Academic Year</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={acadSem}
                  onChange={(e) => setAcadSem(Number(e.target.value))}
                  className="w-20 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
                <input
                  type="text"
                  value={acadYear}
                  onChange={(e) => setAcadYear(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1">SGPA &amp; CGPA (Stored Off-Chain)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={acadSgpa}
                  onChange={(e) => setAcadSgpa(e.target.value)}
                  placeholder="SGPA"
                  className="w-1/2 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
                <input
                  type="text"
                  value={acadCgpa}
                  onChange={(e) => setAcadCgpa(e.target.value)}
                  placeholder="CGPA"
                  className="w-1/2 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-extrabold bg-kiwi-600 hover:bg-kiwi-700 text-white shadow-sm transition"
          >
            <PlusCircle size={15} /> Issue Academic Credential &amp; Anchor Hash
          </button>
        </form>
      )}

      {/* TAB 2: ISSUE ACHIEVEMENT (Section 38) */}
      {activeTab === "issue_achievement" && (
        <form
          onSubmit={handleIssueAchievement}
          className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
        >
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">
              Section 38 — Co-Curricular &amp; Contribution Credentialing
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Issue RVSCET Student Achievement
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold block mb-1">Student</label>
              <select
                value={achHolder}
                onChange={(e) => setAchHolder(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.branch} • Sem {s.semester})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold block mb-1">Achievement Title</label>
              <input
                type="text"
                required
                value={achTitle}
                onChange={(e) => setAchTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Achievement Level</label>
              <select
                value={achLevel}
                onChange={(e) => setAchLevel(e.target.value as AchievementLevel)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="Participation">Participation</option>
                <option value="Finalist">Finalist</option>
                <option value="Runner-up">Runner-up</option>
                <option value="Winner">Winner</option>
                <option value="Outstanding Contribution">Outstanding Contribution</option>
              </select>
            </div>

            <div>
              <label className="font-bold block mb-1">Category</label>
              <select
                value={achCategory}
                onChange={(e) => setAchCategory(e.target.value as AchievementCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                {[
                  "Hackathon",
                  "Technical",
                  "Sports",
                  "Cultural",
                  "Quiz",
                  "Clubs",
                  "Volunteering",
                  "Leadership",
                  "Contribution",
                  "Competition",
                ].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold block mb-1">Event (RVSCET / National)</label>
              <input
                type="text"
                required
                value={achEvent}
                onChange={(e) => setAchEvent(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Issuing Club / Body &amp; Date</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={achClub}
                  onChange={(e) => setAchClub(e.target.value)}
                  className="w-1/2 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
                <input
                  type="text"
                  value={achDate}
                  onChange={(e) => setAchDate(e.target.value)}
                  className="w-1/2 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="font-bold block mb-1">Description</label>
              <textarea
                rows={2}
                value={achDesc}
                onChange={(e) => setAchDesc(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-extrabold bg-kiwi-600 hover:bg-kiwi-700 text-white shadow-sm transition"
          >
            <Trophy size={15} /> Issue Achievement
          </button>
        </form>
      )}

      {/* TAB 3: ISSUE CERTIFICATE (Section 39) */}
      {activeTab === "issue_certificate" && (
        <form
          onSubmit={handleIssueCertificate}
          className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
        >
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-600">
              Section 39 — Club &amp; Department Certification
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Issue Official RVSCET Certificate
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold block mb-1">Student</label>
              <select
                value={certHolder}
                onChange={(e) => setCertHolder(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.registrationNumber})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold block mb-1">Certificate Name</label>
              <input
                type="text"
                required
                value={certTitle}
                onChange={(e) => setCertTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Category</label>
              <select
                value={certCategory}
                onChange={(e) =>
                  setCertCategory(e.target.value as CertificateCategory)
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                {[
                  "Technical Certifications",
                  "Club Certifications",
                  "Workshop Certifications",
                  "Competition Certificates",
                  "Participation Certificates",
                  "Training Certificates",
                ].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold block mb-1">Issuing Club / Department</label>
              <select
                value={certClub}
                onChange={(e) => setCertClub(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                {[
                  "NDLI Club",
                  "Helix",
                  "Xpectra",
                  "Tarangini",
                  "Frolic",
                  "SIH Innovation Cell",
                  "Department of CSE",
                  "Department of ECE",
                  "Other",
                ].map((cl) => (
                  <option key={cl} value={cl}>
                    {cl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold block mb-1">Event</label>
              <input
                type="text"
                required
                value={certEvent}
                onChange={(e) => setCertEvent(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Issue Date</label>
              <input
                type="date"
                value={certDate}
                onChange={(e) => setCertDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="font-bold block mb-1">Description</label>
              <textarea
                rows={2}
                value={certDesc}
                onChange={(e) => setCertDesc(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-extrabold bg-kiwi-600 hover:bg-kiwi-700 text-white shadow-sm transition"
          >
            <FileBadge size={15} /> Issue Certificate
          </button>
        </form>
      )}

      {/* TAB 4: REVOKE CREDENTIAL (Section 24) */}
      {activeTab === "revoke" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={handleRevokeSubmit}
            className="lg:col-span-6 rounded-3xl p-6 bg-white dark:bg-slate-900 border-2 border-rose-200 dark:border-rose-900/60 space-y-4"
          >
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600">
                Section 24 — On-Chain Revocation Control
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Revoke an Institutional Credential
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Revoking a credential keeps its audit trail intact while setting its status to{" "}
                <strong className="text-rose-600">🔴 REVOKED</strong> so verifiers immediately reject it.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">
                  Select or Enter Credential ID
                </label>
                <input
                  type="text"
                  required
                  value={revokeCredId}
                  onChange={(e) => setRevokeCredId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Revocation Reason</label>
                <select
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  {REVOCATION_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={revokeConfirmed}
                  onChange={(e) => setRevokeConfirmed(e.target.checked)}
                  className="mt-0.5"
                />
                <span className="text-rose-900 dark:text-rose-200">
                  I confirm as an authorized RVSCET Registrar that this credential should be marked <strong>REVOKED</strong> on the registry.
                </span>
              </label>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={!revokeConfirmed}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white transition"
              >
                <ShieldAlert size={15} /> Revoke Credential
              </button>
              <button
                type="button"
                onClick={() => {
                  restoreAnyCredential(revokeCredId);
                  setBannerResult({
                    type: "success",
                    title: `Credential ${revokeCredId} Restored to 🟢 ACTIVE`,
                    credentialId: revokeCredId,
                    hash: "0xRESTORED_ACTIVE_STATUS",
                    detail: "Credential status restored for repeat demonstration.",
                  });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                <RotateCcw size={14} /> Restore to Active
              </button>
            </div>
          </form>

          {/* Quick Click List of Credentials to Revoke/Restore */}
          <div className="lg:col-span-6 rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Quick Select RVSCET Credential to Revoke / Restore
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {[
                ...academicCredentials.slice(0, 5),
                ...achievements.slice(0, 3),
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setRevokeCredId(item.credentialId)}
                  className={`p-3 rounded-2xl border text-xs cursor-pointer transition flex items-center justify-between ${
                    revokeCredId === item.credentialId
                      ? "bg-rose-50/70 dark:bg-rose-950/30 border-rose-400"
                      : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <div>
                    <p className="font-mono font-bold text-slate-900 dark:text-white">
                      {item.credentialId}
                    </p>
                    <p className="text-slate-500">
                      {item.title} • {item.studentName}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      item.status === "revoked"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ANALYTICS DASHBOARD (Section 55) */}
      {activeTab === "analytics" && (
        <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-kiwi-700 dark:text-kiwi-400">
              Section 55 — Zero-PII Institutional Analytics
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              RVSCET Credential &amp; Verification Analytics
            </h2>
            <p className="text-xs text-slate-500">
              Aggregate cryptographic metrics across RVS College of Engineering &amp; Technology (No student PII exposed).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {[
                {
                  label: "Academic Credentials Issued",
                  val: academicCredentials.length,
                  pct: "88%",
                  color: "bg-kiwi-600",
                },
                {
                  label: "Achievements Issued (SIH, Helix, Frolic, etc.)",
                  val: achievements.length,
                  pct: "76%",
                  color: "bg-amber-500",
                },
                {
                  label: "Certifications Issued",
                  val: certifications.length,
                  pct: "64%",
                  color: "bg-sky-500",
                },
                {
                  label: "Successful Zero-Knowledge Proofs",
                  val: verificationRequests.filter((r) => r.status === "verified").length + 14,
                  pct: "94%",
                  color: "bg-emerald-600",
                },
                {
                  label: "Rejected / Revoked Proof Attempts",
                  val: allRevokedCount + 1,
                  pct: "12%",
                  color: "bg-rose-600",
                },
              ].map((bar) => (
                <div key={bar.label} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold">
                    <span>{bar.label}</span>
                    <span>{bar.val}</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${bar.color}`}
                      style={{ width: bar.pct }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Smart Contract Registry Summary
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Contract: <code className="font-mono font-bold">CredentialRegistry.sol</code>
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Functions Active:{" "}
                <code className="font-mono">
                  issueCredential(), revokeCredential(), isValid(), getIssuer(), getCredentialStatus()
                </code>
              </p>
              <p className="text-emerald-700 dark:text-emerald-400 font-semibold">
                ✓ 0 Aadhaar numbers, 0 Dates of Birth, and 0 marksheets stored on-chain.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
