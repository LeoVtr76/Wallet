import { useState, useEffect } from "react";
import { formatEther } from "ethers";

function BalanceDisplay({ contract, onError }) {
  const [balance, setBalance] = useState();

  useEffect(() => {
    const fetchBalance = async () => {
      console.log("fetchBalance");
      try {
        const _balance = await contract.getBalance();
        setBalance(formatEther(_balance));
      } catch (err) {
        console.log("error from fetchBalance");
        onError(err);
      }
    };

    fetchBalance();
  }, [contract, onError]);

  return (
    <div className="ethAmount">
      {balance === "0.0" ? "0" : balance || 0} ETH
    </div>
  );
}

export default BalanceDisplay;
