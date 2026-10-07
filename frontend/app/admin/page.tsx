"use client";

import React, { useState } from "react";
import {
  Building2,
  CheckCircle2,
  RotateCcw,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useVault } from "@/lib/auth/vault-context";
import { RvscetLogo } from "@/components/kiwi-logo";
import { RVSCET_ISSUER_ADDRESS } from "@/lib/blockchain/registry";

export default function AdminPage() {
  const {
    students,
    academicCredentials,
    achievements,
    certifications,
    verificationRequests,
    resetDemoState,
  } = useVault();

  const [issuers, setIssuers] = useState([
    {
      name: "Dr. R. K. Sharma — Registrar, RVSCET Jamshedpur",
      email: "issuer@rvscet.ac.in",
      address: RVSCET_ISSUER_ADDRESS,
      authorized: true,
    },
    {
      name: "Controller of Examinations — JUT Ranchi Cell",
      email: "coe@rvscet.ac.in",
      address: "0x91A2B3C4D5E6F708192A3B4C5D6E7F8091A2B3C4",
      authorized: true,
    },
    {
      name: "Student Activity & Club Council (Helix / Frolic / SIH)",
      email: "clubs@rvscet.ac.in",
      address: "0x44F5E6D7C8B9A0123456789ABCDEF0123456789A",
      authorized: true,
    },
  ]);

  const toggleIssuer = (email: string) => {
    setIssuers((prev) =>
      prev.map((i) =>
        i.email === email ? { ...i, authorized: !i.authorized } : i
      )
    );
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <RvscetLogo size={52} />
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-kiwi-700 dark:text-kiwi-400">
              Section 36 — Institutional Governance &amp; System Administration
            </span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              RVSCET × Kiwi Vault Admin Console
            </h1>
            <p className="text-xs text-slate-500">
              Manage authorized institutional issuers, smart contract parameters, and system state.
            </p>
          </div>
        </div>
        <button
          onClick={resetDemoState}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 self-start sm:self-center"
        >
          <RotateCcw size={14} /> Reset All Demo Data
        </button>
      </section>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400 block">Enrolled Demo Students</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {students.length}
          </span>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400 block">Total Credentials Anchored</span>
          <span className="text-2xl font-black text-kiwi-600">
            {academicCredentials.length + achievements.length + certifications.length}
          </span>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400 block">Authorized Issuers</span>
          <span className="text-2xl font-black text-emerald-600">
            {issuers.filter((i) => i.authorized).length}
          </span>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400 block">ZK Verification Logs</span>
          <span className="text-2xl font-black text-purple-600">
            {verificationRequests.length}
          </span>
        </div>
      </div>

      {/* Authorized Issuers Table */}
      <section className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
          Authorized RVSCET Smart Contract Issuers (setAuthorizedIssuer)
        </h2>
        <div className="space-y-3">
          {issuers.map((iss) => (
            <div
              key={iss.email}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs"
            >
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{iss.name}</p>
                <p className="text-slate-500">
                  {iss.email} • Wallet:{" "}
                  <span className="font-mono">{iss.address.slice(0, 18)}...</span>
                </p>
              </div>
              <button
                onClick={() => toggleIssuer(iss.email)}
                className={`px-4 py-2 rounded-xl font-bold transition ${
                  iss.authorized
                    ? "bg-emerald-600 text-white"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {iss.authorized ? "✓ Authorized Issuer" : "Revoked Issuer"}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
