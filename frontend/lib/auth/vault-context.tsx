"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Language, translations } from "@/lib/translations";
import {
  AcademicCredential,
  AchievementCategory,
  AchievementLevel,
  AchievementRecord,
  CertificateCategory,
  CertificationRecord,
  DEMO_STUDENTS,
  DemoStudentProfile,
  IdentityReference,
  INITIAL_ACADEMIC_CREDENTIALS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_CERTIFICATIONS,
  INITIAL_IDENTITY_REFERENCES,
  INITIAL_NOTIFICATIONS,
  INITIAL_VERIFICATION_REQUESTS,
  UserRole,
  VaultNotification,
  VerificationRequestRecord,
} from "@/lib/credentials/seed-data";
import {
  computeCredentialHash,
  computeZkCommitment,
  generateCredentialId,
} from "@/lib/credentials/id-generator";

interface AuthenticatedUser {
  email: string;
  name: string;
  role: UserRole;
  studentId?: string;
}

interface VaultContextType {
  // Global Settings
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  theme: "light" | "dark";
  toggleTheme: () => void;

  // Auth & Role
  user: AuthenticatedUser;
  loginWithRole: (role: UserRole, customEmail?: string, studentProfileId?: string) => void;
  logout: () => void;

  // Active Student
  students: DemoStudentProfile[];
  activeStudent: DemoStudentProfile;
  setActiveStudentById: (studentId: string) => void;
  updateStudentPrivacy: (updates: Partial<DemoStudentProfile["privacySettings"]>) => void;
  updateStudentDobForDemo: (newDob: string) => void;

  // Vault Data
  academicCredentials: AcademicCredential[];
  identityReferences: IdentityReference[];
  achievements: AchievementRecord[];
  certifications: CertificationRecord[];
  verificationRequests: VerificationRequestRecord[];
  notifications: VaultNotification[];

  // Issuer Actions
  issueAcademicCredential: (input: {
    holderId: string;
    type: AcademicCredential["type"];
    title: string;
    subtitle: string;
    semester?: number;
    sgpa?: string;
    cgpa?: string;
    academicYear: string;
  }) => AcademicCredential;

  issueAchievement: (input: {
    holderId: string;
    title: string;
    category: AchievementCategory;
    level: AchievementLevel;
    event: string;
    clubOrBody: string;
    description: string;
    date: string;
  }) => AchievementRecord;

  issueCertification: (input: {
    holderId: string;
    title: string;
    category: CertificateCategory;
    issuingClubOrDept: string;
    event: string;
    issueDate: string;
    description: string;
  }) => CertificationRecord;

  revokeAnyCredential: (credentialId: string, reason: string) => boolean;
  restoreAnyCredential: (credentialId: string) => boolean;

  // Verifier Actions
  createVerificationRequest: (input: {
    targetHolderId: string;
    studentName?: string;
    customRequestId?: string;
    claimType: VerificationRequestRecord["claimType"];
    claimLabel: string;
    credentialId: string;
    minimumAge?: number;
    verifierName?: string;
    privacyNote?: string;
  }) => VerificationRequestRecord;

  completeVerificationRequest: (
    requestId: string,
    outcome: {
      status: VerificationRequestRecord["status"];
      revealedClaims: string[];
      hiddenFields: string[];
      proofHash?: string;
      failureReason?: string;
      privacyNote?: string;
    }
  ) => void;

  markAllNotificationsRead: () => void;
  resetDemoState: () => void;
  findCredentialById: (credentialId: string) => {
    kind: "academic" | "achievement" | "certification" | "identity" | "not_found";
    title: string;
    issuer: string;
    status: "active" | "revoked" | "current" | "not_issued";
    holderId: string;
    revocationReason?: string;
    credentialHash?: string;
  };
}

const VaultContext = createContext<VaultContextType | null>(null);

const STORAGE_KEYS = {
  LANG: "kiwi_vault_lang_v2",
  THEME: "kiwi_vault_theme_v2",
  USER: "kiwi_vault_user_v2",
  ACTIVE_STUDENT: "kiwi_vault_student_v2",
  STUDENTS_LIST: "kiwi_vault_students_list_v2",
  ACADEMIC: "kiwi_vault_academic_v2",
  ACHIEVEMENTS: "kiwi_vault_achievements_v2",
  CERTIFICATIONS: "kiwi_vault_certs_v2",
  REQUESTS: "kiwi_vault_requests_v2",
  NOTIFS: "kiwi_vault_notifs_v2",
};

