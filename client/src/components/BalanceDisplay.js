import circleImg from './assets/img/circle.png';
import etherImg from './assets/img/ether.png';
import flouImg from './assets/img/flou.png';

function BalanceDisplay({ balance }) {
    return (
        <div className="logoContainer">
            <div className="logo">
                <img className="flou noselect" draggable="false" src={flouImg} alt="flou" />
                <img className="circle noselect" draggable="false" src={circleImg} alt="circle" />
                <img className="ether noselect" draggable="false" src={etherImg} alt="ether" />
            </div>
            <div className="ethAmount">{balance === "0.0" ? "0" : balance || 0} ETH</div>
        </div>
    );
}

export default BalanceDisplay;
