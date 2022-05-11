import React, { createContext, useState, useEffect } from 'react'
import { HashconnectService } from '../utils/service';
import { request } from '../utils/utilities';

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
		console.log(balance)
		// let info = await requestAccountInfo(accountId)
		// console.log('info...', info)
		setSigner(signer);
		setProvider(provider);
		setBalance(balance.hbars.toString());
		setAccount(accountId);
		
		console.log('data',walletService.saveData)
	}

	async function makeTransaction() {
		let result = await walletService.makeTransaction(signer)
		console.log('transaction', result)
	}

	async function requestAccountInfo(accountId) {
		const response = await request({
			url: '/getAccountInfo',
			method: 'POST',
			data: { accountId },
			fname: 'requestAccountInfo'
		});

		return response;
	}

	async function getContractData(username) {
		const response = await request({
			url: '/getContractData',
			method: 'POST',
			data: { username },
			fname: 'getContractData'
		});

		return response;
	}

	function clearPairings() {
		walletService.clearPairings();
		setStatus('')
	}

	async function rqai() {
		return await getContractData("Bob")
		//return await requestAccountInfo('0.0.34264077')
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
		rqai,
		isMobile,
		getBalance,
		clearPairings,
		makeTransaction,
		initHashconnectService
	}

	return (
		<DataContext.Provider value={{ data, fn }}>
			{props.children}
		</DataContext.Provider>
	);
}

export default DataContextProvider;