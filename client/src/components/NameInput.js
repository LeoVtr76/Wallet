function NameInput({ userName, handleNameChange, setName }) {
    return (
        <div className="setName">
            <input type="text" value={userName} onChange={handleNameChange} placeholder="Entrez un nom d'utilisateur" maxLength={16}/>
            <button onClick={setName}>Valider</button>
        </div>
    );
}

export default NameInput;