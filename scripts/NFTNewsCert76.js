const hre = require("hardhat");
const fs = require("fs");
const { artifacts } = require("hardhat");

async function main() {

  const BadgeToken = await hre.ethers.getContractFactory("NFTNewsCert");
  console.log('Deploying NFTNewsCert ERC721 token...');
  const token = await BadgeToken.deploy('NFTNewsCert76','NNC76');
  await token.deployed();
  console.log("Pay deployed to:", token.address)
  fs.writeFileSync(
    "scripts/contractAddress.json",
    '{"contractAddress": "' + token.address + '"}'
  )
  fs.writeFileSync(
    "src/utils/contractAddress.json",
    '{"contractAddress": "' + token.address + '"}'
  )
  fs.copyFileSync("artifacts/contracts/NFTNewsCert.sol/NFTNewsCert.json", "src/utils/NFTNewsCert.json")
  console.log("NFTNewsCert deployed to:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });