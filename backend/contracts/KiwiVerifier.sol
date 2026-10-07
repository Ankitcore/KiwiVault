// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CredentialRegistry.sol";

interface IDegreeVerifier {
    function verifyProof(
        uint[2] calldata _pA,
        uint[2][2] calldata _pB,
        uint[2] calldata _pC,
        uint[7] calldata _pubSignals
    ) external view returns (bool);
}

interface IAgeVerifier {
    function verifyProof(
        uint[2] calldata _pA,
        uint[2][2] calldata _pB,
        uint[2] calldata _pC,
        uint[7] calldata _pubSignals
    ) external view returns (bool);
}

contract KiwiVerifier {
    CredentialRegistry public registry;
    IDegreeVerifier public degreeVerifier;
    IAgeVerifier public ageVerifier;

    mapping(bytes32 => bool) public usedNullifiers;

    event ClaimVerified(bytes32 indexed nullifier, string claimType);

    constructor(
        address _registry,
        address _degreeVerifier,
        address _ageVerifier
    ) {
        registry = CredentialRegistry(_registry);
        degreeVerifier = IDegreeVerifier(_degreeVerifier);
        ageVerifier = IAgeVerifier(_ageVerifier);
    }

    /**
     * @notice Verify a degree claim
     * _pubSignals:
     * [0] = nullifier
     * [1] = issuerPubKeyAx
     * [2] = issuerPubKeyAy
     * [3] = merkleRoot
     * [4] = currentDate
     * [5] = verifierNonce
     * [6] = requiredDegree
     */
    function verifyDegreeClaim(
        uint[2] calldata _pA,
        uint[2][2] calldata _pB,
        uint[2] calldata _pC,
        uint[7] calldata _pubSignals
    ) external returns (bool) {
        bytes32 nullifier = bytes32(_pubSignals[0]);
        bytes32 merkleRoot = bytes32(_pubSignals[3]);
        uint256 currentDate = _pubSignals[4];

        require(!usedNullifiers[nullifier], "Nullifier already used");
        require(registry.isKnownRoot(merkleRoot), "Merkle root not found or expired");
        
        // In a real app we'd verify currentDate is roughly block.timestamp, 
        // but since dates are YYYYMMDD integers, we just trust the client for the demo 
        // or we'd convert block.timestamp to YYYYMMDD. For now, the circuit enforces expiry.

        require(degreeVerifier.verifyProof(_pA, _pB, _pC, _pubSignals), "Invalid ZK Proof");

        usedNullifiers[nullifier] = true;
        emit ClaimVerified(nullifier, "Degree");

        return true;
    }

    /**
     * @notice Verify an age claim
     * _pubSignals:
     * [0] = nullifier
     * [1] = issuerPubKeyAx
     * [2] = issuerPubKeyAy
     * [3] = merkleRoot
     * [4] = currentDate
     * [5] = verifierNonce
     * [6] = minimumAge
     */
    function verifyAgeClaim(
        uint[2] calldata _pA,
        uint[2][2] calldata _pB,
        uint[2] calldata _pC,
        uint[7] calldata _pubSignals
    ) external returns (bool) {
        bytes32 nullifier = bytes32(_pubSignals[0]);
        bytes32 merkleRoot = bytes32(_pubSignals[3]);

        require(!usedNullifiers[nullifier], "Nullifier already used");
        require(registry.isKnownRoot(merkleRoot), "Merkle root not found or expired");

        require(ageVerifier.verifyProof(_pA, _pB, _pC, _pubSignals), "Invalid ZK Proof");

        usedNullifiers[nullifier] = true;
        emit ClaimVerified(nullifier, "Age");

        return true;
    }
}
