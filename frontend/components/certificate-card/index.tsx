"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  CheckCircle2,
  Eye,
  FileBadge,
  KeyRound,
  Printer,
  ShieldAlert,
  ShieldCheck,
  X,
} from "lucide-react";
import { AchievementRecord, CertificationRecord } from "@/lib/credentials/seed-data";
import { KiwiLogo, RvscetLogo } from "@/components/kiwi-logo";

export function CertificateCard({
  certificate,
  onProve,
  onPreview,
}: {
  certificate: CertificationRecord;
  onProve: (cert: CertificationRecord) => void;
  onPreview: (cert: CertificationRecord) => void;
}) {
  const isRevoked = certificate.status === "revoked";

  return (
    <div
      className={`rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
        isRevoked
          ? "bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800"
          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-kiwi-400 shadow-sm hover:shadow-md"
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 flex items-center justify-center shrink-0">
              <FileBadge size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                📜 {certificate.category} • DEMO
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {certificate.title}
              </h4>
            </div>
          </div>
          <RvscetLogo size={32} />
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
          {certificate.description}
        </p>

        <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-[11px] mb-4">
          <div>
            <span className="text-slate-400 block">Issuing Authority</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {certificate.issuingClubOrDept}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Student &amp; Date</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {certificate.studentName} • {certificate.issueDate}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Credential ID</span>
            <span className="font-mono font-bold text-kiwi-700 dark:text-kiwi-400">
              {certificate.credentialId}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Status</span>
            {isRevoked ? (
              <span className="inline-flex items-center gap-1 font-bold text-rose-600">
                <ShieldAlert size={12} /> 🔴 REVOKED
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={12} /> 🟢 Verified
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => onPreview(certificate)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition"
        >
          <Eye size={13} /> Preview Certificate
        </button>
        <button
          onClick={() => onProve(certificate)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-kiwi-600 hover:bg-kiwi-700 text-white shadow-sm transition"
        >
          <KeyRound size={13} /> Prove Claim
        </button>
      </div>
    </div>
  );
}

export function CertificatePreviewModal({
  item,
  onClose,
  onProve,
}: {
  item: CertificationRecord | AchievementRecord | null;
  onClose: () => void;
  onProve: () => void;
}) {
  if (!item) return null;

  const isAch = "level" in item;
  const dateStr = isAch ? item.date : item.issueDate;
  const subAuthority = isAch ? item.clubOrBody : item.issuingClubOrDept;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-3.5 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <span className="break-words whitespace-normal text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <ShieldCheck size={16} className="text-kiwi-600" />
            Official Institutional Certificate Preview • DEMO CREDENTIAL
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-50"
            >
              <Printer size={13} /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Certificate Canvas */}
        <div className="p-6 sm:p-8">
          <div className="relative rounded-2xl border-4 border-double border-kiwi-600/70 dark:border-kiwi-500/60 bg-gradient-to-br from-kiwi-50/40 via-white to-amber-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-6 sm:p-10 text-center shadow-inner">
            {/* Header Logos */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <RvscetLogo size={60} />
              <div className="text-center">
                <p className="text-[11px] font-bold uppercase tracking-widest text-kiwi-700 dark:text-kiwi-400">
                  RVS College of Engineering &amp; Technology, Jamshedpur
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Affiliated to Jharkhand University of Technology (JUT), Ranchi
                </p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  DEMO CREDENTIAL — KIWI VAULT VERIFIABLE CERTIFICATE
                </span>
              </div>
              <KiwiLogo size={54} float={false} />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
              {isAch ? "CERTIFICATE OF ACHIEVEMENT" : "CERTIFICATE OF COMPLETION"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              This is to proudly certify that
            </p>

            <div className="inline-block px-8 py-2 mb-4 border-b-2 border-kiwi-500">
              <span className="text-2xl font-extrabold text-kiwi-800 dark:text-kiwi-300">
                {item.studentName}
              </span>
            </div>

            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 max-w-xl mx-auto mb-2">
              {item.title}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg mx-auto mb-6 leading-relaxed">
              {item.description}
            </p>

            {/* Footer Signatures & QR */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pt-6 border-t border-slate-200 dark:border-slate-700 text-xs">
              <div className="text-left">
                <p className="text-slate-400">Issuing Body</p>
                <p className="font-bold text-slate-800 dark:text-slate-200">{subAuthority}</p>
                <p className="text-[11px] text-slate-500">Date: {dateStr}</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <QRCodeSVG
                    value={`KIWI_VAULT_VERIFY:${item.credentialId}`}
                    size={68}
                  />
                </div>
                <span className="font-mono text-[10px] font-bold text-kiwi-700 dark:text-kiwi-400 mt-1">
                  {item.credentialId}
                </span>
              </div>

              <div className="sm:text-right">
                <p className="text-slate-400">Cryptographic Anchor</p>
                <p className="font-bold text-emerald-600 dark:text-emerald-400">
                  ✓ RVSCET &amp; Kiwi Vault Signed
                </p>
                <p className="font-mono text-[10px] text-slate-400 break-words whitespace-normal">
                  {item.credentialHash.slice(0, 24)}...
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between">
          <span className="text-xs text-slate-500">
            Don&apos;t share the full certificate unless needed — prove the claim with Zero-Knowledge!
          </span>
          <button
            onClick={() => {
              onClose();
              onProve();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-kiwi-600 hover:bg-kiwi-700 text-white shadow-sm transition"
          >
            <KeyRound size={14} /> Prove Without Sharing Certificate
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
