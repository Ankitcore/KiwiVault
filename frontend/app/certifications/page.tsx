"use client";

import React, { useMemo, useState } from "react";
import { FileBadge, Users } from "lucide-react";
import { useVault } from "@/lib/auth/vault-context";
import {
  CertificateCard,
  CertificatePreviewModal,
} from "@/components/certificate-card";
import { ZKProverModal } from "@/components/verification/zk-prover-modal";
import { CertificationRecord } from "@/lib/credentials/seed-data";
import { RvscetLogo } from "@/components/kiwi-logo";

const CERT_CATEGORIES = [
  "All",
  "Technical Certifications",
  "Club Certifications",
  "Workshop Certifications",
  "Competition Certificates",
  "Participation Certificates",
  "Training Certificates",
];

export default function CertificationsPage() {
  const { certifications, activeStudent } = useVault();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAllStudents, setShowAllStudents] = useState(false);
  const [previewCert, setPreviewCert] = useState<CertificationRecord | null>(null);
  const [zkCert, setZkCert] = useState<CertificationRecord | null>(null);

  const filteredCerts = useMemo(() => {
    return certifications.filter((c) => {
      if (!showAllStudents && c.holderId !== activeStudent.id) return false;
      if (selectedCategory !== "All" && c.category !== selectedCategory) return false;
      return true;
    });
  }, [certifications, activeStudent.id, selectedCategory, showAllStudents]);

  return (
    <div className="space-y-6">
      <section className="rounded-[2.5rem] p-8 sm:p-10 bg-gradient-to-br from-white via-sky-50/50 to-kiwi-100/30 dark:from-slate-950 dark:via-slate-900 dark:to-kiwi-950/20 border border-slate-200/60 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <FileBadge size={48} className="text-sky-500" />
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 text-xs font-extrabold mb-1">
                <span>Verifiable Institutional &amp; Club Certifications</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                Certifications
              </h1>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Official workshop, training, club, and technical certifications issued at RVSCET Jamshedpur.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 bg-white/60 dark:bg-slate-800/60 p-4 rounded-3xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setShowAllStudents((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm hover:border-kiwi-400 transition"
            >
              <Users size={16} className="text-kiwi-600" />
              {showAllStudents
                ? "Showing: All RVSCET Students"
                : `Showing: ${activeStudent.name}`}
            </button>
            <RvscetLogo size={48} />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1">
          {CERT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                selectedCategory === cat
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCerts.map((cert) => (
          <CertificateCard
            key={cert.id}
            certificate={cert}
            onPreview={(c) => setPreviewCert(c)}
            onProve={(c) => setZkCert(c)}
          />
        ))}
      </div>

      <CertificatePreviewModal
        item={previewCert}
        onClose={() => setPreviewCert(null)}
        onProve={() => {
          if (previewCert) setZkCert(previewCert);
        }}
      />

      <ZKProverModal
        isOpen={Boolean(zkCert)}
        onClose={() => setZkCert(null)}
        defaultClaimType="certificate"
        credentialId={zkCert?.credentialId || "KV-CERT-2025-000102"}
        claimTitle={zkCert?.title || "RVSCET Certificate"}
        category={zkCert?.category || "Technical Certifications"}
      />
    </div>
  );
}
