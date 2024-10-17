// require hre, { ethers } from "hardhat";
const hre = require("hardhat");
const ethers = hre.ethers;
const fs = require("fs");

// const { ethers } = require("ethers");

async function main() {

  const [wallet1] = await ethers.getSigners();

  const Mark = await ethers.getContractFactory("Marketplace",wallet1);
  console.log("wallet1 addr:" + wallet1.address);
  const contract = await Mark.deploy();
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  console.log("contract: "+contractAddress);

  const amount = ethers.parseEther("1");
  const price = ethers.parseEther("2");


  let tx = await contract.createToken(price,"bafkreiha5us27zzlido5ssorn7pxxyzmfyemzdcedkwo3oszvbxu7ahite",{ value: amount });
  receipt = await tx.wait();
  // tx = await contract.createToken(price,"",{ value: amount });
  // receipt = await tx.wait();
  tx = await contract.createToken(price,"bafkreicbsmhy2k4ophstvty6brdgwa7mwsrymocxhypq7v62246tgsdbcu",{ value: amount });
  receipt = await tx.wait();

  tx = await contract.createToken(price,"bafkreihchwuvkhhivpxew3xgxp3j2sb5iruirztr3s5wkyvzwz2xvvco3m",{ value: amount });
  receipt = await tx.wait();

  tx = await contract.createToken(price,"bafkreigbh6kt45fhpe5s62trjswjgh32fpgx3qkiulsimea3kouzvgo4ju",{ value: amount });
  receipt = await tx.wait();


  // console.log(receipt);

  let tx1 = await contract.getMyNFTs();
  console.log(tx1);


  const privateKey = "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6";
  const wallet2 = new ethers.Wallet(privateKey, wallet1.provider);

  const contractWithWallet2 = await ethers.getContractAt("Marketplace", contractAddress, wallet2);
  // const contractWithWallet2 = contract.connect(wallet2);

  tx1 = await contractWithWallet2.getMyNFTs();
  console.log(tx1);

/*
  const price3 = ethers.parseEther("3");
  let tx2 = await contractWithWallet2.executeSale(1,{value:price3});
  await tx2.wait();
  */

  // console.log(contractWithWallet2)
  tx1 = await contractWithWallet2.getMyNFTs();
  // console.log(tx1);

  console.log(contract.interface.format('json'))
  const data = {
    address: contractAddress,
    abi: contract.interface.format('json')
  }
  fs.writeFileSync('./Marketplace.json', JSON.stringify(data))


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});