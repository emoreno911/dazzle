import React, { useState, useContext } from "react";
import Modal from "../common/Modal";
import { useHedera } from "../../context/hedera"; 

const ModalPairWalletHome = ({ buttonText }) => {
	const { 
		data:{status, accountInfo, pairingString},
		fn:{initHashconnectService, clearPairings}		 
	} = useHedera();

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
                    className="flex text-lg px-5 py-2 my-5 text-white rounded-md bg-yellow-500 focus:outline-none"
                    onClick={() => setShow(true)}
                >
                    <div>
                        <span className="block text-lg">{ buttonText }</span>
                    </div>
                </button>
			)}
		>
			<div className="bg-color-accent pt-4 pb-8 px-8 rounded-md text-white">
				{
					status !== 'Paired' && pairingString !== "" &&
					<>
						<h4 className=" text-xl mb-6">Pairing String</h4>
						<pre className="truncate">
							{pairingString}
						</pre>
						<div className="grid justify-items-end">
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
					</>
				}
				{
					status === 'Paired' ? 
					(
						<div className="flex flex-col items-center justify-center">
							<h4 className="block mt-6">
								Paired to Account <span className="font-semibold text-yellow-400">{accountInfo.account}</span>
							</h4>
							<button 
								type="button" 
								className="flex text-sm px-5 py-2 mt-5 text-white rounded-md bg-color-alt focus:outline-none"
								onClick={() => clearPairings()}
							>
								<div>
									<span className="block text-md">Clear Pairing</span>
								</div>
							</button>
						</div>
					):
					(
						<div className="flex items-center justify-center">
							<button 
								type="button" 
								className="flex text-sm px-5 py-2 mt-5 text-white rounded-md bg-green-700 focus:outline-none"
								onClick={() => initHashconnectService()}
							>
								<div>
									<span className="block text-md">Init Pairing</span>
								</div>
							</button>
						</div>
					)
				}
			</div>
		</Modal>
	)
}

export default ModalPairWalletHome