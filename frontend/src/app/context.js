import React, { createContext, useState, useEffect } from 'react'
import { HashconnectService } from '../utils/service';
import {
	request,
	getAccountInfo,
	getAccountNfts,
	getTokenInfo,
	setDeposit
} from '../utils/api';

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
	const [accountTokens, setAccountTokens] = useState([]);
	const [accountInfo, setAccountInfo] = useState({});
	const [accountNfts, setAccountNfts] = useState({});
	const [walletService, setWalletService] = useState();
	const [provider, setProvider] = useState('');
	const [signer, setSigner] = useState('');
	const [status, setStatus] = useState('');

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
			setAccountData();
		})

		if (walletService.status === 'Paired') {
			setAccountData();
		}
	}

	async function setAccountData() {
		const network = "testnet";
		const topic = walletService.saveData.topic;
		const accountId = walletService.saveData.pairedAccounts[0];

		const provider = walletService.hashconnect.getProvider(network, topic, accountId);
		const signer = walletService.hashconnect.getSigner(provider);
		setSigner(signer);
		setProvider(provider);

		// const _accountTokens = await getAccountTokens(accountId);
		// setAccountTokens(_accountTokens);

		const _accountNfts = await getAccountNfts(accountId);
		setAccountNfts(_accountNfts);

		const _accountInfo = await getAccountInfo(accountId);
		setAccountInfo(_accountInfo);

		const _accountTokens = _accountInfo.balance.tokens.map(t => getTokenInfo(t.token_id))
		Promise.all(_accountTokens).then(result => {
			setAccountTokens(result)
		})
		
	}

	async function maketDeposit(data) {
		let result = await setDeposit(data);
		console.log('Deposit', result);
	}

	async function makeTransaction() {
		let result = await walletService.makeTransaction(signer);
		console.log('transaction', result);
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
		return await getAccountInfo("0.0.34736300")
		//return await requestAccountInfo('0.0.34264077')
	}


	const isMobile = () => {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}

	const data = {
		walletService,
		accountTokens,
		accountInfo,
		accountNfts,
		provider,
		signer,
		status
	}

	const fn = {
		rqai,
		isMobile,
		maketDeposit,
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