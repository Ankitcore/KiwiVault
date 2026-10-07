const fs = require('fs');
const path = require('path');

const contracts = ['DegreeVerifier.sol', 'AgeVerifier.sol'];

contracts.forEach(contractFile => {
    const filePath = path.join(__dirname, 'contracts', contractFile);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        const newName = contractFile.replace('.sol', '');
        // Replace contract Groth16Verifier with contract DegreeVerifier
        content = content.replace(/contract Groth16Verifier/g, `contract ${newName}`);
        fs.writeFileSync(filePath, content);
        console.log(`Updated contract name in ${contractFile} to ${newName}`);
    }
});
