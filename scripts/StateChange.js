const { ethers } = require("ethers")
const { Buffer } = require("buffer")
require("dotenv").config()
var fs = require("fs")

const contractJsonData = require("../artifacts/contracts/NFTNewsCert.sol/NFTNewsCert.json")
const contractAddress = require("./contractAddress.json").contractAddress
const privateKey =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" //hardhat dummy contract

const test = async () => {
  const url = "http://localhost:8545"
  let provider = new ethers.providers.JsonRpcProvider(url)
  let wallet = new ethers.Wallet(privateKey, provider)

  const Abi = contractJsonData.abi
  const Nft = new ethers.Contract(contractAddress, Abi, wallet)

  await Nft.setMintStatus(true)
  let ans = await Nft.getMintStatus()
  console.log("mintState", ans)
}
test()