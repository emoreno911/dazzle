import React, { useRef } from "react";

function RequestPassword({ submitValidation, errorMessage }) {
    const pwdInput = useRef();
    const handleValidation = () => {
        submitValidation(pwdInput.current.value);
    }
    return (
        <div className="flex flex-col text-white text-center link-page">
            <h3 className="text-xl font-bold">Claim your Tokens!</h3>
            <small className="block mt-3 text-gray-400">
                If your link isn't password protected just leave the input empty and press Validate
            </small>
            <div className="my-10">
                <div className="flex flex-wrap items-stretch w-full max-w-xl mx-auto relative">
                    <input 
                        ref={pwdInput}
                        type="password"
                        placeholder="Password here"
                        className="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 h-10 rounded-lg rounded-r-none px-3 relative bg-color-dark text-white" 
                    />
                    <div className="flex">
                        <button 
                            title="Validate Password" 
                            onClick={() => handleValidation()}
                            className="flex items-center leading-normal rounded-l-none px-3 whitespace-no-wrap text-sm w-20 h-10 justify-center items-center text-md font-bold rounded-lg bg-color-alt text-gray-100"
                        >
                            Validate
                        </button>
                    </div>
                </div>
                { errorMessage && <small className="block text-red-400 mt-2">{errorMessage}</small> }
            </div>
        </div>
    )
}

export default RequestPassword;