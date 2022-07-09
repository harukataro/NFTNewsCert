

const test = async () => {
    const address = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    const token721 = await ethers.getContractAt("NFTNewsCert", address);

    const accounts = await hre.ethers.getSigners();
    owner = accounts[0].address;
    a1 = accounts[1].address;

    await token721.symbol()
    await token721.mintBlue("taro")
    await token721.mintRed("Mika")
    await token721.mintYellow("Sora")
    const tokenURI = await token721.tokenURI(3)
    let metaData = Buffer.from(tokenURI.split(",")[1], 'base64').toString('ascii');
    console.log(metaData);
    metaData = JSON.parse(metaData);
    console.log("name:", metaData.name);
    console.log("description:", metaData.description);
    console.log('attributes:', metaData.attributes);
    let image = metaData.image.split(",")[1];
    image = Buffer.from(image, 'base64').toString('ascii');
    console.log("image:", image);
}
test()