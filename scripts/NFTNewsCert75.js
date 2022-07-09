const hre = require("hardhat");

async function main() {

  const BadgeToken = await hre.ethers.getContractFactory("NFTNewsCert");
  console.log('Deploying NFTNewsCert ERC721 token...');
  const token = await BadgeToken.deploy('NFTNewsCert75','NNC75');

  await token.deployed();
  console.log("NFTNewsCert75 deployed to:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });