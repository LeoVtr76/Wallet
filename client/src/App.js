import './App.css';
import circleImg from './img/circle.png';
import etherImg from './img/ether.png';
import flouImg from './img/flou.png';
import leftLineImg from './img/leftLine.png'
import rightLineImg from './img/rightLine.png'

function App() {
  return (
    <div className="App">
      <div className="wallet noselect">ETHEREUM WALLET</div>
      <img className="leftLine" src={leftLineImg} alt="line" />
      <div className="greeting noselect">BONJOUR LEO</div>
      <img className="rightLine" src={rightLineImg} alt="line" />
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
