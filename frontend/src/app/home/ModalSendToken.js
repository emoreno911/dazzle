import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../common/Modal"
import { DataContext } from "../context";
import { makeHash, toNumber } from "../../utils/utilities";

const ModalSendToken = ({ symbol, tokenId, tokenType }) => {
    let navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const { 
        data:{ accountInfo },
		fn:{ makeDeposit }		 
	} = useContext(DataContext);

    const amountInput = useRef();
    const passwordInput = useRef();

    const submit = async () => {
        if (isProcessing)
            return;

        const amount = toNumber(amountInput.current.value);
        const pwd = passwordInput.current.value;
        const hash = await makeHash(pwd);
        const isFungible = tokenType === 'FUNGIBLE_COMMON';
        setIsProcessing(true);
        setErrorMessage("");

        let response = await makeDeposit({
            sender: accountInfo.account,
            tokenId,
            isFungible,
            amount,
            hash
        });

        if (response.hasOwnProperty('result')) {
            if (response.result === "SUCCESS") {
                navigate(`/link/${response.depositId}`, { replace: true });
            }
            else {
                setErrorMessage("Something went wrong! Try again.");
            }
        }
        else {
            setErrorMessage("Something went wrong! Try again.");
        }

        setIsProcessing(false);
        amountInput.current.value = 1;
        passwordInput.current.value = "";
    }

	return (
		<Modal
			activator={({ setShow }) => (
                <button
                    type="button"
                    title="Select Item"
                    className="flex text-sm p-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 focus:outline-none"
                    onClick={() => setShow(true)}
                >
                    <img src="https://res.cloudinary.com/dy3hbcg2h/image/upload/v1652749176/dz-logo-black_oanfaf.png" alt="logo" className="dz-button"/>
                </button>
			)}
		>
			<div className="bg-color-accent pt-4 pb-8 px-8 rounded-md text-white">
				<h4 className=" text-lg mb-6">SEND TOKENS</h4>
                <label className="block mb-5">How much you want to send?</label>
                <div className="text-center">
                    <input 
                        ref={amountInput}
                        type="number" 
                        defaultValue={1} 
                        className="bg-transparent text-white text-6xl text-center block border-b-2 w-1/2 mx-auto mb-3 focus:outline-none focus:border-yellow-500" 
                    />
                    <span className="text-white text-3xl">{symbol}</span>
                </div>
				<div className="w-full relative my-5">
                    <label className="text-white">Set a Password (Optional)</label>
                    <input
                        ref={passwordInput}
                        type="password"
                        className="block w-full leading-normal w-px flex-1 h-10 rounded-lg px-3 mt-1 relative bg-color-dark text-white" 
                    />
                    { errorMessage && <small className="block text-red-400 mt-2">{errorMessage}</small> }
                </div>
				<div className="flex items-center justify-end">
                    <button 
                        type="button" 
                        className="flex text-sm px-8 py-2 text-white rounded-md bg-green-500 focus:outline-none"
                        onClick={() => submit()}
                    >
                        <div>
                            <span className="block text-md">{ isProcessing ? "Processing..." : "Send" }</span>
                        </div>
                    </button>
                </div>
			</div>
		</Modal>
	)
}

export default ModalSendToken