import leftLineImg from './img/leftLine.png';
import rightLineImg from './img/rightLine.png';

function Header ({userName}) {
    return (
        <div>
            <div className="wallet noselect">ETHEREUM WALLET</div>
            <img className="leftLine noselect" draggable="false" src={leftLineImg} alt="line" />
            <div className="greeting noselect">BONJOUR {userName || "INCONNU"}</div>
            <img className="rightLine noselect" draggable="false" src={rightLineImg} alt="line" />
        </div>
    );
}
export default Header;