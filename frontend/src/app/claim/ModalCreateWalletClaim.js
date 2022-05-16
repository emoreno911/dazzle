import React, { useState, useContext } from "react";
import Modal from "../common/Modal";
import { DataContext } from "../context";

// https://github.com/ed-marquez/hedera-sdk-js/blob/main/examples/create-account.js

const ModalCreateWalletClaim = ({ buttonText }) => {
	const { 
		data:{status, accountInfo, pairingString},
		fn:{initHashconnectService, clearPairings}		 
	} = useContext(DataContext);

	const [isTextCopied, setIsTextCopied] = useState(false);

	const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(pairingString);
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
                    <button className="w-full text-center text-md px-5 py-2 my-5 text-white rounded-md bg-green-500 focus:outline-none">
                        Do it!
                    </button>
			</div>
		</Modal>
	)
}

export default ModalCreateWalletClaim