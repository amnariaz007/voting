require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    holesky: {
      url: "https://ethereum-holesky.publicnode.com",
      accounts: ["0x10f9897e12c358a28284fbcf1bd4747617c120e82adea55cf0df0b8ed140744c"]
    }
  },
  etherscan: {
    apiKey: {
      holesky: "YourEtherscanAPIKey" // You can get this from etherscan.io
    }
  }
};