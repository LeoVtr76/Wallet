import {useState, useEffect} from "react";
import {formatEther } from "ethers";
function BalanceDisplay({ contract, useBalance, setUseBalance, onError }) {
    const [balance, setBalance] = useState();

    useEffect(() => {
        if(useBalance){
            console.log("fetchbalance");
            fetchBalance();
        }
        else{
            console.log("useBalance is false");
        }
    },[contract,useBalance]);
    
    const fetchBalance = async (contract) => {
        try {
          const _balance = await contract.getBalance();
          setBalance(formatEther(_balance));
          setUseBalance = false;
        } catch (err) {
          onError(err);
          console.log("error from fetchBalance");
        }
      }
    return (
        <div className="ethAmount">{balance === "0.0" ? "0" : balance || 0} ETH</div>  
    );
}

export default BalanceDisplay;
