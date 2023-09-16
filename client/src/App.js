import './App.css';
import circleImg from './img/circle.png';
import etherImg from './img/ether.png';

function App() {
  return (
    <div className="App">
      <div className="logo">
        <img className="circle" src={circleImg} alt="circle" />
        <img className="ether" src={etherImg} alt="ether" />
      </div>
    </div>
  );
}

export default App;
