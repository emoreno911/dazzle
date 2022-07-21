import React, { createContext, useState, useEffect, useContext } from 'react';
import {
	getTronWeb,
	getNftInfo,
	getWalletDetails,
	getAccountTokens,
	getTokenInfo
} from '../utils/tron/service'

import { 
	getAccountInfo
} from '../utils/tron/api';

const DataContext = createContext();
export const useTron = () => useContext(DataContext);

const DataContextProvider = (props) => {
	const [accountInfo, setAccountInfo] = useState({});
	const [accountNfts, setAccountNfts] = useState(null);
	const [accountTokens, setAccountTokens] = useState(null);
	const [status, setStatus] = useState('');

	useEffect(() => {
		const status = "Tron context"
		console.log(status)
        
		const interval = setInterval(async () => {
            const walletDetails = await getWalletDetails();
            //wallet checking interval 2sec
            if (walletDetails.connected) {
				console.log("Wallet connected", walletDetails);
				setAccountData(walletDetails.details);
				setStatus('connected');
				clearInterval(interval);
			}        
        }, 2000);
	}, [])

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
		isMobile
	}

	return (
		<DataContext.Provider value={{ data, fn }}>
			{props.children}
		</DataContext.Provider>
	);
}

export default DataContextProvider;