export function VaultProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [user, setUser] = useState<AuthenticatedUser>({
    email: "student@rvscet.ac.in",
    name: "Shivam Kumar",
    role: "student",
    studentId: "student-shivam",
  });

  const [students, setStudents] = useState<DemoStudentProfile[]>(DEMO_STUDENTS);
  const [activeStudentId, setActiveStudentId] = useState<string>("student-shivam");

  const [academicCredentials, setAcademicCredentials] = useState<AcademicCredential[]>(
    INITIAL_ACADEMIC_CREDENTIALS
  );
  const [identityReferences] = useState<IdentityReference[]>(INITIAL_IDENTITY_REFERENCES);
  const [achievements, setAchievements] = useState<AchievementRecord[]>(INITIAL_ACHIEVEMENTS);
  const [certifications, setCertifications] = useState<CertificationRecord[]>(
    INITIAL_CERTIFICATIONS
  );
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequestRecord[]>(
    INITIAL_VERIFICATION_REQUESTS
  );
  const [notifications, setNotifications] = useState<VaultNotification[]>(INITIAL_NOTIFICATIONS);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEYS.LANG) as Language | null;
      if (savedLang === "en" || savedLang === "hi") setLanguageState(savedLang);

      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as "light" | "dark" | null;
      if (savedTheme === "light" || savedTheme === "dark") {
        setThemeState(savedTheme);
        document.documentElement.classList.toggle("dark", savedTheme === "dark");
      }

      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) setUser(JSON.parse(savedUser));

      const savedStudentId = localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT);
      if (savedStudentId) setActiveStudentId(savedStudentId);

      const savedStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS_LIST);
      if (savedStudents) setStudents(JSON.parse(savedStudents));

      const savedAcad = localStorage.getItem(STORAGE_KEYS.ACADEMIC);
      if (savedAcad) setAcademicCredentials(JSON.parse(savedAcad));

      const savedAch = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (savedAch) setAchievements(JSON.parse(savedAch));

      const savedCerts = localStorage.getItem(STORAGE_KEYS.CERTIFICATIONS);
      if (savedCerts) setCertifications(JSON.parse(savedCerts));

      const savedReqs = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      if (savedReqs) setVerificationRequests(JSON.parse(savedReqs));

      const savedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFS);
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
    } catch {
      // Ignore storage parsing errors
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEYS.LANG, lang);
    } catch {}
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "light" ? "dark" : "light";
      try {
        localStorage.setItem(STORAGE_KEYS.THEME, next);
      } catch {}
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", next === "dark");
      }
      return next;
    });
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translations[language]?.[key] || translations.en[key] || key;
    },
    [language]
  );

  const activeStudent =
    students.find((s) => s.id === activeStudentId) || students[0] || DEMO_STUDENTS[0];

  const setActiveStudentById = useCallback(
    (studentId: string) => {
      const found = students.find((s) => s.id === studentId);
      if (!found) return;
      setActiveStudentId(studentId);
      try {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT, studentId);
      } catch {}
      if (user.role === "student") {
        const updatedUser: AuthenticatedUser = {
          email: found.email,
          name: found.name,
          role: "student",
          studentId: found.id,
        };
        setUser(updatedUser);
        try {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
        } catch {}
      }
    },
    [students, user.role]
  );

  const loginWithRole = useCallback(
    (role: UserRole, customEmail?: string, studentProfileId?: string) => {
      let nextUser: AuthenticatedUser;
      if (role === "student") {
        const target =
          students.find((s) => s.id === studentProfileId) ||
          students.find((s) => s.email === customEmail) ||
          activeStudent;
        setActiveStudentId(target.id);
        try {
          localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT, target.id);
        } catch {}
        nextUser = {
          email: customEmail || target.email,
          name: target.name,
          role: "student",
          studentId: target.id,
        };
      } else if (role === "issuer") {
        nextUser = {
          email: customEmail || "issuer@rvscet.ac.in",
          name: "Dr. R. K. Sharma (RVSCET Registrar & Dean Academics)",
          role: "issuer",
        };
      } else if (role === "verifier") {
        nextUser = {
          email: customEmail || "verifier@demo.com",
          name: "External Credential Verifier Desk",
          role: "verifier",
        };
      } else {
        nextUser = {
          email: customEmail || "admin@rvscet.ac.in",
          name: "RVSCET Institutional System Admin",
          role: "admin",
        };
      }
      setUser(nextUser);
      try {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(nextUser));
      } catch {}
    },
    [activeStudent, students]
  );

  const logout = useCallback(() => {
    const defaultUser: AuthenticatedUser = {
      email: "student@rvscet.ac.in",
      name: "Shivam Kumar",
      role: "student",
      studentId: "student-shivam",
    };
    setUser(defaultUser);
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(defaultUser));
    } catch {}
  }, []);

  const addNotification = useCallback(
    (notif: Omit<VaultNotification, "id" | "timestamp" | "read">) => {
      setNotifications((prev) => {
        const next: VaultNotification[] = [
          {
            ...notif,
            id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            timestamp: "Just now",
            read: false,
          },
          ...prev,
        ];
        try {
          localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    []
  );

  const updateStudentPrivacy = useCallback(
    (updates: Partial<DemoStudentProfile["privacySettings"]>) => {
      setStudents((prev) => {
        const next = prev.map((s) =>
          s.id === activeStudent.id
            ? { ...s, privacySettings: { ...s.privacySettings, ...updates } }
            : s
        );
        try {
          localStorage.setItem(STORAGE_KEYS.STUDENTS_LIST, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [activeStudent.id]
  );

  const updateStudentDobForDemo = useCallback(
    (newDob: string) => {
      setStudents((prev) => {
        const next = prev.map((s) =>
          s.id === activeStudent.id ? { ...s, privateDateOfBirth: newDob } : s
        );
        try {
          localStorage.setItem(STORAGE_KEYS.STUDENTS_LIST, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [activeStudent.id]
  );

  const issueAcademicCredential = useCallback(
    (input: {
      holderId: string;
      type: AcademicCredential["type"];
      title: string;
      subtitle: string;
      semester?: number;
      sgpa?: string;
      cgpa?: string;
      academicYear: string;
    }): AcademicCredential => {
      const targetStudent =
        students.find((s) => s.id === input.holderId) || DEMO_STUDENTS[0];
      const credId = generateCredentialId("KV-RVSCET", new Date().getFullYear());
      const issueDate = new Date().toISOString().slice(0, 10);
      const newCred: AcademicCredential = {
        id: `acad-${Date.now()}`,
        credentialId: credId,
        holderId: targetStudent.id,
        studentName: targetStudent.name,
        registrationNumber: targetStudent.registrationNumber,
        rollNumber: targetStudent.rollNumber,
        program: targetStudent.program,
        branch: targetStudent.branch,
        semester: input.semester,
        academicYear: input.academicYear,
        type: input.type,
        title: input.title,
        subtitle: input.subtitle,
        sgpa: input.sgpa || "8.90",
        cgpa: input.cgpa || "8.80",
        resultStatus: "PASSED WITH DISTINCTION",
        graduationYear: String(targetStudent.graduationYear),
        institution: "RVS College of Engineering & Technology, Jamshedpur",
        university: "Jharkhand University of Technology (JUT)",
        issueDate,
        status: "active",
        credentialHash: computeCredentialHash({
          credentialId: credId,
          issuer: "RVSCET Jamshedpur",
          type: input.type,
          title: input.title,
          issuedAt: issueDate,
        }),
        zkCommitment: computeZkCommitment({
          credentialId: credId,
          claimType: input.title,
          holderId: targetStudent.id,
        }),
        subjects:
          input.type === "semester"
            ? [
                {
                  code: `CS${input.semester || 3}01`,
                  name: "Design & Analysis of Algorithms",
                  credits: 4,
                  marks: 91,
                  maxMarks: 100,
                  grade: "O",
                },
                {
                  code: `CS${input.semester || 3}02`,
                  name: "Operating Systems & Kernel Design",
                  credits: 4,
                  marks: 88,
                  maxMarks: 100,
                  grade: "A+",
                },
                {
                  code: `CS${input.semester || 3}03`,
                  name: "Database Management Systems",
                  credits: 4,
                  marks: 90,
                  maxMarks: 100,
                  grade: "O",
                },
              ]
            : undefined,
      };

      setAcademicCredentials((prev) => {
        const next = [newCred, ...prev];
        try {
          localStorage.setItem(STORAGE_KEYS.ACADEMIC, JSON.stringify(next));
        } catch {}
        return next;
      });

      addNotification({
        type: "credential",
        title: "New academic credential issued",
        message: `RVSCET issued '${input.title}' (${credId}) to ${targetStudent.name}.`,
      });

      return newCred;
    },
    [addNotification, students]
  );

  const issueAchievement = useCallback(
    (input: {
      holderId: string;
      title: string;
      category: AchievementCategory;
      level: AchievementLevel;
      event: string;
      clubOrBody: string;
      description: string;
      date: string;
    }): AchievementRecord => {
      const targetStudent =
        students.find((s) => s.id === input.holderId) || DEMO_STUDENTS[0];
      const credId = generateCredentialId("KV-ACH", new Date().getFullYear());
      const newAch: AchievementRecord = {
        id: `ach-${Date.now()}`,
        credentialId: credId,
        holderId: targetStudent.id,
        studentName: targetStudent.name,
        title: input.title,
        category: input.category,
        level: input.level,
        event: input.event,
        clubOrBody: input.clubOrBody,
        description: input.description,
        issuer: "RVS College of Engineering & Technology, Jamshedpur",
        date: input.date,
        status: "active",
        credentialHash: computeCredentialHash({
          credentialId: credId,
          issuer: "RVSCET Jamshedpur",
          type: "achievement",
          title: input.title,
          issuedAt: input.date,
        }),
      };

      setAchievements((prev) => {
        const next = [newAch, ...prev];
        try {
          localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(next));
        } catch {}
        return next;
      });

      addNotification({
        type: "achievement",
        title: "Achievement received",
        message: `Awarded '${input.title}' (${credId}) to ${targetStudent.name}.`,
      });

      return newAch;
    },
    [addNotification, students]
  );

  const issueCertification = useCallback(
    (input: {
      holderId: string;
      title: string;
      category: CertificateCategory;
      issuingClubOrDept: string;
      event: string;
      issueDate: string;
      description: string;
    }): CertificationRecord => {
      const targetStudent =
        students.find((s) => s.id === input.holderId) || DEMO_STUDENTS[0];
      const credId = generateCredentialId("KV-CERT", new Date().getFullYear());
      const newCert: CertificationRecord = {
        id: `cert-${Date.now()}`,
        credentialId: credId,
        holderId: targetStudent.id,
        studentName: targetStudent.name,
        title: input.title,
        category: input.category,
        issuingClubOrDept: input.issuingClubOrDept,
        issuer: "RVS College of Engineering & Technology, Jamshedpur",
        event: input.event,
        issueDate: input.issueDate,
        description: input.description,
        status: "active",
        credentialHash: computeCredentialHash({
          credentialId: credId,
          issuer: "RVSCET Jamshedpur",
          type: "certificate",
          title: input.title,
          issuedAt: input.issueDate,
        }),
      };

      setCertifications((prev) => {
        const next = [newCert, ...prev];
        try {
          localStorage.setItem(STORAGE_KEYS.CERTIFICATIONS, JSON.stringify(next));
        } catch {}
        return next;
      });

      addNotification({
        type: "credential",
        title: "New certificate issued",
        message: `${input.issuingClubOrDept} issued '${input.title}' (${credId}).`,
      });

      return newCert;
    },
    [addNotification, students]
  );

  const revokeAnyCredential = useCallback(
    (credentialId: string, reason: string): boolean => {
      let found = false;
      const nowIso = new Date().toISOString();

      setAcademicCredentials((prev) => {
        const next = prev.map((c) => {
          if (c.credentialId.toLowerCase() === credentialId.trim().toLowerCase()) {
            found = true;
            return {
              ...c,
              status: "revoked" as const,
              revocationReason: reason,
              revokedAt: nowIso,
            };
          }
          return c;
        });
        try {
          localStorage.setItem(STORAGE_KEYS.ACADEMIC, JSON.stringify(next));
        } catch {}
        return next;
      });

      setAchievements((prev) => {
        const next = prev.map((a) => {
          if (a.credentialId.toLowerCase() === credentialId.trim().toLowerCase()) {
            found = true;
            return {
              ...a,
              status: "revoked" as const,
              revocationReason: reason,
            };
          }
          return a;
        });
        try {
          localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(next));
        } catch {}
        return next;
      });

      setCertifications((prev) => {
        const next = prev.map((cert) => {
          if (cert.credentialId.toLowerCase() === credentialId.trim().toLowerCase()) {
            found = true;
            return {
              ...cert,
              status: "revoked" as const,
              revocationReason: reason,
            };
          }
          return cert;
        });
        try {
          localStorage.setItem(STORAGE_KEYS.CERTIFICATIONS, JSON.stringify(next));
        } catch {}
        return next;
      });

      addNotification({
        type: "revocation",
        title: "Credential revoked",
        message: `Credential ${credentialId} was revoked by RVSCET. Reason: ${reason}`,
      });

      return found;
    },
    [addNotification]
  );

  const restoreAnyCredential = useCallback((credentialId: string): boolean => {
    let found = false;
    setAcademicCredentials((prev) => {
      const next = prev.map((c) => {
        if (c.credentialId.toLowerCase() === credentialId.trim().toLowerCase()) {
          found = true;
          return { ...c, status: "active" as const, revocationReason: undefined, revokedAt: undefined };
        }
        return c;
      });
      try {
        localStorage.setItem(STORAGE_KEYS.ACADEMIC, JSON.stringify(next));
      } catch {}
      return next;
    });
    setAchievements((prev) => {
      const next = prev.map((a) => {
        if (a.credentialId.toLowerCase() === credentialId.trim().toLowerCase()) {
          found = true;
          return { ...a, status: "active" as const, revocationReason: undefined };
        }
        return a;
      });
      try {
        localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(next));
      } catch {}
      return next;
    });
    setCertifications((prev) => {
      const next = prev.map((c) => {
        if (c.credentialId.toLowerCase() === credentialId.trim().toLowerCase()) {
          found = true;
          return { ...c, status: "active" as const, revocationReason: undefined };
        }
        return c;
      });
      try {
        localStorage.setItem(STORAGE_KEYS.CERTIFICATIONS, JSON.stringify(next));
      } catch {}
      return next;
    });
    return found;
  }, []);

  const createVerificationRequest = useCallback(
    (input: {
      targetHolderId: string;
      studentName?: string;
      customRequestId?: string;
      claimType: VerificationRequestRecord["claimType"];
      claimLabel: string;
      credentialId: string;
      minimumAge?: number;
      verifierName?: string;
      privacyNote?: string;
    }): VerificationRequestRecord => {
      const targetStudent = students.find((s) => s.id === input.targetHolderId);
      const reqId =
        input.customRequestId || generateCredentialId("VR-KV", new Date().getFullYear());
      const newReq: VerificationRequestRecord = {
        id: `vreq-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        requestId: reqId,
        verifierName: input.verifierName || "External Academic & Recruitment Verifier",
        verifierOrg: "Kiwi Vault Verifier Gateway",
        targetHolderId: input.targetHolderId,
        studentName: input.studentName || targetStudent?.name,
        claimType: input.claimType,
        claimLabel: input.claimLabel,
        credentialId: input.credentialId,
        minimumAge: input.minimumAge,
        status: "pending",
        createdAt: new Date().toISOString(),
        revealedClaims: [`Requested Claim: ${input.claimLabel}`],
        hiddenFields: [
          "Date of birth",
          "Aadhaar",
          "Address",
          "Phone number",
          "Student ID",
          "Full identity credential",
        ],
        privacyNote: input.privacyNote || "DOB NOT REVEALED",
      };

      setVerificationRequests((prev) => {
        const filtered = prev.filter((r) => r.requestId !== reqId);
        const next = [newReq, ...filtered];
        try {
          localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(next));
        } catch {}
        return next;
      });

      addNotification({
        type: "verification",
        title: "Verification request received",
        message: `New verification request ${reqId} for '${input.claimLabel}'.`,
      });

      return newReq;
    },
    [addNotification, students]
  );

  const completeVerificationRequest = useCallback(
    (
      requestId: string,
      outcome: {
        status: VerificationRequestRecord["status"];
        revealedClaims: string[];
        hiddenFields: string[];
        proofHash?: string;
        failureReason?: string;
        privacyNote?: string;
      }
    ) => {
      setVerificationRequests((prev) => {
        const next = prev.map((r) =>
          r.requestId === requestId
            ? {
                ...r,
                status: outcome.status,
                verifiedAt: new Date().toISOString(),
                revealedClaims: outcome.revealedClaims,
                hiddenFields: outcome.hiddenFields,
                proofHash: outcome.proofHash,
                failureReason: outcome.failureReason,
                privacyNote: outcome.privacyNote || r.privacyNote || "DOB NOT REVEALED",
              }
            : r
        );
        try {
          localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    []
  );

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      try {
        localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const resetDemoState = useCallback(() => {
    setStudents(DEMO_STUDENTS);
    setAcademicCredentials(INITIAL_ACADEMIC_CREDENTIALS);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setCertifications(INITIAL_CERTIFICATIONS);
    setVerificationRequests(INITIAL_VERIFICATION_REQUESTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    try {
      localStorage.removeItem(STORAGE_KEYS.STUDENTS_LIST);
      localStorage.removeItem(STORAGE_KEYS.ACADEMIC);
      localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
      localStorage.removeItem(STORAGE_KEYS.CERTIFICATIONS);
      localStorage.removeItem(STORAGE_KEYS.REQUESTS);
      localStorage.removeItem(STORAGE_KEYS.NOTIFS);
    } catch {}
  }, []);

  const findCredentialById = useCallback(
    (credentialId: string) => {
      const norm = credentialId.trim().toLowerCase();
      const acad = academicCredentials.find((c) => c.credentialId.toLowerCase() === norm);
      if (acad) {
        return {
          kind: "academic" as const,
          title: `${acad.title} (${acad.branch})`,
          issuer: acad.institution,
          status: acad.status,
          holderId: acad.holderId,
          revocationReason: acad.revocationReason,
          credentialHash: acad.credentialHash,
        };
      }
      const ach = achievements.find((a) => a.credentialId.toLowerCase() === norm);
      if (ach) {
        return {
          kind: "achievement" as const,
          title: `${ach.title} — ${ach.level}`,
          issuer: ach.issuer,
          status: ach.status,
          holderId: ach.holderId,
          revocationReason: ach.revocationReason,
          credentialHash: ach.credentialHash,
        };
      }
      const cert = certifications.find((c) => c.credentialId.toLowerCase() === norm);
      if (cert) {
        return {
          kind: "certification" as const,
          title: cert.title,
          issuer: cert.issuer,
          status: cert.status,
          holderId: cert.holderId,
          revocationReason: cert.revocationReason,
          credentialHash: cert.credentialHash,
        };
      }
      const idRef = identityReferences.find((i) => i.credentialId.toLowerCase() === norm);
      if (idRef) {
        return {
          kind: "identity" as const,
          title: idRef.title,
          issuer: idRef.issuer,
          status: idRef.status,
          holderId: idRef.holderId,
          credentialHash: idRef.commitmentHash,
        };
      }
      return {
        kind: "not_found" as const,
        title: "Unknown Credential",
        issuer: "Unverified",
        status: "not_issued" as const,
        holderId: "unknown",
      };
    },
    [academicCredentials, achievements, certifications, identityReferences]
  );

  return (
    <VaultContext.Provider
      value={{
        language,
        setLanguage,
        t,
        theme,
        toggleTheme,
        user,
        loginWithRole,
        logout,
        students,
        activeStudent,
        setActiveStudentById,
        updateStudentPrivacy,
        updateStudentDobForDemo,
        academicCredentials,
        identityReferences,
        achievements,
        certifications,
        verificationRequests,
        notifications,
        issueAcademicCredential,
        issueAchievement,
        issueCertification,
        revokeAnyCredential,
        restoreAnyCredential,
        createVerificationRequest,
        completeVerificationRequest,
        markAllNotificationsRead,
        resetDemoState,
        findCredentialById,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}

export function useVault() {
  const ctx = useContext(VaultContext);
  if (!ctx) {
    throw new Error("useVault must be used within a VaultProvider");
  }
  return ctx;
}
