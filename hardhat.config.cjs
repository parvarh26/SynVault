// hardhat.config.cjs
require("dotenv").config(); // Load .env variables
const { HardhatUserConfig } = require("hardhat/config");
const hardhatToolboxMochaEthersPlugin = require("@nomicfoundation/hardhat-toolbox-mocha-ethers");

/** @type {import('hardhat/config').HardhatUserConfig} */
const config = {
  plugins: [hardhatToolboxMochaEthersPlugin],

  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },

  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY],
    },
  },
};

module.exports = config;
