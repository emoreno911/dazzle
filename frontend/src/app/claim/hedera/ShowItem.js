import { useEffect, useState } from 'react';
import { getTokenInfo, getNftInfo } from '../../../utils/hedera/api';
import {toFixedIfNecessary} from '../../../utils';
import ModalPairWalletClaim from './ModalPairWalletClaim';
import ModalCreateWalletClaim from './ModalCreateWalletClaim';

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
    const image = _metadata.hasOwnProperty('image') ? _metadata.image : "https://res.cloudinary.com/dy3hbcg2h/image/upload/v1652749173/no-image_qrq0kt.png";
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


function ShowItem({ item }) {
    
    const [tokenData, setTokenData] = useState({ symbol: 'HBAR' });
    const {tokenId, amount, sender, isFungible, isClaimed} = item;

    const [disableClaim, setDisableClaim] = useState(false);
    const [wasClaimed, setWasClaimed] = useState(isClaimed !== "0");
    const claimedText = wasClaimed ? "was already Claimed" : "is available for Claim";
    const tId = tokenId.indexOf('#') !== -1 ? tokenId.split('#')[0] : tokenId;
    
    useEffect(() => {
        if (tokenId === "0")
            return;

        if (isFungible === "1")
            getTokenInfo(tokenId).then(response => { setTokenData(response) })  
        else {
            const serial = tokenId.split('#')[1];
            getNftInfo(tId, serial).then(response => { setTokenData(response) })
        } 
            
    }, []);

    return (
        <div className="link-page">
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
                {
                    !wasClaimed && (
                        <>
                            <ModalPairWalletClaim 
                                buttonText={"Connect Wallet and Claim"} 
                                tokenId={tId} 
                                item={item}
                                disableClaim={disableClaim}
                                setDisableClaim={setDisableClaim}
                            />
                            <ModalCreateWalletClaim 
                                buttonText={"Create Wallet and Claim"} 
                                tokenId={tId} 
                                item={item} 
                                disableClaim={disableClaim}
                                setDisableClaim={setDisableClaim}
                            />
                        </>
                    )
                }
            </div>
        </div>
        
        </div>
    )
}

export default ShowItem;