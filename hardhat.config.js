require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545", // BSC testnet endpoint
      chainId: 97, // BSC testnet chain ID
      accounts: {
        mnemonic: process.env.ACCOUNT_PRIVATE_KEY, // Your metamask mnemonic
      },
    },
  },
};
