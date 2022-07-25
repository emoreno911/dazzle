import React, { useState, useEffect } from 'react';
import TokenList from './TokenList';
import NftList from './NftList';
import { divideByDecimals } from '../../utils';
import {
	getAccountTokens
} from '../../utils/tron/service';
import { 
	getAccountInfo
} from '../../utils/tron/api';

const WalletAssets = ({ address }) => {
    const [accountInfo, setAccountInfo] = useState({});
	const [accountNfts, setAccountNfts] = useState(null);
	const [accountTokens, setAccountTokens] = useState(null);

    useEffect(() => {
        if (address !== null)
            setAccountData()
    }, [address])
    
    async function setAccountData() {
		//setAccountInfo(walletDetails);
		
		const accountInfo = await getAccountInfo(address)
        setAccountInfo({
            address,
            balance: divideByDecimals(accountInfo.data[0].balance, 6)
        })
        console.log(accountInfo)
		// accountInfo.success, accountInfo.data[0]

		const tokens = accountInfo.data[0].trc20.map(t => Object.keys(t)[0]);
		const { accountTokens, accountNfts } = await getAccountTokens(tokens, address);

		setAccountTokens(accountTokens);
		setAccountNfts(accountNfts)
		
		console.log(accountTokens, accountNfts)
	}

    if (address === null) {
        return <div><small className="mt-4 block text-gray-400">No wallet</small></div>
    }

	return (
		<div className="flex flex-col">
			<h3 className="text-lg text-white mb-5">
				<small className="block text-gray-400">
                    This is your SmartWallet:&nbsp; 
                    <a 
                        href={`https://nile.tronscan.org/#/contract/${address}`} 
                        className="text-yellow-400"
                        target="_blank" 
                    > 
                        {address}
                    </a>
                </small>
			</h3>
			
			<TokenList accountInfo={accountInfo} accountTokens={accountTokens} />
			<div className="mb-2"></div>
			<NftList accountNfts={accountNfts} />

			<div className="flex items-center justify-center my-5">
				<small className="block badge-trx">Working on Nile Testnet</small>
			</div>
		</div>
	)
}

export default WalletAssets