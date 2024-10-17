// const ethers = require("ethers");
// const { ethers, upgrades } = require("@nomiclabs/buidler");
const { ethers } = require("hardhat");

// const ethers = hre.ethers;
const ALCHEMY_SEPOLIA_URL = "http://localhost:8545";

const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL)



async function main() {
  const contractAddress = "0x0B306BF915C4d645ff596e518fAf3F9669b97016";
  const privateKey = "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6";
  // const wallet2 = ethers.Wallet.createRandom();
  const wallet2 = new ethers.Wallet(privateKey, provider);

  const contractWithWallet2 = await ethers.getContractAt("Marketplace", contractAddress, wallet2);

  let tx1 = await contractWithWallet2.getMyNFTs();
  console.log(tx1);


  const price = ethers.parseEther("3");
  let tx2 = await contractWithWallet2.executeSale(1,{value:price});
  await tx2.wait();

  // console.log(contractWithWallet2)
  tx1 = await contractWithWallet2.getMyNFTs();
  console.log(tx1);


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});