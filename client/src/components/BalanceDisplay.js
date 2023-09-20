import { useAccount } from "../context/Account";

function BalanceDisplay() {
  const { balance } = useAccount();

  return (
    <div className="ethAmount">
      {balance === "0.0" ? "0" : balance || 0} ETH
    </div>
  );
}

export default BalanceDisplay;
