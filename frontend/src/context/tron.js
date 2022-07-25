import React, { createContext, useState, useEffect, useContext } from 'react';
import { useApp } from '../context/app';
import { storeLocalDeposit, delay } from '../utils';
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
	getAccountInfo,
	executeClaimTron,
	deployBaseWallet,
	withdrawFromSmartwallet
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
			init()
		}, 5000);
        //setWalletDetails();		
	}, [])

	async function init() {
		const res = await window.tronLink.request({method: 'tron_requestAccounts'})
		getTronWeb()
		console.log(res)
	}

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
	async function makeClaim(tokenId, data, isNewWallet = false, isSmartWallet = false) {
		if (Object.keys(validatedData).length === 0) // claim not validated
			return {result: "FAIL"};

		let beneficiary = accountInfo.address;
		let newWallet = null;

		if (isNewWallet) {
			newWallet = await window.tronWeb.createAccount();
			beneficiary = newWallet.address.base58;
		}
		else if (isSmartWallet) {
			let { socialid, pincode, address } = data;

			if (address !== null) { // check if user has an smartwallet already
				beneficiary = address;
				newWallet = address;
			}
			else {
				let smartwallet = await deployBaseWallet({ socialid, pincode });

				if (smartwallet.result !== "SUCCESS") {
					return smartwallet;
				}

				beneficiary = smartwallet.base58;
				newWallet = smartwallet.base58;
			}
		}

		let result = await executeClaimTron({
			id: validatedData.id,
			pwd: validatedData.pwd,
			beneficiary,
		});

		if (result.result === "SUCCESS") {
			setValidatedData({});
		}

		console.log('Claim Done', data, result);
		return {
			newWallet, 
			...result
		};
	}


	async function makeWithdrawal(data) {
		let result = await withdrawFromSmartwallet(data);
		// delay(3000);
		// let result = { result: "SUCCESS" };
		console.log('makeWithdrawal', data, result);
		return result;
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
		setWalletDetails,
		makeWithdrawal
	}

	return (
		<DataContext.Provider value={{ data, fn }}>
			{props.children}
		</DataContext.Provider>
	);
}

export default DataContextProvider;