const hre = require("hardhat");

async function main() {

  const BadgeToken = await hre.ethers.getContractFactory("NFTNewsCert74");
  console.log('Deploying NFTNewsCert74 ERC721 token...');
  const token = await BadgeToken.deploy('NFTNewsCert74','NNC74');

  await token.deployed();
  console.log("NFTNewsCert74 deployed to:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });