import type { Metadata } from "next";
import "./globals.css";
import { VaultProvider } from "@/lib/auth/vault-context";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

export const metadata: Metadata = {
  title: "KIWI VAULT — Your Credentials. Your Achievements. Your Privacy. | RVSCET Jamshedpur",
  description:
    "Privacy-Preserving Digital Identity and Credential Verification (Zero-Knowledge ID) developed for RVS College of Engineering & Technology (RVSCET), Jamshedpur, affiliated to Jharkhand University of Technology (JUT).",
  icons: {
    icon: "/kiwi-vault-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#FAFDF6] dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-kiwi-200 selection:text-kiwi-950">
        <VaultProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 flex flex-col lg:flex-row max-w-[1440px] w-full mx-auto">
              <Sidebar />
              <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-10">
                {children}
              </main>
            </div>
          </div>
        </VaultProvider>
      </body>
    </html>
  );
}
