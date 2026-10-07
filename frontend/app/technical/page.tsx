import React from "react";
import { CheckCircle2, Shield, Settings, Server, FileCode, Layers } from "lucide-react";
import contractsConfig from "@/config/contracts.json";

export default function TechnicalPage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight mb-4">
          Problem 23 — Deliverables
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Technical documentation and checklist for Kiwi Vault&apos;s Privacy-Preserving Zero-Knowledge Digital Identity system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-kiwi-500" /> Deliverables Checklist
          </h2>
          <ul className="space-y-3 text-sm text-neutral-600 dark:text-slate-300">
            <li className="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-slate-800">
              <span>Credential Issuance</span>
              <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-md">LIVE</span>
            </li>
            <li className="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-slate-800">
              <span>Holder Wallet</span>
              <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-md">LIVE</span>
            </li>
            <li className="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-slate-800">
              <span>ZK Age Proof (Groth16/Circom)</span>
              <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-md">LIVE</span>
            </li>
            <li className="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-slate-800">
              <span>ZK Degree Proof (Groth16/Circom)</span>
              <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-md">LIVE</span>
            </li>
            <li className="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-slate-800">
              <span>Testnet Smart Contract</span>
              <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-md">LIVE</span>
            </li>
            <li className="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-slate-800">
              <span>Revocation (Merkle Tree Registry)</span>
              <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-md">LIVE</span>
            </li>
            <li className="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-slate-800">
              <span>Selective Disclosure</span>
              <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-md">LIVE</span>
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
            <Layers className="text-blue-500" /> Blockchain Status
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Network</p>
              <p className="text-sm font-semibold text-neutral-800 dark:text-slate-200">Local Hardhat Node (Testnet Simulation)</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Chain ID</p>
              <p className="text-sm font-mono text-neutral-800 dark:text-slate-200">31337</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Credential Registry Contract</p>
              <p className="text-sm font-mono text-kiwi-600 dark:text-kiwi-400 break-all">
                {contractsConfig?.CredentialRegistry || "Not deployed"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">ZK Verifier Contract</p>
              <p className="text-sm font-mono text-kiwi-600 dark:text-kiwi-400 break-all">
                {contractsConfig?.KiwiVerifier || "Not deployed"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Status</p>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> LIVE / DEPLOYED
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm mb-12">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
          <Shield className="text-kiwi-500" /> What Does Each Proof Reveal?
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-600 dark:text-slate-300">
            <thead className="bg-gray-50 dark:bg-slate-800/50 text-neutral-900 dark:text-white font-semibold">
              <tr>
                <th className="p-4 rounded-tl-lg">Proof</th>
                <th className="p-4">Private Data</th>
                <th className="p-4">Public Input</th>
                <th className="p-4">Verifier Learns</th>
                <th className="p-4 rounded-tr-lg">Hidden</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              <tr>
                <td className="p-4 font-medium text-neutral-900 dark:text-white">Age ≥ 18</td>
                <td className="p-4">DOB, secret</td>
                <td className="p-4">Min Age, Merkle Root</td>
                <td className="p-4 font-bold text-kiwi-600">TRUE / FALSE</td>
                <td className="p-4">DOB, Address, Name</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-neutral-900 dark:text-white">Degree Holder</td>
                <td className="p-4">Student ID, secret</td>
                <td className="p-4">Degree Code, Issuer</td>
                <td className="p-4 font-bold text-kiwi-600">Degree Valid</td>
                <td className="p-4">Marks, ID, Roll No.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
            <FileCode className="text-purple-500" /> Circuit Design: AgeVerification
          </h2>
          <div className="space-y-4 text-sm text-neutral-600 dark:text-slate-300">
            <p><strong>Purpose:</strong> Prove holder is ≥ minimumAge without revealing exact DOB.</p>
            <div>
              <strong>Private Inputs:</strong>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Date of Birth</li>
                <li>Credential Secret</li>
                <li>Issuer EdDSA Signature</li>
                <li>Merkle Path to Root</li>
              </ul>
            </div>
            <div>
              <strong>Public Inputs:</strong>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Minimum Age</li>
                <li>Current Date</li>
                <li>Verifier Challenge Nonce</li>
              </ul>
            </div>
            <p><strong>Constraints:</strong> EdDSAPoseidonVerifier, MerkleTreeChecker, LessEqThan (Age Check).</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
            <Server className="text-orange-500" /> Architecture Overview
          </h2>
          <div className="space-y-3 text-sm text-neutral-600 dark:text-slate-300">
            <p><strong>Frontend:</strong> Next.js / React (TypeScript)</p>
            <p><strong>Smart Contract:</strong> Solidity (CredentialRegistry.sol, KiwiVerifier.sol)</p>
            <p><strong>ZK Circuits:</strong> Circom 2.1.8</p>
            <p><strong>Prover/Verifier Engine:</strong> SnarkJS (Groth16 over BN128)</p>
            <p><strong>Hash Function:</strong> Poseidon (SNARK-friendly)</p>
            <p><strong>Signatures:</strong> EdDSA</p>
            <p><strong>Revocation:</strong> On-chain incremental Merkle tree root updates.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
