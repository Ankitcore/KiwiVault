const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("Starting deployment on network:", hre.network.name);

    // 1. Deploy Credential Registry
    const CredentialRegistry = await hre.ethers.getContractFactory("CredentialRegistry");
    const registry = await CredentialRegistry.deploy();
    await registry.waitForDeployment();
    const registryAddress = await registry.getAddress();
    console.log("CredentialRegistry deployed to:", registryAddress);

    // 2. Deploy Degree Verifier
    const DegreeVerifier = await hre.ethers.getContractFactory("DegreeVerifier");
    const degreeVerifier = await DegreeVerifier.deploy();
    await degreeVerifier.waitForDeployment();
    const degreeAddress = await degreeVerifier.getAddress();
    console.log("DegreeVerifier deployed to:", degreeAddress);

    // 3. Deploy Age Verifier
    const AgeVerifier = await hre.ethers.getContractFactory("AgeVerifier");
    const ageVerifier = await AgeVerifier.deploy();
    await ageVerifier.waitForDeployment();
    const ageAddress = await ageVerifier.getAddress();
    console.log("AgeVerifier deployed to:", ageAddress);

    // 4. Deploy Kiwi Verifier
    const KiwiVerifier = await hre.ethers.getContractFactory("KiwiVerifier");
    const kiwiVerifier = await KiwiVerifier.deploy(
        registryAddress,
        degreeAddress,
        ageAddress
    );
    await kiwiVerifier.waitForDeployment();
    const kiwiAddress = await kiwiVerifier.getAddress();
    console.log("KiwiVerifier deployed to:", kiwiAddress);

    // Write output to frontend config
    const output = {
        network: hre.network.name,
        CredentialRegistry: registryAddress,
        DegreeVerifier: degreeAddress,
        AgeVerifier: ageAddress,
        KiwiVerifier: kiwiAddress
    };

    const frontendConfigPath = path.join(__dirname, "../../frontend/config");
    if (!fs.existsSync(frontendConfigPath)) {
        fs.mkdirSync(frontendConfigPath, { recursive: true });
    }
    
    fs.writeFileSync(
        path.join(frontendConfigPath, "contracts.json"),
        JSON.stringify(output, null, 2)
    );
    
    console.log("\nAddresses written to frontend/config/contracts.json!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
