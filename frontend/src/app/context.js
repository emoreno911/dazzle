import React, { createContext, useState, useEffect } from 'react'
import { HashconnectService } from '../utils/service';

export const DataContext = createContext();

let popupObjectReference = null;
function openRequestedPopup(url, windowName, features = "popup") {
  if(popupObjectReference == null || popupObjectReference.closed) {
    popupObjectReference = window.open(url, windowName, features);
  } else {
    popupObjectReference.focus();
  };
}

function showWalletPopup() {
  return openRequestedPopup("https://wallet.hashpack.app/", "hashpack", "width=410,height=600");
} 

const logmessage = (msg) => {
	if (window.location.hostname === 'localhost')
		console.log(msg)
}

const DataContextProvider = (props) => {
	const [walletService, setWalletService] = useState();
	const [status, setStatus] = useState('');
	const [balance, setBalance] = useState(0);
	const [account, setAccount] = useState('');
	const [provider, setProvider] = useState('')
	const [signer, setSigner] = useState('')

	useEffect(() => {
		setWalletService(new HashconnectService());
		showWalletPopup();
	}, [])

	async function initHashconnectService() {
		const r = await walletService.initHashconnect();
		setStatus(walletService.status)
		console.log('psss...', walletService.status, r.pairingString)
		walletService.hashconnect.pairingEvent.on(data => {
			console.log('PAIRING DETECTED!!!');
			setStatus(walletService.status);
			getBalance();
		})

		if (walletService.status === 'Paired') {
			getBalance();
		}
	}

	async function getBalance() {
		let network = "testnet";
		let topic = walletService.saveData.topic;
		let accountId = walletService.saveData.pairedAccounts[0];
		// https://github.com/Hashpack/hashconnect/blob/main/lib/src/provider/provider.ts
		let provider = walletService.hashconnect.getProvider(network, topic, accountId);
		let signer = walletService.hashconnect.getSigner(provider);
		let balance = await provider.getAccountBalance(accountId);
		
		setSigner(signer);
		setProvider(provider);
		setBalance(balance.hbars.toString());
		setAccount(accountId);
		
		console.log('data',walletService.saveData)
	}

	function clearPairings() {
		walletService.clearPairings();
		setStatus('')
	}


	const isMobile = () => {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}

	const data = {
		walletService,
		status,
		account,
		balance,
		provider,
		signer
	}

	const fn = {
		isMobile,
		getBalance,
		clearPairings,
		initHashconnectService
	}

	return (
		<DataContext.Provider value={{ data, fn }}>
			{props.children}
		</DataContext.Provider>
	);
}

export default DataContextProvider;