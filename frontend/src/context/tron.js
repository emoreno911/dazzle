import React, { createContext, useState, useEffect, useContext } from 'react';
import { useApp } from '../context/app';
import { storeLocalDeposit } from '../utils';
import {
	getTronWeb,
	setLibraryContract,
	getWalletDetails,
	getAccountTokens,
	makeTransaction,
	validateClaim,
	setDeposit,
	
} from '../utils/tron/service';

import { 
	getAccountInfo
} from '../utils/tron/api';

const DataContext = createContext();
export const useTron = () => useContext(DataContext);

const DataContextProvider = (props) => {
	const [validatedData, setValidatedData] = useState({});
	const [accountInfo, setAccountInfo] = useState({});
	const [accountNfts, setAccountNfts] = useState(null);
	const [accountTokens, setAccountTokens] = useState(null);
	const [status, setStatus] = useState('');

	const { fn:{setConnectedAccount} } = useApp();

	useEffect(() => {
		console.log("Tron context");
		setTimeout(() => {
			setLibraryContract();
		}, 3000);
        //setWalletDetails();		
	}, [])

	async function setWalletDetails() {
		const interval = setInterval(async () => {
            const walletDetails = await getWalletDetails();
            //wallet checking interval 2sec
            if (walletDetails.connected) {
				console.log("Wallet connected");
				setStatus('connected');
				setAccountData(walletDetails.details);
				setConnectedAccount(walletDetails.details.address, 'tron', 'connected')
				clearInterval(interval);
			}        
        }, 2000);
	}

	async function setAccountData(walletDetails) {
		setAccountInfo(walletDetails);
		
		const accountInfo = await getAccountInfo(walletDetails.address)
		// accountInfo.success, accountInfo.data[0]

		const tokens = accountInfo.data[0].trc20.map(t => Object.keys(t)[0]);
		const { accountTokens, accountNfts } = await getAccountTokens(tokens, walletDetails.address);

		setAccountTokens(accountTokens);
		setAccountNfts(accountNfts)
		
		console.log(walletDetails)
		console.log(accountTokens, accountNfts)
	}

	async function makeDeposit(data) {
		// transfer assets
		let tokenTX = await makeTransaction(data, accountInfo);
		if (tokenTX.result !== "SUCCESS") {
			console.log('TokenTX', tokenTX);
			return tokenTX;
		}

		let result = await setDeposit(data);
		storeLocalDeposit(result.depositId, data.amount, data.symbol, tokenTX.txid, "tron")
		console.log('Deposit', result);
		return result;
	}

	async function makeValidate(data) {
		let result = await validateClaim(data);
		setValidatedData(data);
		console.log('Validate', result);
		return result;
	}

	// from backend
	async function makeClaim(tokenId, data, isNewWallet = false) {
		let beneficiary = accountInfo.address;
		let newWallet = null;

		if (isNewWallet) {
			newWallet = await window.tronWeb.createAccount();
			beneficiary = newWallet.address.base58;
		}

		// let result = await executeClaim({
		// 	id: validatedData.id,
		// 	pwd: validatedData.pwd,
		// 	beneficiary,
		// });
		let result = {result: "SUCCESS"};
		await delay(3000);

		console.log('Claim Done', data, result);
		return {
			newWallet, 
			...result
		};
	}

	const delay = (ms) => {
		return new Promise((resolve) => setTimeout(() => resolve(), ms))
	}

	const isMobile = () => {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}

	const data = {
		accountTokens,
		accountInfo,
		accountNfts,
		status
	}

	const fn = {
		isMobile,
		makeDeposit,
		makeValidate,
		makeClaim,
		setWalletDetails
	}

	return (
		<DataContext.Provider value={{ data, fn }}>
			{props.children}
		</DataContext.Provider>
	);
}

export default DataContextProvider;