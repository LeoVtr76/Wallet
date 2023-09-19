function ErrorPopup({ errors, closeErrorPopup }) {
    return (
        <div className="error-container">
            {errors.map((error) => (
                <div key={error.id} className={`error-popup ${error.animation}`}>
                    <span>{error.message}</span>
                    <button onClick={() => closeErrorPopup(error.id)}>X</button>
                </div>
            ))}
        </div>
    );
}

export default ErrorPopup;