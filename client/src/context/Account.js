import React, { createContext, useEffect, useState } from "react";

const defaultContextValue = {
  isConnected: false,
  setIsConnected: () => {},
  balance: 0,
};

const AccountContext = createContext(defaultContextValue);

export function AccountProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState(0);
  console.log(`AccountContext->balance = ${balance}`);

  useEffect(() => {
    const fetchBalance = async () => {
      setBalance(42);
    };

    if (isConnected) {
      fetchBalance();
    } else {
      setBalance(0);
    }
  }, [isConnected]);

  return (
    <AccountContext.Provider
      value={{
        isConnected,
        setIsConnected,
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
