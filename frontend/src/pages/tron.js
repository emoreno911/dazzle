import { useState } from 'react';
import HeroHome from '../app/common/HeroHome';
import TokenList from "../app/tron/TokenList";
import NftList from "../app/tron/NftList";
import { useTron } from "../context/tron";

const Tron = () => {
	const [isConnecting, setIsConnecting] = useState(false);
	const { 
        data: {
            accountTokens,
            accountInfo,
            accountNfts,
            status      
        },
		fn: {
			setWalletDetails
		} 
    } = useTron();

	const handleIsConnecting = () => {
		setIsConnecting(true);
        setWalletDetails();
        setTimeout(() => {
            setIsConnecting(false);
        }, 5000);
    }

	return status === "connected" ?
	(
		<div className="flex flex-col">
			<h3 className="text-lg text-white mb-5">
				<small className="block text-gray-400">Press one of the yellow buttons and Send Tokens or NFTs to Anyone!</small>
			</h3>
			
			<TokenList accountInfo={accountInfo} accountTokens={accountTokens} />
			<div className="mb-2"></div>
			<NftList accountNfts={accountNfts} />

			<div className="flex items-center justify-center my-5">
				<small className="block badge-trx">Working on Nile Testnet</small>
			</div>
		</div>
	) :
	(
		<div className="home-unpaired flex flex-col items-center justify-center">
			<HeroHome />
			<div>
				<button
					type="button"
					className="flex text-lg px-5 py-2 my-5 text-white rounded-md bg-yellow-500 focus:outline-none"
					onClick={() => handleIsConnecting()}
				>
					<div>
						<span className="block text-lg">{isConnecting ? "Connecting Wallet..." : "Start Here!"}</span>
					</div>
				</button>
			</div>
			<div className="flex items-center justify-center my-5">
				<small className="block badge-trx">Working on Nile Testnet</small>
			</div>
		</div>
	)
}

export default Tron