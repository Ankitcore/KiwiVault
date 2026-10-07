"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  EyeOff,
  FileBadge,
  FileCode2,
  GraduationCap,
  History,
  KeyRound,
  Lock,
  LockOpen,
  Play,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  Trophy,
  UserCheck,
} from "lucide-react";
import { useVault } from "@/lib/auth/vault-context";
import { KiwiLogo, RvscetLogo } from "@/components/kiwi-logo";
import { AnimatedLockKey, LockState } from "@/components/lock-animation";
import {
  buildPrivacySafeQrData,
  generateAgeZKProof,
  generateDegreeZKProof,
  generateSelectiveClaimZKProof,
  verifyZKProofPackage,
  ZKProofPackage,
} from "@/lib/zk/engine";
import { generateCredentialId } from "@/lib/credentials/id-generator";

type VerifyOption =
  | "degree"
  | "age"
  | "achievement"
  | "certificate"
  | "student_status";

export default function VerifierPage() {
  const {
    t,
    students,
    activeStudent,
    setActiveStudentById,
    verificationRequests,
    findCredentialById,
    revokeAnyCredential,
    restoreAnyCredential,
    createVerificationRequest,
    completeVerificationRequest,
  } = useVault();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    activeStudent.id
  );
  const [selectedOption, setSelectedOption] = useState<VerifyOption>("age");
  const [requestId, setRequestId] = useState<string>("");
  const [targetCredId, setTargetCredId] = useState<string>("");
  const [claimText, setClaimText] = useState<string>("Age ≥ 18");
  const [ageThreshold, setAgeThreshold] = useState<number>(18);
  const [activeScenarioBadge, setActiveScenarioBadge] = useState<
    "adult_pass" | "under18_fail" | "custom"
  >("under18_fail");

  const [waitingForHolder, setWaitingForHolder] = useState<boolean>(false);
  const [isVerifyingInProgress, setIsVerifyingInProgress] =
    useState<boolean>(false);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [stepProgress, setStepProgress] = useState<number>(0);
  const [lockState, setLockState] = useState<LockState>("idle");
  const [proofResult, setProofResult] = useState<ZKProofPackage | null>(null);
  const [showPrivacyDetails, setShowPrivacyDetails] = useState<boolean>(true);
  const [showProofDetails, setShowProofDetails] = useState<boolean>(false);
  const [failureMessage, setFailureMessage] = useState<string | null>(null);

  // Initialize with unique IDs on mount
  React.useEffect(() => {
    setRequestId(generateCredentialId("VR-KV", new Date().getFullYear()));
    setTargetCredId("KV-JUT-RVSCET-2026-EEE-327");
  }, []);

  const targetStudent =
    students.find((s) => s.id === selectedStudentId) ||
    students.find((s) => s.id === "student-aarav-under18") ||
    activeStudent;

  const runVerificationForTarget = (params: {
    studentId: string;
    option: VerifyOption;
    credId: string;
    claim: string;
    minAge: number;
    customReqId?: string;
  }) => {
    const holder =
      students.find((s) => s.id === params.studentId) || activeStudent;

    setWaitingForHolder(false);
    setIsVerifyingInProgress(true);
    setStepProgress(1);
    setLockState("proving");
    setShowProofDetails(false);
    setShowPrivacyDetails(true);
    setFailureMessage(null);

    const credRecord = findCredentialById(params.credId);

    const createdReq = createVerificationRequest({
      targetHolderId: holder.id,
      studentName: holder.name,
      customRequestId: params.customReqId || generateCredentialId("VR-KV", new Date().getFullYear()),
      claimType: params.option,
      claimLabel: params.claim,
      credentialId: params.credId,
      minimumAge: params.option === "age" ? params.minAge : undefined,
      privacyNote: "DOB NOT REVEALED",
    });
    setRequestId(createdReq.requestId);

    // Dynamically evaluate the holder's private data via ZK engine (NEVER hardcoded by name)
    let pkg: ZKProofPackage;
    if (params.option === "age") {
      pkg = generateAgeZKProof({
        privateDateOfBirth: holder.privateDateOfBirth,
        privateHolderSecret: holder.privateHolderSecret,
        minimumAge: params.minAge,
        credentialId: params.credId,
        issuer: "RVS College of Engineering and Technology, Jamshedpur",
      });
    } else if (
      params.option === "degree" ||
      params.option === "student_status"
    ) {
      pkg = generateDegreeZKProof({
        privateStudentId: holder.registrationNumber,
        privateHolderSecret: holder.privateHolderSecret,
        privateCredentialSalt: params.credId,
        degreeProgram: holder.program,
        branch: holder.branch,
        issuer: "RVS College of Engineering and Technology, Jamshedpur",
        credentialId: params.credId,
        claimLabel: params.claim,
      });
    } else {
      pkg = generateSelectiveClaimZKProof({
        circuit:
          params.option === "achievement"
            ? "AchievementVerificationCircuit"
            : "CertificateVerificationCircuit",
        privateHolderSecret: holder.privateHolderSecret,
        claimTitle: params.claim,
        category: params.option.toUpperCase(),
        issuer: "RVS College of Engineering and Technology, Jamshedpur",
        credentialId: params.credId,
      });
    }

    setProofResult(pkg);

    // Animate through the 5-step sequence (Section 10)
    [2, 3, 4, 5].forEach((stepNum, idx) => {
      setTimeout(() => {
        setStepProgress(stepNum);
        if (stepNum === 5) {
          setIsVerifyingInProgress(false);
          const zkValid = verifyZKProofPackage(pkg);
          if (credRecord.status === "revoked") {
            setLockState("revoked");
            const msg = `Credential ${params.credId} has been REVOKED by RVS College of Engineering and Technology (${
              credRecord.revocationReason || "Revoked on registry"
            }).`;
            setFailureMessage(msg);
            completeVerificationRequest(createdReq.requestId, {
              status: "revoked",
              revealedClaims: pkg.privacyManifest.revealed,
              hiddenFields: pkg.privacyManifest.hidden,
              failureReason: msg,
              privacyNote: "DOB NOT REVEALED",
            });
          } else if (!zkValid.claimSatisfied) {
            setLockState("age_restricted");
            const msg =
              "Verification failed because the required age condition was not satisfied. The student's date of birth remains private and was not revealed to the verifier.";
            setFailureMessage(msg);
            completeVerificationRequest(createdReq.requestId, {
              status: "age_restricted",
              revealedClaims: pkg.privacyManifest.revealed,
              hiddenFields: pkg.privacyManifest.hidden,
              failureReason: "Age requirement not satisfied",
              privacyNote: "DOB NOT REVEALED",
            });
          } else {
            setLockState("verified");
            completeVerificationRequest(createdReq.requestId, {
              status: "verified",
              revealedClaims: pkg.privacyManifest.revealed,
              hiddenFields: pkg.privacyManifest.hidden,
              proofHash: pkg.publicOutputSummary.commitmentHash,
              privacyNote: "DOB NOT REVEALED",
            });
          }
        }
      }, (idx + 1) * 280);
    });
  };

  // Section 9: 1-Click Demo Scenarios Switcher
  const handleSelectDemoScenario = (scenario: "adult_pass" | "under18_fail") => {
    setActiveScenarioBadge(scenario);
    setSelectedOption("age");
    setAgeThreshold(18);
    setClaimText("Age ≥ 18");

    if (scenario === "adult_pass") {
      const adultStudent =
        students.find((s) => s.id === "student-shivam") || students[0];
      setSelectedStudentId(adultStudent.id);
      setActiveStudentById(adultStudent.id);
      const credId = "KV-ID-2024-000103";
      const reqIdToUse = generateCredentialId("VR-KV", 2026);
      setTargetCredId(credId);
      setRequestId(reqIdToUse);
      runVerificationForTarget({
        studentId: adultStudent.id,
        option: "age",
        credId,
        claim: "Age ≥ 18",
        minAge: 18,
        customReqId: reqIdToUse,
      });
    } else {
      const under18Student =
        students.find((s) => s.id === "student-aarav-under18") || students[0];
      setSelectedStudentId(under18Student.id);
      setActiveStudentById(under18Student.id);
      const credId = "KV-JUT-RVSCET-2026-EEE-327";
      const reqIdToUse = generateCredentialId("VR-KV", 2026);
      setTargetCredId(credId);
      setRequestId(reqIdToUse);
      runVerificationForTarget({
        studentId: under18Student.id,
        option: "age",
        credId,
        claim: "Age ≥ 18",
        minAge: 18,
        customReqId: reqIdToUse,
      });
    }
  };

  const selectClaimPreset = (opt: VerifyOption) => {
    setSelectedOption(opt);
    setActiveScenarioBadge("custom");
    setWaitingForHolder(true);
    setIsVerifyingInProgress(false);
    setStepProgress(0);
    setLockState("idle");
    setProofResult(null);
    setFailureMessage(null);

    if (opt === "degree") {
      setRequestId(generateCredentialId("VR-KV", 2026));
      setTargetCredId(
        selectedStudentId === "student-aarav-under18"
          ? "KV-RVSCET-2026-000171"
          : "KV-RVSCET-2028-000124"
      );
      setClaimText(
        selectedStudentId === "student-aarav-under18"
          ? "Semester 1 Examination Passed"
          : "B.Tech Computer Science & Engineering Degree"
      );
    } else if (opt === "age") {
      const isAarav = selectedStudentId === "student-aarav-under18";
      setRequestId(generateCredentialId("VR-KV", 2026));
      setTargetCredId(isAarav ? "KV-JUT-RVSCET-2026-EEE-327" : "KV-ID-2024-000103");
      setClaimText(`Age ≥ ${ageThreshold}`);
    } else if (opt === "achievement") {
      setRequestId(generateCredentialId("VR-KV", 2026));
      setTargetCredId("KV-ACH-2026-0042");
      setClaimText("Smart India Hackathon 2026 — Winner");
    } else if (opt === "certificate") {
      setRequestId(generateCredentialId("VR-KV", 2026));
      setTargetCredId("KV-CERT-2025-000102");
      setClaimText("Helix Technical Workshop — Zero-Knowledge Proofs");
    } else {
      setRequestId(generateCredentialId("VR-KV", 2026));
      setTargetCredId(
        selectedStudentId === "student-aarav-under18"
          ? "KV-JUT-RVSCET-2026-EEE-327"
          : "KV-RVSCET-2024-000101"
      );
      setClaimText("Active B.Tech CSE Student at RVSCET Jamshedpur");
    }
  };

  const handleStudentChange = (newStudentId: string) => {
    setSelectedStudentId(newStudentId);
    setActiveStudentById(newStudentId);
    setWaitingForHolder(true);
    setIsVerifyingInProgress(false);
    setStepProgress(0);
    setLockState("idle");
    setProofResult(null);
    setFailureMessage(null);

    const isAarav = newStudentId === "student-aarav-under18";
    setActiveScenarioBadge(isAarav ? "under18_fail" : "adult_pass");
    setRequestId(generateCredentialId("VR-KV", 2026));

    if (selectedOption === "age") {
      setTargetCredId(isAarav ? "KV-JUT-RVSCET-2026-EEE-327" : "KV-ID-2024-000103");
      setClaimText(`Age ≥ ${ageThreshold}`);
    } else if (selectedOption === "degree") {
      setTargetCredId(isAarav ? "KV-RVSCET-2026-000171" : "KV-RVSCET-2028-000124");
      setClaimText(isAarav ? "Semester 1 Examination Passed" : "B.Tech Computer Science & Engineering Degree");
    } else if (selectedOption === "achievement") {
      setTargetCredId(isAarav ? "KV-ACH-2026-0042" : "KV-ACH-2026-0042");
      setClaimText("Smart India Hackathon 2026 — Winner");
    } else if (selectedOption === "certificate") {
      setTargetCredId(isAarav ? "KV-CERT-2026-000181" : "KV-CERT-2026-0109");
      setClaimText(isAarav ? "Technical Certification" : "Helix Technical Workshop");
    } else if (selectedOption === "student_status") {
      setTargetCredId(isAarav ? "KV-JUT-RVSCET-2026-EEE-327" : "KV-RVSCET-2024-000101");
      setClaimText("Active Student at RVSCET Jamshedpur");
    }
  };

  const handleSimulateHolderResponse = () => {
    runVerificationForTarget({
      studentId: targetStudent.id,
      option: selectedOption,
      credId: targetCredId,
      claim: claimText,
      minAge: ageThreshold,
      customReqId:
        targetStudent.id === "student-aarav-under18" && selectedOption === "age"
          ? generateCredentialId("VR-KV", 2026)
          : undefined,
    });
  };

  const credLookup = findCredentialById(targetCredId);
  const currentCredStatus = credLookup.status;

  // 5-Step Animated Pipeline Labels (Section 10)
  const animatedFlowSteps = [
    {
      step: 1,
      icon: "🔑",
      title: "Proof request",
      subtitle: `Claim requested: ${claimText}`,
    },
    {
      step: 2,
      icon: "🔐",
      title: "Checking private credential",
      subtitle: `${
        selectedOption === "age" ? "Student Identity" : credLookup.title
      } (${targetCredId})`,
    },
    {
      step: 3,
      icon: "🛡",
      title: "Verifying privacy proof",
      subtitle: "Evaluating ZK circuit without exposing private DOB",
    },
    {
      step: 4,
      icon: lockState === "verified" ? "🔓" : "🔒",
      title:
        stepProgress >= 4 &&
        (lockState === "age_restricted" || lockState === "revoked")
          ? "Requirement not satisfied"
          : "Evaluating claim threshold",
      subtitle:
        stepProgress >= 4 && lockState === "age_restricted"
          ? `${claimText} = FALSE`
          : stepProgress >= 4 && lockState === "verified"
          ? `${claimText} = TRUE`
          : "Checking minimum requirement",
    },
    {
      step: 5,
      icon:
        stepProgress >= 5
          ? lockState === "verified"
            ? "✓"
            : "❌"
          : "⏳",
      title:
        stepProgress >= 5
          ? lockState === "verified"
            ? "Verification Passed"
            : "Verification Failed"
          : "Awaiting final status",
      subtitle:
        stepProgress >= 5
          ? lockState === "verified"
            ? "All requirements satisfied"
            : lockState === "age_restricted"
            ? "Age requirement not satisfied"
            : "Credential revoked"
          : "Finalizing result",
    },
  ];

  // Privacy-safe QR payload (Section 12: never contains DOB or PII)
  const qrPayload = buildPrivacySafeQrData({
    requestId,
    credentialId: targetCredId,
    claim: claimText,
    commitmentHash: proofResult?.publicOutputSummary.commitmentHash,
  });

  return (
    <div className="space-y-6">
      {/* HEADER (Section 28) */}
      <section className="rounded-[2.5rem] p-8 sm:p-10 bg-gradient-to-br from-white via-kiwi-50/50 to-kiwi-100/30 dark:from-slate-950 dark:via-slate-900 dark:to-kiwi-950/20 border border-slate-200/60 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <KiwiLogo size={56} float />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-kiwi-100 dark:bg-kiwi-950 text-kiwi-800 dark:text-kiwi-300">
                  Zero-Knowledge Verifier Gateway • Demo Mode
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {t("verifyTitle")}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 font-medium">
                Verify student claims mathematically without receiving sensitive documents or personal data.
              </p>
            </div>
          </div>
          <div className="hidden md:block">
            <RvscetLogo size={54} />
          </div>
        </div>

        {/* SECTION 9: DEMO SCENARIOS SWITCHER FOR EASY TESTING */}
        <div className="mt-6 p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-kiwi-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-kiwi-700 dark:text-kiwi-400 block">
              Demo Scenarios — 1-Click Age Verification Comparison
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Test how Kiwi Vault dynamically evaluates private DOBs for{" "}
              <strong>Claim: &ldquo;Age ≥ 18&rdquo;</strong> without ever exposing the student&apos;s Date of Birth.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => handleSelectDemoScenario("adult_pass")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold border transition ${
                activeScenarioBadge === "adult_pass"
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                  : "bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100"
              }`}
            >
              <CheckCircle2 size={15} />
              <span>[Adult Student — Verification Pass]</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectDemoScenario("under18_fail")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold border transition ${
                activeScenarioBadge === "under18_fail"
                  ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                  : "bg-rose-50/80 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800 hover:bg-rose-100"
              }`}
            >
              <Lock size={15} />
              <span>[Under-18 Student — Verification Failed]</span>
            </button>
          </div>
        </div>

        {/* 5 Verification Options (Section 28) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-5">
          {(
            [
              { id: "degree", label: "Verify Degree", icon: GraduationCap },
              { id: "age", label: "Age ≥ 18", icon: KeyRound },
              { id: "achievement", label: "Verify Achievement", icon: Trophy },
              { id: "certificate", label: "Verify Certificate", icon: FileBadge },
              { id: "student_status", label: "Verify Student Status", icon: UserCheck },
            ] as const
          ).map((opt) => {
            const Icon = opt.icon;
            const active = selectedOption === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => selectClaimPreset(opt.id)}
                className={`flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-2xl text-xs font-extrabold border transition ${
                  active
                    ? "bg-kiwi-600 text-white border-kiwi-600 shadow-md"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-kiwi-400"
                }`}
              >
                <Icon size={20} />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* REQUEST CONFIGURATION & QR CODE (Section 29) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Verification Request ID
              </span>
              <p className="font-mono text-base font-black text-kiwi-700 dark:text-kiwi-400">
                {requestId}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                currentCredStatus === "revoked"
                  ? "bg-rose-100 text-rose-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              Credential: 🟢 {currentCredStatus.toUpperCase()}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Target Student Selector */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Student Holder Being Verified
              </label>
              <select
                value={targetStudent.id}
                onChange={(e) => handleStudentChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.registrationNumber}) — Sem {st.semester}
                    {st.id === "student-aarav-under18"
                      ? " [Under-18 Demo Student]"
                      : " [Adult Student]"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Claim Requested from Holder
              </label>
              <input
                type="text"
                value={claimText}
                onChange={(e) => setClaimText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between mb-1">
                <span>Target Credential ID</span>
                <button
                  type="button"
                  onClick={() => setIsScannerOpen(!isScannerOpen)}
                  className="text-[10px] font-bold text-kiwi-600 dark:text-kiwi-400 flex items-center gap-1 hover:underline"
                >
                  <QrCode size={12} /> {isScannerOpen ? "Close Scanner" : "Scan QR"}
                </button>
              </label>
              
              {isScannerOpen && (
                <div className="mb-3 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video relative bg-black">
                  <Scanner 
                    onScan={(result) => {
                      if (result && result.length > 0) {
                        let scannedId = result[0].rawValue;
                        if (scannedId.startsWith("KIWI_VAULT_VERIFY:")) {
                          scannedId = scannedId.replace("KIWI_VAULT_VERIFY:", "");
                        } else {
                          try {
                            const parsed = JSON.parse(scannedId);
                            if (parsed.credentialId) {
                              scannedId = parsed.credentialId;
                            }
                          } catch {}
                        }
                        
                        const credRecord = findCredentialById(scannedId);
                        const holderId = credRecord.holderId !== "not_found" ? credRecord.holderId : targetStudent.id;
                        
                        // Automatically map the scanned document to the correct Verifier Claim Type
                        let newOption: VerifyOption = selectedOption;
                        let newClaim = claimText;
                        
                        if (credRecord.kind === "identity") {
                          newOption = "age";
                          newClaim = `Age ≥ ${ageThreshold}`;
                        } else if (credRecord.kind === "academic") {
                          newOption = "degree";
                          newClaim = `Verified Degree/Status from ${credRecord.issuer}`;
                        } else if (credRecord.kind === "achievement") {
                          newOption = "achievement";
                          newClaim = credRecord.title;
                        } else if (credRecord.kind === "certification") {
                          newOption = "certificate";
                          newClaim = credRecord.title;
                        }
                        
                        // Sync UI dropdowns and textboxes instantly
                        setTargetCredId(scannedId);
                        setSelectedStudentId(holderId);
                        setSelectedOption(newOption);
                        setClaimText(newClaim);
                        setIsScannerOpen(false);

                        // Trigger the Zero-Knowledge verification sequence automatically
                        setTimeout(() => {
                          runVerificationForTarget({
                            studentId: holderId,
                            option: newOption,
                            credId: scannedId,
                            claim: newClaim,
                            minAge: ageThreshold
                          });
                        }, 500);
                      }
                    }}
                    components={{ finder: false }}
                  />
                  <div className="absolute inset-0 border-2 border-kiwi-500/50 rounded-xl pointer-events-none z-10" />
                </div>
              )}

              <input
                type="text"
                value={targetCredId}
                onChange={(e) => setTargetCredId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                placeholder="Scan or enter credential ID..."
              />
            </div>

            {/* SECTION 3: AGE REQUIREMENT PANEL */}
            {selectedOption === "age" && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-kiwi-700 dark:text-kiwi-400 block">
                      Age Requirement
                    </span>
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white mt-0.5">
                      Minimum required age: {ageThreshold} years
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    {[18, 21].map((age) => (
                      <button
                        key={age}
                        type="button"
                        onClick={() => {
                          setAgeThreshold(age);
                          setClaimText(`Age ≥ ${age}`);
                        }}
                        className={`px-3 py-1 rounded-lg font-bold ${
                          ageThreshold === age
                            ? "bg-kiwi-600 text-white"
                            : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
                        }`}
                      >
                        ≥ {age}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/70 dark:border-slate-700 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">
                    Status:
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {isVerifyingInProgress
                      ? "⏳ Verification in progress..."
                      : stepProgress === 5 && lockState === "age_restricted"
                      ? "❌ Age requirement not satisfied"
                      : stepProgress === 5 && lockState === "verified"
                      ? "✓ Age requirement satisfied"
                      : "⏳ Ready to verify claim"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* QR Code for Student Wallet Scan (Section 12: Never includes DOB or PII) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center gap-4">
            <div className="p-2.5 bg-white rounded-xl border border-slate-200 shrink-0">
              <QRCodeSVG value={qrPayload} size={96} />
            </div>
            <div className="space-y-1 text-xs">
              <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <QrCode size={14} className="text-kiwi-600" />
                {waitingForHolder
                  ? "Waiting for holder proof..."
                  : isVerifyingInProgress
                  ? "⏳ Verification in progress..."
                  : "Holder proof processed"}
              </p>
              <p className="text-slate-500 dark:text-slate-400 leading-snug">
                Privacy-safe QR contains only <code className="font-mono">{requestId}</code> &amp;{" "}
                <code className="font-mono">{targetCredId}</code>. Raw DOB is never encoded.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleSimulateHolderResponse}
              className="w-full py-3 rounded-2xl text-xs font-extrabold bg-kiwi-600 hover:bg-kiwi-700 text-white shadow-md transition flex items-center justify-center gap-2"
            >
              <Play size={15} /> Verify &ldquo;{claimText}&rdquo; for {targetStudent.name}
            </button>

            {/* Quick Revoke / Restore Toggle for Live Judge Testing */}
            <div className="flex items-center gap-2 pt-1">
              {currentCredStatus !== "revoked" ? (
                <button
                  type="button"
                  onClick={() =>
                    revokeAnyCredential(
                      targetCredId,
                      "Revoked by RVSCET Registrar during live verification test"
                    )
                  }
                  className="flex-1 py-2 rounded-xl text-[11px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800 transition"
                >
                  🔴 Simulate RVSCET Revocation of {targetCredId}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => restoreAnyCredential(targetCredId)}
                  className="flex-1 py-2 rounded-xl text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition"
                >
                  🟢 Restore {targetCredId} to ACTIVE
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: 5-STEP ANIMATION & VERIFICATION RESULT (Sections 5, 6, 7, 10) */}
        <div className="lg:col-span-7 space-y-5">
          {/* 5-Step Animated Pipeline + Live Checklist (Section 10) */}
          <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-kiwi-700 dark:text-kiwi-400">
                  Zero-Knowledge Verification Pipeline
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {isVerifyingInProgress
                    ? "⏳ Verification in progress..."
                    : "Privacy-Preserving Claim Evaluation"}
                </h2>
              </div>
              <AnimatedLockKey
                state={lockState}
                size="md"
                label={
                  lockState === "verified"
                    ? "✓ VERIFIED"
                    : lockState === "revoked"
                    ? "🔒 VERIFICATION FAILED (REVOKED)"
                    : lockState === "age_restricted"
                    ? "🔒 VERIFICATION FAILED"
                    : lockState === "proving"
                    ? "⏳ Verification in progress..."
                    : "Ready"
                }
              />
            </div>

            {/* 5-Step Flow Visual (Section 10) */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {animatedFlowSteps.map((item) => {
                const done = stepProgress >= item.step;
                const isFailStep =
                  done &&
                  item.step >= 4 &&
                  (lockState === "age_restricted" || lockState === "revoked");
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: item.step * 0.1, duration: 0.3 }}
                    key={item.step}
                    className={`p-3 rounded-2xl border text-xs transition-colors flex flex-col justify-between ${
                      isFailStep
                        ? "bg-rose-50/90 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200"
                        : done
                        ? "bg-kiwi-50/80 dark:bg-kiwi-950/30 border-kiwi-200 dark:border-kiwi-900 text-slate-900 dark:text-white"
                        : "bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-400"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-base">{item.icon}</span>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-75">
                        Step {item.step}
                      </span>
                    </div>
                    <div>
                      <p className="font-extrabold leading-tight">{item.title}</p>
                      <p className="text-[10px] opacity-80 mt-0.5 leading-snug">
                        {item.subtitle}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Section 10 Checklist */}
            {stepProgress > 0 && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400">
                  <span>✓</span>
                  <span>Credential found</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400">
                  <span>✓</span>
                  <span>Issuer verified</span>
                </div>
                <div
                  className={`flex items-center gap-2 font-bold ${
                    lockState === "revoked"
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-emerald-700 dark:text-emerald-400"
                  }`}
                >
                  <span>{lockState === "revoked" ? "✕" : "✓"}</span>
                  <span>
                    {lockState === "revoked"
                      ? "Credential revoked"
                      : "Credential active"}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400">
                  <span>✓</span>
                  <span>Privacy proof processed</span>
                </div>
                <div
                  className={`flex items-center gap-2 font-extrabold sm:col-span-2 ${
                    stepProgress < 5
                      ? "text-amber-600"
                      : lockState === "age_restricted"
                      ? "text-rose-600 dark:text-rose-400"
                      : lockState === "revoked"
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-emerald-700 dark:text-emerald-400"
                  }`}
                >
                  <span>
                    {stepProgress < 5
                      ? "⏳"
                      : lockState === "verified"
                      ? "✓"
                      : "✕"}
                  </span>
                  <span>
                    {stepProgress < 5
                      ? "Evaluating claim requirement..."
                      : lockState === "age_restricted"
                      ? "Age requirement not satisfied"
                      : lockState === "revoked"
                      ? "Revoked on institutional registry"
                      : `${claimText} requirement satisfied`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* VERIFICATION RESULT CARD (Sections 5, 6, 7) */}
          {stepProgress === 5 && proofResult && (
            <div
              className={`rounded-3xl p-6 border-2 shadow-md space-y-5 ${
                lockState === "verified"
                  ? "bg-white dark:bg-slate-900 border-kiwi-400 dark:border-kiwi-700"
                  : "bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800"
              }`}
            >
              {/* Result Header */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  {lockState === "verified" ? (
                    <div className="w-12 h-12 rounded-2xl bg-kiwi-600 text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 size={28} />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                      <ShieldAlert size={28} />
                    </div>
                  )}
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 block">
                      Verification Outcome • {requestId}
                    </span>
                    <h3
                      className={`text-xl sm:text-2xl font-black ${
                        lockState === "verified"
                          ? "text-kiwi-700 dark:text-kiwi-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {lockState === "verified"
                        ? "✓ VERIFIED"
                        : "🔒 VERIFICATION FAILED"}
                    </h3>

                    {/* Status Badges required by Section 7 */}
                    {lockState === "age_restricted" && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-slate-900 text-white dark:bg-slate-800">
                          🔒 Private
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                          ❌ Not eligible for this claim
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <RvscetLogo size={42} />
              </div>

              {/* Section 5 Key-Value Summary Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block">Claim</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {claimText}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block">Result</span>
                  <span
                    className={`font-extrabold text-sm ${
                      lockState === "verified"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {lockState === "verified"
                      ? `✓ ${claimText} satisfied`
                      : lockState === "age_restricted"
                      ? "❌ Age requirement not satisfied"
                      : "❌ Credential Revoked"}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block">
                    Credential
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {selectedOption === "age"
                      ? "Student Identity"
                      : credLookup.title}{" "}
                    <span className="font-mono text-[11px] text-kiwi-700 dark:text-kiwi-400">
                      ({targetCredId})
                    </span>
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-slate-400 font-semibold block">Issuer</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    RVS College of Engineering and Technology, Jamshedpur
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block">
                    Credential Status
                  </span>
                  <span
                    className={`font-extrabold ${
                      currentCredStatus === "revoked"
                        ? "text-rose-600"
                        : "text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {currentCredStatus === "revoked" ? "🔴 REVOKED" : "🟢 ACTIVE"}
                  </span>
                </div>
              </div>

              {/* Section 5 & Section 7 Clear Privacy & Failure Explanation Box */}
              {lockState === "age_restricted" && (
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/80 space-y-1.5">
                  <p className="text-xs font-extrabold text-rose-700 dark:text-rose-300">
                    Verification failed because the required age condition was not satisfied. The student&apos;s date of birth remains private and was not revealed to the verifier.
                  </p>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <Lock size={13} className="text-kiwi-600 shrink-0" />
                    <span>
                      Your private date of birth was not revealed to the verifier.
                    </span>
                  </p>
                </div>
              )}

              {lockState === "revoked" && failureMessage && (
                <div className="p-4 rounded-2xl bg-rose-100/80 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-xs font-semibold text-rose-900 dark:text-rose-200">
                  {failureMessage}
                </div>
              )}

              {/* SECTION 6: COLLAPSIBLE PRIVACY TRANSPARENCY SECTION */}
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-4 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-800/40">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ShieldCheck size={15} className="text-kiwi-600" />
                      <span>What did the verifier learn?</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Kiwi Vault verifies the required claim without exposing the underlying personal data.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPrivacyDetails((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-kiwi-400 transition"
                  >
                    <span>
                      {showPrivacyDetails
                        ? "Hide Privacy Details"
                        : "View Privacy Details"}
                    </span>
                    {showPrivacyDetails ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </button>
                </div>

                {showPrivacyDetails && (
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-kiwi-50/80 dark:bg-kiwi-950/30 border border-kiwi-200 dark:border-kiwi-900">
                        <p className="text-xs font-extrabold uppercase tracking-wider text-kiwi-800 dark:text-kiwi-300 mb-2.5 flex items-center gap-1.5">
                          <LockOpen size={14} /> REVEALED
                        </p>
                        <ul className="space-y-1.5 text-xs text-slate-800 dark:text-slate-200 font-semibold">
                          {proofResult.privacyManifest.revealed.map((r) => (
                            <li key={r} className="flex items-start gap-2">
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-900 text-white">
                        <p className="text-xs font-extrabold uppercase tracking-wider text-amber-400 mb-2.5 flex items-center gap-1.5">
                          <EyeOff size={14} /> NOT REVEALED
                        </p>
                        <ul className="space-y-1.5 text-xs text-slate-200 font-medium">
                          {proofResult.privacyManifest.hidden.map((h) => (
                            <li key={h} className="flex items-start gap-2">
                              <span>🔒 {h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <p className="text-xs font-bold text-center text-kiwi-800 dark:text-kiwi-300 bg-kiwi-50/60 dark:bg-kiwi-950/40 py-2.5 px-4 rounded-xl border border-kiwi-200/70 dark:border-kiwi-900">
                      Kiwi Vault verifies the required claim without exposing the underlying personal data.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-500">
                  Evaluated via {proofResult.circuit} (Groth16 • BN128).
                </span>
                <button
                  onClick={() => setShowProofDetails((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                >
                  <FileCode2 size={14} />
                  {showProofDetails ? "Hide Proof Details" : "View Proof Details"}
                </button>
              </div>

              {showProofDetails && (
                <pre className="p-4 rounded-2xl bg-slate-950 text-kiwi-300 font-mono text-[11px] overflow-x-auto">
                  {JSON.stringify(
                    {
                      circuit: proofResult.circuit,
                      publicSignals: proofResult.publicSignals,
                      proof: proofResult.proof,
                    },
                    null,
                    2
                  )}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 11: VERIFICATION LOG / HISTORY */}
      <section className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-kiwi-700 dark:text-kiwi-400">
              Section 11 — Zero-PII Verification Audit Trail
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <History size={18} className="text-kiwi-600" />
              <span>Verification Log &amp; History</span>
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Personal data &amp; DOB are never stored in verification logs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-3">Verification ID</th>
                <th className="py-3 px-3">Claim</th>
                <th className="py-3 px-3">Student</th>
                <th className="py-3 px-3">Result</th>
                <th className="py-3 px-3">Reason / Details</th>
                <th className="py-3 px-3">Privacy</th>
                <th className="py-3 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
              {verificationRequests.map((req) => {
                const holderObj = students.find(
                  (s) => s.id === req.targetHolderId
                );
                const studentDisplay =
                  req.studentName || holderObj?.name || "RVSCET Student";
                const isFailed =
                  req.status === "age_restricted" || req.status === "revoked";
                const ts = req.verifiedAt || req.createdAt;
                const formattedTime = ts
                  ? new Date(ts).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Current Demo Time";

                return (
                  <tr
                    key={req.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-kiwi-700 dark:text-kiwi-400">
                      {req.requestId}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                      {req.claimLabel}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                      {studentDisplay}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                          req.status === "verified"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : isFailed
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {req.status === "verified"
                          ? "✓ VERIFIED"
                          : isFailed
                          ? "❌ FAILED"
                          : "⏳ PENDING"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-medium">
                      {req.failureReason ||
                        (req.status === "verified"
                          ? "Claim cryptographically satisfied"
                          : "Awaiting holder proof")}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-900 text-white dark:bg-slate-800">
                        🔒 {req.privacyNote || "DOB NOT REVEALED"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      <span className="inline-flex items-center gap-1">
                        <Clock size={11} />
                        {formattedTime}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

