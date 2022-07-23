import React, { useState } from "react";
import Modal from "../../common/Modal";
import { useHedera } from "../../../context/hedera";

// https://github.com/ed-marquez/hedera-sdk-js/blob/main/examples/create-account.js

const ModalCreateWalletClaim = ({ buttonText, tokenId, item, disableClaim, setDisableClaim }) => {
	const { 
		fn:{ makeClaim }		 
	} = useHedera();

    const [isTextCopied, setIsTextCopied] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
    const [claimComplete, setClaimComplete] = useState(false);
    const [newWalletInfo, setNewWalletInfo] = useState({})

	const handleGenerateAndTransfer = async () => {
        if (disableClaim)
            return;
            
        setIsProcessing(true);
        let res = await makeClaim(tokenId, item, true);
        console.log(res)
        if (res.result === 'SUCCESS') {
            
            setClaimComplete(true);
            setNewWalletInfo(res.newWallet.data);
            setDisableClaim(true);
        }

        setIsProcessing(false);
    }

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(JSON.stringify(newWalletInfo));
        setIsTextCopied(true);
        setTimeout(() => {
            setIsTextCopied(false);
        }, 2500);
    }

	return (
		<Modal
			activator={({ setShow }) => (
				<button 
                    type="button" 
                    className="flex w-full text-center text-md px-5 py-2 my-5 text-white rounded-md bg-green-500 focus:outline-none"
                    onClick={() => setShow(true)}
                > 
                    <span className="block mx-auto">{ buttonText }</span>    
                </button>
			)}
		>
			<div className="bg-color-accent pt-4 pb-8 px-8 rounded-md text-white">
                    <h4 className=" text-xl my-3">Generate new Wallet</h4>
                    {
                        !claimComplete ? 
                        (
                            <button 
                                onClick={() => handleGenerateAndTransfer()}
                                className="w-full text-center text-md px-5 py-2 my-5 text-white rounded-md bg-green-500 focus:outline-none"
                                >
                                <span>
                                    { isProcessing ? "Processing..." : "Do it!" }
                                </span>
                            </button>
                        ):
                        (
                            <>
                            <h4 className="text-md">Here is your new wallet with your assets</h4>
                            <code>
                                <pre className="codeblock">
                                    {JSON.stringify(newWalletInfo, null, 4)}
                                </pre>
                            </code>
                            <div className="grid justify-items-center mb-3">
                                <button
                                    type="button"
                                    className="flex mt-4 text-sm px-5 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                                    onClick={() => handleCopyToClipboard()}
                                >
                                    <span>{ isTextCopied ? "Text Copied" : "Copy" }</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="text-center">
                                <a 
                                    className="block text-md text-yellow-500"
                                    href={`https://testnet.dragonglass.me/hedera/accounts/${newWalletInfo.accountId}`} 
                                    target="_blank"
                                >
                                    Check in Hedera Explorer
                                </a>
                                <small className="text-gray-400">Remember to store this info in a safe place</small>
                            </div>
                            </>
                        )
                    }
			</div>
		</Modal>
	)
}

export default ModalCreateWalletClaim