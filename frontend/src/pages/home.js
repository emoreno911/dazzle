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
        rqai,
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
                        <span>Account {accountInfo.account}</span>
                        <small className="block text-gray-400">Select something to send!</small>
                    </h3>
                    
                    <TokenList accountInfo={accountInfo} accountTokens={accountTokens} />
                    <div className="mb-2"></div>
                    <NftList accountNfts={accountNfts} accountTokens={accountTokens} />

                    <div className="flex items-center justify-center">
                        <button 
                            type="button" 
                            className="flex text-sm px-5 py-2 mt-5 text-white rounded-md bg-color-alt focus:outline-none"
                            onClick={() => clearPairings()}
                        >
                            <div>
                                <span className="block text-md">Clear Pairing</span>
                            </div>
                        </button>
                    </div>

                    <div className="flex items-center justify-center">
                        <button 
                            type="button" 
                            className="flex text-sm px-5 py-2 mt-5 text-white rounded-md bg-green-700 focus:outline-none"
                            onClick={() => rqai()}
                        >
                            Test Transaction
                        </button>
                    </div>

                </div>
            ):
            (
                <div className="flex items-center justify-center">
                    <button 
                        type="button" 
                        className="flex text-sm px-5 py-2 text-white rounded-md bg-color-alt focus:outline-none"
                        onClick={() => initHashconnectService()}
                    >
                        <div>
                            <span className="block text-md">Pair Wallet</span>
                        </div>
                    </button>
                </div>
            )
        }
        </Layout>
	)
}

export default Home