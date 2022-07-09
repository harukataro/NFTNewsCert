import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Modal from './components/Modal'
import twitterLogo from './assets/svgviewer-output.svg'
import openseaLogo from './assets/opensea-logo.png'
import myNft from './utils/NFTNewsCert.json'
import './App.css';

const TWITTER_HANDLE = 'harukatarotaro';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = 'https://testnets.opensea.io/collection/nftnewscert75';
const TOTAL_MINT_COUNT = 100;

const CONTRACT_ADDRESS = "0x93c01833a03e3ac5F4352254beD98f49467d2dE6";

const App = () => {
  let totalMinted
  const [currentAccount, setCurrentAccount] = useState("")
  const [miningAnimation, setMiningAnimation] = useState(false)
  const [mintTotal, setMintTotal] = useState(totalMinted)
  const [currentNetwork, setCurrentNetwork] = useState("")
  const [color, setColor] = useState("red")
  const [text, setText] = useState("")

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!")
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
      console.log(window.ethereum.networkVersion, 'window.ethereum.networkVersion');
    }
    
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)
      setupEventListener()
    } else {
      console.log("No authorized account found")
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get Metamask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      
      console.log("Connected", accounts[0])
      setCurrentAccount(accounts[0])

      setupEventListener()
    } catch (error) {
      console.log(error)
    }
  }

  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myNft.abi, signer);

        connectedContract.on("NewCertificationNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        })
        console.log("Setup event listener!")
      } else {
        console.log("Ethereum object doesn't exist")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {
      try {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner()
          const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myNft.abi, signer)

          // console.log("Going to pop wallet now to pay gas...")
          let nftTxn;
          if(color === "pink"){
            nftTxn = await connectedContract.mintPink(text)
          }
          else if(color === "blue"){
            nftTxn = await connectedContract.mintBlue(text)
          }
          else if(color === "red"){
            nftTxn = await connectedContract.mintRed(text)
          }
          else if(color === "green"){
            nftTxn = await connectedContract.mintGreen(text)
          }
          else if(color === "yellow"){
            nftTxn = await connectedContract.mintYellow(text)
          }
          else if(color === "white"){
            nftTxn = await connectedContract.mintWhite(text)
          }
          console.log("Mining... please wait")
          setMiningAnimation(true);
          await nftTxn.wait()
          console.log(nftTxn)
          console.log(`Mined, tee transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`)
          setMiningAnimation(false)
        } else {
          console.log("Ethereum object doesn't exist")
        }
      } catch (error) {
        console.log(error)
      }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
    getNumberOfMinted()
  }, [])

  const handleChange = (e) => {
    setText(() => e.target.value)
  }

  const handleChangeSelect = (e) => {
    setColor(() => e.target.value)
  }

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  const renderMintUI = () => (
    <div>
      <p className="sub-text">  
      <select class="select-box"
          placeholder="select color"
          value={color}
          onChange={ (e) => handleChangeSelect(e)}>
        <option value="red">red</option>
        <option value="blue">blue</option>
        <option value="yellow">yellow</option>
        <option value="white">white</option>
        <option value="pink">pink</option>
        <option value="green">green</option>
      </select>
      </p>
      <p className="sub-text">
      <input class="text-box" placeholder="input sign name" value={text} onChange={handleChange} type="text" />
      </p>
      <button onClick={askContractToMintNft} className="cta-button mint-button">
      Mint Now
      </button>
    </div>
  )

  const renderNetworkPrompt = () => (
    alert("Hello there, This app is built on the rinkeby testnet and it looks like you are on a different ethereum network. Please switch to the Rinkeby testnet to continue")
  )

  const getNumberOfMinted = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myNft.abi, signer);
    
    let count = await connectedContract.getNumberOfMinted()
    setMintTotal(count._hex.substring(3))
    console.log(count._hex.substring(3))
  }

  return (
    <div className="App">
      {
        miningAnimation ? (
          <Modal />
        ) : null
      }
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">NFT News Reading Certification</p>
          <p className="sub-text">
            Get Reading Certification on Web3!
          </p>
          {/* <p className="sub-text">
            {mintTotal}/100 NFTs minted.
          </p> */}
          {currentAccount === "" ?renderNotConnectedContainer() :renderMintUI()}
          <p className="explain-text">
            あなたのオリジナルな購読証明を発行しよう<p/>色とサイン名を入力しMint<p/>フルオンチェーンNFT with YOU!
          </p>
          <a
            className="opensea-button"
            href={OPENSEA_LINK}
            target="_blank"
            rel="noreferrer"
          >
            <img src={openseaLogo} alt="opensea-logo" className="opensea-logo" />View on OpenSea</a>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{'haruxx'}</a>
          {/* {currentAccount !== "" ?
            (<text className='footer-text' onClick={DisconnectWallet}>disconnect wallet</text>)
            :
            ("...")
          } */}
          <div className="circleL1"></div>
          <div className="circleL2"></div>
          <div className="circleL3"></div>
          <div className="circleR1"></div>
          <div className="circleR2"></div>
          <div className="circleR3"></div>
        </div>
      </div>
    </div>
  );
}

export default App;
