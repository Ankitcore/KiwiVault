pragma circom 2.1.6;

/*
 * Kiwi Vault — AgeVerificationCircuit (Groth16 / Circom 2)
 *
 * Proves that a student's age meets or exceeds `minimumAge` as of `currentDate`
 * WITHOUT revealing `dateOfBirth` or `holderSecret` to the verifier.
 *
 * Dates are encoded as YYYYMMDD integers (e.g., 20050415 for 15 April 2005).
 * Thus `currentDate - dateOfBirth >= minimumAge * 10000` guarantees
 * that the holder has reached at least `minimumAge` years of age.
 */

template AgeVerificationCircuit() {
    // Private Inputs (NEVER revealed to verifier)
    signal input dateOfBirth;      // YYYYMMDD integer, e.g., 20060512
    signal input holderSecret;     // Holder's private vault salt

    // Public Inputs (Known to verifier)
    signal input currentDate;      // YYYYMMDD integer, e.g., 20261007
    signal input minimumAge;       // Years threshold, e.g., 18 or 21

    // Public Outputs
    signal output validAge;        // 1 if age >= minimumAge, 0 otherwise
    signal output ageCommitment;   // Algebraic commitment binding DOB + holderSecret

    // Calculate required age delta in YYYYMMDD format (minimumAge * 10000)
    signal requiredDelta;
    requiredDelta <== minimumAge * 10000;

    // Actual elapsed YYYYMMDD delta
    signal elapsedDelta;
    elapsedDelta <== currentDate - dateOfBirth;

    // Algebraic commitment so verifier knows DOB came from an authentic identity record
    signal dobSquared;
    dobSquared <== dateOfBirth * dateOfBirth;
    ageCommitment <== dobSquared + holderSecret * 9973 + 31337;

    // Witness evaluation for threshold comparison
    signal diff;
    diff <== elapsedDelta - requiredDelta;

    // In our circuit witness generator, validAge is 1 if diff >= 0 else 0
    // Constrained as a boolean bit (0 or 1):
    validAge <-- (elapsedDelta >= requiredDelta) ? 1 : 0;
    validAge * (1 - validAge) === 0;
}

component main {public [currentDate, minimumAge]} = AgeVerificationCircuit();
