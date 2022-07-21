import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../common/Modal"
//import { useHedera } from "../../context/hedera"; 
//import { makeHash, toNumber } from "../../utils";

const NftModal = ({ nft, tokenName, tokenSymbol, image }) => {
    let navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    /*const { 
        data:{ accountInfo },
		fn:{ makeDeposit }		 
	} = useHedera();*/
    
    const { tokenId, metadata, tokenUri } = nft;
    const passwordInput = useRef();

    /*const submit = async () => {
        if (isProcessing)
            return;

        const amount = 1;
        const isFungible = false;
        const pwd = passwordInput.current.value;
        const hash = await makeHash(pwd);
        setIsProcessing(true);
        setErrorMessage("");

        let response = await makeDeposit({
            sender: accountInfo.account,
            tokenIdSerial: `${token_id}#${serial_number}`,
            serialNumber: serial_number,
            tokenId: token_id,
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
        passwordInput.current.value = "";
    }*/

    const submit = () => {}

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
                        <div className="mb-2">Token ID: <span className="text-gray-400">{tokenId}</span></div>
                        <div>Token URI</div>
                        <code>
                            <pre className="codeblock">
                                {tokenUri}
                            </pre>
                        </code>
                    </div>                    
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
                            <span className="block text-md">SEND</span>
                        </div>
                    </button>
                </div>
			</div>
		</Modal>
	)
}

export default NftModal