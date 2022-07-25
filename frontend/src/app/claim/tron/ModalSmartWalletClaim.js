import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../utils/firebase";
import { useTron } from "../../../context/tron";
import { getSmartWallet } from "../../../utils/tron/service";
import { isNullAddress, makeHash } from "../../../utils";
import Modal from "../../common/Modal";
import SocialLogin from "../../smartwallet/SocialLogin";

const ModalSmartWalletClaim = ({ buttonText, tokenId, item, disableClaim, setDisableClaim }) => {
	const { 
		fn:{ makeClaim }		 
	} = useTron();

    const [smartwalletAddr, setSmartwalletAddr] = useState(null);
	const [claimComplete, setClaimComplete] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const pincodeInput = useRef();

    const [user, loading] = useAuthState(auth);

    useEffect(() => {
        if (user) {
            checkSmartwalletAddress();
        }
    }, [user])

    const checkSmartwalletAddress = async () => {
        let _smartwalletAddr = await getSmartWallet(user.uid);
        let addr = isNullAddress(_smartwalletAddr.hex) ? null : _smartwalletAddr.base58;
        console.log(addr)
        setSmartwalletAddr(addr);
    }

	const handleClaimTokens = async () => {
		if (disableClaim)
			return;

        // if no PinModule we hardcode a random pincode to pass the verification
        const _pincode = smartwalletAddr === null ? pincodeInput.current.value : "000000";

        setErrorMessage("");
        const isSixDigitsPin = /\b\d{6}\b/g.test(_pincode);
        if (!isSixDigitsPin) {
            setErrorMessage("Pincode must contain exactly 6 digits")
            return;
        }

        setIsProcessing(true);
        let pincode = await makeHash(_pincode)
        const data = {
            pincode,
            socialid: user.uid,
            address: smartwalletAddr
        }

        let res = await makeClaim(tokenId, data, false, true);
        if (res.result === 'SUCCESS') {
            setSmartwalletAddr(res.newWallet)
            setClaimComplete(true)
            setDisableClaim(true)
        }
        
        setIsProcessing(false);
	}

    const helpText = smartwalletAddr === null ?
        "Generate a Smartwalllet and get your tokens in it." : 
        `Send the tokens to your current Smartwallet`;

    const PinModule = () => (
        <div className="w-full relative my-5">
            <label className="text-white">Set a 6 digit pin code for your wallet</label>
            <input
                ref={pincodeInput}
                type="password"
                className="block w-full leading-normal w-px flex-1 h-10 rounded-lg px-3 mt-1 relative bg-color-dark text-white" 
            />
            <small className="block text-gray-400">This code will be required for withdrawals</small>
            { errorMessage && <small className="block text-red-400 mt-2">{errorMessage}</small> }
        </div>
    )

	return (
		<Modal
			activator={({ setShow }) => (
				<button 
                    type="button" 
                    className="flex w-full text-center text-md px-5 py-2 my-5 text-white rounded-md bg-yellow-500 focus:outline-none"
                    onClick={() => setShow(true)}
                > 
                    <span className="block mx-auto">{ buttonText }</span>    
                </button>
			)}
		>
			<div className="bg-color-accent pt-4 pb-8 px-8 rounded-md text-white">
                {
                    !user ?
                    (
                        <>
                            <h4 className=" text-xl my-3">Claim with Smartwallet</h4>
                            <SocialLogin />
                        </> 
                    )
                    :
                    (
                        <div className="flex flex-col">
                            <h4 className=" text-xl mt-3">Claim with Smartwallet</h4>
                            <small className="text-gray-400">{helpText}</small>
                            <div className="mt-5">Social Account: <span className="text-gray-400">{user.email}</span></div>
                            {
                                (smartwalletAddr === null) && <PinModule />
                            }
                            {
                                !claimComplete ? (
                                    <button 
                                        type="button" 
                                        className="flex text-sm px-5 py-2 mt-5 text-white rounded-md bg-green-500 focus:outline-none"
                                        onClick={() => handleClaimTokens()}
                                    >
                                        <span className="block mx-auto text-md">
                                            { isProcessing ? "Processing..." : "Claim Tokens" }
                                        </span>
                                    </button>
                                ):
                                (
                                    <div className="text-center">
                                        <h4 className="text-xl font-bold my-5">Claim Completed!</h4>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <Link to={`/tron/smartwallet`}>
                                                <span className="block text-md text-yellow-400">
                                                    Go to Smartwallet
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    )
                }
			</div>
		</Modal>
	)
}

export default ModalSmartWalletClaim