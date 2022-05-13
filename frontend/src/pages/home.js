import React, { useContext } from "react"
import Layout from "../app/layout"
import TokenList from "../app/home/TokenList"
import NftList from "../app/home/NftList"
import { DataContext } from '../app/context'


const Home = () => {
    const { fn, data } = useContext(DataContext)

    const {
        accountTokens,
        accountInfo,
        accountNfts,
		status,      
    } = data;

    const {
		clearPairings,
		initHashconnectService
    } = fn;

	return (	
        <Layout>
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
                        <small className="block text-gray-400">Working on Hedera Testnet (Beta)</small>
                    </div>
                </div>
            ):
            (
                <div className="home-unpaired flex items-center justify-center">
                    <span className="text-5xl py-10 text-gray-500">No Wallet Paired!</span>
                </div>
            )
        }
        </Layout>
	)
}

export default Home