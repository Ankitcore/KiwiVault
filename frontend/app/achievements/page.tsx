"use client";

import React, { useMemo, useState } from "react";
import { Sparkles, Trophy, Users } from "lucide-react";
import { useVault } from "@/lib/auth/vault-context";
import { AchievementCard } from "@/components/achievement-card";
import { CertificatePreviewModal } from "@/components/certificate-card";
import { ZKProverModal } from "@/components/verification/zk-prover-modal";
import { AchievementRecord } from "@/lib/credentials/seed-data";
import { RvscetLogo } from "@/components/kiwi-logo";

const CATEGORIES = [
  "All",
  "Hackathon",
  "Technical",
  "Sports",
  "Cultural",
  "Quiz",
  "Clubs",
  "Volunteering",
  "Leadership",
  "Contribution",
];

const RVSCET_CLUBS = [
  { name: "Smart India Hackathon", tag: "National Innovation", badge: "🏆 SIH" },
  { name: "Helix", tag: "Technical & Coding Club", badge: "💻 Helix" },
  { name: "Frolic", tag: "Annual Sports Meet", badge: "🏅 Frolic" },
  { name: "Tarangini", tag: "Annual Cultural Fest", badge: "🎭 Tarangini" },
  { name: "Xpectra", tag: "Photography & Media Club", badge: "📸 Xpectra" },
  { name: "NDLI Club", tag: "Digital Library Chapter", badge: "📚 NDLI" },
];

export default function AchievementsPage() {
  const { achievements, activeStudent } = useVault();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [clubFilter, setClubFilter] = useState<string | null>(null);
  const [showAllStudents, setShowAllStudents] = useState(false);
  const [previewItem, setPreviewItem] = useState<AchievementRecord | null>(null);
  const [zkItem, setZkItem] = useState<AchievementRecord | null>(null);

  const filteredAchievements = useMemo(() => {
    return achievements.filter((a) => {
      if (!showAllStudents && a.holderId !== activeStudent.id) return false;
      if (
        selectedCategory !== "All" &&
        a.category.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }
      if (
        clubFilter &&
        !a.title.toLowerCase().includes(clubFilter.toLowerCase()) &&
        !a.event.toLowerCase().includes(clubFilter.toLowerCase()) &&
        !a.clubOrBody.toLowerCase().includes(clubFilter.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [achievements, activeStudent.id, selectedCategory, clubFilter, showAllStudents]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-[2.5rem] p-8 sm:p-10 bg-gradient-to-br from-white via-amber-50/50 to-kiwi-100/30 dark:from-slate-950 dark:via-slate-900 dark:to-kiwi-950/20 border border-slate-200/60 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <Trophy size={48} className="text-amber-500" />
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-extrabold mb-1">
                <span>RVSCET Co-Curricular &amp; Contribution Ledger</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                Achievements
              </h1>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                &ldquo;Your journey beyond the classroom.&rdquo;
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
                ? "Showing: All RVSCET Demo Students"
                : `Showing: ${activeStudent.name}`}
            </button>
            <RvscetLogo size={48} />
          </div>
        </div>

        {/* RVSCET Club & Fest Spotlight Filters (Section 19) */}
        <div className="mt-6 pt-5 border-t border-amber-200/60 dark:border-slate-800">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">
            RVSCET Official Clubs, Fests &amp; Hackathons (Click to filter):
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {RVSCET_CLUBS.map((club) => {
              const active = clubFilter === club.name;
              return (
                <button
                  key={club.name}
                  onClick={() => setClubFilter(active ? null : club.name)}
                  className={`p-3 rounded-2xl border text-left transition ${
                    active
                      ? "bg-kiwi-600 text-white border-kiwi-600 shadow-sm"
                      : "bg-white/90 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700 hover:border-amber-400"
                  }`}
                >
                  <span className="text-xs font-extrabold block">{club.badge}</span>
                  <span
                    className={`text-[10px] block mt-0.5 ${
                      active ? "text-kiwi-100" : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {club.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
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

      {/* Contribution-Based Achievement Banner (Section 21) */}
      <div className="p-4 rounded-2xl bg-purple-50/80 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Sparkles size={18} className="text-purple-600 shrink-0" />
          <span className="text-slate-700 dark:text-slate-200">
            <strong>Institutional Contributions Verified:</strong> Kiwi Vault issues verifiable credentials for Club Management, Event Organization (Tarangini / Frolic), Technical Workshops (Helix), and Volunteer Leadership.
          </span>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAchievements.map((ach) => (
          <AchievementCard
            key={ach.id}
            achievement={ach}
            onViewCertificate={(a) => setPreviewItem(a)}
            onProve={(a) => setZkItem(a)}
          />
        ))}
      </div>

      <CertificatePreviewModal
        item={previewItem}
        onClose={() => setPreviewItem(null)}
        onProve={() => {
          if (previewItem) setZkItem(previewItem);
        }}
      />

      <ZKProverModal
        isOpen={Boolean(zkItem)}
        onClose={() => setZkItem(null)}
        defaultClaimType="achievement"
        credentialId={zkItem?.credentialId || "KV-ACH-2026-0042"}
        claimTitle={zkItem ? `${zkItem.title} (${zkItem.level})` : "RVSCET Achievement"}
        category={zkItem?.category || "Hackathon"}
      />
    </div>
  );
}
