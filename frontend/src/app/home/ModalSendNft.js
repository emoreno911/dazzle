import { useRef } from "react"
import Modal from "../common/Modal"

const ModalSendNft = ({ nft, tokenName, tokenSymbol, image }) => {
    const { token_id, metadata, serial_number } = nft;
    const amountInput = useRef();
    const passwordInput = useRef();

    const submit = () => {
        console.log(amountInput.current.value, passwordInput.current.value)

        // send info to BE => createDeposit
        // clear
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
                    <img src="./img/dz-logo-black.png" alt="logo" className="dz-button"/>
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
                        <div className="mb-2">Token Symbol: <span className="text-gray-400">{tokenSymbol} ({token_id})</span></div>
                        <div className="mb-2">Token Name: <span className="text-gray-400">{tokenName}</span></div>
                        <div className="mb-2">Serial: <span className="text-gray-400">{serial_number}</span></div>
                        <div>Metadata</div>
                        <pre className="overflow-hidden text-gray-400">{metadata}</pre>
                    </div>                    
                </div>
				<div className="w-full relative my-5">
                    <label className="text-white">Set a Password (Optional)</label>
                    <input
                        ref={passwordInput}
                        type="password"
                        className="block w-full leading-normal w-px flex-1 h-10 rounded-lg px-3 mt-1 relative bg-color-dark text-white" 
                    />
                    <input 
                        ref={amountInput}
                        type="hidden" 
                        defaultValue={1} 
                    />
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

export default ModalSendNft