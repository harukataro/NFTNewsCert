
# NFT News Certification

full onchain nft contract and frontend on Github pages. you can reuse this.

## setup

''' yarn install '''

## testing commands

### hardhat test execution

''' yarn hardhat test '''

### local deploy and check through frontend

'''
yarn hardhat node
yarn hardhat run scripts/NFTNewsCert76.js --network localhost
yarn hardhat run scripts/StateChange.js --network localhost
yarn run start
'''

### rinkeby deploy and check through github page deployed frontend

'''
yarn hardhat run scripts/NFTNewsCert76.js --network rinkeby
yarn run deploy
yarn hardhat verify --network rinkeby --constructor-args scripts/arguments.js [DEPLOYED_CONTRACT_ADDRESS]
'''
Change mint status on at Etherscan.
<https://rinkeby.etherscan.io/addres/DEPLOYED_CONTRACT_ADDRESS#code>
connect with deployed wallet with Etherscan then
execute setMintStatus with true

then open your github pages.
<https://GITHUB_ID.github.io/YOUR_REPO_NAME/>
(before this, you need setup github pages. YourRepo -> Setting -> pages: Source main: /doc)

try mint with your rinkeby wallet.

check opensea testnet. When mint nft, create your collection page automatically.below
 are example.
 <https://testnets.opensea.io/collection/nftnewscert76>

 for testing if you deploy same name collection multiple, opensea add extension automatically.
 this case, check there
 <https://testnets.opensea.io/collection/nftnewscert76-v2>

## deploy to mainnet

'''
yarn hardhat run scripts/NFTNewsCert76.js --network ethereum
yarn hardhat verify --network ethereum --constructor-args scripts/arguments.js [DEPLOYED_CONTRACT_ADDRESS]
yarn run deploy
'''
