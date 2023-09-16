import './App.css';
import circleImg from './img/circle.png';
import etherImg from './img/ether.png';
import flouImg from './img/flou.png'

function App() {
  return (
    <div className="App">
      <div className="wallet noselect">ETHEREUM WALLET</div>
      <div className="greeting noselect">BONJOUR LEO</div>
      <div className="logoContainer">
        <div className="logo">
          <img className="flou noselect" src={flouImg} alt="flou" />
          <img className="circle noselect" src={circleImg} alt="circle" />
          <img className="ether noselect" src={etherImg} alt="ether" />
        </div>
        <div className="ethAmount">100 ETH</div>
      </div>
      <button className="btn-send">DEPOSER DE L'ETHER</button>
      <button className="btn-receive">RECUPERER DE L'ETHER</button>
    </div>
  );
}

export default App;
