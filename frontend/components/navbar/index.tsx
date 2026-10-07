"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  Globe,
  KeyRound,
  LogIn,
  Moon,
  Presentation,
  RotateCcw,
  Sun,
  UserCheck,
} from "lucide-react";
import { KiwiLogo, RvscetLogo } from "@/components/kiwi-logo";
import { useVault } from "@/lib/auth/vault-context";
import { UserRole } from "@/lib/credentials/seed-data";

export function Navbar() {
  const {
    language,
    setLanguage,
    t,
    theme,
    toggleTheme,
    user,
    loginWithRole,
    students,
    activeStudent,
    setActiveStudentById,
    notifications,
    markAllNotificationsRead,
    resetDemoState,
  } = useVault();

  const [notifOpen, setNotifOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRoleSwitch = (role: UserRole) => {
    loginWithRole(role);
    if (role === "issuer") router.push("/issuer");
    else if (role === "verifier") router.push("/verifier");
    else if (role === "admin") router.push("/admin");
    else router.push("/dashboard");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Left: Kiwi Vault + RVSCET Branding */}
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <KiwiLogo size={38} float />
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                  KIWI VAULT
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-full bg-kiwi-100 text-kiwi-800 dark:bg-kiwi-950 dark:text-kiwi-300 border border-kiwi-300/80 dark:border-kiwi-800">
                  ZK-ID
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden md:block">
                {t("shortTagline")}
              </p>
            </div>
          </Link>

          <div className="hidden xl:flex items-center gap-2 pl-3 ml-1 border-l border-slate-200 dark:border-slate-800">
            <RvscetLogo size={32} />
            <div className="leading-tight">
              <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                RVSCET Jamshedpur
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Affiliated to JUT Ranchi
              </p>
            </div>
          </div>
        </div>

        {/* Center: Quick Role Switcher + Demo Student Selector */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-100/90 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700">
          {(
            [
              { id: "student", label: "🎓 Student" },
              { id: "issuer", label: "🏛 RVSCET Issuer" },
              { id: "verifier", label: "🛡 Verifier" },
              { id: "admin", label: "⚙ Admin" },
            ] as const
          ).map((r) => (
            <button
              key={r.id}
              onClick={() => handleRoleSwitch(r.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                user.role === r.id
                  ? "bg-kiwi-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {r.label}
            </button>
          ))}

          {/* Active Demo Student Switcher */}
          <div className="pl-1 border-l border-slate-300 dark:border-slate-700 flex items-center gap-1">
            <UserCheck size={13} className="text-kiwi-600 ml-1 shrink-0" />
            <select
              aria-label="Select Demo Student"
              value={activeStudent.id}
              onChange={(e) => setActiveStudentById(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 pr-2 py-1 focus:outline-none cursor-pointer"
            >
              {students.map((st) => (
                <option
                  key={st.id}
                  value={st.id}
                  className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  {st.name} (Sem {st.semester} {
                    st.branch.includes("Electrical") ? "EEE" :
                    st.branch.includes("Artifical") ? "AI/ML" :
                    st.branch.includes("ECE") || st.branch.includes("Electronics") ? "ECE" : "CSE"
                  })
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Judge Demo CTA, Language, Theme, Notifications, Login */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/demo"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              pathname === "/demo"
                ? "bg-bark-700 text-white"
                : "bg-kiwi-100 hover:bg-kiwi-200 text-kiwi-900 dark:bg-kiwi-950 dark:text-kiwi-200 border border-kiwi-300 dark:border-kiwi-800"
            }`}
          >
            <Presentation size={14} />
            <span className="hidden sm:inline">How it works</span>
          </Link>

          {/* Language Switch: EN | हिंदी */}
          <div
            className="inline-flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700"
            role="group"
            aria-label="Language Switcher"
          >
            <button
              onClick={() => setLanguage("en")}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition ${
                language === "en"
                  ? "bg-white dark:bg-slate-900 text-kiwi-700 dark:text-kiwi-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("hi")}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition ${
                language === "hi"
                  ? "bg-white dark:bg-slate-900 text-kiwi-700 dark:text-kiwi-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* Theme Switch: Light / Dark */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
            aria-label={theme === "light" ? "Switch to Dark theme" : "Switch to Light theme"}
            title={theme === "light" ? "☀ Light Mode" : "🌙 Dark Mode"}
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} className="text-amber-400" />}
          </button>

          {/* Notification Center */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen((prev) => !prev)}
              className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
              aria-label="Notifications"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-kiwi-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50">
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Vault Notification Center
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] font-semibold text-kiwi-700 dark:text-kiwi-400 hover:underline flex items-center gap-1"
                    >
                      <CheckCheck size={12} /> Mark read
                    </button>
                    <button
                      onClick={() => {
                        resetDemoState();
                        setNotifOpen(false);
                      }}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                      title="Reset Demo Data"
                    >
                      <RotateCcw size={11} /> Reset
                    </button>
                  </div>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl text-xs border ${
                        n.read
                          ? "bg-slate-50/60 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800"
                          : "bg-kiwi-50/70 dark:bg-kiwi-950/30 border-kiwi-200 dark:border-kiwi-900"
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-100">
                        <span>
                          {n.type === "achievement"
                            ? "🏆 "
                            : n.type === "revocation"
                            ? "🔴 "
                            : n.type === "verification"
                            ? "🔐 "
                            : n.type === "semester"
                            ? "🎓 "
                            : "✓ "}
                          {n.title}
                        </span>
                        <span className="text-[10px] font-normal text-slate-400">
                          {n.timestamp}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                        {n.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition"
          >
            <KeyRound size={13} />
            <span className="hidden sm:inline">{user.role.toUpperCase()}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
