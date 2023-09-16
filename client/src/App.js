import './App.css';
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Wallet from "./artifacts/contracts/Wallet.sol/Wallet.json";
import circleImg from './img/circle.png';
import etherImg from './img/ether.png';
import flouImg from './img/flou.png';
import leftLineImg from './img/leftLine.png'
import rightLineImg from './img/rightLine.png'
const WalletAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
function App() {
  const [state, setState] = useState({contract : null,});
  const [balance, setBalance] = useState();
  const [error, setError] = useState('');

  useEffect(() => {
    console.log("useEffect");
    const connectWallet = async () => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          console.log("ethereum");
          await ethereum.request({
            method: "eth_requestAccounts",
          });
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(
            WalletAddress,
            Wallet.abi,
            signer
          );
          console.log("contract :" ,contract);
          setState({ contract });
          console.log(contract);
          fetchBalance(contract);
        }
      } catch (error) {
        console.log(error);
      }
    };
    connectWallet();
  }, []);


  const fetchBalance = async (contract) => {
    try {
      const _balance = await contract.getBalance();
      setBalance(_balance);
    } catch (err) {
      setError(err.message);
    }
  }

  const withdrawAll = async (contract) => {
    console.log("withdraw clicked");
    if (state.contract) {
      console.log("withdraw state.contract");
      try{
        const transaction = await state.contract.withdrawAll();
        transaction.wait();
        fetchBalance(state.contract);
      }
      catch (err) {
        setError(err.message);
      }
    }
  }
  const sendEth = async () => {
    if (state.contract) {
      try {
        const transaction = await state.contract.sendEth(10**17);
        await transaction.wait();
        fetchBalance(state.contract);
      } catch (err) {
        setError(err.message);
      }
    }
  }
  return (
    <div className="App">
      <div className="wallet noselect">ETHEREUM WALLET</div>
      <img className="leftLine" src={leftLineImg} alt="line" />
      <div className="greeting noselect">BONJOUR LEO</div>
      <img className="rightLine" src={rightLineImg} alt="line" />
      {error && <p>{error}</p>}
      <div className="logoContainer">
        <div className="logo">
          <img className="flou noselect" src={flouImg} alt="flou" />
          <img className="circle noselect" src={circleImg} alt="circle" />
          <img className="ether noselect" src={etherImg} alt="ether" />
        </div>
        <div className="ethAmount">{balance || 0} ETH</div>
      </div>
      <button onClick={sendEth} className="btn-send">DEPOSER DE L'ETHER</button>
      <button onClick={withdrawAll}className="btn-receive">RECUPERER DE L'ETHER</button>
    </div>
  );
}

export default App;
