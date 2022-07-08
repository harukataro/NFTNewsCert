const { expect } = require("chai");
var fs = require("fs");

describe("NFTNewsCert contract", function () {
  let BadgeToken;
  let token721;
  let _name='NFTNewsCert74';
  let _symbol='NNC74';
  let account1,otherAccounts;

  beforeEach(async function () {
  BadgeToken = await ethers.getContractFactory("NFTNewsCert");
  [owner, account1, ...otherAccounts] = await ethers.getSigners();

  token721 = await BadgeToken.deploy(_name,_symbol);
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {

    it("Should has the correct name and symbol ", async function () {
      expect(await token721.name()).to.equal(_name);
      expect(await token721.symbol()).to.equal(_symbol);
    });

    it("Should mint a token with token ID 1 & 2 to account1", async function () {
      let address1 = account1.address;
      await token721.connect(account1).mintRed("shibuya");
      expect(await token721.ownerOf(1)).to.equal(address1);
      expect(await token721.balanceOf(address1)).to.equal(1);      
    });

    it("Should output tokeURI", async function () {
      const address1=account1.address;
      await token721.mintRed("shibuya");
      let tokenURI = await token721.tokenURI(1);
      console.log("tokenURI",tokenURI);
      let metaData = Buffer.from(tokenURI.split(",")[1], 'base64').toString('ascii');
      metaData = JSON.parse(metaData);
      console.log("name:", metaData.name);
      console.log("description:", metaData.description);
      let image = metaData.image.split(",")[1];
      image = Buffer.from(image, 'base64').toString('ascii');
      console.log("image:", image);
      fs.writeFileSync("test.svg", image);
    });


  });
});