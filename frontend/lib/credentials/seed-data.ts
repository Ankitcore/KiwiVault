import { computeCredentialHash, computeZkCommitment } from "@/lib/credentials/id-generator";

export type UserRole = "student" | "issuer" | "verifier" | "admin";

export interface SubjectRecord {
  code: string;
  name: string;
  credits: number;
  marks: number;
  maxMarks: number;
  grade: string;
}

export interface AcademicCredential {
  id: string;
  credentialId: string;
  holderId: string;
  studentName: string;
  registrationNumber: string;
  rollNumber: string;
  program: string;
  branch: string;
  semester?: number;
  academicYear: string;
  type: "identity" | "semester" | "degree" | "provisional" | "bonafide" | "transfer";
  title: string;
  subtitle: string;
  subjects?: SubjectRecord[];
  sgpa?: string;
  cgpa?: string;
  resultStatus?: string;
  graduationYear?: string;
  institution: string;
  university: string;
  issueDate: string;
  status: "active" | "revoked" | "current" | "not_issued";
  revocationReason?: string;
  revokedAt?: string;
  credentialHash: string;
  zkCommitment: string;
}

export type AchievementCategory =
  | "Hackathon"
  | "Technical"
  | "Sports"
  | "Cultural"
  | "Quiz"
  | "Clubs"
  | "Volunteering"
  | "Leadership"
  | "Contribution"
  | "Competition";

export type AchievementLevel =
  | "Winner"
  | "Runner-up"
  | "Finalist"
  | "Participation"
  | "Outstanding Contribution";

export interface AchievementRecord {
  id: string;
  credentialId: string;
  holderId: string;
  studentName: string;
  title: string;
  category: AchievementCategory;
  level: AchievementLevel;
  event: string;
  clubOrBody: string;
  description: string;
  issuer: string;
  date: string;
  status: "active" | "revoked";
  revocationReason?: string;
  credentialHash: string;
}

export type CertificateCategory =
  | "Technical Certifications"
  | "Club Certifications"
  | "Workshop Certifications"
  | "Competition Certificates"
  | "Participation Certificates"
  | "Training Certificates";

export interface CertificationRecord {
  id: string;
  credentialId: string;
  holderId: string;
  studentName: string;
  title: string;
  category: CertificateCategory;
  issuingClubOrDept: string;
  issuer: string;
  event: string;
  issueDate: string;
  description: string;
  status: "active" | "revoked";
  revocationReason?: string;
  credentialHash: string;
}

export interface IdentityReference {
  id: string;
  credentialId: string;
  holderId: string;
  studentName: string;
  title: string;
  maskedIdentifier: string;
  referenceType: "Student Identity" | "Institution ID" | "Aadhaar Reference";
  issuer: string;
  issueDate: string;
  status: "active" | "revoked";
  commitmentHash: string;
  note: string;
}

export interface DemoStudentProfile {
  id: string;
  name: string;
  email: string;
  program: string;
  branch: string;
  semester: number;
  isGraduated?: boolean;
  enrollmentYear: number;
  graduationYear: number;
  registrationNumber: string;
  rollNumber: string;
  institution: string;
  university: string;
  walletAddress: string;
  privateDateOfBirth: string; // Strictly off-chain private field for AgeVerificationCircuit
  privateHolderSecret: string; // Strictly off-chain vault secret
  maskedAadhaar: string;
  privacySettings: {
    showProfileToVerifier: boolean;
    allowAchievementVerification: boolean;
    allowAcademicVerification: boolean;
    selectiveDisclosureDefault: boolean;
  };
}

export interface VerificationRequestRecord {
  id: string;
  requestId: string;
  verifierName: string;
  verifierOrg: string;
  targetHolderId: string;
  studentName?: string;
  claimType: "degree" | "age" | "achievement" | "certificate" | "student_status";
  claimLabel: string;
  credentialId: string;
  minimumAge?: number;
  status: "pending" | "verified" | "failed" | "revoked" | "age_restricted";
  createdAt: string;
  verifiedAt?: string;
  revealedClaims: string[];
  hiddenFields: string[];
  proofHash?: string;
  failureReason?: string;
  privacyNote?: string;
}

