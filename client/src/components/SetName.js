import React, { useState, useEffect } from 'react';

function SetName({ contract, onError, onFinalUsername, useName, setUseName}) {
    const [userName, setUserName] = useState('');
    const [showNameInput, setShownameInput] = useState(false);
    useEffect(() => {
        console.log("useEffect used in SetName");
        if (useName){
            checkName(contract);
            console.log("Check Name");
        }
    }, [contract,useName]);
    const checkName = async (contract) => {
        const name = await contract.getName();
        console.log(name);
        onFinalUsername(name);
        if(name === ""){
            setShownameInput(true);
        }else {
            setShownameInput(false);
            onFinalUsername(name);
            //setIsMounted(false);
        }
    }
    const handleNameChange = (e) => {
        const value = e.target.value;
        const maxValue = 16;
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
            console.log(userName);
            onFinalUsername(userName);
            setUseName(false);
        } catch (err) {
            onError(err);

        }
    }
    return (
        showNameInput && (
            <div className="setName">
                <input type="text" value={userName} onChange={handleNameChange} placeholder="Entrez un nom d'utilisateur" maxLength={16}/>
                <button onClick={setName}>Valider</button>
            </div>
        )
    );
}

export default SetName;