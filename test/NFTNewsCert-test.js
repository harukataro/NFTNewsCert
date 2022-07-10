/* eslint-disable no-undef */
const { expect } = require("chai");
var fs = require("fs");

describe("NFTNewsCert contract", function () {
  let BadgeToken;
  let token721;
  let _name='NFTNewsCert74';
  let _symbol='NNC74';
  let a1, a2, a3,a4, a5, otherAccounts;

  beforeEach(async function () {
  BadgeToken = await ethers.getContractFactory("NFTNewsCert");
  [owner, a1, a2, a3, a4, a5, ...otherAccounts] = await ethers.getSigners();

  token721 = await BadgeToken.deploy(_name,_symbol);
  await token721.setMintStatus(true);
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    
    it("Should has the correct name and symbol ", async function () {
      expect(await token721.name()).to.equal(_name);
      expect(await token721.symbol()).to.equal(_symbol);
    });

    it("Should mint a token by account1", async function () {
      const options = {value: ethers.utils.parseEther("0.005")}
      await token721.connect(a1).mintRed("shibuya", options);
      expect(await token721.ownerOf(1)).to.equal(a1.address);
      expect(await token721.balanceOf(a1.address)).to.equal(1);      
    });

    it("Should not mint with fewer pay", async function () {
      const options = {value: ethers.utils.parseEther("0.004")}
      await expect(
        token721.connect(a1).mintBlue("harajyuku",options)
        ).to.be.revertedWith("Ether value sent is not correct");     
    });

    it("Should output tokeURI", async function () {
      const options = {value: ethers.utils.parseEther("0.005")}
      await token721.mintRed("shibuya", options);
      await token721.connect(a1).mintBlue("harajyuku", options);
      await token721.connect(a2).mintYellow("harajyuku", options);
      await token721.connect(a3).mintPink("harajyuku", options);
      await token721.connect(a4).mintWhite("harajyuku", options);
      await token721.connect(a5).mintGreen("harajyuku", options);
      let tokenURI = await token721.tokenURI(2);
      let metaData = Buffer.from(tokenURI.split(",")[1], 'base64').toString('ascii');
      //console.log(metaData);
      metaData = JSON.parse(metaData);
      expect(metaData.name).to.equal("NFTNewsCertification #2");
      expect(metaData.description).to.equal("NFT News Reading Certification.");
      expect(metaData.attributes[0].trait_type).to.equal("Color");
      expect(metaData.attributes[0].value).to.equal("blue");
      let image = metaData.image.split(",")[1];
      image = Buffer.from(image, 'base64').toString('ascii');
      //console.log("image:", image);
      fs.writeFileSync("test.svg", image);
    });

    it("Should acccept upto number of max mint", async function () {
      await token721.setLimit(100);
      for(let i=0; i<20; i++){
        const options = {value: ethers.utils.parseEther("0.050")}
        await token721.connect(a1).mintBlue("harajyuku", options);
        await token721.connect(a2).mintYellow("harajyuku", options);
        await token721.connect(a3).mintPink("harajyuku", options);
        await token721.connect(a4).mintWhite("harajyuku", options);
        await token721.connect(a5).mintGreen("harajyuku", options);
      }
      let tokenURI = await token721.tokenURI(50);
      let metaData = Buffer.from(tokenURI.split(",")[1], 'base64').toString('ascii');
      //console.log(metaData);
      metaData = JSON.parse(metaData);
      let image = metaData.image.split(",")[1];
      image = Buffer.from(image, 'base64').toString('ascii');
      //console.log("image:", image);
      fs.writeFileSync("test2.svg", image);
    });

    it("Mint can not with switch off state", async function () {
      expect(await token721.getMintStatus()).to.equal(true);
      await token721.setMintStatus(false);
      expect(await token721.getMintStatus()).to.equal(false);
      await expect(
        token721.connect(a1).mintBlue("harajyuku")
        ).to.be.revertedWith("Minting window is not open");
    });

    it("get Number of total mint", async function (){
      const options = {value: ethers.utils.parseEther("0.005")}
      expect(await token721.getNumberOfMinted()).to.equal(0);
      await token721.connect(a1).mintBlue("harajyuku", options);
      await token721.connect(a2).mintYellow("harajyuku", options);
      await token721.connect(a3).mintPink("harajyuku", options);
      expect(await token721.getNumberOfMinted()).to.equal(3);
    });

    it("get revert if mint request over limit", async function (){
      const options = {value: ethers.utils.parseEther("0.005")}
      await token721.connect(a1).mintBlue("harajyuku",options);
      await expect(
        token721.connect(a1).mintBlue("harajyuku",options)
        ).to.be.revertedWith("You reached mint limit");
    });

    it("get revert if mint request over limit of total", async function (){
      const options = {value: ethers.utils.parseEther("0.005")}
      await token721.setLimit(100);
      for(let i=0; i<100; i++){
        await token721.connect(a1).mintBlue("harajyuku",options);
      }
      await expect(
        token721.connect(a2).mintBlue("harajyuku",options)
        ).to.be.revertedWith("Token amount is full");
    });

    it("can update signature", async function (){
      const options = {value: ethers.utils.parseEther("0.005")}
      token721.connect(a1).mintBlue("1st name",options);
      expect(await token721.connect(a1).getSignature(1)).to.equal("1st name");
      await token721.connect(a1).setSignature(1, "2nd name");
      expect(await token721.connect(a1).getSignature(1)).to.equal("2nd name");
    });

  });
});