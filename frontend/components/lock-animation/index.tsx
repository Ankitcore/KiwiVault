"use client";

import React from "react";
import { CheckCircle2, KeyRound, Lock, LockOpen, ShieldAlert, ShieldCheck } from "lucide-react";

export type LockState =
  | "idle"
  | "proving"
  | "verified"
  | "revoked"
  | "age_restricted"
  | "failed";

export function AnimatedLockKey({
  state,
  size = "md",
  label,
}: {
  state: LockState;
  size?: "sm" | "md" | "lg";
  label?: string;
}) {
  const dims =
    size === "lg"
      ? "w-20 h-20"
      : size === "sm"
      ? "w-10 h-10"
      : "w-14 h-14";

  const iconSize = size === "lg" ? 36 : size === "sm" ? 18 : 26;

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <div
        className={`relative rounded-2xl flex items-center justify-center transition-all duration-500 ${dims} ${
          state === "verified"
            ? "bg-kiwi-100 dark:bg-kiwi-950/80 text-kiwi-700 dark:text-kiwi-300 border-2 border-kiwi-400 shadow-lg shadow-kiwi-500/20 scale-105"
            : state === "proving"
            ? "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 border-2 border-amber-300"
            : state === "revoked" || state === "failed"
            ? "bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-300 border-2 border-rose-400"
            : state === "age_restricted"
            ? "bg-orange-100 dark:bg-orange-950/70 text-orange-700 dark:text-orange-300 border-2 border-orange-400"
            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
        }`}
      >
        {state === "proving" && (
          <KeyRound
            size={iconSize}
            className="motion-safe:animate-spin text-amber-600 dark:text-amber-400"
          />
        )}
        {state === "verified" && (
          <>
            <LockOpen size={iconSize} className="transition-transform duration-300" />
            <span className="absolute -bottom-1 -right-1 bg-kiwi-600 text-white rounded-full p-0.5 shadow">
              <CheckCircle2 size={14} />
            </span>
          </>
        )}
        {(state === "revoked" || state === "failed") && (
          <>
            <Lock size={iconSize} />
            <span className="absolute -bottom-1 -right-1 bg-rose-600 text-white rounded-full p-0.5 shadow">
              <ShieldAlert size={14} />
            </span>
          </>
        )}
        {state === "age_restricted" && (
          <>
            <Lock size={iconSize} />
            <span className="absolute -bottom-1 -right-1 bg-orange-600 text-white rounded-full p-0.5 shadow">
              <ShieldAlert size={14} />
            </span>
          </>
        )}
        {state === "idle" && (
          <>
            <Lock size={iconSize} />
            <span className="absolute -bottom-1 -right-1 bg-kiwi-600 text-white rounded-full p-0.5 shadow">
              <ShieldCheck size={13} />
            </span>
          </>
        )}
      </div>

      {label && (
        <span
          className={`text-xs font-semibold tracking-wide ${
            state === "verified"
              ? "text-kiwi-700 dark:text-kiwi-300"
              : state === "revoked" || state === "failed"
              ? "text-rose-600 dark:text-rose-400"
              : state === "age_restricted"
              ? "text-orange-700 dark:text-orange-400"
              : "text-slate-600 dark:text-slate-400"
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
}
