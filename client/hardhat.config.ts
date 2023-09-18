import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

require('dotenv').config()

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  paths : {
  artifacts :  './src/artifacts' },
  networks : {
    maticTest:{
      url : `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts : [process.env.WALLET_PRIVATE_KEY||""]
    },
    ganache: {
      url: "http://127.0.0.1:7545",
      chainId: 1337,
      accounts: [
        `0xa459ab146902b9fdb29f7702dbc60f9680f9dba10b3cf4c1b0c886945d4fe0c6`,
      ],
    },
  }
};

export default config;
