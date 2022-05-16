import { useEffect, useState } from 'react';
import { getTokenInfo, getNftInfo } from '../../utils/api';
import {toFixedIfNecessary} from '../../utils/utilities';

// https://github.com/ed-marquez/hedera-sdk-js/blob/main/examples/create-account.js

function TokenLayout({ tokenId, amount, tokenData }) {
    let _amount = tokenId !== "0" ? amount : toFixedIfNecessary(amount/100000000, 2)
    return (
        <>
            <h4 className="text-xl text-center font-bold text-white mb-6">CLAIM TOKENS</h4>
            <div className="text-center">
                <input 
                    type="number" 
                    value={_amount}
                    readOnly={true}
                    className="bg-transparent text-white text-6xl text-center block border-b-2 w-1/2 mx-auto mb-3 focus:outline-none focus:border-yellow-500" 
                />
                <span className="text-white text-3xl">{tokenData.symbol}</span>
            </div>
        </>
    )
}

function NftLayout({ tokenId, tokenData }) {
    const { token_id, metadata, serial_number } = tokenData;
    
    let _metadata = {};
    try {
        _metadata = JSON.parse(atob(metadata));
    } catch (error) {
        //console.log('fail nft metadata')
    }

    const name = _metadata.hasOwnProperty('name') ? _metadata.name : "";
    const image = _metadata.hasOwnProperty('image') ? _metadata.image : "/img/no-image.png";
    const alt = _metadata.hasOwnProperty('image') ? token_id : "no-image";

    return (
        <>
            <h4 className="text-xl text-center font-bold text-white mb-6">CLAIM NFT</h4>
            <div className="flex w-full max-w-lg mx-auto my-10 pl-2 text-white">
                <div className="">
                    <img className="modalpic rounded-lg mr-5" src={image} alt={alt} /> 
                </div>
                <div className="w-2/3 sm:w-4/5">
                    <div className="mb-2">Token ID: <span className="text-gray-400">{token_id}</span></div>
                    <div className="mb-2">Serial: <span className="text-gray-400">{serial_number}</span></div>
                    <div className="mb-2">name: <span className="text-gray-400">{name}</span></div>
                    <div>Metadata</div>
                    <pre className="overflow-hidden text-gray-400">{metadata}</pre>
                </div>                    
            </div>
        </>
    )
}

// nft http://localhost:3000/#/claim/e1b40394-fbfd-4702-80d6-65db9773304b 1234
// token http://localhost:3000/#/claim/37fb9f8d-e49e-44b2-8351-e56c2ded7dcd 1234
// hbar http://localhost:3000/#/claim/d865027b-9ea1-4c99-9053-0e4da90403b3 12345678

function ShowItem({ item }) {
    const [tokenData, setTokenData] = useState({ symbol: 'HBAR' });
    const {tokenId, amount, sender, isFungible, isClaimed} = item;
    const claimedText = isClaimed === "0" ? "is available for Claim" : "was already Claimed";
    const [tId, serial] = isFungible === "1" ? tokenId : tokenId.split("#");

    useEffect(() => {
        if (tokenId === "0")
            return;

        if (isFungible === "1")
            getTokenInfo(tId).then(response => { setTokenData(response) })  
        else 
            getNftInfo(tId, serial).then(response => { setTokenData(response) })
    }, []);

    return (
        <>
        {
            isFungible === "1" ?
                <TokenLayout tokenId={tId} amount={amount} tokenData={tokenData} /> :
                <NftLayout tokenId={tId} tokenData={tokenData} />
        }
        <div className="my-8">
            <div className="w-full md:w-3/4 max-w-lg mx-auto relative">
                <h4 className='text-center text-gray-400 my-8'>
                    This deposit was created by {sender} and {claimedText}
                </h4>
                <button 
                    type="button" 
                    className="block w-full text-md my-4 px-8 py-2 text-white rounded-md bg-green-500 focus:outline-none"
                    onClick={() => {}}
                >
                    <div>
                        <span className="block text-md">{ "Connect Wallet and Claim" }</span>
                    </div>
                </button>
                <button 
                    type="button" 
                    className="block w-full text-md my-4 px-8 py-2 text-white rounded-md bg-yellow-500 focus:outline-none"
                    onClick={() => {}}
                >
                    <div>
                        <span className="block text-md">{ "Create Wallet and Claim" }</span>
                    </div>
                </button>
            </div>
        </div>
        
        </>
    )
}

export default ShowItem;