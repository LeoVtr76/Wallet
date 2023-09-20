import React, { createContext, useCallback, useEffect, useState } from "react";
import { ethers, formatEther, parseUnits } from "ethers";
import Wallet from "../artifacts/contracts/Wallet.sol/Wallet.json";

const WalletAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

const defaultContextValue = {
  isConnected: false,
  sendEth: () => {},
  withdrawAll: () => {},
  balance: 0,
};

const AccountContext = createContext(defaultContextValue);

export function AccountProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [contract, setContract] = useState();
  const [account, setAccount] = useState();
  const [balance, setBalance] = useState(0);

  const fetchBalance = async (currentContract) => {
    try {
      console.log(
        "AccountContext->fetchBalance with contract",
        currentContract
      );
      const contractBalance = await currentContract.getBalance();
      return formatEther(contractBalance);
    } catch (err) {
      console.error("AccountContext->fetchBalanceError", err);
      // onError(err);
    }
  };

  const connectWallet = useCallback(async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        // setCurrentError({
        //   localCode: "ERR003",
        //   localMessage: "MetaMask n'est pas installé!",
        //   notClosable: true,
        // });
        return; // Sortez de la fonction si MetaMask n'est pas installé
      }
      console.log("AccountContext->connectWallet");
      await ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const currentContract = new ethers.Contract(
        WalletAddress,
        Wallet.abi,
        signer
      );
      setContract(currentContract);
      const currentBalance = await fetchBalance(currentContract);
      console.log(currentBalance);
      setBalance(currentBalance);
      setIsConnected(true);
    } catch (err) {
      console.error("AccountContext->connectWalletError", err);
    }
  }, []);

  const sendEth = async () => {
    if (contract) {
      console.log("AccountContext->sendEth");
      try {
        let overrides = {
          value: parseUnits("0.1", "ether"),
        };
        const transaction = await contract.sendEth(overrides);
        await transaction.wait();
        const newBalance = await fetchBalance(contract);
        setBalance(newBalance);
      } catch (err) {
        // setCurrentError(err);
        console.error("AccountContext->sendEthError", err);
      }
    }
  };

  const withdrawAll = async () => {
    if (contract) {
      console.log("AccountContext->withdrawAll");
      try {
        const transaction = await contract.withdrawAll();
        await transaction.wait();
        const newBalance = await fetchBalance(contract);
        setBalance(newBalance);
      } catch (err) {
        // setCurrentError(err);
        console.error("AccountContext->withdrawAllError", err);
      }
    }
  };

  useEffect(() => {
    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        console.log("L'utilisateur a déconnecté MetaMask");
      } else {
        console.log("Compte sélectionné par l'utilisateur:", accounts[0]);
        setAccount(accounts[0]);
        await connectWallet();
      }
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }
    connectWallet();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        ); // Supprimez l'écouteur
      }
    };
  }, [connectWallet]);

  return (
    <AccountContext.Provider
      value={{
        isConnected,
        sendEth,
        withdrawAll,
        balance,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = React.useContext(AccountContext);

  if (context === undefined) {
    throw new Error("useAccount must be used within a AccountContext");
  }

  return context;
}
