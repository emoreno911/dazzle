import { useState, useRef } from "react";
import { useTron } from "../../context/tron"; 
import { multiplyByDecimals, getCurrentSmartwallet, isNullAddress } from "../../utils";
import Modal from "../common/Modal";

const TokenModalTron = ({ symbol, tokenId, tokenType, address, balance, decimals }) => {
    const [txid, setTxid] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const { 
		fn:{ makeWithdrawal }		 
	} = useTron();

    const amountInput = useRef();
    const passwordInput = useRef();
    const beneficiaryInput = useRef();

    const handleSubmit = async () => {
        if (isProcessing)
            return;

        setTxid("");
        const beneficiary = beneficiaryInput.current.value;
        const amount = amountInput.current.value;
        const pin = passwordInput.current.value;
        
        if (beneficiary === "" || pin === "") {
            setErrorMessage("Fill all fields please");
            return;
        }

        if (parseInt(amount) > balance) {
            setErrorMessage("Insufficient balance");
            return;
        }

        const contractAddr = isNullAddress(address) ? null : address;
        const smartwalletAddress = getCurrentSmartwallet();
        setIsProcessing(true);
        setErrorMessage("");

        let response = await makeWithdrawal({
            pin,
            beneficiary,
            contractAddr,
            amount: multiplyByDecimals(amount, decimals),
            smartwalletAddress
        });

        setIsProcessing(false);
        if (response.hasOwnProperty('result')) {
            if (response.result === "SUCCESS") {
                setTxid(response.txid)
            }
            else {
                setErrorMessage("Something went wrong! Try again.");
            }
        }
        else {
            setErrorMessage("Something went wrong! Try again.");
        }
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
                    <label className="text-white text-sm">To Address</label>
                    <input
                        ref={beneficiaryInput}
                        type="text"
                        className="block w-full leading-normal w-px flex-1 h-10 rounded-lg px-3 mt-1 relative bg-color-dark text-white" 
                    />
                </div>
				<div className="w-full relative my-5">
                    <label className="text-white  text-sm">Pin Code</label>
                    <input
                        ref={passwordInput}
                        type="password"
                        className="block w-full leading-normal w-px flex-1 h-10 rounded-lg px-3 mt-1 relative bg-color-dark text-white" 
                    />
                    { errorMessage && <small className="block text-red-400 mt-2">{errorMessage}</small> }
                </div>
                {
                    txid !== "" && (
                        <div className="text-center">
                            <a 
                                className="block text-sm mb-3 text-yellow-400"
                                href={`https://nile.tronscan.org/#/transaction/${txid}`} 
                                target="_blank"
                            >
                                Transaction ongoing. Check details
                            </a>
                        </div>
                    )
                }
				<div className="flex items-center justify-end">
                    <button 
                        type="button" 
                        className="flex text-sm px-8 py-2 text-white rounded-md bg-green-500 focus:outline-none"
                        onClick={() => handleSubmit()}
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

export default TokenModalTron