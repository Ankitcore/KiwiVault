// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CredentialRegistry
 * @notice Privacy-Preserving On-Chain Credential Registry for Kiwi Vault & RVSCET Jamshedpur.
 * @dev Strictly stores cryptographic credential commitments/hashes, issuer addresses, timestamps,
 *      and revocation states. NEVER stores Aadhaar, DOB, marks, names, or raw PII on-chain.
 */
contract CredentialRegistry {
    address public admin;

    enum Status {
        NONE,
        ACTIVE,
        REVOKED
    }

    struct CredentialRecord {
        string credentialId;
        bytes32 credentialHash;
        bytes32 zkCommitment;
        address issuer;
        uint256 issuedAt;
        uint256 revokedAt;
        Status status;
        string revocationReasonCode;
    }

    mapping(address => bool) public authorizedIssuers;
    mapping(string => CredentialRecord) private credentialsById;
    mapping(bytes32 => string) private hashToCredentialId;

    event IssuerAuthorized(address indexed issuer, bool status, uint256 timestamp);
    event CredentialIssued(
        string indexed credentialIdKey,
        string credentialId,
        bytes32 indexed credentialHash,
        bytes32 zkCommitment,
        address indexed issuer,
        uint256 issuedAt
    );
    event CredentialRevoked(
        string indexed credentialIdKey,
        string credentialId,
        bytes32 indexed credentialHash,
        address indexed revokedBy,
        string reasonCode,
        uint256 revokedAt
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "KiwiVault: caller is not admin");
        _;
    }

    modifier onlyAuthorizedIssuer() {
        require(
            authorizedIssuers[msg.sender] || msg.sender == admin,
            "KiwiVault: caller is not an authorized institution issuer"
        );
        _;
    }

    constructor() {
        admin = msg.sender;
        authorizedIssuers[msg.sender] = true;
        emit IssuerAuthorized(msg.sender, true, block.timestamp);
    }

    /**
     * @notice Authorize or deauthorize an institutional issuer address (e.g., RVSCET Registrar)
     */
    function setAuthorizedIssuer(address issuer, bool authorized) external onlyAdmin {
        require(issuer != address(0), "KiwiVault: zero address");
        authorizedIssuers[issuer] = authorized;
        emit IssuerAuthorized(issuer, authorized, block.timestamp);
    }

    /**
     * @notice Issues a new privacy-preserving credential anchor on-chain.
     * @param credentialId Deterministic Kiwi Vault ID (e.g., KV-RVSCET-2026-000184)
     * @param credentialHash Keccak256/Poseidon hash of off-chain credential metadata
     * @param zkCommitment Zero-knowledge commitment binding holder secret & claim attributes
     */
    function issueCredential(
        string calldata credentialId,
        bytes32 credentialHash,
        bytes32 zkCommitment
    ) external onlyAuthorizedIssuer {
        require(bytes(credentialId).length > 0, "KiwiVault: empty credentialId");
        require(credentialHash != bytes32(0), "KiwiVault: empty credentialHash");
        require(
            credentialsById[credentialId].status == Status.NONE,
            "KiwiVault: credentialId already registered"
        );

        credentialsById[credentialId] = CredentialRecord({
            credentialId: credentialId,
            credentialHash: credentialHash,
            zkCommitment: zkCommitment,
            issuer: msg.sender,
            issuedAt: block.timestamp,
            revokedAt: 0,
            status: Status.ACTIVE,
            revocationReasonCode: ""
        });

        hashToCredentialId[credentialHash] = credentialId;

        emit CredentialIssued(
            credentialId,
            credentialId,
            credentialHash,
            zkCommitment,
            msg.sender,
            block.timestamp
        );
    }

    /**
     * @notice Revokes an existing credential without deleting its audit trail.
     * @param credentialId The Kiwi Vault Credential ID to revoke
     * @param reasonCode Brief institutional reason for revocation
     */
    function revokeCredential(
        string calldata credentialId,
        string calldata reasonCode
    ) external onlyAuthorizedIssuer {
        CredentialRecord storage record = credentialsById[credentialId];
        require(record.status != Status.NONE, "KiwiVault: credential does not exist");
        require(record.status == Status.ACTIVE, "KiwiVault: credential already revoked");
        require(
            record.issuer == msg.sender || msg.sender == admin,
            "KiwiVault: only original issuer or admin can revoke"
        );

        record.status = Status.REVOKED;
        record.revokedAt = block.timestamp;
        record.revocationReasonCode = reasonCode;

        emit CredentialRevoked(
            credentialId,
            credentialId,
            record.credentialHash,
            msg.sender,
            reasonCode,
            block.timestamp
        );
    }

    /**
     * @notice Checks if a credential is currently active and valid.
     */
    function isValid(string calldata credentialId) external view returns (bool) {
        return credentialsById[credentialId].status == Status.ACTIVE;
    }

    /**
     * @notice Returns the issuing institution address for a credential.
     */
    function getIssuer(string calldata credentialId) external view returns (address) {
        return credentialsById[credentialId].issuer;
    }

    /**
     * @notice Returns full non-PII status metadata for a credential.
     */
    function getCredentialStatus(
        string calldata credentialId
    )
        external
        view
        returns (
            Status status,
            bytes32 credentialHash,
            bytes32 zkCommitment,
            address issuer,
            uint256 issuedAt,
            uint256 revokedAt,
            string memory revocationReasonCode
        )
    {
        CredentialRecord memory record = credentialsById[credentialId];
        return (
            record.status,
            record.credentialHash,
            record.zkCommitment,
            record.issuer,
            record.issuedAt,
            record.revokedAt,
            record.revocationReasonCode
        );
    }
}
