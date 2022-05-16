import React, { createContext, useState, useEffect } from 'react'
import { HashconnectService } from '../utils/service';
import { currentNetwork } from '../utils/utilities';
import {
	request,
	getAccountInfo,
	getAccountNfts,
	getTokenInfo,
	associateToken,
	validateClaim,
	executeClaim,
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
	const [pairingString, setPairingString] = useState("");
	const [provider, setProvider] = useState('');
	const [signer, setSigner] = useState('');
	const [status, setStatus] = useState('');

	useEffect(() => {
		setWalletService(new HashconnectService());
		showWalletPopup();
	}, [])

	async function initHashconnectService() {
		const r = await walletService.initHashconnect();
		setStatus(walletService.status);
		setPairingString(r.pairingString);
		//console.log('psss...', walletService.status, r.pairingString);
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
		const network = currentNetwork;
		const topic = walletService.saveData.topic;
		const accountId = walletService.saveData.pairedAccounts[0];

		const provider = walletService.hashconnect.getProvider(network, topic, accountId);
		const signer = walletService.hashconnect.getSigner(provider);
		setSigner(signer);
		setProvider(provider);

		const _accountNfts = await getAccountNfts(accountId);
		setAccountNfts(_accountNfts);

		const _accountInfo = await getAccountInfo(accountId);
		setAccountInfo(_accountInfo);

		const _accountTokens = _accountInfo.balance.tokens.map(t => getTokenInfo(t.token_id))
		Promise.all(_accountTokens).then(result => {
			setAccountTokens(result)
		})
		
	}

	async function makeDeposit(data) {
		// if tokenId != 0 associate token or nft here
		if (data.tokenId !== "0") {
			let { tokenId } = data;
			let associate = await associateToken({tokenId});
			if (!(associate.result === "SUCCESS" || associate.result === "TOKEN_ALREADY_ASSOCIATED_TO_ACCOUNT")) {
				console.log('Associate error', associate.result);
				return associate;
			}
		}
		
		// if associate success make transfer 
		showWalletPopup();
		let serialNumber = !data.isFungible ? data.serialNumber : null;
		let tokenTX = await walletService.makeTransaction(signer, data.amount, data.tokenId, serialNumber);
		if (!tokenTX) {
			console.log('TokenTX', tokenTX);
			return { result: "FAIL_TOKEN_TX" }
		}
		
		// then setDeposit in smart contract
		let result = await setDeposit(data);
		
		console.log('Deposit', result);
		return result;
	}

	async function makeValidate(data) {
		let result = await validateClaim(data);
		
		console.log('Validate', result);
		return result;
	}

	async function makeClaim(data) {
		// if not HBAR and is user's wallet ask to asociate token first
		// if create wallet make auto associable
		let result = await executeClaim(data);
		console.log('Claim', result);
	}

	function clearPairings() {
		walletService.clearPairings();
		setStatus('')
	}

	const isMobile = () => {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}

	const data = {
		pairingString,
		walletService,
		accountTokens,
		accountInfo,
		accountNfts,
		provider,
		signer,
		status
	}

	const fn = {
		isMobile,
		makeClaim,
		makeDeposit,
		makeValidate,
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