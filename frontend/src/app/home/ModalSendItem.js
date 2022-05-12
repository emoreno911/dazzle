import { useRef } from "react"
import Modal from "../common/Modal"

const ModalSendItem = ({ symbol }) => {
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
				<h4 className=" text-lg mb-6">SEND TOKENS</h4>
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

export default ModalSendItem