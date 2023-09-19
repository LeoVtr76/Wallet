import React, { useState, useEffect } from 'react';

function SetName({ contract, onError, onFinalUsername}) {
    const [userName, setUserName] = useState('');
    const [showNameInput, setShownameInput] = useState(false);
    useEffect(() => {
        if (contract){
            checkName(contract);
        }
    },[contract]);
    const checkName = async (contract) => {
        const name = await contract.getName();
        if(name === ""){
            setShownameInput(true);
        }else {
            setShownameInput(false);
            onFinalUsername(name);
        }
    }
    const handleNameChange = (e) => {
        const value = e.target.value;
        const maxValue = 50;
        if (value.length >= maxValue) {
            onError({localCode : "ERR002", localMessage :`Le nom ne peut pas dépasser ${maxValue} caractères !`});
        }
        else {
            setUserName(value);
        }
    }
    const setName = async () => {
        try {
            const transaction = await contract.setName(userName);
            await transaction.wait();
            setShownameInput(false);
            onFinalUsername(userName);
        } catch (err) {
            onError(err);

        }
    }
    return (
        showNameInput && (
            <div className="setName">
                <input type="text" value={userName} onChange={handleNameChange} placeholder="Entrez un nom d'utilisateur" maxLength={50}/>
                <button onClick={setName}>Valider</button>
            </div>
        )
    );
}

export default SetName;