"use client";

import React from "react";

export function KiwiLogo({
  size = 40,
  float = true,
  className = "",
}: {
  size?: number;
  float?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center justify-center select-none transition-transform duration-300 hover:scale-105 ${
        float ? " motion-safe:animate-float" : ""
      } ${className}`}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/kiwi-vault-logo.png"
        alt="Kiwi Vault Official Logo"
        width={size}
        height={size}
        className="w-full h-full object-contain drop-shadow-sm"
      />
    </div>
  );
}

export function RvscetLogo({
  size = 44,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-white p-1 shadow-sm border border-slate-200 dark:border-slate-700 shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/rvscet-logo.jpg"
        alt="RVS College of Engineering & Technology (RVSCET), Jamshedpur Logo"
        width={size - 4}
        height={size - 4}
        className="w-full h-full object-contain rounded-full"
      />
    </div>
  );
}

export function InstitutionalBadge({ compact = false }: { compact?: boolean }) {
  return (
    <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 border border-kiwi-200 dark:border-slate-700 shadow-sm">
      <KiwiLogo size={compact ? 22 : 26} float={false} />
      <span className="text-xs font-semibold text-slate-400">×</span>
      <RvscetLogo size={compact ? 24 : 28} />
      <div className="text-left leading-tight">
        <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
          RVSCET Jamshedpur
        </p>
        {!compact && (
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            Affiliated to JUT Ranchi
          </p>
        )}
      </div>
    </div>
  );
}

export function VaultLoadingScreen({ message }: { message?: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="relative mb-5">
        <div className="absolute -inset-4 rounded-full bg-kiwi-400/20 blur-xl animate-pulse" />
        <KiwiLogo size={88} float />
      </div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
        {message || "Opening your vault..."}
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
        Your credentials. Your achievements. Your privacy.
      </p>
    </div>
  );
}
