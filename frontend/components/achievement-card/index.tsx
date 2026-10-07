"use client";

import React from "react";
import {
  Award,
  CheckCircle2,
  Eye,
  KeyRound,
  Medal,
  ShieldAlert,
  Sparkles,
  Trophy,
} from "lucide-react";
import { AchievementRecord } from "@/lib/credentials/seed-data";
import { RvscetLogo } from "@/components/kiwi-logo";

export function AchievementCard({
  achievement,
  onProve,
  onViewCertificate,
}: {
  achievement: AchievementRecord;
  onProve: (ach: AchievementRecord) => void;
  onViewCertificate: (ach: AchievementRecord) => void;
}) {
  const isRevoked = achievement.status === "revoked";

  const levelBadgeColor =
    achievement.level === "Winner"
      ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800"
      : achievement.level === "Outstanding Contribution"
      ? "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-800"
      : "bg-kiwi-100 text-kiwi-800 border-kiwi-300 dark:bg-kiwi-950/70 dark:text-kiwi-300 dark:border-kiwi-800";

  return (
    <div
      className={`rounded-3xl p-5 border transition-all duration-200 flex flex-col justify-between ${
        isRevoked
          ? "bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800"
          : "bg-gradient-to-b from-amber-50/40 via-white to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 border-amber-200/80 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-700 shadow-sm hover:shadow-md"
      }`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-sm shrink-0">
              {achievement.level === "Outstanding Contribution" ? (
                <Sparkles size={22} />
              ) : achievement.level === "Winner" ? (
                <Trophy size={22} />
              ) : (
                <Medal size={22} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  🏆 ACHIEVEMENT
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${levelBadgeColor}`}
                >
                  {achievement.level}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 leading-snug">
                {achievement.title}
              </h4>
            </div>
          </div>
          <RvscetLogo size={32} />
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
          {achievement.description}
        </p>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] mb-4">
          <div>
            <span className="text-slate-400 block">Issued By</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              RVSCET ({achievement.clubOrBody.split(" ")[0]})
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Category &amp; Date</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {achievement.category} • {achievement.date}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Credential ID</span>
            <span className="font-mono font-bold text-kiwi-700 dark:text-kiwi-400">
              {achievement.credentialId}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Verification</span>
            {isRevoked ? (
              <span className="inline-flex items-center gap-1 font-bold text-rose-600">
                <ShieldAlert size={12} /> Revoked
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={12} /> Institution Verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => onViewCertificate(achievement)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800 hover:bg-slate-200/70 transition"
        >
          <Eye size={13} /> View Certificate
        </button>
        <button
          onClick={() => onProve(achievement)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-kiwi-600 hover:bg-kiwi-700 text-white shadow-sm transition"
        >
          <KeyRound size={13} /> Prove Achievement
        </button>
      </div>
    </div>
  );
}
