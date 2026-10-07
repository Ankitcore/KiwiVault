"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  FileCheck2,
  GraduationCap,
  KeyRound,
  Lock,
  Presentation,
  ShieldCheck,
  Sparkles,
  XCircle,
  EyeOff,
  ChevronRight
} from "lucide-react";
import { KiwiLogo, RvscetLogo } from "@/components/kiwi-logo";
import { useVault } from "@/lib/auth/vault-context";

export default function HomePage() {
  const { t, loginWithRole } = useVault();
  const router = useRouter();

  const launchRole = (role: "student" | "issuer" | "verifier", path: string) => {
    loginWithRole(role);
    router.push(path);
  };

  return (
    <div className="space-y-16 pb-10">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-white via-kiwi-50/50 to-kiwi-100/30 dark:from-slate-950 dark:via-slate-900 dark:to-kiwi-950/20 border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col items-center text-center px-4 sm:px-6">
        
        {/* Logos & Institution Pill */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm mb-8 animate-float">
          <KiwiLogo size={20} float={false} />
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-wide">
            KIWI VAULT
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
          <RvscetLogo size={20} />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400 hidden sm:inline-block">
            RVSCET Jamshedpur
          </span>
        </div>

        {/* Headlines */}
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-kiwi-600 to-kiwi-400">
              Prove More.
            </span>{" "}
            Reveal Less.
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium">
            The privacy-preserving digital identity wallet for RVS College of Engineering & Technology. Prove your achievements using Zero-Knowledge cryptography without exposing personal data.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-2xl">
          <button
            onClick={() => launchRole("student", "/dashboard")}
            className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-bold bg-kiwi-600 hover:bg-kiwi-500 text-white shadow-xl shadow-kiwi-600/20 transition-all hover:scale-105"
          >
            <GraduationCap size={20} />
            Open Student Vault
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <Link
            href="/demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-bold bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm transition-all hover:scale-105"
          >
            <Presentation size={20} />
            See How it Works
          </Link>
        </div>

        {/* Secondary Portal Links */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
          <button
            onClick={() => launchRole("issuer", "/issuer")}
            className="hover:text-kiwi-600 dark:hover:text-kiwi-400 transition-colors flex items-center gap-1.5"
          >
            <Building2 size={16} /> Issuer Portal <ChevronRight size={14} />
          </button>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 my-auto hidden sm:block"></div>
          <button
            onClick={() => launchRole("verifier", "/verifier")}
            className="hover:text-kiwi-600 dark:hover:text-kiwi-400 transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck size={16} /> Verifier Gateway <ChevronRight size={14} />
          </button>
        </div>
      </section>

      {/* COMPARISON CARDS */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 sm:px-6">
        <div className="relative group overflow-hidden rounded-3xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <XCircle size={100} className="text-rose-500" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider mb-6">
            <XCircle size={16} /> Traditional Verification
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Total Privacy Loss
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            Handing over raw documents exposes your entire identity. Your 12-digit Aadhaar, exact Date of Birth, and home address are vulnerable to leaks and forgery.
          </p>
          <ul className="space-y-3">
            {[
              "Exposes full 12-digit Aadhaar",
              "Exposes exact Date of Birth",
              "Vulnerable to photocopying & forgery",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
                <span className="mt-0.5 text-rose-500 font-bold">✕</span> {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative group overflow-hidden rounded-3xl p-8 bg-kiwi-50 dark:bg-kiwi-900/10 border border-kiwi-200 dark:border-kiwi-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldCheck size={100} className="text-kiwi-600" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-kiwi-100 dark:bg-kiwi-900/50 text-kiwi-800 dark:text-kiwi-300 font-bold text-xs uppercase tracking-wider mb-6">
            <Sparkles size={16} /> Zero-Knowledge Proofs
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Mathematical Certainty
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            Prove specific claims (e.g., &quot;Age ≥ 18&quot;) mathematically. Verifiers get 100% cryptographic assurance without ever seeing your underlying documents.
          </p>
          <ul className="space-y-3">
            {[
              "Prove claims without revealing raw data",
              "Zero PII (Personally Identifiable Information) leaked",
              "Instant on-chain revocation checks",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
                <span className="mt-0.5 text-kiwi-600 font-bold">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">How Kiwi Vault Works</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium">The end-to-end credential lifecycle in four simple steps.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Issue",
              desc: "RVSCET issues your degree or achievement, anchored securely on-chain.",
              icon: Building2,
              href: "/issuer",
            },
            {
              step: "02",
              title: "Store",
              desc: "Credentials remain encrypted locally in your personal Kiwi Vault.",
              icon: Lock,
              href: "/wallet",
            },
            {
              step: "03",
              title: "Prove",
              desc: "Generate ZK Proofs to validate claims without showing the full document.",
              icon: KeyRound,
              href: "/privacy",
            },
            {
              step: "04",
              title: "Verify",
              desc: "Third parties instantly verify the proof and issuer signature in seconds.",
              icon: FileCheck2,
              href: "/verifier",
            },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                href={item.href}
                className="group relative bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 hover:border-kiwi-400 dark:hover:border-kiwi-600 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col hover:-translate-y-1"
              >
                <div className="text-5xl font-black text-slate-100 dark:text-slate-800 mb-4 group-hover:text-kiwi-50 dark:group-hover:text-kiwi-900/30 transition-colors">
                  {item.step}
                </div>
                <div className="absolute top-8 right-6 p-3 rounded-2xl bg-kiwi-50 dark:bg-slate-800 text-kiwi-600 dark:text-kiwi-400 group-hover:bg-kiwi-600 group-hover:text-white transition-colors">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 flex-1 leading-relaxed">{item.desc}</p>
                <div className="mt-6 flex items-center gap-2 text-sm font-bold text-kiwi-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight size={16} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* PROTOTYPE DISCLAIMER BANNER */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="p-2 rounded-full bg-slate-200 dark:bg-slate-700">
              <EyeOff size={16} className="text-slate-600 dark:text-slate-300" />
            </div>
            <span>{t("prototypeDisclaimer")}</span>
          </div>
          <Link href="/about" className="inline-flex items-center gap-1.5 text-sm font-bold text-kiwi-600 dark:text-kiwi-400 hover:text-kiwi-700 transition-colors shrink-0">
            Read Privacy Spec <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
