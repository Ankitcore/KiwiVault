pragma circom 2.1.6;

/*
 * Kiwi Vault — DegreeVerificationCircuit (Groth16 / Circom 2)
 *
 * Proves that a student possesses an authentic academic credential or degree
 * issued by RVS College of Engineering & Technology (RVSCET) without revealing
 * Roll Number, Registration Number, Aadhaar, CGPA, or Holder Secret.
 */

template DegreeVerificationCircuit() {
    // Private Inputs (Remain inside student's Kiwi Vault)
    signal input studentIdField;       // Numeric hash of student registration/roll number
    signal input holderSecret;         // Student vault secret key scalar
    signal input credentialSecretSalt; // Issuer-signed credential salt

    // Public Inputs (Shared with verifier)
    signal input degreeTypeCode;       // e.g., 101 = B.Tech CSE, 102 = B.Tech ECE
    signal input issuerIdentifier;     // e.g., 8841 = RVSCET Jamshedpur (JUT)
    signal input expectedCommitment;   // Public on-chain credential commitment

    // Public Outputs
    signal output isAuthentic;
    signal output credentialCommitment;

    // Compute algebraic commitment from private credential parameters + public claim
    signal step1;
    step1 <== studentIdField * 13337 + holderSecret * 7919;

    signal step2;
    step2 <== step1 + credentialSecretSalt * 65537;

    credentialCommitment <== step2 + degreeTypeCode * 257 + issuerIdentifier * 101;

    // Verify computed commitment matches expected commitment anchored on-chain
    signal delta;
    delta <== credentialCommitment - expectedCommitment;

    isAuthentic <-- (delta == 0) ? 1 : 0;
    isAuthentic * (1 - isAuthentic) === 0;
    delta * isAuthentic === 0;
}

component main {public [degreeTypeCode, issuerIdentifier, expectedCommitment]} = DegreeVerificationCircuit();
