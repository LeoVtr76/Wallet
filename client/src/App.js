import './App.css';
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { parseUnits, formatEther } from "ethers";
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
  const [showNameInput, setShowNameInput] = useState(false);
  const [userName, setUserName] = useState('');
  const [finalUserName, setFinalUserName] = useState('');
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  useEffect(() => {
    const connectWallet = async () => {
      try {
          const { ethereum } = window;
          if (ethereum) {
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
              setState({ contract });
              fetchBalance(contract);
              checkName(contract);
          }
        } catch (error) {
          console.log(error);
        }
    };
    const handleAccountsChanged = async (accounts) => {
        if (accounts.length === 0) {
            console.log('L\'utilisateur a déconnecté MetaMask');
        } else {
            console.log('Compte sélectionné par l\'utilisateur:', accounts[0]);
            if (state.contract) {
                fetchBalance(state.contract);
                checkName(state.contract);
            }
        }
    };
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
    connectWallet();
}, [state.contract]);
useEffect(() => {
  if (error) {
      setShowErrorPopup(true);
      // Cachez la pop-up après 3 secondes
      const timer = setTimeout(() => {
          setShowErrorPopup(false);
          setError(''); // Réinitialisez également l'erreur
      }, 3000);
      return () => clearTimeout(timer);
  }
}, [error]);
  const handleNameChange = (e) => {
    const value = e.target.value;
    if (value.length > 10) {
        setError("Le nom ne peut pas dépasser 10 caractères !");
    } else {
        setUserName(value);
        setError(''); 
    }
  }
  const checkName = async (contract) => {
    const name = await contract.getName();
    setFinalUserName(name);
    if (name === "") {
      setShowNameInput(true);
    } 
    else {
      setShowNameInput(false);
    }
  }
  const fetchBalance = async (contract) => {
    try {
      const _balance = await contract.getBalance();
      setBalance(formatEther(_balance));
    } catch (err) {
      const errorMessage = err.info.error.data.data.reason;
      setError(errorMessage);
    }
  }
  const setName = async () => {
    try {
        const transaction = await state.contract.setName(userName);
        await transaction.wait();
        setShowNameInput(false); // Cachez le champ d'entrée une fois que le nom est défini
        setFinalUserName(userName);
    } catch (err) {
      const errorMessage = err.info.error.data.data.reason;
      setError(errorMessage);
    }
  }
  const withdrawAll = async () => {
    if (state.contract) {
      try{
        const transaction = await state.contract.withdrawAll();
        await transaction.wait();
        fetchBalance(state.contract);
      }
      catch (err) {
        const errorMessage = err.info.error.data.data.reason;
        setError(errorMessage);
      }
    }
  }
  const sendEth = async () => {
    if (state.contract) {
      try {
        let overrides = {
          value: parseUnits("0.1", "ether"),
      };
        const transaction = await state.contract.sendEth(overrides);
        await transaction.wait();
        fetchBalance(state.contract);
      } catch (err) {
        const errorMessage = err.info.error.data.data.reason;
        setError(errorMessage);
      }
    }
  }
  return (
    <div className="App">
      <div className="wallet noselect">ETHEREUM WALLET</div>
      <img className="leftLine noselect" draggable="false" src={leftLineImg} alt="line" />
      <div className="greeting noselect">BONJOUR {finalUserName || "INCONNU"}</div>
      <img className="rightLine noselect" draggable="false" src={rightLineImg} alt="line" />
      <div className="logoContainer">
        <div className="logo">
          <img className="flou noselect" draggable="false" src={flouImg} alt="flou" />
          <img className="circle noselect" draggable="false" src={circleImg} alt="circle" />
          <img className="ether noselect" draggable="false" src={etherImg} alt="ether" />
        </div>
        <div className="ethAmount">{balance || 0} ETH</div>
        {
          showNameInput && (
            <div className="setName">
              <input type="text" value={userName} onChange={handleNameChange} placeholder="Enter your name" maxLength={10}/>
              <button onClick={setName}>SETNAME</button>
            </div>
          )
        }
      </div>
      <button onClick={sendEth} className="btn-send noselect">DEPOSER DE L'ETHER</button>
      <button onClick={withdrawAll}className="btn-receive noselect">RECUPERER DE L'ETHER</button>
      <div className={`error-popup ${showErrorPopup ? 'show-error' : ''}`}>
            {error}
      </div>
    </div>
  );
}
export default App;