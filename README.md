
# NFT News Certification

full onchain nft contract and frontend on Github pages. you can reuse this.

## setup

``` zsh
yarn install
```

create .env file for deployment

```zsh
ALCHEMY_KEY=<YOUR_KEY>
ACCOUNT_PRIVATE_KEY=<YOUR_KEY>
ETHERSCAN_API_KEY=<YOUR_KEY>
```

## testing commands

### hardhat test execution

```zsh
yarn hardhat test
```

### local deploy and check through frontend

```zsh
yarn hardhat node
yarn hardhat run scripts/NFTNewsCert76.js --network localhost
yarn hardhat run scripts/StateChange.js --network localhost
yarn run start
```

### rinkeby deploy

check through github page deployed frontend

```zsh
yarn hardhat run scripts/NFTNewsCert76.js --network rinkeby
yarn run deploy
yarn hardhat verify --network rinkeby --constructor-args scripts/arguments.js [DEPLOYED_CONTRACT_ADDRESS]
```

**Change mint status on at Etherscan.**
<https://rinkeby.etherscan.io/addres/DEPLOYED_CONTRACT_ADDRESS#code>

connect with deployed wallet with Etherscan then execute setMintStatus with true.

**open your github pages.**
<https://GITHUB_ID.github.io/YOUR_REPO_NAME/>

(you need setup github pages. YourRepo -> Setting -> pages: Source main: /doc)

**try mint with your rinkeby wallet.**

check opensea testnet. When mint nft, create your collection page automatically.below
 are example.
 <https://testnets.opensea.io/collection/nftnewscert76>

 for testing if you deploy same name collection multiple, opensea add extension automatically.
 this case, check there
 <https://testnets.opensea.io/collection/nftnewscert76-v2>

## deploy to mainnet

```zsh
yarn hardhat run scripts/NFTNewsCert76.js --network ethereum
yarn hardhat verify --network ethereum --constructor-args scripts/arguments.js [DEPLOYED_CONTRACT_ADDRESS]
yarn run deploy
```

enjoy!
