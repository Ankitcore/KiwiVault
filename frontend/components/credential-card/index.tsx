"use client";

import React from "react";
import {
  Award,
  CheckCircle2,
  Eye,
  FileText,
  GraduationCap,
  IdCard,
  KeyRound,
  Lock,
  ShieldAlert,
  ShieldCheck,
  X,
} from "lucide-react";
import { AcademicCredential, IdentityReference } from "@/lib/credentials/seed-data";
import { KiwiLogo, RvscetLogo } from "@/components/kiwi-logo";

export function DegreeCredentialCard({
  credential,
  onProve,
  onViewDetails,
}: {
  credential: AcademicCredential;
  onProve: (cred: AcademicCredential) => void;
  onViewDetails: (cred: AcademicCredential) => void;
}) {
  const isRevoked = credential.status === "revoked";

  return (
    <div
      className={`relative rounded-3xl p-6 transition-all duration-300 border-2 overflow-hidden ${
        isRevoked
          ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800"
          : "bg-gradient-to-br from-kiwi-50/90 via-white to-bark-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-kiwi-950/30 border-kiwi-300 dark:border-kiwi-800/80 shadow-md hover:shadow-xl"
      }`}
    >
      {/* Top Row: Logos & Demo / Status Badges */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-kiwi-600 text-white flex items-center justify-center shadow-md">
            <GraduationCap size={26} />
          </div>
          <div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-kiwi-700 dark:text-kiwi-300 bg-kiwi-100/90 dark:bg-kiwi-950/80 px-2.5 py-0.5 rounded-full">
              Official Degree Credential • DEMO CREDENTIAL
            </span>
            <h3 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
              {credential.program.toUpperCase()}
            </h3>
            <p className="text-sm font-semibold text-kiwi-800 dark:text-kiwi-300">
              {credential.branch}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <RvscetLogo size={46} />
          <KiwiLogo size={38} float={false} />
        </div>
      </div>

      {/* Institution & Student Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-white/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 mb-5 text-xs">
        <div>
          <p className="text-slate-400 font-medium">Issuing Institution</p>
          <p className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">
            RVS College of Engineering &amp; Technology, Jamshedpur
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Affiliated to Jharkhand University of Technology (JUT)
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-slate-400 font-medium">Student</p>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">
              {credential.studentName}
            </p>
          </div>
          <div>
            <p className="text-slate-400 font-medium">Graduation</p>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">
              {credential.graduationYear || "2028"}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-slate-400 font-medium">Credential ID</p>
            <p className="font-mono font-bold text-kiwi-700 dark:text-kiwi-300 mt-0.5">
              {credential.credentialId}
            </p>
          </div>
        </div>
      </div>

      {/* Verification & Status Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 size={14} /> Institution Verified
          </span>
          {isRevoked ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300">
              <span className="w-2 h-2 rounded-full bg-rose-600" /> 🔴 REVOKED
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-kiwi-100 dark:bg-kiwi-950 text-kiwi-800 dark:text-kiwi-300 border border-kiwi-300 dark:border-kiwi-800">
              <span className="w-2 h-2 rounded-full bg-kiwi-600 animate-pulse" /> 🟢 Active
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetails(credential)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            <Eye size={14} /> View Details
          </button>
          <button
            onClick={() => onProve(credential)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-kiwi-600 hover:bg-kiwi-700 text-white shadow-sm transition"
          >
            <KeyRound size={14} /> Prove Degree
          </button>
        </div>
      </div>

      {isRevoked && credential.revocationReason && (
        <div className="mt-3 p-2.5 rounded-xl bg-rose-100/80 dark:bg-rose-950/60 text-xs text-rose-800 dark:text-rose-200 flex items-center gap-2">
          <ShieldAlert size={14} className="shrink-0" />
          <span>Revocation Reason: {credential.revocationReason}</span>
        </div>
      )}
    </div>
  );
}

export function AcademicCredentialCard({
  credential,
  onProve,
  onViewDetails,
}: {
  credential: AcademicCredential;
  onProve: (cred: AcademicCredential) => void;
  onViewDetails: (cred: AcademicCredential) => void;
}) {
  const isRevoked = credential.status === "revoked";

  return (
    <div
      className={`rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
        isRevoked
          ? "bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800"
          : "bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-kiwi-400 dark:hover:border-kiwi-700 shadow-sm hover:shadow-md"
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-kiwi-50 dark:bg-kiwi-950/70 text-kiwi-700 dark:text-kiwi-300 border border-kiwi-200 dark:border-kiwi-800 flex items-center justify-center shrink-0">
              {credential.type === "identity" ? (
                <IdCard size={20} />
              ) : credential.type === "semester" ? (
                <FileText size={20} />
              ) : (
                <Award size={20} />
              )}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {credential.type === "semester"
                  ? `Semester ${credential.semester} Record`
                  : credential.type.toUpperCase()}{" "}
                • DEMO
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {credential.title}
              </h4>
            </div>
          </div>
          <RvscetLogo size={32} />
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
          {credential.subtitle}
        </p>

        <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-[11px] mb-4">
          <div>
            <span className="text-slate-400 block">Credential ID</span>
            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
              {credential.credentialId}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Issued Date</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {credential.issueDate}
            </span>
          </div>
          {credential.sgpa && (
            <div>
              <span className="text-slate-400 block">SGPA / CGPA</span>
              <span className="font-bold text-kiwi-700 dark:text-kiwi-400">
                {credential.sgpa} / {credential.cgpa}
              </span>
            </div>
          )}
          <div>
            <span className="text-slate-400 block">Status</span>
            {isRevoked ? (
              <span className="font-bold text-rose-600 dark:text-rose-400">
                🔴 REVOKED
              </span>
            ) : (
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                🟢 ACTIVE
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => onViewDetails(credential)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <Eye size={13} /> View Details
        </button>
        <button
          onClick={() => onProve(credential)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-kiwi-600 hover:bg-kiwi-700 text-white shadow-sm transition"
        >
          <KeyRound size={13} /> Prove Claim
        </button>
      </div>
    </div>
  );
}

export function IdentityCredentialCard({
  identity,
  onProveIdentity,
  onProveAge,
}: {
  identity: IdentityReference;
  onProveIdentity: (idRef: IdentityReference) => void;
  onProveAge: (idRef: IdentityReference, minAge: number) => void;
}) {
  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-bark-100 dark:bg-bark-950/70 text-bark-700 dark:text-bark-300 border border-bark-200 dark:border-bark-800 flex items-center justify-center">
              <IdCard size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-bark-600 dark:text-bark-400">
                {identity.referenceType} • DEMO CREDENTIAL
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {identity.title}
              </h4>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 size={12} /> Identity Verified
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 text-white mb-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
              Masked Reference (Never Stored On-Chain)
            </span>
            <span className="font-mono text-base font-bold tracking-widest text-kiwi-300">
              {identity.maskedIdentifier}
            </span>
          </div>
          <Lock size={18} className="text-kiwi-400" />
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
          {identity.note}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => onProveIdentity(identity)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-kiwi-600 hover:bg-kiwi-700 text-white transition"
        >
          <ShieldCheck size={13} /> Prove Identity
        </button>
        {identity.referenceType === "Aadhaar Reference" && (
          <>
            <button
              onClick={() => onProveAge(identity, 18)}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition"
            >
              <KeyRound size={12} /> Age &ge; 18
            </button>
            <button
              onClick={() => onProveAge(identity, 21)}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition"
            >
              <KeyRound size={12} /> Age &ge; 21
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function AcademicDetailModal({
  credential,
  onClose,
  onProve,
}: {
  credential: AcademicCredential | null;
  onClose: () => void;
  onProve: (cred: AcademicCredential) => void;
}) {
  if (!credential) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-kiwi-50 via-white to-bark-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <RvscetLogo size={42} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-kiwi-100 text-kiwi-800 dark:bg-kiwi-950 dark:text-kiwi-300">
                  Official Academic Record • DEMO CREDENTIAL
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {credential.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close details"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {/* Student & Academic Metadata Grid (Section 15) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
            <div>
              <span className="text-slate-400 block">Student Name</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {credential.studentName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Registration Number</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {credential.registrationNumber}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Roll Number</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {credential.rollNumber}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Program &amp; Branch</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {credential.program} — {credential.branch}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Semester &amp; Academic Year</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {credential.semester ? `Semester ${credential.semester}` : "Full Program"} (
                {credential.academicYear})
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Credential ID</span>
              <span className="font-mono font-bold text-kiwi-700 dark:text-kiwi-300">
                {credential.credentialId}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Institution</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {credential.institution}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Affiliated University</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {credential.university}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Issue Date &amp; Status</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {credential.issueDate} •{" "}
                <strong
                  className={
                    credential.status === "revoked" ? "text-rose-600" : "text-emerald-600"
                  }
                >
                  {credential.status.toUpperCase()}
                </strong>
              </span>
            </div>
          </div>

          {/* Subjects Table if available */}
          {credential.subjects && credential.subjects.length > 0 && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                <span>Subject-Wise Marks &amp; Credits (Stored Off-Chain Only)</span>
                <span>
                  SGPA: <strong>{credential.sgpa}</strong> | CGPA:{" "}
                  <strong>{credential.cgpa}</strong>
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-4">Code</th>
                      <th className="py-2.5 px-4">Subject Title</th>
                      <th className="py-2.5 px-4 text-center">Credits</th>
                      <th className="py-2.5 px-4 text-center">Marks</th>
                      <th className="py-2.5 px-4 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {credential.subjects.map((sub) => (
                      <tr key={sub.code}>
                        <td className="py-2.5 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                          {sub.code}
                        </td>
                        <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-white">
                          {sub.name}
                        </td>
                        <td className="py-2.5 px-4 text-center">{sub.credits}</td>
                        <td className="py-2.5 px-4 text-center">
                          {sub.marks} / {sub.maxMarks}
                        </td>
                        <td className="py-2.5 px-4 text-center font-bold text-kiwi-700 dark:text-kiwi-400">
                          {sub.grade}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* On-Chain vs Off-Chain Privacy Architecture Box */}
          <div className="p-4 rounded-2xl bg-kiwi-50/70 dark:bg-kiwi-950/30 border border-kiwi-200 dark:border-kiwi-900 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-kiwi-900 dark:text-kiwi-200 flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-kiwi-600" />
                Blockchain Anchor &amp; Off-Chain Privacy Separation
              </span>
              <span className="font-mono text-[11px] text-kiwi-700 dark:text-kiwi-400">
                Result: {credential.resultStatus || "VERIFIED"}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Individual subject marks, roll number, and registration number remain{" "}
              <strong>strictly off-chain</strong> inside your Kiwi Vault. Only the non-PII credential hash is anchored on-chain:
            </p>
            <p className="font-mono text-[11px] text-slate-500 break-all">
              Credential Hash: {credential.credentialHash}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 transition"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onProve(credential);
            }}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-kiwi-600 hover:bg-kiwi-700 text-white shadow-sm transition"
          >
            <KeyRound size={14} /> Generate Selective ZK Proof
          </button>
        </div>
      </div>
    </div>
  );
}
