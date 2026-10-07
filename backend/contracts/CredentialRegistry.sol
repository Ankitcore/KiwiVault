// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CredentialRegistry {
    address public admin;

    mapping(address => bool) public authorizedIssuers;
    
    // Ring buffer of the last 30 valid Merkle Roots
    bytes32[30] public recentRoots;
    uint256 public rootIndex;
    
    mapping(bytes32 => bool) public isKnownRoot;

    event IssuerAdded(address indexed issuer, bool status, uint256 timestamp);
    event RootUpdated(bytes32 indexed newRoot, address indexed issuer, uint256 timestamp);
    event CredentialRevoked(bytes32 indexed newRoot);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    modifier onlyAuthorizedIssuer() {
        require(authorizedIssuers[msg.sender] || msg.sender == admin, "Not an authorized issuer");
        _;
    }

    constructor() {
        admin = msg.sender;
        authorizedIssuers[msg.sender] = true;
        emit IssuerAdded(msg.sender, true, block.timestamp);
    }

    function setAuthorizedIssuer(address issuer, bool authorized) external onlyAdmin {
        require(issuer != address(0), "Zero address");
        authorizedIssuers[issuer] = authorized;
        emit IssuerAdded(issuer, authorized, block.timestamp);
    }

    function updateRoot(bytes32 newRoot) external onlyAuthorizedIssuer {
        require(newRoot != bytes32(0), "Zero root");
        
        // Remove the oldest root from the known mapping
        bytes32 oldestRoot = recentRoots[rootIndex];
        if (oldestRoot != bytes32(0)) {
            isKnownRoot[oldestRoot] = false;
        }

        // Add the new root
        recentRoots[rootIndex] = newRoot;
        isKnownRoot[newRoot] = true;
        
        rootIndex = (rootIndex + 1) % 30;

        emit RootUpdated(newRoot, msg.sender, block.timestamp);
    }

    // A revocation is just a root update where a leaf was removed from the off-chain tree
    function revokeCredential(bytes32 newRoot) external onlyAuthorizedIssuer {
        require(newRoot != bytes32(0), "Zero root");
        
        bytes32 oldestRoot = recentRoots[rootIndex];
        if (oldestRoot != bytes32(0)) {
            isKnownRoot[oldestRoot] = false;
        }

        recentRoots[rootIndex] = newRoot;
        isKnownRoot[newRoot] = true;
        
        rootIndex = (rootIndex + 1) % 30;

        emit CredentialRevoked(newRoot);
        emit RootUpdated(newRoot, msg.sender, block.timestamp);
    }
}
