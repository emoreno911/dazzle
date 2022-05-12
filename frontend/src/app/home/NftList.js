import React, { useContext, useState } from "react"

// https://cdn.solanamonkey.business/gen2/371.png
// https://hedera.com/blog/get-started-with-the-hedera-token-service-part-1-how-to-mint-nfts

const NftItem2 = () => (
    <div className="flex items-center mx-2 my-2 rounded-lg">
        <a href="#">
            <img className="icopic rounded-lg" src="https://cdn.solanamonkey.business/gen2/371.png" alt="" />
        </a>
        <div className="grow leading-5 p-2">
            <a href="#">
                <h5 className="text-md font-bold tracking-tight text-gray-100 dark:text-white">
                    Monke #371
                </h5>
                <small className="text-sm text-gray-400">A collection of random Monkes with superpowers</small>
            </a>
        </div>
        <div className="p-2 pr-0">
            <button
                type="button"
                className="flex text-sm p-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 focus:outline-none"
                onClick={() => {}}
            >
                <img src="./img/dz-logo-black.png" alt="logo" className="dz-button"/>
            </button>
        </div>
    </div>
)

const NftItem = ({ nft, accountTokens }) => {
    const { token_id, metadata, serial_number } = nft;

    let tokenName = token_id;
    try {
        tokenName = accountTokens.find(t => t.token_id === token_id).name
    } catch (error) {
        //console.log('fail nft tokenName')
    }

    let _metadata = {};
    try {
        _metadata = JSON.parse(atob(metadata));
    } catch (error) {
        //console.log('fail nft metadata')
    }

    const name = _metadata.hasOwnProperty('name') ? _metadata.name : "";
    const image = _metadata.hasOwnProperty('image') ? _metadata.image : "/img/no-image.png";
    const alt = _metadata.hasOwnProperty('image') ? tokenName : "no-image";
    return (
        <div className="flex items-center mx-2 my-2 rounded-lg">
            <a href="#">
                <img className="icopic rounded-lg" src={image} alt={alt} />
            </a>
            <div className="grow leading-5 p-2">
                <a href="#">
                    <h5 className="text-md font-bold tracking-tight text-gray-100 dark:text-white">
                        {tokenName} #{serial_number}
                    </h5>
                    <small className="text-sm text-gray-400">{name}</small>
                </a>
            </div>
            <div className="p-2 pr-0">
                <button
                    type="button"
                    className="flex text-sm p-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 focus:outline-none"
                    onClick={() => {}}
                >
                    <img src="./img/dz-logo-black.png" alt="logo" className="dz-button"/>
                </button>
            </div>
        </div>
    )
}

const NftList = ({ accountNfts, accountTokens }) => {
    if (Object.keys(accountNfts).length === 0)
		return <div className="mb-4 text-white">Loading...</div>

	return (
		<div className="p-4 rounded-md text-white bg-color-dark w-full">
			<h3 className="text-lg font-bold">
				<span>NFTs</span> 
			</h3>
            <div className="w-full">
                {
                    accountNfts.nfts.map(data => 
                        <NftItem 
                            key={data.created_timestamp}
                            accountTokens={accountTokens}
                            nft={data} 
                        />
                    )
                }
            </div>
		</div>
	)
}

export default NftList