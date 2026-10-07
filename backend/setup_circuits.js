const { execSync } = require('child_process');
const fs = require('fs');

const run = (cmd) => {
    console.log(`\n> ${cmd}`);
    execSync(cmd, { stdio: 'inherit' });
};

async function main() {
    // Generate PTau locally
    if (!fs.existsSync('pot14_final.ptau')) {
        console.log("Generating PTau locally...");
        run(`npx snarkjs powersoftau new bn128 14 pot14_0000.ptau -v`);
        run(`npx snarkjs powersoftau contribute pot14_0000.ptau pot14_0001.ptau --name="First contribution" -v -e="random"`);
        run(`npx snarkjs powersoftau prepare phase2 pot14_0001.ptau pot14_final.ptau -v`);
    }

    const circuits = ['degree', 'age'];
    
    if (!fs.existsSync('contracts')) fs.mkdirSync('contracts');

    for (const circuit of circuits) {
        console.log(`\n\n=== COMPILING ${circuit}.circom ===`);
        
        run(`.\\circom.exe circuits/${circuit}.circom --r1cs --wasm --sym -l ../node_modules -o .`);
        run(`npx snarkjs groth16 setup ${circuit}.r1cs pot14_final.ptau ${circuit}_0000.zkey`);
        run(`npx snarkjs zkey contribute ${circuit}_0000.zkey ${circuit}_final.zkey --name="First Contribution" -v -e="random_entropy_${circuit}"`);
        run(`npx snarkjs zkey export verificationkey ${circuit}_final.zkey ${circuit}_verification_key.json`);
        run(`npx snarkjs zkey export solidityverifier ${circuit}_final.zkey contracts/${circuit.charAt(0).toUpperCase() + circuit.slice(1)}Verifier.sol`);
    }

    console.log("\n=== ALL CIRCUITS COMPILED AND ZKEYS GENERATED ===");
}

main().catch(console.error);
