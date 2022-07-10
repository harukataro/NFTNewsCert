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
  await token721.setSwitch(true);
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    
    it("Should has the correct name and symbol ", async function () {
      expect(await token721.name()).to.equal(_name);
      expect(await token721.symbol()).to.equal(_symbol);
    });

    it("Should mint a token with token ID 1 & 2 to account1", async function () {
      await token721.connect(a1).mintRed("shibuya");
      expect(await token721.ownerOf(1)).to.equal(a1.address);
      expect(await token721.balanceOf(a1.address)).to.equal(1);      
    });

    it("Should output tokeURI", async function () {
      await token721.mintRed("shibuya");
      await token721.connect(a1).mintBlue("harajyuku");
      await token721.connect(a2).mintYellow("harajyuku");
      await token721.connect(a3).mintPink("harajyuku");
      await token721.connect(a4).mintWhite("harajyuku");
      await token721.connect(a5).mintGreen("harajyuku");
      let tokenURI = await token721.tokenURI(2);
      let metaData = Buffer.from(tokenURI.split(",")[1], 'base64').toString('ascii');
      //console.log(metaData);
      metaData = JSON.parse(metaData);
      console.log("name:", metaData.name);
      console.log("description:", metaData.description);
      console.log('attributes:', metaData.attributes);
      let image = metaData.image.split(",")[1];
      image = Buffer.from(image, 'base64').toString('ascii');
      //console.log("image:", image);
      fs.writeFileSync("test.svg", image);
    });

    it("max mint", async function () {
      await token721.setLimit(100);
      for(let i=0; i<20; i++){
        await token721.connect(a1).mintBlue("harajyuku");
        await token721.connect(a2).mintYellow("harajyuku");
        await token721.connect(a3).mintPink("harajyuku");
        await token721.connect(a4).mintWhite("harajyuku");
        await token721.connect(a5).mintGreen("harajyuku");
      }

      let tokenURI = await token721.tokenURI(50);
      let metaData = Buffer.from(tokenURI.split(",")[1], 'base64').toString('ascii');
      //console.log(metaData);
      metaData = JSON.parse(metaData);
      console.log("name:", metaData.name);
      console.log("description:", metaData.description);
      console.log('attributes:', metaData.attributes);
      let image = metaData.image.split(",")[1];
      image = Buffer.from(image, 'base64').toString('ascii');
      //console.log("image:", image);
      fs.writeFileSync("test2.svg", image);
    });

    it("Mint can not with switch off state", async function () {
      expect(await token721.getMintStatus()).to.equal(true);
      await token721.setSwitch(false);
      expect(await token721.getMintStatus()).to.equal(false);
      await expect(
        token721.connect(a1).mintBlue("harajyuku")
        ).to.be.revertedWith("Minting window is not open");
    });

    it("get Number of total mint", async function (){
      expect(await token721.getNumberOfMinted()).to.equal(0);
      await token721.connect(a1).mintBlue("harajyuku");
      await token721.connect(a2).mintYellow("harajyuku");
      await token721.connect(a3).mintPink("harajyuku");
      expect(await token721.getNumberOfMinted()).to.equal(3);
    });

    it("get revert if mint request over limit", async function (){
      await token721.connect(a1).mintBlue("harajyuku");
      await expect(
        token721.connect(a1).mintBlue("harajyuku")
        ).to.be.revertedWith("You reached mint limit");
    });

    it("get revert if mint request over limit of total", async function (){
      await token721.setLimit(100);
      for(let i=0; i<100; i++){
        await token721.connect(a1).mintBlue("harajyuku");
      }
      await expect(
        token721.connect(a2).mintBlue("harajyuku")
        ).to.be.revertedWith("Token amount is full");
    });

  });
});