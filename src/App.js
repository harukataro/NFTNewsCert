import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Modal from './components/Modal'
import twitterLogo from './assets/svgviewer-output.svg'
import openseaLogo from './assets/opensea-logo.png'
import myNft from './utils/NFTNewsCert.json'
import './App.css';

const TWITTER_HANDLE = 'harukatarotaro';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = 'https://opensea.io/collection/nftnewscert76';
// const TOTAL_MINT_COUNT = 100;

//const CONTRACT_ADDRESS = "0xBCF3a2D0Ec7F39a346490e7C30163ddf6De6a268";
const CONTRACT_ADDRESS = require("./utils/contractAddress.json").contractAddress;
const ethScanContractURL = 'https://etherscan.io/address/' + CONTRACT_ADDRESS + '#writeContract';

const App = () => {
  let totalMinted = "?";
  const [currentAccount, setCurrentAccount] = useState("")
  const [miningAnimation, setMiningAnimation] = useState(false)
  const [mintTotal, setMintTotal] = useState(totalMinted)
  const [color, setColor] = useState("red")
  const [text, setText] = useState("")
  const [mintState, setMintState] = useState(false)

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!")
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
      console.log('window.ethereum.networkVersion', await ethereum.request({ method: 'net_version' }));
    }
    
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)
      setupEventListener()
      getNumberOfMinted()
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

  const getNumberOfMinted = async () => {
    // console.log("now getting number of minted")
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myNft.abi, signer);
    let count = await connectedContract.getNumberOfMinted();
    console.log("NumberOfMinted", count.toString())
    setMintTotal(count.toString())
    let state = await connectedContract.getMintStatus();
    console.log("mintState",state);
    setMintState(state)
  }

  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myNft.abi, signer);

        connectedContract.on("Mint", (from, color, signature) => {
          //console.log(from, color, signature)
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
      if(!mintState) return;
      try {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner()
          const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myNft.abi, signer)

          //pre check
          let isInLimit = await connectedContract.isInLimit()
          if(!isInLimit) {
            alert("You already minted upto limit")
            return;
          }
          let isMintable = await connectedContract.isMintableCombination(color, text)
          if(!isMintable) {
            alert("This combination is already used! Change color or Signature")
            return;
          }

          let nftTxn;
          const options = {value: ethers.utils.parseEther("0.003")}
          if(color === "pink"){
            nftTxn = await connectedContract.mintPink(text, options)
          }
          else if(color === "blue"){
            nftTxn = await connectedContract.mintBlue(text, options)
          }
          else if(color === "red"){
            nftTxn = await connectedContract.mintRed(text, options)
          }
          else if(color === "green"){
            nftTxn = await connectedContract.mintGreen(text, options)
          }
          else if(color === "yellow"){
            nftTxn = await connectedContract.mintYellow(text, options)
          }
          else if(color === "white"){
            nftTxn = await connectedContract.mintWhite(text, options)
          }
          console.log("Mining... please wait")
          setMiningAnimation(true);
          await nftTxn.wait()
          console.log(nftTxn)
          console.log(`Mined, tee transaction: https://etherscan.io/tx/${nftTxn.hash}`)
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
  })

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
      <select className="select-box"
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
      <input className="text-box" placeholder="input sign name" value={text} onChange={handleChange} type="text" />
      </p>
      {mintState?
        (<button onClick={askContractToMintNft} className="cta-button mint-button">
        Mint Now
        </button>
        ): (<p className="alert-text">Minting is closed</p>)
      }
    </div>
  )

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
          <p className="explain-text">
            100?????????????????????????????????????????????????????????NFT????????????????????????NFT????????????????????????????????????????????????????????????????</p>
          <p className="explain-text">????????????NFT??????????????????????????????Mint?????????????????????0.003ETH???bot??????????????????????????????????????????????????????????????????????????????????????????</p>
          {/* {currentAccount === "" ?renderNotConnectedContainer() :renderMintUI()} */}
          <p className="alert-text">Minting is closed</p>
          <p className="sub-text">
            {/* {mintTotal} of 100 NFTs minted. */}
            100 of 100 NFTs minted.
          </p>
          <a
            className="opensea-button"
            href={OPENSEA_LINK}
            target="_blank"
            rel="noreferrer"
          >
            <img src={openseaLogo} alt="opensea-logo" className="opensea-logo" />View on OpenSea</a>
          <p className="explain-text">
          mint?????????????????????????????????closed???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????Etherscan???????????????
          <br/><a href={ethScanContractURL} target="_blank" rel="noreferrer">??????????????????</a>
          </p>
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
