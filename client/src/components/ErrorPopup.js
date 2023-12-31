import React, { useEffect, useState } from 'react';

function ErrorPopup({error}) {
    const [errors, setErrors] = useState([]);
    useEffect(() => {
        if (error) {
            console.log("error");
            ErrorHandler(error);
        }
    }, [error]);
    const ErrorHandler = (err) => {
        console.log(err);
        console.log("ErrorHandler");
        console.log(Object.keys(err));
        if (!err || Object.keys(err).length === 0) {
            return; // Sortez de la fonction si l'objet d'erreur est vide
        }
        console.log("erreur :",err);
        //console.log(err.code, typeof Object.keys(err),Object.keys(err));
        let errorMessage;
        let errorCode;
        let notClosable = false;
        //Initialiser le code d'erreur et le message d'erreur
        //Erreur local
        if (err && err.localCode && err.localMessage) {
            errorCode = err.localCode;
            errorMessage = err.localMessage;
            console.log("erreur locale");
            if (err.notClosable){
                notClosable = true;
            }
        }
        //Erreur externe
        else if (err && err.info && err.info.error) {
            console.log("erreur externe");
            // Erreur SmartContract (require)
            if (err.info.error.code && err.info.error.data && err.info.error.data.data && err.info.error.data.data.reason) {
                errorCode = err.info.error.code;
                errorMessage = err.info.error.data.data.reason;
                console.log("erreur require");
            }
            // Erreur Metamask
            else if (err.info.error.code && err.info.error.message) {
                errorCode = err.info.error.code;
                if(errorCode === 4001){
                    errorMessage = "La transaction a été annulée";
                }
                
                console.log("erreur metamask");
            }
        }else {
            errorCode = "????";
            errorMessage = "Erreur inconnue";
            console.log(err);
        }
        console.log("code d'erreur : ",errorCode,"message d'erreur: ",errorMessage);
        const newError = {
            id: Date.now(), // Utilisez le timestamp comme ID unique
            message: errorMessage,
            _notClosable : notClosable,
            animation: 'slideIn'
        };
        setErrors(prevErrors => [newError, ...prevErrors]);
        if (!newError._notClosable) {

            const timeoutId = setTimeout(() => {
                closeErrorPopup(newError.id);
            }, 10000);
            newError.timeoutId = timeoutId;
        }
        else{
            console.log("L'erreur ne va pas se fermer");
        }
    }
    const closeErrorPopup = (id) => {
        const errorToClose = errors.find(error => error.id === id);
      
          // Si l'erreur a un timeout associé, annulez-le
        if (errorToClose && errorToClose.timeoutId) {
            clearTimeout(errorToClose.timeoutId);
        }
        setErrors(prevErrors => {
            return prevErrors.map(error => {
                if (error.id === id) {
                    return { ...error, animation: 'slideOut' };
                }
                return error;
            });
        });
      
        // Supprimez l'erreur après l'animation
        setTimeout(() => {
            setErrors(prevErrors => prevErrors.filter(error => error.id !== id));
        }, 300);
    }
    return (
        <div className="error-container">
            {errors.map((error) => (
                <div key={error.id} className={`error-popup ${error.animation}`}>
                    <span>{error.message}</span>
                    {!error._notClosable && <button onClick={() => closeErrorPopup(error.id)}>X</button>}
                </div>
            ))}
        </div>
    );
}

export default ErrorPopup;