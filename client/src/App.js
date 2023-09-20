import "./App.css";
// import { useState } from "react";
import circleImg from "./assets/img/circle.png";
import etherImg from "./assets/img/ether.png";
import flouImg from "./assets/img/flou.png";
import leftLineImg from "./assets/img/leftLine.png";
import rightLineImg from "./assets/img/rightLine.png";
//Components
// import ErrorPopup from "./components/ErrorPopup";
// import SetName from "./components/SetName";
import BalanceDisplay from "./components/BalanceDisplay";
import { useAccount } from "./context/Account";

function App() {
  // const [finalUserName, setFinalUserName] = useState("");
  // const [currentError, setCurrentError] = useState({});
  // const [useName, setUseName] = useState();

  const { isConnected, sendEth, withdrawAll } = useAccount();

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
        {/* BONJOUR {finalUserName || "INCONNU"} */}
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
        {isConnected && <BalanceDisplay />}
        {/* <SetName
          contract={state.contract}
          onError={setCurrentError}
          onFinalUsername={setFinalUserName}
          useName={useName}
          setUseName={setUseName}
        /> */}
      </div>
      <button onClick={sendEth} className="btn-send noselect">
        DEPOSER DE L'ETHER
      </button>
      <button onClick={withdrawAll} className="btn-receive noselect">
        RECUPERER DE L'ETHER
      </button>
      {/* <ErrorPopup error={currentError} /> */}
    </div>
  );
}
export default App;
