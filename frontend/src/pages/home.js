import React, { useContext } from "react"
import Layout from "../app/layout"
import TokenList from "../app/home/TokenList"
import NftList from "../app/home/NftList"
import ModalPairWalletHome from "../app/home/ModalPairWalletHome"
import { DataContext } from '../app/context'


const Home = () => {
    const { fn, data } = useContext(DataContext)

    const {
        accountTokens,
        accountInfo,
        accountNfts,
		status,      
    } = data;

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
                        <small className="block text-gray-400">Working on Hedera Testnet</small>
                    </div>
                </div>
            ):
            (
                <div className="home-unpaired flex flex-col items-center justify-center">
                    <p className="text-5xl pb-10 text-gray-300 font-semibold">An easy first step into DeFi</p>
                    <p className="text-xl py-3 text-gray-300">Share Tokens and NFTs with your friends, even if they don't have a wallet yet</p>
                    <div>
                        <ModalPairWalletHome />
                    </div>
                    <div className="flex items-center justify-center my-5">
                        <small className="block text-gray-400">Working on Hedera Testnet</small>
                    </div>
                    {/* <p className="text-xl py-3 text-gray-300">Just start by pairing your wallet with this dApp</p>
                    <p className="text-xl py-3 text-gray-300">Then select a token or NFT to send</p>
                    <p className="text-xl py-3 text-gray-300">And share the generated Link with whoever you want</p> */}
                </div>
            )
        }
        </Layout>
	)
}

export default Home