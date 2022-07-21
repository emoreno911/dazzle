import TokenList from "../app/hedera/TokenList"
import NftList from "../app/hedera/NftList"
import ModalPairWalletHome from "../app/hedera/ModalPairWalletHome"
import HeroHome from '../app/common/HeroHome'
import { useHedera } from "../context/hedera"

const Hedera = () => {
    const { 
        data: {
            accountTokens,
            accountInfo,
            accountNfts,
            status      
        } 
    } = useHedera();

    return (	
        <>
        {
            status === "Paired" ?
            (
                <div className="flex flex-col">
                    <h3 className="text-lg text-white mb-5">
                        <small className="block text-gray-400">Press one of the yellow buttons and Send Tokens or NFTs to Anyone!</small>
                    </h3>
                    
                    <TokenList accountInfo={accountInfo} accountTokens={accountTokens} />
                    <div className="mb-2"></div>
                    <NftList accountNfts={accountNfts} accountTokens={accountTokens} />

                    <div className="flex items-center justify-center my-5">
                        <small className="block text-gray-400">Working on Hedera Testnet</small>
                    </div>
                </div>
            ):
            (
                <div className="home-unpaired flex flex-col items-center justify-center">
                    <HeroHome />
                    <div>
                        <ModalPairWalletHome buttonText={"Start Here!"} />
                    </div>
                    <div className="flex items-center justify-center my-5">
                        <small className="block badge-hbar">Working on Hedera Testnet</small>
                    </div>
                </div>
            )
        }
        </>
	)
}

export default Hedera