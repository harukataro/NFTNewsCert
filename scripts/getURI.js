const address = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const token721 = await ethers.getContractAt("NFTNewsCert74", address);

const accounts = await hre.ethers.getSigners();
owner = accounts[0].address;
toAddress = accounts[1].address;

await token721.symbol()
await token721.mintTo(toAddress)
await token721.mintTo(toAddress)
await token721.mintTo(toAddress)
await token721.tokenURI(3)