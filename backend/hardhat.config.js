require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      blockGasLimit: 100000000,
      gas: 30000000
    },
    hardhat: {
      blockGasLimit: 100000000
    }
  }
};
