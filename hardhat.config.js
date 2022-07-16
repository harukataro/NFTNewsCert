require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

const { ALCHEMY_KEY, ACCOUNT_PRIVATE_KEY, ETHERSCAN_API_KEY} = process.env;

module.exports = {
  solidity: "0.8.9",
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_KEY}`,
      accounts: [`0x${ACCOUNT_PRIVATE_KEY}`]
    },
    ethereum: {
      chainId: 1,
      url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
      accounts: [`0x${ACCOUNT_PRIVATE_KEY}`]
    },
  }
};
