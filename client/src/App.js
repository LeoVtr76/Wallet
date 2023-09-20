import "./App.css";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { parseUnits, formatEther } from "ethers";
import Wallet from "./artifacts/contracts/Wallet.sol/Wallet.json";
import circleImg from "./assets/img/circle.png";
import etherImg from "./assets/img/ether.png";
import flouImg from "./assets/img/flou.png";
import leftLineImg from "./assets/img/leftLine.png";
import rightLineImg from "./assets/img/rightLine.png";
//Components
import ErrorPopup from "./components/ErrorPopup";
import SetName from "./components/SetName";
import BalanceDisplay from "./components/BalanceDisplay";
import { useAccount } from "./context/Account";

const WalletAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

function App() {
  const [state, setState] = useState({ contract: null });
  const [finalUserName, setFinalUserName] = useState("");
  const [currentError, setCurrentError] = useState({});
  const [isMounted, setIsMounted] = useState(true);
  const [useName, setUseName] = useState();
  const [useBalance, setUseBalance] = useState(false);
  const [currentAccount, setCurrentAccount] = useState();

  const { isConnected, setIsConnected, balance } = useAccount();

  useEffect(() => {
    const connectWallet = async () => {
      try {
        const { ethereum } = window;
        if (!ethereum) {
          setCurrentError({
            localCode: "ERR003",
            localMessage: "MetaMask n'est pas installé!",
            notClosable: true,
          });
          return; // Sortez de la fonction si MetaMask n'est pas installé
        }
        await ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(WalletAddress, Wallet.abi, signer);
        if (isMounted) {
          console.log("isMounted");
          setState({ contract });
          setUseBalance(true);
          //fetchBalance(contract);
          setUseName(true);
        }
      } catch (error) {
        console.log("Error in connectWaller", error);
      }
    };
    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        console.log("L'utilisateur a déconnecté MetaMask");
      } else {
        console.log("Compte sélectionné par l'utilisateur:", accounts[0]);
        setCurrentAccount(accounts[0]);
        setIsMounted(true);
        connectWallet();
      }
    };
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }
    connectWallet();
    return () => {
      setIsMounted(false);
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        ); // Supprimez l'écouteur
      }
    };
  }, [state.contract, currentAccount]);

  const withdrawAll = async () => {
    if (state.contract) {
      try {
        const transaction = await state.contract.withdrawAll();
        await transaction.wait();
        setUseBalance(true);
        //fetchBalance(state.contract);
      } catch (err) {
        setCurrentError(err);
        console.log("Error from whithdrawAll");
      }
    }
  };
  const sendEth = async () => {
    if (state.contract) {
      try {
        let overrides = {
          value: parseUnits("0.1", "ether"),
        };
        const transaction = await state.contract.sendEth(overrides);
        await transaction.wait();
        setUseBalance(true);

        //fetchBalance(state.contract);
      } catch (err) {
        setCurrentError(err);
        console.log("Error from sendEth");
      }
    }
  };
  return (
    <div className="App">
      <div className="wallet noselect">ETHEREUM WALLET</div>
      <img
        className="leftLine noselect"
        draggable="false"
        src={leftLineImg}
        alt="line"
      />
      <div className="greeting noselect">
        BONJOUR {finalUserName || "INCONNU"}
      </div>
      <img
        className="rightLine noselect"
        draggable="false"
        src={rightLineImg}
        alt="line"
      />
      <div className="logoContainer">
        <div className="logo">
          <img
            className="flou noselect"
            draggable="false"
            src={flouImg}
            alt="flou"
          />
          <img
            className="circle noselect"
            draggable="false"
            src={circleImg}
            alt="circle"
          />
          <img
            className="ether noselect"
            draggable="false"
            src={etherImg}
            alt="ether"
          />
        </div>
        {isConnected && (
          <BalanceDisplay contract={state.contract} onError={setCurrentError} />
        )}
        <button
          onClick={() => setIsConnected(!isConnected)}
          className="balance-toggle-button"
        >
          {isConnected ? "Disconnect" : "Connect"}
        </button>
        <SetName
          contract={state.contract}
          onError={setCurrentError}
          onFinalUsername={setFinalUserName}
          useName={useName}
          setUseName={setUseName}
        />
      </div>
      <button onClick={sendEth} className="btn-send noselect">
        DEPOSER DE L'ETHER
      </button>
      <button onClick={withdrawAll} className="btn-receive noselect">
        RECUPERER DE L'ETHER
      </button>
      <ErrorPopup error={currentError} />
    </div>
  );
}
export default App;
