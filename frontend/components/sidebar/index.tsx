"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  Building2,
  Compass,
  FileBadge,
  History,
  Info,
  LayoutDashboard,
  Lock,
  Presentation,
  Settings,
  ShieldCheck,
  Trophy,
  User,
  Wallet,
} from "lucide-react";
import { useVault } from "@/lib/auth/vault-context";
import { InstitutionalBadge } from "@/components/kiwi-logo";

export function Sidebar() {
  const pathname = usePathname();
  const { t, activeStudent, user, setActiveStudentById, students, loginWithRole } = useVault();

  const studentLinks = [
    { href: "/dashboard", label: t("navDashboard"), icon: LayoutDashboard },
    { href: "/wallet", label: t("navWallet"), icon: Wallet },
    { href: "/achievements", label: t("navAchievements"), icon: Trophy },
    { href: "/certifications", label: t("navCertifications"), icon: FileBadge },
    { href: "/timeline", label: t("navTimeline"), icon: History },
    { href: "/privacy", label: t("navPrivacy"), icon: Lock },
    { href: "/security", label: t("navSecurity"), icon: ShieldCheck },
    { href: "/profile", label: t("navProfile"), icon: User },
  ];

  const portalLinks = [
    { href: "/issuer", label: t("navIssuer"), icon: Building2 },
    { href: "/verifier", label: t("navVerifier"), icon: Award },
    { href: "/admin", label: t("navAdmin"), icon: Settings },
    { href: "/demo", label: "How it works", icon: Presentation },
    { href: "/about", label: t("navAbout"), icon: Info },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 min-h-[calc(100vh-4rem)] p-4 justify-between">
        <div className="space-y-6">
          {/* Active Student Vault Summary Pill */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-kiwi-50 via-white to-bark-50 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-900 border border-kiwi-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-kiwi-700 dark:text-kiwi-400">
                Active Student Vault
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-kiwi-100 dark:bg-kiwi-950 text-kiwi-800 dark:text-kiwi-300">
                Sem {activeStudent.semester}
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {activeStudent.name}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {activeStudent.branch}
            </p>
            <p className="font-mono text-[10px] text-slate-400 mt-1">
              Reg: {activeStudent.registrationNumber}
            </p>
          </div>

          {/* Student Vault Navigation */}
          <div>
            <p className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Student Identity &amp; Vault
            </p>
            <nav className="space-y-1">
              {studentLinks.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                      active
                        ? "bg-kiwi-600 text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Institutional & Verification Portals */}
          <div>
            <p className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Institution &amp; Verifier
            </p>
            <nav className="space-y-1">
              {portalLinks.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                      active
                        ? "bg-kiwi-600 text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Institutional Footer Badge */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <InstitutionalBadge compact />
          <p className="text-xs text-slate-400 leading-relaxed px-1 mt-2">
            <strong>KiwiVault</strong> | Developed By Team Nexus
          </p>
        </div>
      </aside>

      {/* Mobile Top Role & Student Bar */}
      <div className="lg:hidden bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1 shrink-0">
          {(["student", "issuer", "verifier"] as const).map((r) => (
            <button
              key={r}
              onClick={() => loginWithRole(r)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize ${
                user.role === r
                  ? "bg-kiwi-600 text-white"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <select
          aria-label="Mobile Select Demo Student"
          value={activeStudent.id}
          onChange={(e) => setActiveStudentById(e.target.value)}
          className="text-[11px] font-bold rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 px-2 py-1 border border-slate-200 dark:border-slate-700"
        >
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} (Sem {s.semester})
            </option>
          ))}
        </select>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around"
        aria-label="Mobile Bottom Navigation"
      >
        {[
          { href: "/dashboard", label: "Home", icon: LayoutDashboard },
          { href: "/wallet", label: "Wallet", icon: Wallet },
          { href: "/achievements", label: "Awards", icon: Trophy },
          { href: "/issuer", label: "Issuer", icon: Building2 },
          { href: "/verifier", label: "Verify", icon: ShieldCheck },
          { href: "/demo", label: "How it works", icon: Compass },
        ].map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-[10px] font-bold transition ${
                active
                  ? "text-kiwi-600 dark:text-kiwi-400"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
