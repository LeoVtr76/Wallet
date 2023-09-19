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
  const [errors, setErrors] = useState([]);
  const [showNameInput, setShowNameInput] = useState(false);
  const [userName, setUserName] = useState('');
  const [finalUserName, setFinalUserName] = useState('');

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

// UseEffect for Error
useEffect(() => {
    const errorContainer = document.querySelector('.error-container');
    if (errorContainer) {
        console.log("Position du error-container:", errorContainer.getBoundingClientRect());
    }
}, [errors]);

const ErrorHandler = (err) => {
  let errorMessage;
  if (err.info && err.info.error && err.info.error.code) {
      var code = err.info.error.code;
      if (code === 4001) {
          errorMessage = "La transaction a été annulée";
      } else if (code === -32603 && err.info.error.data && err.info.error.data.data && err.info.error.data.data.reason) {
          errorMessage = err.info.error.data.data.reason;
      } else {
          errorMessage = "Une erreur inconnue est survenue";
      }
      const newError = {
        id: Date.now(), // Utilisez le timestamp comme ID unique
        message: errorMessage,
        animation: 'slideIn'
      };
      setErrors(prevErrors => [newError, ...prevErrors]);
      const timeoutId = setTimeout(() => {
        closeErrorPopup(newError.id);
      }, 10000);
      newError.timeoutId = timeoutId;
  }
}

const closeErrorPopup = (id) => {
  const errorToClose = errors.find(error => error.id === id);

    // Si l'erreur a un timeout associé, annulez-le
  if (errorToClose && errorToClose.timeoutId) {
      clearTimeout(errorToClose.timeoutId);
  }
  setErrors(prevErrors => {
      return prevErrors.map(error => {
          if (error.id === id) {
              return { ...error, animation: 'slideOut' };
          }
          return error;
      });
  });

  // Supprimez l'erreur après l'animation
  setTimeout(() => {
      setErrors(prevErrors => prevErrors.filter(error => error.id !== id));
  }, 300);
}
  const handleNameChange = (e) => {
    const value = e.target.value;
    const maxvalue = 15;
    if (value.length > maxvalue) {
        setErrors(`Le nom ne peut pas dépasser ${maxvalue} caractères !`);
    } else {
        setUserName(value);
        closeErrorPopup();
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
      ErrorHandler(err);
    }
  }
  const setName = async () => {
    try {
        const transaction = await state.contract.setName(userName);
        await transaction.wait();
        setShowNameInput(false); // Cachez le champ d'entrée une fois que le nom est défini
        setFinalUserName(userName);
    } catch (err) {
      ErrorHandler(err);
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
        ErrorHandler(err);
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
        ErrorHandler(err);
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
      <div className="error-container">
        {errors.map((error) => (
          <div key={error.id} className={`error-popup ${error.animation}`}>
            <span>{error.message}</span>
            <button onClick={() => closeErrorPopup(error.id)}>X</button>
          </div>
          ))}
      </div>
    </div>
  );
}
export default App;