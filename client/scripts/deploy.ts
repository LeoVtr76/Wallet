import { ethers } from "hardhat";

async function main() {
  const Wallet = await ethers.deployContract("Wallet", [], {})
  await Wallet.waitForDeployment();

  console.log(`Wallet deployed to ${Wallet.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

