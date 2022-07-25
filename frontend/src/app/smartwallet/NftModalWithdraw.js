import { useState, useRef } from "react";
import { useTron } from "../../context/tron"; 
import { getCurrentSmartwallet } from "../../utils";
import Modal from "../common/Modal";

const NftModalTron = ({ nft, tokenName, tokenSymbol, image }) => {
    const [txid, setTxid] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const { 
		fn:{ makeWithdrawal }		 
	} = useTron();

    const tokenIdTitle = "Token ID";
    const metadataTitle = "Token URI";
    const passwordInput = useRef();
    const addressInput = useRef();
    
    const { address, tokenId, metadata, tokenUri } = nft;

    const handleSubmit = async () => {
        if (isProcessing)
            return;

        setTxid("");
        const beneficiary = addressInput.current.value;
        const pin = passwordInput.current.value;

        if (beneficiary === "" || pin === "") {
            setErrorMessage("Fill all fields please");
            return;
        }

        const smartwalletAddress = getCurrentSmartwallet();
        setIsProcessing(true);
        setErrorMessage("");

        let response = await makeWithdrawal({
            pin,
            tokenId,
            amount:null,
            beneficiary,
            contractAddr: address,
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
				<h4 className=" text-lg mb-6">SEND NFT</h4>
                <div className="flex">
                    <div className="">
                        <img className="modalpic rounded-lg mr-5" src={image} alt={""} />
                    </div>
                    <div className="w-2/3 sm:w-4/5">
                        <div className="mb-2">Token Symbol: <span className="text-gray-400">{tokenSymbol}</span></div>
                        <div className="mb-2">Token Name: <span className="text-gray-400">{tokenName}</span></div>
                        <div className="mb-2">{tokenIdTitle}: <span className="text-gray-400">{tokenId}</span></div>
                        <div>{metadataTitle}</div>
                        <code>
                            <pre className="codeblock">
                                {tokenUri}
                            </pre>
                        </code>
                    </div>                    
                </div>
                <div className="w-full relative my-5">
                    <label className="text-white text-sm">To Address</label>
                    <input
                        ref={addressInput}
                        type="text"
                        className="block w-full leading-normal w-px flex-1 h-10 rounded-lg px-3 mt-1 relative bg-color-dark text-white" 
                    />
                </div>
				<div className="w-full relative my-5">
                    <label className="text-white text-sm">Pin Code</label>
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

export default NftModalTron