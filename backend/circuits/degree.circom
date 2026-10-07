pragma circom 2.1.6;

include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/eddsaposeidon.circom";
include "circomlib/circuits/comparators.circom";
include "circomlib/circuits/mux1.circom";

// Merkle Tree inclusion proof
template MerkleTreeChecker(levels) {
    signal input leaf;
    signal input root;
    signal input pathElements[levels];
    signal input pathIndices[levels];

    component poseidons[levels];
    component mux[levels];

    signal current[levels + 1];
    current[0] <== leaf;

    for (var i = 0; i < levels; i++) {
        poseidons[i] = Poseidon(2);
        mux[i] = MultiMux1(2);

        mux[i].c[0][0] <== current[i];
        mux[i].c[0][1] <== pathElements[i];

        mux[i].c[1][0] <== pathElements[i];
        mux[i].c[1][1] <== current[i];

        mux[i].s <== pathIndices[i];

        poseidons[i].inputs[0] <== mux[i].out[0];
        poseidons[i].inputs[1] <== mux[i].out[1];

        current[i + 1] <== poseidons[i].out;
    }

    root === current[levels];
}

template DegreeVerificationCircuit(levels) {
    // ----------------------------------------
    // PRIVATE INPUTS
    // ----------------------------------------
    signal input holderSecret;
    signal input dob;
    signal input degreeCode;
    signal input institutionId;
    signal input issuedAt;
    signal input expiry;
    signal input credentialSalt;

    // EdDSA Signature from Issuer
    signal input sigR8x;
    signal input sigR8y;
    signal input sigS;

    // Merkle Proof
    signal input pathElements[levels];
    signal input pathIndices[levels];

    // ----------------------------------------
    // PUBLIC INPUTS
    // ----------------------------------------
    signal input issuerPubKeyAx;
    signal input issuerPubKeyAy;
    signal input merkleRoot;
    signal input currentDate;
    signal input verifierNonce;
    signal input requiredDegree;

    // ----------------------------------------
    // OUTPUTS
    // ----------------------------------------
    signal output nullifier;

    // 1. Holder Binding (holderCommitment = Poseidon(holderSecret))
    component holderPoseidon = Poseidon(1);
    holderPoseidon.inputs[0] <== holderSecret;
    signal holderCommitment;
    holderCommitment <== holderPoseidon.out;

    // 2. Recompute credentialHash
    component credPoseidon = Poseidon(7);
    credPoseidon.inputs[0] <== holderCommitment;
    credPoseidon.inputs[1] <== dob;
    credPoseidon.inputs[2] <== degreeCode;
    credPoseidon.inputs[3] <== institutionId;
    credPoseidon.inputs[4] <== issuedAt;
    credPoseidon.inputs[5] <== expiry;
    credPoseidon.inputs[6] <== credentialSalt;
    signal credentialHash;
    credentialHash <== credPoseidon.out;

    // 3. Verify Issuer EdDSA Signature over credentialHash
    component eddsa = EdDSAPoseidonVerifier();
    eddsa.enabled <== 1;
    eddsa.Ax <== issuerPubKeyAx;
    eddsa.Ay <== issuerPubKeyAy;
    eddsa.S <== sigS;
    eddsa.R8x <== sigR8x;
    eddsa.R8y <== sigR8y;
    eddsa.M <== credentialHash;

    // 4. Verify Merkle Tree Inclusion (Not Revoked)
    component tree = MerkleTreeChecker(levels);
    tree.leaf <== credentialHash;
    tree.root <== merkleRoot;
    for (var i = 0; i < levels; i++) {
        tree.pathElements[i] <== pathElements[i];
        tree.pathIndices[i] <== pathIndices[i];
    }

    // 5. Claim Check: degreeCode == requiredDegree
    degreeCode === requiredDegree;

    // 6. Check Expiry (expiry > currentDate)
    // Use LessThan for 64-bit comparison (dates are usually uint256 but fit in 64 bits easily)
    component expiryCheck = LessThan(64);
    expiryCheck.in[0] <== currentDate;
    expiryCheck.in[1] <== expiry;
    expiryCheck.out === 1;

    // 7. Output Nullifier = Poseidon(holderSecret, verifierNonce)
    component nullifierPoseidon = Poseidon(2);
    nullifierPoseidon.inputs[0] <== holderSecret;
    nullifierPoseidon.inputs[1] <== verifierNonce;
    nullifier <== nullifierPoseidon.out;
}

// Instantiate with depth 16
component main {public [issuerPubKeyAx, issuerPubKeyAy, merkleRoot, currentDate, verifierNonce, requiredDegree]} = DegreeVerificationCircuit(16);
