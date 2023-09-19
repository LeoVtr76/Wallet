import './App.css';
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { parseUnits, formatEther } from "ethers";
import Wallet from "./artifacts/contracts/Wallet.sol/Wallet.json";
import circleImg from './assets/img/circle.png';
import etherImg from './assets/img/ether.png';
import flouImg from './assets/img/flou.png';
import leftLineImg from './assets/img/leftLine.png'
import rightLineImg from './assets/img/rightLine.png'
//Components 
import ErrorPopup from './components/ErrorPopup';

const WalletAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
function App() {
  const [state, setState] = useState({contract : null,});
  const [balance, setBalance] = useState();
  const [showNameInput, setShowNameInput] = useState(false);
  const [userName, setUserName] = useState('');
  const [finalUserName, setFinalUserName] = useState('');
  const [currentError, setCurrentError] = useState({});

  useEffect(() => {
    let isMounted = true; 
    const connectWallet = async () => {
      try {
          const { ethereum } = window;
          if (!ethereum) {
            setCurrentError({localCode : "ERR003", localMessage : "MetaMask n'est pas installé!", notClosable : true});
            return; // Sortez de la fonction si MetaMask n'est pas installé
          }
          await ethereum.request({method: "eth_requestAccounts"});
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(
              WalletAddress,
              Wallet.abi,
              signer
          );
          if(isMounted){
            setState({ contract });
            fetchBalance(contract);
            checkName(contract);
          }
      } catch (error) {
        console.log("Error in connectWaller" ,error);
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
    return () => {
      isMounted = false;
      if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged); // Supprimez l'écouteur
      }
    };
  }, [state.contract]);
  const handleNameChange = (e) => {
    const value = e.target.value;
    const maxvalue = 16;
    if (value.length >= maxvalue) {
      setCurrentError({localCode : "ERR002", localMessage :`Le nom ne peut pas dépasser ${maxvalue} caractères !`});
    } else {
      setUserName(value);
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
      setCurrentError(err);
      console.log("error from checkName");
    }
  }
  const setName = async () => {
    try {
        const transaction = await state.contract.setName(userName);
        await transaction.wait();
        setShowNameInput(false); // Cachez le champ d'entrée une fois que le nom est défini
        setFinalUserName(userName);
    } catch (err) {
      setCurrentError(err);
      console.log(`error from setName`);
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
        setCurrentError(err);
        console.log("Error from whithdrawAll");
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
        setCurrentError(err);
        console.log("Error from sendEth");
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
        <div className="ethAmount">{balance === "0.0" ? "0" : balance || 0} ETH</div>
        {
          showNameInput && (
            <div className="setName">
              <input type="text" value={userName} onChange={handleNameChange} placeholder="Entrez un nom d'utilisateur" maxLength={16}/>
              <button onClick={setName}>Valider</button>
            </div>
          )
        }
      </div>
      <button onClick={sendEth} className="btn-send noselect">DEPOSER DE L'ETHER</button>
      <button onClick={withdrawAll}className="btn-receive noselect">RECUPERER DE L'ETHER</button>
      <ErrorPopup error={currentError} />
    </div>
  );
}
export default App;