export interface VaultNotification {
  id: string;
  type: "credential" | "achievement" | "verification" | "revocation" | "semester";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const DEMO_STUDENTS: DemoStudentProfile[] = [
  {
    id: "student-shivam",
    name: "Shivam Soni",
    email: "student@rvscet.ac.in",
    program: "Bachelor of Technology (B.Tech)",
    branch: "Computer Science & Engineering",
    semester: 3,
    isGraduated: false,
    enrollmentYear: 2024,
    graduationYear: 2028,
    registrationNumber: "JUT-RVSCET-2024-CSE-042",
    rollNumber: "24CSE042",
    institution: "RVS College of Engineering & Technology, Jamshedpur",
    university: "Jharkhand University of Technology (JUT), Ranchi",
    walletAddress: "0x8F4C...92A1 (Kiwi Vault Hardware-Backed Key)",
    privateDateOfBirth: "2006-05-14", // Adult (20 years old): Passes Age >= 18
    privateHolderSecret: "KV_SECRET_SHIVAM_24CSE042_SALT",
    maskedAadhaar: "•••• •••• 1234",
    privacySettings: {
      showProfileToVerifier: false,
      allowAchievementVerification: true,
      allowAcademicVerification: true,
      selectiveDisclosureDefault: true,
    },
  },
  {
    id: "student-aarav-under18",
    name: "Ankit Kumar",
    email: "aarav.demo@rvscet.ac.in",
    program: "B.Tech Electrical and Electronic Engineering",
    branch: "Electrical and Electronic Engineering",
    semester: 2,
    isGraduated: false,
    enrollmentYear: 2025,
    graduationYear: 2029,
    registrationNumber: "RVSCET-DEMO-017",
    rollNumber: "25CSE017",
    institution: "RVS College of Engineering and Technology, Jamshedpur",
    university: "Jharkhand University of Technology (JUT), Ranchi",
    walletAddress: "0x4E2B...017A (Kiwi Vault Hardware-Backed Key)",
    privateDateOfBirth: "2010-06-15", // Private DOB: 15/06/2010 (Under 18 as of current demo date)
    privateHolderSecret: "KV_SECRET_AARAV_DEMO_017_SALT",
    maskedAadhaar: "•••• •••• 0174",
    privacySettings: {
      showProfileToVerifier: false,
      allowAchievementVerification: true,
      allowAcademicVerification: true,
      selectiveDisclosureDefault: true,
    },
  },
  {
    id: "student-aarav",
    name: "Sidharth Gupta",
    email: "aarav@rvscet.ac.in",
    program: "Bachelor of Technology (B.Tech)",
    branch: "Computer Science & Engineering",
    semester: 8,
    isGraduated: true,
    enrollmentYear: 2022,
    graduationYear: 2026,
    registrationNumber: "JUT-RVSCET-2022-CSE-011",
    rollNumber: "22CSE011",
    institution: "RVS College of Engineering & Technology, Jamshedpur",
    university: "Jharkhand University of Technology (JUT), Ranchi",
    walletAddress: "0x3B9E...44D8 (Kiwi Vault Hardware-Backed Key)",
    privateDateOfBirth: "2003-11-20", // 22 years old: Passes both Age >= 18 and Age >= 21
    privateHolderSecret: "KV_SECRET_AARAV_22CSE011_SALT",
    maskedAadhaar: "•••• •••• 8891",
    privacySettings: {
      showProfileToVerifier: true,
      allowAchievementVerification: true,
      allowAcademicVerification: true,
      selectiveDisclosureDefault: true,
    },
  },
  {
    id: "student-ananya",
    name: "Abhishek Kumar",
    email: "ananya@rvscet.ac.in",
    program: "Bachelor of Technology (B.Tech)",
    branch: "Artifical Intelligence And Machine Learning",
    semester: 5,
    isGraduated: false,
    enrollmentYear: 2023,
    graduationYear: 2027,
    registrationNumber: "JUT-RVSCET-2023-ECE-027",
    rollNumber: "23ECE027",
    institution: "RVS College of Engineering & Technology, Jamshedpur",
    university: "Jharkhand University of Technology (JUT), Ranchi",
    walletAddress: "0x6C1A...77E3 (Kiwi Vault Hardware-Backed Key)",
    privateDateOfBirth: "2005-02-10", // 21 years old
    privateHolderSecret: "KV_SECRET_ANANYA_23ECE027_SALT",
    maskedAadhaar: "•••• •••• 4509",
    privacySettings: {
      showProfileToVerifier: false,
      allowAchievementVerification: true,
      allowAcademicVerification: true,
      selectiveDisclosureDefault: true,
    },
  },
];

function makeAcademicCred(
  partial: Omit<AcademicCredential, "credentialHash" | "zkCommitment">
): AcademicCredential {
  return {
    ...partial,
    credentialHash: computeCredentialHash({
      credentialId: partial.credentialId,
      issuer: partial.institution,
      type: partial.type,
      title: partial.title,
      issuedAt: partial.issueDate,
    }),
    zkCommitment: computeZkCommitment({
      credentialId: partial.credentialId,
      claimType: partial.title,
      holderId: partial.holderId,
    }),
  };
}

export const INITIAL_ACADEMIC_CREDENTIALS: AcademicCredential[] = [
  // ================= SHIVAM SONI (3rd Semester B.Tech CSE) =================
  makeAcademicCred({
    id: "acad-shivam-id",
    credentialId: "KV-RVSCET-2024-000101",
    holderId: "student-shivam",
    studentName: "Shivam Soni",
    registrationNumber: "JUT-RVSCET-2024-CSE-042",
    rollNumber: "24CSE042",
    program: "B.Tech",
    branch: "Computer Science & Engineering",
    academicYear: "2024–2028",
    type: "identity",
    title: "RVSCET Official Student Identity",
    subtitle: "Enrolled B.Tech CSE Undergraduate • JUT Affiliated",
    resultStatus: "ENROLLED & VERIFIED",
    graduationYear: "2028",
    institution: "RVS College of Engineering & Technology, Jamshedpur",
    university: "Jharkhand University of Technology (JUT)",
    issueDate: "2024-08-12",
    status: "active",
  }),
  makeAcademicCred({
    id: "acad-shivam-sem1",
    credentialId: "KV-RVSCET-2025-000142",
    holderId: "student-shivam",
    studentName: "Shivam Soni",
    registrationNumber: "JUT-RVSCET-2024-CSE-042",
    rollNumber: "24CSE042",
    program: "B.Tech",
    branch: "Computer Science & Engineering",
    semester: 1,
    academicYear: "2024–2025",
    type: "semester",
    title: "Semester 1 Examination Result",
    subtitle: "JUT End-Semester Grade Card • SGPA 8.64",
    sgpa: "8.64",
    cgpa: "8.64",
    resultStatus: "PASSED WITH DISTINCTION",
    institution: "RVS College of Engineering & Technology, Jamshedpur",
    university: "Jharkhand University of Technology (JUT)",
    issueDate: "2025-02-18",
    status: "active",
    subjects: [
      { code: "BSC101", name: "Engineering Mathematics I", credits: 4, marks: 88, maxMarks: 100, grade: "A+" },
      { code: "BSC102", name: "Engineering Physics", credits: 4, marks: 84, maxMarks: 100, grade: "A" },
      { code: "ESC101", name: "Programming for Problem Solving (C)", credits: 4, marks: 92, maxMarks: 100, grade: "O" },
      { code: "ESC102", name: "Basic Electrical Engineering", credits: 3, marks: 81, maxMarks: 100, grade: "A" },
      { code: "HSMC101", name: "Professional English & Communication", credits: 2, marks: 89, maxMarks: 100, grade: "A+" },
    ],
  }),
  makeAcademicCred({
    id: "acad-shivam-sem2",
    credentialId: "KV-RVSCET-2025-000184",
    holderId: "student-shivam",
    studentName: "Shivam Soni",
    registrationNumber: "JUT-RVSCET-2024-CSE-042",
    rollNumber: "24CSE042",
    program: "B.Tech",
    branch: "Computer Science & Engineering",
    semester: 2,
    academicYear: "2024–2025",
    type: "semester",
    title: "Semester 2 Examination Result",
    subtitle: "JUT End-Semester Grade Card • SGPA 8.82",
    sgpa: "8.82",
    cgpa: "8.73",
    resultStatus: "PASSED WITH DISTINCTION",
    institution: "RVS College of Engineering & Technology, Jamshedpur",
    university: "Jharkhand University of Technology (JUT)",
    issueDate: "2025-07-24",
    status: "active",
    subjects: [
      { code: "BSC201", name: "Engineering Mathematics II", credits: 4, marks: 90, maxMarks: 100, grade: "O" },
      { code: "BSC202", name: "Engineering Chemistry", credits: 4, marks: 85, maxMarks: 100, grade: "A+" },
      { code: "ESC201", name: "Data Structures & Algorithms", credits: 4, marks: 94, maxMarks: 100, grade: "O" },
      { code: "ESC202", name: "Digital Logic & Computer Design", credits: 3, marks: 87, maxMarks: 100, grade: "A+" },
      { code: "ESC203", name: "Engineering Graphics & CAD", credits: 3, marks: 82, maxMarks: 100, grade: "A" },
    ],
  }),
  makeAcademicCred({
    id: "acad-shivam-bonafide",
    credentialId: "KV-RVSCET-2026-000210",
    holderId: "student-shivam",
    studentName: "Shivam Soni",
    registrationNumber: "JUT-RVSCET-2024-CSE-042",
    rollNumber: "24CSE042",
    program: "B.Tech",
    branch: "Computer Science & Engineering",
    semester: 3,
    academicYear: "2025–2026",
    type: "bonafide",
    title: "Official Bonafide Student Certificate",
    subtitle: "Issued for Hackathon & Scholarship Verification",
    resultStatus: "ACTIVE BONAFIDE",
    graduationYear: "2028",
    institution: "RVS College of Engineering & Technology, Jamshedpur",
    university: "Jharkhand University of Technology (JUT)",
    issueDate: "2026-01-15",
    status: "active",
  }),
  makeAcademicCred({
    id: "acad-shivam-degree-preview",
    credentialId: "KV-RVSCET-2028-000124",
    holderId: "student-shivam",
    studentName: "Shivam Soni",
    registrationNumber: "JUT-RVSCET-2024-CSE-042",
    rollNumber: "24CSE042",
    program: "BACHELOR OF TECHNOLOGY",
    branch: "Computer Science & Engineering",
    academicYear: "2024–2028",
    type: "degree",
    title: "B.Tech CSE Candidacy & Enrolment Credential",
    subtitle: "Bachelor of Technology in Computer Science & Engineering",
    cgpa: "8.73",
    resultStatus: "FIRST CLASS WITH DISTINCTION (TRACK)",
    graduationYear: "2028",
    institution: "RVS College of Engineering & Technology, Jamshedpur",
    university: "Jharkhand University of Technology (JUT)",
    issueDate: "2026-02-01",
    status: "active",
  }),

  // ================= SIDHARTH GUPTA (8th Semester Graduated B.Tech CSE) =================
  makeAcademicCred({
    id: "acad-aarav-degree",
    credentialId: "KV-RVSCET-2026-000812",
    holderId: "student-aarav",
    studentName: "Sidharth Gupta",
    registrationNumber: "JUT-RVSCET-2022-CSE-011",
    rollNumber: "22CSE011",
    program: "BACHELOR OF TECHNOLOGY",
    branch: "Computer Science & Engineering",
    semester: 8,
    academicYear: "2022–2026",
    type: "degree",
    title: "Bachelor of Technology — Computer Science & Engineering",
    subtitle: "Final Convocation Degree • CGPA 9.12 (Honours)",
    sgpa: "9.40",
    cgpa: "9.12",
    resultStatus: "FIRST CLASS WITH HONOURS",
    graduationYear: "2026",
    institution: "RVS College of Engineering & Technology, Jamshedpur",
    university: "Jharkhand University of Technology (JUT)",
    issueDate: "2026-06-30",
    status: "active",
    subjects: [
      { code: "PCC801", name: "Cryptography & Network Security", credits: 4, marks: 95, maxMarks: 100, grade: "O" },
      { code: "PCC802", name: "Distributed & Blockchain Systems", credits: 4, marks: 96, maxMarks: 100, grade: "O" },
      { code: "PEC801", name: "Deep Learning & Neural Networks", credits: 3, marks: 91, maxMarks: 100, grade: "O" },
      { code: "PROJ801", name: "Major Capstone Project (Zero-Knowledge ID)", credits: 6, marks: 98, maxMarks: 100, grade: "O" },
    ],
  }),
  makeAcademicCred({
    id: "acad-aarav-prov",
    credentialId: "KV-RVSCET-2026-000815",
    holderId: "student-aarav",
    studentName: "Sidharth Gupta",
    registrationNumber: "JUT-RVSCET-2022-CSE-011",
    rollNumber: "22CSE011",
    program: "B.Tech",
    branch: "Computer Science & Engineering",
    semester: 8,
    academicYear: "2022–2026",
    type: "provisional",
    title: "Provisional Degree Certificate",
    subtitle: "Issued upon completion of all 8 Semesters under JUT Ranchi",
    cgpa: "9.12",
    resultStatus: "GRADUATED",
    graduationYear: "2026",
    institution: "RVS College of Engineering & Technology, Jamshedpur",
    university: "Jharkhand University of Technology (JUT)",
    issueDate: "2026-06-15",
    status: "active",
  }),
  makeAcademicCred({
    id: "acad-aarav-id",
    credentialId: "KV-RVSCET-2022-000011",
    holderId: "student-aarav",
    studentName: "Sidharth Gupta",
    registrationNumber: "JUT-RVSCET-2022-CSE-011",
    rollNumber: "22CSE011",
    program: "B.Tech",
    branch: "Computer Science & Engineering",
    academicYear: "2022–2026",
    type: "identity",
    title: "RVSCET Alumni & Graduate Identity",
    subtitle: "Class of 2026 • B.Tech CSE",
    resultStatus: "GRADUATED",
    graduationYear: "2026",
    institution: "RVS College of Engineering & Technology, Jamshedpur",
    university: "Jharkhand University of Technology (JUT)",
    issueDate: "2022-08-10",
    status: "active",
  }),
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((sem) =>
    makeAcademicCred({
      id: `acad-aarav-sem${sem}`,
      credentialId: `KV-RVSCET-202${Math.min(6, 2 + Math.floor(sem / 2))}-00070${sem}`,
      holderId: "student-aarav",
      studentName: "Sidharth Gupta",
      registrationNumber: "JUT-RVSCET-2022-CSE-011",
      rollNumber: "22CSE011",
      program: "B.Tech",
      branch: "Computer Science & Engineering",
      semester: sem,
      academicYear: `${2022 + Math.floor((sem - 1) / 2)}–${2023 + Math.floor((sem - 1) / 2)}`,
      type: "semester",
      title: `Semester ${sem} Examination Result`,
      subtitle: `JUT End-Semester Grade Card • SGPA ${(8.9 + sem * 0.06).toFixed(2)}`,
      sgpa: (8.9 + sem * 0.06).toFixed(2),
      cgpa: "9.12",
      resultStatus: "PASSED WITH DISTINCTION",
      institution: "RVS College of Engineering & Technology, Jamshedpur",
      university: "Jharkhand University of Technology (JUT)",
      issueDate: `202${Math.min(6, 3 + Math.floor((sem - 1) / 2))}-0${(sem % 2) * 5 + 2}-20`,
      status: "active",
      subjects: [
        { code: `CSE${sem}01`, name: `Core Computer Science Paper ${sem}.1`, credits: 4, marks: 91, maxMarks: 100, grade: "O" },
        { code: `CSE${sem}02`, name: `Systems & Architecture Paper ${sem}.2`, credits: 4, marks: 89, maxMarks: 100, grade: "A+" },
        { code: `CSE${sem}03`, name: `Algorithms & Computing Lab ${sem}.3`, credits: 3, marks: 94, maxMarks: 100, grade: "O" },
      ],
    })
  ),

  // ================= ABHISHEK KUMAR (5th Semester B.Tech AI & ML) =================
  makeAcademicCred({
    id: "acad-ananya-id",
    credentialId: "KV-RVSCET-2023-000301",
    holderId: "student-ananya",
    studentName: "Abhishek Kumar",
    registrationNumber: "JUT-RVSCET-2023-ECE-027",
    rollNumber: "23ECE027",
    program: "B.Tech",
    branch: "Artifical Intelligence And Machine Learning",
    academicYear: "2023–2027",
    type: "identity",
    title: "RVSCET Official Student Identity",
    subtitle: "Enrolled B.Tech ECE Undergraduate • JUT Affiliated",
    resultStatus: "ENROLLED & VERIFIED",
    graduationYear: "2027",
    institution: "RVS College of Engineering & Technology, Jamshedpur",
    university: "Jharkhand University of Technology (JUT)",
    issueDate: "2023-08-14",
    status: "active",
  }),
  ...[1, 2, 3, 4].map((sem) =>
    makeAcademicCred({
      id: `acad-ananya-sem${sem}`,
      credentialId: `KV-RVSCET-202${4 + Math.floor(sem / 2)}-00031${sem}`,
      holderId: "student-ananya",
      studentName: "Abhishek Kumar",
    registrationNumber: "JUT-RVSCET-2023-ECE-027",
    rollNumber: "23ECE027",
    program: "B.Tech",
    branch: "Artifical Intelligence And Machine Learning",
      semester: sem,
      academicYear: `${2023 + Math.floor((sem - 1) / 2)}–${2024 + Math.floor((sem - 1) / 2)}`,
      type: "semester",
      title: `Semester ${sem} Examination Result`,
      subtitle: `JUT End-Semester Grade Card • SGPA ${(8.5 + sem * 0.08).toFixed(2)}`,
      sgpa: (8.5 + sem * 0.08).toFixed(2),
      cgpa: "8.74",
      resultStatus: "PASSED WITH DISTINCTION",
      institution: "RVS College of Engineering & Technology, Jamshedpur",
      university: "Jharkhand University of Technology (JUT)",
      issueDate: `202${4 + Math.floor((sem - 1) / 2)}-06-18`,
      status: "active",
      subjects: [
        { code: `ECE${sem}01`, name: `Analog & Digital Communication ${sem}`, credits: 4, marks: 88, maxMarks: 100, grade: "A+" },
        { code: `ECE${sem}02`, name: `Microprocessors & Signal Processing ${sem}`, credits: 4, marks: 90, maxMarks: 100, grade: "O" },
        { code: `ECE${sem}03`, name: `VLSI & Embedded Lab ${sem}`, credits: 3, marks: 92, maxMarks: 100, grade: "O" },
      ],
    })
  ),

  // ================= ANKIT KUMAR (2nd Semester Under-18 Demo Student) =================
  makeAcademicCred({
    id: "acad-aarav-under18-id",
    credentialId: "KV-RVSCET-DEMO-017",
    holderId: "student-aarav-under18",
    studentName: "Ankit Kumar",
    registrationNumber: "RVSCET-DEMO-017",
    rollNumber: "25CSE017",
    program: "B.Tech",
    branch: "Electrical and Electronic Engineering",
    semester: 2,
    academicYear: "2025–2029",
    type: "identity",
    title: "Student Identity",
    subtitle: "Enrolled B.Tech CSE 2nd Semester • RVSCET Jamshedpur",
    resultStatus: "ACTIVE",
    graduationYear: "2029",
    institution: "RVS College of Engineering and Technology, Jamshedpur",
    university: "Jharkhand University of Technology (JUT)",
    issueDate: "2025-08-14",
    status: "active",
  }),
  makeAcademicCred({
    id: "acad-aarav-under18-sem1",
    credentialId: "KV-RVSCET-2026-000171",
    holderId: "student-aarav-under18",
    studentName: "Ankit Kumar",
    registrationNumber: "RVSCET-DEMO-017",
    rollNumber: "25CSE017",
    program: "B.Tech",
    branch: "Electrical and Electronic Engineering",
    semester: 1,
    academicYear: "2025–2026",
    type: "semester",
    title: "Semester 1 Examination Result",
    subtitle: "JUT End-Semester Grade Card • SGPA 8.70",
    sgpa: "8.70",
    cgpa: "8.70",
    resultStatus: "PASSED WITH DISTINCTION",
    institution: "RVS College of Engineering and Technology, Jamshedpur",
    university: "Jharkhand University of Technology (JUT)",
    issueDate: "2026-02-12",
    status: "active",
    subjects: [
      { code: "BSC101", name: "Engineering Mathematics I", credits: 4, marks: 89, maxMarks: 100, grade: "A+" },
      { code: "ESC101", name: "Programming for Problem Solving", credits: 4, marks: 91, maxMarks: 100, grade: "O" },
    ],
  }),
];

export const INITIAL_IDENTITY_REFERENCES: IdentityReference[] = [
  {
    id: "idref-aarav-under18-student",
    credentialId: "KV-RVSCET-DEMO-017",
    holderId: "student-aarav-under18",
    studentName: "Ankit Kumar",
    title: "Student Identity",
    maskedIdentifier: "RVSCET-DEMO-017",
    referenceType: "Student Identity",
    issuer: "RVS College of Engineering and Technology, Jamshedpur",
    issueDate: "2025-08-14",
    status: "active",
    commitmentHash: "0x017a9f8e7d6c5b4a392817263544536271809f8e7d6c5b4a3928172635445362",
    note: "Contains off-chain private DOB commitment for zero-knowledge age verification. Raw DOB is never stored on-chain or revealed to verifiers.",
  },
  {
    id: "idref-shivam-student",
    credentialId: "KV-ID-2024-000101",
    holderId: "student-shivam",
    studentName: "Shivam Soni",
    title: "RVSCET Institutional Student ID",
    maskedIdentifier: "RVSCET-CSE-24042",
    referenceType: "Student Identity",
    issuer: "RVS College of Engineering & Technology, Jamshedpur",
    issueDate: "2024-08-12",
    status: "active",
    commitmentHash: "0x91f8c4e20b731a65d82219e4b019a7c2d81f6e33a0b2c1d4e5f60718293a4b5c",
    note: "Proves active enrollment at RVSCET without revealing personal contact or family details.",
  },
  {
    id: "idref-shivam-jut",
    credentialId: "KV-ID-2024-000102",
    holderId: "student-shivam",
    studentName: "Shivam Soni",
    title: "JUT University Registration Reference",
    maskedIdentifier: "JUT-REG-••••-042",
    referenceType: "Institution ID",
    issuer: "Jharkhand University of Technology (JUT)",
    issueDate: "2024-09-01",
    status: "active",
    commitmentHash: "0x44a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcde",
    note: "University-level cryptographic enrollment commitment.",
  },
  {
    id: "idref-shivam-aadhaar",
    credentialId: "KV-ID-2024-000103",
    holderId: "student-shivam",
    studentName: "Shivam Soni",
    title: "Verified Government Identity Reference (Aadhaar)",
    maskedIdentifier: "•••• •••• 1234",
    referenceType: "Aadhaar Reference",
    issuer: "RVSCET Admission KYC Anchor (DEMO CREDENTIAL)",
    issueDate: "2024-08-10",
    status: "active",
    commitmentHash: "0x7f29a3c18b421465b72485d22e9182736455463728190a1b2c3d4e5f60718293",
    note: "Raw Aadhaar number is NEVER stored on-chain or in Kiwi Vault servers. Only a salted zero-knowledge commitment is held for selective age/identity claims.",
  },
  {
    id: "idref-aarav-aadhaar",
    credentialId: "KV-ID-2022-000201",
    holderId: "student-aarav",
    studentName: "Sidharth Gupta",
    title: "Verified Government Identity Reference (Aadhaar)",
    maskedIdentifier: "•••• •••• 8891",
    referenceType: "Aadhaar Reference",
    issuer: "RVSCET Admission KYC Anchor (DEMO CREDENTIAL)",
    issueDate: "2022-08-10",
    status: "active",
    commitmentHash: "0x3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f8091a2b",
    note: "Zero-knowledge identity anchor for selective age and citizenship claims.",
  },
  {
    id: "idref-ananya-aadhaar",
    credentialId: "KV-ID-2023-000301",
    holderId: "student-ananya",
    studentName: "Abhishek Kumar",
    title: "Verified Government Identity Reference (Aadhaar)",
    maskedIdentifier: "•••• •••• 4509",
    referenceType: "Aadhaar Reference",
    issuer: "RVSCET Admission KYC Anchor (DEMO CREDENTIAL)",
    issueDate: "2023-08-14",
    status: "active",
    commitmentHash: "0x5a6b7c8d9e0f1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3",
    note: "Zero-knowledge identity anchor for selective age and student identity verification.",
  },
];

export const INITIAL_ACHIEVEMENTS: AchievementRecord[] = [
  // SHIVAM SONI ACHIEVEMENTS
  {
    id: "ach-shivam-sih",
    credentialId: "KV-ACH-2026-0042",
    holderId: "student-shivam",
    studentName: "Shivam Soni",
    title: "Smart India Hackathon 2026 — Winner",
    category: "Hackathon",
    level: "Winner",
    event: "Smart India Hackathon (SIH) 2026",
    clubOrBody: "RVSCET Innovation Cell & AICTE",
    description:
      "Won First Prize in Track 04 (Zero-Knowledge ID & Privacy-Preserving Digital Identity) representing RVS College of Engineering & Technology, Jamshedpur.",
    issuer: "RVS College of Engineering & Technology, Jamshedpur",
    date: "September 2026",
    status: "active",
    credentialHash: "0x8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b",
  },
  {
    id: "ach-shivam-helix",
    credentialId: "KV-ACH-2025-0018",
    holderId: "student-shivam",
    studentName: "Shivam Soni",
    title: "Helix Coding Challenge — 1st Place Winner",
    category: "Technical",
    level: "Winner",
    event: "Helix Annual Tech Symposium 2025",
    clubOrBody: "Helix — Technical & Coding Club of RVSCET",
    description:
      "Secured 1st Rank among 180+ participants in competitive algorithmic problem solving and full-stack architecture at Helix RVSCET.",
    issuer: "RVS College of Engineering & Technology, Jamshedpur",
    date: "November 2025",
    status: "active",
    credentialHash: "0x11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff",
  },
  {
    id: "ach-shivam-ndli",
    credentialId: "KV-ACH-2025-0029",
    holderId: "student-shivam",
    studentName: "Shivam Soni",
    title: "NDLI Club Quiz — National Knowledge Finalist",
    category: "Quiz",
    level: "Finalist",
    event: "NDLI Club Knowledge & Research Quiz",
    clubOrBody: "NDLI Club (National Digital Library of India — RVSCET Chapter)",
    description:
      "Recognized for excellence in the NDLI Club Inter-Departmental Technical & Research Literacy Quiz at RVSCET Jamshedpur.",
    issuer: "RVS College of Engineering & Technology, Jamshedpur",
    date: "August 2025",
    status: "active",
    credentialHash: "0x2233445566778899aabbccddeeff00112233445566778899aabbccddeeff0011",
  },
  {
    id: "ach-shivam-frolic",
    credentialId: "KV-ACH-2026-0034",
    holderId: "student-shivam",
    studentName: "Shivam Soni",
    title: "Frolic 2026 — Annual Sports Meet Winner (100m Relay)",
    category: "Sports",
    level: "Winner",
    event: "Frolic 2026 — RVSCET Annual Sports Fest",
    clubOrBody: "Frolic Sports Council, RVSCET",
    description:
      "Represented CSE Department and won Gold Medal in the 4x100m Inter-Branch Athletics Relay during Frolic 2026.",
    issuer: "RVS College of Engineering & Technology, Jamshedpur",
    date: "February 2026",
    status: "active",
    credentialHash: "0x33445566778899aabbccddeeff00112233445566778899aabbccddeeff001122",
  },
  {
    id: "ach-shivam-tarangini",
    credentialId: "KV-ACH-2026-0049",
    holderId: "student-shivam",
    studentName: "Shivam Soni",
    title: "Tarangini Cultural Fest — Event Organization Lead",
    category: "Leadership",
    level: "Outstanding Contribution",
    event: "Tarangini 2026 — Annual Cultural Fest",
    clubOrBody: "Tarangini Cultural Committee, RVSCET",
    description:
      "Awarded for Student Leadership and Event Coordination managing stage operations and digital registrations for 1,200+ students.",
    issuer: "RVS College of Engineering & Technology, Jamshedpur",
    date: "March 2026",
    status: "active",
    credentialHash: "0x445566778899aabbccddeeff00112233445566778899aabbccddeeff00112233",
  },
  {
    id: "ach-shivam-xpectra",
    credentialId: "KV-ACH-2026-0055",
    holderId: "student-shivam",
    studentName: "Shivam Soni",
    title: "Xpectra Media & Cinematography Showcase — Runner-up",
    category: "Cultural",
    level: "Runner-up",
    event: "Xpectra Creative Media Fest 2026",
    clubOrBody: "Xpectra — Photography & Media Club of RVSCET",
    description:
      "Awarded Runner-up for producing the official campus documentary reel at Xpectra RVSCET.",
    issuer: "RVS College of Engineering & Technology, Jamshedpur",
    date: "April 2026",
    status: "active",
    credentialHash: "0x5566778899aabbccddeeff00112233445566778899aabbccddeeff0011223344",
  },

  // SIDHARTH GUPTA ACHIEVEMENTS
  {
    id: "ach-aarav-sih",
    credentialId: "KV-ACH-2026-0061",
    holderId: "student-aarav",
    studentName: "Sidharth Gupta",
    title: "Smart India Hackathon 2026 — National Winner",
    category: "Hackathon",
    level: "Winner",
    event: "Smart India Hackathon 2026",
    clubOrBody: "RVSCET Innovation Cell",
    description: "Team Lead for winning zero-knowledge credential architecture solution.",
    issuer: "RVS College of Engineering & Technology, Jamshedpur",
    date: "September 2026",
    status: "active",
    credentialHash: "0x66778899aabbccddeeff00112233445566778899aabbccddeeff001122334455",
  },
  {
    id: "ach-aarav-helix",
    credentialId: "KV-ACH-2025-0064",
    holderId: "student-aarav",
    studentName: "Sidharth Gupta",
    title: "Technical Club Contributor — Helix Mentor",
    category: "Contribution",
    level: "Outstanding Contribution",
    event: "Helix Coding & Web3 Mentorship Series",
    clubOrBody: "Helix Technical Club, RVSCET",
    description: "Mentored 150+ junior students in Data Structures, Linux, and Web3 development.",
    issuer: "RVS College of Engineering & Technology, Jamshedpur",
    date: "December 2025",
    status: "active",
    credentialHash: "0x778899aabbccddeeff00112233445566778899aabbccddeeff00112233445566",
  },
  {
    id: "ach-aarav-tarangini",
    credentialId: "KV-ACH-2025-0074",
    holderId: "student-aarav",
    studentName: "Sidharth Gupta",
    title: "Event Volunteer — Tarangini Cultural Fest",
    category: "Volunteering",
    level: "Outstanding Contribution",
    event: "Tarangini Annual Fest",
    clubOrBody: "Tarangini Cultural Committee, RVSCET",
    description: "Recognized for hospitality and technical stage management during Tarangini.",
    issuer: "RVS College of Engineering & Technology, Jamshedpur",
    date: "March 2025",
    status: "active",
    credentialHash: "0x8899aabbccddeeff00112233445566778899aabbccddeeff0011223344556677",
  },

  // ABHISHEK KUMAR ACHIEVEMENTS
  {
    id: "ach-ananya-xpectra",
    credentialId: "KV-ACH-2026-0091",
    holderId: "student-ananya",
    studentName: "Abhishek Kumar",
    title: "Xpectra Photography Competition — 1st Prize Winner",
    category: "Cultural",
    level: "Winner",
    event: "Xpectra Visual Arts Showcase 2026",
    clubOrBody: "Xpectra Club, RVSCET",
    description: "Won 1st Prize for architectural and campus life photography at RVSCET Jamshedpur.",
    issuer: "RVS College of Engineering & Technology, Jamshedpur",
    date: "April 2026",
    status: "active",
    credentialHash: "0x99aabbccddeeff00112233445566778899aabbccddeeff001122334455667788",
  },
  {
    id: "ach-ananya-frolic",
    credentialId: "KV-ACH-2026-0095",
    holderId: "student-ananya",
    studentName: "Abhishek Kumar",
    title: "Frolic 2026 — Sports Participation & Table Tennis Finalist",
    category: "Sports",
    level: "Finalist",
    event: "Frolic 2026 Sports Meet",
    clubOrBody: "Frolic Sports Council, RVSCET",
    description: "Women's Singles Table Tennis Finalist representing Department of ECE.",
    issuer: "RVS College of Engineering & Technology, Jamshedpur",
    date: "February 2026",
    status: "active",
    credentialHash: "0xaabbccddeeff00112233445566778899aabbccddeeff00112233445566778899",
  },
  {
    id: "ach-ananya-ndli",
    credentialId: "KV-ACH-2025-0099",
    holderId: "student-ananya",
    studentName: "Abhishek Kumar",
    title: "NDLI Club Quiz Participation Certificate",
    category: "Clubs",
    level: "Participation",
    event: "NDLI Digital Research Seminar & Quiz",
    clubOrBody: "NDLI Club, RVSCET",
    description: "Active participant in the National Digital Library of India RVSCET Chapter quiz.",
    issuer: "RVS College of Engineering & Technology, Jamshedpur",
    date: "October 2025",
    status: "active",
    credentialHash: "0xbbccddeeff00112233445566778899aabbccddeeff00112233445566778899aa",
  },
];

export const INITIAL_CERTIFICATIONS: CertificationRecord[] = [
  {
    id: "cert-shivam-helix-ws",
    credentialId: "KV-CERT-2025-000102",
    holderId: "student-shivam",
    studentName: "Shivam Soni",
    title: "Helix Technical Workshop — Zero-Knowledge Proofs & Web3 Security",
    category: "Workshop Certifications",
    issuingClubOrDept: "Helix Technical Club & Dept. of CSE",
    issuer: "RVS College of Engineering & Technology, Jamshedpur",
    event: "Helix Winter Tech Bootcamp 2025",
    issueDate: "2025-12-10",
    description:
      "Completed 30 hours of hands-on laboratory training in Circom circuits, Groth16 proofs, and smart contract security.",
    status: "active",
    credentialHash: "0xccddeeff00112233445566778899aabbccddeeff00112233445566778899aabb",
  },
  {
    id: "cert-shivam-ndli",
    credentialId: "KV-CERT-2025-000115",
    holderId: "student-shivam",
    studentName: "Shivam Soni",
    title: "NDLI Club Quiz Participation Certificate",
    category: "Club Certifications",
    issuingClubOrDept: "NDLI Club RVSCET Chapter",
    issuer: "RVS College of Engineering & Technology, Jamshedpur",
    event: "NDLI Annual Knowledge Drive 2025",
    issueDate: "2025-08-22",
    description:
      "Certified member and quiz participant under the National Digital Library of India institutional chapter at RVSCET.",
    status: "active",
    credentialHash: "0xddeeff00112233445566778899aabbccddeeff00112233445566778899aabbcc",
  },
  {
    id: "cert-shivam-xpectra",
    credentialId: "KV-CERT-2026-000128",
    holderId: "student-shivam",
    studentName: "Shivam Soni",
    title: "Xpectra Video Editing & Digital Storytelling Workshop",
    category: "Training Certificates",
    issuingClubOrDept: "Xpectra Media Club, RVSCET",
    issuer: "RVS College of Engineering & Technology, Jamshedpur",
    event: "Xpectra Creative Media Workshop",
    issueDate: "2026-01-28",
    description:
      "Successfully completed the creative video production, color grading, and motion design workshop hosted by Xpectra.",
    status: "active",
    credentialHash: "0xeeff00112233445566778899aabbccddeeff00112233445566778899aabbccdd",
  },
  {
    id: "cert-shivam-sih-part",
    credentialId: "KV-CERT-2026-000144",
    holderId: "student-shivam",
    studentName: "Shivam Soni",
    title: "Smart India Hackathon 2026 — Official Institutional Representation",
    category: "Competition Certificates",
    issuingClubOrDept: "Department of CSE & Innovation Cell",
    issuer: "RVS College of Engineering & Technology, Jamshedpur",
    event: "Smart India Hackathon 2026",
    issueDate: "2026-09-19",
    description:
      "Official certificate recognizing representation of RVSCET Jamshedpur in the Smart India Hackathon 2026.",
    status: "active",
    credentialHash: "0xff00112233445566778899aabbccddeeff00112233445566778899aabbccddee",
  },
  {
    id: "cert-aarav-zk",
    credentialId: "KV-CERT-2026-000201",
    holderId: "student-aarav",
    studentName: "Sidharth Gupta",
    title: "Advanced Applied Cryptography & Verifiable Credentials",
    category: "Technical Certifications",
    issuingClubOrDept: "Department of Computer Science & Engineering",
    issuer: "RVS College of Engineering & Technology, Jamshedpur",
    event: "RVSCET Advanced Computing Certification",
    issueDate: "2026-05-10",
    description: "Distinction grade in Applied Zero-Knowledge Proofs and Decentralized Identity Systems.",
    status: "active",
    credentialHash: "0x00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff",
  },
  {
    id: "cert-ananya-xpectra",
    credentialId: "KV-CERT-2026-000301",
    holderId: "student-ananya",
    studentName: "Abhishek Kumar",
    title: "Xpectra Photography & Visual Composition Masterclass",
    category: "Club Certifications",
    issuingClubOrDept: "Xpectra Club, RVSCET",
    issuer: "RVS College of Engineering & Technology, Jamshedpur",
    event: "Xpectra Annual Exhibition",
    issueDate: "2026-04-12",
    description: "Awarded for excellence in digital photography and visual storytelling.",
    status: "active",
    credentialHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  },
];

export const INITIAL_VERIFICATION_REQUESTS: VerificationRequestRecord[] = [
  {
    id: "vreq-demo-017",
    requestId: "VR-KV-DEMO-017",
    verifierName: "Age-Restricted Hackathon & Fellowship Portal",
    verifierOrg: "External Eligibility Verifier",
    targetHolderId: "student-aarav-under18",
    studentName: "Ankit Kumar",
    claimType: "age",
    claimLabel: "Age ≥ 18",
    credentialId: "KV-RVSCET-DEMO-017",
    minimumAge: 18,
    status: "age_restricted",
    createdAt: "2026-10-07T10:15:00Z",
    verifiedAt: "2026-10-07T10:15:12Z",
    revealedClaims: [
      "Age ≥ 18 requirement was not satisfied",
      "Credential issuer (RVS College of Engineering and Technology, Jamshedpur)",
      "Credential validity/status (ACTIVE)",
    ],
    hiddenFields: [
      "Date of birth",
      "Aadhaar",
      "Address",
      "Phone number",
      "Student ID",
      "Full identity credential",
    ],
    failureReason: "Age requirement not satisfied",
    privacyNote: "DOB NOT REVEALED",
  },
  {
    id: "vreq-1",
    requestId: "VR-KV-2026-00892",
    verifierName: "National Scholarship & Internship Portal",
    verifierOrg: "External Academic Verifier",
    targetHolderId: "student-shivam",
    studentName: "Shivam Soni",
    claimType: "degree",
    claimLabel: "B.Tech CSE Student Enrollment & Degree Track",
    credentialId: "KV-RVSCET-2028-000124",
    status: "verified",
    createdAt: "2026-10-06T10:30:00Z",
    verifiedAt: "2026-10-06T10:31:15Z",
    revealedClaims: [
      "Program: B.Tech Computer Science & Engineering",
      "Issuer: RVS College of Engineering & Technology, Jamshedpur (JUT)",
      "Credential Status: ACTIVE",
    ],
    hiddenFields: [
      "Aadhaar Number",
      "Date of Birth",
      "Home Address",
      "Phone Number",
      "Individual Subject Marks & Roll Number",
    ],
    proofHash: "0x9f8e7d6c5b4a392817263544536271809f8e7d6c5b4a39281726354453627180",
    privacyNote: "PII NOT REVEALED",
  },
  {
    id: "vreq-2",
    requestId: "VR-KV-2026-00904",
    verifierName: "TechCorp Campus Recruitment Desk",
    verifierOrg: "Hiring Partner Verifier",
    targetHolderId: "student-shivam",
    studentName: "Shivam Soni",
    claimType: "achievement",
    claimLabel: "Smart India Hackathon 2026 — Winner",
    credentialId: "KV-ACH-2026-0042",
    status: "verified",
    createdAt: "2026-10-07T08:15:00Z",
    verifiedAt: "2026-10-07T08:16:02Z",
    revealedClaims: [
      "Achievement: Smart India Hackathon 2026 — Winner",
      "Category: Hackathon",
      "Issuer: RVSCET Jamshedpur",
    ],
    hiddenFields: [
      "Aadhaar Number",
      "Date of Birth",
      "Phone Number",
      "Full Academic Transcript",
    ],
    proofHash: "0x4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef01234",
    privacyNote: "FULL CERTIFICATE NOT REVEALED",
  },
  {
    id: "vreq-3",
    requestId: "VR-KV-2026-00918",
    verifierName: "AICTE Fellowship Portal",
    verifierOrg: "Eligibility Verifier",
    targetHolderId: "student-shivam",
    studentName: "Shivam Soni",
    claimType: "age",
    claimLabel: "Age ≥ 18",
    credentialId: "KV-ID-2024-000103",
    minimumAge: 18,
    status: "verified",
    createdAt: "2026-10-07T09:00:00Z",
    verifiedAt: "2026-10-07T09:00:45Z",
    revealedClaims: [
      "Age ≥ 18 requirement was satisfied",
      "Credential issuer (RVS College of Engineering and Technology, Jamshedpur)",
      "Credential validity/status (ACTIVE)",
    ],
    hiddenFields: [
      "Date of birth",
      "Aadhaar",
      "Address",
      "Phone number",
      "Student ID",
      "Full identity credential",
    ],
    proofHash: "0x7c8d9e0f1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5",
    privacyNote: "DOB NOT REVEALED",
  },
  {
    id: "vreq-4",
    requestId: "VR-KV-2026-00941",
    verifierName: "Jamshedpur Industrial Internship Board",
    verifierOrg: "Institutional Verifier",
    targetHolderId: "student-shivam",
    studentName: "Shivam Soni",
    claimType: "degree",
    claimLabel: "Verify Active B.Tech CSE Student Status",
    credentialId: "KV-RVSCET-2028-000124",
    status: "pending",
    createdAt: "2026-10-07T09:40:00Z",
    revealedClaims: [
      "Claim Requested: B.Tech CSE Student Status",
      "Issuer: RVSCET Jamshedpur",
    ],
    hiddenFields: [
      "Aadhaar Number",
      "Date of Birth",
      "Address",
      "Phone Number",
      "Semester Marks",
    ],
    privacyNote: "DOB NOT REVEALED",
  },
];

export const INITIAL_NOTIFICATIONS: VaultNotification[] = [
  {
    id: "notif-1",
    type: "verification",
    title: "Verification request received",
    message: "Jamshedpur Industrial Internship Board requested proof of B.Tech CSE status (VR-KV-2026-00941).",
    timestamp: "10 mins ago",
    read: false,
  },
  {
    id: "notif-2",
    type: "achievement",
    title: "Achievement received",
    message: "RVSCET Innovation Cell issued 'Smart India Hackathon 2026 — Winner' (KV-ACH-2026-0042).",
    timestamp: "2 hours ago",
    read: false,
  },
  {
    id: "notif-3",
    type: "semester",
    title: "Semester 2 Result verified on-chain",
    message: "Your JUT Semester 2 Grade Card (SGPA 8.82) anchor is active.",
    timestamp: "1 day ago",
    read: true,
  },
  {
    id: "notif-4",
    type: "credential",
    title: "Privacy proof generated",
    message: "Zero-Knowledge Age >= 18 proof verified without exposing your Date of Birth.",
    timestamp: "1 day ago",
    read: true,
  },
];
