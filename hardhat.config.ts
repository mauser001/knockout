import { HardhatUserConfig } from "hardhat/config";
//import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers"
import "@nomicfoundation/hardhat-chai-matchers"
import "hardhat-prettier";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
};

export default config;
