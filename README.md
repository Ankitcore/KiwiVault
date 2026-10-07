# 🥝 KIWI VAULT

> **"Your Credentials. Your Achievements. Your Privacy."**  
> **"Prove more. Reveal less."**

Developed as an institutional prototype for **RVS College of Engineering & Technology (RVSCET), Jamshedpur**, affiliated to **Jharkhand University of Technology (JUT), Ranchi**.

**Hackathon Problem 23:** Privacy-Preserving Digital Identity and Credential Verification  
**Domain:** Web3 & Blockchain | **Track:** Track 04 — Zero-Knowledge ID

---

## 🌟 Product Vision

Traditional credential verification forces students to upload complete Aadhaar cards, degrees, or marksheet PDFs — exposing sensitive personal information that can be copied, stored, or leaked.

**Kiwi Vault** separates private student records from public cryptographic claims:
- Prove **`Age >= 18`** without revealing **Date of Birth**.
- Prove **`B.Tech CSE Student at RVSCET`** without revealing **Aadhaar, Roll Number, Phone, or Subject Marks**.
- Prove **`Smart India Hackathon 2026 Winner`** without handing over the entire certificate document.

---

## 🏗 Architecture

- **Frontend & API:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons
- **Zero-Knowledge Proof Engine:** Circom 2 (`circuits/age.circom`, `circuits/degree.circom`) + Groth16 BN128 prover & verifier (`lib/zk/engine.ts`)
- **Smart Contract Registry:** Solidity `contracts/CredentialRegistry.sol` + `ethers.js` (`lib/blockchain/registry.ts`) with automatic **Demo Verification Mode** fallback
- **Database Schema:** Supabase PostgreSQL (`supabase/migrations/001_initial_schema.sql`)

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

### Scripts
- `npm run dev` — Start development server
- `npm run typecheck` — Run TypeScript compiler check
- `npm run lint` — Run Next.js ESLint check
- `npm test` — Run Vitest cryptographic & ZK test suite
- `npm run build` — Build production bundle
