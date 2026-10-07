"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  CheckCircle2,
  GraduationCap,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { KiwiLogo, RvscetLogo } from "@/components/kiwi-logo";
import { useVault } from "@/lib/auth/vault-context";
import { UserRole } from "@/lib/credentials/seed-data";

export default function LoginPage() {
  const { loginWithRole, students, user } = useVault();
  const router = useRouter();

  const [authTab, setAuthTab] = useState<"demo" | "password" | "otp">("demo");
  const [email, setEmail] = useState("student@rvscet.ac.in");
  const [password, setPassword] = useState("••••••••••••");
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("842910");

  const handleQuickDemo = (role: UserRole, emailStr: string, studentId?: string) => {
    loginWithRole(role, emailStr, studentId);
    if (role === "issuer") router.push("/issuer");
    else if (role === "verifier") router.push("/verifier");
    else if (role === "admin") router.push("/admin");
    else router.push("/dashboard");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let role: UserRole = selectedRole;
    if (email.toLowerCase().includes("issuer")) role = "issuer";
    else if (email.toLowerCase().includes("verifier")) role = "verifier";
    else if (email.toLowerCase().includes("admin")) role = "admin";
    handleQuickDemo(role, email);
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center gap-3 p-3 rounded-3xl bg-white dark:bg-slate-900 border border-kiwi-200 dark:border-slate-800 shadow-sm">
          <KiwiLogo size={52} float />
          <span className="text-slate-300 dark:text-slate-700 font-bold">×</span>
          <RvscetLogo size={50} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Sign in to Kiwi Vault
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          RVS College of Engineering &amp; Technology, Jamshedpur • Affiliated to Jharkhand University of Technology (JUT)
        </p>
      </div>

      {/* Mode Switch Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-2xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800">
          {[
            { id: "demo", label: "⚡ Try Demo (1-Click)" },
            { id: "password", label: "🔐 Email + Password" },
            { id: "otp", label: "✨ Email OTP / Magic Link" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAuthTab(tab.id as "demo" | "password" | "otp")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                authTab === tab.id
                  ? "bg-kiwi-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* OPTION C: 1-CLICK DEMO ACCOUNTS */}
      {authTab === "demo" && (
        <div className="space-y-6">
          <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-kiwi-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-kiwi-700 dark:text-kiwi-400">
                  Option C — Hackathon Instant Demo Accounts
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Choose a Demo Role or RVSCET Student Profile
                </h2>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Currently signed in as: <strong className="text-kiwi-700 dark:text-kiwi-400">{user.name}</strong>
              </span>
            </div>

            {/* 3 Primary Role Demo Accounts required by Section 10 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <button
                onClick={() =>
                  handleQuickDemo("student", "student@rvscet.ac.in", "student-shivam")
                }
                className="text-left p-5 rounded-2xl bg-gradient-to-br from-kiwi-50 to-white dark:from-slate-800 dark:to-slate-900 border-2 border-kiwi-400 dark:border-kiwi-700 hover:shadow-md transition group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-kiwi-600 text-white flex items-center justify-center">
                    <GraduationCap size={20} />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-kiwi-100 dark:bg-kiwi-950 text-kiwi-800 dark:text-kiwi-300">
                    PRIMARY DEMO
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Student / Holder
                </h3>
                <p className="font-mono text-xs text-kiwi-700 dark:text-kiwi-400 mt-0.5">
                  student@rvscet.ac.in
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Shivam Soni • B.Tech CSE (3rd Sem) • Academic Wallet, Achievements &amp; ZK Prover
                </p>
              </button>

              <button
                onClick={() => handleQuickDemo("issuer", "issuer@rvscet.ac.in")}
                className="text-left p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-kiwi-400 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <Building2 size={20} />
                  </div>
                  <RvscetLogo size={30} />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Institution / Issuer
                </h3>
                <p className="font-mono text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                  issuer@rvscet.ac.in
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  RVSCET Registrar • Issue Degrees, Achievements, Certificates &amp; Revoke Credentials
                </p>
              </button>

              <button
                onClick={() => handleQuickDemo("verifier", "verifier@demo.com")}
                className="text-left p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-kiwi-400 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-bark-600 text-white flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    EXTERNAL DESK
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Verifier Portal
                </h3>
                <p className="font-mono text-xs text-bark-700 dark:text-bark-300 mt-0.5">
                  verifier@demo.com
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Request Age/Degree/Achievement ZK Proofs, Scan QR &amp; Inspect Privacy Transparency
                </p>
              </button>
            </div>

            {/* All 4 Seeded RVSCET Demo Students (Section 46 & Under-18 Demo) */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Switch Between Seeded RVSCET Student Profiles (Includes Under-18 Age Demo)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {students.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => handleQuickDemo("student", st.email, st.id)}
                    className={`p-3.5 rounded-2xl border text-left transition ${
                      st.id === "student-aarav-under18"
                        ? "border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/20 hover:border-amber-500"
                        : "border-slate-200 dark:border-slate-800 hover:border-kiwi-400 bg-slate-50/70 dark:bg-slate-800/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {st.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          st.id === "student-aarav-under18"
                            ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                            : "bg-kiwi-100 dark:bg-kiwi-950 text-kiwi-800 dark:text-kiwi-300"
                        }`}
                      >
                        {st.id === "student-aarav-under18"
                          ? "Under-18 Demo"
                          : `Sem ${st.semester}`}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {st.branch} • Sem {st.semester}
                    </p>
                    <p className="font-mono text-[10px] text-slate-400 mt-1">
                      {st.registrationNumber}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OPTION A: EMAIL + PASSWORD */}
      {authTab === "password" && (
        <form
          onSubmit={handleFormSubmit}
          className="max-w-md mx-auto rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-kiwi-700 dark:text-kiwi-400">
            <Lock size={15} />
            <span>Option A — Institutional Email &amp; Password</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Institutional or Verifier Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Vault Password (Zero-Knowledge Derived Key)
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <option value="student">Student / Holder (RVSCET)</option>
              <option value="issuer">Institution / Issuer (RVSCET Registrar)</option>
              <option value="verifier">External Verifier</option>
              <option value="admin">Institution Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-xs font-bold bg-kiwi-600 hover:bg-kiwi-700 text-white shadow-sm transition flex items-center justify-center gap-2"
          >
            <KeyRound size={15} /> Unlock Kiwi Vault
          </button>
        </form>
      )}

      {/* OPTION B: EMAIL OTP / MAGIC LINK */}
      {authTab === "otp" && (
        <form
          onSubmit={handleFormSubmit}
          className="max-w-md mx-auto rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-kiwi-700 dark:text-kiwi-400">
            <Mail size={15} />
            <span>Option B — Passwordless Email OTP / Magic Link</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              RVSCET Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          {!otpSent ? (
            <button
              type="button"
              onClick={() => setOtpSent(true)}
              className="w-full py-3 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 transition"
            >
              Send 6-Digit Verification OTP
            </button>
          ) : (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-kiwi-50 dark:bg-kiwi-950/50 border border-kiwi-200 text-xs text-kiwi-800 dark:text-kiwi-200 flex items-center gap-2">
                <CheckCircle2 size={15} />
                <span>Demo OTP generated for {email}: 842910</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Enter 6-Digit OTP
                </label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm font-mono font-bold tracking-widest bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl text-xs font-bold bg-kiwi-600 hover:bg-kiwi-700 text-white transition flex items-center justify-center gap-2"
              >
                <Sparkles size={15} /> Verify OTP &amp; Open Vault
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
